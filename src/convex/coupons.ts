import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query to validate a coupon code
export const validateCoupon = query({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args) => {
    // For now, we'll use hardcoded coupons. You can extend this to use a database table
    const coupons: Record<string, { discount: number; type: "percentage" | "fixed" }> = {
      "WELCOME10": { discount: 10, type: "percentage" },
      "SAVE20": { discount: 20, type: "percentage" },
      "FLAT50": { discount: 50, type: "fixed" },
      "NEWYEAR25": { discount: 25, type: "percentage" },
    };

    const coupon = coupons[args.code.toUpperCase()];
    
    if (!coupon) {
      return { valid: false, message: "Invalid coupon code" };
    }

    return {
      valid: true,
      discount: coupon.discount,
      type: coupon.type,
      message: `Coupon applied! ${coupon.type === "percentage" ? `${coupon.discount}% off` : `₹${coupon.discount} off`}`,
    };
  },
});
