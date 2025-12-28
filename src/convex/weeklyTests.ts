import { v } from "convex/values";
import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
import { getCurrentUser } from "./users";
import { paginationOptsValidator } from "convex/server";

// Get current active weekly test
export const getCurrentWeeklyTest = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    
    // Find active test (Sunday only)
    const activeTest = await ctx.db
      .query("weeklyTests")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .first();

    if (activeTest) {
      return activeTest;
    }

    // Find scheduled test that should be active now (scheduled date has passed)
    const scheduledTests = await ctx.db
      .query("weeklyTests")
      .withIndex("by_status", (q) => q.eq("status", "scheduled"))
      .collect();
    
    // Check if any scheduled test's time has arrived
    const readyTest = scheduledTests.find(test => 
      test.scheduledDate && test.scheduledDate <= now
    );
    
    // Return the ready test (frontend will treat it as active)
    if (readyTest) {
      return readyTest;
    }

    // Return next scheduled test for display purposes
    const nextScheduled = scheduledTests
      .sort((a, b) => (a.scheduledDate || 0) - (b.scheduledDate || 0))[0];

    return nextScheduled || null;
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
    const isReady = test && (test.status === "active" || (test.status === "scheduled" && (test.scheduledDate ?? Infinity) <= Date.now()));
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
      test.questions.map(async (id) => {
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
    const isReady = test && (test.status === "active" || (test.status === "scheduled" && (test.scheduledDate ?? Infinity) <= Date.now()));
    
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
      test.questions.map((id) => ctx.db.get(id))
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
    const score = (correctAnswers / test.questions.length) * 100;
    const avgTimePerQuestion = args.totalTimeSpent / test.questions.length;

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
      totalAttempts: (test.totalAttempts || 0) + 1,
    });

    return { attemptId, score, correctAnswers, totalQuestions: test.questions.length };
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
      startDate: new Date(args.scheduledDate).toISOString(),
      endDate: new Date(args.scheduledDate + 24 * 60 * 60 * 1000).toISOString(),
      duration: 60, // Default 60 minutes
      totalMarks: 100,
      passingMarks: 40,
      questions: questionIds,
      isActive: false,
      status: "scheduled",
      scheduledDate: args.scheduledDate,
      isResultPublished: false,
      totalAttempts: 0,
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

// Admin: Manually release leaderboard
export const releaseLeaderboard = mutation({
  args: { weeklyTestId: v.id("weeklyTests") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const test = await ctx.db.get(args.weeklyTestId);
    if (!test) {
      throw new Error("Test not found");
    }

    if (test.leaderboardPublishedAt) {
      throw new Error("Leaderboard already published");
    }

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

    // Update ranks for all attempts
    for (let i = 0; i < sorted.length; i++) {
      const attempt = sorted[i];
      await ctx.db.patch(attempt._id, {
        rank: i + 1,
      });
    }

    // Mark leaderboard as published
    await ctx.db.patch(args.weeklyTestId, {
      leaderboardPublishedAt: Date.now(),
      status: "completed",
    });

    return { success: true, totalAttempts: sorted.length };
  },
});

// ADMIN: Get weekly test statistics
export const getWeeklyTestStats = query({
  args: { weeklyTestId: v.id("weeklyTests") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const test = await ctx.db.get(args.weeklyTestId);
    if (!test) {
      throw new Error("Test not found");
    }

    // Get all attempts
    const attempts = await ctx.db
      .query("weeklyTestAttempts")
      .withIndex("by_weekly_test", (q) => q.eq("weeklyTestId", args.weeklyTestId))
      .collect();

    // Get user details and categorize
    let paidUserCount = 0;
    let freeUserCount = 0;

    for (const attempt of attempts) {
      const attemptUser = await ctx.db.get(attempt.userId);
      if (!attemptUser) continue;

      // Check if user has active subscription
      const subscription = await ctx.db
        .query("subscriptions")
        .withIndex("by_user", (q) => q.eq("userId", attemptUser._id))
        .filter((q) => q.eq(q.field("status"), "active"))
        .first();

      if (subscription && subscription.endDate > Date.now()) {
        paidUserCount++;
      } else {
        freeUserCount++;
      }
    }

    return {
      totalAttempts: attempts.length,
      paidUserCount,
      freeUserCount,
      isLeaderboardReleased: !!test.leaderboardPublishedAt,
      test,
    };
  },
});

// ADMIN: Get full leaderboard (always visible to admin)
export const getAdminWeeklyLeaderboard = query({
  args: { weeklyTestId: v.id("weeklyTests") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const test = await ctx.db.get(args.weeklyTestId);
    if (!test) return [];

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

    // Enrich with user details and subscription status
    const enriched = await Promise.all(
      sorted.map(async (attempt, index) => {
        const attemptUser = await ctx.db.get(attempt.userId);
        
        // Check subscription status
        const subscription = await ctx.db
          .query("subscriptions")
          .withIndex("by_user", (q) => q.eq("userId", attempt.userId))
          .filter((q) => q.eq(q.field("status"), "active"))
          .first();

        const isPaid = subscription && subscription.endDate > Date.now();

        return {
          ...attempt,
          userName: attemptUser?.name || "Anonymous",
          userEmail: attemptUser?.email,
          rank: index + 1,
          userType: isPaid ? "PAID" : "FREE",
        };
      })
    );

    return enriched;
  },
});

// ADMIN: Get all weekly tests with enhanced statistics
export const getAllWeeklyTestsWithStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const tests = await ctx.db
      .query("weeklyTests")
      .order("desc")
      .collect();

    // Enrich each test with detailed statistics
    const enrichedTests = await Promise.all(
      tests.map(async (test) => {
        const attempts = await ctx.db
          .query("weeklyTestAttempts")
          .withIndex("by_weekly_test", (q) => q.eq("weeklyTestId", test._id))
          .collect();

        let paidCount = 0;
        let freeCount = 0;

        for (const attempt of attempts) {
          const attemptUser = await ctx.db.get(attempt.userId);
          if (!attemptUser) continue;

          const subscription = await ctx.db
            .query("subscriptions")
            .withIndex("by_user", (q) => q.eq("userId", attemptUser._id))
            .filter((q) => q.eq(q.field("status"), "active"))
            .first();

          if (subscription && subscription.endDate > Date.now()) {
            paidCount++;
          } else {
            freeCount++;
          }
        }

        return {
          ...test,
          totalAttempts: attempts.length,
          totalSubmissions: attempts.length,
          paidUsersCount: paidCount,
          freeUsersCount: freeCount,
        };
      })
    );

    return enrichedTests;
  },
});

// ADMIN: Toggle leaderboard release status
export const toggleLeaderboardRelease = mutation({
  args: { 
    weeklyTestId: v.id("weeklyTests"),
    shouldRelease: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const test = await ctx.db.get(args.weeklyTestId);
    if (!test) {
      throw new Error("Test not found");
    }

    if (args.shouldRelease && !test.leaderboardPublishedAt) {
      // Release leaderboard - calculate ranks
      const attempts = await ctx.db
        .query("weeklyTestAttempts")
        .withIndex("by_weekly_test", (q) => q.eq("weeklyTestId", args.weeklyTestId))
        .collect();

      const sorted = attempts.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.avgTimePerQuestion - b.avgTimePerQuestion;
      });

      for (let i = 0; i < sorted.length; i++) {
        await ctx.db.patch(sorted[i]._id, { rank: i + 1 });
      }

      await ctx.db.patch(args.weeklyTestId, {
        leaderboardPublishedAt: Date.now(),
      });
    } else if (!args.shouldRelease && test.leaderboardPublishedAt) {
      // Hide leaderboard
      await ctx.db.patch(args.weeklyTestId, {
        leaderboardPublishedAt: undefined,
      });
    }

    return { success: true };
  },
});

// ADMIN: Archive weekly test
export const archiveWeeklyTest = mutation({
  args: { weeklyTestId: v.id("weeklyTests") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.weeklyTestId, {
      status: "archived",
      isActive: false,
    });

    return { success: true };
  },
});

// Internal: Get scheduled tests ready for activation
export const getScheduledTestsForActivation = internalQuery({
  args: { now: v.number() },
  handler: async (ctx, args) => {
    const tests = await ctx.db
      .query("weeklyTests")
      .withIndex("by_status", (q) => q.eq("status", "scheduled"))
      .collect();
    
    // Filter tests whose scheduled time has passed
    return tests.filter(test => 
      test.scheduledDate && test.scheduledDate <= args.now
    );
  },
});

// Internal: Activate a scheduled test
export const activateScheduledTest = internalMutation({
  args: { weeklyTestId: v.id("weeklyTests") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.weeklyTestId, {
      status: "active",
      isActive: true,
      publishedAt: Date.now(),
    });
  },
});

// Internal: Get active tests ready for completion
export const getActiveTestsForCompletion = internalQuery({
  args: { now: v.number() },
  handler: async (ctx, args) => {
    const tests = await ctx.db
      .query("weeklyTests")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();
    
    // Filter tests whose end date has passed (24 hours after start)
    return tests.filter(test => {
      if (!test.scheduledDate) return false;
      const endTime = test.scheduledDate + (24 * 60 * 60 * 1000); // 24 hours
      return endTime <= args.now;
    });
  },
});

// Internal: Complete an active test
export const completeActiveTest = internalMutation({
  args: { weeklyTestId: v.id("weeklyTests") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.weeklyTestId, {
      status: "completed",
      isActive: false,
    });
  },
});