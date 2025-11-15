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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileUrl = exports.generateUploadUrl = exports.deleteContent = exports.updateContent = exports.createContent = exports.getAllContent = void 0;
var values_1 = require("convex/values");
var server_1 = require("./_generated/server");
var users_1 = require("./users");
// Get all content with filters
exports.getAllContent = (0, server_1.query)({
    args: {
        type: values_1.v.optional(values_1.v.string()),
        topicId: values_1.v.optional(values_1.v.id("topics")),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, content, enrichedContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized");
                    }
                    if (!args.type) return [3 /*break*/, 3];
                    return [4 /*yield*/, ctx.db
                            .query("content")
                            .withIndex("by_type", function (q) { return q.eq("type", args.type); })
                            .collect()];
                case 2:
                    content = _a.sent();
                    return [3 /*break*/, 7];
                case 3:
                    if (!args.topicId) return [3 /*break*/, 5];
                    return [4 /*yield*/, ctx.db
                            .query("content")
                            .withIndex("by_topic", function (q) { return q.eq("topicId", args.topicId); })
                            .collect()];
                case 4:
                    content = _a.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, ctx.db.query("content").collect()];
                case 6:
                    content = _a.sent();
                    _a.label = 7;
                case 7: return [4 /*yield*/, Promise.all(content.map(function (item) { return __awaiter(void 0, void 0, void 0, function () {
                        var uploader, topic, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, ctx.db.get(item.uploadedBy)];
                                case 1:
                                    uploader = _b.sent();
                                    if (!item.topicId) return [3 /*break*/, 3];
                                    return [4 /*yield*/, ctx.db.get(item.topicId)];
                                case 2:
                                    _a = _b.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    _a = null;
                                    _b.label = 4;
                                case 4:
                                    topic = _a;
                                    return [2 /*return*/, __assign(__assign({}, item), { uploaderName: (uploader === null || uploader === void 0 ? void 0 : uploader.name) || "Unknown", topicName: (topic === null || topic === void 0 ? void 0 : topic.name) || "Unassigned" })];
                            }
                        });
                    }); }))];
                case 8:
                    enrichedContent = _a.sent();
                    return [2 /*return*/, enrichedContent];
            }
        });
    }); },
});
// Create content
exports.createContent = (0, server_1.mutation)({
    args: {
        title: values_1.v.string(),
        description: values_1.v.optional(values_1.v.string()),
        type: values_1.v.string(),
        fileId: values_1.v.optional(values_1.v.id("_storage")),
        fileUrl: values_1.v.optional(values_1.v.string()),
        topicId: values_1.v.optional(values_1.v.id("topics")),
        duration: values_1.v.optional(values_1.v.number()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, contentId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized");
                    }
                    return [4 /*yield*/, ctx.db.insert("content", {
                            title: args.title,
                            description: args.description,
                            type: args.type,
                            fileId: args.fileId,
                            fileUrl: args.fileUrl,
                            topicId: args.topicId,
                            uploadedBy: user._id,
                            status: "active",
                            views: 0,
                            duration: args.duration,
                        })];
                case 2:
                    contentId = _a.sent();
                    return [2 /*return*/, contentId];
            }
        });
    }); },
});
// Update content
exports.updateContent = (0, server_1.mutation)({
    args: {
        id: values_1.v.id("content"),
        title: values_1.v.optional(values_1.v.string()),
        description: values_1.v.optional(values_1.v.string()),
        topicId: values_1.v.optional(values_1.v.id("topics")),
        status: values_1.v.optional(values_1.v.string()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, id, updates;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized");
                    }
                    id = args.id, updates = __rest(args, ["id"]);
                    return [4 /*yield*/, ctx.db.patch(id, updates)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, id];
            }
        });
    }); },
});
// Delete content
exports.deleteContent = (0, server_1.mutation)({
    args: { id: values_1.v.id("content") },
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
// Add mutation for generating upload URL
exports.generateUploadUrl = (0, server_1.mutation)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.storage.generateUploadUrl()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Get file URL
exports.getFileUrl = (0, server_1.query)({
    args: { storageId: values_1.v.id("_storage") },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.storage.getUrl(args.storageId)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
