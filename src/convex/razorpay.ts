// @ts-nocheck
"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import Razorpay from "razorpay";

export const createOrder = action({
  args: {
    amount: v.number(),
    currency: v.string(),
    receipt: v.string(),
    notes: v.optional(v.object({
      userId: v.string(),
      planName: v.string(),
      duration: v.number(),
    })),
  },
  handler: async (_ctx, args) => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("Razorpay credentials missing");
      throw new Error("Payment gateway configuration error");
    }

    try {
      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const order = await razorpay.orders.create({
        amount: args.amount * 100, // Convert to paise
        currency: args.currency,
        receipt: args.receipt,
        notes: args.notes,
      });

      console.log("Order created successfully:", order.id);
      return order;
    } catch (error: any) {
      console.error("Razorpay order creation error:", error);
      throw new Error(`Failed to create order: ${error.message}`);
    }
  },
});

export const verifyPayment = action({
  args: {
    orderId: v.string(),
    paymentId: v.string(),
    signature: v.string(),
    userId: v.string(),
    planName: v.string(),
    amount: v.number(),
    duration: v.number(),
  },
  handler: async (ctx, args) => {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      console.error("Razorpay secret key missing");
      throw new Error("Payment verification configuration error");
    }

    try {
      const crypto = await import("crypto");
      const hmac = crypto.createHmac("sha256", keySecret);
      hmac.update(`${args.orderId}|${args.paymentId}`);
      const generatedSignature = hmac.digest("hex");

      if (generatedSignature !== args.signature) {
        console.error("Payment signature verification failed");
        throw new Error("Payment verification failed");
      }

      console.log("Payment verified successfully:", args.paymentId);

      // Create subscription
      await ctx.runMutation(internal.razorpayInternal.createSubscription, {
        userId: args.userId,
        planName: args.planName,
        amount: args.amount,
        duration: args.duration,
        paymentId: args.paymentId,
        orderId: args.orderId,
      });

      return { success: true };
    } catch (error: any) {
      console.error("Payment verification error:", error);
      throw new Error(`Payment verification failed: ${error.message}`);
    }
  },
});