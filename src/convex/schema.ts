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
      examPreparation: v.optional(v.string()), // Which exam they're preparing for
      state: v.optional(v.string()), // User's state/location
      avatarUrl: v.optional(v.string()), // Selected avatar
      isRegistered: v.optional(v.boolean()), // Track if user completed registration
      registrationCompleted: v.optional(v.boolean()), // Full registration status
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
      examName: v.optional(v.string()), // for PYQ questions (e.g., "RRB Section Officer", "AIIMS MLT")
      subject: v.optional(v.string()), // subject name (e.g., "Hematology", "Microbiology")
      createdBy: v.optional(v.id("users")),
    })
      .index("by_content", ["contentId"])
      .index("by_status", ["status"])
      .index("by_topic", ["topicId"])
      .index("by_source", ["source"])
      .index("by_exam", ["examName"])
      .index("by_year", ["year"]),

    // Test Sessions - Track active and completed tests
    testSessions: defineTable({
      userId: v.id("users"),
      testType: v.string(),
      topicId: v.optional(v.id("topics")),
      year: v.optional(v.number()),
      setNumber: v.optional(v.number()), // Add set number support
      questionIds: v.array(v.id("questions")),
      answers: v.optional(
        v.array(
          v.object({
            questionId: v.id("questions"),
            answer: v.string(),
            isCorrect: v.optional(v.boolean()),
          })
        )
      ),
      status: v.string(),
      startedAt: v.number(),
      completedAt: v.optional(v.number()),
      timeSpent: v.optional(v.number()),
      score: v.optional(v.number()),
    })
      .index("by_user", ["userId"])
      .index("by_status", ["status"]),

    // Test Results - Detailed results storage
    testResults: defineTable({
      userId: v.id("users"),
      sessionId: v.id("testSessions"),
      testType: v.string(), // "mock", "pyq", "practice"
      topicId: v.optional(v.id("topics")),
      year: v.optional(v.number()),
      totalQuestions: v.number(),
      correctAnswers: v.number(),
      incorrectAnswers: v.number(),
      skippedAnswers: v.number(),
      score: v.number(), // percentage
      timeSpent: v.number(),
      weakTopics: v.optional(v.array(v.string())),
    })
      .index("by_user", ["userId"])
      .index("by_session", ["sessionId"])
      .index("by_test_type", ["testType"]),

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

    // User Feedback
    feedback: defineTable({
      userId: v.id("users"),
      userName: v.optional(v.string()),
      userEmail: v.optional(v.string()),
      rating: v.number(), // 1-5 stars
      category: v.string(), // "bug", "feature", "improvement", "other"
      message: v.string(),
      status: v.string(), // "new", "reviewed", "resolved"
      adminNotes: v.optional(v.string()),
      reviewedBy: v.optional(v.id("users")),
      reviewedAt: v.optional(v.number()),
    })
      .index("by_user", ["userId"])
      .index("by_status", ["status"])
      .index("by_category", ["category"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;