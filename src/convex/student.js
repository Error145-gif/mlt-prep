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
exports.canAccessTestType = exports.checkSubscriptionAccess = exports.getTestHistoryPaginated = exports.getTestHistory = exports.getTestResults = exports.submitTest = exports.startTest = exports.getTestQuestions = exports.getPracticeQuestions = exports.getPYQSets = exports.getAIQuestions = exports.getMockTests = exports.getStudentDashboardStats = void 0;
var values_1 = require("convex/values");
var server_1 = require("./_generated/server");
var users_1 = require("./users");
var server_2 = require("convex/server");
// Get student dashboard statistics - ENHANCED VERSION
exports.getStudentDashboardStats = (0, server_1.query)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var user, _a, testSessions, testResults, subscription, recentContent, totalTests, avgScore, mockTests, pyqTests, aiTests, mockResults, pyqResults, aiResults, mockAvgScore, pyqAvgScore, aiAvgScore, totalQuestions, totalCorrect, overallAccuracy, totalQuestionsAttempted, totalTimeSpent, avgTimePerQuestion, totalStudyTime, avgQuestionsPerTest, testDates, uniqueDates, consistencyStreak, sevenDaysAgo, recentResults, weeklyAccuracy, subjectPerformance, _i, testSessions_1, session, questions, _loop_1, _b, questions_1, q, strongestSubject, weakestSubject, highestAccuracy, lowestAccuracy, _c, _d, _e, subject, stats, accuracy, sortedResults, improvementRate, lastScore, previousScore, accuracyComponent, consistencyComponent, improvementComponent, performanceScore, aiInsights, recentTests;
        var _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _g.sent();
                    if (!user) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, Promise.all([
                            ctx.db
                                .query("testSessions")
                                .withIndex("by_user", function (q) { return q.eq("userId", user._id); })
                                .filter(function (q) { return q.eq(q.field("status"), "completed"); })
                                .collect(),
                            ctx.db
                                .query("testResults")
                                .withIndex("by_user", function (q) { return q.eq("userId", user._id); })
                                .collect(),
                            ctx.db
                                .query("subscriptions")
                                .withIndex("by_user", function (q) { return q.eq("userId", user._id); })
                                .first(),
                            ctx.db.query("content").order("desc").take(5),
                        ])];
                case 2:
                    _a = _g.sent(), testSessions = _a[0], testResults = _a[1], subscription = _a[2], recentContent = _a[3];
                    totalTests = testSessions.length;
                    avgScore = testResults.length > 0
                        ? testResults.reduce(function (sum, r) { return sum + r.score; }, 0) / testResults.length
                        : 0;
                    mockTests = testSessions.filter(function (t) { return t.testType === "mock"; });
                    pyqTests = testSessions.filter(function (t) { return t.testType === "pyq"; });
                    aiTests = testSessions.filter(function (t) { return t.testType === "ai"; });
                    mockResults = testResults.filter(function (r) { return r.testType === "mock"; });
                    pyqResults = testResults.filter(function (r) { return r.testType === "pyq"; });
                    aiResults = testResults.filter(function (r) { return r.testType === "ai"; });
                    mockAvgScore = mockResults.length > 0
                        ? mockResults.reduce(function (sum, r) { return sum + r.score; }, 0) / mockResults.length
                        : 0;
                    pyqAvgScore = pyqResults.length > 0
                        ? pyqResults.reduce(function (sum, r) { return sum + r.score; }, 0) / pyqResults.length
                        : 0;
                    aiAvgScore = aiResults.length > 0
                        ? aiResults.reduce(function (sum, r) { return sum + r.score; }, 0) / aiResults.length
                        : 0;
                    totalQuestions = testResults.reduce(function (sum, r) { return sum + r.totalQuestions; }, 0);
                    totalCorrect = testResults.reduce(function (sum, r) { return sum + r.correctAnswers; }, 0);
                    overallAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
                    totalQuestionsAttempted = totalQuestions;
                    totalTimeSpent = testResults.reduce(function (sum, r) { return sum + r.timeSpent; }, 0);
                    avgTimePerQuestion = totalQuestions > 0 ? totalTimeSpent / totalQuestions : 0;
                    totalStudyTime = totalTimeSpent;
                    avgQuestionsPerTest = totalTests > 0 ? totalQuestions / totalTests : 0;
                    testDates = testSessions.map(function (s) { return new Date(s._creationTime).toDateString(); });
                    uniqueDates = __spreadArray([], new Set(testDates), true);
                    consistencyStreak = uniqueDates.length;
                    sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
                    recentResults = testResults.filter(function (r) { return r._creationTime >= sevenDaysAgo; });
                    weeklyAccuracy = recentResults.length > 0
                        ? recentResults.reduce(function (sum, r) { return sum + ((r.correctAnswers / r.totalQuestions) * 100); }, 0) / recentResults.length
                        : 0;
                    subjectPerformance = new Map();
                    _i = 0, testSessions_1 = testSessions;
                    _g.label = 3;
                case 3:
                    if (!(_i < testSessions_1.length)) return [3 /*break*/, 6];
                    session = testSessions_1[_i];
                    return [4 /*yield*/, Promise.all(session.questionIds.map(function (id) { return ctx.db.get(id); }))];
                case 4:
                    questions = _g.sent();
                    _loop_1 = function (q) {
                        if (q === null || q === void 0 ? void 0 : q.subject) {
                            var subject = q.subject;
                            if (!subjectPerformance.has(subject)) {
                                subjectPerformance.set(subject, { correct: 0, total: 0 });
                            }
                            var stats = subjectPerformance.get(subject);
                            stats.total++;
                            var answer = (_f = session.answers) === null || _f === void 0 ? void 0 : _f.find(function (a) { return a.questionId === q._id; });
                            if (answer === null || answer === void 0 ? void 0 : answer.isCorrect) {
                                stats.correct++;
                            }
                        }
                    };
                    for (_b = 0, questions_1 = questions; _b < questions_1.length; _b++) {
                        q = questions_1[_b];
                        _loop_1(q);
                    }
                    _g.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    strongestSubject = "N/A";
                    weakestSubject = "N/A";
                    highestAccuracy = 0;
                    lowestAccuracy = 100;
                    for (_c = 0, _d = subjectPerformance.entries(); _c < _d.length; _c++) {
                        _e = _d[_c], subject = _e[0], stats = _e[1];
                        accuracy = (stats.correct / stats.total) * 100;
                        if (accuracy > highestAccuracy) {
                            highestAccuracy = accuracy;
                            strongestSubject = subject;
                        }
                        if (accuracy < lowestAccuracy && stats.total >= 5) { // Only consider subjects with at least 5 questions
                            lowestAccuracy = accuracy;
                            weakestSubject = subject;
                        }
                    }
                    sortedResults = testResults.sort(function (a, b) { return b._creationTime - a._creationTime; });
                    improvementRate = 0;
                    if (sortedResults.length >= 2) {
                        lastScore = sortedResults[0].score;
                        previousScore = sortedResults[1].score;
                        improvementRate = lastScore - previousScore;
                    }
                    accuracyComponent = overallAccuracy * 0.6;
                    consistencyComponent = Math.min(consistencyStreak / 30, 1) * 30;
                    improvementComponent = Math.max(0, Math.min(improvementRate, 10));
                    performanceScore = Math.round(accuracyComponent + consistencyComponent + improvementComponent);
                    aiInsights = [];
                    // Readiness message
                    if (overallAccuracy > 80) {
                        aiInsights.push("🚀 You're exam-ready! Let's polish your timing.");
                    }
                    else if (overallAccuracy >= 50) {
                        aiInsights.push("💪 Good progress! Focus on weak topics.");
                    }
                    else {
                        aiInsights.push("📚 Needs more preparation. Try mock set 2 or AI tests.");
                    }
                    // Improvement message
                    if (improvementRate > 10) {
                        aiInsights.push("\uD83D\uDD25 You improved ".concat(Math.round(improvementRate), "% since your last test \u2014 keep it up!"));
                    }
                    else if (improvementRate > 0) {
                        aiInsights.push("\u2728 You're making progress \u2014 ".concat(Math.round(improvementRate), "% improvement!"));
                    }
                    // Subject-specific tip
                    if (weakestSubject !== "N/A" && lowestAccuracy < 60) {
                        aiInsights.push("\u26A1 You're losing marks in ".concat(weakestSubject, " \u2014 revise the basics."));
                    }
                    // Performance-based motivation
                    if (overallAccuracy > 85) {
                        aiInsights.push("🏆 You're performing like a topper — let's push to 90%!");
                    }
                    else if (consistencyStreak >= 7) {
                        aiInsights.push("\uD83D\uDD25 ".concat(consistencyStreak, " days streak! Consistency is key to success."));
                    }
                    recentTests = testResults
                        .sort(function (a, b) { return b._creationTime - a._creationTime; })
                        .slice(0, 10)
                        .reverse();
                    return [2 /*return*/, {
                            totalTests: totalTests,
                            avgScore: Math.round(avgScore),
                            overallAccuracy: Math.round(overallAccuracy),
                            totalQuestionsAttempted: totalQuestionsAttempted,
                            avgTimePerQuestion: Math.round(avgTimePerQuestion),
                            totalStudyTime: totalStudyTime,
                            avgQuestionsPerTest: Math.round(avgQuestionsPerTest),
                            consistencyStreak: consistencyStreak,
                            weeklyAccuracy: Math.round(weeklyAccuracy),
                            strongestSubject: strongestSubject,
                            weakestSubject: weakestSubject,
                            improvementRate: Math.round(improvementRate),
                            performanceScore: performanceScore,
                            aiInsights: aiInsights,
                            mockTests: {
                                count: mockTests.length,
                                avgScore: Math.round(mockAvgScore),
                            },
                            pyqTests: {
                                count: pyqTests.length,
                                avgScore: Math.round(pyqAvgScore),
                            },
                            aiTests: {
                                count: aiTests.length,
                                avgScore: Math.round(aiAvgScore),
                            },
                            recentTestPerformance: recentTests.map(function (r) { return ({
                                score: Math.round(r.score),
                                type: r.testType,
                                date: r._creationTime,
                            }); }),
                            subscriptionStatus: (subscription === null || subscription === void 0 ? void 0 : subscription.status) || "inactive",
                            subscriptionEndDate: subscription === null || subscription === void 0 ? void 0 : subscription.endDate,
                            subscription: subscription,
                            recentContent: recentContent,
                        }];
            }
        });
    }); },
});
// Get mock tests (from manual questions) - organized into sets of 100
exports.getMockTests = (0, server_1.query)({
    args: {
        topicId: values_1.v.optional(values_1.v.id("topics")),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, questions, testsByTopic, topicName, completedSessions, tests, _i, _a, _b, topicName_1, qs, setSize, totalSets, _loop_2, setNumber;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _c.sent();
                    if (!user) {
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, ctx.db
                            .query("questions")
                            .withIndex("by_source", function (q) { return q.eq("source", "manual"); })
                            .filter(function (q) { return q.eq(q.field("status"), "approved"); })
                            .collect()];
                case 2:
                    questions = _c.sent();
                    if (args.topicId) {
                        questions = questions.filter(function (q) { return q.topic === args.topicId; });
                    }
                    testsByTopic = new Map();
                    topicName = "General";
                    testsByTopic.set(topicName, questions);
                    return [4 /*yield*/, ctx.db
                            .query("testSessions")
                            .withIndex("by_user", function (q) { return q.eq("userId", user._id); })
                            .filter(function (q) { return q.eq(q.field("status"), "completed"); })
                            .filter(function (q) { return q.eq(q.field("testType"), "mock"); })
                            .collect()];
                case 3:
                    completedSessions = _c.sent();
                    tests = [];
                    for (_i = 0, _a = testsByTopic.entries(); _i < _a.length; _i++) {
                        _b = _a[_i], topicName_1 = _b[0], qs = _b[1];
                        setSize = 100;
                        totalSets = Math.floor(qs.length / setSize);
                        _loop_2 = function (setNumber) {
                            var startIndex = (setNumber - 1) * setSize;
                            var endIndex = startIndex + setSize; // Always exactly 100 questions
                            var setQuestions = qs.slice(startIndex, endIndex);
                            var hasCompleted = completedSessions.some(function (session) { return session.setNumber === setNumber; });
                            tests.push({
                                topicId: null,
                                topicName: topicName_1,
                                setNumber: setNumber,
                                totalSets: totalSets,
                                questionCount: setQuestions.length,
                                difficulty: "mixed",
                                hasCompleted: hasCompleted,
                            });
                        };
                        for (setNumber = 1; setNumber <= totalSets; setNumber++) {
                            _loop_2(setNumber);
                        }
                    }
                    return [2 /*return*/, tests];
            }
        });
    }); },
});
// Get AI-generated questions - organized into sets of 25
exports.getAIQuestions = (0, server_1.query)({
    args: {
        topicId: values_1.v.optional(values_1.v.id("topics")),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, questions, testsByTopic, _i, questions_2, q, topicName, completedSessions, tests, _a, _b, _c, topicName, qs, setSize, totalSets, _loop_3, setNumber;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _d.sent();
                    if (!user) {
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, ctx.db
                            .query("questions")
                            .withIndex("by_source", function (q) { return q.eq("source", "ai"); })
                            .filter(function (q) { return q.eq(q.field("status"), "approved"); })
                            .collect()];
                case 2:
                    questions = _d.sent();
                    if (args.topicId) {
                        questions = questions.filter(function (q) { return q.topic === args.topicId; });
                    }
                    testsByTopic = new Map();
                    for (_i = 0, questions_2 = questions; _i < questions_2.length; _i++) {
                        q = questions_2[_i];
                        topicName = q.topic || "General";
                        if (!testsByTopic.has(topicName)) {
                            testsByTopic.set(topicName, []);
                        }
                        testsByTopic.get(topicName).push(q);
                    }
                    return [4 /*yield*/, ctx.db
                            .query("testSessions")
                            .withIndex("by_user", function (q) { return q.eq("userId", user._id); })
                            .filter(function (q) { return q.eq(q.field("status"), "completed"); })
                            .filter(function (q) { return q.eq(q.field("testType"), "ai"); })
                            .collect()];
                case 3:
                    completedSessions = _d.sent();
                    tests = [];
                    for (_a = 0, _b = testsByTopic.entries(); _a < _b.length; _a++) {
                        _c = _b[_a], topicName = _c[0], qs = _c[1];
                        setSize = 25;
                        totalSets = Math.floor(qs.length / setSize);
                        _loop_3 = function (setNumber) {
                            var startIndex = (setNumber - 1) * setSize;
                            var endIndex = startIndex + setSize; // Always exactly 25 questions
                            var setQuestions = qs.slice(startIndex, endIndex);
                            var hasCompleted = completedSessions.some(function (session) { return session.setNumber === setNumber; });
                            tests.push({
                                topicId: null,
                                topicName: topicName,
                                setNumber: setNumber,
                                totalSets: totalSets,
                                questionCount: setQuestions.length,
                                difficulty: "mixed",
                                hasCompleted: hasCompleted,
                            });
                        };
                        for (setNumber = 1; setNumber <= totalSets; setNumber++) {
                            _loop_3(setNumber);
                        }
                    }
                    return [2 /*return*/, tests];
            }
        });
    }); },
});
// Get PYQ sets (organized by exam and year) - sets of 20 questions each
exports.getPYQSets = (0, server_1.query)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var user, pyqQuestions, setsByExamYear, _i, pyqQuestions_1, q, examName, year, key, completedSessions, sets, _loop_4, _a, _b, _c, key, qs;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _d.sent();
                    if (!user) {
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, ctx.db
                            .query("questions")
                            .withIndex("by_source", function (q) { return q.eq("source", "pyq"); })
                            .filter(function (q) { return q.eq(q.field("status"), "approved"); })
                            .collect()];
                case 2:
                    pyqQuestions = _d.sent();
                    setsByExamYear = new Map();
                    for (_i = 0, pyqQuestions_1 = pyqQuestions; _i < pyqQuestions_1.length; _i++) {
                        q = pyqQuestions_1[_i];
                        examName = q.examName || "General";
                        year = parseInt(q.examYear || "0") || 0;
                        key = "".concat(examName, "_").concat(year);
                        if (!setsByExamYear.has(key)) {
                            setsByExamYear.set(key, []);
                        }
                        setsByExamYear.get(key).push(q);
                    }
                    return [4 /*yield*/, ctx.db
                            .query("testSessions")
                            .withIndex("by_user", function (q) { return q.eq("userId", user._id); })
                            .filter(function (q) { return q.eq(q.field("status"), "completed"); })
                            .filter(function (q) { return q.eq(q.field("testType"), "pyq"); })
                            .collect()];
                case 3:
                    completedSessions = _d.sent();
                    sets = [];
                    _loop_4 = function (key, qs) {
                        var _e = key.split("_"), examName = _e[0], yearStr = _e[1];
                        var year = parseInt(yearStr);
                        // Only create sets of exactly 20 questions - ignore remainder
                        var setSize = 20;
                        var totalCompleteSets = Math.floor(qs.length / setSize);
                        var _loop_5 = function (setNumber) {
                            var startIndex = (setNumber - 1) * setSize;
                            var endIndex = startIndex + setSize;
                            var setQuestions = qs.slice(startIndex, endIndex);
                            // Check if user has completed this PYQ set before
                            var hasCompleted = completedSessions.some(function (session) { return session.year === year && session.setNumber === setNumber; });
                            sets.push({
                                examName: examName,
                                year: year,
                                setNumber: setNumber,
                                totalSets: totalCompleteSets,
                                questionCount: setQuestions.length,
                                subjects: __spreadArray([], new Set(setQuestions.map(function (q) { return q.subject; }).filter(Boolean)), true),
                                hasCompleted: hasCompleted,
                            });
                        };
                        // Only show complete sets
                        for (var setNumber = 1; setNumber <= totalCompleteSets; setNumber++) {
                            _loop_5(setNumber);
                        }
                    };
                    for (_a = 0, _b = setsByExamYear.entries(); _a < _b.length; _a++) {
                        _c = _b[_a], key = _c[0], qs = _c[1];
                        _loop_4(key, qs);
                    }
                    return [2 /*return*/, sets.sort(function (a, b) {
                            if (b.year !== a.year)
                                return b.year - a.year;
                            return a.setNumber - b.setNumber;
                        })];
            }
        });
    }); },
});
// Get practice questions with filters
exports.getPracticeQuestions = (0, server_1.query)({
    args: {
        topicId: values_1.v.optional(values_1.v.id("topics")),
        difficulty: values_1.v.optional(values_1.v.string()),
        limit: values_1.v.optional(values_1.v.number()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, limit, questions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        return [2 /*return*/, []];
                    }
                    limit = args.limit ? Math.min(Math.max(args.limit, 10), 100) : 10;
                    return [4 /*yield*/, ctx.db
                            .query("questions")
                            .filter(function (q) { return q.eq(q.field("status"), "approved"); })
                            .collect()];
                case 2:
                    questions = _a.sent();
                    if (args.topicId) {
                        questions = questions.filter(function (q) { return q.topic === args.topicId; });
                    }
                    if (args.difficulty) {
                        questions = questions.filter(function (q) { return q.difficulty === args.difficulty; });
                    }
                    // Shuffle questions to ensure random distribution from all sources
                    questions = questions.sort(function () { return Math.random() - 0.5; });
                    // Take the requested number of questions (enforcing 10-100 limit)
                    questions = questions.slice(0, limit);
                    return [2 /*return*/, questions];
            }
        });
    }); },
});
// Get questions for a specific test - with set support
exports.getTestQuestions = (0, server_1.query)({
    args: {
        testType: values_1.v.string(),
        topicId: values_1.v.optional(values_1.v.id("topics")),
        year: values_1.v.optional(values_1.v.number()),
        setNumber: values_1.v.optional(values_1.v.number()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, questions, setSize, startIndex, endIndex, setSize, startIndex, endIndex, setSize, startIndex, endIndex;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        throw new Error("Not authenticated");
                    }
                    questions = [];
                    if (!(args.testType === "mock")) return [3 /*break*/, 3];
                    return [4 /*yield*/, ctx.db
                            .query("questions")
                            .withIndex("by_source", function (q) { return q.eq("source", "manual"); })
                            .filter(function (q) { return q.eq(q.field("status"), "approved"); })
                            .collect()];
                case 2:
                    // Get mock/manual questions
                    questions = _a.sent();
                    // Apply set filtering for mock tests (100 questions per set)
                    if (args.setNumber) {
                        setSize = 100;
                        startIndex = (args.setNumber - 1) * setSize;
                        endIndex = startIndex + setSize;
                        questions = questions.slice(startIndex, endIndex);
                    }
                    return [3 /*break*/, 8];
                case 3:
                    if (!(args.testType === "pyq")) return [3 /*break*/, 5];
                    return [4 /*yield*/, ctx.db
                            .query("questions")
                            .withIndex("by_source", function (q) { return q.eq("source", "pyq"); })
                            .filter(function (q) { return q.eq(q.field("status"), "approved"); })
                            .collect()];
                case 4:
                    // Get PYQ questions
                    questions = _a.sent();
                    if (args.year !== undefined) {
                        // Convert year number to string for comparison with examYear field
                        questions = questions.filter(function (q) { return q.examYear === args.year.toString(); });
                    }
                    // Apply set filtering for PYQ (20 questions per set)
                    if (args.setNumber) {
                        setSize = 20;
                        startIndex = (args.setNumber - 1) * setSize;
                        endIndex = startIndex + setSize;
                        questions = questions.slice(startIndex, endIndex);
                    }
                    return [3 /*break*/, 8];
                case 5:
                    if (!(args.testType === "ai")) return [3 /*break*/, 7];
                    return [4 /*yield*/, ctx.db
                            .query("questions")
                            .withIndex("by_source", function (q) { return q.eq("source", "ai"); })
                            .filter(function (q) { return q.eq(q.field("status"), "approved"); })
                            .collect()];
                case 6:
                    // Get AI questions
                    questions = _a.sent();
                    // Apply set filtering for AI (25 questions per set)
                    if (args.setNumber) {
                        setSize = 25;
                        startIndex = (args.setNumber - 1) * setSize;
                        endIndex = startIndex + setSize;
                        questions = questions.slice(startIndex, endIndex);
                    }
                    return [3 /*break*/, 8];
                case 7:
                    questions = [];
                    _a.label = 8;
                case 8:
                    // For mock tests, shuffle within the set; for PYQ and AI, maintain order
                    if (args.testType === "mock") {
                        questions = questions.sort(function () { return Math.random() - 0.5; });
                    }
                    return [2 /*return*/, questions];
            }
        });
    }); },
});
// Start a test session - with set support
exports.startTest = (0, server_1.mutation)({
    args: {
        testType: values_1.v.string(),
        topicId: values_1.v.optional(values_1.v.id("topics")),
        year: values_1.v.optional(values_1.v.number()),
        setNumber: values_1.v.optional(values_1.v.number()),
        questionIds: values_1.v.array(values_1.v.id("questions")),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, sessionId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        throw new Error("Not authenticated");
                    }
                    return [4 /*yield*/, ctx.db.insert("testSessions", {
                            userId: user._id,
                            testType: args.testType,
                            topicId: args.topicId,
                            year: args.year,
                            setNumber: args.setNumber,
                            questionIds: args.questionIds,
                            status: "in_progress",
                            startedAt: Date.now(),
                        })];
                case 2:
                    sessionId = _a.sent();
                    return [2 /*return*/, sessionId];
            }
        });
    }); },
});
// Submit test and calculate results
exports.submitTest = (0, server_1.mutation)({
    args: {
        sessionId: values_1.v.id("testSessions"),
        answers: values_1.v.array(values_1.v.object({
            questionId: values_1.v.id("questions"),
            answer: values_1.v.string(),
        })),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, session, questions, answersWithCorrectness, correctAnswers, incorrectAnswers, skippedAnswers, score, timeSpent, resultId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        throw new Error("Not authenticated");
                    }
                    return [4 /*yield*/, ctx.db.get(args.sessionId)];
                case 2:
                    session = _a.sent();
                    if (!session || session.userId !== user._id) {
                        throw new Error("Invalid session");
                    }
                    return [4 /*yield*/, Promise.all(session.questionIds.map(function (id) { return ctx.db.get(id); }))];
                case 3:
                    questions = _a.sent();
                    answersWithCorrectness = args.answers.map(function (ans) {
                        var question = questions.find(function (q) { return (q === null || q === void 0 ? void 0 : q._id) === ans.questionId; });
                        if (!question) {
                            console.error("Question not found for ID: ".concat(ans.questionId));
                            return __assign(__assign({}, ans), { isCorrect: false });
                        }
                        // Robust normalization - trim, lowercase, and normalize spaces
                        var normalize = function (text) {
                            if (!text)
                                return "";
                            return text.trim().toLowerCase().replace(/\s+/g, ' ');
                        };
                        var userAnswer = normalize(ans.answer);
                        var correctAnswer = normalize(question.correctAnswer || "");
                        // Debug logging
                        console.log("=== Answer Validation Debug ===");
                        console.log("Question:", question.question);
                        console.log("User Answer (raw):", ans.answer);
                        console.log("User Answer (normalized):", userAnswer);
                        console.log("Correct Answer (raw):", question.correctAnswer);
                        console.log("Correct Answer (normalized):", correctAnswer);
                        var isCorrect = false;
                        // For MCQs, find the correct option explicitly
                        if (question.options && question.options.length > 0) {
                            console.log("Options (raw):", question.options);
                            var normalizedOptions = question.options.map(function (opt) { return normalize(opt); });
                            console.log("Options (normalized):", normalizedOptions);
                            // Find which option index matches the correctAnswer field
                            var correctOptionIndex = -1;
                            for (var i = 0; i < question.options.length; i++) {
                                if (normalize(question.options[i]) === correctAnswer) {
                                    correctOptionIndex = i;
                                    break;
                                }
                            }
                            console.log("Correct Option Index:", correctOptionIndex);
                            console.log("Correct Option Text:", correctOptionIndex >= 0 ? question.options[correctOptionIndex] : "NOT FOUND");
                            // Find which option the user selected
                            var userOptionIndex = -1;
                            for (var i = 0; i < question.options.length; i++) {
                                if (normalize(question.options[i]) === userAnswer) {
                                    userOptionIndex = i;
                                    break;
                                }
                            }
                            console.log("User Option Index:", userOptionIndex);
                            console.log("User Option Text:", userOptionIndex >= 0 ? question.options[userOptionIndex] : "NOT FOUND");
                            // Compare by index if both found
                            if (correctOptionIndex >= 0 && userOptionIndex >= 0) {
                                isCorrect = correctOptionIndex === userOptionIndex;
                            }
                            else {
                                // Fallback to direct text comparison
                                isCorrect = userAnswer === correctAnswer;
                            }
                        }
                        else {
                            // Non-MCQ: direct comparison
                            isCorrect = userAnswer === correctAnswer;
                        }
                        console.log("Is Correct:", isCorrect);
                        console.log("==============================");
                        return __assign(__assign({}, ans), { isCorrect: isCorrect });
                    });
                    correctAnswers = answersWithCorrectness.filter(function (a) { return a.isCorrect; }).length;
                    incorrectAnswers = answersWithCorrectness.filter(function (a) { return !a.isCorrect && a.answer; }).length;
                    skippedAnswers = session.questionIds.length - args.answers.length;
                    score = (correctAnswers / session.questionIds.length) * 100;
                    timeSpent = Math.floor((Date.now() - session.startedAt) / 1000);
                    // Update session
                    return [4 /*yield*/, ctx.db.patch(args.sessionId, {
                            answers: answersWithCorrectness,
                            status: "completed",
                            completedAt: Date.now(),
                            timeSpent: timeSpent,
                            score: score,
                        })];
                case 4:
                    // Update session
                    _a.sent();
                    return [4 /*yield*/, ctx.db.insert("testResults", {
                            userId: user._id,
                            sessionId: args.sessionId,
                            testType: session.testType,
                            topicId: session.topicId,
                            year: session.year,
                            totalQuestions: session.questionIds.length,
                            correctAnswers: correctAnswers,
                            incorrectAnswers: incorrectAnswers,
                            skippedAnswers: skippedAnswers,
                            score: score,
                            timeSpent: timeSpent,
                        })];
                case 5:
                    resultId = _a.sent();
                    return [2 /*return*/, { resultId: resultId, score: score, correctAnswers: correctAnswers, totalQuestions: session.questionIds.length }];
            }
        });
    }); },
});
// Get test results - OPTIMIZED VERSION
exports.getTestResults = (0, server_1.query)({
    args: {
        sessionId: values_1.v.id("testSessions"),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, session, result, questions, validQuestions, relevantSessions, allRelevantSessions, matchingSessions, sortedSessions, rank, totalCandidates;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, ctx.db.get(args.sessionId)];
                case 2:
                    session = _a.sent();
                    if (!session || session.userId !== user._id) {
                        throw new Error("Invalid session");
                    }
                    return [4 /*yield*/, ctx.db
                            .query("testResults")
                            .withIndex("by_session", function (q) { return q.eq("sessionId", args.sessionId); })
                            .first()];
                case 3:
                    result = _a.sent();
                    return [4 /*yield*/, Promise.all(session.questionIds.map(function (id) { return __awaiter(void 0, void 0, void 0, function () {
                            var q, userAnswer, error_1;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _b.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, ctx.db.get(id)];
                                    case 1:
                                        q = _b.sent();
                                        if (!q)
                                            return [2 /*return*/, null];
                                        userAnswer = (_a = session.answers) === null || _a === void 0 ? void 0 : _a.find(function (a) { return a.questionId === id; });
                                        return [2 /*return*/, __assign(__assign({}, q), { userAnswer: userAnswer === null || userAnswer === void 0 ? void 0 : userAnswer.answer, isCorrect: userAnswer === null || userAnswer === void 0 ? void 0 : userAnswer.isCorrect })];
                                    case 2:
                                        error_1 = _b.sent();
                                        console.error("Failed to fetch question ".concat(id, ":"), error_1);
                                        return [2 /*return*/, null];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 4:
                    questions = _a.sent();
                    validQuestions = questions.filter(function (q) { return q !== null; });
                    return [4 /*yield*/, ctx.db
                            .query("testSessions")
                            .withIndex("by_user", function (q) { return q.eq("userId", session.userId); })
                            .filter(function (q) { return q.eq(q.field("status"), "completed"); })
                            .filter(function (q) { return q.eq(q.field("testType"), session.testType); })
                            .collect()];
                case 5:
                    relevantSessions = _a.sent();
                    // Filter by topic/year/setNumber in memory (more efficient than multiple DB queries)
                    relevantSessions = relevantSessions.filter(function (s) {
                        if (session.testType === "mock" || session.testType === "ai") {
                            return s.topicId === session.topicId && s.setNumber === session.setNumber;
                        }
                        else if (session.testType === "pyq") {
                            return s.year === session.year && s.setNumber === session.setNumber;
                        }
                        return false;
                    });
                    return [4 /*yield*/, ctx.db
                            .query("testSessions")
                            .filter(function (q) { return q.eq(q.field("status"), "completed"); })
                            .filter(function (q) { return q.eq(q.field("testType"), session.testType); })
                            .collect()];
                case 6:
                    allRelevantSessions = _a.sent();
                    matchingSessions = allRelevantSessions.filter(function (s) {
                        if (session.testType === "mock" || session.testType === "ai") {
                            return s.topicId === session.topicId && s.setNumber === session.setNumber && s.score !== undefined;
                        }
                        else if (session.testType === "pyq") {
                            return s.year === session.year && s.setNumber === session.setNumber && s.score !== undefined;
                        }
                        return false;
                    });
                    sortedSessions = matchingSessions.sort(function (a, b) { return (b.score || 0) - (a.score || 0); });
                    rank = sortedSessions.findIndex(function (s) { return s._id === session._id; }) + 1;
                    totalCandidates = sortedSessions.length;
                    return [2 /*return*/, {
                            session: session,
                            result: result,
                            questions: validQuestions,
                            rank: rank,
                            totalCandidates: totalCandidates,
                        }];
            }
        });
    }); },
});
// Get student test history
exports.getTestHistory = (0, server_1.query)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var user, sessions, enrichedSessions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, ctx.db
                            .query("testSessions")
                            .withIndex("by_user", function (q) { return q.eq("userId", user._id); })
                            .filter(function (q) { return q.eq(q.field("status"), "completed"); })
                            .order("desc")
                            .take(20)];
                case 2:
                    sessions = _a.sent();
                    return [4 /*yield*/, Promise.all(sessions.map(function (s) { return __awaiter(void 0, void 0, void 0, function () {
                            var topic, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!s.topicId) return [3 /*break*/, 2];
                                        return [4 /*yield*/, ctx.db.get(s.topicId)];
                                    case 1:
                                        _a = _b.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        _a = null;
                                        _b.label = 3;
                                    case 3:
                                        topic = _a;
                                        return [2 /*return*/, __assign(__assign({}, s), { topicName: (topic === null || topic === void 0 ? void 0 : topic.name) || "General" })];
                                }
                            });
                        }); }))];
                case 3:
                    enrichedSessions = _a.sent();
                    return [2 /*return*/, enrichedSessions];
            }
        });
    }); },
});
// Get paginated test history
exports.getTestHistoryPaginated = (0, server_1.query)({
    args: {
        paginationOpts: server_2.paginationOptsValidator,
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        return [2 /*return*/, { page: [], isDone: true, continueCursor: null }];
                    }
                    return [4 /*yield*/, ctx.db
                            .query("testResults")
                            .withIndex("by_user", function (q) { return q.eq("userId", user._id); })
                            .order("desc")
                            .paginate(args.paginationOpts)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Check subscription access with free trial support
exports.checkSubscriptionAccess = (0, server_1.query)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var user, subscription, isPaid, completedTests, mockTestsCompleted, pyqTestsCompleted, aiTestsCompleted, hasFreeMockAccess, hasFreePYQAccess, hasFreeAIAccess;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        return [2 /*return*/, { hasAccess: false, reason: "not_authenticated" }];
                    }
                    return [4 /*yield*/, ctx.db
                            .query("subscriptions")
                            .withIndex("by_user", function (q) { return q.eq("userId", user._id); })
                            .filter(function (q) { return q.eq(q.field("status"), "active"); })
                            .first()];
                case 2:
                    subscription = _a.sent();
                    if (subscription) {
                        if (subscription.endDate < Date.now()) {
                            return [2 /*return*/, { hasAccess: false, reason: "expired" }];
                        }
                        isPaid = subscription.amount > 0;
                        return [2 /*return*/, { hasAccess: true, subscription: subscription, isPaid: isPaid }];
                    }
                    return [4 /*yield*/, ctx.db
                            .query("testSessions")
                            .withIndex("by_user", function (q) { return q.eq("userId", user._id); })
                            .filter(function (q) { return q.eq(q.field("status"), "completed"); })
                            .collect()];
                case 3:
                    completedTests = _a.sent();
                    mockTestsCompleted = completedTests.filter(function (t) { return t.testType === "mock"; }).length;
                    pyqTestsCompleted = completedTests.filter(function (t) { return t.testType === "pyq"; }).length;
                    aiTestsCompleted = completedTests.filter(function (t) { return t.testType === "ai"; }).length;
                    hasFreeMockAccess = mockTestsCompleted < 1;
                    hasFreePYQAccess = pyqTestsCompleted < 1;
                    hasFreeAIAccess = aiTestsCompleted < 1;
                    if (hasFreeMockAccess || hasFreePYQAccess || hasFreeAIAccess) {
                        return [2 /*return*/, {
                                hasAccess: false, // Changed to false - free trial is NOT full access
                                reason: "free_trial",
                                isPaid: false,
                                freeTrialRemaining: {
                                    mock: hasFreeMockAccess ? 1 : 0,
                                    pyq: hasFreePYQAccess ? 1 : 0,
                                    ai: hasFreeAIAccess ? 1 : 0,
                                },
                            }];
                    }
                    return [2 /*return*/, { hasAccess: false, reason: "no_subscription" }];
            }
        });
    }); },
});
// New query to check if a specific test type can be accessed
exports.canAccessTestType = (0, server_1.query)({
    args: {
        testType: values_1.v.string(),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, subscription, isPaid, completedTests;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        return [2 /*return*/, { canAccess: false, reason: "not_authenticated" }];
                    }
                    console.log("=== Checking access for test type: ".concat(args.testType, " ==="));
                    console.log("User ID:", user._id);
                    return [4 /*yield*/, ctx.db
                            .query("subscriptions")
                            .withIndex("by_user", function (q) { return q.eq("userId", user._id); })
                            .filter(function (q) { return q.eq(q.field("status"), "active"); })
                            .first()];
                case 2:
                    subscription = _a.sent();
                    console.log("Found subscription:", subscription ? "YES" : "NO");
                    if (subscription) {
                        console.log("Subscription details:", {
                            amount: subscription.amount,
                            endDate: subscription.endDate,
                            currentTime: Date.now(),
                            isExpired: subscription.endDate < Date.now()
                        });
                    }
                    // If user has an active paid subscription, grant full access immediately
                    if (subscription && subscription.endDate >= Date.now()) {
                        isPaid = subscription.amount > 0;
                        console.log("Is paid subscription:", isPaid);
                        if (isPaid) {
                            console.log("✅ Access granted - paid subscription");
                            return [2 /*return*/, { canAccess: true, reason: "paid_subscription" }];
                        }
                    }
                    return [4 /*yield*/, ctx.db
                            .query("testSessions")
                            .withIndex("by_user", function (q) { return q.eq("userId", user._id); })
                            .filter(function (q) { return q.eq(q.field("status"), "completed"); })
                            .filter(function (q) { return q.eq(q.field("testType"), args.testType); })
                            .collect()];
                case 3:
                    completedTests = _a.sent();
                    console.log("Completed tests of this type:", completedTests.length);
                    if (completedTests.length === 0) {
                        console.log("✅ Access granted - free trial available");
                        return [2 /*return*/, { canAccess: true, reason: "free_trial" }];
                    }
                    console.log("❌ Access denied - free trial used, no paid subscription");
                    return [2 /*return*/, { canAccess: false, reason: "free_trial_used" }];
            }
        });
    }); },
});
