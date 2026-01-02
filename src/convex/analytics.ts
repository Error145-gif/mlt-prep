import { v } from "convex/values";
import { query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Dashboard stats
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    // Use take() instead of collect() to limit database reads
    const allQuestions = await ctx.db.query("questions").take(5000);
    const allTestSets = await ctx.db.query("testSets").take(1000);
    const allUsers = await ctx.db.query("users").take(10000);
    const allSubscriptions = await ctx.db.query("subscriptions").take(5000);

    // Calculate new users (registered in last 7 days)
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const newUsers = allUsers.filter(u => u._creationTime > sevenDaysAgo);
    
    // Calculate currently online users (active in last 15 minutes - more realistic)
    const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000;
    const onlineUsers = allUsers.filter(u => {
      const lastActive = u.lastActive || u._creationTime || 0;
      return lastActive > fifteenMinutesAgo;
    });

    // Fetch recent data - UPDATED to get more recent items
    const recentPayments = await ctx.db.query("payments")
      .order("desc")
      .take(10);
    
    const recentQuestions = await ctx.db.query("questions")
      .order("desc")
      .take(5);
    
    const recentContent = recentQuestions.map(q => ({
      _id: q._id,
      title: (q.question || "Untitled").substring(0, 50) + ((q.question?.length || 0) > 50 ? "..." : ""),
      type: "Question",
      views: 0,
      _creationTime: q._creationTime
    }));

    // Calculate stats
    const approvedQuestions = allQuestions.filter((q) => q.status === "approved").length;
    const pendingQuestions = allQuestions.filter((q) => q.status === "pending" || !q.status).length;
    
    // Get recent payment errors
    const paymentErrors = await ctx.db
      .query("payments")
      .withIndex("by_status", (q) => q.eq("status", "failed"))
      .order("desc")
      .take(10);

    // Get recent unlocks - UPDATED to show ALL recent subscriptions, not just active
    // This will show both paid and free trial subscriptions
    const recentSubscriptions = await ctx.db
      .query("subscriptions")
      .order("desc")
      .take(10);

    // Enrich recent subscriptions with user data
    const recentUnlocks = await Promise.all(
      recentSubscriptions.map(async (sub) => {
        const user = await ctx.db.get(sub.userId);
        return {
          ...sub,
          userName: user?.name || "Unknown User",
          userEmail: user?.email || "No Email",
        };
      })
    );

    // Enrich payment errors with user data
    const enrichedPaymentErrors = await Promise.all(
      paymentErrors.map(async (payment) => {
        const user = payment.userId ? await ctx.db.get(payment.userId) : null;
        return {
          ...payment,
          userName: user?.name || "Unknown User",
          userEmail: user?.email || "No Email",
        };
      })
    );

    const stats = {
      totalUsers: allUsers.length,
      newUsers: newUsers.length,
      onlineUsers: onlineUsers.length,
      activeUsers: allUsers.filter((u) => {
        const lastActive = u.lastActive || 0;
        return Date.now() - lastActive < 30 * 24 * 60 * 60 * 1000; // 30 days
      }).length,
      totalQuestions: allQuestions.length,
      questionsAddedThisMonth: allQuestions.filter(
        (q) => q._creationTime > Date.now() - 30 * 24 * 60 * 60 * 1000
      ).length,
      totalTestSets: allTestSets.length,
      activeTestSets: allTestSets.filter((t) => t.isPublished).length,
      totalRevenue: allSubscriptions.reduce((acc, curr) => acc + (curr.amount || 0), 0),
      revenueThisMonth: allSubscriptions
        .filter((s) => s._creationTime > Date.now() - 30 * 24 * 60 * 60 * 1000)
        .reduce((acc, curr) => acc + (curr.amount || 0), 0),
      recentPayments,
      recentContent,
      recentUnlocks,
      paymentErrors: enrichedPaymentErrors,

      // Added fields for AdminDashboard compatibility
      activeSubscriptions: allSubscriptions.filter(s => s.status === "active").length,
      totalContent: (await ctx.db.query("content").take(1000)).length,
      approvedQuestions: approvedQuestions,
      manualQuestions: allQuestions.filter(q => q.source === "manual").length,
      pendingQuestions: pendingQuestions,
      mockTestSets: allTestSets.filter(t => t.type === "mock").length,
      aiTestSets: allTestSets.filter(t => t.type === "ai").length,
      pyqTestSets: allTestSets.filter(t => t.type === "pyq").length,

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

    const allUsers = await ctx.db.query("users").take(10000);
    
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

    const allUsers = await ctx.db.query("users").take(10000);
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