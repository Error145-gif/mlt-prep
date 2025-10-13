"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

// Create Razorpay order
export const createOrder = action({
  args: {
    amount: v.number(),
    planName: v.string(),
    duration: v.number(),
  },
  handler: async (ctx, args) => {
    const Razorpay = (await import("razorpay")).default;
    
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    try {
      // Validate environment variables
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.error("Missing Razorpay credentials");
        return {
          success: false,
          error: "Razorpay credentials not configured",
        };
      }

      console.log("Creating Razorpay order:", {
        amount: args.amount * 100,
        currency: "INR",
        planName: args.planName,
      });

      const order = await razorpay.orders.create({
        amount: args.amount * 100, // Convert to paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          planName: args.planName,
          duration: args.duration.toString(),
        },
      });

      console.log("Razorpay order created successfully:", order.id);

      return {
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      };
    } catch (error: any) {
      console.error("Razorpay order creation error:", {
        message: error.message,
        description: error.error?.description,
        code: error.error?.code,
        statusCode: error.statusCode,
        fullError: JSON.stringify(error, null, 2),
      });
      
      return {
        success: false,
        error: error.error?.description || error.message || "Failed to create order",
      };
    }
  },
});

// Verify payment signature
export const verifyPayment = action({
  args: {
    razorpayOrderId: v.string(),
    razorpayPaymentId: v.string(),
    razorpaySignature: v.string(),
    planName: v.string(),
    amount: v.number(),
    duration: v.number(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; subscriptionId?: any; error?: string }> => {
    const crypto = await import("crypto");
    
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${args.razorpayOrderId}|${args.razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== args.razorpaySignature) {
      return { success: false, error: "Invalid payment signature" };
    }

    try {
      // Create subscription and payment records
      const result: { subscriptionId: any; paymentId: any } = await ctx.runMutation(internal.razorpayInternal.createSubscriptionAfterPayment, {
        razorpayOrderId: args.razorpayOrderId,
        razorpayPaymentId: args.razorpayPaymentId,
        planName: args.planName,
        amount: args.amount,
        duration: args.duration,
      });

      return { success: true, subscriptionId: result.subscriptionId };
    } catch (error: any) {
      console.error("Payment verification error:", error);
      return { success: false, error: error.message };
    }
  },
});