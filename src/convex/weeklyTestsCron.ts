import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Auto-publish weekly tests on Sunday at 12:00 AM
crons.cron(
  "auto-publish-weekly-tests",
  "0 0 * * 0", // Every Sunday at midnight
  internal.weeklyTestsCronActions.autoPublishWeeklyTests,
  {}
);

// Auto-publish leaderboards on Monday at 6:00 PM
crons.cron(
  "auto-publish-leaderboards",
  "0 18 * * 1", // Every Monday at 6 PM
  internal.weeklyTestsCronActions.autoPublishLeaderboards,
  {}
);

export default crons;
