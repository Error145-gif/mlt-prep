import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useSearchParams } from "react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Id } from "@/convex/_generated/dataModel";
import { Clock, CheckCircle, XCircle, MinusCircle, Trophy, TrendingUp, Target } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TestResults() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const sessionId = searchParams.get("sessionId") as Id<"testSessions"> | null;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
    if (!sessionId) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate, sessionId]);

  const testResults = useQuery(
    api.student.getTestResults,
    sessionId ? { sessionId } : "skip"
  );

  const userProfile = useQuery(api.users.getUserProfile);

  // Enhanced loading state with progress indicator
  if (isLoading || !testResults) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <div className="text-gray-900 text-xl font-medium">Loading results...</div>
          <div className="text-gray-600 text-sm">Calculating your score and rank</div>
        </div>
      </div>
    );
  }

  const { session, result, questions, rank, totalCandidates } = testResults;
  const score = result?.score || 0;
  const correctAnswers = result?.correctAnswers || 0;
  const incorrectAnswers = result?.incorrectAnswers || 0;
  const skippedAnswers = result?.skippedAnswers || 0;
  const totalQuestions = result?.totalQuestions || 0;
  const timeSpent = result?.timeSpent || 0;
  const marksObtained = correctAnswers; // 1 mark per correct answer
  const totalMarks = totalQuestions; // 1 mark per question

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreMessage = () => {
    if (score >= 80) {
      return {
        icon: <Trophy className="h-12 w-12 text-yellow-500" />,
        title: "Outstanding Performance! 🎉",
        message: "Excellent work! You've demonstrated strong understanding of the material.",
        color: "from-yellow-400 to-orange-500"
      };
    } else if (score >= 50) {
      return {
        icon: <TrendingUp className="h-12 w-12 text-blue-500" />,
        title: "Good Job! 👍",
        message: "You're making progress! Keep practicing to improve further.",
        color: "from-blue-400 to-purple-500"
      };
    } else {
      return {
        icon: <Target className="h-12 w-12 text-purple-500" />,
        title: "Keep Going! 💪",
        message: "Don't give up! Review the topics and try again. Every attempt makes you stronger.",
        color: "from-purple-400 to-pink-500"
      };
    }
  };

  const scoreMessage = getScoreMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Test Results
        </h1>
        <div className="flex items-center gap-3">
          {userProfile?.avatarUrl ? (
            <Avatar className="h-10 w-10 border-2 border-blue-600 shadow-md">
              <AvatarImage src={userProfile.avatarUrl} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {userProfile.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-10 w-10 border-2 border-blue-600 shadow-md">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          )}
          <span className="font-medium text-gray-900">{user?.name || "Student"}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Score Card */}
        <Card className="p-8 bg-white shadow-lg">
          <div className="text-center space-y-4">
            <div className="flex justify-center">{scoreMessage.icon}</div>
            <h2 className="text-3xl font-bold text-gray-900">{scoreMessage.title}</h2>
            <p className="text-gray-600 text-lg">{scoreMessage.message}</p>
            
            <div className="flex justify-center items-center gap-4 mt-6">
              <div className={`text-6xl font-bold bg-gradient-to-r ${scoreMessage.color} bg-clip-text text-transparent`}>
                {score.toFixed(2)}%
              </div>
            </div>
          </div>
        </Card>

        {/* Marks and Rank Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center gap-3">
              <Trophy className="h-10 w-10 text-purple-600" />
              <div>
                <p className="text-sm text-purple-700 font-medium">Marks Obtained</p>
                <p className="text-3xl font-bold text-purple-900">{marksObtained} / {totalMarks}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center gap-3">
              <Target className="h-10 w-10 text-orange-600" />
              <div>
                <p className="text-sm text-orange-700 font-medium">Your Rank</p>
                <p className="text-3xl font-bold text-orange-900">
                  {rank} / {totalCandidates}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-10 w-10 text-green-600" />
              <div>
                <p className="text-sm text-green-700 font-medium">Correct</p>
                <p className="text-3xl font-bold text-green-900">{correctAnswers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex items-center gap-3">
              <XCircle className="h-10 w-10 text-red-600" />
              <div>
                <p className="text-sm text-red-700 font-medium">Incorrect</p>
                <p className="text-3xl font-bold text-red-900">{incorrectAnswers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
            <div className="flex items-center gap-3">
              <MinusCircle className="h-10 w-10 text-gray-600" />
              <div>
                <p className="text-sm text-gray-700 font-medium">Skipped</p>
                <p className="text-3xl font-bold text-gray-900">{skippedAnswers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center gap-3">
              <Clock className="h-10 w-10 text-blue-600" />
              <div>
                <p className="text-sm text-blue-700 font-medium">Time Taken</p>
                <p className="text-2xl font-bold text-blue-900">{formatTime(timeSpent)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Question Review */}
        <Card className="p-6 bg-white shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Question Review</h3>
          <div className="space-y-6">
            {questions.map((q: any, index: number) => {
              // Use the backend-validated isCorrect flag - this is the source of truth
              const isCorrect = q.isCorrect === true;
              const wasAnswered = q.userAnswer !== undefined && q.userAnswer !== null && q.userAnswer !== "";
              
              return (
                <div
                  key={q._id}
                  className={`p-6 rounded-lg border-2 ${
                    isCorrect
                      ? "bg-green-50 border-green-300"
                      : wasAnswered
                      ? "bg-red-50 border-red-300"
                      : "bg-gray-50 border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg text-gray-900">Q{index + 1}.</span>
                      {isCorrect ? (
                        <Badge className="bg-green-600 text-white">Correct ✓</Badge>
                      ) : wasAnswered ? (
                        <Badge className="bg-red-600 text-white">Incorrect ✗</Badge>
                      ) : (
                        <Badge className="bg-gray-600 text-white">Skipped</Badge>
                      )}
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                        1 Mark
                      </Badge>
                    </div>
                    {q.difficulty && (
                      <Badge variant="outline" className="capitalize">
                        {q.difficulty}
                      </Badge>
                    )}
                  </div>

                  <p className="text-gray-900 font-medium mb-4">{q.question}</p>

                  {q.type === "mcq" && q.options && (
                    <div className="space-y-2 ml-6">
                      {q.options.map((option: string, idx: number) => {
                        // Simple normalization - ONLY trim and lowercase
                        const normalize = (text: string) => {
                          if (!text) return "";
                          return text.trim().toLowerCase();
                        };
                        
                        const normalizedUserAnswer = normalize(q.userAnswer || "");
                        const normalizedOption = normalize(option);
                        const normalizedCorrectAnswer = normalize(q.correctAnswer || "");
                        
                        const isUserAnswer = normalizedUserAnswer === normalizedOption;
                        const isCorrectAnswer = normalizedCorrectAnswer === normalizedOption;
                        
                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg border-2 ${
                              isCorrectAnswer
                                ? "bg-green-100 border-green-400 font-semibold"
                                : isUserAnswer && !isCorrectAnswer
                                ? "bg-red-100 border-red-400"
                                : "bg-white border-gray-200"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                {isCorrectAnswer && (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                )}
                                {isUserAnswer && !isCorrectAnswer && (
                                  <XCircle className="h-5 w-5 text-red-600" />
                                )}
                                <span className="text-gray-900">{option}</span>
                              </div>
                              {isCorrectAnswer && (
                                <span className="text-green-700 font-semibold text-sm whitespace-nowrap">
                                  Correct Answer
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {q.explanation && (
                    <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                      <p className="text-sm font-semibold text-blue-900 mb-1">💡 Explanation:</p>
                      <p className="text-sm text-blue-800">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pb-8">
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
          >
            Back to Dashboard
          </Button>
          <Button
            onClick={() => {
              const testType = session.testType;
              if (testType === "mock") navigate("/tests/mock");
              else if (testType === "pyq") navigate("/tests/pyq");
              else if (testType === "ai") navigate("/tests/ai");
              else navigate("/dashboard");
            }}
            variant="outline"
            className="px-8 py-3 text-lg border-2"
          >
            Take Another Test
          </Button>
        </div>
      </div>
    </div>
  );
}