import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get all content with filters
export const getAllContent = query({
  args: {
    type: v.optional(v.string()),
    topicId: v.optional(v.id("topics")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    let content;

    if (args.type) {
      content = await ctx.db
        .query("content")
        .withIndex("by_type", (q) => q.eq("type", args.type as any))
        .collect();
    } else if (args.topicId) {
      content = await ctx.db
        .query("content")
        .withIndex("by_topic", (q) => q.eq("topicId", args.topicId))
        .collect();
    } else {
      content = await ctx.db.query("content").collect();
    }
    
    // Get uploader info and topic info
    const enrichedContent = await Promise.all(
      content.map(async (item) => {
        const uploader = await ctx.db.get(item.uploadedBy);
        const topic = item.topicId ? await ctx.db.get(item.topicId) : null;
        return {
          ...item,
          uploaderName: uploader?.name || "Unknown",
          topicName: topic?.name || "Unassigned",
        };
      })
    );

    return enrichedContent;
  },
});

// Create content
export const createContent = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    type: v.string(),
    fileId: v.optional(v.id("_storage")),
    fileUrl: v.optional(v.string()),
    topicId: v.optional(v.id("topics")),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const contentId = await ctx.db.insert("content", {
      title: args.title,
      description: args.description,
      type: args.type as any,
      fileId: args.fileId,
      fileUrl: args.fileUrl,
      topicId: args.topicId,
      uploadedBy: user._id,
      status: "active",
      views: 0,
      duration: args.duration,
    });

    return contentId;
  },
});

// Update content
export const updateContent = mutation({
  args: {
    id: v.id("content"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    topicId: v.optional(v.id("topics")),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete content
export const deleteContent = mutation({
  args: { id: v.id("content") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Add mutation for generating upload URL
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Get file URL
export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});