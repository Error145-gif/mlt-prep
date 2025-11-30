import { internalMutation, internalQuery } from "./_generated/server";

export const checkData = internalQuery({
  args: {},
  handler: async (ctx) => {
    const allQuestions = await ctx.db.query("questions").collect();
    const bySource: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    const bySourceAndStatus: Record<string, number> = {};
    const sampleQuestions: any[] = [];

    for (const q of allQuestions) {
      const source = q.source || "undefined";
      const status = q.status || "undefined";
      
      bySource[source] = (bySource[source] || 0) + 1;
      byStatus[status] = (byStatus[status] || 0) + 1;
      
      const key = `${source}:${status}`;
      bySourceAndStatus[key] = (bySourceAndStatus[key] || 0) + 1;

      if (sampleQuestions.length < 5) {
        sampleQuestions.push({
            id: q._id,
            source: q.source,
            status: q.status,
            topic: q.topic
        });
      }
    }

    return {
      total: allQuestions.length,
      bySource,
      byStatus,
      bySourceAndStatus,
      sampleQuestions
    };
  },
});

export const deleteDummyQuestions = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allQuestions = await ctx.db.query("questions").collect();
    let deletedCount = 0;

    for (const q of allQuestions) {
      let isDummy = false;
      
      // Check for seed data patterns
      if (q.question?.startsWith("Mock Test Question")) isDummy = true;
      if (q.question?.startsWith("PYQ 2023 Question")) isDummy = true;
      if (q.question?.startsWith("AI Generated Question")) isDummy = true;
      
      // Check for malformed/template data
      if (q.question?.includes("Question text here")) isDummy = true;
      if (q.question?.includes("?&#10;")) isDummy = true; // HTML entities in text
      
      // Check options for placeholder text
      if (q.options && q.options.some((opt: string) => opt.includes("Option A - Incorrect"))) isDummy = true;
      if (q.options && q.options.some((opt: string) => opt.includes("Answer here"))) isDummy = true;

      if (isDummy) {
        await ctx.db.delete(q._id);
        deletedCount++;
      }
    }

    return { deletedCount, message: `Successfully deleted ${deletedCount} dummy/malformed questions.` };
  },
});