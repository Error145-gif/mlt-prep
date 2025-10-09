import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Internal mutation to create invoice record
export const createInvoice = internalMutation({
  args: {
    userId: v.id("users"),
    subscriptionId: v.id("subscriptions"),
    paymentId: v.string(),
    planName: v.string(),
    amount: v.number(),
    duration: v.number(),
  },
  handler: async (ctx, args) => {
    // Generate unique invoice number
    const timestamp = Date.now();
    const dateStr = new Date(timestamp).toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    const invoiceNumber = `INV-${dateStr}-${randomSuffix}`;

    // Create invoice record
    const invoiceId = await ctx.db.insert("invoices", {
      invoiceNumber,
      userId: args.userId,
      subscriptionId: args.subscriptionId,
      paymentId: args.paymentId,
      planName: args.planName,
      amount: args.amount,
      duration: args.duration,
      issuedDate: timestamp,
      emailSent: false,
    });

    return { invoiceId, invoiceNumber, issuedDate: timestamp };
  },
});

// Internal mutation to update invoice email status
export const updateInvoiceEmailStatus = internalMutation({
  args: {
    invoiceNumber: v.string(),
    emailSent: v.boolean(),
    emailSentAt: v.optional(v.number()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const invoice = await ctx.db
      .query("invoices")
      .withIndex("by_invoice_number", (q) => q.eq("invoiceNumber", args.invoiceNumber))
      .unique();

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const updates: any = {
      emailSent: args.emailSent,
    };

    if (args.emailSentAt) {
      updates.emailSentAt = args.emailSentAt;
    }

    if (args.error) {
      updates.emailError = args.error;
    }

    await ctx.db.patch(invoice._id, updates);

    return { success: true };
  },
});
