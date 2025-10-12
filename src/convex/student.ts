import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get student dashboard statistics - ENHANCED VERSION
export const getStudentDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return null;
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

    // Calculate test type breakdowns
    const mockTests = testSessions.filter((t) => t.testType === "mock");
    const pyqTests = testSessions.filter((t) => t.testType === "pyq");
    const aiTests = testSessions.filter((t) => t.testType === "ai");

    const mockResults = testResults.filter((r) => r.testType === "mock");
    const pyqResults = testResults.filter((r) => r.testType === "pyq");
    const aiResults = testResults.filter((r) => r.testType === "ai");

    const mockAvgScore = mockResults.length > 0
      ? mockResults.reduce((sum, r) => sum + r.score, 0) / mockResults.length
      : 0;
    const pyqAvgScore = pyqResults.length > 0
      ? pyqResults.reduce((sum, r) => sum + r.score, 0) / pyqResults.length
      : 0;
    const aiAvgScore = aiResults.length > 0
      ? aiResults.reduce((sum, r) => sum + r.score, 0) / aiResults.length
      : 0;

    // Calculate overall accuracy
    const totalQuestions = testResults.reduce((sum, r) => sum + r.totalQuestions, 0);
    const totalCorrect = testResults.reduce((sum, r) => sum + r.correctAnswers, 0);
    const overallAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

    // NEW: Calculate total questions attempted
    const totalQuestionsAttempted = totalQuestions;

    // NEW: Calculate average time per question (in seconds)
    const totalTimeSpent = testResults.reduce((sum, r) => sum + r.timeSpent, 0);
    const avgTimePerQuestion = totalQuestions > 0 ? totalTimeSpent / totalQuestions : 0;

    // NEW: Calculate total study time
    const totalStudyTime = totalTimeSpent;

    // NEW: Calculate average questions per test
    const avgQuestionsPerTest = totalTests > 0 ? totalQuestions / totalTests : 0;

    // NEW: Calculate consistency streak (days active)
    const testDates = testSessions.map(s => new Date(s._creationTime).toDateString());
    const uniqueDates = [...new Set(testDates)];
    const consistencyStreak = uniqueDates.length;

    // NEW: Weekly accuracy trend (last 7 days)
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentResults = testResults.filter(r => r._creationTime >= sevenDaysAgo);
    const weeklyAccuracy = recentResults.length > 0
      ? recentResults.reduce((sum, r) => sum + ((r.correctAnswers / r.totalQuestions) * 100), 0) / recentResults.length
      : 0;

    // NEW: Subject-wise performance (strongest/weakest)
    const subjectPerformance = new Map<string, { correct: number; total: number }>();
    
    for (const session of testSessions) {
      const questions = await Promise.all(
        session.questionIds.map(id => ctx.db.get(id))
      );
      
      for (const q of questions) {
        if (q?.subject) {
          const subject = q.subject;
          if (!subjectPerformance.has(subject)) {
            subjectPerformance.set(subject, { correct: 0, total: 0 });
          }
          const stats = subjectPerformance.get(subject)!;
          stats.total++;
          
          const answer = session.answers?.find(a => a.questionId === q._id);
          if (answer?.isCorrect) {
            stats.correct++;
          }
        }
      }
    }

    let strongestSubject = "N/A";
    let weakestSubject = "N/A";
    let highestAccuracy = 0;
    let lowestAccuracy = 100;

    for (const [subject, stats] of subjectPerformance.entries()) {
      const accuracy = (stats.correct / stats.total) * 100;
      if (accuracy > highestAccuracy) {
        highestAccuracy = accuracy;
        strongestSubject = subject;
      }
      if (accuracy < lowestAccuracy && stats.total >= 5) { // Only consider subjects with at least 5 questions
        lowestAccuracy = accuracy;
        weakestSubject = subject;
      }
    }

    // NEW: Improvement since last test
    const sortedResults = testResults.sort((a, b) => b._creationTime - a._creationTime);
    let improvementRate = 0;
    if (sortedResults.length >= 2) {
      const lastScore = sortedResults[0].score;
      const previousScore = sortedResults[1].score;
      improvementRate = lastScore - previousScore;
    }

    // NEW: Calculate Performance Score (0-100)
    const accuracyComponent = overallAccuracy * 0.6;
    const consistencyComponent = Math.min(consistencyStreak / 30, 1) * 30; // Max 30 days = 100%
    const improvementComponent = Math.max(0, Math.min(improvementRate, 10)); // Cap at 10%
    const performanceScore = Math.round(accuracyComponent + consistencyComponent + improvementComponent);

    // NEW: Generate AI Insights
    const aiInsights: string[] = [];
    
    // Readiness message
    if (overallAccuracy > 80) {
      aiInsights.push("🚀 You're exam-ready! Let's polish your timing.");
    } else if (overallAccuracy >= 50) {
      aiInsights.push("💪 Good progress! Focus on weak topics.");
    } else {
      aiInsights.push("📚 Needs more preparation. Try mock set 2 or AI tests.");
    }

    // Improvement message
    if (improvementRate > 10) {
      aiInsights.push(`🔥 You improved ${Math.round(improvementRate)}% since your last test — keep it up!`);
    } else if (improvementRate > 0) {
      aiInsights.push(`✨ You're making progress — ${Math.round(improvementRate)}% improvement!`);
    }

    // Subject-specific tip
    if (weakestSubject !== "N/A" && lowestAccuracy < 60) {
      aiInsights.push(`⚡ You're losing marks in ${weakestSubject} — revise the basics.`);
    }

    // Performance-based motivation
    if (overallAccuracy > 85) {
      aiInsights.push("🏆 You're performing like a topper — let's push to 90%!");
    } else if (consistencyStreak >= 7) {
      aiInsights.push(`🔥 ${consistencyStreak} days streak! Consistency is key to success.`);
    }

    // Get recent test performance for graph
    const recentTests = testResults
      .sort((a, b) => b._creationTime - a._creationTime)
      .slice(0, 10)
      .reverse();

    return {
      totalTests,
      avgScore: Math.round(avgScore),
      overallAccuracy: Math.round(overallAccuracy),
      totalQuestionsAttempted,
      avgTimePerQuestion: Math.round(avgTimePerQuestion),
      totalStudyTime,
      avgQuestionsPerTest: Math.round(avgQuestionsPerTest),
      consistencyStreak,
      weeklyAccuracy: Math.round(weeklyAccuracy),
      strongestSubject,
      weakestSubject,
      improvementRate: Math.round(improvementRate),
      performanceScore,
      aiInsights,
      mockTests: {
        count: mockTests.length,
        avgScore: Math.round(mockAvgScore),
      },
      pyqTests: {
        count: pyqTests.length,
        avgScore: Math.round(pyqAvgScore),
      },
      aiTests: {
        count: aiTests.length,
        avgScore: Math.round(aiAvgScore),
      },
      recentTestPerformance: recentTests.map((r) => ({
        score: Math.round(r.score),
        type: r.testType,
        date: r._creationTime,
      })),
      subscriptionStatus: subscription?.status || "inactive",
      subscriptionEndDate: subscription?.endDate,
      subscription,
      recentContent,
    };
  },
});

// Get mock tests (from manual questions) - organized into sets of 100
export const getMockTests = query({
  args: {
    topicId: v.optional(v.id("topics")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    let questions = await ctx.db
      .query("questions")
      .withIndex("by_source", (q) => q.eq("source", "manual"))
      .filter((q) => q.eq(q.field("status"), "approved"))
      .collect();

    if (args.topicId) {
      questions = questions.filter((q) => q.topic === args.topicId);
    }

    // Group by topic
    const testsByTopic = new Map<string, typeof questions>();
    for (const q of questions) {
      const topicId = q.topic || "no-topic";
      if (!testsByTopic.has(topicId)) {
        testsByTopic.set(topicId, []);
      }
      testsByTopic.get(topicId)!.push(q);
    }

    // Get user's completed test sessions for mock tests
    const completedSessions = await ctx.db
      .query("testSessions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .filter((q) => q.eq(q.field("testType"), "mock"))
      .collect();

    const tests: any[] = [];
    
    for (const [topicId, qs] of testsByTopic.entries()) {
      const topic = topicId !== "no-topic" ? await ctx.db.get(topicId as any) : null;
      const topicIdForMatch = topicId !== "no-topic" ? topicId : null;
      
      // Organize into sets of 100 questions each
      const setSize = 100;
      const totalSets = Math.ceil(qs.length / setSize);
      
      for (let setNumber = 1; setNumber <= totalSets; setNumber++) {
        const startIndex = (setNumber - 1) * setSize;
        const endIndex = Math.min(startIndex + setSize, qs.length);
        const setQuestions = qs.slice(startIndex, endIndex);
        
        // Check if user has completed this specific set before
        const hasCompleted = completedSessions.some(
          (session) => (session.topicId || null) === topicIdForMatch && session.setNumber === setNumber
        );
        
        tests.push({
          topicId: topicIdForMatch,
          topicName: (topic as any)?.name || "General",
          setNumber,
          totalSets,
          questionCount: setQuestions.length,
          difficulty: "mixed",
          hasCompleted,
        });
      }
    }

    return tests;
  },
});

// Get AI-generated questions - organized into sets of 25
export const getAIQuestions = query({
  args: {
    topicId: v.optional(v.id("topics")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    let questions = await ctx.db
      .query("questions")
      .withIndex("by_source", (q) => q.eq("source", "ai"))
      .filter((q) => q.eq(q.field("status"), "approved"))
      .collect();

    if (args.topicId) {
      questions = questions.filter((q) => q.topic === args.topicId);
    }

    // Group by topic
    const testsByTopic = new Map<string, typeof questions>();
    for (const q of questions) {
      const topicId = q.topic || "no-topic";
      if (!testsByTopic.has(topicId)) {
        testsByTopic.set(topicId, []);
      }
      testsByTopic.get(topicId)!.push(q);
    }

    // Get user's completed test sessions for AI tests
    const completedSessions = await ctx.db
      .query("testSessions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .filter((q) => q.eq(q.field("testType"), "ai"))
      .collect();

    const tests: any[] = [];
    
    for (const [topicId, qs] of testsByTopic.entries()) {
      const topic = topicId !== "no-topic" ? await ctx.db.get(topicId as any) : null;
      const topicIdForMatch = topicId !== "no-topic" ? topicId : null;
      
      // Organize into sets of 25 questions each
      const setSize = 25;
      const totalSets = Math.ceil(qs.length / setSize);
      
      for (let setNumber = 1; setNumber <= totalSets; setNumber++) {
        const startIndex = (setNumber - 1) * setSize;
        const endIndex = Math.min(startIndex + setSize, qs.length);
        const setQuestions = qs.slice(startIndex, endIndex);
        
        // Check if user has completed this specific set before
        const hasCompleted = completedSessions.some(
          (session) => (session.topicId || null) === topicIdForMatch && session.setNumber === setNumber
        );
        
        tests.push({
          topicId: topicIdForMatch,
          topicName: (topic as any)?.name || "General",
          setNumber,
          totalSets,
          questionCount: setQuestions.length,
          difficulty: "mixed",
          hasCompleted,
        });
      }
    }

    return tests;
  },
});

// Get PYQ sets (organized by exam and year) - sets of 20 questions each
export const getPYQSets = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
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
      const year = parseInt(q.examYear || "0") || 0;
      const key = `${examName}_${year}`;
      if (!setsByExamYear.has(key)) {
        setsByExamYear.set(key, []);
      }
      setsByExamYear.get(key)!.push(q);
    }

    // Get user's completed test sessions for PYQ tests
    const completedSessions = await ctx.db
      .query("testSessions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .filter((q) => q.eq(q.field("testType"), "pyq"))
      .collect();

    const sets: any[] = [];
    
    for (const [key, qs] of setsByExamYear.entries()) {
      const [examName, yearStr] = key.split("_");
      const year = parseInt(yearStr);
      
      // Only create sets of exactly 20 questions - ignore remainder
      const setSize = 20;
      const totalCompleteSets = Math.floor(qs.length / setSize);
      
      // Only show complete sets
      for (let setNumber = 1; setNumber <= totalCompleteSets; setNumber++) {
        const startIndex = (setNumber - 1) * setSize;
        const endIndex = startIndex + setSize;
        const setQuestions = qs.slice(startIndex, endIndex);
        
        // Check if user has completed this PYQ set before
        const hasCompleted = completedSessions.some(
          (session) => session.year === year && session.setNumber === setNumber
        );
        
        sets.push({
          examName,
          year,
          setNumber,
          totalSets: totalCompleteSets,
          questionCount: setQuestions.length,
          subjects: [...new Set(setQuestions.map((q) => q.subject).filter(Boolean))],
          hasCompleted,
        });
      }
    }

    return sets.sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return a.setNumber - b.setNumber;
    });
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
      return [];
    }

    // Enforce 10-100 question limit
    const limit = args.limit ? Math.min(Math.max(args.limit, 10), 100) : 10;

    let questions = await ctx.db
      .query("questions")
      .filter((q) => q.eq(q.field("status"), "approved"))
      .collect();

    if (args.topicId) {
      questions = questions.filter((q) => q.topic === args.topicId);
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

// Get questions for a specific test - with set support
export const getTestQuestions = query({
  args: {
    testType: v.string(),
    topicId: v.optional(v.id("topics")),
    year: v.optional(v.number()),
    setNumber: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    let questions: any[] = [];

    if (args.testType === "mock") {
      // Get manual questions for mock test
      questions = await ctx.db
        .query("questions")
        .withIndex("by_source", (q) => q.eq("source", "manual"))
        .filter((q) => q.eq(q.field("status"), "approved"))
        .collect();

      if (args.topicId) {
        questions = questions.filter((q) => q.topicId === args.topicId);
      }
      
      // Apply set filtering for mock tests (100 questions per set)
      if (args.setNumber) {
        const setSize = 100;
        const startIndex = (args.setNumber - 1) * setSize;
        const endIndex = startIndex + setSize;
        questions = questions.slice(startIndex, endIndex);
      }
    } else if (args.testType === "pyq") {
      // Get PYQ questions
      questions = await ctx.db
        .query("questions")
        .withIndex("by_source", (q) => q.eq("source", "pyq"))
        .filter((q) => q.eq(q.field("status"), "approved"))
        .collect();

      if (args.year) {
        questions = questions.filter((q) => q.year === args.year);
      }
      
      // Apply set filtering for PYQ (20 questions per set)
      if (args.setNumber) {
        const setSize = 20;
        const startIndex = (args.setNumber - 1) * setSize;
        const endIndex = startIndex + setSize;
        questions = questions.slice(startIndex, endIndex);
      }
    } else if (args.testType === "ai") {
      // Get AI questions
      questions = await ctx.db
        .query("questions")
        .withIndex("by_source", (q) => q.eq("source", "ai"))
        .filter((q) => q.eq(q.field("status"), "approved"))
        .collect();

      if (args.topicId) {
        questions = questions.filter((q) => q.topicId === args.topicId);
      }
      
      // Apply set filtering for AI (25 questions per set)
      if (args.setNumber) {
        const setSize = 25;
        const startIndex = (args.setNumber - 1) * setSize;
        const endIndex = startIndex + setSize;
        questions = questions.slice(startIndex, endIndex);
      }
    } else {
      questions = [];
    }

    // For mock tests, shuffle within the set; for PYQ and AI, maintain order
    if (args.testType === "mock") {
      questions = questions.sort(() => Math.random() - 0.5);
    }

    return questions;
  },
});

// Start a test session - with set support
export const startTest = mutation({
  args: {
    testType: v.string(),
    topicId: v.optional(v.id("topics")),
    year: v.optional(v.number()),
    setNumber: v.optional(v.number()),
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
      setNumber: args.setNumber,
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

    // ROBUST ANSWER VALIDATION - Fixed to handle all edge cases
    const answersWithCorrectness = args.answers.map((ans) => {
      const question = questions.find((q) => q?._id === ans.questionId);
      
      if (!question) {
        console.error(`Question not found for ID: ${ans.questionId}`);
        return {
          ...ans,
          isCorrect: false,
        };
      }
      
      // Robust normalization - trim, lowercase, and normalize spaces
      const normalize = (text: string) => {
        if (!text) return "";
        return text.trim().toLowerCase().replace(/\s+/g, ' ');
      };
      
      const userAnswer = normalize(ans.answer);
      const correctAnswer = normalize(question.correctAnswer || "");
      
      // Debug logging
      console.log("=== Answer Validation Debug ===");
      console.log("Question:", question.question);
      console.log("User Answer (raw):", ans.answer);
      console.log("User Answer (normalized):", userAnswer);
      console.log("Correct Answer (raw):", question.correctAnswer);
      console.log("Correct Answer (normalized):", correctAnswer);
      
      let isCorrect = false;
      
      // For MCQs, find the correct option explicitly
      if (question.options && question.options.length > 0) {
        console.log("Options (raw):", question.options);
        const normalizedOptions = question.options.map(opt => normalize(opt));
        console.log("Options (normalized):", normalizedOptions);
        
        // Find which option index matches the correctAnswer field
        let correctOptionIndex = -1;
        for (let i = 0; i < question.options.length; i++) {
          if (normalize(question.options[i]) === correctAnswer) {
            correctOptionIndex = i;
            break;
          }
        }
        
        console.log("Correct Option Index:", correctOptionIndex);
        console.log("Correct Option Text:", correctOptionIndex >= 0 ? question.options[correctOptionIndex] : "NOT FOUND");
        
        // Find which option the user selected
        let userOptionIndex = -1;
        for (let i = 0; i < question.options.length; i++) {
          if (normalize(question.options[i]) === userAnswer) {
            userOptionIndex = i;
            break;
          }
        }
        
        console.log("User Option Index:", userOptionIndex);
        console.log("User Option Text:", userOptionIndex >= 0 ? question.options[userOptionIndex] : "NOT FOUND");
        
        // Compare by index if both found
        if (correctOptionIndex >= 0 && userOptionIndex >= 0) {
          isCorrect = correctOptionIndex === userOptionIndex;
        } else {
          // Fallback to direct text comparison
          isCorrect = userAnswer === correctAnswer;
        }
      } else {
        // Non-MCQ: direct comparison
        isCorrect = userAnswer === correctAnswer;
      }
      
      console.log("Is Correct:", isCorrect);
      console.log("==============================");
      
      return {
        ...ans,
        isCorrect,
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

// Get test results - OPTIMIZED VERSION
export const getTestResults = query({
  args: {
    sessionId: v.id("testSessions"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return null;
    }

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== user._id) {
      throw new Error("Invalid session");
    }

    const result = await ctx.db
      .query("testResults")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();

    // Fetch questions in parallel with better error handling
    const questions = await Promise.all(
      session.questionIds.map(async (id) => {
        try {
          const q = await ctx.db.get(id);
          if (!q) return null;
          const userAnswer = session.answers?.find((a) => a.questionId === id);
          return {
            ...q,
            userAnswer: userAnswer?.answer,
            isCorrect: userAnswer?.isCorrect,
          };
        } catch (error) {
          console.error(`Failed to fetch question ${id}:`, error);
          return null;
        }
      })
    );

    // Filter out any null questions
    const validQuestions = questions.filter((q) => q !== null);

    // OPTIMIZED: Calculate rank only from relevant sessions (same test configuration)
    // Use indexed query and limit results
    let relevantSessions = await ctx.db
      .query("testSessions")
      .withIndex("by_user", (q) => q.eq("userId", session.userId))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .filter((q) => q.eq(q.field("testType"), session.testType))
      .collect();

    // Filter by topic/year/setNumber in memory (more efficient than multiple DB queries)
    relevantSessions = relevantSessions.filter((s) => {
      if (session.testType === "mock" || session.testType === "ai") {
        return s.topicId === session.topicId && s.setNumber === session.setNumber;
      } else if (session.testType === "pyq") {
        return s.year === session.year && s.setNumber === session.setNumber;
      }
      return false;
    });

    // Get all users who completed this same test (not just current user)
    const allRelevantSessions = await ctx.db
      .query("testSessions")
      .filter((q) => q.eq(q.field("status"), "completed"))
      .filter((q) => q.eq(q.field("testType"), session.testType))
      .collect();

    // Filter in memory for better performance
    const matchingSessions = allRelevantSessions.filter((s) => {
      if (session.testType === "mock" || session.testType === "ai") {
        return s.topicId === session.topicId && s.setNumber === session.setNumber && s.score !== undefined;
      } else if (session.testType === "pyq") {
        return s.year === session.year && s.setNumber === session.setNumber && s.score !== undefined;
      }
      return false;
    });

    // Sort by score (descending) to calculate rank
    const sortedSessions = matchingSessions.sort((a, b) => (b.score || 0) - (a.score || 0));

    const rank = sortedSessions.findIndex((s) => s._id === session._id) + 1;
    const totalCandidates = sortedSessions.length;

    return {
      session,
      result,
      questions: validQuestions,
      rank,
      totalCandidates,
    };
  },
});

// Get student test history
export const getTestHistory = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
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
      return { hasAccess: true, subscription, isPaid: true };
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
        isPaid: false,
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

// New query to check if a specific test type can be accessed
export const canAccessTestType = query({
  args: {
    testType: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return { canAccess: false, reason: "not_authenticated" };
    }

    // Check for active subscription
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    if (subscription && subscription.endDate >= Date.now()) {
      return { canAccess: true, reason: "paid_subscription" };
    }

    // Check if user has used their free trial for this test type
    const completedTests = await ctx.db
      .query("testSessions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .filter((q) => q.eq(q.field("testType"), args.testType))
      .collect();

    if (completedTests.length === 0) {
      return { canAccess: true, reason: "free_trial" };
    }

    return { canAccess: false, reason: "free_trial_used" };
  },
});