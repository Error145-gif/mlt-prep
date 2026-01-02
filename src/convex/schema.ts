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
      tokenIdentifier: v.optional(v.string()),
      welcomeEmailSent: v.optional(v.boolean()),
      hasPassword: v.optional(v.boolean()),
      isOnline: v.optional(v.boolean()),
    })
      .index("email", ["email"])
      .index("by_token", ["tokenIdentifier"])
      .index("by_online", ["isOnline"]),

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
      question: v.string(),
      options: v.array(v.string()),
      correctAnswer: v.string(),
      explanation: v.optional(v.string()),
      imageUrl: v.optional(v.string()),
      imageStorageId: v.optional(v.id("_storage")),
      topicId: v.optional(v.id("topics")),
      subtopic: v.optional(v.string()),
      difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
      category: v.string(), // "mlt", "dmlt", etc.
      status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
      reviewedBy: v.optional(v.id("users")),
      reviewedAt: v.optional(v.number()),
      createdBy: v.optional(v.id("users")),
      source: v.union(v.literal("manual"), v.literal("ai"), v.literal("pyq")),
      
      // For PYQs
      examName: v.optional(v.string()),
      year: v.optional(v.number()),
      setNumber: v.optional(v.number()),
      isPYQ: v.optional(v.boolean()),
      examYear: v.optional(v.string()), // Legacy support

      // For Tests
      testSetId: v.optional(v.id("testSets")),
      
      // Metadata
      hasImage: v.optional(v.boolean()),
      type: v.union(v.literal("mcq"), v.literal("true-false"), v.literal("fill-in-the-blank")),
      subject: v.optional(v.string()),
      topic: v.optional(v.string()), // String version of topic
      sectionId: v.optional(v.id("sections")),
      description: v.optional(v.string()),
      created: v.optional(v.number()),
    })
    .index("by_topic", ["topicId"])
    .index("by_status", ["status"])
    .index("by_section", ["sectionId"])
    .index("by_source", ["source"])
    .index("by_test_set", ["testSetId"]),

    // Test Sets
    testSets: defineTable({
      title: v.string(),
      description: v.optional(v.string()), // Make description optional here too just in case
      category: v.string(),
      type: v.string(), // "mock", "pyq", "practice"
      questions: v.array(v.id("questions")),
      isPublished: v.boolean(),
      timeLimit: v.optional(v.number()), // in minutes
      passingScore: v.optional(v.number()),
    })
    .index("by_category", ["category"])
    .index("by_type", ["type"]),

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

    // Ad-Unlocked Tests (for ₹99 users to unlock extra tests after limit)
    adUnlockedTests: defineTable({
      userId: v.id("users"),
      testType: v.string(), // "mock", "pyq", "ai"
      testSetNumber: v.number(),
      unlockedAt: v.number(),
    })
      .index("by_user_and_type", ["userId", "testType"]),

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
      errorMessage: v.optional(v.string()), // Error message for failed payments
    })
      .index("by_user", ["userId"])
      .index("by_subscription", ["subscriptionId"])
      .index("by_status", ["status"]), // Add index for querying by status (e.g. failed)

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

    // Library PDFs (Yearly Plan Exclusive)
    library: defineTable({
      title: v.string(),
      subject: v.string(), // "Hematology", "Biochemistry", etc.
      pdf_url: v.string(), // Cloudflare R2 public URL
      uploadedBy: v.id("users"),
      status: v.string(), // "active", "archived"
    })
      .index("by_subject", ["subject"])
      .index("by_status", ["status"]),

    // Library Ad Unlocks
    libraryAdUnlocks: defineTable({
      userId: v.id("users"),
      pdfId: v.id("library"),
      unlockedAt: v.number(),
    })
      .index("by_user_and_pdf", ["userId", "pdfId"])
      .index("by_user_and_date", ["userId", "unlockedAt"]),

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
      description: v.optional(v.string()), // Make description optional
      startDate: v.string(),
      endDate: v.string(),
      duration: v.number(), // in minutes
      totalMarks: v.number(),
      passingMarks: v.number(),
      questions: v.array(v.id("questions")),
      isActive: v.boolean(),
      isResultPublished: v.boolean(),
      // Added fields to match code usage
      status: v.optional(v.string()),
      scheduledDate: v.optional(v.number()),
      leaderboardPublishedAt: v.optional(v.number()),
      totalAttempts: v.optional(v.number()),
      publishedAt: v.optional(v.number()),
    })
    .index("by_status", ["status"])
    .index("by_date", ["startDate"]),

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

    // Referral System
    referrals: defineTable({
      referrerId: v.id("users"), // User who shared the link
      referredUserId: v.id("users"), // User who signed up via link
      referralCode: v.string(), // Unique code used
      status: v.union(
        v.literal("pending"), // Signup only
        v.literal("qualified"), // Paid user
        v.literal("rejected"), // Fraud/invalid
        v.literal("cancelled") // Refund happened
      ),
      signupDate: v.number(),
      emailVerified: v.boolean(),
      isPaidUser: v.boolean(),
      purchasedPlanName: v.optional(v.string()),
      amountPaid: v.optional(v.number()),
      starsIssued: v.boolean(),
      starsIssuedAt: v.optional(v.number()),
      paymentId: v.optional(v.string()),
      subscriptionId: v.optional(v.id("subscriptions")),
      fraudFlags: v.optional(v.array(v.string())), // IP match, device match, etc.
      adminNote: v.optional(v.string()),
      rejectedBy: v.optional(v.id("users")),
      rejectedAt: v.optional(v.number()),
    })
      .index("by_referrer", ["referrerId"])
      .index("by_referred", ["referredUserId"])
      .index("by_status", ["status"])
      .index("by_referral_code", ["referralCode"]),

    // Star Wallet
    starWallets: defineTable({
      userId: v.id("users"),
      totalStars: v.number(),
      earnedStars: v.number(),
      usedStars: v.number(),
      availableStars: v.number(), // earnedStars - usedStars
      lastUpdated: v.number(),
    }).index("by_user", ["userId"]),

    // Star Transactions (Audit Log)
    starTransactions: defineTable({
      userId: v.id("users"),
      type: v.union(
        v.literal("earned"), // From referral
        v.literal("used"), // For subscription
        v.literal("expired"), // Auto-expired
        v.literal("reversed"), // Refund/fraud
        v.literal("admin_credit"), // Manual add
        v.literal("admin_debit") // Manual deduct
      ),
      amount: v.number(), // Positive for credit, negative for debit
      referralId: v.optional(v.id("referrals")),
      subscriptionId: v.optional(v.id("subscriptions")),
      expiryDate: v.optional(v.number()), // 90 days from earn date
      isExpired: v.boolean(),
      reason: v.optional(v.string()),
      adminId: v.optional(v.id("users")),
      metadata: v.optional(v.string()), // JSON string for extra data
    })
      .index("by_user", ["userId"])
      .index("by_type", ["type"])
      .index("by_expiry", ["expiryDate"]),

    // Referral Settings (Admin Control)
    referralSettings: defineTable({
      starValueInRupees: v.number(), // Default: 1
      starsPerReferral: v.number(), // Default: 20
      maxStarsUsagePercent: v.number(), // Default: 50
      starExpiryDays: v.number(), // Default: 90
      isReferralEnabled: v.boolean(),
      allowCouponWithStars: v.boolean(), // Default: false
      minPurchaseForReferral: v.number(), // Minimum amount to qualify
    }),

    // Fraud Detection Logs
    referralFraudLogs: defineTable({
      userId: v.id("users"),
      referralId: v.optional(v.id("referrals")),
      fraudType: v.string(), // "duplicate_email", "same_ip", "same_device", etc.
      details: v.string(),
      ipAddress: v.optional(v.string()),
      deviceFingerprint: v.optional(v.string()),
      actionTaken: v.string(), // "blocked", "flagged", "reviewed"
      reviewedBy: v.optional(v.id("users")),
    })
      .index("by_user", ["userId"])
      .index("by_fraud_type", ["fraudType"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;