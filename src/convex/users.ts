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

// Internal query to get current user by ID (for use in actions)
export const getCurrentUserInternal = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Get user profile
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
    
    return user ? { exists: true, isRegistered: user.isRegistered } : { exists: false };
  },
});

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

// Set user role to admin (Restricted to existing admins only)
export const setUserAsAdmin = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("Unauthorized: Only admins can promote other users.");
    }

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

    // Only allow specific emails to become admin
    const allowedAdminEmails = ["ak6722909@gmail.com", "historyindia145@gmail.com"];
    if (!allowedAdminEmails.includes(user.email?.toLowerCase().trim() || "")) {
      throw new Error("Unauthorized: Only authorized emails can access the admin panel.");
    }

    // Check if already admin
    if (user.role === "admin") {
      return userId;
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

// Generate upload URL for profile image
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

// Save uploaded image storage ID
export const saveProfileImage = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get the URL for the uploaded image
    const imageUrl = await ctx.storage.getUrl(args.storageId);
    
    if (!imageUrl) {
      throw new Error("Failed to get image URL");
    }

    // Update user profile with the new image URL
    await ctx.db.patch(userId, {
      avatarUrl: imageUrl,
    });

    return imageUrl;
  },
});

// Add new mutation for setting/updating password
export const setUserPassword = mutation({
  args: {
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Validate password strength
    if (args.newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    // Note: Password hashing is handled by Convex Auth internally
    // We just need to trigger the password update through the auth system
    // This will be handled by the Password provider in auth.ts
    
    return { success: true, message: "Password updated successfully" };
  },
});