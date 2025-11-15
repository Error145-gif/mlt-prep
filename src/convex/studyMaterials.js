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
exports.incrementViews = exports.updateStudyMaterial = exports.deleteStudyMaterial = exports.uploadStudyMaterial = exports.getAllStudyMaterialsAdmin = exports.getAllStudyMaterials = void 0;
var values_1 = require("convex/values");
var server_1 = require("./_generated/server");
var server_2 = require("@convex-dev/auth/server");
// Get all study materials (for users)
exports.getAllStudyMaterials = (0, server_1.query)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var materials, materialsWithUrls;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db
                        .query("studyMaterials")
                        .filter(function (q) { return q.eq(q.field("status"), "active"); })
                        .order("desc")
                        .collect()];
                case 1:
                    materials = _a.sent();
                    return [4 /*yield*/, Promise.all(materials.map(function (material) { return __awaiter(void 0, void 0, void 0, function () {
                            var url;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, ctx.storage.getUrl(material.fileId)];
                                    case 1:
                                        url = _a.sent();
                                        return [2 /*return*/, __assign(__assign({}, material), { fileUrl: url })];
                                }
                            });
                        }); }))];
                case 2:
                    materialsWithUrls = _a.sent();
                    return [2 /*return*/, materialsWithUrls];
            }
        });
    }); },
});
// Get all study materials for admin
exports.getAllStudyMaterialsAdmin = (0, server_1.query)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, user, materials, materialsWithDetails;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_2.getAuthUserId)(ctx)];
                case 1:
                    userId = _a.sent();
                    if (!userId)
                        throw new Error("Not authenticated");
                    return [4 /*yield*/, ctx.db.get(userId)];
                case 2:
                    user = _a.sent();
                    if ((user === null || user === void 0 ? void 0 : user.role) !== "admin") {
                        throw new Error("Unauthorized: Admin access required");
                    }
                    return [4 /*yield*/, ctx.db
                            .query("studyMaterials")
                            .order("desc")
                            .collect()];
                case 3:
                    materials = _a.sent();
                    return [4 /*yield*/, Promise.all(materials.map(function (material) { return __awaiter(void 0, void 0, void 0, function () {
                            var url, uploader;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, ctx.storage.getUrl(material.fileId)];
                                    case 1:
                                        url = _a.sent();
                                        return [4 /*yield*/, ctx.db.get(material.uploadedBy)];
                                    case 2:
                                        uploader = _a.sent();
                                        return [2 /*return*/, __assign(__assign({}, material), { fileUrl: url, uploaderName: (uploader === null || uploader === void 0 ? void 0 : uploader.name) || "Unknown" })];
                                }
                            });
                        }); }))];
                case 4:
                    materialsWithDetails = _a.sent();
                    return [2 /*return*/, materialsWithDetails];
            }
        });
    }); },
});
// Upload study material (admin only)
exports.uploadStudyMaterial = (0, server_1.mutation)({
    args: {
        title: values_1.v.string(),
        description: values_1.v.optional(values_1.v.string()),
        fileId: values_1.v.id("_storage"),
        category: values_1.v.optional(values_1.v.string()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, user, materialId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_2.getAuthUserId)(ctx)];
                case 1:
                    userId = _a.sent();
                    if (!userId)
                        throw new Error("Not authenticated");
                    return [4 /*yield*/, ctx.db.get(userId)];
                case 2:
                    user = _a.sent();
                    if ((user === null || user === void 0 ? void 0 : user.role) !== "admin") {
                        throw new Error("Unauthorized: Admin access required");
                    }
                    return [4 /*yield*/, ctx.db.insert("studyMaterials", {
                            title: args.title,
                            description: args.description,
                            fileId: args.fileId,
                            uploadedBy: userId,
                            status: "active",
                            views: 0,
                            category: args.category,
                        })];
                case 3:
                    materialId = _a.sent();
                    return [2 /*return*/, materialId];
            }
        });
    }); },
});
// Delete study material (admin only)
exports.deleteStudyMaterial = (0, server_1.mutation)({
    args: {
        materialId: values_1.v.id("studyMaterials"),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, user, material;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_2.getAuthUserId)(ctx)];
                case 1:
                    userId = _a.sent();
                    if (!userId)
                        throw new Error("Not authenticated");
                    return [4 /*yield*/, ctx.db.get(userId)];
                case 2:
                    user = _a.sent();
                    if ((user === null || user === void 0 ? void 0 : user.role) !== "admin") {
                        throw new Error("Unauthorized: Admin access required");
                    }
                    return [4 /*yield*/, ctx.db.get(args.materialId)];
                case 3:
                    material = _a.sent();
                    if (!material)
                        throw new Error("Material not found");
                    // Delete the file from storage
                    return [4 /*yield*/, ctx.storage.delete(material.fileId)];
                case 4:
                    // Delete the file from storage
                    _a.sent();
                    // Delete the material record
                    return [4 /*yield*/, ctx.db.delete(args.materialId)];
                case 5:
                    // Delete the material record
                    _a.sent();
                    return [2 /*return*/, { success: true }];
            }
        });
    }); },
});
// Update study material (admin only)
exports.updateStudyMaterial = (0, server_1.mutation)({
    args: {
        materialId: values_1.v.id("studyMaterials"),
        title: values_1.v.optional(values_1.v.string()),
        description: values_1.v.optional(values_1.v.string()),
        status: values_1.v.optional(values_1.v.string()),
        category: values_1.v.optional(values_1.v.string()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, user, materialId, updates;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_2.getAuthUserId)(ctx)];
                case 1:
                    userId = _a.sent();
                    if (!userId)
                        throw new Error("Not authenticated");
                    return [4 /*yield*/, ctx.db.get(userId)];
                case 2:
                    user = _a.sent();
                    if ((user === null || user === void 0 ? void 0 : user.role) !== "admin") {
                        throw new Error("Unauthorized: Admin access required");
                    }
                    materialId = args.materialId, updates = __rest(args, ["materialId"]);
                    return [4 /*yield*/, ctx.db.patch(materialId, updates)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, { success: true }];
            }
        });
    }); },
});
// Increment view count
exports.incrementViews = (0, server_1.mutation)({
    args: {
        materialId: values_1.v.id("studyMaterials"),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var material;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.get(args.materialId)];
                case 1:
                    material = _a.sent();
                    if (!material)
                        throw new Error("Material not found");
                    return [4 /*yield*/, ctx.db.patch(args.materialId, {
                            views: material.views + 1,
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, { success: true }];
            }
        });
    }); },
});
