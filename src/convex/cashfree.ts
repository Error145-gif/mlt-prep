"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

export const createOrder = action({
  args: {
    amount: v.number(),
    currency: v.string(),
    userId: v.string(),
    planName: v.string(),
    duration: v.number(),
  },
  handler: async (_ctx, args): Promise<{
    orderId: string;
    paymentSessionId: string;
    orderStatus: string;
  }> => {
    const clientId = process.env.CASHFREE_CLIENT_ID;
    const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
    const environment = process.env.CASHFREE_ENVIRONMENT || "sandbox";
    
    // Force sandbox for test credentials
    const actualEnvironment = clientId?.startsWith("TEST") ? "sandbox" : environment;
    
    if (!clientId || !clientSecret) {
      console.error("Cashfree credentials missing:", { 
        hasClientId: !!clientId, 
        hasClientSecret: !!clientSecret 
      });
      throw new Error("Cashfree payment gateway is not configured. Please contact support.");
    }

    try {
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const orderRequest = {
        order_id: orderId,
        order_amount: args.amount,
        order_currency: args.currency,
        customer_details: {
          customer_id: args.userId,
          customer_phone: "9999999999", // Will be updated from user profile
        },
        order_meta: {
          return_url: `${process.env.CONVEX_SITE_URL}/payment-status?order_id={order_id}`,
        },
        order_note: `${args.planName} - ${args.duration} days`,
      };

      const apiUrl = actualEnvironment === "production" 
        ? "https://api.cashfree.com/pg/orders"
        : "https://sandbox.cashfree.com/pg/orders";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": clientId,
          "x-client-secret": clientSecret,
          "x-api-version": "2023-08-01",
        },
        body: JSON.stringify(orderRequest),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Cashfree API Error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          clientId: clientId?.substring(0, 10) + "...",
          environment,
          apiUrl
        });
        
        if (response.status === 401) {
          throw new Error("Cashfree authentication failed. Please verify your credentials.");
        } else if (response.status === 400) {
          throw new Error(`Invalid request to Cashfree: ${errorData}`);
        }
        
        throw new Error(`Cashfree API error (${response.status}): ${response.statusText}`);
      }

      const orderData = await response.json();
      console.log("Cashfree order created successfully:", {
        orderId: orderData.order_id,
        status: orderData.order_status,
        hasSessionId: !!orderData.payment_session_id
      });
      
      if (!orderData.payment_session_id) {
        throw new Error("Cashfree did not return a payment session ID");
      }

      return {
        orderId: orderData.order_id,
        paymentSessionId: orderData.payment_session_id,
        orderStatus: orderData.order_status,
      };
    } catch (error: any) {
      console.error("Cashfree order creation error:", error);
      throw new Error(`Failed to create order: ${error.message}`);
    }
  },
});

export const verifyPayment = action({
  args: {
    orderId: v.string(),
    userId: v.string(),
    planName: v.string(),
    amount: v.number(),
    duration: v.number(),
  },
  handler: async (ctx, args): Promise<any> => {
    const clientId = process.env.CASHFREE_CLIENT_ID;
    const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
    const environment = process.env.CASHFREE_ENVIRONMENT || "sandbox";
    
    // Force sandbox for test credentials
    const actualEnvironment = clientId?.startsWith("TEST") ? "sandbox" : environment;
    
    if (!clientId || !clientSecret) {
      console.error("Cashfree credentials missing");
      throw new Error("Payment verification configuration error");
    }

    try {
      const apiUrl = actualEnvironment === "production"
        ? `https://api.cashfree.com/pg/orders/${args.orderId}`
        : `https://sandbox.cashfree.com/pg/orders/${args.orderId}`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "x-client-id": clientId,
          "x-client-secret": clientSecret,
          "x-api-version": "2023-08-01",
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Cashfree verification failed:", errorData);
        throw new Error("Failed to verify payment");
      }

      const orderData = await response.json();
      console.log("Cashfree order status:", orderData.order_status);

      if (orderData.order_status === "PAID") {
        // Activate subscription using cashfreeInternal
        await ctx.runMutation(internal.cashfreeInternal.createSubscription, {
          userId: args.userId,
          planName: args.planName,
          amount: args.amount,
          duration: args.duration,
          paymentId: orderData.cf_payment_id || args.orderId,
          orderId: args.orderId,
        });

        console.log("Payment verified and subscription activated:", args.orderId);
        return { success: true, status: "PAID" };
      } else {
        return { success: false, status: orderData.order_status };
      }
    } catch (error: any) {
      console.error("Payment verification error:", error);
      throw new Error(`Payment verification failed: ${error.message}`);
    }
  },
});