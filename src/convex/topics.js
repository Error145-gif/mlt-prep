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
exports.initializeMLTTopics = exports.batchCreateTopics = exports.deleteTopic = exports.updateTopic = exports.createTopic = exports.getAllTopics = void 0;
var values_1 = require("convex/values");
var server_1 = require("./_generated/server");
var users_1 = require("./users");
// Get all topics
exports.getAllTopics = (0, server_1.query)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var topics;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.query("topics").collect()];
                case 1:
                    topics = _a.sent();
                    return [2 /*return*/, topics.sort(function (a, b) { return a.order - b.order; })];
            }
        });
    }); },
});
// Create topic
exports.createTopic = (0, server_1.mutation)({
    args: {
        name: values_1.v.string(),
        description: values_1.v.optional(values_1.v.string()),
        parentId: values_1.v.optional(values_1.v.id("topics")),
        order: values_1.v.number(),
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
                    return [4 /*yield*/, ctx.db.insert("topics", args)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Update topic
exports.updateTopic = (0, server_1.mutation)({
    args: {
        id: values_1.v.id("topics"),
        name: values_1.v.optional(values_1.v.string()),
        description: values_1.v.optional(values_1.v.string()),
        order: values_1.v.optional(values_1.v.number()),
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
// Delete topic
exports.deleteTopic = (0, server_1.mutation)({
    args: { id: values_1.v.id("topics") },
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
// Batch create topics (for initial setup)
exports.batchCreateTopics = (0, server_1.mutation)({
    args: {
        topics: values_1.v.array(values_1.v.object({
            name: values_1.v.string(),
            description: values_1.v.optional(values_1.v.string()),
            order: values_1.v.number(),
        })),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var user, results, _i, _a, topic, id;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _b.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized");
                    }
                    results = [];
                    _i = 0, _a = args.topics;
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    topic = _a[_i];
                    return [4 /*yield*/, ctx.db.insert("topics", topic)];
                case 3:
                    id = _b.sent();
                    results.push(id);
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, results];
            }
        });
    }); },
});
// Initialize MLT topics - can be called once by admin
exports.initializeMLTTopics = (0, server_1.mutation)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var user, existingTopics, mltTopics, results, _i, mltTopics_1, topic, id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_1.getCurrentUser)(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user || user.role !== "admin") {
                        throw new Error("Unauthorized");
                    }
                    return [4 /*yield*/, ctx.db.query("topics").collect()];
                case 2:
                    existingTopics = _a.sent();
                    if (existingTopics.length > 0) {
                        return [2 /*return*/, { message: "Topics already initialized", count: existingTopics.length }];
                    }
                    mltTopics = [
                        { name: "Anatomy", order: 1 },
                        { name: "Physiology", order: 2 },
                        { name: "Biochemistry", order: 3 },
                        { name: "Pathology", order: 4 },
                        { name: "Microbiology", order: 5 },
                        { name: "Hematology", order: 6 },
                        { name: "Histopathology", order: 7 },
                        { name: "Cytology", order: 8 },
                        { name: "Serology", order: 9 },
                        { name: "Immunology", order: 10 },
                        { name: "Parasitology", order: 11 },
                        { name: "Clinical Biochemistry", order: 12 },
                        { name: "Blood Banking (Transfusion Medicine)", order: 13 },
                        { name: "Molecular Biology", order: 14 },
                        { name: "Genetics", order: 15 },
                        { name: "Clinical Pathology", order: 16 },
                        { name: "Medical Ethics & Hospital Management", order: 17 },
                        { name: "Laboratory Management & Quality Control", order: 18 },
                        { name: "Biomedical Waste Management", order: 19 },
                        { name: "Instrumentation & Lab Equipment", order: 20 },
                        { name: "Virology", order: 21 },
                        { name: "Mycology", order: 22 },
                        { name: "Bacteriology", order: 23 },
                        { name: "Toxicology", order: 24 },
                        { name: "Endocrinology", order: 25 },
                        { name: "Clinical Microscopy & Urinalysis", order: 26 },
                        { name: "Histotechnology", order: 27 },
                        { name: "Immunohematology", order: 28 },
                        { name: "Biostatistics & Research Methodology", order: 29 },
                        { name: "Computer Applications in Laboratory Science", order: 30 },
                    ];
                    results = [];
                    _i = 0, mltTopics_1 = mltTopics;
                    _a.label = 3;
                case 3:
                    if (!(_i < mltTopics_1.length)) return [3 /*break*/, 6];
                    topic = mltTopics_1[_i];
                    return [4 /*yield*/, ctx.db.insert("topics", topic)];
                case 4:
                    id = _a.sent();
                    results.push(id);
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/, { message: "MLT topics initialized successfully", count: results.length }];
            }
        });
    }); },
});
