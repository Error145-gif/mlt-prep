import { mutation } from "./_generated/server";

export const seedMockTestQuestions = mutation({
  args: {},
  handler: async (ctx) => {
    // Create 100 mock test questions (Set 1)
    const mockQuestions = [];
    for (let i = 1; i <= 100; i++) {
      const difficulties = ["easy", "medium", "hard"] as const;
      const questionId = await ctx.db.insert("questions", {
        question: `Mock Test Question ${i}: What is the correct answer?`,
        options: [
          `Option A - Incorrect`,
          `Option B - Correct Answer`,
          `Option C - Incorrect`,
          `Option D - Incorrect`,
        ],
        correctAnswer: `Option B - Correct Answer`,
        subject: ["Hematology", "Biochemistry", "Microbiology", "Immunology"][i % 4],
        topic: "General",
        difficulty: difficulties[i % 3],
        type: "mcq",
        source: "manual",
        status: "approved",
        explanation: `This is the explanation for question ${i}. The correct answer is Option B.`,
        hasImage: false,
      });
      mockQuestions.push(questionId);
    }

    // Create 20 PYQ questions (Set 1, Year 2023)
    const pyqQuestions = [];
    for (let i = 1; i <= 20; i++) {
      const difficulties = ["easy", "medium", "hard"] as const;
      const questionId = await ctx.db.insert("questions", {
        question: `PYQ 2023 Question ${i}: What is the correct answer?`,
        options: [
          `Option A - Incorrect`,
          `Option B - Correct Answer`,
          `Option C - Incorrect`,
          `Option D - Incorrect`,
        ],
        correctAnswer: `Option B - Correct Answer`,
        subject: ["Hematology", "Biochemistry", "Microbiology"][i % 3],
        topic: "General",
        difficulty: difficulties[i % 3],
        type: "mcq",
        source: "pyq",
        status: "approved",
        examName: "MLT Exam",
        year: 2023,
        explanation: `This is the explanation for PYQ question ${i}.`,
        hasImage: false,
      });
      pyqQuestions.push(questionId);
    }

    // Create 25 AI questions (Set 1)
    const aiQuestions = [];
    for (let i = 1; i <= 25; i++) {
      const difficulties = ["easy", "medium", "hard"] as const;
      const questionId = await ctx.db.insert("questions", {
        question: `AI Generated Question ${i}: What is the correct answer?`,
        options: [
          `Option A - Incorrect`,
          `Option B - Correct Answer`,
          `Option C - Incorrect`,
          `Option D - Incorrect`,
        ],
        correctAnswer: `Option B - Correct Answer`,
        subject: ["Hematology", "Biochemistry", "Microbiology", "Immunology"][i % 4],
        topic: "General",
        difficulty: difficulties[i % 3],
        type: "mcq",
        source: "ai",
        status: "approved",
        explanation: `This is the explanation for AI question ${i}.`,
        hasImage: false,
      });
      aiQuestions.push(questionId);
    }

    return {
      mockQuestionsCreated: mockQuestions.length,
      pyqQuestionsCreated: pyqQuestions.length,
      aiQuestionsCreated: aiQuestions.length,
      message: "Test data seeded successfully!",
    };
  },
});