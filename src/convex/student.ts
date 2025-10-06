import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get student dashboard statistics
export const getStudentDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const [testSessions, testResults, subscription, recentContent] = await Promise.all([
      ctx.db
        .query("testSessions")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .filter((q) => q.eq(q.field("status"), "completed"))
        .collect(),
      ctx.db
        .query("testResults")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect(),
      ctx.db
        .query("subscriptions")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .first(),
      ctx.db.query("content").order("desc").take(5),
    ]);

    const totalTests = testSessions.length;
    const avgScore = testResults.length > 0
      ? testResults.reduce((sum, r) => sum + r.score, 0) / testResults.length
      : 0;

    // Calculate weak topics
    const topicScores = new Map<string, { total: number; count: number }>();
    for (const result of testResults) {
      if (result.topicId) {
        const existing = topicScores.get(result.topicId) || { total: 0, count: 0 };
        topicScores.set(result.topicId, {
          total: existing.total + result.score,
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
        .slice(0, 3)
        .map(async (t) => {
          const topic = await ctx.db.get(t.topicId as any);
          return {
            name: (topic as any)?.name || "Unknown",
            score: Math.round(t.avgScore),
          };
        })
    );

    return {
      totalTests,
      avgScore: Math.round(avgScore),
      weakTopics,
      subscriptionStatus: subscription?.status || "inactive",
      subscriptionEndDate: subscription?.endDate,
      recentContent,
    };
  },
});

// Get mock tests (from manual questions)
export const getMockTests = query({
  args: {
    topicId: v.optional(v.id("topics")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    let questions = await ctx.db
      .query("questions")
      .withIndex("by_source", (q) => q.eq("source", "manual"))
      .filter((q) => q.eq(q.field("status"), "approved"))
      .collect();

    if (args.topicId) {
      questions = questions.filter((q) => q.topicId === args.topicId);
    }

    // Group by topic
    const testsByTopic = new Map<string, typeof questions>();
    for (const q of questions) {
      const topicId = q.topicId || "general";
      if (!testsByTopic.has(topicId)) {
        testsByTopic.set(topicId, []);
      }
      testsByTopic.get(topicId)!.push(q);
    }

    const tests = await Promise.all(
      Array.from(testsByTopic.entries()).map(async ([topicId, qs]) => {
        const topic = topicId !== "general" ? await ctx.db.get(topicId as any) : null;
        return {
          topicId,
          topicName: (topic as any)?.name || "General",
          questionCount: qs.length,
          difficulty: "mixed",
        };
      })
    );

    return tests;
  },
});

// Get AI-generated questions
export const getAIQuestions = query({
  args: {
    topicId: v.optional(v.id("topics")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    let questions = await ctx.db
      .query("questions")
      .withIndex("by_source", (q) => q.eq("source", "ai"))
      .filter((q) => q.eq(q.field("status"), "approved"))
      .collect();

    if (args.topicId) {
      questions = questions.filter((q) => q.topicId === args.topicId);
    }

    // Group by topic
    const testsByTopic = new Map<string, typeof questions>();
    for (const q of questions) {
      const topicId = q.topicId || "general";
      if (!testsByTopic.has(topicId)) {
        testsByTopic.set(topicId, []);
      }
      testsByTopic.get(topicId)!.push(q);
    }

    const tests = await Promise.all(
      Array.from(testsByTopic.entries()).map(async ([topicId, qs]) => {
        const topic = topicId !== "general" ? await ctx.db.get(topicId as any) : null;
        return {
          topicId,
          topicName: (topic as any)?.name || "General",
          questionCount: qs.length,
          difficulty: "mixed",
        };
      })
    );

    return tests;
  },
});

// Get PYQ sets (organized by exam and year)
export const getPYQSets = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const pyqQuestions = await ctx.db
      .query("questions")
      .withIndex("by_source", (q) => q.eq("source", "pyq"))
      .filter((q) => q.eq(q.field("status"), "approved"))
      .collect();

    // Group by exam name and year
    const setsByExamYear = new Map<string, typeof pyqQuestions>();
    for (const q of pyqQuestions) {
      const examName = q.examName || "General";
      const year = q.year || 0;
      const key = `${examName}_${year}`;
      if (!setsByExamYear.has(key)) {
        setsByExamYear.set(key, []);
      }
      setsByExamYear.get(key)!.push(q);
    }

    const sets = Array.from(setsByExamYear.entries())
      .map(([key, qs]) => {
        const [examName, yearStr] = key.split("_");
        return {
          examName,
          year: parseInt(yearStr),
          questionCount: qs.length,
          subjects: [...new Set(qs.map((q) => q.subject).filter(Boolean))],
        };
      })
      .sort((a, b) => b.year - a.year);

    return sets;
  },
});

// Get practice questions with filters
export const getPracticeQuestions = query({
  args: {
    topicId: v.optional(v.id("topics")),
    difficulty: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Enforce 10-100 question limit
    const limit = args.limit ? Math.min(Math.max(args.limit, 10), 100) : 10;

    let questions = await ctx.db
      .query("questions")
      .filter((q) => q.eq(q.field("status"), "approved"))
      .collect();

    if (args.topicId) {
      questions = questions.filter((q) => q.topicId === args.topicId);
    }

    if (args.difficulty) {
      questions = questions.filter((q) => q.difficulty === args.difficulty);
    }

    // Shuffle questions to ensure random distribution from all sources
    questions = questions.sort(() => Math.random() - 0.5);

    // Take the requested number of questions (enforcing 10-100 limit)
    questions = questions.slice(0, limit);

    return questions;
  },
});

// Start a test session
export const startTest = mutation({
  args: {
    testType: v.string(),
    topicId: v.optional(v.id("topics")),
    year: v.optional(v.number()),
    questionIds: v.array(v.id("questions")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const sessionId = await ctx.db.insert("testSessions", {
      userId: user._id,
      testType: args.testType,
      topicId: args.topicId,
      year: args.year,
      questionIds: args.questionIds,
      status: "in_progress",
      startedAt: Date.now(),
    });

    return sessionId;
  },
});

// Submit test and calculate results
export const submitTest = mutation({
  args: {
    sessionId: v.id("testSessions"),
    answers: v.array(v.object({
      questionId: v.id("questions"),
      answer: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== user._id) {
      throw new Error("Invalid session");
    }

    // Calculate results
    const questions = await Promise.all(
      session.questionIds.map((id) => ctx.db.get(id))
    );

    const answersWithCorrectness = args.answers.map((ans) => {
      const question = questions.find((q) => q?._id === ans.questionId);
      return {
        ...ans,
        isCorrect: question?.correctAnswer === ans.answer,
      };
    });

    const correctAnswers = answersWithCorrectness.filter((a) => a.isCorrect).length;
    const incorrectAnswers = answersWithCorrectness.filter((a) => !a.isCorrect && a.answer).length;
    const skippedAnswers = session.questionIds.length - args.answers.length;
    const score = (correctAnswers / session.questionIds.length) * 100;
    const timeSpent = Math.floor((Date.now() - session.startedAt) / 1000);

    // Update session
    await ctx.db.patch(args.sessionId, {
      answers: answersWithCorrectness,
      status: "completed",
      completedAt: Date.now(),
      timeSpent,
      score,
    });

    // Create test result
    const resultId = await ctx.db.insert("testResults", {
      userId: user._id,
      sessionId: args.sessionId,
      testType: session.testType,
      topicId: session.topicId,
      year: session.year,
      totalQuestions: session.questionIds.length,
      correctAnswers,
      incorrectAnswers,
      skippedAnswers,
      score,
      timeSpent,
    });

    return { resultId, score, correctAnswers, totalQuestions: session.questionIds.length };
  },
});

// Get test results
export const getTestResults = query({
  args: {
    sessionId: v.id("testSessions"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== user._id) {
      throw new Error("Invalid session");
    }

    const result = await ctx.db
      .query("testResults")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();

    const questions = await Promise.all(
      session.questionIds.map(async (id) => {
        const q = await ctx.db.get(id);
        const userAnswer = session.answers?.find((a) => a.questionId === id);
        return {
          ...q,
          userAnswer: userAnswer?.answer,
          isCorrect: userAnswer?.isCorrect,
        };
      })
    );

    return {
      session,
      result,
      questions,
    };
  },
});

// Get student test history
export const getTestHistory = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const sessions = await ctx.db
      .query("testSessions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .order("desc")
      .take(20);

    const enrichedSessions = await Promise.all(
      sessions.map(async (s) => {
        const topic = s.topicId ? await ctx.db.get(s.topicId) : null;
        return {
          ...s,
          topicName: topic?.name || "General",
        };
      })
    );

    return enrichedSessions;
  },
});

// Check subscription access with free trial support
export const checkSubscriptionAccess = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return { hasAccess: false, reason: "not_authenticated" };
    }

    // Check for active subscription
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    if (subscription) {
      if (subscription.endDate < Date.now()) {
        return { hasAccess: false, reason: "expired" };
      }
      return { hasAccess: true, subscription };
    }

    // Check if user has used their free trial
    const completedTests = await ctx.db
      .query("testSessions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .collect();

    const mockTestsCompleted = completedTests.filter((t) => t.testType === "mock").length;
    const pyqTestsCompleted = completedTests.filter((t) => t.testType === "pyq").length;
    const aiTestsCompleted = completedTests.filter((t) => t.testType === "ai").length;

    // Allow one free test of each type
    const hasFreeMockAccess = mockTestsCompleted < 1;
    const hasFreePYQAccess = pyqTestsCompleted < 1;
    const hasFreeAIAccess = aiTestsCompleted < 1;

    if (hasFreeMockAccess || hasFreePYQAccess || hasFreeAIAccess) {
      return {
        hasAccess: true,
        reason: "free_trial",
        freeTrialRemaining: {
          mock: hasFreeMockAccess ? 1 : 0,
          pyq: hasFreePYQAccess ? 1 : 0,
          ai: hasFreeAIAccess ? 1 : 0,
        },
      };
    }

    return { hasAccess: false, reason: "no_subscription" };
  },
});