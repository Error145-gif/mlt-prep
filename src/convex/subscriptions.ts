import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get all subscriptions
export const getAllSubscriptions = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    let subscriptions;

    if (args.status) {
      subscriptions = await ctx.db
        .query("subscriptions")
        .withIndex("by_status", (q) => q.eq("status", args.status as any))
        .collect();
    } else {
      subscriptions = await ctx.db.query("subscriptions").collect();
    }

    // Enrich with user info
    const enrichedSubs = await Promise.all(
      subscriptions.map(async (sub) => {
        const subUser = await ctx.db.get(sub.userId);
        return {
          ...sub,
          userName: subUser?.name || "Unknown",
          userEmail: subUser?.email || "Unknown",
        };
      })
    );

    return enrichedSubs;
  },
});

// Get payment history
export const getPaymentHistory = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    let payments;

    if (args.userId) {
      payments = await ctx.db
        .query("payments")
        .withIndex("by_user", (q) => q.eq("userId", args.userId!))
        .collect();
    } else {
      payments = await ctx.db.query("payments").collect();
    }

    // Enrich with user info
    const enrichedPayments = await Promise.all(
      payments.map(async (payment) => {
        const paymentUser = await ctx.db.get(payment.userId);
        return {
          ...payment,
          userName: paymentUser?.name || "Unknown",
          userEmail: paymentUser?.email || "Unknown",
        };
      })
    );

    return enrichedPayments;
  },
});

// Create a new subscription for a user
export const createSubscription = mutation({
  args: {
    planName: v.string(),
    duration: v.number(), // in days
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    const startDate = Date.now();
    const endDate = startDate + args.duration * 24 * 60 * 60 * 1000;

    // Check if user already has an active PAID subscription
    const existingSub = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    // Allow upgrading from free trial to paid subscription
    if (existingSub && existingSub.amount > 0) {
      throw new Error("You already have an active paid subscription");
    }

    // If upgrading from free trial, deactivate the trial
    if (existingSub && existingSub.amount === 0) {
      await ctx.db.patch(existingSub._id, {
        status: "cancelled",
      });
    }

    const subscriptionId = await ctx.db.insert("subscriptions", {
      userId: user._id,
      planName: args.planName,
      status: "active",
      startDate,
      endDate,
      amount: args.amount,
    });

    // Create payment record
    await ctx.db.insert("payments", {
      userId: user._id,
      subscriptionId,
      amount: args.amount,
      currency: "INR",
      status: "success",
    });

    return subscriptionId;
  },
});

// Start free trial
export const startFreeTrial = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Check if user already had a trial
    const existingTrial = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("planName"), "7-Day Free Trial"))
      .first();

    if (existingTrial) {
      throw new Error("You have already used your free trial");
    }

    const startDate = Date.now();
    const endDate = startDate + 7 * 24 * 60 * 60 * 1000; // 7 days

    await ctx.db.insert("subscriptions", {
      userId: user._id,
      planName: "7-Day Free Trial",
      status: "active",
      startDate,
      endDate,
      amount: 0,
    });

    return { success: true };
  },
});

// Manual subscription activation by admin
export const manualActivateSubscription = mutation({
  args: {
    email: v.string(),
    planName: v.string(),
    duration: v.number(), // in days
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const admin = await getCurrentUser(ctx);
    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const email = args.email.trim();
    
    // Try exact match first
    let user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();

    // If not found, try lowercase match as fallback
    if (!user) {
       user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email.toLowerCase()))
      .first();
    }

    if (!user) {
      throw new Error(`User not found with email: ${email}`);
    }

    // Check for existing subscription (active or otherwise)
    const existingSub = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    let startDate = Date.now();
    let endDate = startDate + args.duration * 24 * 60 * 60 * 1000;

    if (existingSub && existingSub.status === "active") {
      // If subscription is active, extend from current end date
      startDate = existingSub.startDate;
      endDate = existingSub.endDate + args.duration * 24 * 60 * 60 * 1000;
      
      // Update existing subscription by extending it
      await ctx.db.patch(existingSub._id, {
        planName: args.planName,
        status: "active",
        endDate,
        amount: existingSub.amount + args.amount, // Add to total amount paid
      });
    } else if (existingSub) {
      // If subscription exists but is not active, reactivate with new dates
      await ctx.db.patch(existingSub._id, {
        planName: args.planName,
        status: "active",
        startDate,
        endDate,
        amount: args.amount,
      });
    } else {
      // Create new subscription
      await ctx.db.insert("subscriptions", {
        userId: user._id,
        planName: args.planName,
        status: "active",
        startDate,
        endDate,
        amount: args.amount,
      });
    }

    // Log a manual payment record for tracking
    await ctx.db.insert("payments", {
      userId: user._id,
      amount: args.amount,
      currency: "INR",
      status: "success",
      paymentMethod: "manual_admin",
      planName: args.planName,
      duration: args.duration,
      errorMessage: "Manual activation by admin",
    });

    // Return detailed info for verification
    return { 
      success: true, 
      userId: user._id,
      email: user.email,
      subscriptionActive: true,
      endDate,
      amount: args.amount
    };
  },
});

// Debug query to check user subscription status
export const debugUserSubscription = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await getCurrentUser(ctx);
    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const email = args.email.trim().toLowerCase();
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();

    if (!user) {
      return { error: "User not found" };
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    return {
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      subscription: subscription || null,
      currentTime: Date.now(),
      isExpired: subscription ? subscription.endDate < Date.now() : null,
    };
  },
});