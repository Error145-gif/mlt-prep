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
exports.markAllAsRead = exports.markAsRead = exports.getUnreadCount = exports.getUserNotifications = exports.deleteNotification = exports.sendNotificationEmail = exports.updateNotificationStatus = exports.getAllUsersInternal = exports.getUsersByIds = exports.getNotificationById = exports.sendNotification = exports.createNotification = exports.getAllUsers = exports.getAllNotifications = void 0;
var values_1 = require("convex/values");
var server_1 = require("./_generated/server");
var users_1 = require("./users");
var api_1 = require("./_generated/api");
// Get all notifications
exports.getAllNotifications = (0, server_1.query)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var user, notifications, enrichedNotifications;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized");
                    }
                    return [4 /*yield*/, ctx.db.query("notifications").order("desc").collect()];
                case 2:
                    notifications = _a.sent();
                    return [4 /*yield*/, Promise.all(notifications.map(function (notif) { return __awaiter(void 0, void 0, void 0, function () {
                            var sender, recipientCount, allUsers;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, ctx.db.get(notif.sentBy)];
                                    case 1:
                                        sender = _a.sent();
                                        recipientCount = 0;
                                        if (!(notif.targetUsers && notif.targetUsers.length > 0)) return [3 /*break*/, 2];
                                        recipientCount = notif.targetUsers.length;
                                        return [3 /*break*/, 4];
                                    case 2:
                                        if (!(notif.status === "sent")) return [3 /*break*/, 4];
                                        return [4 /*yield*/, ctx.db.query("users").collect()];
                                    case 3:
                                        allUsers = _a.sent();
                                        recipientCount = allUsers.length;
                                        _a.label = 4;
                                    case 4: return [2 /*return*/, __assign(__assign({}, notif), { senderName: (sender === null || sender === void 0 ? void 0 : sender.name) || "Unknown", recipientCount: recipientCount })];
                                }
                            });
                        }); }))];
                case 3:
                    enrichedNotifications = _a.sent();
                    return [2 /*return*/, enrichedNotifications];
            }
        });
    }); },
});
// Get all users for targeting
exports.getAllUsers = (0, server_1.query)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var user, users;
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
                    users = _a.sent();
                    return [2 /*return*/, users.map(function (u) { return ({
                            _id: u._id,
                            name: u.name || "Unknown",
                            email: u.email,
                        }); })];
            }
        });
    }); },
});
// Create notification
exports.createNotification = (0, server_1.mutation)({
    args: {
        title: values_1.v.string(),
        message: values_1.v.string(),
        type: values_1.v.string(),
        targetUsers: values_1.v.optional(values_1.v.array(values_1.v.id("users"))),
        sendToAll: values_1.v.optional(values_1.v.boolean()),
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
                    return [4 /*yield*/, ctx.db.insert("notifications", {
                            title: args.title,
                            message: args.message,
                            type: args.type,
                            targetUsers: args.sendToAll ? undefined : args.targetUsers,
                            sentBy: user._id,
                            status: "sent",
                            sentAt: Date.now(),
                        })];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Send notification (now with email support)
exports.sendNotification = (0, server_1.action)({
    args: {
        id: values_1.v.id("notifications"),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var notification, targetUsers, _i, targetUsers_1, user, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Sending notification with ID:", args.id);
                    return [4 /*yield*/, ctx.runQuery(api_1.internal.notifications.getNotificationById, {
                            id: args.id,
                        })];
                case 1:
                    notification = _a.sent();
                    if (!notification) {
                        console.error("Notification not found:", args.id);
                        throw new Error("Notification not found");
                    }
                    console.log("Notification found:", notification.title, "Status:", notification.status);
                    if (!(notification.targetUsers && notification.targetUsers.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, ctx.runQuery(api_1.internal.notifications.getUsersByIds, {
                            userIds: notification.targetUsers,
                        })];
                case 2:
                    targetUsers = _a.sent();
                    console.log("Sending to ".concat(targetUsers.length, " specific users"));
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, ctx.runQuery(api_1.internal.notifications.getAllUsersInternal, {})];
                case 4:
                    // Send to all users
                    targetUsers = _a.sent();
                    console.log("Sending to all ".concat(targetUsers.length, " users"));
                    _a.label = 5;
                case 5:
                    if (!(notification.type === "email" || notification.type === "both")) return [3 /*break*/, 11];
                    _i = 0, targetUsers_1 = targetUsers;
                    _a.label = 6;
                case 6:
                    if (!(_i < targetUsers_1.length)) return [3 /*break*/, 11];
                    user = targetUsers_1[_i];
                    if (!user.email) return [3 /*break*/, 10];
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, ctx.runAction(api_1.internal.notifications.sendNotificationEmail, {
                            email: user.email,
                            name: user.name || "User",
                            title: notification.title,
                            message: notification.message,
                        })];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    error_1 = _a.sent();
                    console.error("Failed to send email to ".concat(user.email, ":"), error_1);
                    return [3 /*break*/, 10];
                case 10:
                    _i++;
                    return [3 /*break*/, 6];
                case 11: 
                // Update notification status
                return [4 /*yield*/, ctx.runMutation(api_1.internal.notifications.updateNotificationStatus, {
                        id: args.id,
                    })];
                case 12:
                    // Update notification status
                    _a.sent();
                    console.log("Notification status updated to 'sent'");
                    return [2 /*return*/, args.id];
            }
        });
    }); },
});
// Internal query to get notification by ID
exports.getNotificationById = (0, server_1.internalQuery)({
    args: { id: values_1.v.id("notifications") },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.get(args.id)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Internal query to get users by IDs
exports.getUsersByIds = (0, server_1.internalQuery)({
    args: { userIds: values_1.v.array(values_1.v.id("users")) },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var users;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all(args.userIds.map(function (id) { return ctx.db.get(id); }))];
                case 1:
                    users = _a.sent();
                    return [2 /*return*/, users.filter(function (u) { return u !== null; })];
            }
        });
    }); },
});
// Internal query to get all users
exports.getAllUsersInternal = (0, server_1.internalQuery)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.query("users").collect()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Internal mutation to update notification status
exports.updateNotificationStatus = (0, server_1.internalMutation)({
    args: { id: values_1.v.id("notifications") },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.patch(args.id, {
                        status: "sent",
                        sentAt: Date.now(),
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
});
// Internal action to send email
exports.sendNotificationEmail = (0, server_1.internalAction)({
    args: {
        email: values_1.v.string(),
        name: values_1.v.string(),
        title: values_1.v.string(),
        message: values_1.v.string(),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // This would integrate with Resend API
            // For now, just log it
            console.log("Sending notification email to ".concat(args.email, ":"), {
                title: args.title,
                message: args.message,
            });
            return [2 /*return*/];
        });
    }); },
});
// Delete notification
exports.deleteNotification = (0, server_1.mutation)({
    args: { id: values_1.v.id("notifications") },
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
// Get user's notifications (for students)
exports.getUserNotifications = (0, server_1.query)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var user, allNotifications, userNotifications, notificationsWithStatus;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        return [2 /*return*/, []]; // Return empty array instead of throwing error
                    }
                    return [4 /*yield*/, ctx.db
                            .query("notifications")
                            .withIndex("by_status", function (q) { return q.eq("status", "sent"); })
                            .order("desc")
                            .take(50)];
                case 2:
                    allNotifications = _a.sent();
                    userNotifications = allNotifications.filter(function (notif) {
                        // If targetUsers is undefined or empty, it's for all users
                        if (!notif.targetUsers || notif.targetUsers.length === 0) {
                            return true;
                        }
                        // Check if user is in targetUsers
                        return notif.targetUsers.includes(user._id);
                    });
                    return [4 /*yield*/, Promise.all(userNotifications.map(function (notif) { return __awaiter(void 0, void 0, void 0, function () {
                            var readStatus;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, ctx.db
                                            .query("userNotificationStatus")
                                            .withIndex("by_user_and_notification", function (q) {
                                            return q.eq("userId", user._id).eq("notificationId", notif._id);
                                        })
                                            .first()];
                                    case 1:
                                        readStatus = _a.sent();
                                        return [2 /*return*/, __assign(__assign({}, notif), { isRead: (readStatus === null || readStatus === void 0 ? void 0 : readStatus.isRead) || false, readAt: readStatus === null || readStatus === void 0 ? void 0 : readStatus.readAt })];
                                }
                            });
                        }); }))];
                case 3:
                    notificationsWithStatus = _a.sent();
                    return [2 /*return*/, notificationsWithStatus];
            }
        });
    }); },
});
// Get unread notification count
exports.getUnreadCount = (0, server_1.query)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var user, allNotifications, userNotifications, unreadCount, _loop_1, _i, userNotifications_1, notif;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        return [2 /*return*/, 0];
                    }
                    return [4 /*yield*/, ctx.db
                            .query("notifications")
                            .withIndex("by_status", function (q) { return q.eq("status", "sent"); })
                            .collect()];
                case 2:
                    allNotifications = _a.sent();
                    userNotifications = allNotifications.filter(function (notif) {
                        if (!notif.targetUsers || notif.targetUsers.length === 0) {
                            return true;
                        }
                        return notif.targetUsers.includes(user._id);
                    });
                    unreadCount = 0;
                    _loop_1 = function (notif) {
                        var readStatus;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, ctx.db
                                        .query("userNotificationStatus")
                                        .withIndex("by_user_and_notification", function (q) {
                                        return q.eq("userId", user._id).eq("notificationId", notif._id);
                                    })
                                        .first()];
                                case 1:
                                    readStatus = _b.sent();
                                    if (!readStatus || !readStatus.isRead) {
                                        unreadCount++;
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, userNotifications_1 = userNotifications;
                    _a.label = 3;
                case 3:
                    if (!(_i < userNotifications_1.length)) return [3 /*break*/, 6];
                    notif = userNotifications_1[_i];
                    return [5 /*yield**/, _loop_1(notif)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/, unreadCount];
            }
        });
    }); },
});
// Mark notification as read
exports.markAsRead = (0, server_1.mutation)({
    args: { notificationId: values_1.v.id("notifications") },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, existing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        throw new Error("Unauthorized");
                    }
                    return [4 /*yield*/, ctx.db
                            .query("userNotificationStatus")
                            .withIndex("by_user_and_notification", function (q) {
                            return q.eq("userId", user._id).eq("notificationId", args.notificationId);
                        })
                            .first()];
                case 2:
                    existing = _a.sent();
                    if (!existing) return [3 /*break*/, 4];
                    return [4 /*yield*/, ctx.db.patch(existing._id, {
                            isRead: true,
                            readAt: Date.now(),
                        })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, ctx.db.insert("userNotificationStatus", {
                        userId: user._id,
                        notificationId: args.notificationId,
                        isRead: true,
                        readAt: Date.now(),
                    })];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [2 /*return*/, args.notificationId];
            }
        });
    }); },
});
// Mark all notifications as read
exports.markAllAsRead = (0, server_1.mutation)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var user, allNotifications, userNotifications, _loop_2, _i, userNotifications_2, notif;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        throw new Error("Unauthorized");
                    }
                    return [4 /*yield*/, ctx.db
                            .query("notifications")
                            .withIndex("by_status", function (q) { return q.eq("status", "sent"); })
                            .collect()];
                case 2:
                    allNotifications = _a.sent();
                    userNotifications = allNotifications.filter(function (notif) {
                        if (!notif.targetUsers || notif.targetUsers.length === 0) {
                            return true;
                        }
                        return notif.targetUsers.includes(user._id);
                    });
                    _loop_2 = function (notif) {
                        var existing;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, ctx.db
                                        .query("userNotificationStatus")
                                        .withIndex("by_user_and_notification", function (q) {
                                        return q.eq("userId", user._id).eq("notificationId", notif._id);
                                    })
                                        .first()];
                                case 1:
                                    existing = _b.sent();
                                    if (!existing) return [3 /*break*/, 3];
                                    return [4 /*yield*/, ctx.db.patch(existing._id, {
                                            isRead: true,
                                            readAt: Date.now(),
                                        })];
                                case 2:
                                    _b.sent();
                                    return [3 /*break*/, 5];
                                case 3: return [4 /*yield*/, ctx.db.insert("userNotificationStatus", {
                                        userId: user._id,
                                        notificationId: notif._id,
                                        isRead: true,
                                        readAt: Date.now(),
                                    })];
                                case 4:
                                    _b.sent();
                                    _b.label = 5;
                                case 5: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, userNotifications_2 = userNotifications;
                    _a.label = 3;
                case 3:
                    if (!(_i < userNotifications_2.length)) return [3 /*break*/, 6];
                    notif = userNotifications_2[_i];
                    return [5 /*yield**/, _loop_2(notif)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/, true];
            }
        });
    }); },
});
