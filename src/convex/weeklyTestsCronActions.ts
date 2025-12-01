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

    // Find scheduled tests that should be active now
    const scheduledTests = await ctx.db
      .query("weeklyTests")
      .withIndex("by_status", (q) => q.eq("status", "scheduled"))
      .filter((q) => {
        // Check if scheduledDate is within today
        // Note: This logic depends on how scheduledDate is stored (number timestamp)
        return q.eq(q.field("status"), "scheduled");
      })
      .collect();

    for (const test of scheduledTests) {
      if (test.scheduledDate && test.scheduledDate <= now) {
        await ctx.db.patch(test._id, {
          status: "active",
          isActive: true,
          publishedAt: now,
        });
      }
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

    // Find active tests that should be completed
    const activeTests = await ctx.db
      .query("weeklyTests")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    for (const test of activeTests) {
      // If end date passed (assuming duration logic or explicit end date)
      // For now, let's assume 24h or check endDate string if parsable
      // But simpler: check if it's been active for duration
      
      // If we use endDate string:
      const endDate = new Date(test.endDate).getTime();
      if (endDate <= now) {
         // Publish leaderboard if not already
         if (!test.leaderboardPublishedAt) {
            await ctx.scheduler.runAfter(0, internal.weeklyTests.publishWeeklyLeaderboard, {
              weeklyTestId: test._id,
            });
         }
      }
    }
  },
});