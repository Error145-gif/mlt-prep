import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const createSubscription = internalMutation({
  // Fix: avoid deep type instantiation error during Vercel build
  args: v.any(),
  handler: async (ctx, args) => {
    const userId = args.userId as any;
    
    console.log("=== Creating Cashfree Subscription ===");
    console.log("User ID:", userId);
    console.log("Plan Name:", args.planName);
    console.log("Amount:", args.amount);
    console.log("Duration:", args.duration);
    console.log("Order ID:", args.orderId);
    
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
      console.log("Found existing active subscription:", existingSubscription._id);
      console.log("Previous Plan:", existingSubscription.planName);
      
      // Update the existing subscription
      await ctx.db.patch(existingSubscription._id, {
        planName: args.planName,
        amount: args.amount,
        startDate,
        endDate,
        paymentId: args.paymentId,
        status: "active", // Re-affirm status
      });
      subscriptionId = existingSubscription._id;
      console.log("Subscription updated successfully");
    } else {
      // Check if there are any other subscriptions (expired/cancelled) to log
      const anySub = await ctx.db
        .query("subscriptions")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .first();
        
      if (anySub) {
        console.log("Found inactive subscription:", anySub._id, anySub.status);
      }

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
    // Check if payment already exists to prevent duplicates
    const existingPayment = await ctx.db
      .query("payments")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("orderId"), args.orderId))
      .first();

    if (!existingPayment) {
      await ctx.db.insert("payments", {
        userId,
        subscriptionId,
        amount: args.amount,
        currency: "INR",
        status: "success",
        paymentMethod: "cashfree",
        orderId: args.orderId,
        paymentId: args.paymentId,
        planName: args.planName,
        duration: args.duration,
      });
      console.log("Payment record created");
    } else {
      console.log("Payment record already exists for order:", args.orderId);
    }

    console.log("=== Cashfree Subscription Creation Complete ===");
    return subscriptionId;
  },
});