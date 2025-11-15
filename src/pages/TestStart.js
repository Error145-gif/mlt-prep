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
exports.default = TestStart;
var react_1 = require("convex/react");
var api_1 = require("@/convex/_generated/api");
var use_auth_1 = require("@/hooks/use-auth");
var react_router_1 = require("react-router");
var react_2 = require("react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var checkbox_1 = require("@/components/ui/checkbox");
var label_1 = require("@/components/ui/label");
var sonner_1 = require("sonner");
var lucide_react_1 = require("lucide-react");
var avatar_1 = require("@/components/ui/avatar");
var TestHeader_1 = require("@/components/TestHeader");
var QuestionCard_1 = require("@/components/QuestionCard");
var QuestionPalette_1 = require("@/components/QuestionPalette");
var framer_motion_1 = require("framer-motion");
var alert_dialog_1 = require("@/components/ui/alert-dialog");
var StudentNav_1 = require("@/components/StudentNav");
function TestStart() {
    var _this = this;
    var _a, _b, _c;
    var _d = (0, use_auth_1.useAuth)(), isAuthenticated = _d.isAuthenticated, isLoading = _d.isLoading;
    var navigate = (0, react_router_1.useNavigate)();
    var searchParams = (0, react_router_1.useSearchParams)()[0];
    var _e = (0, react_2.useState)(false), isMenuOpen = _e[0], setIsMenuOpen = _e[1];
    var userProfile = (0, react_1.useQuery)(api_1.api.users.getUserProfile);
    var _f = (0, react_2.useState)(true), showInstructions = _f[0], setShowInstructions = _f[1];
    var _g = (0, react_2.useState)(false), acceptedInstructions = _g[0], setAcceptedInstructions = _g[1];
    var _h = (0, react_2.useState)(0), currentQuestionIndex = _h[0], setCurrentQuestionIndex = _h[1];
    var _j = (0, react_2.useState)(new Map()), answers = _j[0], setAnswers = _j[1];
    var _k = (0, react_2.useState)(new Set([0])), visitedQuestions = _k[0], setVisitedQuestions = _k[1];
    var _l = (0, react_2.useState)(0), timeRemaining = _l[0], setTimeRemaining = _l[1]; // Will be set based on test type and question count
    var _m = (0, react_2.useState)(null), sessionId = _m[0], setSessionId = _m[1];
    var _o = (0, react_2.useState)(false), showQuestionPalette = _o[0], setShowQuestionPalette = _o[1];
    var _p = (0, react_2.useState)(true), isTabVisible = _p[0], setIsTabVisible = _p[1];
    var _q = (0, react_2.useState)(false), showExitDialog = _q[0], setShowExitDialog = _q[1];
    var _r = (0, react_2.useState)(false), isPaused = _r[0], setIsPaused = _r[1];
    var testType = searchParams.get("type") || "mock";
    var topicIdParam = searchParams.get("topicId");
    // Only set topicId if it exists and is not "general" or "null"
    var topicId = topicIdParam && topicIdParam !== "general" && topicIdParam !== "null" ? topicIdParam : undefined;
    var year = searchParams.get("year") ? parseInt(searchParams.get("year")) : undefined;
    var setNumber = searchParams.get("setNumber") ? parseInt(searchParams.get("setNumber")) : undefined;
    var startTest = (0, react_1.useMutation)(api_1.api.student.startTest);
    var submitTest = (0, react_1.useMutation)(api_1.api.student.submitTest);
    // Prevent copying during test
    (0, react_2.useEffect)(function () {
        if (!showInstructions && sessionId) {
            var preventCopy_1 = function (e) {
                e.preventDefault();
                sonner_1.toast.error("Copying is disabled during the test");
                return false;
            };
            var preventContextMenu_1 = function (e) {
                e.preventDefault();
                return false;
            };
            var preventKeyboardShortcuts_1 = function (e) {
                // Prevent Ctrl+C, Ctrl+A, Ctrl+X, Ctrl+U, F12, Ctrl+Shift+I
                if ((e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'a' || e.key === 'A' || e.key === 'x' || e.key === 'X' || e.key === 'u' || e.key === 'U')) ||
                    e.key === 'F12' ||
                    (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'I' || e.key === 'j' || e.key === 'J'))) {
                    e.preventDefault();
                    sonner_1.toast.error("This action is disabled during the test");
                    return false;
                }
            };
            document.addEventListener('copy', preventCopy_1);
            document.addEventListener('cut', preventCopy_1);
            document.addEventListener('contextmenu', preventContextMenu_1);
            document.addEventListener('keydown', preventKeyboardShortcuts_1);
            return function () {
                document.removeEventListener('copy', preventCopy_1);
                document.removeEventListener('cut', preventCopy_1);
                document.removeEventListener('contextmenu', preventContextMenu_1);
                document.removeEventListener('keydown', preventKeyboardShortcuts_1);
            };
        }
    }, [showInstructions, sessionId]);
    // Fetch questions for the test - with loading optimization
    var testQuestions = (0, react_1.useQuery)(api_1.api.student.getTestQuestions, __assign(__assign(__assign({ testType: testType }, (topicId && { topicId: topicId })), (year && { year: year })), (setNumber && { setNumber: setNumber })));
    var questions = testQuestions || [];
    var _s = (0, react_2.useState)(""), testName = _s[0], setTestName = _s[1];
    (0, react_2.useEffect)(function () {
        if (!isLoading && !isAuthenticated) {
            navigate("/auth");
        }
    }, [isAuthenticated, isLoading, navigate]);
    (0, react_2.useEffect)(function () {
        // Set test name based on type
        if (testType === "mock") {
            setTestName("Mock Test");
        }
        else if (testType === "pyq") {
            // Get exam name from first question if available
            if (questions && questions.length > 0 && questions[0] && questions[0].examName) {
                setTestName(questions[0].examName);
            }
            else {
                setTestName("PYQ ".concat(year || ""));
            }
        }
        else if (testType === "ai") {
            setTestName("AI Generated Questions");
        }
    }, [testType, year, questions]);
    // Set initial timer based on test type and question count
    (0, react_2.useEffect)(function () {
        if (questions && questions.length > 0 && timeRemaining === 0) {
            var duration = 60 * 60; // Default 60 minutes
            if (testType === "pyq") {
                // PYQ: 10 minutes per 20 questions (30 seconds per question)
                duration = Math.ceil(questions.length / 20) * 10 * 60;
            }
            else if (testType === "mock") {
                // Mock: 60 minutes fixed
                duration = 60 * 60;
            }
            else if (testType === "ai") {
                // AI: 30 minutes fixed for 25 questions
                duration = 30 * 60;
            }
            setTimeRemaining(duration);
        }
    }, [questions.length, testType, timeRemaining]);
    // Prevent browser navigation/close during test
    (0, react_2.useEffect)(function () {
        if (!showInstructions && sessionId) {
            var handleBeforeUnload_1 = function (e) {
                e.preventDefault();
                e.returnValue = "Are you sure you want to leave? Your test progress may be lost.";
                return e.returnValue;
            };
            window.addEventListener("beforeunload", handleBeforeUnload_1);
            return function () { return window.removeEventListener("beforeunload", handleBeforeUnload_1); };
        }
    }, [showInstructions, sessionId]);
    // Handle tab visibility changes (pause timer when tab is hidden)
    (0, react_2.useEffect)(function () {
        var handleVisibilityChange = function () {
            setIsTabVisible(!document.hidden);
            if (document.hidden && !showInstructions && sessionId) {
                // Tab is hidden - show warning toast
                sonner_1.toast.warning("Test paused - Please return to the test tab");
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return function () { return document.removeEventListener("visibilitychange", handleVisibilityChange); };
    }, [showInstructions, sessionId]);
    // Timer countdown (only runs when tab is visible and not paused)
    (0, react_2.useEffect)(function () {
        if (!showInstructions && timeRemaining > 0 && isTabVisible && !isPaused) {
            var timer_1 = setInterval(function () {
                setTimeRemaining(function (prev) {
                    if (prev <= 1) {
                        handleSubmitTest();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return function () { return clearInterval(timer_1); };
        }
    }, [showInstructions, timeRemaining, isTabVisible, isPaused]);
    // Format time as HH:MM:SS
    var formatTime = function (seconds) {
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds % 3600) / 60);
        var secs = seconds % 60;
        return "".concat(hours.toString().padStart(2, "0"), ":").concat(minutes.toString().padStart(2, "0"), ":").concat(secs.toString().padStart(2, "0"));
    };
    var handleStartTest = function () { return __awaiter(_this, void 0, void 0, function () {
        var questionIds, id, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!acceptedInstructions)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    questionIds = questions.map(function (q) { return q._id; });
                    return [4 /*yield*/, startTest({
                            testType: testType,
                            topicId: topicId,
                            year: year,
                            setNumber: setNumber,
                            questionIds: questionIds,
                        })];
                case 2:
                    id = _a.sent();
                    setSessionId(id);
                    setShowInstructions(false);
                    sonner_1.toast.success("Test started!");
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    sonner_1.toast.error("Failed to start test");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleAnswerChange = function (answer) {
        if (!questions || currentQuestionIndex >= questions.length)
            return;
        var question = questions[currentQuestionIndex];
        if (!question)
            return;
        var newAnswer = {
            questionId: question._id,
            answer: answer,
            status: "answered",
        };
        setAnswers(new Map(answers.set(question._id, newAnswer)));
    };
    var handleSaveAndNext = function () {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setVisitedQuestions(new Set(visitedQuestions.add(currentQuestionIndex + 1)));
        }
    };
    var handleMarkForReview = function () {
        if (!questions || currentQuestionIndex >= questions.length)
            return;
        var question = questions[currentQuestionIndex];
        if (!question)
            return;
        var currentAnswer = answers.get(question._id);
        var newAnswer = {
            questionId: question._id,
            answer: (currentAnswer === null || currentAnswer === void 0 ? void 0 : currentAnswer.answer) || "",
            status: (currentAnswer === null || currentAnswer === void 0 ? void 0 : currentAnswer.answer) ? "marked-answered" : "marked",
        };
        setAnswers(new Map(answers.set(question._id, newAnswer)));
        handleSaveAndNext();
    };
    var handleClearResponse = function () {
        if (!questions || currentQuestionIndex >= questions.length)
            return;
        var question = questions[currentQuestionIndex];
        if (!question)
            return;
        answers.delete(question._id);
        setAnswers(new Map(answers));
    };
    var handleQuestionClick = function (index) {
        setCurrentQuestionIndex(index);
        setVisitedQuestions(new Set(visitedQuestions.add(index)));
    };
    var handleSubmitTest = function () { return __awaiter(_this, void 0, void 0, function () {
        var answersArray, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!sessionId)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    answersArray = Array.from(answers.values()).map(function (a) { return ({
                        questionId: a.questionId,
                        answer: a.answer,
                    }); });
                    return [4 /*yield*/, submitTest({
                            sessionId: sessionId,
                            answers: answersArray,
                        })];
                case 2:
                    _a.sent();
                    sonner_1.toast.success("Test submitted successfully!");
                    navigate("/test-results?sessionId=".concat(sessionId));
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    sonner_1.toast.error("Failed to submit test");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var getQuestionStatus = function (index) {
        var question = questions[index];
        if (!question)
            return "not-visited";
        var answer = answers.get(question._id);
        if (!visitedQuestions.has(index))
            return "not-visited";
        if (!answer)
            return "not-answered";
        return answer.status;
    };
    var getStatusColor = function (status) {
        switch (status) {
            case "answered":
                return "bg-green-500 text-white";
            case "marked":
                return "bg-purple-500 text-white";
            case "marked-answered":
                return "bg-orange-500 text-white";
            case "not-answered":
                return "bg-red-500 text-white";
            default:
                return "bg-gray-200 text-gray-700";
        }
    };
    var handleExitTest = function () {
        setShowExitDialog(true);
    };
    var handleConfirmExit = function () {
        setShowExitDialog(false);
        sonner_1.toast.info("Test exited. Your progress has been saved.");
        navigate("/dashboard");
    };
    var handleCancelExit = function () {
        setShowExitDialog(false);
        sonner_1.toast.info("Continuing test...");
    };
    var handlePauseTest = function () {
        setIsPaused(true);
        sonner_1.toast.info("Test paused. Click Resume to continue.");
    };
    var handleResumeTest = function () {
        setIsPaused(false);
        sonner_1.toast.success("Test resumed!");
    };
    // Enhanced loading state
    if (isLoading || !questions || questions.length === 0) {
        return (<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <div className="text-gray-700 text-xl font-medium">Preparing your test...</div>
          <div className="text-gray-600 text-sm">Loading questions</div>
        </div>
      </div>);
    }
    if (showInstructions) {
        var testTypeIcon = testType === "ai" ? "🤖" : testType === "pyq" ? "📘" : "🧩";
        var duration = testType === "mock" ? 60 : testType === "pyq" ? (questions && questions.length > 0 ? Math.ceil(questions.length / 20) * 10 : 10) : 30;
        return (<div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl animate-pulse"/>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}/>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{testTypeIcon}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{testName}</h1>
            </div>
            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              {(userProfile === null || userProfile === void 0 ? void 0 : userProfile.avatarUrl) ? (<avatar_1.Avatar className="h-10 w-10 border-2 border-white shadow-md">
                  <avatar_1.AvatarImage src={userProfile.avatarUrl}/>
                  <avatar_1.AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {((_b = (_a = userProfile.name) === null || _a === void 0 ? void 0 : _a.charAt(0)) === null || _b === void 0 ? void 0 : _b.toUpperCase()) || "U"}
                  </avatar_1.AvatarFallback>
                </avatar_1.Avatar>) : (<lucide_react_1.User className="h-10 w-10 text-white"/>)}
              <span className="font-semibold text-white">{(userProfile === null || userProfile === void 0 ? void 0 : userProfile.name) || "Student"}</span>
            </div>
          </div>

          {/* Test Summary Card */}
          <card_1.Card className="p-6 mb-6 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <p className="text-3xl mb-1">{testTypeIcon}</p>
                <p className="text-sm text-gray-600 font-medium">Test Type</p>
                <p className="text-lg font-bold text-blue-900">{testType === "ai" ? "AI Questions" : testType === "pyq" ? (questions && questions.length > 0 && ((_c = questions[0]) === null || _c === void 0 ? void 0 : _c.examName) ? questions[0].examName : "PYQ ".concat(year)) : "Mock Test"}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <p className="text-3xl mb-1">🕒</p>
                <p className="text-sm text-gray-600 font-medium">Duration</p>
                <p className="text-lg font-bold text-purple-900">{duration} mins</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
                <p className="text-3xl mb-1">❓</p>
                <p className="text-sm text-gray-600 font-medium">Questions</p>
                <p className="text-lg font-bold text-pink-900">{questions && questions.length > 0 ? questions.length : 0}</p>
              </div>
            </div>
          </card_1.Card>

          {/* Instructions Card */}
          <card_1.Card className="p-6 md:p-8 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              📋 General Instructions
            </h2>

            <div className="space-y-6">
              {/* Timer Section */}
              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border-l-4 border-orange-500">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  ⏰ Timer & Auto-Submit
                </h3>
                <p className="text-sm text-gray-700">
                  The countdown timer (top-right) will auto-submit your test when it reaches <strong>00:00</strong>. No manual submission needed!
                </p>
              </div>

              {/* Question Palette */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  🎨 Question Status Colors
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-gray-400 bg-white rounded"></div>
                    <span className="text-gray-700">⚪ Not Visited</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-red-500 rounded"></div>
                    <span className="text-gray-700">🔴 Visited / Not Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-500 rounded"></div>
                    <span className="text-gray-700">🟢 Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-purple-500 rounded"></div>
                    <span className="text-gray-700">🟣 Marked for Review</span>
                  </div>
                  <div className="flex items-center gap-2 md:col-span-2">
                    <div className="w-5 h-5 bg-orange-500 rounded"></div>
                    <span className="text-gray-700">🟠 Answered + Marked</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-3 italic">
                  💡 Answers marked for review are still evaluated unless changed.
                </p>
              </div>

              {/* Navigation */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-500">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  🧭 Navigation Tips
                </h3>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• Click question numbers to jump directly</li>
                  <li>• Use <strong className="text-green-700">Save & Next</strong> to record and move ahead</li>
                  <li>• Use <strong className="text-purple-700">Mark for Review & Next</strong> to flag questions</li>
                  <li>• ⚠️ Switching without saving loses your answer!</li>
                </ul>
              </div>

              {/* Answering MCQs */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-l-4 border-purple-500">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  ✍️ Answering Questions
                </h3>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• Select one option (A–D) by clicking</li>
                  <li>• Click again or press <strong>Clear Response</strong> to deselect</li>
                  <li>• Always click <strong className="text-green-700">Save & Next</strong> to confirm</li>
                  <li>• You can revisit and change answers anytime</li>
                </ul>
              </div>

              {/* Safety Reminders */}
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border-l-4 border-yellow-500">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  🛡️ Safety Reminders
                </h3>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• Don't refresh or close the browser</li>
                  <li>• Responses are autosaved when you click Save & Next</li>
                  <li>• Short network drops won't affect saved data</li>
                </ul>
              </div>
            </div>

            {/* AI Enhancement Note */}
            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
              <p className="text-sm text-indigo-900 text-center">
                🤖 <strong>AI-Powered Analysis:</strong> Our system will analyze your responses to improve your next test performance.
              </p>
            </div>

            {/* Motivational Quote */}
            <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-200">
              <p className="text-center text-gray-700 italic">
                "Every click brings you closer to mastery. Focus on learning, not just scores." 💪
              </p>
            </div>

            {/* Acceptance Checkbox */}
            <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
              <div className="flex items-start gap-3">
                <checkbox_1.Checkbox id="accept" checked={acceptedInstructions} onCheckedChange={function (checked) { return setAcceptedInstructions(checked); }} className="mt-1 h-5 w-5 border-2 border-blue-600 data-[state=checked]:bg-blue-600"/>
                <label_1.Label htmlFor="accept" className="text-sm cursor-pointer text-gray-800 leading-relaxed">
                  I have read and understood the instructions. I declare that I am not carrying any prohibited items and agree to follow all test guidelines.
                </label_1.Label>
              </div>
            </div>

            {/* Start Button */}
            <div className="mt-6 flex justify-center">
              <button_1.Button onClick={handleStartTest} disabled={!acceptedInstructions} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed animate-pulse">
                Start Test 🚀
              </button_1.Button>
            </div>
          </card_1.Card>
        </div>
      </div>);
    }
    var currentQuestion = questions && questions.length > 0 && currentQuestionIndex < questions.length ? questions[currentQuestionIndex] : null;
    var currentAnswer = currentQuestion ? answers.get(currentQuestion._id) : null;
    var answeredCount = Array.from(answers.values()).filter(function (a) { return a.answer; }).length;
    if (!currentQuestion || !questions || questions.length === 0) {
        return (<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center space-y-4">
          <div className="text-gray-700 text-xl font-medium">No questions available</div>
          <button_1.Button onClick={function () { return navigate("/student"); }} className="bg-blue-600 hover:bg-blue-700">
            Return to Dashboard
          </button_1.Button>
        </div>
      </div>);
    }
    return (<div className="min-h-screen flex flex-col relative overflow-hidden" style={{ userSelect: showInstructions ? 'auto' : 'none' }}>
      {/* Hide StudentNav during test */}
      {showInstructions && <StudentNav_1.default />}
      {/* Hamburger Menu Button - Mobile Only (hidden during test) */}
      {showInstructions && (<button onClick={function () { return setIsMenuOpen(!isMenuOpen); }} className="fixed top-6 right-6 z-50 md:hidden bg-white/20 backdrop-blur-sm p-2 rounded-lg hover:bg-white/30 transition-all">
          {isMenuOpen ? (<lucide_react_1.X className="h-6 w-6 text-white"/>) : (<lucide_react_1.Menu className="h-6 w-6 text-white"/>)}
        </button>)}

      {/* Mobile Menu */}
      <framer_motion_1.AnimatePresence>
        {isMenuOpen && (<framer_motion_1.motion.div initial={{ opacity: 0, x: 300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 300 }} transition={{ duration: 0.3 }} className="fixed top-0 right-0 h-screen w-64 bg-gradient-to-br from-blue-600 to-purple-700 z-40 md:hidden shadow-2xl p-6 space-y-4">
            <div className="mt-12 space-y-3">
              <button onClick={function () {
                navigate("/dashboard");
                setIsMenuOpen(false);
            }} className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all">
                📊 Dashboard
              </button>
              <button onClick={function () {
                navigate("/tests/mock");
                setIsMenuOpen(false);
            }} className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all">
                🧩 Mock Tests
              </button>
              <button onClick={function () {
                navigate("/tests/pyq");
                setIsMenuOpen(false);
            }} className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all">
                📚 PYQ Sets
              </button>
              <button onClick={function () {
                navigate("/tests/ai");
                setIsMenuOpen(false);
            }} className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all">
                🤖 AI Questions
              </button>
              <button onClick={function () {
                navigate("/profile");
                setIsMenuOpen(false);
            }} className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all">
                👤 Profile
              </button>
            </div>
          </framer_motion_1.motion.div>)}
      </framer_motion_1.AnimatePresence>

      {/* Animated Background Gradients - Same as Landing */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl animate-pulse"/>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}/>
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-pink-400/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}/>
        <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] bg-cyan-400/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }}/>
      </div>
      <TestHeader_1.TestHeader testName={testName} timeRemaining={timeRemaining} userName={userProfile === null || userProfile === void 0 ? void 0 : userProfile.name} avatarUrl={userProfile === null || userProfile === void 0 ? void 0 : userProfile.avatarUrl} questionsAnswered={answeredCount} totalQuestions={questions.length}/>

      <div className="flex flex-1 relative overflow-hidden">
        <button_1.Button variant="outline" size="sm" className="fixed bottom-6 right-6 z-50 md:hidden bg-blue-600 text-white hover:bg-blue-700 shadow-xl hover:shadow-2xl transition-all rounded-full w-14 h-14 p-0" onClick={function () { return setShowQuestionPalette(!showQuestionPalette); }}>
          {showQuestionPalette ? <lucide_react_1.X className="h-6 w-6"/> : <lucide_react_1.Menu className="h-6 w-6"/>}
        </button_1.Button>

        <div className="hidden md:block w-48 bg-white/80 backdrop-blur-sm border-r border-gray-200 p-4 shadow-lg">
          <h3 className="font-semibold mb-3 text-gray-700 text-sm uppercase tracking-wide">Sections</h3>
          <button_1.Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md">
            Test
          </button_1.Button>
        </div>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          {/* Test Controls - Moved to top */}
          <div className="mb-6 flex flex-wrap gap-3 justify-center md:justify-start">
            {testType === "mock" && (<button_1.Button onClick={isPaused ? handleResumeTest : handlePauseTest} variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 font-semibold px-6 py-2">
                {isPaused ? "▶️ Resume Test" : "⏸️ Pause Test"}
              </button_1.Button>)}
            <button_1.Button onClick={handleExitTest} variant="outline" className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 px-6 py-2">
              Exit Test
            </button_1.Button>
          </div>

          {isPaused && (<framer_motion_1.motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg text-center shadow-lg">
              <p className="text-yellow-800 font-semibold text-lg">⏸️ Test Paused</p>
              <p className="text-yellow-700 mt-1">Click Resume to continue your test</p>
            </framer_motion_1.motion.div>)}
          <QuestionCard_1.QuestionCard questionNumber={currentQuestionIndex + 1} questionText={currentQuestion.question} options={currentQuestion.options || []} selectedAnswer={currentAnswer === null || currentAnswer === void 0 ? void 0 : currentAnswer.answer} onAnswerChange={handleAnswerChange} onSaveAndNext={handleSaveAndNext} onMarkForReview={handleMarkForReview} onClearResponse={handleClearResponse} isLastQuestion={currentQuestionIndex === questions.length - 1}/>
        </div>

        <QuestionPalette_1.QuestionPalette questions={questions} currentQuestionIndex={currentQuestionIndex} getQuestionStatus={getQuestionStatus} onQuestionClick={handleQuestionClick} onSubmitTest={handleSubmitTest} showOnMobile={showQuestionPalette} onClose={function () { return setShowQuestionPalette(false); }}/>
      </div>

      <alert_dialog_1.AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <alert_dialog_1.AlertDialogContent className="z-[100]">
          <alert_dialog_1.AlertDialogHeader>
            <alert_dialog_1.AlertDialogTitle>Exit Test?</alert_dialog_1.AlertDialogTitle>
            <alert_dialog_1.AlertDialogDescription>
              Are you sure you want to exit? All unsaved answers may be lost. Your current progress will be saved, but you won't be able to resume this test session.
            </alert_dialog_1.AlertDialogDescription>
          </alert_dialog_1.AlertDialogHeader>
          <alert_dialog_1.AlertDialogFooter>
            <alert_dialog_1.AlertDialogCancel onClick={handleCancelExit}>
              No, Continue Test
            </alert_dialog_1.AlertDialogCancel>
            <alert_dialog_1.AlertDialogAction onClick={handleConfirmExit} className="bg-red-600 hover:bg-red-700">
              Yes, Exit
            </alert_dialog_1.AlertDialogAction>
          </alert_dialog_1.AlertDialogFooter>
        </alert_dialog_1.AlertDialogContent>
      </alert_dialog_1.AlertDialog>
    </div>);
}
