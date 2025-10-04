import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

// Content types
export const CONTENT_TYPES = {
  PDF: "pdf",
  VIDEO: "video",
  PYQ: "pyq",
} as const;

export const contentTypeValidator = v.union(
  v.literal(CONTENT_TYPES.PDF),
  v.literal(CONTENT_TYPES.VIDEO),
  v.literal(CONTENT_TYPES.PYQ),
);

// Question types
export const QUESTION_TYPES = {
  MCQ: "mcq",
  TRUE_FALSE: "true_false",
  SHORT_ANSWER: "short_answer",
} as const;

export const questionTypeValidator = v.union(
  v.literal(QUESTION_TYPES.MCQ),
  v.literal(QUESTION_TYPES.TRUE_FALSE),
  v.literal(QUESTION_TYPES.SHORT_ANSWER),
);

// Question status
export const QUESTION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export const questionStatusValidator = v.union(
  v.literal(QUESTION_STATUS.PENDING),
  v.literal(QUESTION_STATUS.APPROVED),
  v.literal(QUESTION_STATUS.REJECTED),
);

// Subscription status
export const SUBSCRIPTION_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
} as const;

export const subscriptionStatusValidator = v.union(
  v.literal(SUBSCRIPTION_STATUS.ACTIVE),
  v.literal(SUBSCRIPTION_STATUS.INACTIVE),
  v.literal(SUBSCRIPTION_STATUS.EXPIRED),
  v.literal(SUBSCRIPTION_STATUS.CANCELLED),
);

const schema = defineSchema(
  {
    ...authTables,

    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
      lastActive: v.optional(v.number()),
    }).index("email", ["email"]),

    // Content Management
    content: defineTable({
      title: v.string(),
      description: v.optional(v.string()),
      type: contentTypeValidator,
      fileId: v.optional(v.id("_storage")),
      fileUrl: v.optional(v.string()),
      topicId: v.optional(v.id("topics")),
      uploadedBy: v.id("users"),
      status: v.string(), // "active", "archived"
      views: v.number(),
      duration: v.optional(v.number()), // for videos in seconds
    })
      .index("by_type", ["type"])
      .index("by_topic", ["topicId"])
      .index("by_uploader", ["uploadedBy"]),

    // Topics/Categories
    topics: defineTable({
      name: v.string(),
      description: v.optional(v.string()),
      parentId: v.optional(v.id("topics")),
      order: v.number(),
    }).index("by_parent", ["parentId"]),

    // AI Generated Questions
    questions: defineTable({
      contentId: v.optional(v.id("content")),
      topicId: v.optional(v.id("topics")),
      type: questionTypeValidator,
      question: v.string(),
      options: v.optional(v.array(v.string())), // for MCQ
      correctAnswer: v.string(),
      explanation: v.optional(v.string()),
      status: questionStatusValidator,
      reviewedBy: v.optional(v.id("users")),
      reviewedAt: v.optional(v.number()),
      difficulty: v.optional(v.string()), // "easy", "medium", "hard"
      source: v.optional(v.string()), // "manual", "ai", "pyq"
      year: v.optional(v.number()), // for PYQ questions
      createdBy: v.optional(v.id("users")),
    })
      .index("by_content", ["contentId"])
      .index("by_status", ["status"])
      .index("by_topic", ["topicId"])
      .index("by_source", ["source"]),

    // User Subscriptions
    subscriptions: defineTable({
      userId: v.id("users"),
      planName: v.string(),
      status: subscriptionStatusValidator,
      startDate: v.number(),
      endDate: v.number(),
      amount: v.number(),
      paymentId: v.optional(v.string()),
    })
      .index("by_user", ["userId"])
      .index("by_status", ["status"]),

    // Payment History
    payments: defineTable({
      userId: v.id("users"),
      subscriptionId: v.optional(v.id("subscriptions")),
      amount: v.number(),
      currency: v.string(),
      status: v.string(), // "success", "failed", "pending"
      paymentMethod: v.optional(v.string()),
      transactionId: v.optional(v.string()),
    })
      .index("by_user", ["userId"])
      .index("by_subscription", ["subscriptionId"]),

    // User Progress & Analytics
    userProgress: defineTable({
      userId: v.id("users"),
      contentId: v.id("content"),
      topicId: v.optional(v.id("topics")),
      progress: v.number(), // percentage 0-100
      timeSpent: v.number(), // in seconds
      completed: v.boolean(),
    })
      .index("by_user", ["userId"])
      .index("by_content", ["contentId"])
      .index("by_user_and_content", ["userId", "contentId"]),

    // Test Scores
    testScores: defineTable({
      userId: v.id("users"),
      topicId: v.optional(v.id("topics")),
      totalQuestions: v.number(),
      correctAnswers: v.number(),
      score: v.number(), // percentage
      timeSpent: v.number(),
      questionIds: v.array(v.id("questions")),
    })
      .index("by_user", ["userId"])
      .index("by_topic", ["topicId"]),

    // Notifications
    notifications: defineTable({
      title: v.string(),
      message: v.string(),
      type: v.string(), // "push", "email", "both"
      targetUsers: v.optional(v.array(v.id("users"))), // if empty, send to all
      sentBy: v.id("users"),
      sentAt: v.optional(v.number()),
      status: v.string(), // "draft", "sent"
    }).index("by_status", ["status"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;