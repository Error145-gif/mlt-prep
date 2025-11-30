import { internalQuery } from "./_generated/server";

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
