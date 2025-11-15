"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";

export const createOrder = action({
  args: {
    amount: v.number(),
    currency: v.string(),
    userId: v.string(),
    planName: v.string(),
    duration: v.number(),
  },
  handler: async (_ctx, args) => {
    const clientId = process.env.CASHFREE_CLIENT_ID;
    const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
    const environment = process.env.CASHFREE_ENVIRONMENT || "sandbox";

    if (!clientId || !clientSecret) {
      console.error("Cashfree credentials missing");
      throw new Error("Payment gateway configuration error");
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

      const apiUrl = environment === "production" 
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
        console.error("Cashfree order creation failed:", errorData);
        throw new Error(`Failed to create order: ${response.statusText}`);
      }

      const orderData = await response.json();
      console.log("Cashfree order created successfully:", orderData.order_id);

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
  handler: async (_ctx, args) => {
    const clientId = process.env.CASHFREE_CLIENT_ID;
    const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
    const environment = process.env.CASHFREE_ENVIRONMENT || "sandbox";

    if (!clientId || !clientSecret) {
      console.error("Cashfree credentials missing");
      throw new Error("Payment verification configuration error");
    }

    try {
      const apiUrl = environment === "production"
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
        throw new Error("Failed to verify payment");
      }

      const orderData = await response.json();

      if (orderData.order_status === "PAID") {
        console.log("Payment verified successfully:", args.orderId);
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