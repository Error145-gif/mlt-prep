"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";

// Create a Cashfree order and return payment session ID
export const createOrder = action({
  args: {
    orderAmount: v.number(),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    planName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Import Cashfree inside the handler
    const { Cashfree } = require("cashfree-pg");
    
    // Configure Cashfree with environment variables
    Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
    Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET;
    Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

    const uniqueOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const request = {
      order_amount: args.orderAmount,
      order_currency: "INR",
      order_id: uniqueOrderId,
      customer_details: {
        customer_id: args.customerEmail,
        customer_phone: args.customerPhone,
        customer_name: args.customerName,
        customer_email: args.customerEmail,
      },
      order_meta: {
        return_url: `${process.env.CONVEX_SITE_URL}/payment-status?order_id={order_id}`,
        notify_url: `${process.env.CONVEX_SITE_URL}/api/cashfree/webhook`,
      },
      order_note: args.planName ? `Subscription: ${args.planName}` : "MLT Learning Subscription",
    };

    try {
      const response = await Cashfree.PGCreateOrder("2023-08-01", request);

      if (response && response.data && response.data.payment_session_id) {
        console.log("Order created successfully:", response.data);
        return {
          success: true,
          paymentSessionId: response.data.payment_session_id,
          orderId: response.data.order_id,
        };
      } else {
        console.error("Failed to get payment_session_id from Cashfree:", response);
        throw new Error("Failed to create Cashfree order session.");
      }
    } catch (error: any) {
      console.error("Error creating Cashfree order:", error.response ? error.response.data : error);
      throw new Error(`Cashfree order creation failed: ${error.message}`);
    }
  },
});

// Verify payment status
export const verifyPayment = action({
  args: {
    orderId: v.string(),
  },
  handler: async (ctx, args) => {
    // Import Cashfree inside the handler
    const { Cashfree } = require("cashfree-pg");
    
    // Configure Cashfree with environment variables
    Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
    Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET;
    Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;
    
    try {
      const response = await Cashfree.PGFetchOrder("2023-08-01", args.orderId);

      if (response && response.data) {
        console.log("Payment status:", response.data);
        return {
          success: true,
          status: response.data.order_status,
          amount: response.data.order_amount,
          currency: response.data.order_currency,
          paymentDetails: response.data,
        };
      } else {
        console.error("Failed to fetch payment details for order:", args.orderId);
        throw new Error("Failed to verify Cashfree payment.");
      }
    } catch (error: any) {
      console.error("Error verifying Cashfree payment:", error.response ? error.response.data : error);
      throw new Error(`Cashfree payment verification failed: ${error.message}`);
    }
  },
});