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
exports.deleteUser = exports.resetAllUserData = void 0;
var values_1 = require("convex/values");
var server_1 = require("./_generated/server");
var users_1 = require("./users");
var userDataReset_1 = require("./userDataReset");
Object.defineProperty(exports, "resetAllUserData", { enumerable: true, get: function () { return userDataReset_1.resetAllUserData; } });
// Delete a user (admin only)
exports.deleteUser = (0, server_1.mutation)({
    args: {
        userId: values_1.v.id("users"),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var admin, userToDelete, _a, userProgress, testScores, subscriptions, feedback;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    admin = _b.sent();
                    if (!admin || admin.role !== "admin") {
                        throw new Error("Unauthorized: Only admins can delete users");
                    }
                    // Prevent admin from deleting themselves
                    if (admin._id === args.userId) {
                        throw new Error("Cannot delete your own admin account");
                    }
                    return [4 /*yield*/, ctx.db.get(args.userId)];
                case 2:
                    userToDelete = _b.sent();
                    if (!userToDelete) {
                        throw new Error("User not found");
                    }
                    return [4 /*yield*/, Promise.all([
                            ctx.db
                                .query("userProgress")
                                .withIndex("by_user", function (q) { return q.eq("userId", args.userId); })
                                .collect(),
                            ctx.db
                                .query("testScores")
                                .withIndex("by_user", function (q) { return q.eq("userId", args.userId); })
                                .collect(),
                            ctx.db
                                .query("subscriptions")
                                .withIndex("by_user", function (q) { return q.eq("userId", args.userId); })
                                .collect(),
                            ctx.db
                                .query("feedback")
                                .withIndex("by_user", function (q) { return q.eq("userId", args.userId); })
                                .collect(),
                        ])];
                case 3:
                    _a = _b.sent(), userProgress = _a[0], testScores = _a[1], subscriptions = _a[2], feedback = _a[3];
                    // Delete all related records
                    return [4 /*yield*/, Promise.all(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], userProgress.map(function (p) { return ctx.db.delete(p._id); }), true), testScores.map(function (s) { return ctx.db.delete(s._id); }), true), subscriptions.map(function (s) { return ctx.db.delete(s._id); }), true), feedback.map(function (f) { return ctx.db.delete(f._id); }), true))];
                case 4:
                    // Delete all related records
                    _b.sent();
                    // Finally delete the user
                    return [4 /*yield*/, ctx.db.delete(args.userId)];
                case 5:
                    // Finally delete the user
                    _b.sent();
                    return [2 /*return*/, { success: true, deletedEmail: userToDelete.email }];
            }
        });
    }); },
});
