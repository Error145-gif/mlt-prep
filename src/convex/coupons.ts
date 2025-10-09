import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Query to validate a coupon code
export const validateCoupon = query({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const coupon = await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase()))
      .first();

    if (!coupon) {
      return { valid: false, message: "Invalid coupon code" };
    }

    if (!coupon.isActive) {
      return { valid: false, message: "This coupon is no longer active" };
    }

    if (coupon.expiryDate && coupon.expiryDate < Date.now()) {
      return { valid: false, message: "This coupon has expired" };
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, message: "This coupon has reached its usage limit" };
    }

    return {
      valid: true,
      discount: coupon.discountValue,
      type: coupon.discountType,
      couponId: coupon._id,
      message: `Coupon applied! ${coupon.discountType === "percentage" ? `${coupon.discountValue}% off` : `₹${coupon.discountValue} off`}`,
    };
  },
});

// Get all coupons (admin only)
export const getAllCoupons = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    return await ctx.db.query("coupons").order("desc").collect();
  },
});

// Create a new coupon (admin only)
export const createCoupon = mutation({
  args: {
    code: v.string(),
    discountType: v.union(v.literal("percentage"), v.literal("fixed")),
    discountValue: v.number(),
    usageLimit: v.optional(v.number()),
    expiryDate: v.optional(v.number()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    // Check if coupon code already exists
    const existing = await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase()))
      .first();

    if (existing) {
      throw new Error("Coupon code already exists");
    }

    // Validate discount value
    if (args.discountType === "percentage" && (args.discountValue < 1 || args.discountValue > 100)) {
      throw new Error("Percentage discount must be between 1 and 100");
    }

    if (args.discountValue <= 0) {
      throw new Error("Discount value must be greater than 0");
    }

    return await ctx.db.insert("coupons", {
      code: args.code.toUpperCase(),
      discountType: args.discountType,
      discountValue: args.discountValue,
      isActive: true,
      usageLimit: args.usageLimit,
      usageCount: 0,
      expiryDate: args.expiryDate,
      createdBy: user._id,
      description: args.description,
    });
  },
});

// Update coupon (admin only)
export const updateCoupon = mutation({
  args: {
    couponId: v.id("coupons"),
    isActive: v.optional(v.boolean()),
    usageLimit: v.optional(v.number()),
    expiryDate: v.optional(v.number()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    const updates: any = {};
    if (args.isActive !== undefined) updates.isActive = args.isActive;
    if (args.usageLimit !== undefined) updates.usageLimit = args.usageLimit;
    if (args.expiryDate !== undefined) updates.expiryDate = args.expiryDate;
    if (args.description !== undefined) updates.description = args.description;

    await ctx.db.patch(args.couponId, updates);
  },
});

// Delete coupon (admin only)
export const deleteCoupon = mutation({
  args: {
    couponId: v.id("coupons"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    await ctx.db.delete(args.couponId);
  },
});

// Track coupon usage
export const trackCouponUsage = mutation({
  args: {
    couponId: v.id("coupons"),
    userId: v.id("users"),
    orderId: v.optional(v.string()),
    discountAmount: v.number(),
  },
  handler: async (ctx, args) => {
    // Increment usage count
    const coupon = await ctx.db.get(args.couponId);
    if (coupon) {
      await ctx.db.patch(args.couponId, {
        usageCount: coupon.usageCount + 1,
      });
    }

    // Record usage
    await ctx.db.insert("couponUsage", {
      couponId: args.couponId,
      userId: args.userId,
      orderId: args.orderId,
      discountAmount: args.discountAmount,
      usedAt: Date.now(),
    });
  },
});

// Get coupon usage statistics (admin only)
export const getCouponStats = query({
  args: {
    couponId: v.id("coupons"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    const usages = await ctx.db
      .query("couponUsage")
      .withIndex("by_coupon", (q) => q.eq("couponId", args.couponId))
      .collect();

    const totalDiscount = usages.reduce((sum, usage) => sum + usage.discountAmount, 0);

    return {
      totalUsages: usages.length,
      totalDiscount,
      recentUsages: usages.slice(0, 10),
    };
  },
});