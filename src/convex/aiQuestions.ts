"use node";

import { v } from "convex/values";
import { action, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAuthUserId } from "@convex-dev/auth/server";

// Generate questions from PDF using AI
export const generateQuestionsFromPDF = action({
  args: {
    fileId: v.id("_storage"),
    topicId: v.optional(v.id("topics")),
    questionCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    try {
      // Initialize Google Gemini AI
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY environment variable is not set");
      }
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      // Note: Direct PDF content extraction in Convex is limited
      // The AI will generate questions based on common MLT topics
      // For actual PDF parsing, an external OCR/PDF service would be needed
      
      // Get file URL to verify it exists
      const fileUrl = await ctx.storage.getUrl(args.fileId);
      if (!fileUrl) {
        throw new Error("File not found");
      }

      // Create prompt for Gemini to generate MLT questions
      const prompt = `You are an expert Medical Lab Technology (MLT) educator. Generate ${args.questionCount || 10} high-quality multiple-choice questions covering various Medical Lab Technology topics.

For each question, provide:
1. A clear question text
2. Four options (A, B, C, D)
3. The correct answer
4. A brief explanation
5. Difficulty level (easy, medium, or hard)

Format your response as a JSON array with this structure:
[
  {
    "type": "mcq",
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Explanation here",
    "difficulty": "medium"
  }
]

Focus on creating questions that test understanding of Medical Lab Technology concepts, procedures, and principles covering topics like:
- Hematology (blood cells, coagulation, anemia)
- Microbiology (bacteria, viruses, culture techniques)
- Clinical Chemistry (enzymes, metabolites, electrolytes)
- Immunology (antibodies, antigens, immune response)
- Laboratory Safety (biosafety, quality control, equipment handling)
- Histopathology (tissue processing, staining techniques)
- Parasitology (parasites, diagnostic methods)

Make sure questions are clear, unambiguous, and educationally valuable. Return ONLY valid JSON without any markdown formatting.

Generate ${args.questionCount || 10} questions now.`;
      
      // Generate content with Gemini
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();
      
      // Parse the JSON response
      let questions;
      try {
        questions = JSON.parse(responseText);
      } catch (error) {
        console.error("Error parsing JSON response:", error);
        throw new Error("Failed to parse AI-generated questions");
      }

      return questions;
    } catch (error) {
      console.error("Error generating questions from PDF:", error);
      throw new Error(`Failed to generate questions: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Extract PYQ from PDF
export const extractPYQFromPDF = action({
  args: {
    fileId: v.id("_storage"),
    year: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    try {
      // Get file URL
      const fileUrl = await ctx.storage.getUrl(args.fileId);
      if (!fileUrl) {
        throw new Error("File not found");
      }

      // For now, we'll use OCR or manual text extraction
      // This is a placeholder that returns structured mock data
      // In production, integrate with an OCR service or PDF text extraction API
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Return sample extracted questions
      const mockQuestions = [
        {
          type: "mcq",
          question: "What is the normal range of hemoglobin in adult males?",
          options: ["10-12 g/dL", "13-17 g/dL", "18-20 g/dL", "8-10 g/dL"],
          correctAnswer: "13-17 g/dL",
          explanation: "Normal hemoglobin range for adult males is 13-17 g/dL",
          difficulty: "medium",
          source: "pyq",
          year: args.year || new Date().getFullYear(),
        },
        {
          type: "mcq",
          question: "Which of the following is a gram-positive bacteria?",
          options: ["E. coli", "Staphylococcus aureus", "Salmonella", "Pseudomonas"],
          correctAnswer: "Staphylococcus aureus",
          explanation: "Staphylococcus aureus is a gram-positive bacteria",
          difficulty: "easy",
          source: "pyq",
          year: args.year || new Date().getFullYear(),
        },
        {
          type: "mcq",
          question: "What is the primary function of platelets?",
          options: ["Oxygen transport", "Blood clotting", "Immune response", "Nutrient transport"],
          correctAnswer: "Blood clotting",
          explanation: "Platelets are primarily responsible for blood clotting",
          difficulty: "easy",
          source: "pyq",
          year: args.year || new Date().getFullYear(),
        },
      ];
      
      return mockQuestions;
    } catch (error) {
      console.error("Error extracting PYQ from PDF:", error);
      throw new Error(`Failed to extract questions: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Generate questions automatically using AI knowledge (no PDF required)
export const generateQuestionsFromAI = action({
  args: {
    topicId: v.optional(v.id("topics")),
    questionCount: v.number(),
    difficulty: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      // Initialize Google Gemini AI
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY environment variable is not set");
      }
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const difficultyFilter = args.difficulty 
        ? `Focus on ${args.difficulty} difficulty questions.` 
        : "Mix easy, medium, and hard difficulty questions.";

      // Create prompt for Gemini to generate MLT questions
      const prompt = `You are an expert Medical Lab Technology (MLT) educator. Generate ${args.questionCount} high-quality multiple-choice questions covering various Medical Lab Technology topics.

${difficultyFilter}

For each question, provide:
1. A clear question text
2. Four options (A, B, C, D)
3. The correct answer
4. A brief explanation
5. Difficulty level (easy, medium, or hard)

Format your response as a JSON array with this structure:
[
  {
    "type": "mcq",
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Explanation here",
    "difficulty": "medium"
  }
]

Focus on creating questions that test understanding of Medical Lab Technology concepts, procedures, and principles covering topics like:
- Hematology (blood cells, coagulation, anemia, blood typing, CBC interpretation)
- Microbiology (bacteria, viruses, fungi, culture techniques, staining methods, antibiotic sensitivity)
- Clinical Chemistry (enzymes, metabolites, electrolytes, liver function tests, kidney function tests)
- Immunology (antibodies, antigens, immune response, ELISA, immunofluorescence)
- Laboratory Safety (biosafety levels, quality control, equipment handling, waste disposal)
- Histopathology (tissue processing, staining techniques, microscopy, fixation)
- Parasitology (parasites, diagnostic methods, life cycles)
- Blood Banking (blood groups, cross-matching, transfusion reactions)
- Molecular Biology (PCR, DNA extraction, gel electrophoresis)
- Clinical Pathology (urinalysis, body fluid analysis, cytology)

Make sure questions are clear, unambiguous, and educationally valuable. Return ONLY valid JSON without any markdown formatting.

Generate ${args.questionCount} questions now.`;
      
      // Generate content with Gemini
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let responseText = response.text();
      
      // Clean up response text - remove markdown code blocks if present
      responseText = responseText.replace(/```json/g, '').replace(/```/g, '');
      
      // Parse the JSON response
      let questions;
      try {
        questions = JSON.parse(responseText);
      } catch (error) {
        console.error("Error parsing JSON response:", error);
        throw new Error("Failed to parse AI-generated questions");
      }

      return questions;
    } catch (error) {
      console.error("Error generating questions from AI:", error);
      throw new Error(`Failed to generate questions: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
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
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    for (const question of args.questions) {
      const id: Id<"questions"> = await ctx.runMutation(internal.questions.createQuestionInternal, {
        ...question,
        contentId: undefined,
        createdBy: userId,
      });
      results.push(id);
    }

    return results;
  },
});