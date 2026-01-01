import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get referral overview stats
export const getReferralOverview = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") throw new Error("Unauthorized");

    const allReferrals = await ctx.db.query("referrals").collect();
    const allWallets = await ctx.db.query("starWallets").collect();

    const totalLinksGenerated = new Set(allReferrals.map((r) => r.referrerId)).size;
    const totalUsersJoined = allReferrals.length;
    const totalPaidUsers = allReferrals.filter((r) => r.isPaidUser).length;
    const totalStarsIssued = allReferrals.filter((r) => r.starsIssued).length * 20;
    const totalStarsRedeemed = allWallets.reduce((sum, w) => sum + w.usedStars, 0);
    const totalRevenue = allReferrals
      .filter((r) => r.isPaidUser)
      .reduce((sum, r) => sum + (r.amountPaid || 0), 0);

    return {
      totalLinksGenerated,
      totalUsersJoined,
      totalPaidUsers,
      totalStarsIssued,
      totalStarsRedeemed,
      totalRevenue,
      conversionRate: totalUsersJoined > 0 
        ? ((totalPaidUsers / totalUsersJoined) * 100).toFixed(2) 
        : "0",
    };
  },
});

// Get all referred users with details
export const getAllReferredUsers = query({
  args: {
    status: v.optional(v.string()),
    referrerEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") throw new Error("Unauthorized");

    let referrals = await ctx.db.query("referrals").collect();

    // Filter by status
    if (args.status && args.status !== "all") {
      referrals = referrals.filter((r) => r.status === args.status);
    }

    // Enrich with user data
    const enrichedReferrals = await Promise.all(
      referrals.map(async (ref) => {
        const referrer = await ctx.db.get(ref.referrerId);
        const referred = await ctx.db.get(ref.referredUserId);

        return {
          ...ref,
          referrerName: referrer?.name || "Unknown",
          referrerEmail: referrer?.email || "Unknown",
          referredName: referred?.name || "Unknown",
          referredEmail: referred?.email || "Unknown",
        };
      })
    );

    // Filter by referrer email if provided
    if (args.referrerEmail) {
      return enrichedReferrals.filter((r) => 
        r.referrerEmail.toLowerCase().includes(args.referrerEmail!.toLowerCase())
      );
    }

    return enrichedReferrals;
  },
});

// Get referrer-wise breakdown
export const getReferrerBreakdown = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const admin = await getCurrentUser(ctx);
    if (!admin || admin.role !== "admin") throw new Error("Unauthorized");

    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const referrals = await ctx.db
      .query("referrals")
      .withIndex("by_referrer", (q) => q.eq("referrerId", args.userId))
      .collect();

    const wallet = await ctx.db
      .query("starWallets")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    const paidReferrals = referrals.filter((r) => r.isPaidUser);

    return {
      user: {
        name: user.name,
        email: user.email,
      },
      referralCode: `${args.userId.slice(-6).toUpperCase()}_*`,
      totalReferred: referrals.length,
      totalPaidReferrals: paidReferrals.length,
      totalStarsEarned: wallet?.earnedStars || 0,
      totalStarsUsed: wallet?.usedStars || 0,
      availableStars: wallet?.availableStars || 0,
      referrals: referrals.map((r) => ({
        status: r.status,
        signupDate: r.signupDate,
        isPaid: r.isPaidUser,
        amount: r.amountPaid,
        starsIssued: r.starsIssued,
      })),
    };
  },
});

// Admin: Manually approve/reject referral
export const updateReferralStatus = mutation({
  args: {
    referralId: v.id("referrals"),
    status: v.union(v.literal("qualified"), v.literal("rejected")),
    adminNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const admin = await getCurrentUser(ctx);
    if (!admin || admin.role !== "admin") throw new Error("Unauthorized");

    await ctx.db.patch(args.referralId, {
      status: args.status,
      adminNote: args.adminNote,
      rejectedBy: args.status === "rejected" ? admin._id : undefined,
      rejectedAt: args.status === "rejected" ? Date.now() : undefined,
    });

    return { success: true };
  },
});

// Admin: Manually add/deduct stars
export const manualStarAdjustment = mutation({
  args: {
    userId: v.id("users"),
    amount: v.number(), // Positive to add, negative to deduct
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await getCurrentUser(ctx);
    if (!admin || admin.role !== "admin") throw new Error("Unauthorized");

    let wallet = await ctx.db
      .query("starWallets")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!wallet) {
      const walletId = await ctx.db.insert("starWallets", {
        userId: args.userId,
        totalStars: 0,
        earnedStars: 0,
        usedStars: 0,
        availableStars: 0,
        lastUpdated: Date.now(),
      });
      wallet = await ctx.db.get(walletId);
    }

    if (!wallet) throw new Error("Failed to create wallet");

    const newAvailable = wallet.availableStars + args.amount;
    if (newAvailable < 0) throw new Error("Cannot deduct more than available stars");

    await ctx.db.patch(wallet._id, {
      totalStars: wallet.totalStars + args.amount,
      availableStars: newAvailable,
      lastUpdated: Date.now(),
    });

    await ctx.db.insert("starTransactions", {
      userId: args.userId,
      type: args.amount > 0 ? "admin_credit" : "admin_debit",
      amount: args.amount,
      isExpired: false,
      reason: args.reason,
      adminId: admin._id,
    });

    return { success: true, newBalance: newAvailable };
  },
});

// Get/Update referral settings
export const getReferralSettings = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") throw new Error("Unauthorized");

    const settings = await ctx.db.query("referralSettings").first();
    return settings || {
      starValueInRupees: 1,
      starsPerReferral: 20,
      maxStarsUsagePercent: 50,
      starExpiryDays: 90,
      isReferralEnabled: true,
      allowCouponWithStars: false,
      minPurchaseForReferral: 0,
    };
  },
});

export const updateReferralSettings = mutation({
  args: {
    starValueInRupees: v.optional(v.number()),
    starsPerReferral: v.optional(v.number()),
    maxStarsUsagePercent: v.optional(v.number()),
    starExpiryDays: v.optional(v.number()),
    isReferralEnabled: v.optional(v.boolean()),
    allowCouponWithStars: v.optional(v.boolean()),
    minPurchaseForReferral: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const admin = await getCurrentUser(ctx);
    if (!admin || admin.role !== "admin") throw new Error("Unauthorized");

    const existing = await ctx.db.query("referralSettings").first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("referralSettings", {
        starValueInRupees: args.starValueInRupees || 1,
        starsPerReferral: args.starsPerReferral || 20,
        maxStarsUsagePercent: args.maxStarsUsagePercent || 50,
        starExpiryDays: args.starExpiryDays || 90,
        isReferralEnabled: args.isReferralEnabled ?? true,
        allowCouponWithStars: args.allowCouponWithStars ?? false,
        minPurchaseForReferral: args.minPurchaseForReferral || 0,
      });
    }

    return { success: true };
  },
});

// Get fraud logs
export const getFraudLogs = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") throw new Error("Unauthorized");

    const logs = await ctx.db.query("referralFraudLogs").collect();

    const enriched = await Promise.all(
      logs.map(async (log) => {
        const logUser = await ctx.db.get(log.userId);
        return {
          ...log,
          userName: logUser?.name || "Unknown",
          userEmail: logUser?.email || "Unknown",
        };
      })
    );

    return enriched;
  },
});
