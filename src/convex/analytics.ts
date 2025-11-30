import { v } from "convex/values";
import { query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Dashboard stats
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const allQuestions = await ctx.db.query("questions").collect();
    const allTestSets = await ctx.db.query("testSets").collect();
    const allUsers = await ctx.db.query("users").collect();
    const allSubscriptions = await ctx.db.query("subscriptions").collect();

    // Calculate stats
    const approvedQuestions = allQuestions.filter((q) => q.status === "approved").length;
    const pendingQuestions = allQuestions.filter((q) => q.status === "pending" || !q.status).length; // Treat undefined as pending or handle accordingly
    
    const stats = {
      totalQuestions: allQuestions.length,
      approvedQuestions,
      pendingQuestions,
      totalTestSets: allTestSets.length,
      activeTestSets: allTestSets.filter((t) => t.isActive).length,
      totalUsers: allUsers.length,
      activeSubscriptions: allSubscriptions.filter((s) => s.status === "active").length,
      totalRevenue: allSubscriptions.reduce((acc, curr) => acc + (curr.amount || 0), 0),
      
      // Detailed question stats
      questionsBySource: {
        manual: allQuestions.filter(q => q.source === "manual").length,
        ai: allQuestions.filter(q => q.source === "ai").length,
        pyq: allQuestions.filter(q => q.source === "pyq").length,
      },
      
      questionsByDifficulty: {
        easy: allQuestions.filter(q => q.difficulty === "easy").length,
        medium: allQuestions.filter(q => q.difficulty === "medium").length,
        hard: allQuestions.filter(q => q.difficulty === "hard").length,
      },

      questionsByStatus: {
        approved: approvedQuestions,
        pending: pendingQuestions,
        rejected: allQuestions.filter(q => q.status === "rejected").length,
      },
      
      imageBasedQuestions: allQuestions.filter(q => (q as any).hasImage).length,
    };

    return stats;
  },
});

// Get all registered users with Gmail accounts
export const getAllRegisteredUsers = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const allUsers = await ctx.db.query("users").collect();
    
    // Return all users with email (removed strict @gmail.com filter to show all users)
    const registeredUsers = allUsers
      .filter(u => u.email)
      .map(u => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        isRegistered: u.isRegistered,
        _creationTime: u._creationTime,
      }));

    return {
      totalUsers: registeredUsers.length,
      activeUsers: registeredUsers.filter(u => u.isRegistered).length,
      users: registeredUsers,
    };
  },
});

// Get all users with basic stats
export const getAllUsersAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const allUsers = await ctx.db.query("users").collect();
    const usersWithStats = await Promise.all(
      allUsers.map(async (u) => {
        const progress = await ctx.db
          .query("userProgress")
          .withIndex("by_user", (q) => q.eq("userId", u._id))
          .collect();
        const testScores = await ctx.db
          .query("testScores")
          .withIndex("by_user", (q) => q.eq("userId", u._id))
          .collect();

        return {
          ...u,
          totalProgress: progress.length,
          avgScore:
            testScores.reduce((sum, s) => sum + s.score, 0) /
              testScores.length || 0,
        };
      })
    );

    return usersWithStats;
  },
});

// Get specific user analytics
export const getUserAnalytics = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    if (args.userId) {
      // Get specific user analytics
      const targetUser = await ctx.db.get(args.userId);
      const progress = await ctx.db
        .query("userProgress")
        .withIndex("by_user", (q) => q.eq("userId", args.userId!))
        .collect();
      const testScores = await ctx.db
        .query("testScores")
        .withIndex("by_user", (q) => q.eq("userId", args.userId!))
        .collect();

      // Calculate weak topics
      const topicScores = new Map<string, { total: number; count: number }>();
      for (const score of testScores) {
        if (score.topicId) {
          const existing = topicScores.get(score.topicId) || {
            total: 0,
            count: 0,
          };
          topicScores.set(score.topicId, {
            total: existing.total + score.score,
            count: existing.count + 1,
          });
        }
      }

      const weakTopics = await Promise.all(
        Array.from(topicScores.entries())
          .map(([topicId, data]) => ({
            topicId,
            avgScore: data.total / data.count,
          }))
          .filter((t) => t.avgScore < 60)
          .sort((a, b) => a.avgScore - b.avgScore)
          .slice(0, 5)
          .map(async (t) => {
            const topic = t.topicId ? await ctx.db.get(t.topicId as any) : null;
            return {
              topicName: (topic as any)?.name || "Unknown",
              avgScore: t.avgScore,
            };
          })
      );

      return {
        user: targetUser,
        totalProgress: progress.length,
        completedContent: progress.filter((p) => p.completed).length,
        totalTests: testScores.length,
        avgScore:
          testScores.reduce((sum, s) => sum + s.score, 0) / testScores.length ||
          0,
        weakTopics,
      };
    }
  },
});

// Export analytics data
export const exportAnalytics = query({
  args: {
    type: v.string(), // "users", "subscriptions", "payments", "progress"
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    switch (args.type) {
      case "users":
        return await ctx.db.query("users").collect();
      case "subscriptions":
        return await ctx.db.query("subscriptions").collect();
      case "payments":
        return await ctx.db.query("payments").collect();
      case "progress":
        return await ctx.db.query("userProgress").collect();
      default:
        throw new Error("Invalid export type");
    }
  },
});