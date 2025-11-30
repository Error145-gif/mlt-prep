import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { getCurrentUser } from "./users";
import { paginationOptsValidator } from "convex/server";

// Get current active weekly test
export const getCurrentWeeklyTest = query({
  args: {},
  handler: async (ctx) => {
    // Find active test (Sunday only)
    const activeTest = await ctx.db
      .query("weeklyTests")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .first();

    if (activeTest) {
      return activeTest;
    }

    // Find next scheduled test
    const scheduledTest = await ctx.db
      .query("weeklyTests")
      .withIndex("by_status", (q) => q.eq("status", "scheduled"))
      // .filter((q) => q.gte(q.field("scheduledDate"), now))
      .order("asc")
      .first();

    return scheduledTest || null;
  },
});

// Check if user has attempted current weekly test
export const hasUserAttemptedWeeklyTest = query({
  args: { weeklyTestId: v.id("weeklyTests") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return false;

    const attempt = await ctx.db
      .query("weeklyTestAttempts")
      .withIndex("by_user_and_test", (q) => 
        q.eq("userId", user._id).eq("weeklyTestId", args.weeklyTestId)
      )
      .first();

    return !!attempt;
  },
});

// Get user's weekly test attempt
export const getUserWeeklyTestAttempt = query({
  args: { weeklyTestId: v.id("weeklyTests") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    return await ctx.db
      .query("weeklyTestAttempts")
      .withIndex("by_user_and_test", (q) => 
        q.eq("userId", user._id).eq("weeklyTestId", args.weeklyTestId)
      )
      .first();
  },
});

// Get weekly test questions
export const getWeeklyTestQuestions = query({
  args: { weeklyTestId: v.id("weeklyTests") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const test = await ctx.db.get(args.weeklyTestId);
    // Allow if active OR if it's scheduled and time has passed (e.g. today)
    const isReady = test && (test.status === "active" || (test.status === "scheduled" && test.scheduledDate <= Date.now()));
    if (!isReady || !test) return null;

    // Check if user already attempted
    const hasAttempted = await ctx.db
      .query("weeklyTestAttempts")
      .withIndex("by_user_and_test", (q) => 
        q.eq("userId", user._id).eq("weeklyTestId", args.weeklyTestId)
      )
      .first();

    if (hasAttempted) {
      return { error: "You have already attempted this test" };
    }

    // Fetch questions
    const questions = await Promise.all(
      test.questionIds.map(async (id) => {
        const q = await ctx.db.get(id);
        if (!q) return null;
        
        // Generate fresh image URL if needed
        let imageUrl = q.imageUrl;
        if (q.imageStorageId) {
          const url = await ctx.storage.getUrl(q.imageStorageId);
          if (url) imageUrl = url;
        }
        
        return { ...q, imageUrl };
      })
    );

    return questions.filter((q) => q !== null);
  },
});

// Submit weekly test attempt
export const submitWeeklyTestAttempt = mutation({
  args: {
    weeklyTestId: v.id("weeklyTests"),
    answers: v.array(v.object({
      questionId: v.id("questions"),
      answer: v.string(),
    })),
    totalTimeSpent: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const test = await ctx.db.get(args.weeklyTestId);
    const isReady = test && (test.status === "active" || (test.status === "scheduled" && test.scheduledDate <= Date.now()));
    
    if (!isReady || !test) {
      throw new Error("Test is not active");
    }

    // Check if user already attempted
    const existingAttempt = await ctx.db
      .query("weeklyTestAttempts")
      .withIndex("by_user_and_test", (q) => 
        q.eq("userId", user._id).eq("weeklyTestId", args.weeklyTestId)
      )
      .first();

    if (existingAttempt) {
      throw new Error("You have already attempted this test");
    }

    // Fetch questions and validate answers
    const questions = await Promise.all(
      test.questionIds.map((id) => ctx.db.get(id))
    );

    const validatedAnswers = args.answers.map((ans) => {
      const question = questions.find((q) => q?._id === ans.questionId);
      if (!question) {
        return { ...ans, isCorrect: false };
      }

      const normalize = (text: string) => {
        if (!text) return "";
        return text.trim().toLowerCase().replace(/\s+/g, ' ');
      };

      const userAnswer = normalize(ans.answer);
      const correctAnswer = normalize(question.correctAnswer || "");
      
      let isCorrect = false;
      
      if (question.options && question.options.length > 0) {
        let correctOptionIndex = -1;
        for (let i = 0; i < question.options.length; i++) {
          if (normalize(question.options[i]) === correctAnswer) {
            correctOptionIndex = i;
            break;
          }
        }
        
        let userOptionIndex = -1;
        for (let i = 0; i < question.options.length; i++) {
          if (normalize(question.options[i]) === userAnswer) {
            userOptionIndex = i;
            break;
          }
        }
        
        if (correctOptionIndex >= 0 && userOptionIndex >= 0) {
          isCorrect = correctOptionIndex === userOptionIndex;
        } else {
          isCorrect = userAnswer === correctAnswer;
        }
      } else {
        isCorrect = userAnswer === correctAnswer;
      }

      return { ...ans, isCorrect };
    });

    const correctAnswers = validatedAnswers.filter((a) => a.isCorrect).length;
    const incorrectAnswers = validatedAnswers.length - correctAnswers;
    const score = (correctAnswers / test.questionIds.length) * 100;
    const avgTimePerQuestion = args.totalTimeSpent / test.questionIds.length;

    // Create attempt
    const attemptId = await ctx.db.insert("weeklyTestAttempts", {
      userId: user._id,
      weeklyTestId: args.weeklyTestId,
      answers: validatedAnswers,
      score,
      accuracy: score,
      avgTimePerQuestion,
      totalTimeSpent: args.totalTimeSpent,
      correctAnswers,
      incorrectAnswers,
      completedAt: Date.now(),
    });

    // Update test attempts count
    await ctx.db.patch(args.weeklyTestId, {
      totalAttempts: test.totalAttempts + 1,
    });

    return { attemptId, score, correctAnswers, totalQuestions: test.questionIds.length };
  },
});

// Get weekly test leaderboard (paginated for performance)
export const getWeeklyLeaderboard = query({
  args: {
    weeklyTestId: v.id("weeklyTests"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    // Check if leaderboard is published
    const test = await ctx.db.get(args.weeklyTestId);
    if (!test) return { page: [], isDone: true, continueCursor: null };

    if (test.leaderboardPublishedAt) {
      // Use cached leaderboard
      return await ctx.db
        .query("weeklyLeaderboard")
        .withIndex("by_test_and_rank", (q) => q.eq("weeklyTestId", args.weeklyTestId))
        .order("asc")
        .paginate(args.paginationOpts);
    }

    // Temporary leaderboard (live, not cached)
    const attempts = await ctx.db
      .query("weeklyTestAttempts")
      .withIndex("by_weekly_test", (q) => q.eq("weeklyTestId", args.weeklyTestId))
      .collect();

    // Sort by score (desc), then by avgTimePerQuestion (asc)
    const sorted = attempts.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.avgTimePerQuestion - b.avgTimePerQuestion;
    });

    // Get user details
    const enriched = await Promise.all(
      sorted.map(async (attempt, index) => {
        const user = await ctx.db.get(attempt.userId);
        return {
          ...attempt,
          userName: user?.name || "Anonymous",
          userEmail: user?.email,
          rank: index + 1,
        };
      })
    );

    // Manual pagination
    const numItems = args.paginationOpts.numItems;
    const cursor = args.paginationOpts.cursor ? parseInt(args.paginationOpts.cursor) : 0;
    const page = enriched.slice(cursor, cursor + numItems);
    const isDone = cursor + numItems >= enriched.length;
    const continueCursor = isDone ? null : String(cursor + numItems);

    return { page, isDone, continueCursor };
  },
});

// ADMIN: Get all weekly tests
export const getAllWeeklyTests = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await ctx.db
      .query("weeklyTests")
      .order("desc")
      .collect();
  },
});

// ADMIN: Create weekly test with auto-selected questions
export const createWeeklyTest = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    scheduledDate: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // Validate scheduled date is a Sunday
    const date = new Date(args.scheduledDate);
    if (date.getDay() !== 0) {
      throw new Error("Weekly test must be scheduled on a Sunday");
    }

    // Auto-select 100 random approved questions
    const allQuestions = await ctx.db
      .query("questions")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .collect();

    if (allQuestions.length < 100) {
      throw new Error(`Not enough approved questions. Found ${allQuestions.length}, need 100.`);
    }

    // Shuffle and select 100 random questions
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, 100);
    const questionIds = selectedQuestions.map(q => q._id);

    const testId = await ctx.db.insert("weeklyTests", {
      title: args.title,
      description: args.description,
      scheduledDate: args.scheduledDate,
      status: "scheduled",
      questionIds: questionIds,
      totalAttempts: 0,
      createdBy: user._id,
    });

    return testId;
  },
});

// ADMIN: Update weekly test status
export const updateWeeklyTestStatus = mutation({
  args: {
    weeklyTestId: v.id("weeklyTests"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const updates: any = { status: args.status };
    
    if (args.status === "active") {
      updates.publishedAt = Date.now();
    }

    await ctx.db.patch(args.weeklyTestId, updates);
    return { success: true };
  },
});

// ADMIN: Delete weekly test
export const deleteWeeklyTest = mutation({
  args: { weeklyTestId: v.id("weeklyTests") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.weeklyTestId);
    return { success: true };
  },
});

// Internal: Publish leaderboard (called by cron)
export const publishWeeklyLeaderboard = internalMutation({
  args: { weeklyTestId: v.id("weeklyTests") },
  handler: async (ctx, args) => {
    const test = await ctx.db.get(args.weeklyTestId);
    if (!test || test.leaderboardPublishedAt) return;

    // Get all attempts
    const attempts = await ctx.db
      .query("weeklyTestAttempts")
      .withIndex("by_weekly_test", (q) => q.eq("weeklyTestId", args.weeklyTestId))
      .collect();

    // Sort by score (desc), then by avgTimePerQuestion (asc)
    const sorted = attempts.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.avgTimePerQuestion - b.avgTimePerQuestion;
    });

    // Create leaderboard entries and update ranks
    for (let i = 0; i < sorted.length; i++) {
      const attempt = sorted[i];
      const rank = i + 1;
      
      // Update attempt with final rank
      await ctx.db.patch(attempt._id, { rank });
      
      // Get user details
      const user = await ctx.db.get(attempt.userId);
      
      // Create leaderboard entry
      await ctx.db.insert("weeklyLeaderboard", {
        weeklyTestId: args.weeklyTestId,
        userId: attempt.userId,
        userName: user?.name || "Anonymous",
        userEmail: user?.email,
        score: attempt.score,
        accuracy: attempt.accuracy,
        avgTimePerQuestion: attempt.avgTimePerQuestion,
        rank,
        completedAt: attempt.completedAt,
      });
    }

    // Mark leaderboard as published
    await ctx.db.patch(args.weeklyTestId, {
      leaderboardPublishedAt: Date.now(),
      status: "completed",
    });
  },
});
