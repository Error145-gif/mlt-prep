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
