import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

// Submit feedback (student)
export const submitFeedback = mutation({
  args: {
    rating: v.number(),
    category: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const feedbackId = await ctx.db.insert("feedback", {
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      rating: args.rating,
      category: args.category,
      message: args.message,
      status: "new",
    });

    return feedbackId;
  },
});

// Get user's own feedback
export const getMyFeedback = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const feedback = await ctx.db
      .query("feedback")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return feedback;
  },
});

// Get all feedback (admin only)
export const getAllFeedback = query({
  args: {
    status: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    let feedback;

    if (args.status && args.status !== undefined) {
      feedback = await ctx.db
        .query("feedback")
        .withIndex("by_status", (q) => q.eq("status", args.status as string))
        .order("desc")
        .collect();
    } else if (args.category && args.category !== undefined) {
      feedback = await ctx.db
        .query("feedback")
        .withIndex("by_category", (q) => q.eq("category", args.category as string))
        .order("desc")
        .collect();
    } else {
      feedback = await ctx.db.query("feedback").order("desc").collect();
    }

    return feedback;
  },
});

// Update feedback status (admin only)
export const updateFeedbackStatus = mutation({
  args: {
    feedbackId: v.id("feedback"),
    status: v.string(),
    adminNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    await ctx.db.patch(args.feedbackId, {
      status: args.status,
      adminNotes: args.adminNotes,
      reviewedBy: user._id,
      reviewedAt: Date.now(),
    });

    return args.feedbackId;
  },
});

// Get feedback statistics (admin only)
export const getFeedbackStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    const allFeedback = await ctx.db.query("feedback").collect();

    const stats = {
      total: allFeedback.length,
      new: allFeedback.filter((f) => f.status === "new").length,
      reviewed: allFeedback.filter((f) => f.status === "reviewed").length,
      resolved: allFeedback.filter((f) => f.status === "resolved").length,
      avgRating: allFeedback.length > 0
        ? allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length
        : 0,
      byCategory: {
        bug: allFeedback.filter((f) => f.category === "bug").length,
        feature: allFeedback.filter((f) => f.category === "feature").length,
        improvement: allFeedback.filter((f) => f.category === "improvement").length,
        other: allFeedback.filter((f) => f.category === "other").length,
      },
    };

    return stats;
  },
});
