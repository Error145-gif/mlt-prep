import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { User, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TestHeader } from "@/components/TestHeader";
import { QuestionCard } from "@/components/QuestionCard";
import { QuestionPalette } from "@/components/QuestionPalette";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import StudentNav from "@/components/StudentNav";

type Answer = {
  questionId: Id<"questions">;
  answer: string;
  status: "answered" | "marked" | "not-answered" | "marked-answered";
};

export default function TestStart() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userProfile = useQuery(api.users.getUserProfile);
  const [showInstructions, setShowInstructions] = useState(true);
  const [acceptedInstructions, setAcceptedInstructions] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, Answer>>(new Map());
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set([0]));
  const [timeRemaining, setTimeRemaining] = useState(0); // Will be set based on test type and question count
  const [sessionId, setSessionId] = useState<Id<"testSessions"> | null>(null);
  const [showQuestionPalette, setShowQuestionPalette] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const testType = searchParams.get("type") || "mock";
  const topicIdParam = searchParams.get("topicId");
  // Only set topicId if it exists and is not "general" or "null"
  const topicId = topicIdParam && topicIdParam !== "general" && topicIdParam !== "null" ? (topicIdParam as Id<"topics">) : undefined;
  const year = searchParams.get("year") ? parseInt(searchParams.get("year")!) : undefined;
  const setNumber = searchParams.get("setNumber") ? parseInt(searchParams.get("setNumber")!) : undefined;

  const startTest = useMutation(api.student.startTest);
  const submitTest = useMutation(api.student.submitTest);

  // Fetch questions for the test - with loading optimization
  const testQuestions = useQuery(api.student.getTestQuestions, {
    testType,
    ...(topicId && { topicId }),
    ...(year && { year }),
    ...(setNumber && { setNumber }),
  });

  const questions = testQuestions || [];
  const [testName, setTestName] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    // Set test name based on type
    if (testType === "mock") {
      setTestName("Mock Test");
    } else if (testType === "pyq") {
      // Get exam name from first question if available
      if (questions && questions.length > 0 && questions[0] && questions[0].examName) {
        setTestName(questions[0].examName);
      } else {
        setTestName(`PYQ ${year || ""}`);
      }
    } else if (testType === "ai") {
      setTestName("AI Generated Questions");
    }
  }, [testType, year, questions]);

  // Set initial timer based on test type and question count
  useEffect(() => {
    if (questions && questions.length > 0 && timeRemaining === 0) {
      let duration = 60 * 60; // Default 60 minutes
      
      if (testType === "pyq") {
        // PYQ: 10 minutes per 20 questions (30 seconds per question)
        duration = Math.ceil(questions.length / 20) * 10 * 60;
      } else if (testType === "mock") {
        // Mock: 60 minutes fixed
        duration = 60 * 60;
      } else if (testType === "ai") {
        // AI: 30 minutes fixed for 25 questions
        duration = 30 * 60;
      }
      
      setTimeRemaining(duration);
    }
  }, [questions.length, testType, timeRemaining]);

  // Prevent browser navigation/close during test
  useEffect(() => {
    if (!showInstructions && sessionId) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "Are you sure you want to leave? Your test progress may be lost.";
        return e.returnValue;
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }
  }, [showInstructions, sessionId]);

  // Prevent copy/paste and right-click during test
  useEffect(() => {
    if (!showInstructions && sessionId) {
      const preventCopy = (e: ClipboardEvent) => {
        e.preventDefault();
        toast.error("Copying is disabled during the test");
      };

      const preventContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        toast.warning("Right-click is disabled during the test");
      };

      const preventKeyboardShortcuts = (e: KeyboardEvent) => {
        // Prevent Ctrl+C, Ctrl+X, Ctrl+A, Ctrl+P, F12, Ctrl+Shift+I
        if (
          (e.ctrlKey && (e.key === 'c' || e.key === 'x' || e.key === 'a' || e.key === 'p')) ||
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && e.key === 'I')
        ) {
          e.preventDefault();
          toast.error("This action is disabled during the test");
        }
      };

      document.addEventListener('copy', preventCopy);
      document.addEventListener('cut', preventCopy);
      document.addEventListener('contextmenu', preventContextMenu);
      document.addEventListener('keydown', preventKeyboardShortcuts);

      return () => {
        document.removeEventListener('copy', preventCopy);
        document.removeEventListener('cut', preventCopy);
        document.removeEventListener('contextmenu', preventContextMenu);
        document.removeEventListener('keydown', preventKeyboardShortcuts);
      };
    }
  }, [showInstructions, sessionId]);

  // Handle tab visibility changes (pause timer when tab is hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden);
      
      if (document.hidden && !showInstructions && sessionId) {
        // Tab is hidden - show warning toast
        toast.warning("Test paused - Please return to the test tab");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [showInstructions, sessionId]);

  // Timer countdown (only runs when tab is visible and not paused)
  useEffect(() => {
    if (!showInstructions && timeRemaining > 0 && isTabVisible && !isPaused) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showInstructions, timeRemaining, isTabVisible, isPaused]);

  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartTest = async () => {
    if (!acceptedInstructions) return;
    
    try {
      // Create test session
      const questionIds = questions.map((q) => q._id);
      const id = await startTest({
        testType,
        topicId,
        year,
        setNumber,
        questionIds,
      });
      setSessionId(id);
      setShowInstructions(false);
      toast.success("Test started!");
    } catch (error) {
      toast.error("Failed to start test");
    }
  };

  const handleAnswerChange = (answer: string) => {
    if (!questions || currentQuestionIndex >= questions.length) return;
    const question = questions[currentQuestionIndex];
    if (!question) return;
    const newAnswer: Answer = {
      questionId: question._id,
      answer,
      status: "answered",
    };
    setAnswers(new Map(answers.set(question._id, newAnswer)));
  };

  const handleSaveAndNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setVisitedQuestions(new Set(visitedQuestions.add(currentQuestionIndex + 1)));
    }
  };

  const handleMarkForReview = () => {
    if (!questions || currentQuestionIndex >= questions.length) return;
    const question = questions[currentQuestionIndex];
    if (!question) return;
    const currentAnswer = answers.get(question._id);
    const newAnswer: Answer = {
      questionId: question._id,
      answer: currentAnswer?.answer || "",
      status: currentAnswer?.answer ? "marked-answered" : "marked",
    };
    setAnswers(new Map(answers.set(question._id, newAnswer)));
    handleSaveAndNext();
  };

  const handleClearResponse = () => {
    if (!questions || currentQuestionIndex >= questions.length) return;
    const question = questions[currentQuestionIndex];
    if (!question) return;
    answers.delete(question._id);
    setAnswers(new Map(answers));
  };

  const handleQuestionClick = (index: number) => {
    setCurrentQuestionIndex(index);
    setVisitedQuestions(new Set(visitedQuestions.add(index)));
  };

  const handleSubmitTest = async () => {
    if (!sessionId) return;

    try {
      const answersArray = Array.from(answers.values()).map((a) => ({
        questionId: a.questionId,
        answer: a.answer,
      }));

      await submitTest({
        sessionId,
        answers: answersArray,
      });

      toast.success("Test submitted successfully!");
      navigate(`/test-results?sessionId=${sessionId}`);
    } catch (error) {
      toast.error("Failed to submit test");
    }
  };

  const getQuestionStatus = (index: number) => {
    const question = questions[index];
    if (!question) return "not-visited";
    
    const answer = answers.get(question._id);
    if (!visitedQuestions.has(index)) return "not-visited";
    if (!answer) return "not-answered";
    return answer.status;
  };

  const getStatusColor = (status: string) => {
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

  const handleExitTest = () => {
    setShowExitDialog(true);
  };

  const handleConfirmExit = () => {
    setShowExitDialog(false);
    toast.info("Test exited. Your progress has been saved.");
    navigate("/dashboard");
  };

  const handleCancelExit = () => {
    setShowExitDialog(false);
    toast.info("Continuing test...");
  };

  const handlePauseTest = () => {
    setIsPaused(true);
    toast.info("Test paused. Click Resume to continue.");
  };

  const handleResumeTest = () => {
    setIsPaused(false);
    toast.success("Test resumed!");
  };

  // Enhanced loading state
  if (isLoading || !questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <div className="text-gray-700 text-xl font-medium">Preparing your test...</div>
          <div className="text-gray-600 text-sm">Loading questions</div>
        </div>
      </div>
    );
  }

  if (showInstructions) {
    const testTypeIcon = testType === "ai" ? "🤖" : testType === "pyq" ? "📘" : "🧩";
    const duration = testType === "mock" ? 60 : testType === "pyq" ? (questions && questions.length > 0 ? Math.ceil(questions.length / 20) * 10 : 10) : 30;
    
    return (
      <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{testTypeIcon}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{testName}</h1>
            </div>
            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              {userProfile?.avatarUrl ? (
                <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                  <AvatarImage src={userProfile.avatarUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {userProfile.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <User className="h-10 w-10 text-white" />
              )}
              <span className="font-semibold text-white">{userProfile?.name || "Student"}</span>
            </div>
          </div>

          {/* Test Summary Card */}
          <Card className="p-6 mb-6 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <p className="text-3xl mb-1">{testTypeIcon}</p>
                <p className="text-sm text-gray-600 font-medium">Test Type</p>
                <p className="text-lg font-bold text-blue-900">{testType === "ai" ? "AI Questions" : testType === "pyq" ? (questions && questions.length > 0 && questions[0]?.examName ? questions[0].examName : `PYQ ${year}`) : "Mock Test"}</p>
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
          </Card>

          {/* Instructions Card */}
          <Card className="p-6 md:p-8 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
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
                <Checkbox
                  id="accept"
                  checked={acceptedInstructions}
                  onCheckedChange={(checked) => setAcceptedInstructions(checked as boolean)}
                  className="mt-1 h-5 w-5 border-2 border-blue-600 data-[state=checked]:bg-blue-600"
                />
                <Label htmlFor="accept" className="text-sm cursor-pointer text-gray-800 leading-relaxed">
                  I have read and understood the instructions. I declare that I am not carrying any prohibited items and agree to follow all test guidelines.
                </Label>
              </div>
            </div>

            {/* Start Button */}
            <div className="mt-6 flex justify-center">
              <Button
                onClick={handleStartTest}
                disabled={!acceptedInstructions}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed animate-pulse"
              >
                Start Test 🚀
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = questions && questions.length > 0 && currentQuestionIndex < questions.length ? questions[currentQuestionIndex] : null;
  const currentAnswer = currentQuestion ? answers.get(currentQuestion._id) : null;
  const answeredCount = Array.from(answers.values()).filter(a => a.answer).length;
  
  if (!currentQuestion || !questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center space-y-4">
          <div className="text-gray-700 text-xl font-medium">No questions available</div>
          <Button onClick={() => navigate("/student")} className="bg-blue-600 hover:bg-blue-700">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ userSelect: showInstructions ? 'auto' : 'none' }}>
      {/* Hide StudentNav during test */}
      {showInstructions && <StudentNav />}
      {/* Hamburger Menu Button - Mobile Only (hidden during test) */}
      {showInstructions && (
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="fixed top-6 right-6 z-50 md:hidden bg-white/20 backdrop-blur-sm p-2 rounded-lg hover:bg-white/30 transition-all"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 h-screen w-64 bg-gradient-to-br from-blue-600 to-purple-700 z-40 md:hidden shadow-2xl p-6 space-y-4"
          >
            <div className="mt-12 space-y-3">
              <button
                onClick={() => {
                  navigate("/dashboard");
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all"
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => {
                  navigate("/tests/mock");
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all"
              >
                🧩 Mock Tests
              </button>
              <button
                onClick={() => {
                  navigate("/tests/pyq");
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all"
              >
                📚 PYQ Sets
              </button>
              <button
                onClick={() => {
                  navigate("/tests/ai");
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all"
              >
                🤖 AI Questions
              </button>
              <button
                onClick={() => {
                  navigate("/profile");
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all"
              >
                👤 Profile
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Background Gradients - Same as Landing */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-pink-400/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] bg-cyan-400/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }} />
      </div>
      <TestHeader
        testName={testName}
        timeRemaining={timeRemaining}
        userName={userProfile?.name}
        avatarUrl={userProfile?.avatarUrl}
        questionsAnswered={answeredCount}
        totalQuestions={questions.length}
      />

      <div className="flex flex-1 relative overflow-hidden">
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-6 right-6 z-50 md:hidden bg-blue-600 text-white hover:bg-blue-700 shadow-xl hover:shadow-2xl transition-all rounded-full w-14 h-14 p-0"
          onClick={() => setShowQuestionPalette(!showQuestionPalette)}
        >
          {showQuestionPalette ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        <div className="hidden md:block w-48 bg-white/80 backdrop-blur-sm border-r border-gray-200 p-4 shadow-lg">
          <h3 className="font-semibold mb-3 text-gray-700 text-sm uppercase tracking-wide">Sections</h3>
          <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md">
            Test
          </Button>
        </div>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          {/* Test Controls - Moved to top */}
          <div className="mb-6 flex flex-wrap gap-3 justify-center md:justify-start">
            {testType === "mock" && (
              <Button
                onClick={isPaused ? handleResumeTest : handlePauseTest}
                variant="outline"
                className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 font-semibold px-6 py-2"
              >
                {isPaused ? "▶️ Resume Test" : "⏸️ Pause Test"}
              </Button>
            )}
            <Button
              onClick={handleExitTest}
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 px-6 py-2"
            >
              Exit Test
            </Button>
          </div>

          {isPaused && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg text-center shadow-lg"
            >
              <p className="text-yellow-800 font-semibold text-lg">⏸️ Test Paused</p>
              <p className="text-yellow-700 mt-1">Click Resume to continue your test</p>
            </motion.div>
          )}
          <QuestionCard
            questionNumber={currentQuestionIndex + 1}
            questionText={currentQuestion.question}
            options={currentQuestion.options || []}
            selectedAnswer={currentAnswer?.answer}
            onAnswerChange={handleAnswerChange}
            onSaveAndNext={handleSaveAndNext}
            onMarkForReview={handleMarkForReview}
            onClearResponse={handleClearResponse}
            isLastQuestion={currentQuestionIndex === questions.length - 1}
          />
        </div>

        <QuestionPalette
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          getQuestionStatus={getQuestionStatus}
          onQuestionClick={handleQuestionClick}
          onSubmitTest={handleSubmitTest}
          showOnMobile={showQuestionPalette}
          onClose={() => setShowQuestionPalette(false)}
        />
      </div>

      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="z-[100]">
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Test?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to exit? All unsaved answers may be lost. Your current progress will be saved, but you won't be able to resume this test session.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelExit}>
              No, Continue Test
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmExit}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Exit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}