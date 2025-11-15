"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionStatusValidator = exports.SUBSCRIPTION_STATUS = exports.questionStatusValidator = exports.QUESTION_STATUS = exports.questionTypeValidator = exports.QUESTION_TYPES = exports.contentTypeValidator = exports.CONTENT_TYPES = exports.roleValidator = exports.ROLES = void 0;
var server_1 = require("@convex-dev/auth/server");
var server_2 = require("convex/server");
var values_1 = require("convex/values");
// default user roles
exports.ROLES = {
    ADMIN: "admin",
    USER: "user",
    MEMBER: "member",
};
exports.roleValidator = values_1.v.union(values_1.v.literal(exports.ROLES.ADMIN), values_1.v.literal(exports.ROLES.USER), values_1.v.literal(exports.ROLES.MEMBER));
// Content types
exports.CONTENT_TYPES = {
    PDF: "pdf",
    VIDEO: "video",
    PYQ: "pyq",
};
exports.contentTypeValidator = values_1.v.union(values_1.v.literal(exports.CONTENT_TYPES.PDF), values_1.v.literal(exports.CONTENT_TYPES.VIDEO), values_1.v.literal(exports.CONTENT_TYPES.PYQ));
// Question types
exports.QUESTION_TYPES = {
    MCQ: "mcq",
    TRUE_FALSE: "true_false",
    SHORT_ANSWER: "short_answer",
};
exports.questionTypeValidator = values_1.v.union(values_1.v.literal(exports.QUESTION_TYPES.MCQ), values_1.v.literal(exports.QUESTION_TYPES.TRUE_FALSE), values_1.v.literal(exports.QUESTION_TYPES.SHORT_ANSWER));
// Question status
exports.QUESTION_STATUS = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
};
exports.questionStatusValidator = values_1.v.union(values_1.v.literal(exports.QUESTION_STATUS.PENDING), values_1.v.literal(exports.QUESTION_STATUS.APPROVED), values_1.v.literal(exports.QUESTION_STATUS.REJECTED));
// Subscription status
exports.SUBSCRIPTION_STATUS = {
    ACTIVE: "active",
    INACTIVE: "inactive",
    EXPIRED: "expired",
    CANCELLED: "cancelled",
};
exports.subscriptionStatusValidator = values_1.v.union(values_1.v.literal(exports.SUBSCRIPTION_STATUS.ACTIVE), values_1.v.literal(exports.SUBSCRIPTION_STATUS.INACTIVE), values_1.v.literal(exports.SUBSCRIPTION_STATUS.EXPIRED), values_1.v.literal(exports.SUBSCRIPTION_STATUS.CANCELLED));
var schema = (0, server_2.defineSchema)(__assign(__assign({}, server_1.authTables), { users: (0, server_2.defineTable)({
        name: values_1.v.optional(values_1.v.string()),
        image: values_1.v.optional(values_1.v.string()),
        email: values_1.v.optional(values_1.v.string()),
        emailVerificationTime: values_1.v.optional(values_1.v.number()),
        isAnonymous: values_1.v.optional(values_1.v.boolean()),
        role: values_1.v.optional(exports.roleValidator),
        lastActive: values_1.v.optional(values_1.v.number()),
        examPreparation: values_1.v.optional(values_1.v.string()),
        state: values_1.v.optional(values_1.v.string()),
        avatarUrl: values_1.v.optional(values_1.v.string()),
        isRegistered: values_1.v.optional(values_1.v.boolean()),
        registrationCompleted: values_1.v.optional(values_1.v.boolean()),
        phone: values_1.v.optional(values_1.v.string()),
    })
        .index("email", ["email"]), 
    // Content Management
    content: (0, server_2.defineTable)({
        title: values_1.v.string(),
        description: values_1.v.optional(values_1.v.string()),
        type: exports.contentTypeValidator,
        fileId: values_1.v.optional(values_1.v.id("_storage")),
        fileUrl: values_1.v.optional(values_1.v.string()),
        topicId: values_1.v.optional(values_1.v.id("topics")),
        uploadedBy: values_1.v.id("users"),
        status: values_1.v.string(), // "active", "archived"
        views: values_1.v.number(),
        duration: values_1.v.optional(values_1.v.number()), // for videos in seconds
    })
        .index("by_type", ["type"])
        .index("by_topic", ["topicId"])
        .index("by_uploader", ["uploadedBy"]), 
    // Topics/Categories
    topics: (0, server_2.defineTable)({
        name: values_1.v.string(),
        description: values_1.v.optional(values_1.v.string()),
        parentId: values_1.v.optional(values_1.v.id("topics")),
        order: values_1.v.number(),
    }).index("by_parent", ["parentId"]), 
    // AI Generated Questions
    questions: (0, server_2.defineTable)({
        question: values_1.v.string(),
        options: values_1.v.array(values_1.v.string()),
        correctAnswer: values_1.v.string(),
        subject: values_1.v.string(),
        topic: values_1.v.string(),
        difficulty: values_1.v.union(values_1.v.literal("easy"), values_1.v.literal("medium"), values_1.v.literal("hard")),
        type: values_1.v.union(values_1.v.literal("mcq"), values_1.v.literal("true-false"), values_1.v.literal("fill-in-the-blank")),
        source: values_1.v.union(values_1.v.literal("manual"), values_1.v.literal("ai"), values_1.v.literal("pyq")),
        status: values_1.v.union(values_1.v.literal("pending"), values_1.v.literal("approved"), values_1.v.literal("rejected")),
        createdBy: values_1.v.optional(values_1.v.id("users")),
        reviewedBy: values_1.v.optional(values_1.v.id("users")),
        reviewedAt: values_1.v.optional(values_1.v.number()),
        testSetName: values_1.v.optional(values_1.v.string()),
        setNumber: values_1.v.optional(values_1.v.number()),
        examName: values_1.v.optional(values_1.v.string()),
        examYear: values_1.v.optional(values_1.v.string()),
        sectionId: values_1.v.optional(values_1.v.id("sections")),
        explanation: values_1.v.optional(values_1.v.string()),
        imageUrl: values_1.v.optional(values_1.v.string()), // Add support for image-based questions
        imageStorageId: values_1.v.optional(values_1.v.id("_storage")), // Store image in Convex storage
    })
        .index("by_source", ["source"])
        .index("by_status", ["status"])
        .index("by_subject", ["subject"])
        .index("by_difficulty", ["difficulty"])
        .index("by_topic", ["topic"])
        .index("by_testSetName", ["testSetName"])
        .index("by_examName_and_year", ["examName", "examYear"])
        .index("by_section", ["sectionId"]), 
    // Test Sessions - Track active and completed tests
    testSessions: (0, server_2.defineTable)({
        userId: values_1.v.id("users"),
        testType: values_1.v.string(),
        topicId: values_1.v.optional(values_1.v.id("topics")),
        year: values_1.v.optional(values_1.v.number()),
        setNumber: values_1.v.optional(values_1.v.number()), // Add set number support
        questionIds: values_1.v.array(values_1.v.id("questions")),
        answers: values_1.v.optional(values_1.v.array(values_1.v.object({
            questionId: values_1.v.id("questions"),
            answer: values_1.v.string(),
            isCorrect: values_1.v.optional(values_1.v.boolean()),
        }))),
        status: values_1.v.string(),
        startedAt: values_1.v.number(),
        completedAt: values_1.v.optional(values_1.v.number()),
        timeSpent: values_1.v.optional(values_1.v.number()),
        score: values_1.v.optional(values_1.v.number()),
    })
        .index("by_user", ["userId"])
        .index("by_status", ["status"]), 
    // Test Results - Detailed results storage
    testResults: (0, server_2.defineTable)({
        userId: values_1.v.id("users"),
        sessionId: values_1.v.id("testSessions"),
        testType: values_1.v.string(), // "mock", "pyq", "practice"
        topicId: values_1.v.optional(values_1.v.id("topics")),
        year: values_1.v.optional(values_1.v.number()),
        totalQuestions: values_1.v.number(),
        correctAnswers: values_1.v.number(),
        incorrectAnswers: values_1.v.number(),
        skippedAnswers: values_1.v.number(),
        score: values_1.v.number(), // percentage
        timeSpent: values_1.v.number(),
        weakTopics: values_1.v.optional(values_1.v.array(values_1.v.string())),
    })
        .index("by_user", ["userId"])
        .index("by_session", ["sessionId"])
        .index("by_test_type", ["testType"]), 
    // User Subscriptions
    subscriptions: (0, server_2.defineTable)({
        userId: values_1.v.id("users"),
        planName: values_1.v.string(),
        status: exports.subscriptionStatusValidator,
        startDate: values_1.v.number(),
        endDate: values_1.v.number(),
        amount: values_1.v.number(),
        paymentId: values_1.v.optional(values_1.v.string()),
    })
        .index("by_user", ["userId"])
        .index("by_status", ["status"]), 
    // Payment History
    payments: (0, server_2.defineTable)({
        userId: values_1.v.id("users"),
        subscriptionId: values_1.v.optional(values_1.v.id("subscriptions")),
        amount: values_1.v.number(),
        currency: values_1.v.string(),
        status: values_1.v.string(), // "success", "failed", "pending"
        paymentMethod: values_1.v.optional(values_1.v.string()),
        transactionId: values_1.v.optional(values_1.v.string()),
        orderId: values_1.v.optional(values_1.v.string()), // Cashfree order ID
        paymentSessionId: values_1.v.optional(values_1.v.string()), // Cashfree payment session ID
        planName: values_1.v.optional(values_1.v.string()), // Plan name for the payment
        duration: values_1.v.optional(values_1.v.number()), // Duration in days
        paymentId: values_1.v.optional(values_1.v.string()), // Cashfree payment ID after success
    })
        .index("by_user", ["userId"])
        .index("by_subscription", ["subscriptionId"]), 
    // User Progress & Analytics
    userProgress: (0, server_2.defineTable)({
        userId: values_1.v.id("users"),
        contentId: values_1.v.id("content"),
        topicId: values_1.v.optional(values_1.v.id("topics")),
        progress: values_1.v.number(), // percentage 0-100
        timeSpent: values_1.v.number(), // in seconds
        completed: values_1.v.boolean(),
    })
        .index("by_user", ["userId"])
        .index("by_content", ["contentId"])
        .index("by_user_and_content", ["userId", "contentId"]), 
    // Test Scores
    testScores: (0, server_2.defineTable)({
        userId: values_1.v.id("users"),
        topicId: values_1.v.optional(values_1.v.id("topics")),
        totalQuestions: values_1.v.number(),
        correctAnswers: values_1.v.number(),
        score: values_1.v.number(), // percentage
        timeSpent: values_1.v.number(),
        questionIds: values_1.v.array(values_1.v.id("questions")),
    })
        .index("by_user", ["userId"])
        .index("by_topic", ["topicId"]), 
    // Notifications
    notifications: (0, server_2.defineTable)({
        title: values_1.v.string(),
        message: values_1.v.string(),
        type: values_1.v.string(), // "push", "email", "both"
        targetUsers: values_1.v.optional(values_1.v.array(values_1.v.id("users"))), // if empty, send to all
        sentBy: values_1.v.id("users"),
        sentAt: values_1.v.optional(values_1.v.number()),
        status: values_1.v.string(), // "draft", "sent"
    }).index("by_status", ["status"]), 
    // User Notification Read Status
    userNotificationStatus: (0, server_2.defineTable)({
        userId: values_1.v.id("users"),
        notificationId: values_1.v.id("notifications"),
        isRead: values_1.v.boolean(),
        readAt: values_1.v.optional(values_1.v.number()),
    })
        .index("by_user", ["userId"])
        .index("by_notification", ["notificationId"])
        .index("by_user_and_notification", ["userId", "notificationId"]), 
    // User Feedback
    feedback: (0, server_2.defineTable)({
        userId: values_1.v.id("users"),
        userName: values_1.v.optional(values_1.v.string()),
        userEmail: values_1.v.optional(values_1.v.string()),
        rating: values_1.v.number(), // 1-5 stars
        category: values_1.v.string(), // "bug", "feature", "improvement", "other"
        message: values_1.v.string(),
        status: values_1.v.string(), // "new", "reviewed", "resolved"
        adminNotes: values_1.v.optional(values_1.v.string()),
        reviewedBy: values_1.v.optional(values_1.v.id("users")),
        reviewedAt: values_1.v.optional(values_1.v.number()),
    })
        .index("by_user", ["userId"])
        .index("by_status", ["status"])
        .index("by_category", ["category"]), 
    // Coupon Codes
    coupons: (0, server_2.defineTable)({
        code: values_1.v.string(),
        discountType: values_1.v.union(values_1.v.literal("percentage"), values_1.v.literal("fixed")),
        discountValue: values_1.v.number(),
        isActive: values_1.v.boolean(),
        usageLimit: values_1.v.optional(values_1.v.number()), // null = unlimited
        usageCount: values_1.v.number(),
        expiryDate: values_1.v.optional(values_1.v.number()),
        createdBy: values_1.v.id("users"),
        description: values_1.v.optional(values_1.v.string()),
    })
        .index("by_code", ["code"])
        .index("by_active", ["isActive"]), 
    // Coupon Usage Tracking
    couponUsage: (0, server_2.defineTable)({
        couponId: values_1.v.id("coupons"),
        userId: values_1.v.id("users"),
        orderId: values_1.v.optional(values_1.v.string()),
        discountAmount: values_1.v.number(),
        usedAt: values_1.v.number(),
    })
        .index("by_coupon", ["couponId"])
        .index("by_user", ["userId"]), 
    // Invoices
    invoices: (0, server_2.defineTable)({
        invoiceNumber: values_1.v.string(),
        userId: values_1.v.id("users"),
        subscriptionId: values_1.v.id("subscriptions"),
        paymentId: values_1.v.string(),
        planName: values_1.v.string(),
        amount: values_1.v.number(),
        duration: values_1.v.number(),
        issuedDate: values_1.v.number(),
        emailSent: values_1.v.boolean(),
        emailSentAt: values_1.v.optional(values_1.v.number()),
        emailError: values_1.v.optional(values_1.v.string()),
    })
        .index("by_user", ["userId"])
        .index("by_invoice_number", ["invoiceNumber"])
        .index("by_subscription", ["subscriptionId"]), 
    // Free Study Materials
    studyMaterials: (0, server_2.defineTable)({
        title: values_1.v.string(),
        description: values_1.v.optional(values_1.v.string()),
        fileId: values_1.v.id("_storage"),
        fileUrl: values_1.v.optional(values_1.v.string()),
        uploadedBy: values_1.v.id("users"),
        status: values_1.v.string(), // "active", "archived"
        views: values_1.v.number(),
        category: values_1.v.optional(values_1.v.string()), // "handwritten_notes", "study_material", etc.
    })
        .index("by_status", ["status"])
        .index("by_uploader", ["uploadedBy"])
        .index("by_category", ["category"]), 
    // Sections
    sections: (0, server_2.defineTable)({
        name: values_1.v.string(),
        description: values_1.v.optional(values_1.v.string()),
        questionCount: values_1.v.number(),
        order: values_1.v.number(),
        isActive: values_1.v.boolean(),
    })
        .index("by_order", ["order"])
        .index("by_active", ["isActive"]) }), {
    schemaValidation: false,
});
exports.default = schema;
