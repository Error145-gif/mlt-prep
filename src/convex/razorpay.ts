"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import Razorpay from "razorpay";

// Initialize Razorpay instance
function initializeRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials not configured");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

// Create Razorpay order
export const createOrder = action({
  args: {
    amount: v.number(),
    planName: v.string(),
    customerEmail: v.string(),
    customerName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const razorpay = initializeRazorpay();
      
      // Amount should be in paise (multiply by 100)
      const amountInPaise = args.amount * 100;
      
      const orderOptions = {
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          planName: args.planName,
          customerEmail: args.customerEmail,
        },
      };

      console.log("Creating Razorpay order with options:", orderOptions);
      const order = await razorpay.orders.create(orderOptions);
      
      console.log("Razorpay order created:", order);

      // Store order in database
      await ctx.runMutation(internal.razorpayInternal.storeOrder, {
        orderId: order.id,
        amount: args.amount,
        planName: args.planName,
        customerEmail: args.customerEmail,
      });

      return {
        success: true,
        orderId: order.id,
        amount: amountInPaise,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      };
    } catch (error: any) {
      console.error("Razorpay order creation error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      const errorMessage = error?.message || error?.error?.description || error?.description || JSON.stringify(error);
      throw new Error(`Razorpay order creation failed: ${errorMessage}`);
    }
  },
});

// Verify payment signature
export const verifyPayment = action({
  args: {
    orderId: v.string(),
    paymentId: v.string(),
    signature: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const razorpay = initializeRazorpay();
      const crypto = require("crypto");

      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(`${args.orderId}|${args.paymentId}`)
        .digest("hex");

      const isValid = generatedSignature === args.signature;

      if (isValid) {
        // Update payment status in database
        await ctx.runMutation(internal.razorpayInternal.updatePaymentStatus, {
          orderId: args.orderId,
          paymentId: args.paymentId,
          status: "success",
        });

        return { success: true, verified: true };
      } else {
        throw new Error("Payment signature verification failed");
      }
    } catch (error: any) {
      console.error("Payment verification error:", error);
      const errorMessage = error?.message || error?.error?.description || JSON.stringify(error);
      throw new Error(`Payment verification failed: ${errorMessage}`);
    }
  },
});