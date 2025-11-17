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
    
    const startDate = Date.now();
    const endDate = startDate + args.duration * 24 * 60 * 60 * 1000;

    // Check if user already has an active subscription
    const existingSubscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    if (existingSubscription) {
      console.log("Found existing active subscription, updating it");
      await ctx.db.patch(existingSubscription._id, {
        planName: args.planName,
        amount: args.amount,
        startDate,
        endDate,
        paymentId: args.paymentId,
      });
      console.log("Subscription updated successfully");
    } else {
      const subscriptionId = await ctx.db.insert("subscriptions", {
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

    console.log("=== Cashfree Subscription Creation Complete ===");
  },
});
