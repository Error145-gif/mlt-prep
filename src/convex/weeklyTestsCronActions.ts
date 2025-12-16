"use node";

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

// Auto-publish weekly tests on their scheduled date
export const autoPublishWeeklyTests = internalAction({
  args: {},
  handler: async (ctx): Promise<{ activated: number }> => {
    const now = Date.now();
    
    // Get all scheduled tests whose time has come
    const scheduledTests = await ctx.runQuery(internal.weeklyTests.getScheduledTestsForActivation, { now });
    
    for (const test of scheduledTests) {
      // Activate the test
      await ctx.runMutation(internal.weeklyTests.activateScheduledTest, { 
        weeklyTestId: test._id 
      });
      
      console.log(`Auto-activated weekly test: ${test.title}`);
    }
    
    return { activated: scheduledTests.length };
  },
});

// Auto-publish leaderboards for completed tests
export const autoPublishLeaderboards = internalAction({
  args: {},
  handler: async (ctx): Promise<{ completed: number }> => {
    const now = Date.now();
    
    // Get all active tests that should be completed
    const activeTests = await ctx.runQuery(internal.weeklyTests.getActiveTestsForCompletion, { now });
    
    for (const test of activeTests) {
      // Mark test as completed
      await ctx.runMutation(internal.weeklyTests.completeActiveTest, { 
        weeklyTestId: test._id 
      });
      
      console.log(`Auto-completed weekly test: ${test.title}`);
    }
    
    return { completed: activeTests.length };
  },
});