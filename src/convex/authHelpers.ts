import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";

// Auto-register user after successful OTP verification during account creation
export const autoCompleteRegistration = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }

    // Only mark as registered if Gmail and not already registered
    if (user.email?.endsWith("@gmail.com") && !user.isRegistered) {
      try {
        // Ensure user has default role set
        const updates: any = {
          isRegistered: true,
          registrationCompleted: true,
        };
        
        if (!user.role) {
          updates.role = "user";
        }

        await ctx.db.patch(userId, updates);

        // Automatically create 7-day free trial subscription for new users
        const existingSubscription = await ctx.db
          .query("subscriptions")
          .withIndex("by_user", (q) => q.eq("userId", userId))
          .first();

        if (!existingSubscription) {
          const startDate = Date.now();
          const endDate = startDate + 7 * 24 * 60 * 60 * 1000; // 7 days

          await ctx.db.insert("subscriptions", {
            userId: userId,
            planName: "7-Day Free Trial",
            status: "active",
            startDate,
            endDate,
            amount: 0,
          });

          console.log(`Auto-activated 7-day free trial for user: ${userId}`);
        }
      } catch (error) {
        console.error("Error completing registration:", error);
        return userId;
      }
    }

    return userId;
  },
});