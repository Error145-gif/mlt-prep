import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { getCurrentUser } from "./users";

// Generate unique referral code for user
export const generateReferralCode = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");

    // Generate unique code: USER_ID_TIMESTAMP
    const code = `${user._id.slice(-6).toUpperCase()}_${Date.now().toString(36).toUpperCase()}`;
    
    return {
      code,
      link: `https://mltprep.online/auth?ref=${code}`,
    };
  },
});

// Get user's referral stats
export const getReferralStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");

    // Get wallet
    const wallet = await ctx.db
      .query("starWallets")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    // Get all referrals
    const allReferrals = await ctx.db
      .query("referrals")
      .withIndex("by_referrer", (q) => q.eq("referrerId", user._id))
      .collect();

    const paidReferrals = allReferrals.filter((r) => r.isPaidUser);
    const pendingReferrals = allReferrals.filter((r) => r.status === "pending");

    // Get expiring stars (next 30 days)
    const now = Date.now();
    const thirtyDaysFromNow = now + 30 * 24 * 60 * 60 * 1000;
    
    const expiringStars = await ctx.db
      .query("starTransactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => 
        q.and(
          q.eq(q.field("type"), "earned"),
          q.eq(q.field("isExpired"), false),
          q.lt(q.field("expiryDate"), thirtyDaysFromNow),
          q.gt(q.field("expiryDate"), now)
        )
      )
      .collect();

    const expiringAmount = expiringStars.reduce((sum, t) => sum + t.amount, 0);

    return {
      wallet: wallet || {
        totalStars: 0,
        earnedStars: 0,
        usedStars: 0,
        availableStars: 0,
      },
      totalReferrals: allReferrals.length,
      paidReferrals: paidReferrals.length,
      pendingReferrals: pendingReferrals.length,
      expiringStars: expiringAmount,
      recentReferrals: allReferrals.slice(0, 10).map((r) => ({
        status: r.status,
        signupDate: r.signupDate,
        isPaid: r.isPaidUser,
        starsEarned: r.starsIssued ? 20 : 0,
      })),
    };
  },
});

// Track referral signup
export const trackReferralSignup = internalMutation({
  args: {
    referralCode: v.string(),
    newUserId: v.id("users"),
    ipAddress: v.optional(v.string()),
    deviceFingerprint: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Find referrer by code pattern (extract user ID from code)
    const allUsers = await ctx.db.query("users").collect();
    const referrer = allUsers.find((u) => 
      args.referralCode.startsWith(u._id.slice(-6).toUpperCase())
    );

    if (!referrer) {
      console.log("Invalid referral code:", args.referralCode);
      return { success: false, reason: "Invalid referral code" };
    }

    // Check self-referral
    if (referrer._id === args.newUserId) {
      await ctx.db.insert("referralFraudLogs", {
        userId: args.newUserId,
        fraudType: "self_referral",
        details: "User tried to refer themselves",
        ipAddress: args.ipAddress,
        deviceFingerprint: args.deviceFingerprint,
        actionTaken: "blocked",
      });
      return { success: false, reason: "Self-referral not allowed" };
    }

    // Check duplicate referral
    const existingReferral = await ctx.db
      .query("referrals")
      .withIndex("by_referred", (q) => q.eq("referredUserId", args.newUserId))
      .first();

    if (existingReferral) {
      return { success: false, reason: "User already referred" };
    }

    // Create referral record (pending status)
    await ctx.db.insert("referrals", {
      referrerId: referrer._id,
      referredUserId: args.newUserId,
      referralCode: args.referralCode,
      status: "pending",
      signupDate: Date.now(),
      emailVerified: false,
      isPaidUser: false,
      starsIssued: false,
    });

    return { success: true, referrerId: referrer._id };
  },
});

// Credit stars when referred user makes payment
export const creditReferralStars = internalMutation({
  args: {
    referredUserId: v.id("users"),
    subscriptionId: v.id("subscriptions"),
    planName: v.string(),
    amount: v.number(),
    paymentId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get referral record
    const referral = await ctx.db
      .query("referrals")
      .withIndex("by_referred", (q) => q.eq("referredUserId", args.referredUserId))
      .first();

    if (!referral) {
      console.log("No referral found for user:", args.referredUserId);
      return { success: false };
    }

    if (referral.starsIssued) {
      console.log("Stars already issued for this referral");
      return { success: false };
    }

    // Get settings
    const settings = await ctx.db.query("referralSettings").first();
    const starsToCredit = settings?.starsPerReferral || 20;
    const expiryDays = settings?.starExpiryDays || 90;

    // Update referral status
    await ctx.db.patch(referral._id, {
      status: "qualified",
      isPaidUser: true,
      purchasedPlanName: args.planName,
      amountPaid: args.amount,
      starsIssued: true,
      starsIssuedAt: Date.now(),
      paymentId: args.paymentId,
      subscriptionId: args.subscriptionId,
    });

    // Get or create wallet
    let wallet = await ctx.db
      .query("starWallets")
      .withIndex("by_user", (q) => q.eq("userId", referral.referrerId))
      .first();

    if (!wallet) {
      const walletId = await ctx.db.insert("starWallets", {
        userId: referral.referrerId,
        totalStars: 0,
        earnedStars: 0,
        usedStars: 0,
        availableStars: 0,
        lastUpdated: Date.now(),
      });
      wallet = await ctx.db.get(walletId);
    }

    if (!wallet) throw new Error("Failed to create wallet");

    // Update wallet
    await ctx.db.patch(wallet._id, {
      totalStars: wallet.totalStars + starsToCredit,
      earnedStars: wallet.earnedStars + starsToCredit,
      availableStars: wallet.availableStars + starsToCredit,
      lastUpdated: Date.now(),
    });

    // Create transaction record
    const expiryDate = Date.now() + expiryDays * 24 * 60 * 60 * 1000;
    await ctx.db.insert("starTransactions", {
      userId: referral.referrerId,
      type: "earned",
      amount: starsToCredit,
      referralId: referral._id,
      subscriptionId: args.subscriptionId,
      expiryDate,
      isExpired: false,
      reason: `Referral reward for ${args.planName} purchase`,
    });

    console.log(`Credited ${starsToCredit} stars to user ${referral.referrerId}`);
    return { success: true, starsCredit: starsToCredit };
  },
});

// Use stars for subscription payment
export const useStarsForPayment = mutation({
  args: {
    planAmount: v.number(),
    starsToUse: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");

    // Get settings
    const settings = await ctx.db.query("referralSettings").first();
    const maxUsagePercent = settings?.maxStarsUsagePercent || 50;
    const starValue = settings?.starValueInRupees || 1;

    // Validate usage
    const maxStarsAllowed = Math.floor((args.planAmount * maxUsagePercent) / 100 / starValue);
    if (args.starsToUse > maxStarsAllowed) {
      throw new Error(`Maximum ${maxStarsAllowed} stars can be used for this plan`);
    }

    // Get wallet
    const wallet = await ctx.db
      .query("starWallets")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (!wallet || wallet.availableStars < args.starsToUse) {
      throw new Error("Insufficient stars");
    }

    // Calculate discount
    const discountAmount = args.starsToUse * starValue;
    const finalAmount = args.planAmount - discountAmount;

    return {
      success: true,
      starsUsed: args.starsToUse,
      discountAmount,
      finalAmount,
      remainingStars: wallet.availableStars - args.starsToUse,
    };
  },
});

// Deduct stars after successful payment
export const deductStarsAfterPayment = internalMutation({
  args: {
    userId: v.id("users"),
    starsUsed: v.number(),
    subscriptionId: v.id("subscriptions"),
  },
  handler: async (ctx, args) => {
    const wallet = await ctx.db
      .query("starWallets")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!wallet) throw new Error("Wallet not found");

    await ctx.db.patch(wallet._id, {
      usedStars: wallet.usedStars + args.starsUsed,
      availableStars: wallet.availableStars - args.starsUsed,
      lastUpdated: Date.now(),
    });

    await ctx.db.insert("starTransactions", {
      userId: args.userId,
      type: "used",
      amount: -args.starsUsed,
      subscriptionId: args.subscriptionId,
      isExpired: false,
      reason: "Used for subscription payment",
    });
  },
});

// Reverse stars on refund
export const reverseStarsOnRefund = internalMutation({
  args: {
    subscriptionId: v.id("subscriptions"),
  },
  handler: async (ctx, args) => {
    // Find referral by subscription
    const referral = await ctx.db
      .query("referrals")
      .filter((q) => q.eq(q.field("subscriptionId"), args.subscriptionId))
      .first();

    if (!referral || !referral.starsIssued) return;

    // Get settings
    const settings = await ctx.db.query("referralSettings").first();
    const starsToReverse = settings?.starsPerReferral || 20;

    // Update referral
    await ctx.db.patch(referral._id, {
      status: "cancelled",
      starsIssued: false,
    });

    // Update wallet
    const wallet = await ctx.db
      .query("starWallets")
      .withIndex("by_user", (q) => q.eq("userId", referral.referrerId))
      .first();

    if (wallet) {
      await ctx.db.patch(wallet._id, {
        availableStars: Math.max(0, wallet.availableStars - starsToReverse),
        lastUpdated: Date.now(),
      });

      await ctx.db.insert("starTransactions", {
        userId: referral.referrerId,
        type: "reversed",
        amount: -starsToReverse,
        referralId: referral._id,
        subscriptionId: args.subscriptionId,
        isExpired: false,
        reason: "Refund - stars reversed",
      });
    }
  },
});
