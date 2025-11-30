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
      // userName and userEmail are not in schema, relying on userId
      rating: args.rating,
      type: args.category, // Map category to type
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
        .withIndex("by_type", (q) => q.eq("type", args.category as string))
        .order("desc")
        .collect();
    } else {
      feedback = await ctx.db.query("feedback").order("desc").collect();
    }

    // Enrich with user details if needed, but for now returning as is
    // The frontend might need to fetch user details separately or we can join here
    // For simplicity and performance, we'll return the feedback docs. 
    // If names are needed, we should fetch them.
    
    const feedbackWithUsers = await Promise.all(
      feedback.map(async (f) => {
        const user = await ctx.db.get(f.userId);
        return {
          ...f,
          userName: user?.name || "Unknown",
          userEmail: user?.email || "No Email",
          category: f.type, // Map type back to category for frontend compatibility
        };
      })
    );

    return feedbackWithUsers;
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
      adminResponse: args.adminNotes, // Map adminNotes to adminResponse
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
        ? allFeedback.reduce((sum, f) => sum + (f.rating || 0), 0) / allFeedback.length
        : 0,
      byCategory: {
        bug: allFeedback.filter((f) => f.type === "bug").length,
        feature: allFeedback.filter((f) => f.type === "feature").length,
        improvement: allFeedback.filter((f) => f.type === "improvement").length,
        other: allFeedback.filter((f) => f.type === "other").length,
      },
    };

    return stats;
  },
});