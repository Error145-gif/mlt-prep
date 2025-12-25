import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

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

    console.log(`[AUTH HELPER] autoCompleteRegistration for: ${userId}, email: ${user.email}`);

    const updates: any = {};
    let needsUpdate = false;

    // Check identity provider to set hasPassword
    const identity = await ctx.auth.getUserIdentity();
    if (identity && identity.provider === "password" && !user.hasPassword) {
      updates.hasPassword = true;
      needsUpdate = true;
    }

    // Mark as registered if not already registered
    if (!user.isRegistered) {
      updates.isRegistered = true;
      updates.registrationCompleted = true;
      
      if (!user.role) {
        updates.role = "user";
      }
      needsUpdate = true;

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
    }

    // NOTE: Welcome email is now handled in src/convex/auth.ts inside createOrUpdateUser
    // This ensures it runs exactly once on creation.
    // We keep this check just in case, but it shouldn't be needed for new users.
    // If we want to retry for old users who missed it:
    if (!user.welcomeEmailSent && user.email) {
       console.log(`[AUTH HELPER] User ${userId} missing welcome email. Checking if we should send...`);
       // We can optionally trigger it here as a fallback, but let's rely on the main trigger first to avoid confusion.
       // If the user was just created, the scheduler in auth.ts handles it.
    }

    if (needsUpdate) {
      await ctx.db.patch(userId, updates);
    }

    return userId;
  },
});

// Internal mutation to mark welcome email as sent
export const markWelcomeEmailSent = internalMutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      welcomeEmailSent: true,
    });
  },
});