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

    const [
      totalUsers,
      activeSubscriptions,
      totalContent,
      pendingQuestions,
      recentPayments,
    ] = await Promise.all([
      ctx.db.query("users").collect().then((users) => users.length),
      ctx.db
        .query("subscriptions")
        .withIndex("by_status", (q) => q.eq("status", "active"))
        .collect()
        .then((subs) => subs.length),
      ctx.db.query("content").collect().then((content) => content.length),
      ctx.db
        .query("questions")
        .withIndex("by_status", (q) => q.eq("status", "pending"))
        .collect()
        .then((questions) => questions.length),
      ctx.db.query("payments").order("desc").take(10),
    ]);

    // Calculate revenue
    const allPayments = await ctx.db.query("payments").collect();
    const totalRevenue = allPayments
      .filter((p) => p.status === "success")
      .reduce((sum, p) => sum + p.amount, 0);

    // Get recent content
    const recentContent = await ctx.db.query("content").order("desc").take(5);

    return {
      totalUsers,
      activeSubscriptions,
      totalRevenue,
      totalContent,
      pendingQuestions,
      recentContent,
      recentPayments,
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
