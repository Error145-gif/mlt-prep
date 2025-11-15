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
exports.default = QuestionManagement;
var use_auth_1 = require("@/hooks/use-auth");
var react_1 = require("convex/react");
var api_1 = require("@/convex/_generated/api");
var react_router_1 = require("react-router");
var react_2 = require("react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var select_1 = require("@/components/ui/select");
var tabs_1 = require("@/components/ui/tabs");
var dialog_1 = require("@/components/ui/dialog");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var sonner_1 = require("sonner");
function QuestionManagement() {
    var _this = this;
    var _a = (0, use_auth_1.useAuth)(), isLoading = _a.isLoading, isAuthenticated = _a.isAuthenticated, user = _a.user;
    var navigate = (0, react_router_1.useNavigate)();
    var _b = (0, react_2.useState)(false), isMenuOpen = _b[0], setIsMenuOpen = _b[1];
    var _c = (0, react_2.useState)("all"), activeTab = _c[0], setActiveTab = _c[1];
    var _d = (0, react_2.useState)(false), showManualForm = _d[0], setShowManualForm = _d[1];
    var _e = (0, react_2.useState)(false), showBulkManualForm = _e[0], setShowBulkManualForm = _e[1];
    var _f = (0, react_2.useState)(false), showPYQManualForm = _f[0], setShowPYQManualForm = _f[1];
    var _g = (0, react_2.useState)(false), showAIBulkForm = _g[0], setShowAIBulkForm = _g[1];
    var _h = (0, react_2.useState)(false), showMockTestCreator = _h[0], setShowMockTestCreator = _h[1];
    var _j = (0, react_2.useState)(false), showAITestCreator = _j[0], setShowAITestCreator = _j[1];
    var _k = (0, react_2.useState)(false), showBulkDeleteDialog = _k[0], setShowBulkDeleteDialog = _k[1];
    var _l = (0, react_2.useState)("manual"), deleteSourceType = _l[0], setDeleteSourceType = _l[1];
    var _m = (0, react_2.useState)(false), isDeletingBulk = _m[0], setIsDeletingBulk = _m[1];
    var _o = (0, react_2.useState)(new Date().getFullYear()), pyqYear = _o[0], setPyqYear = _o[1];
    var _p = (0, react_2.useState)(""), pyqExamName = _p[0], setPyqExamName = _p[1];
    var _q = (0, react_2.useState)(false), showErrorQuestions = _q[0], setShowErrorQuestions = _q[1];
    var _r = (0, react_2.useState)(false), isGeneratingAI = _r[0], setIsGeneratingAI = _r[1];
    // Mock test creator state
    var _s = (0, react_2.useState)(""), mockTestName = _s[0], setMockTestName = _s[1];
    var _t = (0, react_2.useState)(""), mockTestTopicId = _t[0], setMockTestTopicId = _t[1];
    var _u = (0, react_2.useState)(""), mockTestNewTopicName = _u[0], setMockTestNewTopicName = _u[1];
    var _v = (0, react_2.useState)(""), mockTestQuestions = _v[0], setMockTestQuestions = _v[1];
    var _w = (0, react_2.useState)(false), creatingMockTest = _w[0], setCreatingMockTest = _w[1];
    // AI test creator state
    var _x = (0, react_2.useState)(""), aiTestQuestions = _x[0], setAiTestQuestions = _x[1];
    var _y = (0, react_2.useState)(false), creatingAITest = _y[0], setCreatingAITest = _y[1];
    // AI bulk questions state - 100 separate sections
    var _z = (0, react_2.useState)(Array(100).fill("")), aiBulkQuestions = _z[0], setAiBulkQuestions = _z[1];
    // PYQ bulk questions state - 100 separate sections
    var _0 = (0, react_2.useState)(Array(100).fill("")), pyqBulkQuestions = _0[0], setPyqBulkQuestions = _0[1];
    // State for Bulk Add & Create PYQ Test
    var _1 = (0, react_2.useState)(false), showBulkPYQDialog = _1[0], setShowBulkPYQDialog = _1[1];
    var _2 = (0, react_2.useState)(""), bulkPYQText = _2[0], setBulkPYQText = _2[1];
    var _3 = (0, react_2.useState)(""), bulkPYQExamName = _3[0], setBulkPYQExamName = _3[1];
    var _4 = (0, react_2.useState)(""), bulkPYQYear = _4[0], setBulkPYQYear = _4[1];
    var _5 = (0, react_2.useState)([]), parsedPYQQuestions = _5[0], setParsedPYQQuestions = _5[1];
    var _6 = (0, react_2.useState)(false), isCreatingPYQTest = _6[0], setIsCreatingPYQTest = _6[1];
    var _7 = (0, react_2.useState)(null), isDeletingQuestion = _7[0], setIsDeletingQuestion = _7[1];
    var questions = (0, react_1.useQuery)(api_1.api.questions.getQuestions, {});
    var unassignedQuestions = (0, react_1.useQuery)(api_1.api.questions.getUnassignedQuestions);
    var topics = (0, react_1.useQuery)(api_1.api.topics.getAllTopics);
    var reviewQuestion = (0, react_1.useMutation)(api_1.api.questions.reviewQuestion);
    var createQuestion = (0, react_1.useMutation)(api_1.api.questions.createQuestion);
    var deleteQuestion = (0, react_1.useMutation)(api_1.api.questions.deleteQuestion);
    var batchCreateQuestions = (0, react_1.useMutation)(api_1.api.questions.batchCreateQuestions);
    var generateUploadUrl = (0, react_1.useMutation)(api_1.api.content.generateUploadUrl);
    var batchCreateQuestionsAction = (0, react_1.useAction)(api_1.api.aiQuestions.batchCreateQuestions);
    var createMockTestWithQuestions = (0, react_1.useMutation)(api_1.api.questions.createMockTestWithQuestions);
    var createAITestWithQuestions = (0, react_1.useMutation)(api_1.api.questions.createAITestWithQuestions);
    var createPYQTestMutation = (0, react_1.useMutation)(api_1.api.questions.createPYQTestWithQuestions);
    var deleteAllQuestionsBySource = (0, react_1.useMutation)(api_1.api.questions.deleteAllQuestionsBySource);
    var autoCreateSets = (0, react_1.useMutation)(api_1.api.questions.autoCreateTestSets);
    var _8 = (0, react_2.useState)(false), isAutoCreating = _8[0], setIsAutoCreating = _8[1];
    var _9 = (0, react_2.useState)(false), showAutoCreateDialog = _9[0], setShowAutoCreateDialog = _9[1];
    var _10 = (0, react_2.useState)("manual"), autoCreateSource = _10[0], setAutoCreateSource = _10[1];
    var autoGenerateMistralQuestions = (0, react_1.useAction)(api_1.api.aiQuestions.autoGenerateMistralQuestions);
    // Manual question form state
    var _11 = (0, react_2.useState)({
        type: "mcq",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        explanation: "",
        difficulty: "medium",
        topic: "",
        subject: "",
        examName: "",
    }), manualQuestion = _11[0], setManualQuestion = _11[1];
    // Bulk manual entry state - 100 separate sections
    var _12 = (0, react_2.useState)(Array(100).fill("")), bulkQuestions = _12[0], setBulkQuestions = _12[1];
    var _13 = (0, react_2.useState)(false), savingQuestions = _13[0], setSavingQuestions = _13[1];
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <lucide_react_1.Loader2 className="h-8 w-8 animate-spin"/>
      </div>);
    }
    if (!isAuthenticated || (user === null || user === void 0 ? void 0 : user.role) !== "admin") {
        return <react_router_1.Navigate to="/auth"/>;
    }
    var handleReview = function (id, status) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, reviewQuestion({ id: id, status: status })];
                case 1:
                    _a.sent();
                    sonner_1.toast.success("Question ".concat(status, "!"));
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    sonner_1.toast.error("Failed to review question");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleManualSubmit = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, createQuestion(__assign(__assign({}, manualQuestion), { topic: manualQuestion.topic || "General", sectionId: undefined, options: manualQuestion.type === "mcq" ? manualQuestion.options : undefined, source: "manual", examName: manualQuestion.examName || undefined, subject: manualQuestion.subject || undefined }))];
                case 1:
                    _a.sent();
                    sonner_1.toast.success("Question created successfully!");
                    setShowManualForm(false);
                    setManualQuestion({
                        type: "mcq",
                        question: "",
                        options: ["", "", "", ""],
                        correctAnswer: "",
                        explanation: "",
                        difficulty: "medium",
                        topic: "",
                        subject: "",
                        examName: "",
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    sonner_1.toast.error("Failed to create question");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleCreateAITest = function () { return __awaiter(_this, void 0, void 0, function () {
        var questionBlocks, parsedQuestions, errors, _loop_1, index, autoTestName, result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    setCreatingAITest(true);
                    if (!aiTestQuestions.trim()) {
                        sonner_1.toast.error("Please paste AI questions");
                        setCreatingAITest(false);
                        return [2 /*return*/];
                    }
                    questionBlocks = aiTestQuestions.split(/\n\s*\n/).filter(function (block) { return block.trim(); });
                    if (questionBlocks.length === 0) {
                        sonner_1.toast.error("No questions found. Please paste questions in the correct format.");
                        setCreatingAITest(false);
                        return [2 /*return*/];
                    }
                    if (questionBlocks.length > 100) {
                        sonner_1.toast.error("Cannot add more than 100 questions at once");
                        setCreatingAITest(false);
                        return [2 /*return*/];
                    }
                    sonner_1.toast.info("Parsing ".concat(questionBlocks.length, " AI questions..."));
                    parsedQuestions = [];
                    errors = [];
                    _loop_1 = function (index) {
                        var block = questionBlocks[index];
                        try {
                            var lines = block.split('\n').map(function (line) { return line.trim(); }).filter(function (line) { return line; });
                            var question_1 = {
                                type: "mcq",
                                difficulty: "medium",
                            };
                            lines.forEach(function (line) {
                                var colonIndex = line.indexOf(':');
                                if (colonIndex === -1)
                                    return;
                                var key = line.substring(0, colonIndex).trim().toLowerCase();
                                var value = line.substring(colonIndex + 1).trim();
                                if (!value)
                                    return;
                                switch (key) {
                                    case 'q':
                                    case 'question':
                                        question_1.question = value;
                                        break;
                                    case 'a':
                                    case 'answer':
                                    case 'correct answer':
                                        question_1.correctAnswer = value;
                                        break;
                                    case 'options':
                                    case 'option':
                                        question_1.options = value.split('|').map(function (opt) { return opt.trim(); }).filter(function (opt) { return opt; });
                                        break;
                                    case 'subject':
                                        question_1.subject = value;
                                        break;
                                    case 'difficulty':
                                        var diff = value.toLowerCase();
                                        question_1.difficulty = ['easy', 'medium', 'hard'].includes(diff) ? diff : 'medium';
                                        break;
                                    case 'type':
                                        var typeStr = value.toLowerCase().replace(/[^a-z]/g, '');
                                        if (typeStr === 'truefalse' || typeStr === 'tf') {
                                            question_1.type = 'true_false';
                                        }
                                        else if (typeStr === 'shortanswer' || typeStr === 'sa') {
                                            question_1.type = 'short_answer';
                                        }
                                        else {
                                            question_1.type = 'mcq';
                                        }
                                        break;
                                    case 'explanation':
                                        question_1.explanation = value;
                                        break;
                                }
                            });
                            // Validate required fields
                            if (!question_1.question || question_1.question.trim() === '') {
                                throw new Error("Missing question text");
                            }
                            if (!question_1.correctAnswer || question_1.correctAnswer.trim() === '') {
                                throw new Error("Missing correct answer");
                            }
                            if (!question_1.subject) {
                                question_1.subject = "General";
                            }
                            if (question_1.type === 'mcq' && (!question_1.options || question_1.options.length < 2)) {
                                throw new Error("MCQ must have at least 2 options");
                            }
                            parsedQuestions.push(question_1);
                        }
                        catch (error) {
                            var errorMsg = "Question ".concat(index + 1, ": ").concat(error instanceof Error ? error.message : 'Invalid format');
                            errors.push(errorMsg);
                        }
                    };
                    for (index = 0; index < questionBlocks.length; index++) {
                        _loop_1(index);
                    }
                    if (parsedQuestions.length === 0) {
                        sonner_1.toast.error("No valid questions found. Please check your format.");
                        if (errors.length > 0) {
                            sonner_1.toast.error("First error: ".concat(errors[0]));
                        }
                        setCreatingAITest(false);
                        return [2 /*return*/];
                    }
                    sonner_1.toast.info("Creating AI test with ".concat(parsedQuestions.length, " questions..."));
                    autoTestName = "AI Test ".concat(new Date().toLocaleDateString('en-GB').replace(/\//g, '-'), " ").concat(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
                    return [4 /*yield*/, createAITestWithQuestions({
                            testSetName: autoTestName,
                            topicId: undefined,
                            newTopicName: "General AI Questions",
                            questions: parsedQuestions,
                        })];
                case 1:
                    result = _a.sent();
                    if (errors.length > 0) {
                        sonner_1.toast.warning("AI test created with ".concat(result.questionCount, " questions. ").concat(errors.length, " questions had parsing errors."));
                    }
                    else {
                        sonner_1.toast.success("AI test created successfully with ".concat(result.questionCount, " questions!"));
                    }
                    // Reset form
                    setShowAITestCreator(false);
                    setAiTestQuestions("");
                    setCreatingAITest(false);
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    sonner_1.toast.error(error_3 instanceof Error ? error_3.message : "Failed to create AI test. Please try again.");
                    console.error("AI test creation error:", error_3);
                    setCreatingAITest(false);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleCreateMockTest = function () { return __awaiter(_this, void 0, void 0, function () {
        var questionBlocks, parsedQuestions, errors, _loop_2, index, autoTestName, result, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    setCreatingMockTest(true);
                    if (!mockTestQuestions.trim()) {
                        sonner_1.toast.error("Please paste questions");
                        setCreatingMockTest(false);
                        return [2 /*return*/];
                    }
                    questionBlocks = mockTestQuestions.split(/\n\s*\n/).filter(function (block) { return block.trim(); });
                    if (questionBlocks.length === 0) {
                        sonner_1.toast.error("No questions found. Please paste questions in the correct format.");
                        setCreatingMockTest(false);
                        return [2 /*return*/];
                    }
                    if (questionBlocks.length > 100) {
                        sonner_1.toast.error("Cannot add more than 100 questions at once");
                        setCreatingMockTest(false);
                        return [2 /*return*/];
                    }
                    sonner_1.toast.info("Parsing ".concat(questionBlocks.length, " questions..."));
                    parsedQuestions = [];
                    errors = [];
                    _loop_2 = function (index) {
                        var block = questionBlocks[index];
                        try {
                            var lines = block.split('\n').map(function (line) { return line.trim(); }).filter(function (line) { return line; });
                            var question_2 = {
                                type: "mcq",
                                difficulty: "medium",
                            };
                            lines.forEach(function (line) {
                                var colonIndex = line.indexOf(':');
                                if (colonIndex === -1)
                                    return;
                                var key = line.substring(0, colonIndex).trim().toLowerCase();
                                var value = line.substring(colonIndex + 1).trim();
                                if (!value)
                                    return;
                                switch (key) {
                                    case 'q':
                                    case 'question':
                                        question_2.question = value;
                                        break;
                                    case 'a':
                                    case 'answer':
                                    case 'correct answer':
                                        question_2.correctAnswer = value;
                                        break;
                                    case 'options':
                                    case 'option':
                                        question_2.options = value.split('|').map(function (opt) { return opt.trim(); }).filter(function (opt) { return opt; });
                                        break;
                                    case 'subject':
                                        question_2.subject = value;
                                        break;
                                    case 'difficulty':
                                        var diff = value.toLowerCase();
                                        question_2.difficulty = ['easy', 'medium', 'hard'].includes(diff) ? diff : 'medium';
                                        break;
                                    case 'type':
                                        var typeStr = value.toLowerCase().replace(/[^a-z]/g, '');
                                        if (typeStr === 'truefalse' || typeStr === 'tf') {
                                            question_2.type = 'true_false';
                                        }
                                        else if (typeStr === 'shortanswer' || typeStr === 'sa') {
                                            question_2.type = 'short_answer';
                                        }
                                        else {
                                            question_2.type = 'mcq';
                                        }
                                        break;
                                    case 'explanation':
                                        question_2.explanation = value;
                                        break;
                                }
                            });
                            // Validate required fields
                            if (!question_2.question || question_2.question.trim() === '') {
                                throw new Error("Missing question text");
                            }
                            if (!question_2.correctAnswer || question_2.correctAnswer.trim() === '') {
                                throw new Error("Missing correct answer");
                            }
                            if (!question_2.subject) {
                                question_2.subject = "General";
                            }
                            if (question_2.type === 'mcq' && (!question_2.options || question_2.options.length < 2)) {
                                throw new Error("MCQ must have at least 2 options");
                            }
                            parsedQuestions.push(question_2);
                        }
                        catch (error) {
                            var errorMsg = "Question ".concat(index + 1, ": ").concat(error instanceof Error ? error.message : 'Invalid format');
                            errors.push(errorMsg);
                        }
                    };
                    for (index = 0; index < questionBlocks.length; index++) {
                        _loop_2(index);
                    }
                    if (parsedQuestions.length === 0) {
                        sonner_1.toast.error("No valid questions found. Please check your format.");
                        if (errors.length > 0) {
                            sonner_1.toast.error("First error: ".concat(errors[0]));
                        }
                        setCreatingMockTest(false);
                        return [2 /*return*/];
                    }
                    sonner_1.toast.info("Creating mock test with ".concat(parsedQuestions.length, " questions..."));
                    autoTestName = "Mock Test ".concat(new Date().toLocaleDateString('en-GB').replace(/\//g, '-'), " ").concat(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
                    return [4 /*yield*/, createMockTestWithQuestions({
                            testSetName: autoTestName,
                            topicId: undefined,
                            newTopicName: "General Mock Tests",
                            questions: parsedQuestions,
                        })];
                case 1:
                    result = _a.sent();
                    if (errors.length > 0) {
                        sonner_1.toast.warning("Mock test created with ".concat(result.questionCount, " questions. ").concat(errors.length, " questions had parsing errors."));
                    }
                    else {
                        sonner_1.toast.success("Mock test created successfully with ".concat(result.questionCount, " questions!"));
                    }
                    // Reset form
                    setShowMockTestCreator(false);
                    setMockTestQuestions("");
                    setCreatingMockTest(false);
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    sonner_1.toast.error(error_4 instanceof Error ? error_4.message : "Failed to create mock test. Please try again.");
                    console.error("Mock test creation error:", error_4);
                    setCreatingMockTest(false);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleBulkManualSubmit = function () { return __awaiter(_this, void 0, void 0, function () {
        var questionBlocks, parsedQuestions, errors, _loop_3, index, result, successCount, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    setSavingQuestions(true);
                    questionBlocks = bulkQuestions.filter(function (block) { return block.trim(); });
                    if (questionBlocks.length === 0) {
                        sonner_1.toast.error("No questions found. Please paste questions in the correct format.");
                        setSavingQuestions(false);
                        return [2 /*return*/];
                    }
                    console.log("Processing ".concat(questionBlocks.length, " question blocks..."));
                    sonner_1.toast.info("Processing ".concat(questionBlocks.length, " questions... This may take a moment."));
                    parsedQuestions = [];
                    errors = [];
                    _loop_3 = function (index) {
                        var block = questionBlocks[index];
                        try {
                            var lines = block.split('\n').map(function (line) { return line.trim(); }).filter(function (line) { return line; });
                            var question_3 = {
                                type: "mcq",
                                difficulty: "medium",
                                source: "manual"
                            };
                            lines.forEach(function (line) {
                                var colonIndex = line.indexOf(':');
                                if (colonIndex === -1)
                                    return;
                                var key = line.substring(0, colonIndex).trim().toLowerCase();
                                var value = line.substring(colonIndex + 1).trim();
                                if (!value)
                                    return;
                                switch (key) {
                                    case 'q':
                                    case 'question':
                                        question_3.question = value;
                                        break;
                                    case 'a':
                                    case 'answer':
                                    case 'correct answer':
                                        question_3.correctAnswer = value;
                                        break;
                                    case 'options':
                                    case 'option':
                                        question_3.options = value.split('|').map(function (opt) { return opt.trim(); }).filter(function (opt) { return opt; });
                                        break;
                                    case 'subject':
                                        question_3.subject = value;
                                        break;
                                    case 'topic':
                                        var matchingTopic = topics === null || topics === void 0 ? void 0 : topics.find(function (t) {
                                            return t.name.toLowerCase() === value.toLowerCase();
                                        });
                                        if (matchingTopic) {
                                            question_3.topicId = matchingTopic._id;
                                        }
                                        break;
                                    case 'difficulty':
                                        var diff = value.toLowerCase();
                                        question_3.difficulty = ['easy', 'medium', 'hard'].includes(diff) ? diff : 'medium';
                                        break;
                                    case 'type':
                                        var typeStr = value.toLowerCase().replace(/[^a-z]/g, '');
                                        if (typeStr === 'truefalse' || typeStr === 'tf') {
                                            question_3.type = 'true_false';
                                        }
                                        else if (typeStr === 'shortanswer' || typeStr === 'sa') {
                                            question_3.type = 'short_answer';
                                        }
                                        else {
                                            question_3.type = 'mcq';
                                        }
                                        break;
                                    case 'explanation':
                                        question_3.explanation = value;
                                        break;
                                    case 'exam':
                                    case 'exam name':
                                        question_3.examName = value;
                                        break;
                                }
                            });
                            // Validate required fields
                            if (!question_3.question || question_3.question.trim() === '') {
                                throw new Error("Missing question text. Please ensure the line starts with \"Q:\" or \"Question:\"");
                            }
                            if (!question_3.correctAnswer || question_3.correctAnswer.trim() === '') {
                                throw new Error("Missing correct answer. Please ensure the line starts with \"A:\" or \"Answer:\"");
                            }
                            if (!question_3.subject) {
                                question_3.subject = "General";
                            }
                            // Validate MCQ has options
                            if (question_3.type === 'mcq' && (!question_3.options || question_3.options.length < 2)) {
                                throw new Error("MCQ must have at least 2 options. Please ensure the line starts with \"Options:\" and options are separated by \"|\"");
                            }
                            parsedQuestions.push(question_3);
                            console.log("Successfully parsed question ".concat(index + 1, ":"), question_3.question.substring(0, 50) + '...');
                        }
                        catch (error) {
                            var errorMsg = "Question ".concat(index + 1, ": ").concat(error instanceof Error ? error.message : 'Invalid format');
                            errors.push(errorMsg);
                            console.error(errorMsg);
                            console.error('Failed block content:', block);
                        }
                    };
                    for (index = 0; index < questionBlocks.length; index++) {
                        _loop_3(index);
                    }
                    if (parsedQuestions.length === 0) {
                        sonner_1.toast.error("No valid questions found. Please check your format.");
                        if (errors.length > 0) {
                            console.error("Parsing errors:", errors);
                            sonner_1.toast.error("First error: ".concat(errors[0]));
                        }
                        setSavingQuestions(false);
                        return [2 /*return*/];
                    }
                    console.log("Attempting to save ".concat(parsedQuestions.length, " questions to database..."));
                    sonner_1.toast.info("Saving ".concat(parsedQuestions.length, " questions... Please wait."));
                    return [4 /*yield*/, batchCreateQuestionsAction({ questions: parsedQuestions })];
                case 1:
                    result = _a.sent();
                    successCount = result.filter(function (r) { return r !== null; }).length;
                    console.log("Database save result: ".concat(successCount, "/").concat(parsedQuestions.length, " questions saved"));
                    if (errors.length > 0) {
                        sonner_1.toast.warning("".concat(successCount, " questions added successfully. ").concat(errors.length, " questions had parsing errors."));
                        console.error("Parsing errors:", errors);
                    }
                    else if (successCount < parsedQuestions.length) {
                        sonner_1.toast.warning("".concat(successCount, " questions added successfully. ").concat(parsedQuestions.length - successCount, " questions failed to save."));
                    }
                    else {
                        sonner_1.toast.success("All ".concat(successCount, " questions added successfully!"));
                    }
                    setShowBulkManualForm(false);
                    setBulkQuestions(Array(100).fill(""));
                    setSavingQuestions(false);
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    sonner_1.toast.error(error_5 instanceof Error ? error_5.message : "Failed to add questions. Please try again.");
                    console.error("Bulk add error:", error_5);
                    setSavingQuestions(false);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleAIBulkSubmit = function () { return __awaiter(_this, void 0, void 0, function () {
        var questionBlocks, parsedQuestions, errors, _loop_4, index, result, successCount, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    setSavingQuestions(true);
                    questionBlocks = aiBulkQuestions.filter(function (block) { return block.trim(); });
                    if (questionBlocks.length === 0) {
                        sonner_1.toast.error("No questions found. Please paste questions in the correct format.");
                        setSavingQuestions(false);
                        return [2 /*return*/];
                    }
                    if (questionBlocks.length > 100) {
                        sonner_1.toast.error("Cannot add more than 100 questions at once");
                        setSavingQuestions(false);
                        return [2 /*return*/];
                    }
                    console.log("Processing ".concat(questionBlocks.length, " AI question blocks..."));
                    sonner_1.toast.info("Processing ".concat(questionBlocks.length, " AI questions... This may take a moment."));
                    parsedQuestions = [];
                    errors = [];
                    _loop_4 = function (index) {
                        var block = questionBlocks[index];
                        try {
                            var lines = block.split('\n').map(function (line) { return line.trim(); }).filter(function (line) { return line; });
                            var question_4 = {
                                type: "mcq",
                                difficulty: "medium",
                                source: "ai"
                            };
                            lines.forEach(function (line) {
                                var colonIndex = line.indexOf(':');
                                if (colonIndex === -1)
                                    return;
                                var key = line.substring(0, colonIndex).trim().toLowerCase();
                                var value = line.substring(colonIndex + 1).trim();
                                if (!value)
                                    return;
                                switch (key) {
                                    case 'q':
                                    case 'question':
                                        question_4.question = value;
                                        break;
                                    case 'a':
                                    case 'answer':
                                    case 'correct answer':
                                        question_4.correctAnswer = value;
                                        break;
                                    case 'options':
                                    case 'option':
                                        question_4.options = value.split('|').map(function (opt) { return opt.trim(); }).filter(function (opt) { return opt; });
                                        break;
                                    case 'subject':
                                        question_4.subject = value;
                                        break;
                                    case 'topic':
                                        var matchingTopic = topics === null || topics === void 0 ? void 0 : topics.find(function (t) {
                                            return t.name.toLowerCase() === value.toLowerCase();
                                        });
                                        if (matchingTopic) {
                                            question_4.topicId = matchingTopic._id;
                                        }
                                        break;
                                    case 'difficulty':
                                        var diff = value.toLowerCase();
                                        question_4.difficulty = ['easy', 'medium', 'hard'].includes(diff) ? diff : 'medium';
                                        break;
                                    case 'type':
                                        var typeStr = value.toLowerCase().replace(/[^a-z]/g, '');
                                        if (typeStr === 'truefalse' || typeStr === 'tf') {
                                            question_4.type = 'true_false';
                                        }
                                        else if (typeStr === 'shortanswer' || typeStr === 'sa') {
                                            question_4.type = 'short_answer';
                                        }
                                        else {
                                            question_4.type = 'mcq';
                                        }
                                        break;
                                    case 'explanation':
                                        question_4.explanation = value;
                                        break;
                                }
                            });
                            // Validate required fields
                            if (!question_4.question || question_4.question.trim() === '') {
                                throw new Error("Missing question text. Please ensure the line starts with \"Q:\" or \"Question:\"");
                            }
                            if (!question_4.correctAnswer || question_4.correctAnswer.trim() === '') {
                                throw new Error("Missing correct answer. Please ensure the line starts with \"A:\" or \"Answer:\"");
                            }
                            if (!question_4.subject) {
                                question_4.subject = "General";
                            }
                            // Validate MCQ has options
                            if (question_4.type === 'mcq' && (!question_4.options || question_4.options.length < 2)) {
                                throw new Error("MCQ must have at least 2 options. Please ensure the line starts with \"Options:\" and options are separated by \"|\"");
                            }
                            parsedQuestions.push(question_4);
                            console.log("Successfully parsed AI question ".concat(index + 1, ":"), question_4.question.substring(0, 50) + '...');
                        }
                        catch (error) {
                            var errorMsg = "Question ".concat(index + 1, ": ").concat(error instanceof Error ? error.message : 'Invalid format');
                            errors.push(errorMsg);
                            console.error(errorMsg);
                            console.error('Failed block content:', block);
                        }
                    };
                    for (index = 0; index < questionBlocks.length; index++) {
                        _loop_4(index);
                    }
                    if (parsedQuestions.length === 0) {
                        sonner_1.toast.error("No valid questions found. Please check your format.");
                        if (errors.length > 0) {
                            console.error("Parsing errors:", errors);
                            sonner_1.toast.error("First error: ".concat(errors[0]));
                        }
                        setSavingQuestions(false);
                        return [2 /*return*/];
                    }
                    console.log("Attempting to save ".concat(parsedQuestions.length, " AI questions to database..."));
                    sonner_1.toast.info("Saving ".concat(parsedQuestions.length, " AI questions... Please wait."));
                    return [4 /*yield*/, batchCreateQuestionsAction({ questions: parsedQuestions })];
                case 1:
                    result = _a.sent();
                    successCount = result.filter(function (r) { return r !== null; }).length;
                    console.log("Database save result: ".concat(successCount, "/").concat(parsedQuestions.length, " AI questions saved"));
                    if (errors.length > 0) {
                        sonner_1.toast.warning("".concat(successCount, " AI questions added successfully. ").concat(errors.length, " questions had parsing errors."));
                        console.error("Parsing errors:", errors);
                    }
                    else if (successCount < parsedQuestions.length) {
                        sonner_1.toast.warning("".concat(successCount, " AI questions added successfully. ").concat(parsedQuestions.length - successCount, " questions failed to save."));
                    }
                    else {
                        sonner_1.toast.success("All ".concat(successCount, " AI questions added successfully!"));
                    }
                    setShowAIBulkForm(false);
                    setAiBulkQuestions(Array(100).fill(""));
                    setSavingQuestions(false);
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _a.sent();
                    sonner_1.toast.error(error_6 instanceof Error ? error_6.message : "Failed to add AI questions. Please try again.");
                    console.error("AI bulk add error:", error_6);
                    setSavingQuestions(false);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handlePYQManualSubmit = function () { return __awaiter(_this, void 0, void 0, function () {
        var questionBlocks, parsedQuestions, result, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    // Validate exam name and year first
                    if (!pyqExamName || !pyqExamName.trim()) {
                        sonner_1.toast.error("Please enter an exam name");
                        return [2 /*return*/];
                    }
                    if (!pyqYear || pyqYear < 2000 || pyqYear > new Date().getFullYear()) {
                        sonner_1.toast.error("Please enter a valid year");
                        return [2 /*return*/];
                    }
                    questionBlocks = pyqBulkQuestions.filter(function (block) { return block.trim(); });
                    if (questionBlocks.length === 0) {
                        sonner_1.toast.error("No questions found. Please paste questions in the correct format.");
                        return [2 /*return*/];
                    }
                    if (questionBlocks.length > 100) {
                        sonner_1.toast.error("Cannot add more than 100 questions at once");
                        return [2 /*return*/];
                    }
                    console.log("Processing ".concat(questionBlocks.length, " PYQ questions for ").concat(pyqExamName, " (").concat(pyqYear, ")..."));
                    parsedQuestions = questionBlocks.map(function (block, index) {
                        var lines = block.split('\n').filter(function (line) { return line.trim(); });
                        var question = {
                            type: "mcq",
                            difficulty: "medium",
                            source: "pyq",
                            examName: pyqExamName,
                            year: pyqYear
                        };
                        lines.forEach(function (line) {
                            var trimmedLine = line.trim();
                            var colonIndex = trimmedLine.indexOf(':');
                            if (colonIndex === -1)
                                return;
                            var key = trimmedLine.substring(0, colonIndex).trim().toLowerCase();
                            var value = trimmedLine.substring(colonIndex + 1).trim();
                            if (!value)
                                return;
                            switch (key) {
                                case 'q':
                                case 'question':
                                    question.question = value;
                                    break;
                                case 'a':
                                case 'answer':
                                case 'correct answer':
                                    question.correctAnswer = value;
                                    break;
                                case 'options':
                                case 'option':
                                    question.options = value.split('|').map(function (opt) { return opt.trim(); }).filter(function (opt) { return opt; });
                                    break;
                                case 'subject':
                                    question.subject = value;
                                    break;
                                case 'topic':
                                    var matchingTopic = topics === null || topics === void 0 ? void 0 : topics.find(function (t) {
                                        return t.name.toLowerCase() === value.toLowerCase();
                                    });
                                    if (matchingTopic) {
                                        question.topicId = matchingTopic._id;
                                    }
                                    break;
                                case 'difficulty':
                                    var diff = value.toLowerCase();
                                    question.difficulty = ['easy', 'medium', 'hard'].includes(diff) ? diff : 'medium';
                                    break;
                                case 'type':
                                    var typeStr = value.toLowerCase().replace(/[^a-z]/g, '');
                                    if (typeStr === 'truefalse' || typeStr === 'tf') {
                                        question.type = 'true_false';
                                    }
                                    else if (typeStr === 'shortanswer' || typeStr === 'sa') {
                                        question.type = 'short_answer';
                                    }
                                    else {
                                        question.type = 'mcq';
                                    }
                                    break;
                                case 'explanation':
                                    question.explanation = value;
                                    break;
                            }
                        });
                        // Validate required fields
                        if (!question.question || question.question.trim() === '') {
                            throw new Error("Question ".concat(index + 1, " is missing question text"));
                        }
                        if (!question.correctAnswer || question.correctAnswer.trim() === '') {
                            throw new Error("Question ".concat(index + 1, " is missing correct answer"));
                        }
                        if (!question.subject) {
                            question.subject = "General";
                        }
                        // Validate MCQ has options
                        if (question.type === 'mcq' && (!question.options || question.options.length < 2)) {
                            throw new Error("Question ".concat(index + 1, ": MCQ must have at least 2 options"));
                        }
                        console.log("Successfully parsed PYQ question ".concat(index + 1, ":"), question.question.substring(0, 50) + '...');
                        return question;
                    });
                    console.log("Attempting to save ".concat(parsedQuestions.length, " PYQ questions to database..."));
                    return [4 /*yield*/, batchCreateQuestions({ questions: parsedQuestions })];
                case 1:
                    result = _a.sent();
                    console.log("Database save result:", result);
                    sonner_1.toast.success("".concat(parsedQuestions.length, " PYQ questions added successfully for ").concat(pyqExamName, " (").concat(pyqYear, ")!"));
                    setShowPYQManualForm(false);
                    setPyqBulkQuestions(Array(100).fill(""));
                    setPyqExamName("");
                    setPyqYear(new Date().getFullYear());
                    return [3 /*break*/, 3];
                case 2:
                    error_7 = _a.sent();
                    sonner_1.toast.error(error_7 instanceof Error ? error_7.message : "Failed to parse PYQ questions. Please check your format.");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Handle Bulk PYQ Test Creation
    var handleCreatePYQTest = function () { return __awaiter(_this, void 0, void 0, function () {
        var yearNum, result, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!bulkPYQExamName.trim()) {
                        sonner_1.toast.error("Please enter an exam name");
                        return [2 /*return*/];
                    }
                    yearNum = parseInt(bulkPYQYear);
                    if (!yearNum || yearNum < 1900 || yearNum > 2100) {
                        sonner_1.toast.error("Please enter a valid exam year (e.g., 2024)");
                        return [2 /*return*/];
                    }
                    if (parsedPYQQuestions.length === 0) {
                        sonner_1.toast.error("Please paste questions first");
                        return [2 /*return*/];
                    }
                    setIsCreatingPYQTest(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, createPYQTestMutation({
                            examName: bulkPYQExamName.trim(),
                            year: yearNum,
                            questions: parsedPYQQuestions,
                        })];
                case 2:
                    result = _a.sent();
                    sonner_1.toast.success("PYQ Test created successfully! ".concat(result.totalQuestions, " questions added for ").concat(result.examName, " ").concat(result.year, " (").concat(result.numberOfSets, " sets created)"));
                    // Reset form
                    setBulkPYQText("");
                    setBulkPYQExamName("");
                    setBulkPYQYear("");
                    setParsedPYQQuestions([]);
                    setShowBulkPYQDialog(false);
                    return [3 /*break*/, 5];
                case 3:
                    error_8 = _a.sent();
                    console.error("Error creating PYQ test:", error_8);
                    sonner_1.toast.error(error_8.message || "Failed to create PYQ test");
                    return [3 /*break*/, 5];
                case 4:
                    setIsCreatingPYQTest(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleBulkDelete = function () { return __awaiter(_this, void 0, void 0, function () {
        var result, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setIsDeletingBulk(true);
                    return [4 /*yield*/, deleteAllQuestionsBySource({ source: deleteSourceType })];
                case 1:
                    result = _a.sent();
                    if (result.success) {
                        sonner_1.toast.success("Successfully deleted ".concat(result.deletedCount, " ").concat(deleteSourceType === 'manual' ? 'Mock/Manual' : deleteSourceType.toUpperCase(), " questions!"));
                        setShowBulkDeleteDialog(false);
                    }
                    else {
                        sonner_1.toast.error("Failed to delete questions");
                    }
                    return [3 /*break*/, 4];
                case 2:
                    error_9 = _a.sent();
                    sonner_1.toast.error(error_9 instanceof Error ? error_9.message : "Failed to delete questions");
                    console.error("Bulk delete error:", error_9);
                    return [3 /*break*/, 4];
                case 3:
                    setIsDeletingBulk(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteQuestion = function (id) { return __awaiter(_this, void 0, void 0, function () {
        var error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    setIsDeletingQuestion(id);
                    return [4 /*yield*/, deleteQuestion({ id: id })];
                case 1:
                    _a.sent();
                    sonner_1.toast.success("Question deleted successfully!");
                    setIsDeletingQuestion(null);
                    return [3 /*break*/, 3];
                case 2:
                    error_10 = _a.sent();
                    sonner_1.toast.error("Failed to delete question");
                    setIsDeletingQuestion(null);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleAutoCreateSets = function () { return __awaiter(_this, void 0, void 0, function () {
        var result, error_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsAutoCreating(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, autoCreateSets({
                            source: autoCreateSource,
                        })];
                case 2:
                    result = _a.sent();
                    if (result.success) {
                        sonner_1.toast.success(result.message);
                        setShowAutoCreateDialog(false);
                    }
                    else {
                        sonner_1.toast.error(result.message);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_11 = _a.sent();
                    console.error("Error auto-creating test sets:", error_11);
                    sonner_1.toast.error("Failed to create test sets");
                    return [3 /*break*/, 5];
                case 4:
                    setIsAutoCreating(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleAutoGenerateAI = function () { return __awaiter(_this, void 0, void 0, function () {
        var result, error_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isGeneratingAI)
                        return [2 /*return*/];
                    setIsGeneratingAI(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, autoGenerateMistralQuestions({})];
                case 2:
                    result = _a.sent();
                    if (result.success) {
                        sonner_1.toast.success("\u2705 ".concat(result.saved, " AI Questions Generated & Saved Successfully!"));
                    }
                    else {
                        sonner_1.toast.error("Failed to generate questions: ".concat(result.message));
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_12 = _a.sent();
                    console.error("Error generating AI questions:", error_12);
                    sonner_1.toast.error("Error: ".concat(error_12.message || "Failed to generate AI questions"));
                    return [3 /*break*/, 5];
                case 4:
                    setIsGeneratingAI(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var getStatusBadge = function (status) {
        switch (status) {
            case "pending":
                return <badge_1.Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Pending</badge_1.Badge>;
            case "approved":
                return <badge_1.Badge className="bg-green-500/20 text-green-300 border-green-500/30">Approved</badge_1.Badge>;
            case "rejected":
                return <badge_1.Badge className="bg-red-500/20 text-red-300 border-red-500/30">Rejected</badge_1.Badge>;
            default:
                return null;
        }
    };
    var getSourceBadge = function (source) {
        switch (source) {
            case "manual":
                return <badge_1.Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Manual</badge_1.Badge>;
            case "ai":
                return <badge_1.Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">AI</badge_1.Badge>;
            case "pyq":
                return <badge_1.Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">PYQ</badge_1.Badge>;
            default:
                return <badge_1.Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Unknown</badge_1.Badge>;
        }
    };
    var getDuplicateQuestions = function () {
        if (!questions)
            return new Set();
        var questionTextMap = new Map();
        var duplicateIds = new Set();
        // Count occurrences of each question text
        questions.forEach(function (q) {
            var normalizedText = q.question.toLowerCase().trim();
            questionTextMap.set(normalizedText, (questionTextMap.get(normalizedText) || 0) + 1);
        });
        // Mark questions as duplicates if they appear more than once
        questions.forEach(function (q) {
            var normalizedText = q.question.toLowerCase().trim();
            if (questionTextMap.get(normalizedText) > 1) {
                duplicateIds.add(q._id);
            }
        });
        return duplicateIds;
    };
    var duplicateQuestions = getDuplicateQuestions();
    var getErrorQuestions = function () {
        if (!questions)
            return [];
        return questions.filter(function (question) {
            // Check if question is MCQ type
            if (question.type === 'mcq') {
                // Check if correctAnswer exists and is not empty
                if (!question.correctAnswer || question.correctAnswer.trim() === '') {
                    return true;
                }
                // Check if options exist
                if (!question.options || question.options.length === 0) {
                    return true;
                }
                // Check if correctAnswer matches any option (case-insensitive, trimmed)
                var normalizedCorrectAnswer_1 = question.correctAnswer.trim().toLowerCase();
                var matchFound = question.options.some(function (option) {
                    return option.trim().toLowerCase() === normalizedCorrectAnswer_1;
                });
                // If no match found, it's an error question
                if (!matchFound) {
                    return true;
                }
            }
            return false;
        });
    };
    var errorQuestions = getErrorQuestions();
    return (<div className="min-h-screen p-6 relative">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 z-0"/>
      
      {/* Animated Orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl"/>
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl" style={{ animationDelay: '1s' }}/>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-pink-400/40 rounded-full blur-3xl" style={{ animationDelay: '0.5s' }}/>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-400/40 rounded-full blur-3xl" style={{ animationDelay: '0.7s' }}/>
      </div>

      {/* Lab Background Image */}
      <div className="fixed inset-0 z-0 opacity-10" style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}/>

      <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-6 relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button onClick={function () { return setIsMenuOpen(!isMenuOpen); }} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
              {isMenuOpen ? <lucide_react_1.X className="h-6 w-6"/> : <lucide_react_1.Menu className="h-6 w-6"/>}
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Question Management</h1>
              <p className="text-white/70 mt-1">Create and manage test questions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button_1.Button onClick={function () { return navigate("/admin/questions"); }} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <lucide_react_1.Pencil className="h-4 w-4 mr-2"/>
              Edit
            </button_1.Button>
            <button_1.Button onClick={function () { return navigate("/admin/questions"); }} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <lucide_react_1.Search className="h-4 w-4 mr-2"/>
              Search
            </button_1.Button>
            <button_1.Button onClick={function () { return navigate("/admin/questions"); }} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <lucide_react_1.Filter className="h-4 w-4 mr-2"/>
              Filter
            </button_1.Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <framer_motion_1.AnimatePresence>
          {isMenuOpen && (<framer_motion_1.motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="glass-card border-white/20 backdrop-blur-xl bg-white/10 rounded-lg overflow-hidden">
              <div className="flex flex-col p-4 space-y-2">
                <button onClick={function () { navigate("/admin"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Dashboard</button>
                <button onClick={function () { navigate("/admin/questions"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Questions</button>
                <button onClick={function () { navigate("/admin/content"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Content</button>
                <button onClick={function () { navigate("/admin/study-materials"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Study Materials</button>
                <button onClick={function () { navigate("/admin/analytics"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Analytics</button>
                <button onClick={function () { navigate("/admin/subscriptions"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Subscriptions</button>
                <button onClick={function () { navigate("/admin/coupons"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Coupons</button>
                <button onClick={function () { navigate("/admin/notifications"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Notifications</button>
                <button onClick={function () { navigate("/admin/feedback"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Feedback</button>
              </div>
            </framer_motion_1.motion.div>)}
        </framer_motion_1.AnimatePresence>

        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Question Management</h1>
              <p className="text-white/80">Manage and organize test questions</p>
            </div>
          </div>

          <tabs_1.Tabs defaultValue="all" className="space-y-6">
            <tabs_1.TabsList className="bg-white/10 backdrop-blur-md border border-white/20">
              <tabs_1.TabsTrigger value="all">All Questions</tabs_1.TabsTrigger>
              <tabs_1.TabsTrigger value="add">Add Question</tabs_1.TabsTrigger>
              <tabs_1.TabsTrigger value="bulk">Bulk Operations</tabs_1.TabsTrigger>
              <tabs_1.TabsTrigger value="errors">Error Questions</tabs_1.TabsTrigger>
            </tabs_1.TabsList>

            {/* All Questions Tab */}
            <tabs_1.TabsContent value="all">
              <div className="space-y-6">
                <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <card_1.CardHeader>
                    <card_1.CardTitle className="text-white">Question Statistics</card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                        <card_1.CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">{(questions === null || questions === void 0 ? void 0 : questions.length) || 0}</p>
                            <p className="text-sm text-white/60">Total Questions</p>
                          </div>
                        </card_1.CardContent>
                      </card_1.Card>
                      <card_1.Card className="glass-card border-blue-500/20 backdrop-blur-xl bg-blue-500/10">
                        <card_1.CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-300">{(questions === null || questions === void 0 ? void 0 : questions.filter(function (q) { return q.source === "manual" || !q.source; }).length) || 0}</p>
                            <p className="text-sm text-blue-200">Manual/Mock</p>
                          </div>
                        </card_1.CardContent>
                      </card_1.Card>
                      <card_1.Card className="glass-card border-purple-500/20 backdrop-blur-xl bg-purple-500/10">
                        <card_1.CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-purple-300">{(questions === null || questions === void 0 ? void 0 : questions.filter(function (q) { return q.source === "ai"; }).length) || 0}</p>
                            <p className="text-sm text-purple-200">AI Questions</p>
                          </div>
                        </card_1.CardContent>
                      </card_1.Card>
                      <card_1.Card className="glass-card border-orange-500/20 backdrop-blur-xl bg-orange-500/10">
                        <card_1.CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-orange-300">{(questions === null || questions === void 0 ? void 0 : questions.filter(function (q) { return q.source === "pyq"; }).length) || 0}</p>
                            <p className="text-sm text-orange-200">PYQ</p>
                          </div>
                        </card_1.CardContent>
                      </card_1.Card>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>

                <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <card_1.CardHeader>
                    <card_1.CardTitle className="text-white">Error Questions</card_1.CardTitle>
                    <card_1.CardDescription className="text-white/80">
                      Questions with missing or mismatched answers that need to be fixed or deleted
                    </card_1.CardDescription>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <lucide_react_1.AlertTriangle className="h-6 w-6 text-red-400"/>
                        <h3 className="text-white">Error Questions</h3>
                      </div>
                      <button_1.Button onClick={function () { return setShowErrorQuestions(!showErrorQuestions); }} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        {showErrorQuestions ? 'Hide' : 'Show'} ({errorQuestions.length})
                      </button_1.Button>
                    </div>
                    
                    {showErrorQuestions && (<div className="space-y-4">
                        {errorQuestions.length === 0 ? (<div className="text-center py-8">
                            <lucide_react_1.CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-3"/>
                            <p className="text-white/80">No error questions found! All questions are properly formatted.</p>
                          </div>) : (<div className="space-y-4">
                            {errorQuestions.map(function (question) { return (<div key={question._id} className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-lg p-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <badge_1.Badge variant="destructive">Error</badge_1.Badge>
                                      <badge_1.Badge variant="outline" className="bg-white/10 text-white border-white/20">
                                        {question.type.toUpperCase()}
                                      </badge_1.Badge>
                                      <badge_1.Badge variant="outline" className="bg-white/10 text-white border-white/20">
                                        {question.source || 'manual'}
                                      </badge_1.Badge>
                                    </div>
                                    
                                    <p className="text-white font-medium mb-3">{question.question}</p>
                                    
                                    {question.options && question.options.length > 0 && (<div className="mb-3">
                                        <p className="text-sm font-medium text-white/80 mb-1">Options:</p>
                                        <div className="grid grid-cols-2 gap-2">
                                          {question.options.map(function (option, idx) { return (<div key={idx} className="bg-white/5 rounded px-3 py-2 text-sm text-white/90">
                                              {option}
                                            </div>); })}
                                        </div>
                                      </div>)}
                                    
                                    <div className="bg-red-500/20 rounded px-3 py-2 mb-2">
                                      <p className="text-sm font-medium text-red-300">
                                        Correct Answer: {question.correctAnswer || '(Empty)'}
                                      </p>
                                    </div>
                                    
                                    <div className="text-sm text-yellow-300">
                                      <lucide_react_1.AlertTriangle className="h-4 w-4 inline mr-1"/>
                                      Issue: {!question.correctAnswer || question.correctAnswer.trim() === ''
                        ? 'Correct answer is missing or empty'
                        : !question.options || question.options.length === 0
                            ? 'Options are missing'
                            : 'Correct answer does not match any option'}
                                    </div>
                                  </div>
                                  
                                  <button_1.Button onClick={function () { return handleDeleteQuestion(question._id); }} variant="destructive" size="sm" disabled={isDeletingQuestion === question._id} className="shrink-0">
                                    {isDeletingQuestion === question._id ? (<>
                                        <lucide_react_1.Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                                        Deleting...
                                      </>) : (<>
                                        <lucide_react_1.Trash2 className="h-4 w-4 mr-2"/>
                                        Delete
                                      </>)}
                                  </button_1.Button>
                                </div>
                              </div>); })}
                          </div>)}
                      </div>)}
                  </card_1.CardContent>
                </card_1.Card>

                <tabs_1.Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <tabs_1.TabsList className="glass-card border-white/20 backdrop-blur-xl bg-white/10 flex-wrap">
                    <tabs_1.TabsTrigger value="all" className="data-[state=active]:bg-white/20">
                      All Questions
                    </tabs_1.TabsTrigger>
                    <tabs_1.TabsTrigger value="manual" className="data-[state=active]:bg-white/20">
                      <lucide_react_1.FileText className="h-4 w-4 mr-2"/>
                      Manual/Mock
                    </tabs_1.TabsTrigger>
                    <tabs_1.TabsTrigger value="ai" className="data-[state=active]:bg-white/20">
                      <lucide_react_1.Sparkles className="h-4 w-4 mr-2"/>
                      AI Questions
                    </tabs_1.TabsTrigger>
                    <tabs_1.TabsTrigger value="pyq" className="data-[state=active]:bg-white/20">
                      <lucide_react_1.Upload className="h-4 w-4 mr-2"/>
                      PYQ
                    </tabs_1.TabsTrigger>
                    <tabs_1.TabsTrigger value="duplicates" className="data-[state=active]:bg-white/20">
                      <lucide_react_1.XCircle className="h-4 w-4 mr-2"/>
                      Duplicates Only
                    </tabs_1.TabsTrigger>
                  </tabs_1.TabsList>

                  <tabs_1.TabsContent value={activeTab} className="space-y-4 mt-6">
                    {!questions || questions.length === 0 ? (<card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                        <card_1.CardContent className="py-12 text-center">
                          <p className="text-white/60">No questions found</p>
                        </card_1.CardContent>
                      </card_1.Card>) : (questions
            .filter(function (q) {
            // Filter by active tab
            if (activeTab === "manual")
                return q.source === "manual" || !q.source;
            if (activeTab === "ai")
                return q.source === "ai";
            if (activeTab === "pyq")
                return q.source === "pyq";
            if (activeTab === "duplicates")
                return duplicateQuestions.has(q._id);
            if (activeTab === "approved")
                return q.status === "approved";
            return true; // "all" tab shows everything
        })
            .map(function (question, index) {
            var isDuplicate = duplicateQuestions.has(question._id);
            return (<framer_motion_1.motion.div key={question._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                            <card_1.Card className={"glass-card backdrop-blur-xl ".concat(isDuplicate
                    ? 'border-red-500/50 bg-red-500/10'
                    : 'border-white/20 bg-white/10')}>
                              <card_1.CardHeader>
                                <div className="flex items-start justify-between">
                                  <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <card_1.CardTitle className="text-white text-lg">{question.question}</card_1.CardTitle>
                                      {isDuplicate && (<badge_1.Badge className="bg-red-500/30 text-red-200 border-red-500/50">
                                          Duplicate
                                        </badge_1.Badge>)}
                                      {getStatusBadge(question.status)}
                                      {getSourceBadge(question.source)}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-white/60 flex-wrap">
                                      <span>{question.type.replace("_", " ").toUpperCase()}</span>
                                      <span>•</span>
                                      <span>{question.topic}</span>
                                      {question.difficulty && (<>
                                          <span>•</span>
                                          <span className="capitalize">{question.difficulty}</span>
                                        </>)}
                                      {question.examYear && (<>
                                          <span>•</span>
                                          <span>Year: {question.examYear}</span>
                                        </>)}
                                    </div>
                                  </div>
                                  <button_1.Button onClick={function () { return __awaiter(_this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, deleteQuestion({ id: question._id })];
                            case 1:
                                _b.sent();
                                sonner_1.toast.success("Question deleted");
                                return [3 /*break*/, 3];
                            case 2:
                                _a = _b.sent();
                                sonner_1.toast.error("Failed to delete");
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); }} variant="ghost" size="icon" className={"".concat(isDuplicate
                    ? 'text-red-200 hover:bg-red-500/30'
                    : 'text-red-300 hover:bg-red-500/20')}>
                                    <lucide_react_1.Trash2 className="h-4 w-4"/>
                                  </button_1.Button>
                                </div>
                              </card_1.CardHeader>
                              <card_1.CardContent className="space-y-4">
                                {question.options && question.options.length > 0 && (<div className="space-y-2">
                                    <p className="text-sm font-medium text-white/80">Options:</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                      {question.options.map(function (option, idx) { return (<div key={idx} className={"p-2 rounded-lg border ".concat(option === question.correctAnswer
                            ? "bg-green-500/10 border-green-500/30 text-green-300"
                            : "bg-white/5 border-white/10 text-white/80")}>
                                          {option}
                                        </div>); })}
                                    </div>
                                  </div>)}
                                <div>
                                  <p className="text-sm font-medium text-white/80">Correct Answer:</p>
                                  <p className="text-white mt-1">{question.correctAnswer}</p>
                                </div>
                                {question.explanation && (<div>
                                    <p className="text-sm font-medium text-white/80">Explanation:</p>
                                    <p className="text-white/60 mt-1">{question.explanation}</p>
                                  </div>)}
                                {question.status === "pending" && (<div className="flex gap-2 pt-4">
                                    <button_1.Button onClick={function () { return handleReview(question._id, "approved"); }} className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30">
                                      <lucide_react_1.CheckCircle className="h-4 w-4 mr-2"/>
                                      Approve
                                    </button_1.Button>
                                    <button_1.Button onClick={function () { return handleReview(question._id, "rejected"); }} className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30">
                                      <lucide_react_1.XCircle className="h-4 w-4 mr-2"/>
                                      Reject
                                    </button_1.Button>
                                  </div>)}
                              </card_1.CardContent>
                            </card_1.Card>
                          </framer_motion_1.motion.div>);
        }))}
                  </tabs_1.TabsContent>
                </tabs_1.Tabs>
              </div>
            </tabs_1.TabsContent>

            {/* Add Question Tab */}
            <tabs_1.TabsContent value="add">
              <div className="space-y-6">
                <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <card_1.CardHeader>
                    <card_1.CardTitle className="text-white">Add Single Question</card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label_1.Label className="text-white">Subject</label_1.Label>
                        <input_1.Input value={manualQuestion.subject} onChange={function (e) { return setManualQuestion(__assign(__assign({}, manualQuestion), { subject: e.target.value })); }} className="bg-white/5 border-white/10 text-white" placeholder="e.g., Hematology, Microbiology"/>
                      </div>
                      
                      <div>
                        <label_1.Label className="text-white">Exam Name (Optional)</label_1.Label>
                        <input_1.Input value={manualQuestion.examName} onChange={function (e) { return setManualQuestion(__assign(__assign({}, manualQuestion), { examName: e.target.value })); }} className="bg-white/5 border-white/10 text-white" placeholder="e.g., RRB Section Officer"/>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label_1.Label className="text-white">Question Type</label_1.Label>
                        <select_1.Select value={manualQuestion.type} onValueChange={function (v) { return setManualQuestion(__assign(__assign({}, manualQuestion), { type: v })); }}>
                          <select_1.SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <select_1.SelectValue />
                          </select_1.SelectTrigger>
                          <select_1.SelectContent>
                            <select_1.SelectItem value="mcq">MCQ</select_1.SelectItem>
                            <select_1.SelectItem value="true_false">True/False</select_1.SelectItem>
                            <select_1.SelectItem value="short_answer">Short Answer</select_1.SelectItem>
                          </select_1.SelectContent>
                        </select_1.Select>
                      </div>
                      
                      <div>
                        <label_1.Label className="text-white">Difficulty</label_1.Label>
                        <select_1.Select value={manualQuestion.difficulty} onValueChange={function (v) { return setManualQuestion(__assign(__assign({}, manualQuestion), { difficulty: v })); }}>
                          <select_1.SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <select_1.SelectValue />
                          </select_1.SelectTrigger>
                          <select_1.SelectContent>
                            <select_1.SelectItem value="easy">Easy</select_1.SelectItem>
                            <select_1.SelectItem value="medium">Medium</select_1.SelectItem>
                            <select_1.SelectItem value="hard">Hard</select_1.SelectItem>
                          </select_1.SelectContent>
                        </select_1.Select>
                      </div>
                    </div>
                    
                    <div>
                      <label_1.Label className="text-white">Question Text</label_1.Label>
                      <textarea_1.Textarea value={manualQuestion.question} onChange={function (e) { return setManualQuestion(__assign(__assign({}, manualQuestion), { question: e.target.value })); }} className="bg-white/5 border-white/10 text-white" rows={3}/>
                    </div>

                    {manualQuestion.type === "mcq" && (<div>
                        <label_1.Label className="text-white">Options</label_1.Label>
                        {manualQuestion.options.map(function (opt, idx) { return (<input_1.Input key={idx} value={opt} onChange={function (e) {
                    var newOpts = __spreadArray([], manualQuestion.options, true);
                    newOpts[idx] = e.target.value;
                    setManualQuestion(__assign(__assign({}, manualQuestion), { options: newOpts }));
                }} className="bg-white/5 border-white/10 text-white mt-2" placeholder={"Option ".concat(idx + 1)}/>); })}
                      </div>)}

                    <div>
                      <label_1.Label className="text-white">Correct Answer</label_1.Label>
                      <input_1.Input value={manualQuestion.correctAnswer} onChange={function (e) { return setManualQuestion(__assign(__assign({}, manualQuestion), { correctAnswer: e.target.value })); }} className="bg-white/5 border-white/10 text-white"/>
                    </div>

                    <div>
                      <label_1.Label className="text-white">Explanation (Optional)</label_1.Label>
                      <textarea_1.Textarea value={manualQuestion.explanation} onChange={function (e) { return setManualQuestion(__assign(__assign({}, manualQuestion), { explanation: e.target.value })); }} className="bg-white/5 border-white/10 text-white" rows={2}/>
                    </div>

                    <div>
                      <label_1.Label className="text-white">Topic</label_1.Label>
                      <select_1.Select value={manualQuestion.topic} onValueChange={function (v) { return setManualQuestion(__assign(__assign({}, manualQuestion), { topic: v })); }}>
                        <select_1.SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <select_1.SelectValue placeholder="Select topic"/>
                        </select_1.SelectTrigger>
                        <select_1.SelectContent>
                          {topics === null || topics === void 0 ? void 0 : topics.map(function (topic) { return (<select_1.SelectItem key={topic._id} value={topic._id}>
                              {topic.name}
                            </select_1.SelectItem>); })}
                        </select_1.SelectContent>
                      </select_1.Select>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <button_1.Button onClick={handleManualSubmit} className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30">
                        Save Question
                      </button_1.Button>
                      <button_1.Button onClick={function () { return setShowManualForm(false); }} variant="outline" className="flex-1">
                        Cancel
                      </button_1.Button>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>

                <dialog_1.Dialog open={showManualForm} onOpenChange={setShowManualForm}>
                  <dialog_1.DialogTrigger asChild>
                    <button_1.Button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30">
                      <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
                      Add Single Question
                    </button_1.Button>
                  </dialog_1.DialogTrigger>
                  <dialog_1.DialogContent className="glass-card border-white/20 backdrop-blur-xl bg-white/10 max-w-2xl max-h-[80vh] overflow-y-auto">
                    <dialog_1.DialogHeader>
                      <dialog_1.DialogTitle className="text-white">Add Question Manually</dialog_1.DialogTitle>
                    </dialog_1.DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label_1.Label className="text-white">Subject</label_1.Label>
                        <input_1.Input value={manualQuestion.subject} onChange={function (e) { return setManualQuestion(__assign(__assign({}, manualQuestion), { subject: e.target.value })); }} className="bg-white/5 border-white/10 text-white" placeholder="e.g., Hematology, Microbiology"/>
                      </div>

                      <div>
                        <label_1.Label className="text-white">Exam Name (Optional)</label_1.Label>
                        <input_1.Input value={manualQuestion.examName} onChange={function (e) { return setManualQuestion(__assign(__assign({}, manualQuestion), { examName: e.target.value })); }} className="bg-white/5 border-white/10 text-white" placeholder="e.g., RRB Section Officer"/>
                      </div>
                      
                      <div>
                        <label_1.Label className="text-white">Question Type</label_1.Label>
                        <select_1.Select value={manualQuestion.type} onValueChange={function (v) { return setManualQuestion(__assign(__assign({}, manualQuestion), { type: v })); }}>
                          <select_1.SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <select_1.SelectValue />
                          </select_1.SelectTrigger>
                          <select_1.SelectContent>
                            <select_1.SelectItem value="mcq">MCQ</select_1.SelectItem>
                            <select_1.SelectItem value="true_false">True/False</select_1.SelectItem>
                            <select_1.SelectItem value="short_answer">Short Answer</select_1.SelectItem>
                          </select_1.SelectContent>
                        </select_1.Select>
                      </div>
                      
                      <div>
                        <label_1.Label className="text-white">Question Text</label_1.Label>
                        <textarea_1.Textarea value={manualQuestion.question} onChange={function (e) { return setManualQuestion(__assign(__assign({}, manualQuestion), { question: e.target.value })); }} className="bg-white/5 border-white/10 text-white" rows={3}/>
                      </div>

                      {manualQuestion.type === "mcq" && (<div>
                          <label_1.Label className="text-white">Options</label_1.Label>
                          {manualQuestion.options.map(function (opt, idx) { return (<input_1.Input key={idx} value={opt} onChange={function (e) {
                    var newOpts = __spreadArray([], manualQuestion.options, true);
                    newOpts[idx] = e.target.value;
                    setManualQuestion(__assign(__assign({}, manualQuestion), { options: newOpts }));
                }} className="bg-white/5 border-white/10 text-white mt-2" placeholder={"Option ".concat(idx + 1)}/>); })}
                        </div>)}

                      <div>
                        <label_1.Label className="text-white">Correct Answer</label_1.Label>
                        <input_1.Input value={manualQuestion.correctAnswer} onChange={function (e) { return setManualQuestion(__assign(__assign({}, manualQuestion), { correctAnswer: e.target.value })); }} className="bg-white/5 border-white/10 text-white"/>
                      </div>

                      <div>
                        <label_1.Label className="text-white">Explanation (Optional)</label_1.Label>
                        <textarea_1.Textarea value={manualQuestion.explanation} onChange={function (e) { return setManualQuestion(__assign(__assign({}, manualQuestion), { explanation: e.target.value })); }} className="bg-white/5 border-white/10 text-white" rows={2}/>
                      </div>

                      <div>
                        <label_1.Label className="text-white">Topic</label_1.Label>
                        <select_1.Select value={manualQuestion.topic} onValueChange={function (v) { return setManualQuestion(__assign(__assign({}, manualQuestion), { topic: v })); }}>
                          <select_1.SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <select_1.SelectValue placeholder="Select topic"/>
                          </select_1.SelectTrigger>
                          <select_1.SelectContent>
                            {topics === null || topics === void 0 ? void 0 : topics.map(function (topic) { return (<select_1.SelectItem key={topic._id} value={topic._id}>
                                {topic.name}
                              </select_1.SelectItem>); })}
                          </select_1.SelectContent>
                        </select_1.Select>
                      </div>

                      <div>
                        <label_1.Label className="text-white">Difficulty</label_1.Label>
                        <select_1.Select value={manualQuestion.difficulty} onValueChange={function (v) { return setManualQuestion(__assign(__assign({}, manualQuestion), { difficulty: v })); }}>
                          <select_1.SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <select_1.SelectValue />
                          </select_1.SelectTrigger>
                          <select_1.SelectContent>
                            <select_1.SelectItem value="easy">Easy</select_1.SelectItem>
                            <select_1.SelectItem value="medium">Medium</select_1.SelectItem>
                            <select_1.SelectItem value="hard">Hard</select_1.SelectItem>
                          </select_1.SelectContent>
                        </select_1.Select>
                      </div>

                      <div className="flex gap-2">
                        <button_1.Button onClick={handleManualSubmit} className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30">
                          Save Question
                        </button_1.Button>
                        <button_1.Button onClick={function () { return setShowManualForm(false); }} variant="outline" className="flex-1">
                          Cancel
                        </button_1.Button>
                      </div>
                    </div>
                  </dialog_1.DialogContent>
                </dialog_1.Dialog>
              </div>
            </tabs_1.TabsContent>

            {/* Bulk Operations Tab */}
            <tabs_1.TabsContent value="bulk">
              <div className="space-y-6">
                <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <card_1.CardHeader>
                    <card_1.CardTitle className="text-white">Bulk Add Manual Questions (Up to 100)</card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <div className="space-y-4">
                      <div>
                        <label_1.Label className="text-white">Paste Questions in Plain Text (100 Separate Sections)</label_1.Label>
                        <p className="text-white/60 text-sm mb-2">
                          Format each question like this:
                        </p>
                        <div className="bg-white/5 border border-white/10 rounded p-3 mb-4 text-xs text-white/70 font-mono">
                          Q: What is EDTA?<br />
                          A: Anticoagulant<br />
                          Options: Anticoagulant | Stain | Buffer | Enzyme<br />
                          Subject: Hematology<br />
                          Topic: Anticoagulants<br />
                          Difficulty: Easy<br />
                          Type: MCQ<br />
                          Explanation: EDTA is used to prevent blood clotting
                        </div>
                      </div>
                      
                      {bulkQuestions.map(function (question, index) { return (<div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label_1.Label className="text-white font-semibold">Question {index + 1}</label_1.Label>
                            {question.trim() && (<button_1.Button type="button" variant="ghost" size="sm" onClick={function () {
                    var newQuestions = __spreadArray([], bulkQuestions, true);
                    newQuestions[index] = "";
                    setBulkQuestions(newQuestions);
                }} className="text-red-300 hover:text-red-200 hover:bg-red-500/20">
                                <lucide_react_1.Trash2 className="h-4 w-4 mr-1"/>
                                Clear
                              </button_1.Button>)}
                          </div>
                          <textarea_1.Textarea value={question} onChange={function (e) {
                var newQuestions = __spreadArray([], bulkQuestions, true);
                newQuestions[index] = e.target.value;
                setBulkQuestions(newQuestions);
            }} className="bg-white/5 border-white/10 text-white font-mono text-sm" rows={8} placeholder={"Q: Question text here?&#10;A: Answer here&#10;Options: Option1 | Option2 | Option3 | Option4&#10;Subject: Subject name&#10;Topic: Topic name&#10;Difficulty: Easy&#10;Type: MCQ"}/>
                        </div>); })}
                      <div className="flex gap-2">
                        <button_1.Button onClick={handleBulkManualSubmit} className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30">
                          Add All Questions
                        </button_1.Button>
                        <button_1.Button onClick={function () { return setShowBulkManualForm(false); }} variant="outline" className="flex-1">
                          Cancel
                        </button_1.Button>
                      </div>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>

                <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <card_1.CardHeader>
                    <card_1.CardTitle className="text-white">Bulk Add AI Questions (Up to 100)</card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <div className="space-y-4">
                      <div>
                        <label_1.Label className="text-white">Paste AI Questions in Plain Text (100 Separate Sections)</label_1.Label>
                        <p className="text-white/60 text-sm mb-2">
                          Format each question like this:
                        </p>
                        <div className="bg-white/5 border border-white/10 rounded p-3 mb-4 text-xs text-white/70 font-mono">
                          Q: What is EDTA?<br />
                          A: Anticoagulant<br />
                          Options: Anticoagulant | Stain | Buffer | Enzyme<br />
                          Subject: Hematology<br />
                          Topic: Anticoagulants<br />
                          Difficulty: Easy<br />
                          Type: MCQ<br />
                          Explanation: EDTA is used to prevent blood clotting
                        </div>
                      </div>
                      
                      {aiBulkQuestions.map(function (question, index) { return (<div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label_1.Label className="text-white font-semibold">AI Question {index + 1}</label_1.Label>
                            {question.trim() && (<button_1.Button type="button" variant="ghost" size="sm" onClick={function () {
                    var newQuestions = __spreadArray([], aiBulkQuestions, true);
                    newQuestions[index] = "";
                    setAiBulkQuestions(newQuestions);
                }} className="text-red-300 hover:text-red-200 hover:bg-red-500/20">
                                <lucide_react_1.Trash2 className="h-4 w-4 mr-1"/>
                                Clear
                              </button_1.Button>)}
                          </div>
                          <textarea_1.Textarea value={question} onChange={function (e) {
                var newQuestions = __spreadArray([], aiBulkQuestions, true);
                newQuestions[index] = e.target.value;
                setAiBulkQuestions(newQuestions);
            }} className="bg-white/5 border-white/10 text-white font-mono text-sm" rows={8} placeholder={"Q: Question text here?&#10;A: Answer here&#10;Options: Option1 | Option2 | Option3 | Option4&#10;Subject: Subject name&#10;Topic: Topic name&#10;Difficulty: Easy&#10;Type: MCQ"}/>
                        </div>); })}
                      <div className="flex gap-2">
                        <button_1.Button onClick={handleAIBulkSubmit} className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30">
                          Add All AI Questions
                        </button_1.Button>
                        <button_1.Button onClick={function () { return setShowAIBulkForm(false); }} variant="outline" className="flex-1">
                          Cancel
                        </button_1.Button>
                      </div>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>

                <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <card_1.CardHeader>
                    <card_1.CardTitle className="text-white">Add PYQ Questions</card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <div className="space-y-4">
                      <div>
                        <label_1.Label className="text-white">Exam Name</label_1.Label>
                        <input_1.Input value={pyqExamName} onChange={function (e) { return setPyqExamName(e.target.value); }} className="bg-white/5 border-white/10 text-white" placeholder="e.g., RRB Section Officer, AIIMS MLT"/>
                      </div>
                      <div>
                        <label_1.Label className="text-white">Year</label_1.Label>
                        <input_1.Input type="number" value={pyqYear} onChange={function (e) { return setPyqYear(parseInt(e.target.value)); }} className="bg-white/5 border-white/10 text-white" min={2000} max={new Date().getFullYear()}/>
                      </div>
                      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                        <div>
                          <label_1.Label className="text-white">Paste PYQ Questions in Plain Text (100 Separate Sections)</label_1.Label>
                          <p className="text-white/60 text-sm mb-2">
                            Format each question like this:
                          </p>
                          <div className="bg-white/5 border border-white/10 rounded p-3 mb-4 text-xs text-white/70 font-mono">
                            Q: What is EDTA?<br />
                            A: Anticoagulant<br />
                            Options: Anticoagulant | Stain | Buffer | Enzyme<br />
                            Subject: Hematology<br />
                            Topic: Anticoagulants<br />
                            Difficulty: Easy<br />
                            Type: MCQ
                          </div>
                        </div>
                        
                        {pyqBulkQuestions.map(function (question, index) { return (<div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label_1.Label className="text-white font-semibold">PYQ Question {index + 1}</label_1.Label>
                              {question.trim() && (<button_1.Button type="button" variant="ghost" size="sm" onClick={function () {
                    var newQuestions = __spreadArray([], pyqBulkQuestions, true);
                    newQuestions[index] = "";
                    setPyqBulkQuestions(newQuestions);
                }} className="text-red-300 hover:text-red-200 hover:bg-red-500/20">
                                  <lucide_react_1.Trash2 className="h-4 w-4 mr-1"/>
                                  Clear
                                </button_1.Button>)}
                            </div>
                            <textarea_1.Textarea value={question} onChange={function (e) {
                var newQuestions = __spreadArray([], pyqBulkQuestions, true);
                newQuestions[index] = e.target.value;
                setPyqBulkQuestions(newQuestions);
            }} className="bg-white/5 border-white/10 text-white font-mono text-sm" rows={8} placeholder={"Q: Question text here?&#10;A: Answer here&#10;Options: Option1 | Option2 | Option3 | Option4&#10;Subject: Subject name&#10;Topic: Topic name&#10;Difficulty: Easy&#10;Type: MCQ"}/>
                          </div>); })}
                      </div>
                      <div className="flex gap-2">
                        <button_1.Button onClick={handlePYQManualSubmit} className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30">
                          Add All PYQ Questions
                        </button_1.Button>
                        <button_1.Button onClick={function () { return setShowPYQManualForm(false); }} variant="outline" className="flex-1">
                          Cancel
                        </button_1.Button>
                      </div>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>

                <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <card_1.CardHeader>
                    <card_1.CardTitle className="text-white">Bulk Add & Create Mock Test</card_1.CardTitle>
                    <p className="text-white/60 text-sm">Paste up to 100 questions to automatically create a mock test</p>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <div className="space-y-4">
                      <div>
                        <label_1.Label className="text-white font-semibold">Paste Questions (Up to 100) *</label_1.Label>
                        <p className="text-white/60 text-sm mb-2 mt-1">
                          Format each question like this (separate questions with a blank line):
                        </p>
                        <div className="bg-white/5 border border-white/10 rounded p-3 mb-3 text-xs text-white/70 font-mono">
                          Q: What is EDTA?<br />
                          A: Anticoagulant<br />
                          Options: Anticoagulant | Stain | Buffer | Enzyme<br />
                          Subject: Hematology<br />
                          Difficulty: Easy<br />
                          Type: MCQ<br />
                          Explanation: EDTA is used to prevent blood clotting
                        </div>
                        <textarea_1.Textarea value={mockTestQuestions} onChange={function (e) { return setMockTestQuestions(e.target.value); }} className="bg-white/5 border-white/10 text-white font-mono text-sm" rows={15} placeholder="Paste your questions here..."/>
                        <p className="text-white/60 text-xs mt-2">
                          {mockTestQuestions.split(/\n\s*\n/).filter(function (b) { return b.trim(); }).length} questions detected
                        </p>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <button_1.Button onClick={handleCreateMockTest} disabled={creatingMockTest} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0">
                          {creatingMockTest ? (<>
                              <lucide_react_1.Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                              Creating Mock Test...
                            </>) : (<>
                              <lucide_react_1.Sparkles className="h-4 w-4 mr-2"/>
                              Create Mock Test
                            </>)}
                        </button_1.Button>
                        <button_1.Button onClick={function () {
            setMockTestQuestions("");
        }} variant="outline" className="flex-1" disabled={creatingMockTest}>
                          Clear Form
                        </button_1.Button>
                      </div>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>

                <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <card_1.CardHeader>
                    <card_1.CardTitle className="text-white">Bulk Add & Create AI Test</card_1.CardTitle>
                    <p className="text-white/60 text-sm">Paste up to 100 AI questions to automatically create an AI test</p>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <div className="space-y-4">
                      <div>
                        <label_1.Label className="text-white font-semibold">Paste AI Questions (Up to 100) *</label_1.Label>
                        <p className="text-white/60 text-sm mb-2 mt-1">
                          Format each question like this (separate questions with a blank line):
                        </p>
                        <div className="bg-white/5 border border-white/10 rounded p-3 mb-3 text-xs text-white/70 font-mono">
                          Q: What is EDTA?<br />
                          A: Anticoagulant<br />
                          Options: Anticoagulant | Stain | Buffer | Enzyme<br />
                          Subject: Hematology<br />
                          Difficulty: Easy<br />
                          Type: MCQ<br />
                          Explanation: EDTA is used to prevent blood clotting
                        </div>
                        <textarea_1.Textarea value={aiTestQuestions} onChange={function (e) { return setAiTestQuestions(e.target.value); }} className="bg-white/5 border-white/10 text-white font-mono text-sm" rows={15} placeholder="Paste your AI questions here..."/>
                        <p className="text-white/60 text-xs mt-2">
                          {aiTestQuestions.split(/\n\s*\n/).filter(function (b) { return b.trim(); }).length} questions detected
                        </p>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <button_1.Button onClick={handleCreateAITest} disabled={creatingAITest} className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0">
                          {creatingAITest ? (<>
                              <lucide_react_1.Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                              Creating AI Test...
                            </>) : (<>
                              <lucide_react_1.Sparkles className="h-4 w-4 mr-2"/>
                              Create AI Test
                            </>)}
                        </button_1.Button>
                        <button_1.Button onClick={function () {
            setAiTestQuestions("");
        }} variant="outline" className="flex-1" disabled={creatingAITest}>
                          Clear Form
                        </button_1.Button>
                      </div>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>

                <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <card_1.CardHeader>
                    <card_1.CardTitle className="text-white">Bulk Add & Create PYQ Test</card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-white/90 text-sm font-medium mb-2 block">
                            Exam Name *
                          </label>
                          <input_1.Input placeholder="e.g., NEET MLT, AIIMS MLT" value={bulkPYQExamName} onChange={function (e) { return setBulkPYQExamName(e.target.value); }} className="bg-white/10 border-white/20 text-white placeholder:text-white/50"/>
                        </div>
                        <div>
                          <label className="text-white/90 text-sm font-medium mb-2 block">
                            Exam Year *
                          </label>
                          <input_1.Input type="number" placeholder="e.g., 2024" value={bulkPYQYear} onChange={function (e) { return setBulkPYQYear(e.target.value); }} className="bg-white/10 border-white/20 text-white placeholder:text-white/50" min="1900" max="2100"/>
                        </div>
                      </div>

                      <div>
                        <label className="text-white/90 text-sm font-medium mb-2 block">
                          Paste Questions *
                        </label>
                        <textarea_1.Textarea placeholder={"Format each question as:\nQ: Question text here?\nA) Option 1\nB) Option 2\nC) Option 3\nD) Option 4\nCorrect: A\nExplanation: Explanation text here\n\n(Leave a blank line between questions)"} value={bulkPYQText} onChange={function (e) {
            setBulkPYQText(e.target.value);
            var text = e.target.value.trim();
            if (!text) {
                setParsedPYQQuestions([]);
                return;
            }
            var blocks = text.split(/\n\s*\n/).filter(function (block) { return block.trim(); });
            var parsed = blocks.map(function (block) {
                var lines = block.trim().split('\n');
                var questionLine = lines[0];
                var options = lines.slice(1, 5);
                var correctLine = lines.find(function (l) { return l.toLowerCase().startsWith('correct:'); });
                var explanationLine = lines.find(function (l) { return l.toLowerCase().startsWith('explanation:'); });
                // Extract option texts
                var optionTexts = options.map(function (opt) { return opt.replace(/^[A-D]\)\s*/, '').trim(); });
                // Extract correct answer letter and map to actual option text
                var correctAnswerText = '';
                if (correctLine) {
                    var correctLetter = correctLine.replace(/^correct:\s*/i, '').trim().toUpperCase();
                    var letterIndex = correctLetter.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
                    if (letterIndex >= 0 && letterIndex < optionTexts.length) {
                        correctAnswerText = optionTexts[letterIndex];
                    }
                }
                return {
                    type: 'mcq',
                    question: questionLine.replace(/^Q:\s*/, '').replace(/^\d+\.\s*/, '').trim(),
                    options: optionTexts,
                    correctAnswer: correctAnswerText,
                    explanation: explanationLine ? explanationLine.replace(/^explanation:\s*/i, '').trim() : '',
                    difficulty: 'medium',
                    subject: 'General'
                };
            });
            setParsedPYQQuestions(parsed);
        }} className="min-h-[300px] bg-white/10 border-white/20 text-white placeholder:text-white/50 font-mono text-sm"/>
                        <p className="text-white/60 text-sm mt-2">
                          Parsed: {parsedPYQQuestions.length} questions
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button_1.Button onClick={handleCreatePYQTest} disabled={isCreatingPYQTest ||
            parsedPYQQuestions.length === 0 ||
            !bulkPYQExamName.trim() ||
            !bulkPYQYear.trim()} className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700">
                          {isCreatingPYQTest ? (<>
                              <lucide_react_1.Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                              Creating PYQ Test...
                            </>) : (<>
                              <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
                              Create PYQ Test ({parsedPYQQuestions.length} questions)
                            </>)}
                        </button_1.Button>
                        <button_1.Button onClick={function () {
            setBulkPYQText("");
            setBulkPYQExamName("");
            setBulkPYQYear("");
            setParsedPYQQuestions([]);
        }} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          Clear
                        </button_1.Button>
                      </div>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>

                <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <card_1.CardHeader>
                    <card_1.CardTitle className="text-white">Auto Create Test Sets</card_1.CardTitle>
                    <p className="text-white/80">
                      Automatically organize unassigned questions into test sets with shuffled options to prevent answer patterns.
                    </p>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label_1.Label className="text-white">Question Source</label_1.Label>
                          <select_1.Select value={autoCreateSource} onValueChange={function (value) { return setAutoCreateSource(value); }}>
                            <select_1.SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <select_1.SelectValue />
                            </select_1.SelectTrigger>
                            <select_1.SelectContent>
                              <select_1.SelectItem value="manual">Mock Tests (100 questions/set)</select_1.SelectItem>
                              <select_1.SelectItem value="pyq">PYQ Tests (20 questions/set)</select_1.SelectItem>
                              <select_1.SelectItem value="ai">AI Tests (25 questions/set)</select_1.SelectItem>
                            </select_1.SelectContent>
                          </select_1.Select>
                        </div>
                        
                        <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3 text-sm">
                          <p className="text-blue-200">
                            ✨ The system will:
                          </p>
                          <ul className="list-disc list-inside text-blue-200/80 mt-2 space-y-1">
                            <li>Shuffle options for each question</li>
                            <li>Prevent consecutive same-position answers</li>
                            <li>Create complete sets automatically</li>
                          </ul>
                        </div>
                      </div>

                      <button_1.Button onClick={handleAutoCreateSets} disabled={isAutoCreating} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                        {isAutoCreating ? (<>
                            <lucide_react_1.Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                            Creating Sets...
                          </>) : (<>
                            <lucide_react_1.Sparkles className="mr-2 h-4 w-4"/>
                            Create Test Sets
                          </>)}
                      </button_1.Button>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>

                <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <card_1.CardHeader>
                    <card_1.CardTitle className="text-white">Bulk Delete Questions</card_1.CardTitle>
                    <p className="text-white/80">
                      ⚠️ Warning: This action cannot be undone!
                    </p>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <div className="space-y-4">
                      <div>
                        <label_1.Label className="text-white font-semibold mb-2 block">Select Question Type to Delete</label_1.Label>
                        <select_1.Select value={deleteSourceType} onValueChange={function (v) { return setDeleteSourceType(v); }}>
                          <select_1.SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <select_1.SelectValue />
                          </select_1.SelectTrigger>
                          <select_1.SelectContent>
                            <select_1.SelectItem value="manual">
                              Mock/Manual Questions ({(questions === null || questions === void 0 ? void 0 : questions.filter(function (q) { return q.source === "manual" || !q.source; }).length) || 0})
                            </select_1.SelectItem>
                            <select_1.SelectItem value="ai">
                              AI Questions ({(questions === null || questions === void 0 ? void 0 : questions.filter(function (q) { return q.source === "ai"; }).length) || 0})
                            </select_1.SelectItem>
                            <select_1.SelectItem value="pyq">
                              PYQ Questions ({(questions === null || questions === void 0 ? void 0 : questions.filter(function (q) { return q.source === "pyq"; }).length) || 0})
                            </select_1.SelectItem>
                          </select_1.SelectContent>
                        </select_1.Select>
                      </div>

                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <p className="text-red-300 text-sm">
                          You are about to delete <strong>{(questions === null || questions === void 0 ? void 0 : questions.filter(function (q) {
            return deleteSourceType === "manual" ? (q.source === "manual" || !q.source) : q.source === deleteSourceType;
        }).length) || 0}</strong> questions.
                        </p>
                        <p className="text-red-200 text-xs mt-2">
                          This will permanently remove all {deleteSourceType === 'manual' ? 'Mock/Manual' : deleteSourceType.toUpperCase()} questions from the database.
                        </p>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <button_1.Button onClick={handleBulkDelete} disabled={isDeletingBulk} className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30">
                          {isDeletingBulk ? (<>
                              <lucide_react_1.Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                              Deleting...
                            </>) : (<>
                              <lucide_react_1.Trash2 className="h-4 w-4 mr-2"/>
                              Confirm Delete
                            </>)}
                        </button_1.Button>
                        <button_1.Button onClick={function () { return setShowBulkDeleteDialog(false); }} variant="outline" className="flex-1" disabled={isDeletingBulk}>
                          Cancel
                        </button_1.Button>
                      </div>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>
              </div>
            </tabs_1.TabsContent>

            {/* Error Questions Tab */}
            <tabs_1.TabsContent value="errors">
              <div className="space-y-6">
                <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <card_1.CardHeader>
                    <card_1.CardTitle className="text-white">Error Questions</card_1.CardTitle>
                    <card_1.CardDescription className="text-white/80">
                      Questions with missing or mismatched answers that need to be fixed or deleted
                    </card_1.CardDescription>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <lucide_react_1.AlertTriangle className="h-6 w-6 text-red-400"/>
                        <h3 className="text-white">Error Questions</h3>
                      </div>
                      <button_1.Button onClick={function () { return setShowErrorQuestions(!showErrorQuestions); }} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        {showErrorQuestions ? 'Hide' : 'Show'} ({errorQuestions.length})
                      </button_1.Button>
                    </div>
                    
                    {showErrorQuestions && (<div className="space-y-4">
                        {errorQuestions.length === 0 ? (<div className="text-center py-8">
                            <lucide_react_1.CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-3"/>
                            <p className="text-white/80">No error questions found! All questions are properly formatted.</p>
                          </div>) : (<div className="space-y-4">
                            {errorQuestions.map(function (question) { return (<div key={question._id} className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-lg p-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <badge_1.Badge variant="destructive">Error</badge_1.Badge>
                                      <badge_1.Badge variant="outline" className="bg-white/10 text-white border-white/20">
                                        {question.type.toUpperCase()}
                                      </badge_1.Badge>
                                      <badge_1.Badge variant="outline" className="bg-white/10 text-white border-white/20">
                                        {question.source || 'manual'}
                                      </badge_1.Badge>
                                    </div>
                                    
                                    <p className="text-white font-medium mb-3">{question.question}</p>
                                    
                                    {question.options && question.options.length > 0 && (<div className="mb-3">
                                        <p className="text-sm font-medium text-white/80 mb-1">Options:</p>
                                        <div className="grid grid-cols-2 gap-2">
                                          {question.options.map(function (option, idx) { return (<div key={idx} className="bg-white/5 rounded px-3 py-2 text-sm text-white/90">
                                              {option}
                                            </div>); })}
                                        </div>
                                      </div>)}
                                    
                                    <div className="bg-red-500/20 rounded px-3 py-2 mb-2">
                                      <p className="text-sm font-medium text-red-300">
                                        Correct Answer: {question.correctAnswer || '(Empty)'}
                                      </p>
                                    </div>
                                    
                                    <div className="text-sm text-yellow-300">
                                      <lucide_react_1.AlertTriangle className="h-4 w-4 inline mr-1"/>
                                      Issue: {!question.correctAnswer || question.correctAnswer.trim() === ''
                        ? 'Correct answer is missing or empty'
                        : !question.options || question.options.length === 0
                            ? 'Options are missing'
                            : 'Correct answer does not match any option'}
                                    </div>
                                  </div>
                                  
                                  <button_1.Button onClick={function () { return handleDeleteQuestion(question._id); }} variant="destructive" size="sm" disabled={isDeletingQuestion === question._id} className="shrink-0">
                                    {isDeletingQuestion === question._id ? (<>
                                        <lucide_react_1.Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                                        Deleting...
                                      </>) : (<>
                                        <lucide_react_1.Trash2 className="h-4 w-4 mr-2"/>
                                        Delete
                                      </>)}
                                  </button_1.Button>
                                </div>
                              </div>); })}
                          </div>)}
                      </div>)}
                  </card_1.CardContent>
                </card_1.Card>
              </div>
            </tabs_1.TabsContent>
          </tabs_1.Tabs>
        </div>
      </framer_motion_1.motion.div>

      {/* Auto Create Test Sets Dialog */}
      <dialog_1.Dialog open={showAutoCreateDialog} onOpenChange={setShowAutoCreateDialog}>
        <dialog_1.DialogContent className="bg-gradient-to-br from-purple-900/95 to-blue-900/95 border-purple-500/30 text-white max-w-md">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Auto Create Test Sets
            </dialog_1.DialogTitle>
          </dialog_1.DialogHeader>
          <div className="space-y-4">
            <p className="text-white/80 text-sm">
              Automatically organize unassigned questions into test sets with shuffled options to prevent answer patterns.
            </p>
            
            <div className="space-y-2">
              <label_1.Label className="text-white">Question Source</label_1.Label>
              <select_1.Select value={autoCreateSource} onValueChange={function (value) { return setAutoCreateSource(value); }}>
                <select_1.SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <select_1.SelectValue />
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  <select_1.SelectItem value="manual">Mock Tests (100 questions/set)</select_1.SelectItem>
                  <select_1.SelectItem value="pyq">PYQ Tests (20 questions/set)</select_1.SelectItem>
                  <select_1.SelectItem value="ai">AI Tests (25 questions/set)</select_1.SelectItem>
                </select_1.SelectContent>
              </select_1.Select>
            </div>

            <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3 text-sm">
              <p className="text-blue-200">
                ✨ The system will:
              </p>
              <ul className="list-disc list-inside text-blue-200/80 mt-2 space-y-1">
                <li>Shuffle options for each question</li>
                <li>Prevent consecutive same-position answers</li>
                <li>Create complete sets automatically</li>
              </ul>
            </div>

            <button_1.Button onClick={handleAutoCreateSets} disabled={isAutoCreating} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
              {isAutoCreating ? (<>
                  <lucide_react_1.Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  Creating Sets...
                </>) : (<>
                  <lucide_react_1.Sparkles className="mr-2 h-4 w-4"/>
                  Create Test Sets
                </>)}
            </button_1.Button>
          </div>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
