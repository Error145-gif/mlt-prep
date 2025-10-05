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
      throw new Error("Unauthorized");
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