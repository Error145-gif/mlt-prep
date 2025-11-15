"use strict";
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
exports.getFeedbackStats = exports.updateFeedbackStatus = exports.getAllFeedback = exports.getMyFeedback = exports.submitFeedback = void 0;
var values_1 = require("convex/values");
var server_1 = require("./_generated/server");
var users_1 = require("./users");
// Submit feedback (student)
exports.submitFeedback = (0, server_1.mutation)({
    args: {
        rating: values_1.v.number(),
        category: values_1.v.string(),
        message: values_1.v.string(),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, feedbackId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        throw new Error("Not authenticated");
                    }
                    return [4 /*yield*/, ctx.db.insert("feedback", {
                            userId: user._id,
                            userName: user.name,
                            userEmail: user.email,
                            rating: args.rating,
                            category: args.category,
                            message: args.message,
                            status: "new",
                        })];
                case 2:
                    feedbackId = _a.sent();
                    return [2 /*return*/, feedbackId];
            }
        });
    }); },
});
// Get user's own feedback
exports.getMyFeedback = (0, server_1.query)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var user, feedback;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        throw new Error("Not authenticated");
                    }
                    return [4 /*yield*/, ctx.db
                            .query("feedback")
                            .withIndex("by_user", function (q) { return q.eq("userId", user._id); })
                            .order("desc")
                            .collect()];
                case 2:
                    feedback = _a.sent();
                    return [2 /*return*/, feedback];
            }
        });
    }); },
});
// Get all feedback (admin only)
exports.getAllFeedback = (0, server_1.query)({
    args: {
        status: values_1.v.optional(values_1.v.string()),
        category: values_1.v.optional(values_1.v.string()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, feedback;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Admin access required");
                    }
                    if (!(args.status && args.status !== undefined)) return [3 /*break*/, 3];
                    return [4 /*yield*/, ctx.db
                            .query("feedback")
                            .withIndex("by_status", function (q) { return q.eq("status", args.status); })
                            .order("desc")
                            .collect()];
                case 2:
                    feedback = _a.sent();
                    return [3 /*break*/, 7];
                case 3:
                    if (!(args.category && args.category !== undefined)) return [3 /*break*/, 5];
                    return [4 /*yield*/, ctx.db
                            .query("feedback")
                            .withIndex("by_category", function (q) { return q.eq("category", args.category); })
                            .order("desc")
                            .collect()];
                case 4:
                    feedback = _a.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, ctx.db.query("feedback").order("desc").collect()];
                case 6:
                    feedback = _a.sent();
                    _a.label = 7;
                case 7: return [2 /*return*/, feedback];
            }
        });
    }); },
});
// Update feedback status (admin only)
exports.updateFeedbackStatus = (0, server_1.mutation)({
    args: {
        feedbackId: values_1.v.id("feedback"),
        status: values_1.v.string(),
        adminNotes: values_1.v.optional(values_1.v.string()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Admin access required");
                    }
                    return [4 /*yield*/, ctx.db.patch(args.feedbackId, {
                            status: args.status,
                            adminNotes: args.adminNotes,
                            reviewedBy: user._id,
                            reviewedAt: Date.now(),
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, args.feedbackId];
            }
        });
    }); },
});
// Get feedback statistics (admin only)
exports.getFeedbackStats = (0, server_1.query)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var user, allFeedback, stats;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Admin access required");
                    }
                    return [4 /*yield*/, ctx.db.query("feedback").collect()];
                case 2:
                    allFeedback = _a.sent();
                    stats = {
                        total: allFeedback.length,
                        new: allFeedback.filter(function (f) { return f.status === "new"; }).length,
                        reviewed: allFeedback.filter(function (f) { return f.status === "reviewed"; }).length,
                        resolved: allFeedback.filter(function (f) { return f.status === "resolved"; }).length,
                        avgRating: allFeedback.length > 0
                            ? allFeedback.reduce(function (sum, f) { return sum + f.rating; }, 0) / allFeedback.length
                            : 0,
                        byCategory: {
                            bug: allFeedback.filter(function (f) { return f.category === "bug"; }).length,
                            feature: allFeedback.filter(function (f) { return f.category === "feature"; }).length,
                            improvement: allFeedback.filter(function (f) { return f.category === "improvement"; }).length,
                            other: allFeedback.filter(function (f) { return f.category === "other"; }).length,
                        },
                    };
                    return [2 /*return*/, stats];
            }
        });
    }); },
});
