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

// Mutation to update user activity status
export const updateUserActivity = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    await ctx.db.patch(userId, {
      lastActive: Date.now(),
      isOnline: true,
    });

    return userId;
  },
});

// Query to track current user as active (called automatically)
export const trackActivity = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    // This query will be called frequently, updating activity in a mutation
    return userId;
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
      hasPassword: user.hasPassword,
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

export const updatePasswordStatus = mutation({
  args: { hasPassword: v.boolean() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    await ctx.db.patch(userId, { hasPassword: args.hasPassword });
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

// Ensure password account exists for the user (to fix InvalidAccountId during reset/set password)
export const ensurePasswordAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user || !user.email) {
      throw new Error("User not found or has no email");
    }

    // Check if password account already exists
    const existingAccount = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => 
        q.eq("userId", userId).eq("provider", "password")
      )
      .unique();

    if (existingAccount) {
      return;
    }

    // Create a placeholder account so that reset flow can update it
    await ctx.db.insert("authAccounts", {
      userId,
      provider: "password",
      providerAccountId: user.email,
      secret: "placeholder", 
    });
  },
});

// Query to get verified user emails for email automation
export const getVerifiedUserEmails = query({
  args: {},
  handler: async (ctx) => {
    // Fetch all users with verified emails
    const allUsers = await ctx.db.query("users").collect();
    
    // Filter for registered users with valid emails
    const verifiedUsers = allUsers
      .filter(u => 
        u.email && 
        u.isRegistered && 
        u.email.includes("@") &&
        !(u as any).unsubscribed // Exclude unsubscribed users if field exists
      )
      .map(u => ({
        email: u.email,
        name: u.name || "User",
        registeredAt: u._creationTime,
      }));

    return verifiedUsers;
  },
});