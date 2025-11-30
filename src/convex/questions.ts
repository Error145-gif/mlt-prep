// @ts-nocheck
import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { getCurrentUser } from "./users";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get questions with filters
export const getQuestions = query({
  args: {
    status: v.optional(v.string()),
    topic: v.optional(v.string()),
    sectionId: v.optional(v.id("sections")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      return [];
    }

    let questions;

    if (args.status) {
      questions = await ctx.db
        .query("questions")
        .withIndex("by_status", (q) => q.eq("status", args.status as any))
        .collect();
    } else if (args.topic) {
      questions = await ctx.db
        .query("questions")
        .withIndex("by_topic", (q) => q.eq("topic", args.topic!))
        .collect();
    } else if (args.sectionId) {
      questions = await ctx.db
        .query("questions")
        .withIndex("by_section", (q) => q.eq("sectionId", args.sectionId))
        .collect();
    } else {
      questions = await ctx.db.query("questions").collect();
    }

    // Generate fresh image URLs
    return await Promise.all(
      questions.map(async (q) => {
        if (q.imageStorageId) {
          const url = await ctx.storage.getUrl(q.imageStorageId);
          return { ...q, imageUrl: url || q.imageUrl };
        }
        return q;
      })
    );
  },
});

// Get questions by section
export const getQuestionsBySection = query({
  args: { sectionId: v.id("sections") },
  handler: async (ctx, args) => {
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_section", (q) => q.eq("sectionId", args.sectionId))
      .collect();
    
    // Generate fresh image URLs
    return await Promise.all(
      questions.map(async (q) => {
        if (q.imageStorageId) {
          const url = await ctx.storage.getUrl(q.imageStorageId);
          return { ...q, imageUrl: url || q.imageUrl };
        }
        return q;
      })
    );
  },
});

// Get unassigned questions (leftover questions that don't form complete sets)
export const getUnassignedQuestions = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      return {
        manual: [],
        ai: [],
        pyq: [],
        counts: { manual: 0, ai: 0, pyq: 0 }
      };
    }

    // Get all approved questions by source
    const manualQuestions = await ctx.db
      .query("questions")
      .withIndex("by_source", (q) => q.eq("source", "manual"))
      .filter((q) => q.eq(q.field("status"), "approved"))
      .collect();

    const aiQuestions = await ctx.db
      .query("questions")
      .withIndex("by_source", (q) => q.eq("source", "ai"))
      .filter((q) => q.eq(q.field("status"), "approved"))
      .collect();

    const pyqQuestions = await ctx.db
      .query("questions")
      .withIndex("by_source", (q) => q.eq("source", "pyq"))
      .filter((q) => q.eq(q.field("status"), "approved"))
      .collect();

    // Calculate leftover questions (questions that don't form complete sets)
    const manualLeftover = manualQuestions.length % 100;
    const aiLeftover = aiQuestions.length % 25;
    const pyqLeftover = pyqQuestions.length % 20;

    // Get the actual leftover questions (last incomplete set)
    const manualUnassigned = manualLeftover > 0 
      ? manualQuestions.slice(-manualLeftover) 
      : [];
    
    const aiUnassigned = aiLeftover > 0 
      ? aiQuestions.slice(-aiLeftover) 
      : [];
    
    const pyqUnassigned = pyqLeftover > 0 
      ? pyqQuestions.slice(-pyqLeftover) 
      : [];

    // Helper to enrich with URLs
    const enrich = async (qs: any[]) => {
      return await Promise.all(
        qs.map(async (q) => {
          if (q.imageStorageId) {
            const url = await ctx.storage.getUrl(q.imageStorageId);
            return { ...q, imageUrl: url || q.imageUrl };
          }
          return q;
        })
      );
    };

    return {
      manual: await enrich(manualUnassigned),
      ai: await enrich(aiUnassigned),
      pyq: await enrich(pyqUnassigned),
      counts: {
        manual: manualLeftover,
        ai: aiLeftover,
        pyq: pyqLeftover,
      },
    };
  },
});

// Get question statistics with section breakdown
export const getQuestionStatsWithSections = query({
  args: {},
  handler: async (ctx) => {
    const allQuestions = await ctx.db.query("questions").collect();
    
    const stats = {
      total: allQuestions.length,
      bySource: {
        manual: allQuestions.filter(q => q.source === "manual").length,
        ai: allQuestions.filter(q => q.source === "ai").length,
        pyq: allQuestions.filter(q => q.source === "pyq").length,
      },
      byDifficulty: {
        easy: allQuestions.filter(q => q.difficulty === "easy").length,
        medium: allQuestions.filter(q => q.difficulty === "medium").length,
        hard: allQuestions.filter(q => q.difficulty === "hard").length,
      },
      bySection: {} as Record<string, number>,
      unassigned: allQuestions.filter(q => !q.sectionId).length,
    };

    // Count questions per section
    const sections = await ctx.db.query("sections").collect();
    for (const section of sections) {
      const count = allQuestions.filter(q => q.sectionId === section._id).length;
      stats.bySection[section.name] = count;
    }

    return stats;
  },
});

// Review question (approve/reject)
export const reviewQuestion = mutation({
  args: {
    id: v.id("questions"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      status: args.status as any,
      reviewedBy: user._id,
      reviewedAt: Date.now(),
    });

    return args.id;
  },
});

// Create question manually
export const createQuestion = mutation({
  args: {
    text: v.string(),
    options: v.array(v.string()),
    correctAnswer: v.string(),
    explanation: v.optional(v.string()),
    image: v.optional(v.string()),
    topicId: v.optional(v.id("topics")),
    subtopicId: v.optional(v.string()),
    difficulty: v.optional(v.string()),
    source: v.optional(v.string()),
    testSetId: v.optional(v.id("testSets")),
    examName: v.optional(v.string()),
    year: v.optional(v.number()),
    setNumber: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const hasImage = !!args.image;
    const questionId = await ctx.db.insert("questions", {
      ...args,
      hasImage,
      isPYQ: args.source === "pyq",
    });
    return questionId;
  },
});

// Create image-based question
export const createImageQuestion = mutation({
  args: {
    type: v.string(),
    question: v.string(),
    options: v.optional(v.array(v.string())),
    correctAnswer: v.string(),
    explanation: v.optional(v.string()),
    difficulty: v.optional(v.string()),
    source: v.string(), // "ai" or "manual"
    subject: v.optional(v.string()),
    topic: v.string(),
    imageStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // Get image URL from storage
    const imageUrl = await ctx.storage.getUrl(args.imageStorageId);
    if (!imageUrl) {
      throw new Error("Failed to get image URL");
    }

    return await ctx.db.insert("questions", {
      question: args.question,
      options: args.options || [],
      correctAnswer: args.correctAnswer,
      subject: args.subject || "General",
      topic: args.topic,
      difficulty: (args.difficulty || "medium") as "easy" | "medium" | "hard",
      type: args.type as any,
      status: "approved",
      reviewedBy: user._id,
      reviewedAt: Date.now(),
      createdBy: user._id,
      source: args.source as "manual" | "ai" | "pyq",
      explanation: args.explanation,
      imageUrl: imageUrl,
      imageStorageId: args.imageStorageId,
      hasImage: true,
    });
  },
});

// Batch create questions (for bulk manual entry)
export const batchCreateQuestions = mutation({
  args: {
    questions: v.array(
      v.object({
        text: v.string(),
        options: v.array(v.string()),
        correctAnswer: v.string(),
        explanation: v.optional(v.string()),
        image: v.optional(v.string()),
        topicId: v.optional(v.id("topics")),
        subtopicId: v.optional(v.string()),
        difficulty: v.optional(v.string()),
        source: v.optional(v.string()),
        testSetId: v.optional(v.id("testSets")),
        examName: v.optional(v.string()),
        year: v.optional(v.number()),
        setNumber: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const question of args.questions) {
      await ctx.db.insert("questions", {
        ...question,
        hasImage: !!question.image,
        isPYQ: question.source === "pyq",
      });
    }
  },
});

// Batch create image-based questions
export const batchCreateImageQuestions = mutation({
  args: {
    questions: v.array(
      v.object({
        type: v.string(),
        question: v.string(),
        options: v.optional(v.array(v.string())),
        correctAnswer: v.string(),
        explanation: v.optional(v.string()),
        difficulty: v.optional(v.string()),
        source: v.string(),
        subject: v.optional(v.string()),
        topic: v.string(),
        imageStorageId: v.id("_storage"),
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    if (args.questions.length > 50) {
      throw new Error("Cannot add more than 50 questions at once");
    }

    const ids = [];
    for (let i = 0; i < args.questions.length; i++) {
      const question = args.questions[i];
      try {
        const imageUrl = await ctx.storage.getUrl(question.imageStorageId);
        if (!imageUrl) {
          throw new Error(`Failed to get image URL for question ${i + 1}`);
        }

        const id = await ctx.db.insert("questions", {
          question: question.question,
          options: question.options || [],
          correctAnswer: question.correctAnswer,
          subject: question.subject || "General",
          topic: question.topic,
          difficulty: (question.difficulty || "medium") as "easy" | "medium" | "hard",
          type: question.type as any,
          status: "approved",
          reviewedBy: user._id,
          reviewedAt: Date.now(),
          createdBy: user._id,
          source: question.source as "manual" | "ai" | "pyq",
          explanation: question.explanation,
          imageUrl: imageUrl,
          imageStorageId: question.imageStorageId,
          hasImage: true,
        });
        ids.push(id);
      } catch (error) {
        console.error(`Failed to insert image question ${i + 1}:`, error);
        throw new Error(`Failed to insert image question ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return ids;
  },
});

// Internal mutation for batch creation (used by actions)
export const createQuestionInternal = internalMutation({
  args: {
    type: v.string(),
    question: v.string(),
    options: v.optional(v.array(v.string())),
    correctAnswer: v.string(),
    explanation: v.optional(v.string()),
    difficulty: v.optional(v.string()),
    source: v.optional(v.string()),
    examName: v.optional(v.string()),
    subject: v.optional(v.string()),
    topic: v.string(),
    sectionId: v.optional(v.id("sections")),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("questions", {
      question: args.question,
      options: args.options || [],
      correctAnswer: args.correctAnswer,
      subject: args.subject || "General",
      topic: args.topic,
      difficulty: (args.difficulty || "medium") as "easy" | "medium" | "hard",
      type: args.type as any,
      source: (args.source || "manual") as "manual" | "ai" | "pyq",
      status: "approved",
      createdBy: args.createdBy,
      reviewedBy: args.createdBy,
      reviewedAt: Date.now(),
      explanation: args.explanation,
      examName: args.examName,
      sectionId: args.sectionId,
    });
  },
});

// Internal mutation for AI-generated questions (doesn't require createdBy from caller)
export const createQuestionInternalFromAction = internalMutation({
  args: {
    type: v.string(),
    question: v.string(),
    options: v.optional(v.array(v.string())),
    correctAnswer: v.string(),
    explanation: v.optional(v.string()),
    difficulty: v.optional(v.string()),
    source: v.optional(v.string()),
    examName: v.optional(v.string()),
    subject: v.optional(v.string()),
    topic: v.string(),
    sectionId: v.optional(v.id("sections")),
  },
  handler: async (ctx, args) => {
    // For AI-generated questions, we don't need a specific user
    return await ctx.db.insert("questions", {
      question: args.question,
      options: args.options || [],
      correctAnswer: args.correctAnswer,
      subject: args.subject || "General",
      topic: args.topic,
      difficulty: (args.difficulty || "medium") as "easy" | "medium" | "hard",
      type: args.type as any,
      source: (args.source || "ai") as "manual" | "ai" | "pyq",
      status: "approved",
      reviewedAt: Date.now(),
      explanation: args.explanation,
      examName: args.examName,
      sectionId: args.sectionId,
    });
  },
});

// Delete question
export const deleteQuestion = mutation({
  args: { id: v.id("questions") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Create mock test with bulk questions
export const createMockTestWithQuestions = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    duration: v.number(),
    questions: v.array(
      v.object({
        text: v.string(),
        options: v.array(v.string()),
        correctAnswer: v.string(),
        explanation: v.optional(v.string()),
        image: v.optional(v.string()),
        topicId: v.optional(v.id("topics")),
        subtopicId: v.optional(v.string()),
        difficulty: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const testSetId = await ctx.db.insert("testSets", {
      name: args.title,
      description: args.description,
      duration: args.duration,
      type: "mock",
      isActive: true,
    });

    for (const q of args.questions) {
      await ctx.db.insert("questions", {
        ...q,
        testSetId,
        source: "manual",
        hasImage: !!q.image,
      });
    }
    return testSetId;
  },
});

// Create AI test with bulk questions
export const createAITestWithQuestions = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    duration: v.number(),
    questions: v.array(
      v.object({
        text: v.string(),
        options: v.array(v.string()),
        correctAnswer: v.string(),
        explanation: v.optional(v.string()),
        image: v.optional(v.string()),
        topicId: v.optional(v.id("topics")),
        subtopicId: v.optional(v.string()),
        difficulty: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const testSetId = await ctx.db.insert("testSets", {
      name: args.title,
      description: args.description,
      duration: args.duration,
      type: "ai",
      isActive: true,
    });

    for (const q of args.questions) {
      await ctx.db.insert("questions", {
        ...q,
        testSetId,
        source: "ai",
        hasImage: !!q.image,
      });
    }
    return testSetId;
  },
});

// Create PYQ test with bulk questions (automatically splits into sets of 20)
export const createPYQTestWithQuestions = mutation({
  args: {
    examName: v.string(),
    year: v.number(),
    setNumber: v.number(),
    duration: v.number(),
    questions: v.array(
      v.object({
        text: v.string(),
        options: v.array(v.string()),
        correctAnswer: v.string(),
        explanation: v.optional(v.string()),
        image: v.optional(v.string()),
        topicId: v.optional(v.id("topics")),
        subtopicId: v.optional(v.string()),
        difficulty: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const testSetId = await ctx.db.insert("testSets", {
      name: `${args.examName} ${args.year} - Set ${args.setNumber}`,
      description: `Previous Year Question Paper for ${args.examName} (${args.year})`,
      duration: args.duration,
      type: "pyq",
      isActive: true,
      examName: args.examName,
      year: args.year,
      setNumber: args.setNumber,
    });

    for (const q of args.questions) {
      await ctx.db.insert("questions", {
        ...q,
        testSetId,
        source: "pyq",
        examName: args.examName,
        year: args.year,
        setNumber: args.setNumber,
        isPYQ: true,
        hasImage: !!q.image,
      });
    }
    return testSetId;
  },
});

// Delete all AI-based questions
export const deleteAllAIQuestions = mutation({
  args: {},
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // Get all AI questions
    const aiQuestions = await ctx.db
      .query("questions")
      .withIndex("by_source", (q) => q.eq("source", "ai"))
      .collect();

    console.log(`Found ${aiQuestions.length} AI questions to delete`);

    // Delete all AI questions
    let deletedCount = 0;
    for (const question of aiQuestions) {
      try {
        await ctx.db.delete(question._id);
        deletedCount++;
      } catch (error) {
        console.error(`Failed to delete question ${question._id}:`, error);
      }
    }

    console.log(`Successfully deleted ${deletedCount} AI questions`);

    return {
      success: true,
      deletedCount,
      totalFound: aiQuestions.length,
    };
  },
});

// Delete all questions by source type
export const deleteAllQuestionsBySource = mutation({
  args: {
    source: v.string(), // "manual", "ai", or "pyq"
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // Validate source type
    if (!["manual", "ai", "pyq"].includes(args.source)) {
      throw new Error("Invalid source type. Must be 'manual', 'ai', or 'pyq'");
    }

    // Get all questions with the specified source
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_source", (q) => q.eq("source", args.source as any))
      .collect();

    console.log(`Found ${questions.length} questions with source '${args.source}' to delete`);

    // Delete all questions
    let deletedCount = 0;
    for (const question of questions) {
      try {
        await ctx.db.delete(question._id);
        deletedCount++;
      } catch (error) {
        console.error(`Failed to delete question ${question._id}:`, error);
      }
    }

    console.log(`Successfully deleted ${deletedCount} questions with source '${args.source}'`);

    return {
      success: true,
      deletedCount,
      totalFound: questions.length,
      source: args.source,
    };
  },
});

// Bulk delete questions
export const bulkDeleteQuestions = mutation({
  args: { questionIds: v.array(v.id("questions")) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    let deletedCount = 0;
    const sectionIds = new Set<string>();

    for (const questionId of args.questionIds) {
      const question = await ctx.db.get(questionId);
      if (question && question.sectionId) {
        sectionIds.add(question.sectionId);
      }
      await ctx.db.delete(questionId);
      deletedCount++;
    }

    // Update section question counts
    for (const sectionId of sectionIds) {
      const questions = await ctx.db
        .query("questions")
        .withIndex("by_section", (q) => q.eq("sectionId", sectionId as any))
        .collect();
      await ctx.db.patch(sectionId as any, { questionCount: questions.length });
    }

    return { success: true, deletedCount };
  },
});

// Enhanced bulk add with section assignment
export const bulkAddQuestionsWithSection = mutation({
  args: {
    questions: v.array(v.object({
      question: v.string(),
      options: v.array(v.string()),
      correctAnswer: v.string(),
      subject: v.string(),
      topic: v.string(),
      difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
      type: v.union(v.literal("mcq"), v.literal("true-false"), v.literal("fill-in-the-blank")),
      source: v.union(v.literal("manual"), v.literal("ai"), v.literal("pyq")),
      explanation: v.optional(v.string()),
    })),
    sectionId: v.id("sections"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    if (args.questions.length > 100) {
      throw new Error("Cannot add more than 100 questions at once");
    }

    const questionIds = [];
    for (const question of args.questions) {
      const questionId = await ctx.db.insert("questions", {
        ...question,
        sectionId: args.sectionId,
        status: "approved",
        createdBy: userId,
        reviewedBy: userId,
        reviewedAt: Date.now(),
      });
      questionIds.push(questionId);
    }

    // Update section question count
    const section = await ctx.db.get(args.sectionId);
    if (section) {
      await ctx.db.patch(args.sectionId, {
        questionCount: section.questionCount + questionIds.length,
      });
    }

    return { success: true, count: questionIds.length, questionIds };
  },
});

// Add new mutation for automatic test set creation with shuffled options
export const autoCreateTestSets = mutation({
  args: {
    source: v.union(v.literal("manual"), v.literal("ai"), v.literal("pyq")),
    topicId: v.optional(v.id("topics")),
    examName: v.optional(v.string()),
    year: v.optional(v.number()),
  },
  handler: async (ctx, _args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // Fetch all questions of the specified source that aren't assigned to a set
    const allQuestions = await ctx.db
      .query("questions")
      .filter((q) => q.eq(q.field("source"), _args.source))
      .collect();

    // Filter questions without setNumber
    const unassignedQuestions = allQuestions.filter(q => !q.setNumber);

    if (unassignedQuestions.length === 0) {
      return { success: false, message: "No unassigned questions found" };
    }

    // Determine set size based on source
    let setSize: number;
    if (_args.source === "manual") {
      setSize = 100; // Mock tests
    } else if (_args.source === "pyq") {
      setSize = 20;
    } else {
      setSize = 25; // AI-based
    }

    // Calculate number of complete sets
    const numberOfSets = Math.floor(unassignedQuestions.length / setSize);
    
    if (numberOfSets === 0) {
      return { 
        success: false, 
        message: `Not enough questions. Need ${setSize} questions per set, found ${unassignedQuestions.length}` 
      };
    }

    // Find the highest existing set number
    const existingSets = allQuestions
      .filter(q => q.setNumber !== undefined)
      .map(q => q.setNumber as number);
    const maxSetNumber = existingSets.length > 0 ? Math.max(...existingSets) : 0;

    let questionsProcessed = 0;
    let lastCorrectPosition = -1;

    // Helper function to shuffle options and track correct answer
    const shuffleOptions = (options: string[], correctAnswer: string, avoidPosition: number) => {
      if (!options || options.length === 0) {
        return { shuffledOptions: [], newCorrectAnswer: correctAnswer };
      }

      const correctIndex = options.findIndex(opt => 
        opt.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
      );

      if (correctIndex === -1) {
        return { shuffledOptions: options, newCorrectAnswer: correctAnswer };
      }

      let shuffledOptions = [...options];
      let attempts = 0;
      let newCorrectIndex = correctIndex;

      // Shuffle until correct answer is not in the same position as last question
      do {
        shuffledOptions = [...options].sort(() => Math.random() - 0.5);
        newCorrectIndex = shuffledOptions.findIndex(opt => 
          opt.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
        );
        attempts++;
      } while (newCorrectIndex === avoidPosition && attempts < 10 && options.length > 1);

      return {
        shuffledOptions,
        newCorrectAnswer: shuffledOptions[newCorrectIndex]
      };
    };

    // Process each set
    for (let setNum = 1; setNum <= numberOfSets; setNum++) {
      const setNumber = maxSetNumber + setNum;
      const startIdx = (setNum - 1) * setSize;
      const endIdx = startIdx + setSize;
      const setQuestions = unassignedQuestions.slice(startIdx, endIdx);

      lastCorrectPosition = -1;

      // Update each question in the set with shuffled options
      for (const question of setQuestions) {
        if (question.type === "mcq" && question.options && question.options.length > 0) {
          const { shuffledOptions, newCorrectAnswer } = shuffleOptions(
            question.options,
            question.correctAnswer,
            lastCorrectPosition
          );

          // Track the new position of correct answer
          lastCorrectPosition = shuffledOptions.findIndex(opt =>
            opt.trim().toLowerCase() === newCorrectAnswer.trim().toLowerCase()
          );

          await ctx.db.patch(question._id, {
            setNumber,
            options: shuffledOptions,
            correctAnswer: newCorrectAnswer,
          });
        } else {
          // For non-MCQ questions, just assign set number
          await ctx.db.patch(question._id, {
            setNumber,
          });
        }

        questionsProcessed++;
      }
    }

    return {
      success: true,
      message: `Successfully created ${numberOfSets} test sets with ${questionsProcessed} questions`,
      setsCreated: numberOfSets,
      questionsProcessed,
    };
  },
});

// Generate upload URL for question images
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

// Update question
export const updateQuestion = mutation({
  args: {
    id: v.id("questions"),
    text: v.optional(v.string()),
    options: v.optional(v.array(v.string())),
    correctAnswer: v.optional(v.string()),
    explanation: v.optional(v.string()),
    image: v.optional(v.string()),
    topicId: v.optional(v.id("topics")),
    subtopicId: v.optional(v.string()),
    difficulty: v.optional(v.string()),
    source: v.optional(v.string()),
    testSetId: v.optional(v.id("testSets")),
    examName: v.optional(v.string()),
    year: v.optional(v.number()),
    setNumber: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    
    // Calculate hasImage if image is being updated, otherwise keep existing or check current
    let hasImageUpdate = {};
    if (fields.image !== undefined) {
        hasImageUpdate = { hasImage: !!fields.image };
    }

    await ctx.db.patch(id, {
      ...fields,
      ...hasImageUpdate,
    });
  },
});

// Backfill image tags
export const backfillImageTags = mutation({
  args: {},
  handler: async (ctx) => {
    // Process in batches to avoid "Too many reads" error
    const questions = await ctx.db
      .query("questions")
      .order("desc")
      .take(500); 

    let count = 0;
    let updated = 0;
    for (const q of questions) {
      const hasImageContent = !!(q.imageUrl || q.imageStorageId || (q as any).image);
      
      // Update if hasImage flag doesn't match reality
      if (q.hasImage !== hasImageContent) {
        await ctx.db.patch(q._id, { hasImage: hasImageContent });
        updated++;
      }
      count++;
    }

    return { 
      processed: count, 
      updated, 
      status: "Processed latest 500 questions. Run again to process more." 
    };
  },
});