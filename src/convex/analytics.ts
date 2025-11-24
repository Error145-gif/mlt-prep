import { v } from "convex/values";
import { query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Dashboard stats
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // Fetch all data in parallel for efficiency
    const [allUsers, allSubscriptions, allContent, allQuestions, allPayments] = await Promise.all([
      ctx.db.query("users").collect(),
      ctx.db.query("subscriptions").collect(),
      ctx.db.query("content").collect(),
      ctx.db.query("questions").collect(),
      ctx.db.query("payments").collect(),
    ]);

    // Calculate stats from collected data
    const totalUsers = allUsers.length;
    const activeSubscriptions = allSubscriptions.filter((s) => s.status === "active").length;
    const totalContent = allContent.length;
    const totalQuestions = allQuestions.length;
    const approvedQuestions = allQuestions.filter((q) => q.status === "approved").length;
    const pendingQuestions = allQuestions.filter((q) => q.status === "pending").length;
    const manualQuestions = allQuestions.filter((q) => q.source === "manual").length;

    // Calculate revenue
    const totalRevenue = allPayments
      .filter((p) => p.status === "success")
      .reduce((sum, p) => sum + p.amount, 0);

    // Get recent content
    const recentContent = allContent.sort((a, b) => b._creationTime - a._creationTime).slice(0, 5);

    // Get recent payments
    const recentPayments = allPayments.sort((a, b) => b._creationTime - a._creationTime).slice(0, 10);

    // Calculate test set counts
    const mockQuestions = allQuestions.filter(q => q.source === "manual" && q.status === "approved");
    const aiQuestions = allQuestions.filter(q => q.source === "ai" && q.status === "approved");
    const pyqQuestions = allQuestions.filter(q => q.source === "pyq" && q.status === "approved");
    
    const mockTestSets = Math.floor(mockQuestions.length / 100);
    const aiTestSets = Math.floor(aiQuestions.length / 25);
    const pyqTestSets = Math.floor(pyqQuestions.length / 20);

    return {
      totalUsers,
      activeSubscriptions,
      totalRevenue,
      totalContent,
      pendingQuestions,
      totalQuestions,
      approvedQuestions,
      manualQuestions,
      mockTestSets,
      aiTestSets,
      pyqTestSets,
      recentContent,
      recentPayments,
    };
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