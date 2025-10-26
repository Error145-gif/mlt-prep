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
    
    const startDate = Date.now();
    const endDate = startDate + args.duration * 24 * 60 * 60 * 1000;

    await ctx.db.insert("subscriptions", {
      userId,
      planName: args.planName,
      amount: args.amount,
      startDate,
      endDate,
      status: "active",
      paymentId: args.paymentId,
    });

    console.log(`Subscription created for user ${userId}`);
  },
});