import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";

// Store Razorpay order in database
export const storeOrder = internalMutation({
  args: {
    orderId: v.string(),
    amount: v.number(),
    planName: v.string(),
    customerEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User not authenticated");
    }

    await ctx.db.insert("payments", {
      userId: user._id,
      orderId: args.orderId,
      amount: args.amount,
      currency: "INR",
      status: "pending",
      planName: args.planName,
    });

    return { success: true };
  },
});

// Update payment status after verification
export const updatePaymentStatus = internalMutation({
  args: {
    orderId: v.string(),
    paymentId: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Find the payment record
    const payment = await ctx.db
      .query("payments")
      .filter((q) => q.eq(q.field("orderId"), args.orderId))
      .first();

    if (!payment) {
      throw new Error("Payment not found");
    }

    // Update payment status
    await ctx.db.patch(payment._id, {
      status: args.status,
      paymentId: args.paymentId,
    });

    // If payment successful, create subscription
    if (args.status === "success") {
      const planDurations: Record<string, number> = {
        "Monthly Plan": 30,
        "4 Months Plan": 120,
        "Yearly Plan": 365,
      };

      const duration = planDurations[payment.planName || "Monthly Plan"] || 30;
      const startDate = Date.now();
      const endDate = startDate + duration * 24 * 60 * 60 * 1000;

      await ctx.db.insert("subscriptions", {
        userId: user._id,
        planName: payment.planName || "Monthly Plan",
        status: "active",
        startDate,
        endDate,
        amount: payment.amount,
        paymentId: args.paymentId,
      });
    }

    return { success: true };
  },
});
