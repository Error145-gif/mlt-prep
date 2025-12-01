// @ts-nocheck
"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import OpenAI from "openai";

// Initialize OpenRouter client for Mistral access
const getOpenRouterClient = () => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY environment variable is not set");
  }
  
  return new OpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': 'https://mlt-prep.com',
      'X-Title': 'MLT Prep',
    },
  });
};

// Auto-generate 100 MLT questions using Mistral
export const autoGenerateMistralQuestions = action({
  args: {
    topicId: v.optional(v.id("topics")),
  },
  handler: async (ctx, args) => {
    console.log("Starting Mistral AI question generation...");
    
    const openrouter = getOpenRouterClient();
    
    const prompt = `You are an expert Medical Lab Technology exam question generator.
Generate 100 high-quality MCQs in JSON array only.
Each object must have:
{
  "question": "...",
  "options": ["...", "...", "...", "..."],
  "answer": "...",
  "explanation": "...",
  "subject": "...",
  "topic": "...",
  "difficulty": "Easy" | "Medium" | "Hard",
  "type": "MCQ"
}

Make sure:
- All questions are unique
- Follows real MLT exam style covering Hematology, Biochemistry, Microbiology, Immunology, Clinical Pathology, etc.
- No markdown, no text outside JSON
- Output must be a valid JSON array only
- Answer must be one of the exact options provided`;

    try {
      const completion = await openrouter.chat.completions.create({
        model: 'mistralai/mistral-small',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 16000,
      } as any);

      const responseText = (completion.choices[0] as any)?.message?.content;
      if (!responseText) {
        throw new Error("No response from Mistral API");
      }

      console.log("Received response from Mistral, parsing JSON...");

      // Extract JSON from response (handle potential markdown wrapping)
      let jsonText = responseText.trim();
      const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }

      const questions = JSON.parse(jsonText);

      if (!Array.isArray(questions)) {
        throw new Error("Response is not a valid JSON array");
      }

      console.log(`Parsed ${questions.length} questions from Mistral`);

      // Validate and prepare questions
      const validQuestions = questions
        .filter((q: any) => {
          return (
            q.question &&
            Array.isArray(q.options) &&
            q.options.length === 4 &&
            q.answer &&
            q.subject &&
            q.difficulty
          );
        })
        .map((q: any) => ({
          type: "mcq",
          question: q.question,
          options: q.options,
          correctAnswer: q.answer,
          explanation: q.explanation || "",
          difficulty: q.difficulty.toLowerCase(),
          subject: q.subject,
          source: "ai",
          topicId: args.topicId,
        }));

      console.log(`${validQuestions.length} valid questions after filtering`);

      if (validQuestions.length === 0) {
        throw new Error("No valid questions generated");
      }

      // Save questions in chunks of 10
      const CHUNK_SIZE = 10;
      const savedIds: Array<Id<"questions"> | null> = [];

      for (let i = 0; i < validQuestions.length; i += CHUNK_SIZE) {
        const chunk = validQuestions.slice(i, i + CHUNK_SIZE);
        console.log(`Saving chunk ${Math.floor(i / CHUNK_SIZE) + 1}/${Math.ceil(validQuestions.length / CHUNK_SIZE)}`);

        for (const question of chunk) {
          try {
            // Call the internal mutation without createdBy - it will be set by the mutation itself
            const id = await ctx.runMutation(internal.questions.createQuestionInternalFromAction, {
              type: question.type,
              question: question.question,
              options: question.options,
              correctAnswer: question.correctAnswer,
              explanation: question.explanation,
              difficulty: question.difficulty,
              subject: question.subject,
              topic: "General",
              topicId: args.topicId, // Pass the topicId
              source: "ai",
            });
            savedIds.push(id);
          } catch (error) {
            console.error("Failed to save question:", error);
            savedIds.push(null);
          }
        }

        // Small delay between chunks
        if (i + CHUNK_SIZE < validQuestions.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      const successCount = savedIds.filter(id => id !== null).length;

      console.log(`Successfully saved ${successCount}/${validQuestions.length} questions`);

      return {
        success: true,
        generated: questions.length,
        valid: validQuestions.length,
        saved: successCount,
        message: `✅ ${successCount} AI Questions Generated & Saved Successfully!`,
      };

    } catch (error: any) {
      console.error("Error in Mistral question generation:", error);
      
      if (error.message?.includes("OPENROUTER_API_KEY")) {
        throw new Error("OpenRouter API key not configured. Please add OPENROUTER_API_KEY to environment variables.");
      }
      
      throw new Error(`Failed to generate questions: ${error.message || 'Unknown error'}`);
    }
  },
});

// Legacy disabled functions
export const generateQuestionsFromAI = action({
  args: {
    questionCount: v.number(),
    difficulty: v.optional(v.string()),
    topicId: v.optional(v.id("topics")),
  },
  handler: async () => {
    throw new Error("AI question generation has been disabled. Please use manual question entry instead.");
  },
});

export const generateQuestionsFromPDF = action({
  args: {
    fileId: v.id("_storage"),
  },
  handler: async () => {
    throw new Error("AI question generation from PDF has been disabled. Please use manual question entry instead.");
  },
});

export const extractPYQFromPDF = action({
  args: {
    fileId: v.id("_storage"),
  },
  handler: async () => {
    throw new Error("PYQ extraction from PDF has been disabled. Please use manual PYQ entry instead.");
  },
});

export const batchCreateQuestions = action({
  args: {
    questions: v.array(v.any()),
  },
  handler: async (ctx, args): Promise<Array<Id<"questions"> | null>> => {
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
      
      if (i + CHUNK_SIZE < args.questions.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`Batch creation complete: ${results.filter(r => r !== null).length}/${args.questions.length} questions created successfully`);
    return results;
  },
});