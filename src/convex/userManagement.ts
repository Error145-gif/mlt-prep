import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

// Delete a user (admin only)
export const deleteUser = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const admin = await getCurrentUser(ctx);
    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized: Only admins can delete users");
    }

    // Prevent admin from deleting themselves
    if (admin._id === args.userId) {
      throw new Error("Cannot delete your own admin account");
    }

    const userToDelete = await ctx.db.get(args.userId);
    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete user's related data
    const [userProgress, testScores, subscriptions, feedback] = await Promise.all([
      ctx.db
        .query("userProgress")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect(),
      ctx.db
        .query("testScores")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect(),
      ctx.db
        .query("subscriptions")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect(),
      ctx.db
        .query("feedback")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect(),
    ]);

    // Delete all related records
    await Promise.all([
      ...userProgress.map((p) => ctx.db.delete(p._id)),
      ...testScores.map((s) => ctx.db.delete(s._id)),
      ...subscriptions.map((s) => ctx.db.delete(s._id)),
      ...feedback.map((f) => ctx.db.delete(f._id)),
    ]);

    // Finally delete the user
    await ctx.db.delete(args.userId);

    return { success: true, deletedEmail: userToDelete.email };
  },
});
