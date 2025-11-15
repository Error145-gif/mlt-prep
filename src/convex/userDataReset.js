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
exports.resetAllUserData = void 0;
var server_1 = require("./_generated/server");
var users_1 = require("./users");
// Reset all user data (admin only) - removes all users and their related data
exports.resetAllUserData = (0, server_1.mutation)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var admin, allUsers, deletedCounts, _loop_1, _i, allUsers_1, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    admin = _a.sent();
                    if (!admin || admin.role !== "admin") {
                        throw new Error("Unauthorized: Only admins can reset user data");
                    }
                    return [4 /*yield*/, ctx.db.query("users").collect()];
                case 2:
                    allUsers = _a.sent();
                    deletedCounts = {
                        users: 0,
                        userProgress: 0,
                        testScores: 0,
                        testSessions: 0,
                        testResults: 0,
                        subscriptions: 0,
                        payments: 0,
                        feedback: 0,
                    };
                    _loop_1 = function (user) {
                        var userProgress, _b, userProgress_1, progress, testScores, _c, testScores_1, score, testSessions, _d, testSessions_1, session, testResults, _e, testResults_1, result, subscriptions, _f, subscriptions_1, subscription, payments, _g, payments_1, payment, feedback, _h, feedback_1, fb;
                        return __generator(this, function (_j) {
                            switch (_j.label) {
                                case 0:
                                    // Skip the current admin to preserve admin access
                                    if (user._id === admin._id) {
                                        return [2 /*return*/, "continue"];
                                    }
                                    return [4 /*yield*/, ctx.db
                                            .query("userProgress")
                                            .withIndex("by_user", function (q) { return q.eq("userId", user._id); })
                                            .collect()];
                                case 1:
                                    userProgress = _j.sent();
                                    _b = 0, userProgress_1 = userProgress;
                                    _j.label = 2;
                                case 2:
                                    if (!(_b < userProgress_1.length)) return [3 /*break*/, 5];
                                    progress = userProgress_1[_b];
                                    return [4 /*yield*/, ctx.db.delete(progress._id)];
                                case 3:
                                    _j.sent();
                                    deletedCounts.userProgress++;
                                    _j.label = 4;
                                case 4:
                                    _b++;
                                    return [3 /*break*/, 2];
                                case 5: return [4 /*yield*/, ctx.db
                                        .query("testScores")
                                        .withIndex("by_user", function (q) { return q.eq("userId", user._id); })
                                        .collect()];
                                case 6:
                                    testScores = _j.sent();
                                    _c = 0, testScores_1 = testScores;
                                    _j.label = 7;
                                case 7:
                                    if (!(_c < testScores_1.length)) return [3 /*break*/, 10];
                                    score = testScores_1[_c];
                                    return [4 /*yield*/, ctx.db.delete(score._id)];
                                case 8:
                                    _j.sent();
                                    deletedCounts.testScores++;
                                    _j.label = 9;
                                case 9:
                                    _c++;
                                    return [3 /*break*/, 7];
                                case 10: return [4 /*yield*/, ctx.db
                                        .query("testSessions")
                                        .withIndex("by_user", function (q) { return q.eq("userId", user._id); })
                                        .collect()];
                                case 11:
                                    testSessions = _j.sent();
                                    _d = 0, testSessions_1 = testSessions;
                                    _j.label = 12;
                                case 12:
                                    if (!(_d < testSessions_1.length)) return [3 /*break*/, 15];
                                    session = testSessions_1[_d];
                                    return [4 /*yield*/, ctx.db.delete(session._id)];
                                case 13:
                                    _j.sent();
                                    deletedCounts.testSessions++;
                                    _j.label = 14;
                                case 14:
                                    _d++;
                                    return [3 /*break*/, 12];
                                case 15: return [4 /*yield*/, ctx.db
                                        .query("testResults")
                                        .withIndex("by_user", function (q) { return q.eq("userId", user._id); })
                                        .collect()];
                                case 16:
                                    testResults = _j.sent();
                                    _e = 0, testResults_1 = testResults;
                                    _j.label = 17;
                                case 17:
                                    if (!(_e < testResults_1.length)) return [3 /*break*/, 20];
                                    result = testResults_1[_e];
                                    return [4 /*yield*/, ctx.db.delete(result._id)];
                                case 18:
                                    _j.sent();
                                    deletedCounts.testResults++;
                                    _j.label = 19;
                                case 19:
                                    _e++;
                                    return [3 /*break*/, 17];
                                case 20: return [4 /*yield*/, ctx.db
                                        .query("subscriptions")
                                        .withIndex("by_user", function (q) { return q.eq("userId", user._id); })
                                        .collect()];
                                case 21:
                                    subscriptions = _j.sent();
                                    _f = 0, subscriptions_1 = subscriptions;
                                    _j.label = 22;
                                case 22:
                                    if (!(_f < subscriptions_1.length)) return [3 /*break*/, 25];
                                    subscription = subscriptions_1[_f];
                                    return [4 /*yield*/, ctx.db.delete(subscription._id)];
                                case 23:
                                    _j.sent();
                                    deletedCounts.subscriptions++;
                                    _j.label = 24;
                                case 24:
                                    _f++;
                                    return [3 /*break*/, 22];
                                case 25: return [4 /*yield*/, ctx.db
                                        .query("payments")
                                        .withIndex("by_user", function (q) { return q.eq("userId", user._id); })
                                        .collect()];
                                case 26:
                                    payments = _j.sent();
                                    _g = 0, payments_1 = payments;
                                    _j.label = 27;
                                case 27:
                                    if (!(_g < payments_1.length)) return [3 /*break*/, 30];
                                    payment = payments_1[_g];
                                    return [4 /*yield*/, ctx.db.delete(payment._id)];
                                case 28:
                                    _j.sent();
                                    deletedCounts.payments++;
                                    _j.label = 29;
                                case 29:
                                    _g++;
                                    return [3 /*break*/, 27];
                                case 30: return [4 /*yield*/, ctx.db
                                        .query("feedback")
                                        .withIndex("by_user", function (q) { return q.eq("userId", user._id); })
                                        .collect()];
                                case 31:
                                    feedback = _j.sent();
                                    _h = 0, feedback_1 = feedback;
                                    _j.label = 32;
                                case 32:
                                    if (!(_h < feedback_1.length)) return [3 /*break*/, 35];
                                    fb = feedback_1[_h];
                                    return [4 /*yield*/, ctx.db.delete(fb._id)];
                                case 33:
                                    _j.sent();
                                    deletedCounts.feedback++;
                                    _j.label = 34;
                                case 34:
                                    _h++;
                                    return [3 /*break*/, 32];
                                case 35: 
                                // Finally delete the user
                                return [4 /*yield*/, ctx.db.delete(user._id)];
                                case 36:
                                    // Finally delete the user
                                    _j.sent();
                                    deletedCounts.users++;
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, allUsers_1 = allUsers;
                    _a.label = 3;
                case 3:
                    if (!(_i < allUsers_1.length)) return [3 /*break*/, 6];
                    user = allUsers_1[_i];
                    return [5 /*yield**/, _loop_1(user)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/, {
                        success: true,
                        message: "All user data has been reset successfully",
                        deletedCounts: deletedCounts,
                        adminPreserved: admin.email,
                    }];
            }
        });
    }); },
});
