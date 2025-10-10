import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get questions with filters
export const getQuestions = query({
  args: {
    status: v.optional(v.string()),
    contentId: v.optional(v.id("content")),
    topicId: v.optional(v.id("topics")),
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
    } else if (args.contentId) {
      questions = await ctx.db
        .query("questions")
        .withIndex("by_content", (q) => q.eq("contentId", args.contentId!))
        .collect();
    } else if (args.topicId) {
      questions = await ctx.db
        .query("questions")
        .withIndex("by_topic", (q) => q.eq("topicId", args.topicId))
        .collect();
    } else {
      questions = await ctx.db.query("questions").collect();
    }

    // Enrich with content and topic info
    const enrichedQuestions = await Promise.all(
      questions.map(async (q) => {
        const content = q.contentId ? await ctx.db.get(q.contentId) : null;
        const topic = q.topicId ? await ctx.db.get(q.topicId) : null;
        return {
          ...q,
          contentTitle: content?.title || "N/A",
          topicName: topic?.name || "Unassigned",
        };
      })
    );

    return enrichedQuestions;
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
    contentId: v.optional(v.id("content")),
    topicId: v.optional(v.id("topics")),
    type: v.string(),
    question: v.string(),
    options: v.optional(v.array(v.string())),
    correctAnswer: v.string(),
    explanation: v.optional(v.string()),
    difficulty: v.optional(v.string()),
    source: v.optional(v.string()),
    year: v.optional(v.number()),
    examName: v.optional(v.string()),
    subject: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await ctx.db.insert("questions", {
      ...args,
      type: args.type as any,
      status: "approved",
      reviewedBy: user._id,
      reviewedAt: Date.now(),
      createdBy: user._id,
      source: args.source || "manual",
    });
  },
});

// Batch create questions (for bulk manual entry)
export const batchCreateQuestions = mutation({
  args: {
    questions: v.array(
      v.object({
        contentId: v.optional(v.id("content")),
        topicId: v.optional(v.id("topics")),
        type: v.string(),
        question: v.string(),
        options: v.optional(v.array(v.string())),
        correctAnswer: v.string(),
        explanation: v.optional(v.string()),
        difficulty: v.optional(v.string()),
        source: v.optional(v.string()),
        year: v.optional(v.number()),
        examName: v.optional(v.string()),
        subject: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // Limit to 50 questions per batch
    if (args.questions.length > 50) {
      throw new Error("Cannot add more than 50 questions at once");
    }

    console.log(`Backend: Attempting to insert ${args.questions.length} questions...`);

    const ids = [];
    for (let i = 0; i < args.questions.length; i++) {
      const question = args.questions[i];
      try {
        const id = await ctx.db.insert("questions", {
          ...question,
          type: question.type as any,
          status: "approved",
          reviewedBy: user._id,
          reviewedAt: Date.now(),
          createdBy: user._id,
          source: question.source || "manual",
        });
        ids.push(id);
        console.log(`Backend: Successfully inserted question ${i + 1}/${args.questions.length} with ID: ${id}`);
      } catch (error) {
        console.error(`Backend: Failed to insert question ${i + 1}:`, error);
        throw new Error(`Failed to insert question ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    console.log(`Backend: Successfully inserted all ${ids.length} questions`);
    return ids;
  },
});

// Internal mutation for batch creation (used by actions)
export const createQuestionInternal = internalMutation({
  args: {
    contentId: v.optional(v.id("content")),
    topicId: v.optional(v.id("topics")),
    type: v.string(),
    question: v.string(),
    options: v.optional(v.array(v.string())),
    correctAnswer: v.string(),
    explanation: v.optional(v.string()),
    difficulty: v.optional(v.string()),
    source: v.optional(v.string()),
    year: v.optional(v.number()),
    examName: v.optional(v.string()),
    subject: v.optional(v.string()),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("questions", {
      ...args,
      type: args.type as any,
      status: "approved",
      reviewedBy: args.createdBy,
      reviewedAt: Date.now(),
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
    testSetName: v.string(),
    topicId: v.optional(v.id("topics")),
    newTopicName: v.optional(v.string()),
    questions: v.array(
      v.object({
        type: v.string(),
        question: v.string(),
        options: v.optional(v.array(v.string())),
        correctAnswer: v.string(),
        explanation: v.optional(v.string()),
        difficulty: v.optional(v.string()),
        subject: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // Validate question count
    if (args.questions.length === 0 || args.questions.length > 100) {
      throw new Error("Please provide between 1 and 100 questions");
    }

    // Determine or create topic
    let topicId = args.topicId;
    let topicName = "";

    if (!topicId && args.newTopicName) {
      // Create new topic
      const existingTopics = await ctx.db.query("topics").collect();
      const maxOrder = Math.max(...existingTopics.map(t => t.order), 0);
      
      topicId = await ctx.db.insert("topics", {
        name: args.newTopicName,
        description: `Mock test set: ${args.testSetName}`,
        order: maxOrder + 1,
      });
      topicName = args.newTopicName;
    } else if (topicId) {
      const topic = await ctx.db.get(topicId);
      if (!topic) {
        throw new Error("Topic not found");
      }
      topicName = topic.name;
    } else {
      throw new Error("Please select a topic or provide a new topic name");
    }

    // Insert all questions
    const questionIds = [];
    for (let i = 0; i < args.questions.length; i++) {
      const question = args.questions[i];
      try {
        const id = await ctx.db.insert("questions", {
          ...question,
          type: question.type as any,
          topicId: topicId,
          status: "approved",
          reviewedBy: user._id,
          reviewedAt: Date.now(),
          createdBy: user._id,
          source: "manual",
        });
        questionIds.push(id);
      } catch (error) {
        console.error(`Failed to insert question ${i + 1}:`, error);
        throw new Error(`Failed to insert question ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return {
      success: true,
      testSetName: args.testSetName,
      topicName: topicName,
      questionCount: questionIds.length,
      topicId: topicId,
    };
  },
});

// Create AI test with bulk questions
export const createAITestWithQuestions = mutation({
  args: {
    testSetName: v.string(),
    topicId: v.optional(v.id("topics")),
    newTopicName: v.optional(v.string()),
    questions: v.array(
      v.object({
        type: v.string(),
        question: v.string(),
        options: v.optional(v.array(v.string())),
        correctAnswer: v.string(),
        explanation: v.optional(v.string()),
        difficulty: v.optional(v.string()),
        subject: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // Validate question count
    if (args.questions.length === 0 || args.questions.length > 100) {
      throw new Error("Please provide between 1 and 100 questions");
    }

    // Determine or create topic
    let topicId = args.topicId;
    let topicName = "";

    if (!topicId && args.newTopicName) {
      // Create new topic
      const existingTopics = await ctx.db.query("topics").collect();
      const maxOrder = Math.max(...existingTopics.map(t => t.order), 0);
      
      topicId = await ctx.db.insert("topics", {
        name: args.newTopicName,
        description: `AI test set: ${args.testSetName}`,
        order: maxOrder + 1,
      });
      topicName = args.newTopicName;
    } else if (topicId) {
      const topic = await ctx.db.get(topicId);
      if (!topic) {
        throw new Error("Topic not found");
      }
      topicName = topic.name;
    } else {
      throw new Error("Please select a topic or provide a new topic name");
    }

    // Insert all questions with AI source
    const questionIds = [];
    for (let i = 0; i < args.questions.length; i++) {
      const question = args.questions[i];
      try {
        const id = await ctx.db.insert("questions", {
          ...question,
          type: question.type as any,
          topicId: topicId,
          status: "approved",
          reviewedBy: user._id,
          reviewedAt: Date.now(),
          createdBy: user._id,
          source: "ai",
        });
        questionIds.push(id);
      } catch (error) {
        console.error(`Failed to insert AI question ${i + 1}:`, error);
        throw new Error(`Failed to insert AI question ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return {
      success: true,
      testSetName: args.testSetName,
      topicName: topicName,
      questionCount: questionIds.length,
      topicId: topicId,
    };
  },
});

// Create PYQ test with bulk questions (automatically splits into sets of 20)
export const createPYQTestWithQuestions = mutation({
  args: {
    examName: v.string(),
    year: v.number(),
    questions: v.array(
      v.object({
        type: v.string(),
        question: v.string(),
        options: v.optional(v.array(v.string())),
        correctAnswer: v.string(),
        explanation: v.optional(v.string()),
        difficulty: v.optional(v.string()),
        subject: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // Validate question count
    if (args.questions.length === 0) {
      throw new Error("Please provide at least 1 question");
    }

    // Split questions into sets of 20
    const setsCreated = [];
    const totalQuestions = args.questions.length;
    const questionsPerSet = 20;
    const numberOfSets = Math.ceil(totalQuestions / questionsPerSet);

    for (let setIndex = 0; setIndex < numberOfSets; setIndex++) {
      const startIdx = setIndex * questionsPerSet;
      const endIdx = Math.min(startIdx + questionsPerSet, totalQuestions);
      const setQuestions = args.questions.slice(startIdx, endIdx);
      const setNumber = setIndex + 1;

      // Insert questions for this set
      const questionIds = [];
      for (let i = 0; i < setQuestions.length; i++) {
        const question = setQuestions[i];
        try {
          const id = await ctx.db.insert("questions", {
            ...question,
            type: question.type as any,
            examName: args.examName,
            year: args.year,
            setNumber: setNumber,
            status: "approved",
            reviewedBy: user._id,
            reviewedAt: Date.now(),
            createdBy: user._id,
            source: "pyq",
          });
          questionIds.push(id);
        } catch (error) {
          console.error(`Failed to insert PYQ question ${i + 1} in set ${setNumber}:`, error);
          throw new Error(`Failed to insert PYQ question ${i + 1} in set ${setNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      setsCreated.push({
        setNumber: setNumber,
        questionCount: questionIds.length,
      });
    }

    return {
      success: true,
      examName: args.examName,
      year: args.year,
      totalQuestions: totalQuestions,
      setsCreated: setsCreated,
      numberOfSets: numberOfSets,
    };
  },
});