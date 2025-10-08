"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";

// Helper function to initialize and configure Cashfree SDK
function initializeCashfree() {
  try {
    const { Cashfree } = require("cashfree-pg");
    
    // Validate environment variables
    if (!process.env.CASHFREE_CLIENT_ID || !process.env.CASHFREE_CLIENT_SECRET) {
      throw new Error("Cashfree credentials not configured. Please add CASHFREE_CLIENT_ID and CASHFREE_CLIENT_SECRET in API Keys tab.");
    }
    
    if (!process.env.CONVEX_SITE_URL && !process.env.SITE_URL) {
      throw new Error("Site URL not configured. Please add CONVEX_SITE_URL or SITE_URL in API Keys tab.");
    }
    
    // Configure Cashfree with environment variables
    Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
    Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET;
    
    // Set environment based on Client ID (TEST prefix = sandbox, otherwise production)
    const isSandbox = process.env.CASHFREE_CLIENT_ID.startsWith("TEST");
    Cashfree.XEnvironment = isSandbox ? Cashfree.Environment.SANDBOX : Cashfree.Environment.PRODUCTION;
    
    console.log("Cashfree initialized successfully:", {
      clientIdPrefix: process.env.CASHFREE_CLIENT_ID.substring(0, 4),
      hasSecret: !!process.env.CASHFREE_CLIENT_SECRET,
      environment: isSandbox ? "SANDBOX" : "PRODUCTION",
      siteUrl: process.env.CONVEX_SITE_URL || process.env.SITE_URL
    });
    
    return Cashfree;
  } catch (error: any) {
    console.error("Failed to initialize Cashfree SDK:", error);
    throw new Error(`Cashfree SDK initialization failed: ${error.message}`);
  }
}

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
    try {
      const Cashfree = initializeCashfree();
      
      const uniqueOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const siteUrl = process.env.CONVEX_SITE_URL || process.env.SITE_URL;
      
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
          return_url: `${siteUrl}/payment-status?order_id={order_id}`,
          notify_url: `${siteUrl}/api/cashfree/webhook`,
        },
        order_note: args.planName ? `Subscription: ${args.planName}` : "MLT Learning Subscription",
      };

      console.log("Creating order with request:", JSON.stringify(request, null, 2));

      const response = await Cashfree.PGCreateOrder("2023-08-01", request);

      console.log("Cashfree response:", JSON.stringify(response.data, null, 2));

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
    try {
      const Cashfree = initializeCashfree();
      
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