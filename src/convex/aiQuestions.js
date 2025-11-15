"use strict";
"use node";
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
exports.batchCreateQuestions = exports.extractPYQFromPDF = exports.generateQuestionsFromPDF = exports.generateQuestionsFromAI = exports.autoGenerateMistralQuestions = void 0;
var values_1 = require("convex/values");
var server_1 = require("./_generated/server");
var api_1 = require("./_generated/api");
var openai_1 = require("openai");
// Initialize OpenRouter client for Mistral access
var getOpenRouterClient = function () {
    var apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        throw new Error("OPENROUTER_API_KEY environment variable is not set");
    }
    return new openai_1.default({
        apiKey: apiKey,
        baseURL: 'https://openrouter.ai/api/v1',
        defaultHeaders: {
            'HTTP-Referer': 'https://mlt-prep.com',
            'X-Title': 'MLT Prep',
        },
    });
};
// Auto-generate 100 MLT questions using Mistral
exports.autoGenerateMistralQuestions = (0, server_1.action)({
    args: {
        topicId: values_1.v.optional(values_1.v.id("topics")),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var openrouter, prompt, completion, responseText, jsonText, jsonMatch, questions, validQuestions, CHUNK_SIZE, savedIds, i, chunk, _i, chunk_1, question, id, error_1, successCount, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("Starting Mistral AI question generation...");
                    openrouter = getOpenRouterClient();
                    prompt = "You are an expert Medical Lab Technology exam question generator.\nGenerate 100 high-quality MCQs in JSON array only.\nEach object must have:\n{\n  \"question\": \"...\",\n  \"options\": [\"...\", \"...\", \"...\", \"...\"],\n  \"answer\": \"...\",\n  \"explanation\": \"...\",\n  \"subject\": \"...\",\n  \"topic\": \"...\",\n  \"difficulty\": \"Easy\" | \"Medium\" | \"Hard\",\n  \"type\": \"MCQ\"\n}\n\nMake sure:\n- All questions are unique\n- Follows real MLT exam style covering Hematology, Biochemistry, Microbiology, Immunology, Clinical Pathology, etc.\n- No markdown, no text outside JSON\n- Output must be a valid JSON array only\n- Answer must be one of the exact options provided";
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 13, , 14]);
                    return [4 /*yield*/, openrouter.chat.completions.create({
                            model: 'mistralai/mistral-small',
                            messages: [
                                {
                                    role: 'user',
                                    content: prompt
                                }
                            ],
                            temperature: 0.2,
                            max_tokens: 16000,
                        })];
                case 2:
                    completion = _b.sent();
                    responseText = completion.choices[0].message.content;
                    if (!responseText) {
                        throw new Error("No response from Mistral API");
                    }
                    console.log("Received response from Mistral, parsing JSON...");
                    jsonText = responseText.trim();
                    jsonMatch = jsonText.match(/\[[\s\S]*\]/);
                    if (jsonMatch) {
                        jsonText = jsonMatch[0];
                    }
                    questions = JSON.parse(jsonText);
                    if (!Array.isArray(questions)) {
                        throw new Error("Response is not a valid JSON array");
                    }
                    console.log("Parsed ".concat(questions.length, " questions from Mistral"));
                    validQuestions = questions
                        .filter(function (q) {
                        return (q.question &&
                            Array.isArray(q.options) &&
                            q.options.length === 4 &&
                            q.answer &&
                            q.subject &&
                            q.difficulty);
                    })
                        .map(function (q) { return ({
                        type: "mcq",
                        question: q.question,
                        options: q.options,
                        correctAnswer: q.answer,
                        explanation: q.explanation || "",
                        difficulty: q.difficulty.toLowerCase(),
                        subject: q.subject,
                        source: "ai",
                        topicId: args.topicId,
                    }); });
                    console.log("".concat(validQuestions.length, " valid questions after filtering"));
                    if (validQuestions.length === 0) {
                        throw new Error("No valid questions generated");
                    }
                    CHUNK_SIZE = 10;
                    savedIds = [];
                    i = 0;
                    _b.label = 3;
                case 3:
                    if (!(i < validQuestions.length)) return [3 /*break*/, 12];
                    chunk = validQuestions.slice(i, i + CHUNK_SIZE);
                    console.log("Saving chunk ".concat(Math.floor(i / CHUNK_SIZE) + 1, "/").concat(Math.ceil(validQuestions.length / CHUNK_SIZE)));
                    _i = 0, chunk_1 = chunk;
                    _b.label = 4;
                case 4:
                    if (!(_i < chunk_1.length)) return [3 /*break*/, 9];
                    question = chunk_1[_i];
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, ctx.runMutation(api_1.internal.questions.createQuestionInternalFromAction, {
                            type: question.type,
                            question: question.question,
                            options: question.options,
                            correctAnswer: question.correctAnswer,
                            explanation: question.explanation,
                            difficulty: question.difficulty,
                            subject: question.subject,
                            topic: "General",
                            source: "ai",
                        })];
                case 6:
                    id = _b.sent();
                    savedIds.push(id);
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _b.sent();
                    console.error("Failed to save question:", error_1);
                    savedIds.push(null);
                    return [3 /*break*/, 8];
                case 8:
                    _i++;
                    return [3 /*break*/, 4];
                case 9:
                    if (!(i + CHUNK_SIZE < validQuestions.length)) return [3 /*break*/, 11];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                case 10:
                    _b.sent();
                    _b.label = 11;
                case 11:
                    i += CHUNK_SIZE;
                    return [3 /*break*/, 3];
                case 12:
                    successCount = savedIds.filter(function (id) { return id !== null; }).length;
                    console.log("Successfully saved ".concat(successCount, "/").concat(validQuestions.length, " questions"));
                    return [2 /*return*/, {
                            success: true,
                            generated: questions.length,
                            valid: validQuestions.length,
                            saved: successCount,
                            message: "\u2705 ".concat(successCount, " AI Questions Generated & Saved Successfully!"),
                        }];
                case 13:
                    error_2 = _b.sent();
                    console.error("Error in Mistral question generation:", error_2);
                    if ((_a = error_2.message) === null || _a === void 0 ? void 0 : _a.includes("OPENROUTER_API_KEY")) {
                        throw new Error("OpenRouter API key not configured. Please add OPENROUTER_API_KEY to environment variables.");
                    }
                    throw new Error("Failed to generate questions: ".concat(error_2.message || 'Unknown error'));
                case 14: return [2 /*return*/];
            }
        });
    }); },
});
// Legacy disabled functions
exports.generateQuestionsFromAI = (0, server_1.action)({
    args: {
        questionCount: values_1.v.number(),
        difficulty: values_1.v.optional(values_1.v.string()),
        topicId: values_1.v.optional(values_1.v.id("topics")),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            throw new Error("AI question generation has been disabled. Please use manual question entry instead.");
        });
    }); },
});
exports.generateQuestionsFromPDF = (0, server_1.action)({
    args: {
        fileId: values_1.v.id("_storage"),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            throw new Error("AI question generation from PDF has been disabled. Please use manual question entry instead.");
        });
    }); },
});
exports.extractPYQFromPDF = (0, server_1.action)({
    args: {
        fileId: values_1.v.id("_storage"),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            throw new Error("PYQ extraction from PDF has been disabled. Please use manual PYQ entry instead.");
        });
    }); },
});
exports.batchCreateQuestions = (0, server_1.action)({
    args: {
        questions: values_1.v.array(values_1.v.any()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var CHUNK_SIZE, results, i, chunk, _i, chunk_2, question, result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    CHUNK_SIZE = 10;
                    results = [];
                    console.log("Starting batch creation of ".concat(args.questions.length, " questions in chunks of ").concat(CHUNK_SIZE));
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < args.questions.length)) return [3 /*break*/, 10];
                    chunk = args.questions.slice(i, i + CHUNK_SIZE);
                    console.log("Processing chunk ".concat(Math.floor(i / CHUNK_SIZE) + 1, "/").concat(Math.ceil(args.questions.length / CHUNK_SIZE), " (").concat(chunk.length, " questions)"));
                    _i = 0, chunk_2 = chunk;
                    _a.label = 2;
                case 2:
                    if (!(_i < chunk_2.length)) return [3 /*break*/, 7];
                    question = chunk_2[_i];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, ctx.runMutation(api_1.internal.questions.createQuestionInternal, question)];
                case 4:
                    result = _a.sent();
                    results.push(result);
                    return [3 /*break*/, 6];
                case 5:
                    error_3 = _a.sent();
                    console.error("Failed to create question:", error_3);
                    results.push(null);
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7:
                    if (!(i + CHUNK_SIZE < args.questions.length)) return [3 /*break*/, 9];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9:
                    i += CHUNK_SIZE;
                    return [3 /*break*/, 1];
                case 10:
                    console.log("Batch creation complete: ".concat(results.filter(function (r) { return r !== null; }).length, "/").concat(args.questions.length, " questions created successfully"));
                    return [2 /*return*/, results];
            }
        });
    }); },
});
