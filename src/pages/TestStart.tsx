import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { User, Clock } from "lucide-react";

type Answer = {
  questionId: Id<"questions">;
  answer: string;
  status: "answered" | "marked" | "not-answered" | "marked-answered";
};

export default function TestStart() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showInstructions, setShowInstructions] = useState(true);
  const [acceptedInstructions, setAcceptedInstructions] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, Answer>>(new Map());
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set([0]));
  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // 60 minutes in seconds
  const [sessionId, setSessionId] = useState<Id<"testSessions"> | null>(null);

  const testType = searchParams.get("type") || "mock";
  const topicIdParam = searchParams.get("topicId");
  const topicId = topicIdParam ? (topicIdParam as Id<"topics">) : undefined;
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

  // Timer countdown
  useEffect(() => {
    if (!showInstructions && timeRemaining > 0) {
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
  }, [showInstructions, timeRemaining]);

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
      navigate("/dashboard");
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

  if (isLoading || !questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading test...</div>
      </div>
    );
  }

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{testName}</h1>
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 text-blue-600" />
              <span className="font-medium">{user?.name || "Student"}</span>
            </div>
          </div>

          <Card className="p-8">
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

            <div className="mt-8 flex items-center gap-3">
              <Checkbox
                id="accept"
                checked={acceptedInstructions}
                onCheckedChange={(checked) => setAcceptedInstructions(checked as boolean)}
              />
              <Label htmlFor="accept" className="text-base cursor-pointer">
                I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall. I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations.
              </Label>
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-3 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-900">{testName}</h1>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="h-5 w-5" />
            <span className="font-mono text-lg font-semibold">{formatTime(timeRemaining)}</span>
          </div>
          <Button variant="outline" size="sm">
            Enter Full Screen
          </Button>
          <div className="flex items-center gap-2">
            <User className="h-8 w-8 text-blue-600" />
            <span className="font-medium">{user?.name || "Student"}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Left Sidebar - Sections */}
        <div className="w-48 bg-white border-r p-4">
          <h3 className="font-semibold mb-3 text-gray-700">SECTIONS</h3>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Test
          </Button>
        </div>

        {/* Main Content - Question Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-lg">Question No. {currentQuestionIndex + 1}</span>
                <span className="text-sm text-gray-600">Marks: +1 / -0.33</span>
                <span className="text-sm text-gray-600">Time: 00:00</span>
              </div>
              <span className="text-sm text-gray-600">View in English</span>
            </div>

            <div className="mb-6">
              <p className="text-lg text-gray-900 mb-4">{currentQuestion.question}</p>

              {currentQuestion.type === "mcq" && currentQuestion.options && (
                <RadioGroup
                  value={currentAnswer?.answer || ""}
                  onValueChange={handleAnswerChange}
                >
                  <div className="space-y-3">
                    {currentQuestion.options.map((option: string, idx: number) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <RadioGroupItem value={option} id={`option-${idx}`} />
                        <Label htmlFor={`option-${idx}`} className="cursor-pointer text-base">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleMarkForReview}
                className="bg-purple-50 hover:bg-purple-100 text-purple-700"
              >
                Mark for Review & Next
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClearResponse}>
                  Clear Response
                </Button>
                <Button
                  onClick={handleSaveAndNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save & Next
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sidebar - Question Palette */}
        <div className="w-80 bg-white border-l p-4 overflow-y-auto">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">SECTION: Test</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, index) => {
                const status = getQuestionStatus(index);
                return (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(index)}
                    className={`w-10 h-10 rounded flex items-center justify-center font-medium ${getStatusColor(status)} ${
                      currentQuestionIndex === index ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 text-sm mt-6">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-500 rounded"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-red-500 rounded"></div>
              <span>Not Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-200 rounded border-2 border-gray-400"></div>
              <span>Not Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-purple-500 rounded"></div>
              <span>Marked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-orange-500 rounded"></div>
              <span>Marked & Answered</span>
            </div>
          </div>

          <Button
            onClick={handleSubmitTest}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white"
          >
            Submit Test
          </Button>
        </div>
      </div>
    </div>
  );
}