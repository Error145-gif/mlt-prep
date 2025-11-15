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
exports.saveProfileImage = exports.generateUploadUrl = exports.completeRegistration = exports.checkEmailRegistered = exports.makeCurrentUserAdmin = exports.setUserAsAdmin = exports.updateUserProfile = exports.getUserProfile = exports.getCurrentUserInternal = exports.getCurrentUser = exports.currentUser = void 0;
var server_1 = require("@convex-dev/auth/server");
var server_2 = require("./_generated/server");
var values_1 = require("convex/values");
/**
 * Get the current signed in user. Returns null if the user is not signed in.
 * Usage: const signedInUser = await ctx.runQuery(api.authHelpers.currentUser);
 * THIS FUNCTION IS READ-ONLY. DO NOT MODIFY.
 */
exports.currentUser = (0, server_2.query)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exports.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (user === null) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, user];
            }
        });
    }); },
});
/**
 * Use this function internally to get the current user data. Remember to handle the null user case.
 * @param ctx
 * @returns
 */
var getCurrentUser = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, server_1.getAuthUserId)(ctx)];
            case 1:
                userId = _a.sent();
                if (userId === null) {
                    return [2 /*return*/, null];
                }
                return [4 /*yield*/, ctx.db.get(userId)];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getCurrentUser = getCurrentUser;
// Internal query to get current user by ID (for use in actions)
exports.getCurrentUserInternal = (0, server_2.internalQuery)({
    args: { userId: values_1.v.id("users") },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.get(args.userId)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Get user profile
exports.getUserProfile = (0, server_2.query)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_1.getAuthUserId)(ctx)];
                case 1:
                    userId = _a.sent();
                    if (!userId) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, ctx.db.get(userId)];
                case 2:
                    user = _a.sent();
                    if (!user) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            avatarUrl: user.avatarUrl,
                            examPreparation: user.examPreparation,
                            state: user.state,
                        }];
            }
        });
    }); },
});
// Update user profile
exports.updateUserProfile = (0, server_2.mutation)({
    args: {
        name: values_1.v.optional(values_1.v.string()),
        avatarUrl: values_1.v.optional(values_1.v.string()),
        examPreparation: values_1.v.optional(values_1.v.string()),
        state: values_1.v.optional(values_1.v.string()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, updates;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_1.getAuthUserId)(ctx)];
                case 1:
                    userId = _a.sent();
                    if (!userId) {
                        return [2 /*return*/, null];
                    }
                    updates = {};
                    if (args.name !== undefined)
                        updates.name = args.name;
                    if (args.avatarUrl !== undefined)
                        updates.avatarUrl = args.avatarUrl;
                    if (args.examPreparation !== undefined)
                        updates.examPreparation = args.examPreparation;
                    if (args.state !== undefined)
                        updates.state = args.state;
                    return [4 /*yield*/, ctx.db.patch(userId, updates)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, userId];
            }
        });
    }); },
});
// Set user role to admin (for initial setup)
exports.setUserAsAdmin = (0, server_2.mutation)({
    args: {
        email: values_1.v.string(),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db
                        .query("users")
                        .withIndex("email", function (q) { return q.eq("email", args.email); })
                        .unique()];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        throw new Error("User not found");
                    }
                    return [4 /*yield*/, ctx.db.patch(user._id, {
                            role: "admin",
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, user._id];
            }
        });
    }); },
});
// Make current user an admin (for testing/setup)
exports.makeCurrentUserAdmin = (0, server_2.mutation)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, user, allowedAdminEmail;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, server_1.getAuthUserId)(ctx)];
                case 1:
                    userId = _b.sent();
                    if (!userId) {
                        throw new Error("Not authenticated");
                    }
                    return [4 /*yield*/, ctx.db.get(userId)];
                case 2:
                    user = _b.sent();
                    if (!user) {
                        throw new Error("User not found");
                    }
                    allowedAdminEmail = "ak6722909@gmail.com";
                    if (((_a = user.email) === null || _a === void 0 ? void 0 : _a.toLowerCase().trim()) !== allowedAdminEmail) {
                        throw new Error("Unauthorized: Only authorized emails can access the admin panel.");
                    }
                    // Check if already admin
                    if (user.role === "admin") {
                        return [2 /*return*/, userId];
                    }
                    return [4 /*yield*/, ctx.db.patch(userId, {
                            role: "admin",
                        })];
                case 3:
                    _b.sent();
                    return [2 /*return*/, userId];
            }
        });
    }); },
});
// Check if email is registered (Gmail only)
exports.checkEmailRegistered = (0, server_2.query)({
    args: {
        email: values_1.v.string(),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var email, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    email = args.email.toLowerCase().trim();
                    // Validate Gmail only
                    if (!email.endsWith("@gmail.com")) {
                        return [2 /*return*/, { isValid: false, message: "Only Gmail accounts are allowed." }];
                    }
                    return [4 /*yield*/, ctx.db
                            .query("users")
                            .withIndex("email", function (q) { return q.eq("email", email); })
                            .first()];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        return [2 /*return*/, { isValid: false, message: "Account not registered. Please create an account first." }];
                    }
                    if (!user.isRegistered) {
                        return [2 /*return*/, { isValid: false, message: "Please complete your registration first." }];
                    }
                    return [2 /*return*/, { isValid: true, message: "Email verified." }];
            }
        });
    }); },
});
// Mark user as registered after account creation
exports.completeRegistration = (0, server_2.mutation)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, user;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, server_1.getAuthUserId)(ctx)];
                case 1:
                    userId = _b.sent();
                    if (!userId) {
                        throw new Error("Not authenticated");
                    }
                    return [4 /*yield*/, ctx.db.get(userId)];
                case 2:
                    user = _b.sent();
                    if (!user) {
                        throw new Error("User not found");
                    }
                    // Validate Gmail
                    if (!((_a = user.email) === null || _a === void 0 ? void 0 : _a.endsWith("@gmail.com"))) {
                        throw new Error("Only Gmail accounts are allowed.");
                    }
                    return [4 /*yield*/, ctx.db.patch(userId, {
                            isRegistered: true,
                            registrationCompleted: true,
                        })];
                case 3:
                    _b.sent();
                    return [2 /*return*/, userId];
            }
        });
    }); },
});
// Generate upload URL for profile image
exports.generateUploadUrl = (0, server_2.mutation)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_1.getAuthUserId)(ctx)];
                case 1:
                    userId = _a.sent();
                    if (!userId) {
                        throw new Error("Not authenticated");
                    }
                    return [4 /*yield*/, ctx.db.get(userId)];
                case 2:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized: Admin access required");
                    }
                    return [4 /*yield*/, ctx.storage.generateUploadUrl()];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Save uploaded image storage ID
exports.saveProfileImage = (0, server_2.mutation)({
    args: {
        storageId: values_1.v.id("_storage"),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, imageUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_1.getAuthUserId)(ctx)];
                case 1:
                    userId = _a.sent();
                    if (!userId) {
                        throw new Error("Not authenticated");
                    }
                    return [4 /*yield*/, ctx.storage.getUrl(args.storageId)];
                case 2:
                    imageUrl = _a.sent();
                    if (!imageUrl) {
                        throw new Error("Failed to get image URL");
                    }
                    // Update user profile with the new image URL
                    return [4 /*yield*/, ctx.db.patch(userId, {
                            avatarUrl: imageUrl,
                        })];
                case 3:
                    // Update user profile with the new image URL
                    _a.sent();
                    return [2 /*return*/, imageUrl];
            }
        });
    }); },
});
