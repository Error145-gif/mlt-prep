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
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportAnalytics = exports.getUserAnalytics = exports.getAllUsersAnalytics = exports.getAllRegisteredUsers = exports.getDashboardStats = void 0;
var values_1 = require("convex/values");
var server_1 = require("./_generated/server");
var users_1 = require("./users");
// Dashboard stats
exports.getDashboardStats = (0, server_1.query)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var user, _a, totalUsers, activeSubscriptions, totalContent, pendingQuestions, recentPayments, totalQuestions, approvedQuestions, manualQuestions, allPayments, totalRevenue, recentContent, allQuestions, mockQuestions, aiQuestions, pyqQuestions, mockTestSets, aiTestSets, pyqTestSets;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _b.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized");
                    }
                    return [4 /*yield*/, Promise.all([
                            ctx.db.query("users").collect().then(function (users) { return users.length; }),
                            ctx.db
                                .query("subscriptions")
                                .withIndex("by_status", function (q) { return q.eq("status", "active"); })
                                .collect()
                                .then(function (subs) { return subs.length; }),
                            ctx.db.query("content").collect().then(function (content) { return content.length; }),
                            ctx.db
                                .query("questions")
                                .withIndex("by_status", function (q) { return q.eq("status", "pending"); })
                                .collect()
                                .then(function (questions) { return questions.length; }),
                            ctx.db.query("payments").order("desc").take(10),
                            ctx.db.query("questions").collect().then(function (questions) { return questions.length; }),
                            ctx.db
                                .query("questions")
                                .withIndex("by_status", function (q) { return q.eq("status", "approved"); })
                                .collect()
                                .then(function (questions) { return questions.length; }),
                            ctx.db
                                .query("questions")
                                .withIndex("by_source", function (q) { return q.eq("source", "manual"); })
                                .collect()
                                .then(function (questions) { return questions.length; }),
                        ])];
                case 2:
                    _a = _b.sent(), totalUsers = _a[0], activeSubscriptions = _a[1], totalContent = _a[2], pendingQuestions = _a[3], recentPayments = _a[4], totalQuestions = _a[5], approvedQuestions = _a[6], manualQuestions = _a[7];
                    return [4 /*yield*/, ctx.db.query("payments").collect()];
                case 3:
                    allPayments = _b.sent();
                    totalRevenue = allPayments
                        .filter(function (p) { return p.status === "success"; })
                        .reduce(function (sum, p) { return sum + p.amount; }, 0);
                    return [4 /*yield*/, ctx.db.query("content").order("desc").take(5)];
                case 4:
                    recentContent = _b.sent();
                    return [4 /*yield*/, ctx.db.query("questions").collect()];
                case 5:
                    allQuestions = _b.sent();
                    mockQuestions = allQuestions.filter(function (q) { return q.source === "manual" && q.status === "approved"; });
                    aiQuestions = allQuestions.filter(function (q) { return q.source === "ai" && q.status === "approved"; });
                    pyqQuestions = allQuestions.filter(function (q) { return q.source === "pyq" && q.status === "approved"; });
                    mockTestSets = Math.floor(mockQuestions.length / 100);
                    aiTestSets = Math.floor(aiQuestions.length / 25);
                    pyqTestSets = Math.floor(pyqQuestions.length / 20);
                    return [2 /*return*/, {
                            totalUsers: totalUsers,
                            activeSubscriptions: activeSubscriptions,
                            totalRevenue: totalRevenue,
                            totalContent: totalContent,
                            pendingQuestions: pendingQuestions,
                            totalQuestions: totalQuestions,
                            approvedQuestions: approvedQuestions,
                            manualQuestions: manualQuestions,
                            mockTestSets: mockTestSets,
                            aiTestSets: aiTestSets,
                            pyqTestSets: pyqTestSets,
                            recentContent: recentContent,
                            recentPayments: recentPayments,
                        }];
            }
        });
    }); },
});
// Get all registered users with Gmail accounts
exports.getAllRegisteredUsers = (0, server_1.query)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var user, allUsers, gmailUsers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized");
                    }
                    return [4 /*yield*/, ctx.db.query("users").collect()];
                case 2:
                    allUsers = _a.sent();
                    gmailUsers = allUsers
                        .filter(function (u) { var _a; return (_a = u.email) === null || _a === void 0 ? void 0 : _a.endsWith("@gmail.com"); })
                        .map(function (u) { return ({
                        _id: u._id,
                        name: u.name,
                        email: u.email,
                        role: u.role,
                        isRegistered: u.isRegistered,
                        _creationTime: u._creationTime,
                    }); });
                    return [2 /*return*/, {
                            totalUsers: gmailUsers.length,
                            activeUsers: gmailUsers.filter(function (u) { return u.isRegistered; }).length,
                            users: gmailUsers,
                        }];
            }
        });
    }); },
});
// Get all users with basic stats
exports.getAllUsersAnalytics = (0, server_1.query)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var user, allUsers, usersWithStats;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized");
                    }
                    return [4 /*yield*/, ctx.db.query("users").collect()];
                case 2:
                    allUsers = _a.sent();
                    return [4 /*yield*/, Promise.all(allUsers.map(function (u) { return __awaiter(void 0, void 0, void 0, function () {
                            var progress, testScores;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, ctx.db
                                            .query("userProgress")
                                            .withIndex("by_user", function (q) { return q.eq("userId", u._id); })
                                            .collect()];
                                    case 1:
                                        progress = _a.sent();
                                        return [4 /*yield*/, ctx.db
                                                .query("testScores")
                                                .withIndex("by_user", function (q) { return q.eq("userId", u._id); })
                                                .collect()];
                                    case 2:
                                        testScores = _a.sent();
                                        return [2 /*return*/, __assign(__assign({}, u), { totalProgress: progress.length, avgScore: testScores.reduce(function (sum, s) { return sum + s.score; }, 0) /
                                                    testScores.length || 0 })];
                                }
                            });
                        }); }))];
                case 3:
                    usersWithStats = _a.sent();
                    return [2 /*return*/, usersWithStats];
            }
        });
    }); },
});
// Get specific user analytics
exports.getUserAnalytics = (0, server_1.query)({
    args: {
        userId: values_1.v.id("users"),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, targetUser, progress, testScores, topicScores, _i, testScores_1, score, existing, weakTopics;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized");
                    }
                    if (!args.userId) return [3 /*break*/, 6];
                    return [4 /*yield*/, ctx.db.get(args.userId)];
                case 2:
                    targetUser = _a.sent();
                    return [4 /*yield*/, ctx.db
                            .query("userProgress")
                            .withIndex("by_user", function (q) { return q.eq("userId", args.userId); })
                            .collect()];
                case 3:
                    progress = _a.sent();
                    return [4 /*yield*/, ctx.db
                            .query("testScores")
                            .withIndex("by_user", function (q) { return q.eq("userId", args.userId); })
                            .collect()];
                case 4:
                    testScores = _a.sent();
                    topicScores = new Map();
                    for (_i = 0, testScores_1 = testScores; _i < testScores_1.length; _i++) {
                        score = testScores_1[_i];
                        if (score.topicId) {
                            existing = topicScores.get(score.topicId) || {
                                total: 0,
                                count: 0,
                            };
                            topicScores.set(score.topicId, {
                                total: existing.total + score.score,
                                count: existing.count + 1,
                            });
                        }
                    }
                    return [4 /*yield*/, Promise.all(Array.from(topicScores.entries())
                            .map(function (_a) {
                            var topicId = _a[0], data = _a[1];
                            return ({
                                topicId: topicId,
                                avgScore: data.total / data.count,
                            });
                        })
                            .filter(function (t) { return t.avgScore < 60; })
                            .sort(function (a, b) { return a.avgScore - b.avgScore; })
                            .slice(0, 5)
                            .map(function (t) { return __awaiter(void 0, void 0, void 0, function () {
                            var topic, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!t.topicId) return [3 /*break*/, 2];
                                        return [4 /*yield*/, ctx.db.get(t.topicId)];
                                    case 1:
                                        _a = _b.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        _a = null;
                                        _b.label = 3;
                                    case 3:
                                        topic = _a;
                                        return [2 /*return*/, {
                                                topicName: (topic === null || topic === void 0 ? void 0 : topic.name) || "Unknown",
                                                avgScore: t.avgScore,
                                            }];
                                }
                            });
                        }); }))];
                case 5:
                    weakTopics = _a.sent();
                    return [2 /*return*/, {
                            user: targetUser,
                            totalProgress: progress.length,
                            completedContent: progress.filter(function (p) { return p.completed; }).length,
                            totalTests: testScores.length,
                            avgScore: testScores.reduce(function (sum, s) { return sum + s.score; }, 0) / testScores.length ||
                                0,
                            weakTopics: weakTopics,
                        }];
                case 6: return [2 /*return*/];
            }
        });
    }); },
});
// Export analytics data
exports.exportAnalytics = (0, server_1.query)({
    args: {
        type: values_1.v.string(), // "users", "subscriptions", "payments", "progress"
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _b.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized");
                    }
                    _a = args.type;
                    switch (_a) {
                        case "users": return [3 /*break*/, 2];
                        case "subscriptions": return [3 /*break*/, 4];
                        case "payments": return [3 /*break*/, 6];
                        case "progress": return [3 /*break*/, 8];
                    }
                    return [3 /*break*/, 10];
                case 2: return [4 /*yield*/, ctx.db.query("users").collect()];
                case 3: return [2 /*return*/, _b.sent()];
                case 4: return [4 /*yield*/, ctx.db.query("subscriptions").collect()];
                case 5: return [2 /*return*/, _b.sent()];
                case 6: return [4 /*yield*/, ctx.db.query("payments").collect()];
                case 7: return [2 /*return*/, _b.sent()];
                case 8: return [4 /*yield*/, ctx.db.query("userProgress").collect()];
                case 9: return [2 /*return*/, _b.sent()];
                case 10: throw new Error("Invalid export type");
            }
        });
    }); },
});
