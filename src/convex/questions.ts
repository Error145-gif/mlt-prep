import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
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
        const content = await ctx.db.get(q.contentId);
        const topic = q.topicId ? await ctx.db.get(q.topicId) : null;
        return {
          ...q,
          contentTitle: content?.title || "Unknown",
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
    contentId: v.id("content"),
    topicId: v.optional(v.id("topics")),
    type: v.string(),
    question: v.string(),
    options: v.optional(v.array(v.string())),
    correctAnswer: v.string(),
    explanation: v.optional(v.string()),
    difficulty: v.optional(v.string()),
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
