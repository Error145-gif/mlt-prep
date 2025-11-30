import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

// Auto-publish weekly tests on Sunday
export const autoPublishWeeklyTests = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const today = new Date(now);
    
    // Only run on Sundays
    if (today.getDay() !== 0) return;

    // Find scheduled tests for today
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).getTime();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).getTime();

    const scheduledTests = await ctx.db
      .query("weeklyTests")
      .withIndex("by_status", (q) => q.eq("status", "scheduled"))
      .filter((q) => 
        q.and(
          q.gte(q.field("scheduledDate"), startOfDay),
          q.lte(q.field("scheduledDate"), endOfDay)
        )
      )
      .collect();

    // Publish each test
    for (const test of scheduledTests) {
      await ctx.db.patch(test._id, {
        status: "active",
        publishedAt: now,
      });
    }
  },
});

// Auto-publish leaderboards on Monday evening
export const autoPublishLeaderboards = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const today = new Date(now);
    
    // Only run on Mondays
    if (today.getDay() !== 1) return;

    // Find active tests from yesterday (Sunday)
    const activeTests = await ctx.db
      .query("weeklyTests")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    // Publish leaderboard for each test
    for (const test of activeTests) {
      if (!test.leaderboardPublishedAt) {
        await ctx.scheduler.runAfter(0, internal.weeklyTests.publishWeeklyLeaderboard, {
          weeklyTestId: test._id,
        });
      }
    }
  },
});
