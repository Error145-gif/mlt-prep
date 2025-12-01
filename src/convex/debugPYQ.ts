import { query } from "./_generated/server";

export const checkPYQYears = query({
  args: {},
  handler: async (ctx) => {
    const pyqQuestions = await ctx.db
      .query("questions")
      .withIndex("by_source", (q) => q.eq("source", "pyq"))
      .filter((q) => q.eq(q.field("status"), "approved"))
      .take(10);
    
    return pyqQuestions.map(q => ({
      id: q._id,
      examName: q.examName,
      year: q.year,
      question: q.question.substring(0, 50)
    }));
  },
});
