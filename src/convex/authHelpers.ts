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
      await ctx.db.patch(userId, {
        isRegistered: true,
        registrationCompleted: true,
      });
    }

    return userId;
  },
});
