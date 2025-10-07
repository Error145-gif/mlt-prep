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

type Answer = {
  questionId: Id<"questions">;
  answer: string;
  status: "answered" | "marked" | "not-answered" | "marked-answered";
};

export default function TestStart() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
  // Only set topicId if it exists and is not "general"
  const topicId = topicIdParam && topicIdParam !== "general" ? (topicIdParam as Id<"topics">) : undefined;
  const year = searchParams.get("year") ? parseInt(searchParams.get("year")!) : undefined;

  const startTest = useMutation(api.student.startTest);
  const submitTest = useMutation(api.student.submitTest);

  // Fetch questions for the test
  const testQuestions = useQuery(api.student.getTestQuestions, {
    testType,
    ...(topicId && { topicId }),
    ...(year && { year }),
  });

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
      setTestName(`PYQ ${year || ""}`);
    } else if (testType === "ai") {
      setTestName("AI Generated Questions");
    }
  }, [testType, year]);

  const questions = testQuestions || [];

  // Set initial timer based on test type and question count
  useEffect(() => {
    if (questions.length > 0 && timeRemaining === 0) {
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
    const question = questions[currentQuestionIndex];
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
    const question = questions[currentQuestionIndex];
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
    const question = questions[currentQuestionIndex];
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
      navigate(`/test/results?sessionId=${sessionId}`);
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

  if (isLoading || !questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-gray-700 text-xl font-medium">Loading test...</div>
      </div>
    );
  }

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{testName}</h1>
            <div className="flex items-center gap-3">
              {userProfile?.avatarUrl ? (
                <Avatar className="h-10 w-10 border-2 border-blue-600 shadow-md">
                  <AvatarImage src={userProfile.avatarUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {userProfile.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <User className="h-10 w-10 text-blue-600" />
              )}
              <span className="font-semibold text-gray-800">{userProfile?.name || "Student"}</span>
            </div>
          </div>

          <Card className="p-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4">General Instructions:</h2>
            
            <div className="space-y-4 text-gray-700">
              <p>
                1. The clock will be set at the server. The countdown timer at the top right corner of screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself. You need not terminate the examination or submit your paper.
              </p>

              <p>2. The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols:</p>
              
              <div className="ml-6 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-gray-400 bg-white"></div>
                  <span>You have not visited the question yet.</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-500"></div>
                  <span>You have not answered the question.</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500"></div>
                  <span>You have answered the question.</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-purple-500"></div>
                  <span>You have NOT answered the question, but have marked the question for review.</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-orange-500"></div>
                  <span>You have answered the question, but marked it for review.</span>
                </div>
              </div>

              <p className="font-medium mt-4">
                The <strong>Mark For Review</strong> status for a question simply indicates that you would like to look at that question again. If a question is answered, but marked for review, then the answer will be considered for evaluation unless the status is modified by the candidate.
              </p>

              <h3 className="font-bold mt-6">Navigating to a Question:</h3>
              <p>3. To answer a question, do the following:</p>
              <div className="ml-6 space-y-2">
                <p>a. Click on the question number in the Question Palette at the right of your screen to go to that numbered question directly. Note that using this option does NOT save your answer to the current question.</p>
                <p>b. Click on <strong>Save & Next</strong> to save your answer for the current question and then go to the next question.</p>
                <p>c. Click on <strong>Mark for Review & Next</strong> to save your answer for the current question and also mark it for review, and then go to the next question.</p>
              </div>

              <p className="mt-4">
                Note that your answer for the current question will not be saved, if you navigate to another question directly by clicking on a question number without saving the answer to the previous question.
              </p>

              <p>
                You can view all the questions by clicking on the <strong>Question Paper</strong> button. This feature is provided, so that if you want you can just see the entire question paper at a glance.
              </p>

              <h3 className="font-bold mt-6">Answering a Question:</h3>
              <p>4. Procedure for answering a multiple choice (MCQ) type question:</p>
              <div className="ml-6 space-y-2">
                <p>a. Choose one answer from the 4 options (A,B,C,D) given below the question, click on the bubble placed before the chosen option.</p>
                <p>b. To deselect your chosen answer, click on the bubble of the chosen option again or click on the <strong>Clear Response</strong> button.</p>
                <p>c. To change your chosen answer, click on the bubble of another option.</p>
                <p>d. To save your answer, you MUST click on the <strong>Save & Next</strong> button.</p>
              </div>

              <p className="mt-4">
                5. To mark a question for review, click on the <strong>Mark for Review & Next</strong> button. If an answer is selected (for MCQ/MCAQ) entered (for numerical answer type) for a question that is <strong>Marked for Review</strong>, that answer will be considered in the evaluation unless the status is modified by the candidate.
              </p>

              <p>
                6. To change your answer to a question that has already been answered, first select that question for answering and then follow the procedure for answering that type of question.
              </p>

              <p>
                7. Note that ONLY Questions for which answers are <strong>saved</strong> or <strong>marked for review after answering</strong> will be considered for evaluation.
              </p>
            </div>

            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded">
              <p className="text-red-800 font-medium">
                Please note that by default the question language is English. If you want you can just see the entire question paper in your preferred language by selecting the language from the dropdown.
              </p>
            </div>

            <div className="mt-8 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="accept"
                  checked={acceptedInstructions}
                  onCheckedChange={(checked) => setAcceptedInstructions(checked as boolean)}
                  className="mt-1 h-5 w-5 border-2 border-blue-600 data-[state=checked]:bg-blue-600"
                />
                <Label htmlFor="accept" className="text-base cursor-pointer text-gray-900 font-medium leading-relaxed">
                  I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall. I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations.
                </Label>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                onClick={handleStartTest}
                disabled={!acceptedInstructions}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                Start Test
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.get(currentQuestion._id);
  const answeredCount = Array.from(answers.values()).filter(a => a.answer).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col">
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
          {testType === "mock" && (
            <Button
              onClick={isPaused ? handleResumeTest : handlePauseTest}
              variant="outline"
              className="w-full mt-3 border-yellow-500 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 font-semibold"
            >
              {isPaused ? "▶️ Resume Test" : "⏸️ Pause Test"}
            </Button>
          )}
          <Button
            onClick={handleExitTest}
            variant="outline"
            className="w-full mt-3 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            Exit Test
          </Button>
        </div>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          {isPaused && (
            <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg text-center">
              <p className="text-yellow-800 font-semibold text-lg">⏸️ Test Paused</p>
              <p className="text-yellow-700 mt-1">Click Resume to continue your test</p>
            </div>
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
          
          {/* Add Pause and Exit buttons for mobile users */}
          <div className="md:hidden mt-6 flex justify-center gap-3">
            {testType === "mock" && (
              <Button
                onClick={isPaused ? handleResumeTest : handlePauseTest}
                variant="outline"
                className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 px-6 font-semibold"
              >
                {isPaused ? "▶️ Resume" : "⏸️ Pause"}
              </Button>
            )}
            <Button
              onClick={handleExitTest}
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 px-6"
            >
              Exit Test
            </Button>
          </div>
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
        <AlertDialogContent>
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