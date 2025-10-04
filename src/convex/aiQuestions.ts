"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// Generate questions from PDF using AI
export const generateQuestionsFromPDF = action({
  args: {
    fileId: v.id("_storage"),
    topicId: v.optional(v.id("topics")),
    questionCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get file URL
    const fileUrl = await ctx.storage.getUrl(args.fileId);
    if (!fileUrl) {
      throw new Error("File not found");
    }

    // TODO: Integrate with AI service (OpenAI, etc.) to extract text and generate questions
    // For now, return mock data structure
    const mockQuestions = [
      {
        type: "mcq",
        question: "Sample AI-generated question from PDF?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option A",
        explanation: "This is a sample explanation",
        difficulty: "medium",
        source: "ai",
      },
    ];

    return mockQuestions;
  },
});

// Extract PYQ from PDF
export const extractPYQFromPDF = action({
  args: {
    fileId: v.id("_storage"),
    year: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get file URL
    const fileUrl = await ctx.storage.getUrl(args.fileId);
    if (!fileUrl) {
      throw new Error("File not found");
    }

    // TODO: Integrate with AI service to extract PYQ questions
    // For now, return mock data structure
    const mockPYQs = [
      {
        type: "mcq",
        question: "Sample PYQ question extracted from PDF?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option A",
        explanation: "PYQ explanation",
        difficulty: "medium",
        source: "pyq",
        year: args.year || new Date().getFullYear(),
      },
    ];

    return mockPYQs;
  },
});

// Batch create questions
export const batchCreateQuestions = action({
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
        topicId: v.optional(v.id("topics")),
        year: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args): Promise<Id<"questions">[]> => {
    const results: Id<"questions">[] = [];
    
    // Get current user ID from auth
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    for (const question of args.questions) {
      const id: Id<"questions"> = await ctx.runMutation(internal.questions.createQuestionInternal, {
        ...question,
        contentId: undefined,
        createdBy: userId.subject as Id<"users">,
      });
      results.push(id);
    }

    return results;
  },
});