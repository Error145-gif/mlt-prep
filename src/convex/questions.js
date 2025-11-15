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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUploadUrl = exports.autoCreateTestSets = exports.bulkAddQuestionsWithSection = exports.bulkDeleteQuestions = exports.deleteAllQuestionsBySource = exports.deleteAllAIQuestions = exports.createPYQTestWithQuestions = exports.createAITestWithQuestions = exports.createMockTestWithQuestions = exports.deleteQuestion = exports.createQuestionInternalFromAction = exports.createQuestionInternal = exports.batchCreateImageQuestions = exports.batchCreateQuestions = exports.createImageQuestion = exports.createQuestion = exports.reviewQuestion = exports.getQuestionStatsWithSections = exports.getUnassignedQuestions = exports.getQuestionsBySection = exports.getQuestions = void 0;
var values_1 = require("convex/values");
var server_1 = require("./_generated/server");
var users_1 = require("./users");
var server_2 = require("@convex-dev/auth/server");
// Get questions with filters
exports.getQuestions = (0, server_1.query)({
    args: {
        status: values_1.v.optional(values_1.v.string()),
        topic: values_1.v.optional(values_1.v.string()),
        sectionId: values_1.v.optional(values_1.v.id("sections")),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, questions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        return [2 /*return*/, []];
                    }
                    if (!args.status) return [3 /*break*/, 3];
                    return [4 /*yield*/, ctx.db
                            .query("questions")
                            .withIndex("by_status", function (q) { return q.eq("status", args.status); })
                            .collect()];
                case 2:
                    questions = _a.sent();
                    return [3 /*break*/, 9];
                case 3:
                    if (!args.topic) return [3 /*break*/, 5];
                    return [4 /*yield*/, ctx.db
                            .query("questions")
                            .withIndex("by_topic", function (q) { return q.eq("topic", args.topic); })
                            .collect()];
                case 4:
                    questions = _a.sent();
                    return [3 /*break*/, 9];
                case 5:
                    if (!args.sectionId) return [3 /*break*/, 7];
                    return [4 /*yield*/, ctx.db
                            .query("questions")
                            .withIndex("by_section", function (q) { return q.eq("sectionId", args.sectionId); })
                            .collect()];
                case 6:
                    questions = _a.sent();
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, ctx.db.query("questions").collect()];
                case 8:
                    questions = _a.sent();
                    _a.label = 9;
                case 9: return [2 /*return*/, questions];
            }
        });
    }); },
});
// Get questions by section
exports.getQuestionsBySection = (0, server_1.query)({
    args: { sectionId: values_1.v.id("sections") },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var questions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db
                        .query("questions")
                        .withIndex("by_section", function (q) { return q.eq("sectionId", args.sectionId); })
                        .collect()];
                case 1:
                    questions = _a.sent();
                    return [2 /*return*/, questions];
            }
        });
    }); },
});
// Get unassigned questions (leftover questions that don't form complete sets)
exports.getUnassignedQuestions = (0, server_1.query)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var user, manualQuestions, aiQuestions, pyqQuestions, manualLeftover, aiLeftover, pyqLeftover, manualUnassigned, aiUnassigned, pyqUnassigned;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        return [2 /*return*/, {
                                manual: [],
                                ai: [],
                                pyq: [],
                                counts: { manual: 0, ai: 0, pyq: 0 }
                            }];
                    }
                    return [4 /*yield*/, ctx.db
                            .query("questions")
                            .withIndex("by_source", function (q) { return q.eq("source", "manual"); })
                            .filter(function (q) { return q.eq(q.field("status"), "approved"); })
                            .collect()];
                case 2:
                    manualQuestions = _a.sent();
                    return [4 /*yield*/, ctx.db
                            .query("questions")
                            .withIndex("by_source", function (q) { return q.eq("source", "ai"); })
                            .filter(function (q) { return q.eq(q.field("status"), "approved"); })
                            .collect()];
                case 3:
                    aiQuestions = _a.sent();
                    return [4 /*yield*/, ctx.db
                            .query("questions")
                            .withIndex("by_source", function (q) { return q.eq("source", "pyq"); })
                            .filter(function (q) { return q.eq(q.field("status"), "approved"); })
                            .collect()];
                case 4:
                    pyqQuestions = _a.sent();
                    manualLeftover = manualQuestions.length % 100;
                    aiLeftover = aiQuestions.length % 25;
                    pyqLeftover = pyqQuestions.length % 20;
                    manualUnassigned = manualLeftover > 0
                        ? manualQuestions.slice(-manualLeftover)
                        : [];
                    aiUnassigned = aiLeftover > 0
                        ? aiQuestions.slice(-aiLeftover)
                        : [];
                    pyqUnassigned = pyqLeftover > 0
                        ? pyqQuestions.slice(-pyqLeftover)
                        : [];
                    return [2 /*return*/, {
                            manual: manualUnassigned,
                            ai: aiUnassigned,
                            pyq: pyqUnassigned,
                            counts: {
                                manual: manualLeftover,
                                ai: aiLeftover,
                                pyq: pyqLeftover,
                            },
                        }];
            }
        });
    }); },
});
// Get question statistics with section breakdown
exports.getQuestionStatsWithSections = (0, server_1.query)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var allQuestions, stats, sections, _loop_1, _i, sections_1, section;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.query("questions").collect()];
                case 1:
                    allQuestions = _a.sent();
                    stats = {
                        total: allQuestions.length,
                        bySource: {
                            manual: allQuestions.filter(function (q) { return q.source === "manual"; }).length,
                            ai: allQuestions.filter(function (q) { return q.source === "ai"; }).length,
                            pyq: allQuestions.filter(function (q) { return q.source === "pyq"; }).length,
                        },
                        byDifficulty: {
                            easy: allQuestions.filter(function (q) { return q.difficulty === "easy"; }).length,
                            medium: allQuestions.filter(function (q) { return q.difficulty === "medium"; }).length,
                            hard: allQuestions.filter(function (q) { return q.difficulty === "hard"; }).length,
                        },
                        bySection: {},
                        unassigned: allQuestions.filter(function (q) { return !q.sectionId; }).length,
                    };
                    return [4 /*yield*/, ctx.db.query("sections").collect()];
                case 2:
                    sections = _a.sent();
                    _loop_1 = function (section) {
                        var count = allQuestions.filter(function (q) { return q.sectionId === section._id; }).length;
                        stats.bySection[section.name] = count;
                    };
                    for (_i = 0, sections_1 = sections; _i < sections_1.length; _i++) {
                        section = sections_1[_i];
                        _loop_1(section);
                    }
                    return [2 /*return*/, stats];
            }
        });
    }); },
});
// Review question (approve/reject)
exports.reviewQuestion = (0, server_1.mutation)({
    args: {
        id: values_1.v.id("questions"),
        status: values_1.v.string(),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized");
                    }
                    return [4 /*yield*/, ctx.db.patch(args.id, {
                            status: args.status,
                            reviewedBy: user._id,
                            reviewedAt: Date.now(),
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, args.id];
            }
        });
    }); },
});
// Create question manually
exports.createQuestion = (0, server_1.mutation)({
    args: {
        type: values_1.v.string(),
        question: values_1.v.string(),
        options: values_1.v.optional(values_1.v.array(values_1.v.string())),
        correctAnswer: values_1.v.string(),
        explanation: values_1.v.optional(values_1.v.string()),
        difficulty: values_1.v.optional(values_1.v.string()),
        source: values_1.v.optional(values_1.v.string()),
        examName: values_1.v.optional(values_1.v.string()),
        subject: values_1.v.optional(values_1.v.string()),
        topic: values_1.v.string(),
        sectionId: values_1.v.optional(values_1.v.id("sections")),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized");
                    }
                    return [4 /*yield*/, ctx.db.insert("questions", {
                            question: args.question,
                            options: args.options || [],
                            correctAnswer: args.correctAnswer,
                            subject: args.subject || "General",
                            topic: args.topic,
                            difficulty: (args.difficulty || "medium"),
                            type: args.type,
                            status: "approved",
                            reviewedBy: user._id,
                            reviewedAt: Date.now(),
                            createdBy: user._id,
                            source: (args.source || "manual"),
                            explanation: args.explanation,
                            examName: args.examName,
                            sectionId: args.sectionId,
                        })];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Create image-based question
exports.createImageQuestion = (0, server_1.mutation)({
    args: {
        type: values_1.v.string(),
        question: values_1.v.string(),
        options: values_1.v.optional(values_1.v.array(values_1.v.string())),
        correctAnswer: values_1.v.string(),
        explanation: values_1.v.optional(values_1.v.string()),
        difficulty: values_1.v.optional(values_1.v.string()),
        source: values_1.v.string(), // "ai" or "manual"
        subject: values_1.v.optional(values_1.v.string()),
        topic: values_1.v.string(),
        imageStorageId: values_1.v.id("_storage"),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, imageUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized");
                    }
                    return [4 /*yield*/, ctx.storage.getUrl(args.imageStorageId)];
                case 2:
                    imageUrl = _a.sent();
                    if (!imageUrl) {
                        throw new Error("Failed to get image URL");
                    }
                    return [4 /*yield*/, ctx.db.insert("questions", {
                            question: args.question,
                            options: args.options || [],
                            correctAnswer: args.correctAnswer,
                            subject: args.subject || "General",
                            topic: args.topic,
                            difficulty: (args.difficulty || "medium"),
                            type: args.type,
                            status: "approved",
                            reviewedBy: user._id,
                            reviewedAt: Date.now(),
                            createdBy: user._id,
                            source: args.source,
                            explanation: args.explanation,
                            imageUrl: imageUrl,
                            imageStorageId: args.imageStorageId,
                        })];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Batch create questions (for bulk manual entry)
exports.batchCreateQuestions = (0, server_1.mutation)({
    args: {
        questions: values_1.v.array(values_1.v.object({
            type: values_1.v.string(),
            question: values_1.v.string(),
            options: values_1.v.optional(values_1.v.array(values_1.v.string())),
            correctAnswer: values_1.v.string(),
            explanation: values_1.v.optional(values_1.v.string()),
            difficulty: values_1.v.optional(values_1.v.string()),
            source: values_1.v.optional(values_1.v.string()),
            examName: values_1.v.optional(values_1.v.string()),
            subject: values_1.v.optional(values_1.v.string()),
            topic: values_1.v.string(),
            sectionId: values_1.v.optional(values_1.v.id("sections")),
        })),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, ids, i, question, id, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized");
                    }
                    // Limit to 50 questions per batch
                    if (args.questions.length > 50) {
                        throw new Error("Cannot add more than 50 questions at once");
                    }
                    console.log("Backend: Attempting to insert ".concat(args.questions.length, " questions..."));
                    ids = [];
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < args.questions.length)) return [3 /*break*/, 7];
                    question = args.questions[i];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, ctx.db.insert("questions", {
                            question: question.question,
                            options: question.options || [],
                            correctAnswer: question.correctAnswer,
                            subject: question.subject || "General",
                            topic: question.topic,
                            difficulty: (question.difficulty || "medium"),
                            type: question.type,
                            status: "approved",
                            reviewedBy: user._id,
                            reviewedAt: Date.now(),
                            createdBy: user._id,
                            source: (question.source || "manual"),
                            explanation: question.explanation,
                            examName: question.examName,
                            sectionId: question.sectionId,
                        })];
                case 4:
                    id = _a.sent();
                    ids.push(id);
                    console.log("Backend: Successfully inserted question ".concat(i + 1, "/").concat(args.questions.length, " with ID: ").concat(id));
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error("Backend: Failed to insert question ".concat(i + 1, ":"), error_1);
                    throw new Error("Failed to insert question ".concat(i + 1, ": ").concat(error_1 instanceof Error ? error_1.message : 'Unknown error'));
                case 6:
                    i++;
                    return [3 /*break*/, 2];
                case 7:
                    console.log("Backend: Successfully inserted all ".concat(ids.length, " questions"));
                    return [2 /*return*/, ids];
            }
        });
    }); },
});
// Batch create image-based questions
exports.batchCreateImageQuestions = (0, server_1.mutation)({
    args: {
        questions: values_1.v.array(values_1.v.object({
            type: values_1.v.string(),
            question: values_1.v.string(),
            options: values_1.v.optional(values_1.v.array(values_1.v.string())),
            correctAnswer: values_1.v.string(),
            explanation: values_1.v.optional(values_1.v.string()),
            difficulty: values_1.v.optional(values_1.v.string()),
            source: values_1.v.string(),
            subject: values_1.v.optional(values_1.v.string()),
            topic: values_1.v.string(),
            imageStorageId: values_1.v.id("_storage"),
        })),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, ids, i, question, imageUrl, id, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized");
                    }
                    if (args.questions.length > 50) {
                        throw new Error("Cannot add more than 50 questions at once");
                    }
                    ids = [];
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < args.questions.length)) return [3 /*break*/, 8];
                    question = args.questions[i];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 6, , 7]);
                    return [4 /*yield*/, ctx.storage.getUrl(question.imageStorageId)];
                case 4:
                    imageUrl = _a.sent();
                    if (!imageUrl) {
                        throw new Error("Failed to get image URL for question ".concat(i + 1));
                    }
                    return [4 /*yield*/, ctx.db.insert("questions", {
                            question: question.question,
                            options: question.options || [],
                            correctAnswer: question.correctAnswer,
                            subject: question.subject || "General",
                            topic: question.topic,
                            difficulty: (question.difficulty || "medium"),
                            type: question.type,
                            status: "approved",
                            reviewedBy: user._id,
                            reviewedAt: Date.now(),
                            createdBy: user._id,
                            source: question.source,
                            explanation: question.explanation,
                            imageUrl: imageUrl,
                            imageStorageId: question.imageStorageId,
                        })];
                case 5:
                    id = _a.sent();
                    ids.push(id);
                    return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    console.error("Failed to insert image question ".concat(i + 1, ":"), error_2);
                    throw new Error("Failed to insert image question ".concat(i + 1, ": ").concat(error_2 instanceof Error ? error_2.message : 'Unknown error'));
                case 7:
                    i++;
                    return [3 /*break*/, 2];
                case 8: return [2 /*return*/, ids];
            }
        });
    }); },
});
// Internal mutation for batch creation (used by actions)
exports.createQuestionInternal = (0, server_1.internalMutation)({
    args: {
        type: values_1.v.string(),
        question: values_1.v.string(),
        options: values_1.v.optional(values_1.v.array(values_1.v.string())),
        correctAnswer: values_1.v.string(),
        explanation: values_1.v.optional(values_1.v.string()),
        difficulty: values_1.v.optional(values_1.v.string()),
        source: values_1.v.optional(values_1.v.string()),
        examName: values_1.v.optional(values_1.v.string()),
        subject: values_1.v.optional(values_1.v.string()),
        topic: values_1.v.string(),
        sectionId: values_1.v.optional(values_1.v.id("sections")),
        createdBy: values_1.v.id("users"),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.insert("questions", {
                        question: args.question,
                        options: args.options || [],
                        correctAnswer: args.correctAnswer,
                        subject: args.subject || "General",
                        topic: args.topic,
                        difficulty: (args.difficulty || "medium"),
                        type: args.type,
                        source: (args.source || "manual"),
                        status: "approved",
                        createdBy: args.createdBy,
                        reviewedBy: args.createdBy,
                        reviewedAt: Date.now(),
                        explanation: args.explanation,
                        examName: args.examName,
                        sectionId: args.sectionId,
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Internal mutation for AI-generated questions (doesn't require createdBy from caller)
exports.createQuestionInternalFromAction = (0, server_1.internalMutation)({
    args: {
        type: values_1.v.string(),
        question: values_1.v.string(),
        options: values_1.v.optional(values_1.v.array(values_1.v.string())),
        correctAnswer: values_1.v.string(),
        explanation: values_1.v.optional(values_1.v.string()),
        difficulty: values_1.v.optional(values_1.v.string()),
        source: values_1.v.optional(values_1.v.string()),
        examName: values_1.v.optional(values_1.v.string()),
        subject: values_1.v.optional(values_1.v.string()),
        topic: values_1.v.string(),
        sectionId: values_1.v.optional(values_1.v.id("sections")),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.insert("questions", {
                        question: args.question,
                        options: args.options || [],
                        correctAnswer: args.correctAnswer,
                        subject: args.subject || "General",
                        topic: args.topic,
                        difficulty: (args.difficulty || "medium"),
                        type: args.type,
                        source: (args.source || "ai"),
                        status: "approved",
                        reviewedAt: Date.now(),
                        explanation: args.explanation,
                        examName: args.examName,
                        sectionId: args.sectionId,
                    })];
                case 1: 
                // For AI-generated questions, we don't need a specific user
                return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Delete question
exports.deleteQuestion = (0, server_1.mutation)({
    args: { id: values_1.v.id("questions") },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized");
                    }
                    return [4 /*yield*/, ctx.db.delete(args.id)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, args.id];
            }
        });
    }); },
});
// Create mock test with bulk questions
exports.createMockTestWithQuestions = (0, server_1.mutation)({
    args: {
        testSetName: values_1.v.string(),
        topicId: values_1.v.optional(values_1.v.id("topics")),
        newTopicName: values_1.v.optional(values_1.v.string()),
        questions: values_1.v.array(values_1.v.object({
            type: values_1.v.string(),
            question: values_1.v.string(),
            options: values_1.v.optional(values_1.v.array(values_1.v.string())),
            correctAnswer: values_1.v.string(),
            explanation: values_1.v.optional(values_1.v.string()),
            difficulty: values_1.v.optional(values_1.v.string()),
            subject: values_1.v.optional(values_1.v.string()),
        })),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, topicId, topicName, existingTopics, maxOrder, topic, questionIds, i, question, id, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized");
                    }
                    // Validate question count
                    if (args.questions.length === 0 || args.questions.length > 100) {
                        throw new Error("Please provide between 1 and 100 questions");
                    }
                    topicId = args.topicId;
                    topicName = "";
                    if (!(!topicId && args.newTopicName)) return [3 /*break*/, 4];
                    return [4 /*yield*/, ctx.db.query("topics").collect()];
                case 2:
                    existingTopics = _a.sent();
                    maxOrder = Math.max.apply(Math, __spreadArray(__spreadArray([], existingTopics.map(function (t) { return t.order; }), false), [0], false));
                    return [4 /*yield*/, ctx.db.insert("topics", {
                            name: args.newTopicName,
                            description: "Mock test set: ".concat(args.testSetName),
                            order: maxOrder + 1,
                        })];
                case 3:
                    topicId = _a.sent();
                    topicName = args.newTopicName;
                    return [3 /*break*/, 7];
                case 4:
                    if (!topicId) return [3 /*break*/, 6];
                    return [4 /*yield*/, ctx.db.get(topicId)];
                case 5:
                    topic = _a.sent();
                    if (!topic) {
                        throw new Error("Topic not found");
                    }
                    topicName = topic.name;
                    return [3 /*break*/, 7];
                case 6: throw new Error("Please select a topic or provide a new topic name");
                case 7:
                    questionIds = [];
                    i = 0;
                    _a.label = 8;
                case 8:
                    if (!(i < args.questions.length)) return [3 /*break*/, 13];
                    question = args.questions[i];
                    _a.label = 9;
                case 9:
                    _a.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, ctx.db.insert("questions", {
                            question: question.question,
                            options: question.options || [],
                            correctAnswer: question.correctAnswer,
                            subject: question.subject || "General",
                            topic: question.subject || "General",
                            difficulty: (question.difficulty || "medium"),
                            type: question.type,
                            source: "manual",
                            status: "approved",
                            reviewedBy: user._id,
                            reviewedAt: Date.now(),
                            createdBy: user._id,
                            explanation: question.explanation,
                        })];
                case 10:
                    id = _a.sent();
                    questionIds.push(id);
                    return [3 /*break*/, 12];
                case 11:
                    error_3 = _a.sent();
                    console.error("Failed to insert question ".concat(i + 1, ":"), error_3);
                    throw new Error("Failed to insert question ".concat(i + 1, ": ").concat(error_3 instanceof Error ? error_3.message : 'Unknown error'));
                case 12:
                    i++;
                    return [3 /*break*/, 8];
                case 13: return [2 /*return*/, {
                        success: true,
                        testSetName: args.testSetName,
                        topicName: topicName,
                        questionCount: questionIds.length,
                        topicId: topicId,
                    }];
            }
        });
    }); },
});
// Create AI test with bulk questions
exports.createAITestWithQuestions = (0, server_1.mutation)({
    args: {
        testSetName: values_1.v.string(),
        topicId: values_1.v.optional(values_1.v.id("topics")),
        newTopicName: values_1.v.optional(values_1.v.string()),
        questions: values_1.v.array(values_1.v.object({
            type: values_1.v.string(),
            question: values_1.v.string(),
            options: values_1.v.optional(values_1.v.array(values_1.v.string())),
            correctAnswer: values_1.v.string(),
            explanation: values_1.v.optional(values_1.v.string()),
            difficulty: values_1.v.optional(values_1.v.string()),
            subject: values_1.v.optional(values_1.v.string()),
        })),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, topicId, topicName, existingTopics, maxOrder, topic, questionIds, i, question, id, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized");
                    }
                    // Validate question count
                    if (args.questions.length === 0 || args.questions.length > 100) {
                        throw new Error("Please provide between 1 and 100 questions");
                    }
                    topicId = args.topicId;
                    topicName = "";
                    if (!(!topicId && args.newTopicName)) return [3 /*break*/, 4];
                    return [4 /*yield*/, ctx.db.query("topics").collect()];
                case 2:
                    existingTopics = _a.sent();
                    maxOrder = Math.max.apply(Math, __spreadArray(__spreadArray([], existingTopics.map(function (t) { return t.order; }), false), [0], false));
                    return [4 /*yield*/, ctx.db.insert("topics", {
                            name: args.newTopicName,
                            description: "AI test set: ".concat(args.testSetName),
                            order: maxOrder + 1,
                        })];
                case 3:
                    topicId = _a.sent();
                    topicName = args.newTopicName;
                    return [3 /*break*/, 7];
                case 4:
                    if (!topicId) return [3 /*break*/, 6];
                    return [4 /*yield*/, ctx.db.get(topicId)];
                case 5:
                    topic = _a.sent();
                    if (!topic) {
                        throw new Error("Topic not found");
                    }
                    topicName = topic.name;
                    return [3 /*break*/, 7];
                case 6: throw new Error("Please select a topic or provide a new topic name");
                case 7:
                    questionIds = [];
                    i = 0;
                    _a.label = 8;
                case 8:
                    if (!(i < args.questions.length)) return [3 /*break*/, 13];
                    question = args.questions[i];
                    _a.label = 9;
                case 9:
                    _a.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, ctx.db.insert("questions", {
                            question: question.question,
                            options: question.options || [],
                            correctAnswer: question.correctAnswer,
                            subject: question.subject || "General",
                            topic: question.subject || "General",
                            difficulty: (question.difficulty || "medium"),
                            type: question.type,
                            source: "ai",
                            status: "approved",
                            reviewedBy: user._id,
                            reviewedAt: Date.now(),
                            createdBy: user._id,
                            explanation: question.explanation,
                        })];
                case 10:
                    id = _a.sent();
                    questionIds.push(id);
                    return [3 /*break*/, 12];
                case 11:
                    error_4 = _a.sent();
                    console.error("Failed to insert AI question ".concat(i + 1, ":"), error_4);
                    throw new Error("Failed to insert AI question ".concat(i + 1, ": ").concat(error_4 instanceof Error ? error_4.message : 'Unknown error'));
                case 12:
                    i++;
                    return [3 /*break*/, 8];
                case 13: return [2 /*return*/, {
                        success: true,
                        testSetName: args.testSetName,
                        topicName: topicName,
                        questionCount: questionIds.length,
                        topicId: topicId,
                    }];
            }
        });
    }); },
});
// Create PYQ test with bulk questions (automatically splits into sets of 20)
exports.createPYQTestWithQuestions = (0, server_1.mutation)({
    args: {
        examName: values_1.v.string(),
        year: values_1.v.number(),
        questions: values_1.v.array(values_1.v.object({
            type: values_1.v.string(),
            question: values_1.v.string(),
            options: values_1.v.optional(values_1.v.array(values_1.v.string())),
            correctAnswer: values_1.v.string(),
            explanation: values_1.v.optional(values_1.v.string()),
            difficulty: values_1.v.optional(values_1.v.string()),
            subject: values_1.v.optional(values_1.v.string()),
        })),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, setsCreated, totalQuestions, questionsPerSet, numberOfSets, setIndex, startIdx, endIdx, setQuestions, setNumber, questionIds, i, question, id, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized");
                    }
                    // Validate question count
                    if (args.questions.length === 0) {
                        throw new Error("Please provide at least 1 question");
                    }
                    setsCreated = [];
                    totalQuestions = args.questions.length;
                    questionsPerSet = 20;
                    numberOfSets = Math.ceil(totalQuestions / questionsPerSet);
                    setIndex = 0;
                    _a.label = 2;
                case 2:
                    if (!(setIndex < numberOfSets)) return [3 /*break*/, 10];
                    startIdx = setIndex * questionsPerSet;
                    endIdx = Math.min(startIdx + questionsPerSet, totalQuestions);
                    setQuestions = args.questions.slice(startIdx, endIdx);
                    setNumber = setIndex + 1;
                    questionIds = [];
                    i = 0;
                    _a.label = 3;
                case 3:
                    if (!(i < setQuestions.length)) return [3 /*break*/, 8];
                    question = setQuestions[i];
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, ctx.db.insert("questions", {
                            question: question.question,
                            options: question.options || [],
                            correctAnswer: question.correctAnswer,
                            subject: question.subject || "General",
                            topic: question.subject || "General",
                            difficulty: (question.difficulty || "medium"),
                            type: question.type,
                            source: "pyq",
                            examName: args.examName,
                            examYear: args.year.toString(),
                            setNumber: setNumber,
                            status: "approved",
                            reviewedBy: user._id,
                            reviewedAt: Date.now(),
                            createdBy: user._id,
                            explanation: question.explanation,
                        })];
                case 5:
                    id = _a.sent();
                    questionIds.push(id);
                    return [3 /*break*/, 7];
                case 6:
                    error_5 = _a.sent();
                    console.error("Failed to insert PYQ question ".concat(i + 1, " in set ").concat(setNumber, ":"), error_5);
                    throw new Error("Failed to insert PYQ question ".concat(i + 1, " in set ").concat(setNumber, ": ").concat(error_5 instanceof Error ? error_5.message : 'Unknown error'));
                case 7:
                    i++;
                    return [3 /*break*/, 3];
                case 8:
                    setsCreated.push({
                        setNumber: setNumber,
                        questionCount: questionIds.length,
                    });
                    _a.label = 9;
                case 9:
                    setIndex++;
                    return [3 /*break*/, 2];
                case 10: return [2 /*return*/, {
                        success: true,
                        examName: args.examName,
                        year: args.year,
                        totalQuestions: totalQuestions,
                        setsCreated: setsCreated,
                        numberOfSets: numberOfSets,
                    }];
            }
        });
    }); },
});
// Delete all AI-based questions
exports.deleteAllAIQuestions = (0, server_1.mutation)({
    args: {},
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, aiQuestions, deletedCount, _i, aiQuestions_1, question, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized");
                    }
                    return [4 /*yield*/, ctx.db
                            .query("questions")
                            .withIndex("by_source", function (q) { return q.eq("source", "ai"); })
                            .collect()];
                case 2:
                    aiQuestions = _a.sent();
                    console.log("Found ".concat(aiQuestions.length, " AI questions to delete"));
                    deletedCount = 0;
                    _i = 0, aiQuestions_1 = aiQuestions;
                    _a.label = 3;
                case 3:
                    if (!(_i < aiQuestions_1.length)) return [3 /*break*/, 8];
                    question = aiQuestions_1[_i];
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, ctx.db.delete(question._id)];
                case 5:
                    _a.sent();
                    deletedCount++;
                    return [3 /*break*/, 7];
                case 6:
                    error_6 = _a.sent();
                    console.error("Failed to delete question ".concat(question._id, ":"), error_6);
                    return [3 /*break*/, 7];
                case 7:
                    _i++;
                    return [3 /*break*/, 3];
                case 8:
                    console.log("Successfully deleted ".concat(deletedCount, " AI questions"));
                    return [2 /*return*/, {
                            success: true,
                            deletedCount: deletedCount,
                            totalFound: aiQuestions.length,
                        }];
            }
        });
    }); },
});
// Delete all questions by source type
exports.deleteAllQuestionsBySource = (0, server_1.mutation)({
    args: {
        source: values_1.v.string(), // "manual", "ai", or "pyq"
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, questions, deletedCount, _i, questions_1, question, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized");
                    }
                    // Validate source type
                    if (!["manual", "ai", "pyq"].includes(args.source)) {
                        throw new Error("Invalid source type. Must be 'manual', 'ai', or 'pyq'");
                    }
                    return [4 /*yield*/, ctx.db
                            .query("questions")
                            .withIndex("by_source", function (q) { return q.eq("source", args.source); })
                            .collect()];
                case 2:
                    questions = _a.sent();
                    console.log("Found ".concat(questions.length, " questions with source '").concat(args.source, "' to delete"));
                    deletedCount = 0;
                    _i = 0, questions_1 = questions;
                    _a.label = 3;
                case 3:
                    if (!(_i < questions_1.length)) return [3 /*break*/, 8];
                    question = questions_1[_i];
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, ctx.db.delete(question._id)];
                case 5:
                    _a.sent();
                    deletedCount++;
                    return [3 /*break*/, 7];
                case 6:
                    error_7 = _a.sent();
                    console.error("Failed to delete question ".concat(question._id, ":"), error_7);
                    return [3 /*break*/, 7];
                case 7:
                    _i++;
                    return [3 /*break*/, 3];
                case 8:
                    console.log("Successfully deleted ".concat(deletedCount, " questions with source '").concat(args.source, "'"));
                    return [2 /*return*/, {
                            success: true,
                            deletedCount: deletedCount,
                            totalFound: questions.length,
                            source: args.source,
                        }];
            }
        });
    }); },
});
// Bulk delete questions
exports.bulkDeleteQuestions = (0, server_1.mutation)({
    args: { questionIds: values_1.v.array(values_1.v.id("questions")) },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, user, deletedCount, sectionIds, _i, _a, questionId, question, _loop_2, _b, sectionIds_1, sectionId;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, server_2.getAuthUserId)(ctx)];
                case 1:
                    userId = _c.sent();
                    if (!userId) {
                        throw new Error("Not authenticated");
                    }
                    return [4 /*yield*/, ctx.db.get(userId)];
                case 2:
                    user = _c.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized: Admin access required");
                    }
                    deletedCount = 0;
                    sectionIds = new Set();
                    _i = 0, _a = args.questionIds;
                    _c.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    questionId = _a[_i];
                    return [4 /*yield*/, ctx.db.get(questionId)];
                case 4:
                    question = _c.sent();
                    if (question && question.sectionId) {
                        sectionIds.add(question.sectionId);
                    }
                    return [4 /*yield*/, ctx.db.delete(questionId)];
                case 5:
                    _c.sent();
                    deletedCount++;
                    _c.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 3];
                case 7:
                    _loop_2 = function (sectionId) {
                        var questions;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, ctx.db
                                        .query("questions")
                                        .withIndex("by_section", function (q) { return q.eq("sectionId", sectionId); })
                                        .collect()];
                                case 1:
                                    questions = _d.sent();
                                    return [4 /*yield*/, ctx.db.patch(sectionId, { questionCount: questions.length })];
                                case 2:
                                    _d.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _b = 0, sectionIds_1 = sectionIds;
                    _c.label = 8;
                case 8:
                    if (!(_b < sectionIds_1.length)) return [3 /*break*/, 11];
                    sectionId = sectionIds_1[_b];
                    return [5 /*yield**/, _loop_2(sectionId)];
                case 9:
                    _c.sent();
                    _c.label = 10;
                case 10:
                    _b++;
                    return [3 /*break*/, 8];
                case 11: return [2 /*return*/, { success: true, deletedCount: deletedCount }];
            }
        });
    }); },
});
// Enhanced bulk add with section assignment
exports.bulkAddQuestionsWithSection = (0, server_1.mutation)({
    args: {
        questions: values_1.v.array(values_1.v.object({
            question: values_1.v.string(),
            options: values_1.v.array(values_1.v.string()),
            correctAnswer: values_1.v.string(),
            subject: values_1.v.string(),
            topic: values_1.v.string(),
            difficulty: values_1.v.union(values_1.v.literal("easy"), values_1.v.literal("medium"), values_1.v.literal("hard")),
            type: values_1.v.union(values_1.v.literal("mcq"), values_1.v.literal("true-false"), values_1.v.literal("fill-in-the-blank")),
            source: values_1.v.union(values_1.v.literal("manual"), values_1.v.literal("ai"), values_1.v.literal("pyq")),
            explanation: values_1.v.optional(values_1.v.string()),
        })),
        sectionId: values_1.v.id("sections"),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, user, questionIds, _i, _a, question, questionId, section;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, server_2.getAuthUserId)(ctx)];
                case 1:
                    userId = _b.sent();
                    if (!userId) {
                        throw new Error("Not authenticated");
                    }
                    return [4 /*yield*/, ctx.db.get(userId)];
                case 2:
                    user = _b.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized: Admin access required");
                    }
                    if (args.questions.length > 100) {
                        throw new Error("Cannot add more than 100 questions at once");
                    }
                    questionIds = [];
                    _i = 0, _a = args.questions;
                    _b.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    question = _a[_i];
                    return [4 /*yield*/, ctx.db.insert("questions", __assign(__assign({}, question), { sectionId: args.sectionId, status: "approved", createdBy: userId, reviewedBy: userId, reviewedAt: Date.now() }))];
                case 4:
                    questionId = _b.sent();
                    questionIds.push(questionId);
                    _b.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [4 /*yield*/, ctx.db.get(args.sectionId)];
                case 7:
                    section = _b.sent();
                    if (!section) return [3 /*break*/, 9];
                    return [4 /*yield*/, ctx.db.patch(args.sectionId, {
                            questionCount: section.questionCount + questionIds.length,
                        })];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [2 /*return*/, { success: true, count: questionIds.length, questionIds: questionIds }];
            }
        });
    }); },
});
// Add new mutation for automatic test set creation with shuffled options
exports.autoCreateTestSets = (0, server_1.mutation)({
    args: {
        source: values_1.v.union(values_1.v.literal("manual"), values_1.v.literal("ai"), values_1.v.literal("pyq")),
        topicId: values_1.v.optional(values_1.v.id("topics")),
        examName: values_1.v.optional(values_1.v.string()),
        year: values_1.v.optional(values_1.v.number()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, allQuestions, unassignedQuestions, setSize, numberOfSets, existingSets, maxSetNumber, questionsProcessed, lastCorrectPosition, shuffleOptions, setNum, setNumber, startIdx, endIdx, setQuestions, _loop_3, _i, setQuestions_1, question;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized");
                    }
                    return [4 /*yield*/, ctx.db
                            .query("questions")
                            .filter(function (q) { return q.eq(q.field("source"), args.source); })
                            .collect()];
                case 2:
                    allQuestions = _a.sent();
                    unassignedQuestions = allQuestions.filter(function (q) { return !q.setNumber; });
                    if (unassignedQuestions.length === 0) {
                        return [2 /*return*/, { success: false, message: "No unassigned questions found" }];
                    }
                    if (args.source === "manual") {
                        setSize = 100; // Mock tests
                    }
                    else if (args.source === "pyq") {
                        setSize = 20;
                    }
                    else {
                        setSize = 25; // AI-based
                    }
                    numberOfSets = Math.floor(unassignedQuestions.length / setSize);
                    if (numberOfSets === 0) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Not enough questions. Need ".concat(setSize, " questions per set, found ").concat(unassignedQuestions.length)
                            }];
                    }
                    existingSets = allQuestions
                        .filter(function (q) { return q.setNumber !== undefined; })
                        .map(function (q) { return q.setNumber; });
                    maxSetNumber = existingSets.length > 0 ? Math.max.apply(Math, existingSets) : 0;
                    questionsProcessed = 0;
                    lastCorrectPosition = -1;
                    shuffleOptions = function (options, correctAnswer, avoidPosition) {
                        if (!options || options.length === 0) {
                            return { shuffledOptions: [], newCorrectAnswer: correctAnswer };
                        }
                        var correctIndex = options.findIndex(function (opt) {
                            return opt.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
                        });
                        if (correctIndex === -1) {
                            return { shuffledOptions: options, newCorrectAnswer: correctAnswer };
                        }
                        var shuffledOptions = __spreadArray([], options, true);
                        var attempts = 0;
                        var newCorrectIndex = correctIndex;
                        // Shuffle until correct answer is not in the same position as last question
                        do {
                            shuffledOptions = __spreadArray([], options, true).sort(function () { return Math.random() - 0.5; });
                            newCorrectIndex = shuffledOptions.findIndex(function (opt) {
                                return opt.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
                            });
                            attempts++;
                        } while (newCorrectIndex === avoidPosition && attempts < 10 && options.length > 1);
                        return {
                            shuffledOptions: shuffledOptions,
                            newCorrectAnswer: shuffledOptions[newCorrectIndex]
                        };
                    };
                    setNum = 1;
                    _a.label = 3;
                case 3:
                    if (!(setNum <= numberOfSets)) return [3 /*break*/, 8];
                    setNumber = maxSetNumber + setNum;
                    startIdx = (setNum - 1) * setSize;
                    endIdx = startIdx + setSize;
                    setQuestions = unassignedQuestions.slice(startIdx, endIdx);
                    lastCorrectPosition = -1;
                    _loop_3 = function (question) {
                        var _b, shuffledOptions, newCorrectAnswer_1;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (!(question.type === "mcq" && question.options && question.options.length > 0)) return [3 /*break*/, 2];
                                    _b = shuffleOptions(question.options, question.correctAnswer, lastCorrectPosition), shuffledOptions = _b.shuffledOptions, newCorrectAnswer_1 = _b.newCorrectAnswer;
                                    // Track the new position of correct answer
                                    lastCorrectPosition = shuffledOptions.findIndex(function (opt) {
                                        return opt.trim().toLowerCase() === newCorrectAnswer_1.trim().toLowerCase();
                                    });
                                    return [4 /*yield*/, ctx.db.patch(question._id, {
                                            setNumber: setNumber,
                                            options: shuffledOptions,
                                            correctAnswer: newCorrectAnswer_1,
                                        })];
                                case 1:
                                    _c.sent();
                                    return [3 /*break*/, 4];
                                case 2: 
                                // For non-MCQ questions, just assign set number
                                return [4 /*yield*/, ctx.db.patch(question._id, {
                                        setNumber: setNumber,
                                    })];
                                case 3:
                                    // For non-MCQ questions, just assign set number
                                    _c.sent();
                                    _c.label = 4;
                                case 4:
                                    questionsProcessed++;
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, setQuestions_1 = setQuestions;
                    _a.label = 4;
                case 4:
                    if (!(_i < setQuestions_1.length)) return [3 /*break*/, 7];
                    question = setQuestions_1[_i];
                    return [5 /*yield**/, _loop_3(question)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7:
                    setNum++;
                    return [3 /*break*/, 3];
                case 8: return [2 /*return*/, {
                        success: true,
                        message: "Successfully created ".concat(numberOfSets, " test sets with ").concat(questionsProcessed, " questions"),
                        setsCreated: numberOfSets,
                        questionsProcessed: questionsProcessed,
                    }];
            }
        });
    }); },
});
// Generate upload URL for question images
exports.generateUploadUrl = (0, server_1.mutation)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized");
                    }
                    return [4 /*yield*/, ctx.storage.generateUploadUrl()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
