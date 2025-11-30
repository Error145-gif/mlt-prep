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
      examPreparation: v.optional(v.string()),
      state: v.optional(v.string()),
      avatarUrl: v.optional(v.string()),
      isRegistered: v.optional(v.boolean()),
      registrationCompleted: v.optional(v.boolean()),
      phone: v.optional(v.string()),
    })
      .index("email", ["email"]),

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
      text: v.optional(v.string()), // Made optional to support 'question' field
      question: v.optional(v.string()), // Added for compatibility
      options: v.array(v.string()),
      correctAnswer: v.string(),
      explanation: v.optional(v.string()),
      image: v.optional(v.string()),
      imageUrl: v.optional(v.string()), // Added for image URL
      imageStorageId: v.optional(v.id("_storage")), // Added for storage ID
      topicId: v.optional(v.id("topics")),
      subtopicId: v.optional(v.string()),
      difficulty: v.optional(v.string()),
      source: v.optional(v.string()),
      testSetId: v.optional(v.id("testSets")),
      examName: v.optional(v.string()),
      year: v.optional(v.number()),
      setNumber: v.optional(v.number()),
      isPYQ: v.optional(v.boolean()),
      hasImage: v.optional(v.boolean()),
      status: v.optional(v.string()), // Added status
      subject: v.optional(v.string()), // Added subject
      topic: v.optional(v.string()), // Added topic string
      type: v.optional(v.string()), // Added type
      sectionId: v.optional(v.id("sections")), // Added sectionId
      createdBy: v.optional(v.id("users")), // Added createdBy
      reviewedBy: v.optional(v.id("users")), // Added reviewedBy
      reviewedAt: v.optional(v.number()), // Added reviewedAt
    })
      .index("by_topicId", ["topicId"])
      .index("by_testSetId", ["testSetId"])
      .index("by_source", ["source"])
      .index("by_status", ["status"])
      .index("by_section", ["sectionId"])
      .index("by_topic", ["topic"])
      .index("by_subject", ["subject"])
      .index("by_difficulty", ["difficulty"])
      .index("by_examName_and_year", ["examName", "year"]),

    // Test Sets
    testSets: defineTable({
      name: v.string(),
      description: v.string(),
      duration: v.number(),
      type: v.string(), // "mock", "ai", "pyq"
      isActive: v.boolean(),
      examName: v.optional(v.string()),
      year: v.optional(v.number()),
      setNumber: v.optional(v.number()),
    })
      .index("by_type", ["type"])
      .index("by_active", ["isActive"]),

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
      orderId: v.optional(v.string()), // Cashfree order ID
      paymentSessionId: v.optional(v.string()), // Cashfree payment session ID
      planName: v.optional(v.string()), // Plan name for the payment
      duration: v.optional(v.number()), // Duration in days
      paymentId: v.optional(v.string()), // Cashfree payment ID after success
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

    // Feedback table
    feedback: defineTable({
      userId: v.id("users"),
      type: v.string(), // "bug", "feature", "content", "other"
      message: v.string(),
      rating: v.optional(v.number()),
      status: v.string(), // "pending", "reviewed", "resolved"
      adminResponse: v.optional(v.string()),
      reviewedBy: v.optional(v.id("users")),
      reviewedAt: v.optional(v.number()),
    })
      .index("by_user", ["userId"])
      .index("by_status", ["status"])
      .index("by_type", ["type"]),

    // Reported Questions table
    reportedQuestions: defineTable({
      questionId: v.id("questions"),
      userId: v.id("users"),
      issueType: v.string(), // "wrong_answer", "typo", "image_issue", "other"
      description: v.string(),
      status: v.string(), // "pending", "resolved", "dismissed"
      adminNote: v.optional(v.string()),
      resolvedBy: v.optional(v.id("users")),
      resolvedAt: v.optional(v.number()),
    })
    .index("by_status", ["status"])
    .index("by_question", ["questionId"])
    .index("by_user", ["userId"]),

    // Notifications table
    notifications: defineTable({
      title: v.string(),
      message: v.string(),
      type: v.string(), // "push", "email", "both"
      targetUsers: v.optional(v.array(v.id("users"))), // if empty, send to all
      sentBy: v.id("users"),
      sentAt: v.optional(v.number()),
      status: v.string(), // "draft", "sent"
    }).index("by_status", ["status"]),

    // User Notification Read Status
    userNotificationStatus: defineTable({
      userId: v.id("users"),
      notificationId: v.id("notifications"),
      isRead: v.boolean(),
      readAt: v.optional(v.number()),
    })
      .index("by_user", ["userId"])
      .index("by_notification", ["notificationId"])
      .index("by_user_and_notification", ["userId", "notificationId"]),

    // Coupon Codes
    coupons: defineTable({
      code: v.string(),
      discountType: v.union(v.literal("percentage"), v.literal("fixed")),
      discountValue: v.number(),
      isActive: v.boolean(),
      usageLimit: v.optional(v.number()), // null = unlimited
      usageCount: v.number(),
      expiryDate: v.optional(v.number()),
      createdBy: v.id("users"),
      description: v.optional(v.string()),
    })
      .index("by_code", ["code"])
      .index("by_active", ["isActive"]),

    // Coupon Usage Tracking
    couponUsage: defineTable({
      couponId: v.id("coupons"),
      userId: v.id("users"),
      orderId: v.optional(v.string()),
      discountAmount: v.number(),
      usedAt: v.number(),
    })
      .index("by_coupon", ["couponId"])
      .index("by_user", ["userId"]),

    // Invoices
    invoices: defineTable({
      invoiceNumber: v.string(),
      userId: v.id("users"),
      subscriptionId: v.id("subscriptions"),
      paymentId: v.string(),
      planName: v.string(),
      amount: v.number(),
      duration: v.number(),
      issuedDate: v.number(),
      emailSent: v.boolean(),
      emailSentAt: v.optional(v.number()),
      emailError: v.optional(v.string()),
    })
      .index("by_user", ["userId"])
      .index("by_invoice_number", ["invoiceNumber"])
      .index("by_subscription", ["subscriptionId"]),

    // Free Study Materials
    studyMaterials: defineTable({
      title: v.string(),
      description: v.optional(v.string()),
      fileId: v.id("_storage"),
      fileUrl: v.optional(v.string()),
      uploadedBy: v.id("users"),
      status: v.string(), // "active", "archived"
      views: v.number(),
      category: v.optional(v.string()), // "handwritten_notes", "study_material", etc.
    })
      .index("by_status", ["status"])
      .index("by_uploader", ["uploadedBy"])
      .index("by_category", ["category"]),

    // Sections
    sections: defineTable({
      name: v.string(),
      description: v.optional(v.string()),
      questionCount: v.number(),
      order: v.number(),
      isActive: v.boolean(),
    })
      .index("by_order", ["order"])
      .index("by_active", ["isActive"]),

    // Weekly Free Mock Tests
    weeklyTests: defineTable({
      title: v.string(),
      description: v.optional(v.string()),
      scheduledDate: v.number(), // Sunday timestamp
      status: v.string(), // "draft", "scheduled", "active", "completed"
      questionIds: v.array(v.id("questions")),
      publishedAt: v.optional(v.number()),
      leaderboardPublishedAt: v.optional(v.number()),
      totalAttempts: v.number(),
      createdBy: v.id("users"),
    })
      .index("by_status", ["status"])
      .index("by_scheduled_date", ["scheduledDate"]),

    // Weekly Test Attempts
    weeklyTestAttempts: defineTable({
      userId: v.id("users"),
      weeklyTestId: v.id("weeklyTests"),
      answers: v.array(
        v.object({
          questionId: v.id("questions"),
          answer: v.string(),
          isCorrect: v.boolean(),
        })
      ),
      score: v.number(), // percentage
      accuracy: v.number(), // percentage (same as score for clarity)
      avgTimePerQuestion: v.number(), // seconds
      totalTimeSpent: v.number(), // seconds
      correctAnswers: v.number(),
      incorrectAnswers: v.number(),
      completedAt: v.number(),
      rank: v.optional(v.number()), // Final rank after leaderboard publish
    })
      .index("by_user", ["userId"])
      .index("by_weekly_test", ["weeklyTestId"])
      .index("by_user_and_test", ["userId", "weeklyTestId"])
      .index("by_test_and_score", ["weeklyTestId", "score"]),

    // Weekly Test Leaderboard (cached for performance)
    weeklyLeaderboard: defineTable({
      weeklyTestId: v.id("weeklyTests"),
      userId: v.id("users"),
      userName: v.string(),
      userEmail: v.optional(v.string()),
      score: v.number(),
      accuracy: v.number(),
      avgTimePerQuestion: v.number(),
      rank: v.number(),
      completedAt: v.number(),
    })
      .index("by_weekly_test", ["weeklyTestId"])
      .index("by_test_and_rank", ["weeklyTestId", "rank"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;