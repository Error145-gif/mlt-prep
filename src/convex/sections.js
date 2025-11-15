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
exports.initializeDefaultSections = exports.updateSectionQuestionCount = exports.deleteSection = exports.updateSection = exports.createSection = exports.getSectionById = exports.getActiveSections = exports.getAllSections = void 0;
var values_1 = require("convex/values");
var server_1 = require("./_generated/server");
var server_2 = require("@convex-dev/auth/server");
// Get all sections
exports.getAllSections = (0, server_1.query)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var sections;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db
                        .query("sections")
                        .withIndex("by_order")
                        .order("asc")
                        .collect()];
                case 1:
                    sections = _a.sent();
                    return [2 /*return*/, sections];
            }
        });
    }); },
});
// Get active sections only
exports.getActiveSections = (0, server_1.query)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var sections;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db
                        .query("sections")
                        .withIndex("by_active", function (q) { return q.eq("isActive", true); })
                        .collect()];
                case 1:
                    sections = _a.sent();
                    return [2 /*return*/, sections.sort(function (a, b) { return a.order - b.order; })];
            }
        });
    }); },
});
// Get section by ID
exports.getSectionById = (0, server_1.query)({
    args: { sectionId: values_1.v.id("sections") },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.get(args.sectionId)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Create a new section
exports.createSection = (0, server_1.mutation)({
    args: {
        name: values_1.v.string(),
        description: values_1.v.optional(values_1.v.string()),
        order: values_1.v.number(),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, user, sectionId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_2.getAuthUserId)(ctx)];
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
                    return [4 /*yield*/, ctx.db.insert("sections", {
                            name: args.name,
                            description: args.description,
                            questionCount: 0,
                            order: args.order,
                            isActive: true,
                        })];
                case 3:
                    sectionId = _a.sent();
                    return [2 /*return*/, sectionId];
            }
        });
    }); },
});
// Update section
exports.updateSection = (0, server_1.mutation)({
    args: {
        sectionId: values_1.v.id("sections"),
        name: values_1.v.optional(values_1.v.string()),
        description: values_1.v.optional(values_1.v.string()),
        order: values_1.v.optional(values_1.v.number()),
        isActive: values_1.v.optional(values_1.v.boolean()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, user, sectionId, updates;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_2.getAuthUserId)(ctx)];
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
                    sectionId = args.sectionId, updates = __rest(args, ["sectionId"]);
                    return [4 /*yield*/, ctx.db.patch(sectionId, updates)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, sectionId];
            }
        });
    }); },
});
// Delete section
exports.deleteSection = (0, server_1.mutation)({
    args: { sectionId: values_1.v.id("sections") },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, user, questions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_2.getAuthUserId)(ctx)];
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
                    return [4 /*yield*/, ctx.db
                            .query("questions")
                            .withIndex("by_section", function (q) { return q.eq("sectionId", args.sectionId); })
                            .collect()];
                case 3:
                    questions = _a.sent();
                    if (questions.length > 0) {
                        throw new Error("Cannot delete section with existing questions. Please reassign or delete questions first.");
                    }
                    return [4 /*yield*/, ctx.db.delete(args.sectionId)];
                case 4:
                    _a.sent();
                    return [2 /*return*/, { success: true }];
            }
        });
    }); },
});
// Update section question count
exports.updateSectionQuestionCount = (0, server_1.mutation)({
    args: { sectionId: values_1.v.id("sections") },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var questions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db
                        .query("questions")
                        .withIndex("by_section", function (q) { return q.eq("sectionId", args.sectionId); })
                        .collect()];
                case 1:
                    questions = _a.sent();
                    return [4 /*yield*/, ctx.db.patch(args.sectionId, {
                            questionCount: questions.length,
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, questions.length];
            }
        });
    }); },
});
// Initialize 50 default sections
exports.initializeDefaultSections = (0, server_1.mutation)({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, user, existingSections, defaultSections, sectionIds, i, sectionId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_2.getAuthUserId)(ctx)];
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
                    return [4 /*yield*/, ctx.db.query("sections").collect()];
                case 3:
                    existingSections = _a.sent();
                    if (existingSections.length > 0) {
                        throw new Error("Sections already initialized");
                    }
                    defaultSections = [
                        { name: "Hematology - Blood Cells", description: "Questions about blood cell types, morphology, and functions" },
                        { name: "Hematology - Anemia", description: "Questions about different types of anemia" },
                        { name: "Hematology - Coagulation", description: "Questions about blood clotting mechanisms" },
                        { name: "Hematology - Blood Banking", description: "Questions about blood groups and transfusion" },
                        { name: "Biochemistry - Carbohydrates", description: "Questions about carbohydrate metabolism" },
                        { name: "Biochemistry - Proteins", description: "Questions about protein structure and function" },
                        { name: "Biochemistry - Lipids", description: "Questions about lipid metabolism" },
                        { name: "Biochemistry - Enzymes", description: "Questions about enzyme kinetics and function" },
                        { name: "Biochemistry - Clinical Chemistry", description: "Questions about clinical biochemistry tests" },
                        { name: "Microbiology - Bacteriology", description: "Questions about bacterial identification and culture" },
                        { name: "Microbiology - Virology", description: "Questions about viruses and viral diseases" },
                        { name: "Microbiology - Mycology", description: "Questions about fungi and fungal infections" },
                        { name: "Microbiology - Parasitology", description: "Questions about parasites and parasitic diseases" },
                        { name: "Microbiology - Immunology", description: "Questions about immune system and immunological tests" },
                        { name: "Pathology - General Pathology", description: "Questions about disease processes" },
                        { name: "Pathology - Systemic Pathology", description: "Questions about organ-specific pathology" },
                        { name: "Pathology - Clinical Pathology", description: "Questions about laboratory diagnosis" },
                        { name: "Histopathology - Tissue Processing", description: "Questions about tissue preparation techniques" },
                        { name: "Histopathology - Staining Techniques", description: "Questions about various staining methods" },
                        { name: "Cytology - Cell Structure", description: "Questions about cell morphology" },
                        { name: "Cytology - Diagnostic Cytology", description: "Questions about cytological diagnosis" },
                        { name: "Serology - Antigen-Antibody Reactions", description: "Questions about serological tests" },
                        { name: "Serology - Immunoassays", description: "Questions about ELISA, RIA, and other immunoassays" },
                        { name: "Molecular Biology - DNA & RNA", description: "Questions about nucleic acids" },
                        { name: "Molecular Biology - PCR & Techniques", description: "Questions about molecular diagnostic techniques" },
                        { name: "Clinical Microbiology - Specimen Collection", description: "Questions about sample collection and handling" },
                        { name: "Clinical Microbiology - Culture Methods", description: "Questions about culture techniques" },
                        { name: "Clinical Microbiology - Antimicrobial Testing", description: "Questions about antibiotic sensitivity testing" },
                        { name: "Quality Control - Laboratory Standards", description: "Questions about QC procedures" },
                        { name: "Quality Control - Instrument Calibration", description: "Questions about equipment maintenance" },
                        { name: "Laboratory Safety - Biosafety", description: "Questions about laboratory safety protocols" },
                        { name: "Laboratory Safety - Chemical Safety", description: "Questions about handling hazardous chemicals" },
                        { name: "Instrumentation - Spectrophotometry", description: "Questions about spectrophotometers" },
                        { name: "Instrumentation - Microscopy", description: "Questions about microscopes and microscopy" },
                        { name: "Instrumentation - Automated Analyzers", description: "Questions about automated laboratory equipment" },
                        { name: "Blood Gas Analysis", description: "Questions about arterial blood gas interpretation" },
                        { name: "Urinalysis", description: "Questions about urine examination" },
                        { name: "Body Fluid Analysis", description: "Questions about CSF, pleural fluid, etc." },
                        { name: "Hormone Assays", description: "Questions about endocrine testing" },
                        { name: "Tumor Markers", description: "Questions about cancer biomarkers" },
                        { name: "Therapeutic Drug Monitoring", description: "Questions about drug level testing" },
                        { name: "Toxicology", description: "Questions about toxicological analysis" },
                        { name: "Genetics - Chromosomal Disorders", description: "Questions about genetic abnormalities" },
                        { name: "Genetics - Molecular Genetics", description: "Questions about genetic testing" },
                        { name: "Transfusion Medicine", description: "Questions about blood transfusion practices" },
                        { name: "Laboratory Management", description: "Questions about lab administration" },
                        { name: "Research Methodology", description: "Questions about research and statistics" },
                        { name: "Ethics & Regulations", description: "Questions about medical ethics and regulations" },
                        { name: "General MLT Knowledge", description: "Mixed questions covering multiple topics" },
                        { name: "Mock Test Questions", description: "Comprehensive mock test questions" },
                    ];
                    sectionIds = [];
                    i = 0;
                    _a.label = 4;
                case 4:
                    if (!(i < defaultSections.length)) return [3 /*break*/, 7];
                    return [4 /*yield*/, ctx.db.insert("sections", {
                            name: defaultSections[i].name,
                            description: defaultSections[i].description,
                            questionCount: 0,
                            order: i + 1,
                            isActive: true,
                        })];
                case 5:
                    sectionId = _a.sent();
                    sectionIds.push(sectionId);
                    _a.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 4];
                case 7: return [2 /*return*/, { success: true, count: sectionIds.length }];
            }
        });
    }); },
});
