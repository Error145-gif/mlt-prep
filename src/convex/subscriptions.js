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
exports.startFreeTrial = exports.createSubscription = exports.getPaymentHistory = exports.getAllSubscriptions = void 0;
var values_1 = require("convex/values");
var server_1 = require("./_generated/server");
var users_1 = require("./users");
// Get all subscriptions
exports.getAllSubscriptions = (0, server_1.query)({
    args: {
        status: values_1.v.optional(values_1.v.string()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, subscriptions, enrichedSubs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized");
                    }
                    if (!args.status) return [3 /*break*/, 3];
                    return [4 /*yield*/, ctx.db
                            .query("subscriptions")
                            .withIndex("by_status", function (q) { return q.eq("status", args.status); })
                            .collect()];
                case 2:
                    subscriptions = _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, ctx.db.query("subscriptions").collect()];
                case 4:
                    subscriptions = _a.sent();
                    _a.label = 5;
                case 5: return [4 /*yield*/, Promise.all(subscriptions.map(function (sub) { return __awaiter(void 0, void 0, void 0, function () {
                        var subUser;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, ctx.db.get(sub.userId)];
                                case 1:
                                    subUser = _a.sent();
                                    return [2 /*return*/, __assign(__assign({}, sub), { userName: (subUser === null || subUser === void 0 ? void 0 : subUser.name) || "Unknown", userEmail: (subUser === null || subUser === void 0 ? void 0 : subUser.email) || "Unknown" })];
                            }
                        });
                    }); }))];
                case 6:
                    enrichedSubs = _a.sent();
                    return [2 /*return*/, enrichedSubs];
            }
        });
    }); },
});
// Get payment history
exports.getPaymentHistory = (0, server_1.query)({
    args: {
        userId: values_1.v.optional(values_1.v.id("users")),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, payments, enrichedPayments;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized");
                    }
                    if (!args.userId) return [3 /*break*/, 3];
                    return [4 /*yield*/, ctx.db
                            .query("payments")
                            .withIndex("by_user", function (q) { return q.eq("userId", args.userId); })
                            .collect()];
                case 2:
                    payments = _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, ctx.db.query("payments").collect()];
                case 4:
                    payments = _a.sent();
                    _a.label = 5;
                case 5: return [4 /*yield*/, Promise.all(payments.map(function (payment) { return __awaiter(void 0, void 0, void 0, function () {
                        var paymentUser;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, ctx.db.get(payment.userId)];
                                case 1:
                                    paymentUser = _a.sent();
                                    return [2 /*return*/, __assign(__assign({}, payment), { userName: (paymentUser === null || paymentUser === void 0 ? void 0 : paymentUser.name) || "Unknown", userEmail: (paymentUser === null || paymentUser === void 0 ? void 0 : paymentUser.email) || "Unknown" })];
                            }
                        });
                    }); }))];
                case 6:
                    enrichedPayments = _a.sent();
                    return [2 /*return*/, enrichedPayments];
            }
        });
    }); },
});
// Create a new subscription for a user
exports.createSubscription = (0, server_1.mutation)({
    args: {
        planName: values_1.v.string(),
        duration: values_1.v.number(), // in days
        amount: values_1.v.number(),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, startDate, endDate, existingSub, subscriptionId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        throw new Error("Unauthorized");
                    }
                    startDate = Date.now();
                    endDate = startDate + args.duration * 24 * 60 * 60 * 1000;
                    return [4 /*yield*/, ctx.db
                            .query("subscriptions")
                            .withIndex("by_user", function (q) { return q.eq("userId", user._id); })
                            .filter(function (q) { return q.eq(q.field("status"), "active"); })
                            .first()];
                case 2:
                    existingSub = _a.sent();
                    // Allow upgrading from free trial to paid subscription
                    if (existingSub && existingSub.amount > 0) {
                        throw new Error("You already have an active paid subscription");
                    }
                    if (!(existingSub && existingSub.amount === 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, ctx.db.patch(existingSub._id, {
                            status: "cancelled",
                        })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [4 /*yield*/, ctx.db.insert("subscriptions", {
                        userId: user._id,
                        planName: args.planName,
                        status: "active",
                        startDate: startDate,
                        endDate: endDate,
                        amount: args.amount,
                    })];
                case 5:
                    subscriptionId = _a.sent();
                    // Create payment record
                    return [4 /*yield*/, ctx.db.insert("payments", {
                            userId: user._id,
                            subscriptionId: subscriptionId,
                            amount: args.amount,
                            currency: "INR",
                            status: "success",
                        })];
                case 6:
                    // Create payment record
                    _a.sent();
                    return [2 /*return*/, subscriptionId];
            }
        });
    }); },
});
// Start free trial
exports.startFreeTrial = (0, server_1.mutation)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var user, existingTrial, startDate, endDate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        throw new Error("Unauthorized");
                    }
                    return [4 /*yield*/, ctx.db
                            .query("subscriptions")
                            .withIndex("by_user", function (q) { return q.eq("userId", user._id); })
                            .filter(function (q) { return q.eq(q.field("planName"), "7-Day Free Trial"); })
                            .first()];
                case 2:
                    existingTrial = _a.sent();
                    if (existingTrial) {
                        throw new Error("You have already used your free trial");
                    }
                    startDate = Date.now();
                    endDate = startDate + 7 * 24 * 60 * 60 * 1000;
                    return [4 /*yield*/, ctx.db.insert("subscriptions", {
                            userId: user._id,
                            planName: "7-Day Free Trial",
                            status: "active",
                            startDate: startDate,
                            endDate: endDate,
                            amount: 0,
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, { success: true }];
            }
        });
    }); },
});
