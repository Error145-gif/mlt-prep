import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";
import { internal, api } from "./_generated/api";

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

    // If payment successful, create subscription and generate invoice
    if (args.status === "success") {
      const planDurations: Record<string, number> = {
        "Monthly Plan": 30,
        "4 Months Plan": 120,
        "Yearly Plan": 365,
      };

      const duration = planDurations[payment.planName || "Monthly Plan"] || 30;
      const startDate = Date.now();
      const endDate = startDate + duration * 24 * 60 * 60 * 1000;

      // Create subscription
      const subscriptionId = await ctx.db.insert("subscriptions", {
        userId: user._id,
        planName: payment.planName || "Monthly Plan",
        status: "active",
        startDate,
        endDate,
        amount: payment.amount,
        paymentId: args.paymentId,
      });

      // Generate invoice and send email
      try {
        const invoiceData = await ctx.runMutation(internal.invoicesInternal.createInvoice, {
          userId: user._id,
          subscriptionId,
          paymentId: args.paymentId,
          planName: payment.planName || "Monthly Plan",
          amount: payment.amount,
          duration,
        });

        // Schedule email sending (non-blocking) - using api instead of internal for actions
        await ctx.scheduler.runAfter(
          0,
          api.invoices.sendInvoiceEmail,
          {
            userId: user._id,
            invoiceNumber: invoiceData.invoiceNumber,
            userName: user.name || "Valued Customer",
            userEmail: user.email || "",
            planName: payment.planName || "Monthly Plan",
            amount: payment.amount,
            duration,
            transactionId: args.paymentId,
            issuedDate: invoiceData.issuedDate,
          },
        );

        console.log(`Invoice ${invoiceData.invoiceNumber} created and email scheduled for user ${user.email}`);
      } catch (error) {
        console.error("Failed to generate invoice or send email:", error);
        // Don't fail the payment if invoice generation fails
      }
    }

    return { success: true };
  },
});