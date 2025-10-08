import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

// Cashfree webhook endpoint
http.route({
  path: "/cashfree-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      
      console.log("Cashfree webhook received:", body.type);
      
      // Process webhook based on event type
      if (body.type === "PAYMENT_SUCCESS_WEBHOOK") {
        const orderId = body.data.order.order_id;
        const paymentId = body.data.payment.cf_payment_id;
        
        await ctx.runMutation(internal.cashfreeInternal.updateOrderStatus, {
          orderId,
          status: "success",
          paymentId,
        });
      }
      
      return new Response("Webhook processed", { status: 200 });
    } catch (error) {
      console.error("Webhook processing error:", error);
      return new Response("Webhook error", { status: 500 });
    }
  }),
});

export default http;