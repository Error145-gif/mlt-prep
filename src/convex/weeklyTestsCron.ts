import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Check every hour for tests that need to be activated
crons.interval(
  "auto-activate-weekly-tests",
  { hours: 1 }, // Check every hour
  internal.weeklyTestsCronActions.autoPublishWeeklyTests,
  {}
);

// Check every hour for tests that need to be completed
crons.interval(
  "auto-complete-weekly-tests",
  { hours: 1 }, // Check every hour
  internal.weeklyTestsCronActions.autoPublishLeaderboards,
  {}
);

export default crons;