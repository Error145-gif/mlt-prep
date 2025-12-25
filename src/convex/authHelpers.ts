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

    // Send welcome email to ALL new users (within 30 mins of creation)
    // This prevents sending emails to old users logging in
    const isNewUser = (Date.now() - user._creationTime) < 30 * 60 * 1000; // Extended to 30 mins
    
    if (!user.welcomeEmailSent && user.email && isNewUser) {
      console.log(`[WELCOME EMAIL] Scheduling for user: ${userId}, email: ${user.email}, created: ${new Date(user._creationTime).toISOString()}`);
      const { internal } = await import("./_generated/api");
      await ctx.scheduler.runAfter(0, internal.emails.sendWelcomeEmail, {
        email: user.email,
        name: user.name || "there",
        userId: userId,
      });
      console.log(`[WELCOME EMAIL] ✅ Scheduled successfully for: ${user.email}`);
    } else {
      const timeSinceCreation = Math.floor((Date.now() - user._creationTime) / 1000 / 60);
      console.log(`[WELCOME EMAIL] ❌ NOT scheduled. welcomeEmailSent=${user.welcomeEmailSent}, hasEmail=${!!user.email}, isNewUser=${isNewUser}, minutesSinceCreation=${timeSinceCreation}`);
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