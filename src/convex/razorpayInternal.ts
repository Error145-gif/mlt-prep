import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { api } from "./_generated/api";

export const createSubscriptionAfterPayment = internalMutation({
  args: {
    razorpayOrderId: v.string(),
    razorpayPaymentId: v.string(),
    planName: v.string(),
    amount: v.number(),
    duration: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const startDate = Date.now();
    const endDate = startDate + args.duration * 24 * 60 * 60 * 1000;

    // Create subscription
    const subscriptionId = await ctx.db.insert("subscriptions", {
      userId: user._id,
      planName: args.planName,
      status: "active",
      startDate,
      endDate,
      amount: args.amount,
      paymentId: args.razorpayPaymentId,
    });

    // Create payment record
    const paymentId = await ctx.db.insert("payments", {
      userId: user._id,
      subscriptionId,
      amount: args.amount,
      currency: "INR",
      status: "success",
      paymentMethod: "razorpay",
      transactionId: args.razorpayPaymentId,
      orderId: args.razorpayOrderId,
      planName: args.planName,
      duration: args.duration,
      paymentId: args.razorpayPaymentId,
    });

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}-${user._id.slice(-6)}`;

    // Create invoice record
    await ctx.db.insert("invoices", {
      invoiceNumber,
      userId: user._id,
      subscriptionId,
      paymentId: args.razorpayPaymentId,
      planName: args.planName,
      amount: args.amount,
      duration: args.duration,
      issuedDate: Date.now(),
      emailSent: false,
    });

    // Schedule invoice email using the public API action
    await ctx.scheduler.runAfter(
      0,
      api.invoices.sendInvoiceEmail,
      {
        userId: user._id,
        invoiceNumber,
        userName: user.name || "Student",
        userEmail: user.email!,
        planName: args.planName,
        amount: args.amount,
        duration: args.duration,
        transactionId: args.razorpayPaymentId,
        issuedDate: Date.now(),
      }
    );

    return { subscriptionId, paymentId };
  },
});