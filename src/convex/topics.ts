import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get all topics
export const getAllTopics = query({
  args: {},
  handler: async (ctx) => {
    const topics = await ctx.db.query("topics").collect();
    return topics.sort((a, b) => a.order - b.order);
  },
});

// Create topic
export const createTopic = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    parentId: v.optional(v.id("topics")),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await ctx.db.insert("topics", args);
  },
});

// Update topic
export const updateTopic = mutation({
  args: {
    id: v.id("topics"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    order: v.optional(v.number()),
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

// Delete topic
export const deleteTopic = mutation({
  args: { id: v.id("topics") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Batch create topics (for initial setup)
export const batchCreateTopics = mutation({
  args: {
    topics: v.array(v.object({
      name: v.string(),
      description: v.optional(v.string()),
      order: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const results = [];
    for (const topic of args.topics) {
      const id = await ctx.db.insert("topics", topic);
      results.push(id);
    }

    return results;
  },
});

// Initialize MLT topics - can be called once by admin
export const initializeMLTTopics = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // Check if topics already exist
    const existingTopics = await ctx.db.query("topics").collect();
    if (existingTopics.length > 0) {
      return { message: "Topics already initialized", count: existingTopics.length };
    }

    const mltTopics = [
      { name: "Anatomy", order: 1 },
      { name: "Physiology", order: 2 },
      { name: "Biochemistry", order: 3 },
      { name: "Pathology", order: 4 },
      { name: "Microbiology", order: 5 },
      { name: "Hematology", order: 6 },
      { name: "Histopathology", order: 7 },
      { name: "Cytology", order: 8 },
      { name: "Serology", order: 9 },
      { name: "Immunology", order: 10 },
      { name: "Parasitology", order: 11 },
      { name: "Clinical Biochemistry", order: 12 },
      { name: "Blood Banking (Transfusion Medicine)", order: 13 },
      { name: "Molecular Biology", order: 14 },
      { name: "Genetics", order: 15 },
      { name: "Clinical Pathology", order: 16 },
      { name: "Medical Ethics & Hospital Management", order: 17 },
      { name: "Laboratory Management & Quality Control", order: 18 },
      { name: "Biomedical Waste Management", order: 19 },
      { name: "Instrumentation & Lab Equipment", order: 20 },
      { name: "Virology", order: 21 },
      { name: "Mycology", order: 22 },
      { name: "Bacteriology", order: 23 },
      { name: "Toxicology", order: 24 },
      { name: "Endocrinology", order: 25 },
      { name: "Clinical Microscopy & Urinalysis", order: 26 },
      { name: "Histotechnology", order: 27 },
      { name: "Immunohematology", order: 28 },
      { name: "Biostatistics & Research Methodology", order: 29 },
      { name: "Computer Applications in Laboratory Science", order: 30 },
    ];

    const results = [];
    for (const topic of mltTopics) {
      const id = await ctx.db.insert("topics", topic);
      results.push(id);
    }

    return { message: "MLT topics initialized successfully", count: results.length };
  },
});