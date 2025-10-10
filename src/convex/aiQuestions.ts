"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// AI question generation has been removed
// All question generation features are now disabled

export const generateQuestionsFromAI = action({
  args: {
    questionCount: v.number(),
    difficulty: v.optional(v.string()),
    topicId: v.optional(v.id("topics")),
  },
  handler: async (ctx, args) => {
    throw new Error("AI question generation has been disabled. Please use manual question entry instead.");
  },
});

export const generateQuestionsFromPDF = action({
  args: {
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    throw new Error("AI question generation from PDF has been disabled. Please use manual question entry instead.");
  },
});

export const extractPYQFromPDF = action({
  args: {
    fileId: v.id("_storage"),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    throw new Error("PYQ extraction from PDF has been disabled. Please use manual PYQ entry instead.");
  },
});

export const batchCreateQuestions = action({
  args: {
    questions: v.array(v.any()),
  },
  handler: async (ctx, args): Promise<Array<Id<"questions"> | null>> => {
    // Process questions in chunks of 10 to avoid timeout issues
    const CHUNK_SIZE = 10;
    const results: Array<Id<"questions"> | null> = [];
    
    console.log(`Starting batch creation of ${args.questions.length} questions in chunks of ${CHUNK_SIZE}`);
    
    for (let i = 0; i < args.questions.length; i += CHUNK_SIZE) {
      const chunk = args.questions.slice(i, i + CHUNK_SIZE);
      console.log(`Processing chunk ${Math.floor(i / CHUNK_SIZE) + 1}/${Math.ceil(args.questions.length / CHUNK_SIZE)} (${chunk.length} questions)`);
      
      for (const question of chunk) {
        try {
          const result: Id<"questions"> = await ctx.runMutation(internal.questions.createQuestionInternal, question);
          results.push(result);
        } catch (error) {
          console.error("Failed to create question:", error);
          results.push(null);
        }
      }
      
      // Small delay between chunks to prevent overwhelming the system
      if (i + CHUNK_SIZE < args.questions.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`Batch creation complete: ${results.filter(r => r !== null).length}/${args.questions.length} questions created successfully`);
    return results;
  },
});