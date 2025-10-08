import { mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

// Reset all user data (admin only) - removes all users and their related data
export const resetAllUserData = mutation({
  args: {},
  handler: async (ctx) => {
    const admin = await getCurrentUser(ctx);
    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized: Only admins can reset user data");
    }

    // Get all users
    const allUsers = await ctx.db.query("users").collect();
    
    // Track deletion counts
    let deletedCounts = {
      users: 0,
      userProgress: 0,
      testScores: 0,
      testSessions: 0,
      testResults: 0,
      subscriptions: 0,
      payments: 0,
      feedback: 0,
    };

    // Delete all user-related data for each user
    for (const user of allUsers) {
      // Skip the current admin to preserve admin access
      if (user._id === admin._id) {
        continue;
      }

      // Delete user progress
      const userProgress = await ctx.db
        .query("userProgress")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();
      for (const progress of userProgress) {
        await ctx.db.delete(progress._id);
        deletedCounts.userProgress++;
      }

      // Delete test scores
      const testScores = await ctx.db
        .query("testScores")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();
      for (const score of testScores) {
        await ctx.db.delete(score._id);
        deletedCounts.testScores++;
      }

      // Delete test sessions
      const testSessions = await ctx.db
        .query("testSessions")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();
      for (const session of testSessions) {
        await ctx.db.delete(session._id);
        deletedCounts.testSessions++;
      }

      // Delete test results
      const testResults = await ctx.db
        .query("testResults")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();
      for (const result of testResults) {
        await ctx.db.delete(result._id);
        deletedCounts.testResults++;
      }

      // Delete subscriptions
      const subscriptions = await ctx.db
        .query("subscriptions")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();
      for (const subscription of subscriptions) {
        await ctx.db.delete(subscription._id);
        deletedCounts.subscriptions++;
      }

      // Delete payments
      const payments = await ctx.db
        .query("payments")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();
      for (const payment of payments) {
        await ctx.db.delete(payment._id);
        deletedCounts.payments++;
      }

      // Delete feedback
      const feedback = await ctx.db
        .query("feedback")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();
      for (const fb of feedback) {
        await ctx.db.delete(fb._id);
        deletedCounts.feedback++;
      }

      // Finally delete the user
      await ctx.db.delete(user._id);
      deletedCounts.users++;
    }

    return {
      success: true,
      message: "All user data has been reset successfully",
      deletedCounts,
      adminPreserved: admin.email,
    };
  },
});
