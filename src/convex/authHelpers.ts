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

    // Send welcome email (ONLY for new users, within 10 mins of creation)
    // This prevents sending emails to old users logging in
    const isNewUser = (Date.now() - user._creationTime) < 10 * 60 * 1000;
    
    if (!user.welcomeEmailSent && user.email && isNewUser) {
      const { internal } = await import("./_generated/api");
      await ctx.scheduler.runAfter(0, internal.emails.sendWelcomeEmail, {
        email: user.email,
        name: user.name || "there",
        userId: userId,
      });
      // We don't set welcomeEmailSent here, it's set in the email action/callback
      // But to be safe against double scheduling in short time, we could.
      // For now, relying on the email action to mark it.
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