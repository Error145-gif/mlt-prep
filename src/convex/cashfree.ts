"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

// Initialize Cashfree SDK
function initializeCashfree() {
  const { Cashfree } = require("cashfree-pg");
  
  const clientId = process.env.CASHFREE_CLIENT_ID;
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error("Cashfree credentials not configured");
  }
  
  // Determine environment based on client ID prefix
  const environment = clientId.startsWith("TEST") 
    ? "SANDBOX" 
    : "PRODUCTION";
  
  // Set global configuration for v5 SDK
  Cashfree.XClientId = clientId;
  Cashfree.XClientSecret = clientSecret;
  Cashfree.XEnvironment = environment;
  
  console.log(`Cashfree initialized in ${environment} mode`);
  
  return Cashfree;
}

// Create payment order
export const createOrder = action({
  args: {
    planName: v.string(),
    amount: v.number(),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; orderId?: string; paymentSessionId?: string; paymentUrl?: string; error?: string }> => {
    try {
      const Cashfree = initializeCashfree();
      
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const returnUrl = `${process.env.CONVEX_SITE_URL || process.env.SITE_URL}/payment-status`;
      
      const orderRequest: any = {
        order_id: orderId,
        order_amount: args.amount,
        order_currency: "INR",
        customer_details: {
          customer_id: args.customerEmail,
          customer_name: args.customerName,
          customer_email: args.customerEmail,
          customer_phone: args.customerPhone,
        },
        order_meta: {
          return_url: returnUrl,
          notify_url: `${process.env.CONVEX_SITE_URL || process.env.SITE_URL}/cashfree-webhook`,
        },
      };
      
      console.log("Creating Cashfree order:", orderId);
      
      const response: any = await Cashfree.PGCreateOrder("2023-08-01", orderRequest);
      
      if (response.data && response.data.payment_session_id) {
        console.log("Order created successfully:", response.data);
        
        // Store order in database
        await ctx.runMutation(internal.cashfreeInternal.storeOrder, {
          orderId: orderId,
          paymentSessionId: response.data.payment_session_id,
          amount: args.amount,
          planName: args.planName,
          customerEmail: args.customerEmail,
        });
        
        return {
          success: true,
          orderId: orderId,
          paymentSessionId: response.data.payment_session_id,
          paymentUrl: response.data.payment_link,
        };
      } else {
        throw new Error("Invalid response from Cashfree");
      }
    } catch (error: any) {
      console.error("Cashfree order creation error:", error);
      throw new Error(`Cashfree order creation failed: ${error.message}`);
    }
  },
});

// Verify payment status
export const verifyPayment = action({
  args: {
    orderId: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; status?: string; amount?: number }> => {
    try {
      const Cashfree = initializeCashfree();
      
      console.log("Verifying payment for order:", args.orderId);
      
      const response = await Cashfree.PGOrderFetchPayments("2023-08-01", args.orderId);
      
      if (response.data && response.data.length > 0) {
        const payment = response.data[0];
        
        console.log("Payment status:", payment.payment_status);
        
        // Update order status in database
        await ctx.runMutation(internal.cashfreeInternal.updateOrderStatus, {
          orderId: args.orderId,
          status: payment.payment_status,
          paymentId: payment.cf_payment_id,
        });
        
        return {
          success: true,
          status: payment.payment_status,
          amount: payment.payment_amount,
        };
      } else {
        return {
          success: false,
          status: "PENDING",
        };
      }
    } catch (error: any) {
      console.error("Payment verification error:", error);
      throw new Error(`Payment verification failed: ${error.message}`);
    }
  },
});