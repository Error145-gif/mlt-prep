import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { getCurrentUser } from "./users";

// Store order in database
export const storeOrder = internalMutation({
  args: {
    orderId: v.string(),
    paymentSessionId: v.string(),
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
      paymentSessionId: args.paymentSessionId,
      amount: args.amount,
      currency: "INR",
      status: "pending",
      planName: args.planName,
    });
    
    console.log("Order stored in database:", args.orderId);
  },
});

// Update order status
export const updateOrderStatus = internalMutation({
  args: {
    orderId: v.string(),
    status: v.string(),
    paymentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db
      .query("payments")
      .filter((q) => q.eq(q.field("orderId"), args.orderId))
      .first();
    
    if (!payment) {
      console.error("Payment not found for order:", args.orderId);
      return;
    }
    
    await ctx.db.patch(payment._id, {
      status: args.status.toLowerCase(),
      ...(args.paymentId && { paymentId: args.paymentId }),
    });
    
    // If payment is successful, create subscription
    if (args.status === "SUCCESS") {
      const user = await ctx.db.get(payment.userId);
      
      if (user) {
        // Determine subscription duration based on plan
        let duration = 30; // Default 1 month
        if (payment.planName?.includes("4 Months")) {
          duration = 120;
        } else if (payment.planName?.includes("Yearly")) {
          duration = 365;
        }
        
        const startDate = Date.now();
        const endDate = startDate + duration * 24 * 60 * 60 * 1000;
        
        await ctx.db.insert("subscriptions", {
          userId: payment.userId,
          planName: payment.planName || "Monthly Plan",
          status: "active",
          startDate,
          endDate,
          amount: payment.amount,
        });
        
        console.log("Subscription created for user:", user.email);
      }
    }
  },
});
