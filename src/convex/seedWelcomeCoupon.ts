import { mutation } from "./_generated/server";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", "WELCOME1"))
      .first();

    if (existing) {
      // Ensure it gives 98 off (99 - 98 = 1)
      if (existing.discountValue !== 98) {
         await ctx.db.patch(existing._id, {
            discountValue: 98,
            discountType: "fixed",
            description: "Welcome offer: Monthly plan for ₹1",
            isActive: true
         });
         return "Updated WELCOME1 coupon to give ₹98 discount (Price: ₹1)";
      }
      return "WELCOME1 coupon already exists and is correct";
    }

    // Create if not exists
    // We need a user ID for 'createdBy'. We'll try to find an admin or just use the first user.
    const admin = await ctx.db.query("users").filter(q => q.eq(q.field("role"), "admin")).first();
    const userId = admin ? admin._id : (await ctx.db.query("users").first())?._id;

    if (!userId) return "No user found to set as creator (need at least one user in DB)";

    await ctx.db.insert("coupons", {
      code: "WELCOME1",
      discountType: "fixed",
      discountValue: 98, // 99 - 98 = 1
      isActive: true,
      usageCount: 0,
      createdBy: userId,
      description: "Welcome offer: Monthly plan for ₹1",
    });

    return "Created WELCOME1 coupon";
  },
});
