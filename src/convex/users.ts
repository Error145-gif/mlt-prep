import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation, internalQuery, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get the current signed in user. Returns null if the user is not signed in.
 * Usage: const signedInUser = await ctx.runQuery(api.authHelpers.currentUser);
 * THIS FUNCTION IS READ-ONLY. DO NOT MODIFY.
 */
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (user === null) {
      return null;
    }

    return user;
  },
});

/**
 * Use this function internally to get the current user data. Remember to handle the null user case.
 * @param ctx
 * @returns
 */
export const getCurrentUser = async (ctx: QueryCtx) => {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    return null;
  }
  return await ctx.db.get(userId);
};

// Internal query to get current user (for use in actions)
export const getCurrentUserInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

// Get user profile
export const getUserProfile = query({
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

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      avatarUrl: user.avatarUrl,
      examPreparation: user.examPreparation,
      state: user.state,
    };
  },
});

// Update user profile
export const updateUserProfile = mutation({
  args: {
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    examPreparation: v.optional(v.string()),
    state: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const updates: any = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.avatarUrl !== undefined) updates.avatarUrl = args.avatarUrl;
    if (args.examPreparation !== undefined) updates.examPreparation = args.examPreparation;
    if (args.state !== undefined) updates.state = args.state;

    await ctx.db.patch(userId, updates);

    return userId;
  },
});

// Set user role to admin (for initial setup)
export const setUserAsAdmin = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      role: "admin",
    });

    return user._id;
  },
});

// Make current user an admin (for testing/setup)
export const makeCurrentUserAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Only allow ak6722909@gmail.com to become admin
    const allowedAdminEmail = "ak6722909@gmail.com";
    if (user.email?.toLowerCase().trim() !== allowedAdminEmail) {
      throw new Error("You do not have admin privileges. Only authorized emails can access the admin panel.");
    }

    await ctx.db.patch(userId, {
      role: "admin",
    });

    return userId;
  },
});

// Check if email is registered (Gmail only)
export const checkEmailRegistered = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();
    
    // Validate Gmail only
    if (!email.endsWith("@gmail.com")) {
      return { isValid: false, message: "Only Gmail accounts are allowed." };
    }

    // Check if user exists and is registered
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();

    if (!user) {
      return { isValid: false, message: "Account not registered. Please create an account first." };
    }

    if (!user.isRegistered) {
      return { isValid: false, message: "Please complete your registration first." };
    }

    return { isValid: true, message: "Email verified." };
  },
});

// Mark user as registered after account creation
export const completeRegistration = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Validate Gmail
    if (!user.email?.endsWith("@gmail.com")) {
      throw new Error("Only Gmail accounts are allowed.");
    }

    await ctx.db.patch(userId, {
      isRegistered: true,
      registrationCompleted: true,
    });

    return userId;
  },
});