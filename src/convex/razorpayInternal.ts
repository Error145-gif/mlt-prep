import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const createSubscription = internalMutation({
  args: {
    userId: v.string(),
    planName: v.string(),
    amount: v.number(),
    duration: v.number(),
    paymentId: v.string(),
    orderId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = args.userId as any;
    
    console.log("=== Creating Subscription ===");
    console.log("User ID:", userId);
    console.log("Plan Name:", args.planName);
    console.log("Amount:", args.amount);
    console.log("Duration:", args.duration);
    
    const startDate = Date.now();
    const endDate = startDate + args.duration * 24 * 60 * 60 * 1000;

    // Check if user already has an active subscription
    const existingSubscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    let subscriptionId;

    if (existingSubscription) {
      console.log("Found existing active subscription, updating it");
      // Update existing subscription instead of creating new one
      await ctx.db.patch(existingSubscription._id, {
        planName: args.planName,
        amount: args.amount,
        startDate,
        endDate,
        paymentId: args.paymentId,
      });
      subscriptionId = existingSubscription._id;
      console.log("Subscription updated successfully");
    } else {
      // Create new subscription
      subscriptionId = await ctx.db.insert("subscriptions", {
        userId,
        planName: args.planName,
        amount: args.amount,
        startDate,
        endDate,
        status: "active",
        paymentId: args.paymentId,
      });
      console.log("New subscription created with ID:", subscriptionId);
    }

    // Record the payment for analytics
    await ctx.db.insert("payments", {
      userId,
      subscriptionId,
      amount: args.amount,
      currency: "INR",
      status: "success",
      paymentMethod: "razorpay",
      orderId: args.orderId,
      paymentId: args.paymentId,
      planName: args.planName,
      duration: args.duration,
    });

    console.log("=== Subscription Creation Complete === ");
  },
});