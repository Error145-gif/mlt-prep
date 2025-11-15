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
exports.getCouponStats = exports.trackCouponUsage = exports.deleteCoupon = exports.updateCoupon = exports.createCoupon = exports.getAllCoupons = exports.validateCoupon = void 0;
var values_1 = require("convex/values");
var server_1 = require("./_generated/server");
var server_2 = require("@convex-dev/auth/server");
// Query to validate a coupon code
exports.validateCoupon = (0, server_1.query)({
    args: {
        code: values_1.v.string(),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var coupon;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db
                        .query("coupons")
                        .withIndex("by_code", function (q) { return q.eq("code", args.code.toUpperCase()); })
                        .first()];
                case 1:
                    coupon = _a.sent();
                    if (!coupon) {
                        return [2 /*return*/, { valid: false, message: "Invalid coupon code" }];
                    }
                    if (!coupon.isActive) {
                        return [2 /*return*/, { valid: false, message: "This coupon is no longer active" }];
                    }
                    if (coupon.expiryDate && coupon.expiryDate < Date.now()) {
                        return [2 /*return*/, { valid: false, message: "This coupon has expired" }];
                    }
                    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
                        return [2 /*return*/, { valid: false, message: "This coupon has reached its usage limit" }];
                    }
                    return [2 /*return*/, {
                            valid: true,
                            discount: coupon.discountValue,
                            type: coupon.discountType,
                            couponId: coupon._id,
                            message: "Coupon applied! ".concat(coupon.discountType === "percentage" ? "".concat(coupon.discountValue, "% off") : "\u20B9".concat(coupon.discountValue, " off")),
                        }];
            }
        });
    }); },
});
// Get all coupons (admin only)
exports.getAllCoupons = (0, server_1.query)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_2.getAuthUserId)(ctx)];
                case 1:
                    userId = _a.sent();
                    if (!userId) {
                        throw new Error("Unauthorized: User not authenticated");
                    }
                    return [4 /*yield*/, ctx.db.get(userId)];
                case 2:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized: Admin access required");
                    }
                    return [4 /*yield*/, ctx.db.query("coupons").order("desc").collect()];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Create a new coupon (admin only)
exports.createCoupon = (0, server_1.mutation)({
    args: {
        code: values_1.v.string(),
        discountType: values_1.v.union(values_1.v.literal("percentage"), values_1.v.literal("fixed")),
        discountValue: values_1.v.number(),
        usageLimit: values_1.v.optional(values_1.v.number()),
        expiryDate: values_1.v.optional(values_1.v.number()),
        description: values_1.v.optional(values_1.v.string()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, user, existing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_2.getAuthUserId)(ctx)];
                case 1:
                    userId = _a.sent();
                    if (!userId) {
                        throw new Error("Unauthorized: User not authenticated");
                    }
                    return [4 /*yield*/, ctx.db.get(userId)];
                case 2:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized: Admin access required");
                    }
                    return [4 /*yield*/, ctx.db
                            .query("coupons")
                            .withIndex("by_code", function (q) { return q.eq("code", args.code.toUpperCase()); })
                            .first()];
                case 3:
                    existing = _a.sent();
                    if (existing) {
                        throw new Error("Coupon code already exists");
                    }
                    // Validate discount value
                    if (args.discountType === "percentage" && (args.discountValue < 1 || args.discountValue > 100)) {
                        throw new Error("Percentage discount must be between 1 and 100");
                    }
                    if (args.discountValue <= 0) {
                        throw new Error("Discount value must be greater than 0");
                    }
                    return [4 /*yield*/, ctx.db.insert("coupons", {
                            code: args.code.toUpperCase(),
                            discountType: args.discountType,
                            discountValue: args.discountValue,
                            isActive: true,
                            usageLimit: args.usageLimit,
                            usageCount: 0,
                            expiryDate: args.expiryDate,
                            createdBy: user._id,
                            description: args.description,
                        })];
                case 4: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Update coupon (admin only)
exports.updateCoupon = (0, server_1.mutation)({
    args: {
        couponId: values_1.v.id("coupons"),
        isActive: values_1.v.optional(values_1.v.boolean()),
        usageLimit: values_1.v.optional(values_1.v.number()),
        expiryDate: values_1.v.optional(values_1.v.number()),
        description: values_1.v.optional(values_1.v.string()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, user, updates;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_2.getAuthUserId)(ctx)];
                case 1:
                    userId = _a.sent();
                    if (!userId) {
                        throw new Error("Unauthorized: User not authenticated");
                    }
                    return [4 /*yield*/, ctx.db.get(userId)];
                case 2:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized: Admin access required");
                    }
                    updates = {};
                    if (args.isActive !== undefined)
                        updates.isActive = args.isActive;
                    if (args.usageLimit !== undefined)
                        updates.usageLimit = args.usageLimit;
                    if (args.expiryDate !== undefined)
                        updates.expiryDate = args.expiryDate;
                    if (args.description !== undefined)
                        updates.description = args.description;
                    return [4 /*yield*/, ctx.db.patch(args.couponId, updates)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
});
// Delete coupon (admin only)
exports.deleteCoupon = (0, server_1.mutation)({
    args: {
        couponId: values_1.v.id("coupons"),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_2.getAuthUserId)(ctx)];
                case 1:
                    userId = _a.sent();
                    if (!userId) {
                        throw new Error("Unauthorized: User not authenticated");
                    }
                    return [4 /*yield*/, ctx.db.get(userId)];
                case 2:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized: Admin access required");
                    }
                    return [4 /*yield*/, ctx.db.delete(args.couponId)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
});
// Track coupon usage
exports.trackCouponUsage = (0, server_1.mutation)({
    args: {
        couponId: values_1.v.id("coupons"),
        userId: values_1.v.id("users"),
        orderId: values_1.v.optional(values_1.v.string()),
        discountAmount: values_1.v.number(),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var coupon;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.get(args.couponId)];
                case 1:
                    coupon = _a.sent();
                    if (!coupon) return [3 /*break*/, 3];
                    return [4 /*yield*/, ctx.db.patch(args.couponId, {
                            usageCount: coupon.usageCount + 1,
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: 
                // Record usage
                return [4 /*yield*/, ctx.db.insert("couponUsage", {
                        couponId: args.couponId,
                        userId: args.userId,
                        orderId: args.orderId,
                        discountAmount: args.discountAmount,
                        usedAt: Date.now(),
                    })];
                case 4:
                    // Record usage
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
});
// Get coupon usage statistics (admin only)
exports.getCouponStats = (0, server_1.query)({
    args: {
        couponId: values_1.v.id("coupons"),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, user, usages, totalDiscount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_2.getAuthUserId)(ctx)];
                case 1:
                    userId = _a.sent();
                    if (!userId) {
                        throw new Error("Unauthorized: User not authenticated");
                    }
                    return [4 /*yield*/, ctx.db.get(userId)];
                case 2:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized: Admin access required");
                    }
                    return [4 /*yield*/, ctx.db
                            .query("couponUsage")
                            .withIndex("by_coupon", function (q) { return q.eq("couponId", args.couponId); })
                            .collect()];
                case 3:
                    usages = _a.sent();
                    totalDiscount = usages.reduce(function (sum, usage) { return sum + usage.discountAmount; }, 0);
                    return [2 /*return*/, {
                            totalUsages: usages.length,
                            totalDiscount: totalDiscount,
                            recentUsages: usages.slice(0, 10),
                        }];
            }
        });
    }); },
});
