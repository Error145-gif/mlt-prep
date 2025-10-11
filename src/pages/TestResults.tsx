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

  // Enhanced loading state
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
  const marksObtained = correctAnswers;
  const totalMarks = totalQuestions;

  // Dynamic test type display
  const getTestTypeInfo = () => {
    if (session.testType === "ai") {
      return {
        name: "AI-Based Questions",
        icon: "🤖",
        color: "from-purple-500 to-pink-500"
      };
    } else if (session.testType === "pyq") {
      return {
        name: "PYQ Set",
        icon: "📚",
        color: "from-blue-500 to-cyan-500"
      };
    } else {
      return {
        name: "Mock Test",
        icon: "⏱️",
        color: "from-orange-500 to-red-500"
      };
    }
  };

  const testTypeInfo = getTestTypeInfo();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Dynamic motivational message based on score
  const getMotivationalMessage = () => {
    if (score >= 90) {
      return {
        message: "🔥 Incredible! You're mastering this section.",
        quote: "Excellence is not a destination; it is a continuous journey.",
        color: "text-green-600"
      };
    } else if (score >= 70) {
      return {
        message: "👏 Great work! Keep your pace strong.",
        quote: "Success is the sum of small efforts repeated day in and day out.",
        color: "text-blue-600"
      };
    } else if (score >= 50) {
      return {
        message: "⚡ Good attempt! Practice more to boost confidence.",
        quote: "Every expert was once a beginner. Keep practicing!",
        color: "text-yellow-600"
      };
    } else {
      return {
        message: "🌱 Don't worry — every mistake builds your foundation.",
        quote: "Consistency beats talent when talent doesn't stay consistent.",
        color: "text-purple-600"
      };
    }
  };

  const motivation = getMotivationalMessage();

  // Accuracy color coding
  const getAccuracyColor = () => {
    if (score >= 85) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Speed comparison (mock calculation)
  const avgTimePerQuestion = totalQuestions > 0 ? timeSpent / totalQuestions : 0;
  const speedPercentile = avgTimePerQuestion < 25 ? 75 : avgTimePerQuestion < 35 ? 50 : 25;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header with User Info */}
      <div className={`bg-gradient-to-r ${testTypeInfo.color} text-white px-6 py-6 shadow-lg`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              {userProfile?.avatarUrl ? (
                <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                  <AvatarImage src={userProfile.avatarUrl} />
                  <AvatarFallback className="bg-white text-blue-600 font-bold">
                    {userProfile.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                  <AvatarFallback className="bg-white text-blue-600 font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              )}
              <div>
                <p className="text-2xl font-bold">{user?.name || "Student"}</p>
                <p className="text-sm opacity-90">Test Results</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="opacity-80">Test Type</p>
              <p className="font-bold text-lg">{testTypeInfo.icon} {testTypeInfo.name}</p>
            </div>
            <div>
              <p className="opacity-80">Attempt Date</p>
              <p className="font-semibold">{formatDate(session._creationTime)}</p>
            </div>
            <div>
              <p className="opacity-80">Time Taken</p>
              <p className="font-semibold">⏱️ {formatTime(timeSpent)}</p>
            </div>
            <div>
              <p className="opacity-80">Total Questions</p>
              <p className="font-semibold">🧩 {totalQuestions}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Animated Accuracy Circle */}
        <Card className="p-8 bg-white shadow-xl">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative w-48 h-48">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke={score >= 85 ? "#4CAF50" : score >= 60 ? "#FFC107" : "#F44336"}
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(score / 100) * 553} 553`}
                    strokeLinecap="round"
                    className="transition-all duration-2000 ease-out animate-in"
                    style={{
                      animation: 'drawCircle 2s ease-out forwards',
                      strokeDashoffset: 553,
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-in fade-in zoom-in duration-1000" style={{ animationDelay: '500ms' }}>
                    <p className={`text-5xl font-bold ${getAccuracyColor()} animate-in zoom-in duration-700`} style={{ animationDelay: '1000ms' }}>
                      {score.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600 mt-1 animate-in fade-in duration-500" style={{ animationDelay: '1500ms' }}>Accuracy</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className={`text-2xl font-bold ${motivation.color} mb-2`}>
                {motivation.message}
              </h2>
              <p className="text-gray-600 italic">"{motivation.quote}"</p>
            </div>
          </div>
        </Card>

        {/* Performance Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-300 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-700 font-medium">Correct</p>
            <p className="text-3xl font-bold text-green-900">{correctAnswers}</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-300 text-center">
            <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm text-red-700 font-medium">Wrong</p>
            <p className="text-3xl font-bold text-red-900">{incorrectAnswers}</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 text-center">
            <MinusCircle className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-700 font-medium">Skipped</p>
            <p className="text-3xl font-bold text-gray-900">{skippedAnswers}</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300 text-center">
            <Trophy className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-purple-700 font-medium">Marks</p>
            <p className="text-2xl font-bold text-purple-900">{marksObtained}/{totalMarks}</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300 text-center">
            <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm text-orange-700 font-medium">Rank</p>
            <p className="text-2xl font-bold text-orange-900">#{rank}</p>
            <p className="text-xs text-orange-600">of {totalCandidates}</p>
          </Card>
        </div>

        {/* Rank & Speed Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 bg-white shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🏆 Leaderboard Position</h3>
            <div className="space-y-2">
              <p className="text-gray-700">Total Students Attempted: <span className="font-bold">{totalCandidates}</span></p>
              <p className="text-gray-700">Your Rank: <span className="font-bold text-orange-600">#{rank}</span></p>
              <div className="mt-4 bg-gradient-to-r from-orange-100 to-yellow-100 p-4 rounded-lg">
                <p className="text-sm text-gray-800">
                  {rank <= totalCandidates * 0.1 ? "🌟 You're in the top 10%!" : 
                   rank <= totalCandidates * 0.25 ? "⭐ You're in the top 25%!" :
                   "Keep practicing to improve your rank!"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">⏱️ Time Analytics</h3>
            <div className="space-y-2">
              <p className="text-gray-700">Avg Time/Question: <span className="font-bold">{avgTimePerQuestion.toFixed(1)}s</span></p>
              <p className="text-gray-700">Your Speed: 
                <span className={`font-bold ml-2 ${speedPercentile >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {speedPercentile >= 70 ? '🔥 Faster than ' + speedPercentile + '% of users' : 
                   '⏳ Try to answer a bit quicker next time'}
                </span>
              </p>
            </div>
          </Card>
        </div>

        {/* Color Legend */}
        <Card className="p-4 bg-white shadow-md">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="font-medium">🟩 Correct</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="font-medium">🟥 Wrong</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span className="font-medium">⬜ Skipped</span>
            </div>
          </div>
        </Card>

        {/* Detailed Question Review */}
        <Card className="p-6 bg-white shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">📝 Detailed Question Review</h3>
          <div className="space-y-6">
            {questions.map((q: any, index: number) => {
              const isCorrect = q.isCorrect === true;
              const wasAnswered = q.userAnswer !== undefined && q.userAnswer !== null && q.userAnswer !== "";
              
              // Robust normalization matching backend
              const normalize = (text: string) => {
                if (!text) return "";
                return text.trim().toLowerCase().replace(/\s+/g, ' ');
              };
              
              return (
                <div
                  key={q._id}
                  className={`p-6 rounded-xl border-2 shadow-md ${
                    isCorrect
                      ? "bg-green-50 border-green-400"
                      : wasAnswered
                      ? "bg-red-50 border-red-400"
                      : "bg-gray-50 border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-bold text-xl text-gray-900">Q{index + 1}.</span>
                      {isCorrect ? (
                        <Badge className="bg-green-600 text-white text-sm">✅ Correct</Badge>
                      ) : wasAnswered ? (
                        <Badge className="bg-red-600 text-white text-sm">❌ Wrong</Badge>
                      ) : (
                        <Badge className="bg-gray-600 text-white text-sm">⏭️ Skipped</Badge>
                      )}
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                        1 Mark
                      </Badge>
                    </div>
                    {q.difficulty && (
                      <Badge variant="outline" className="capitalize text-xs">
                        {q.difficulty}
                      </Badge>
                    )}
                  </div>

                  <p className="text-gray-900 font-medium mb-5 text-lg leading-relaxed">{q.question}</p>

                  {q.type === "mcq" && q.options && (
                    <div className="space-y-3 ml-4">
                      {q.options.map((option: string, idx: number) => {
                        const normalizedOption = normalize(option);
                        const normalizedCorrectAnswer = normalize(q.correctAnswer || "");
                        const normalizedUserAnswer = normalize(q.userAnswer || "");
                        
                        const isCorrectAnswer = normalizedOption === normalizedCorrectAnswer;
                        const isUserAnswer = normalizedOption === normalizedUserAnswer;
                        
                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              isCorrectAnswer
                                ? "bg-green-100 border-green-500 font-semibold shadow-sm"
                                : isUserAnswer && !isCorrectAnswer
                                ? "bg-red-100 border-red-500 shadow-sm"
                                : "bg-white border-gray-200"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                {isCorrectAnswer && (
                                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                                )}
                                {isUserAnswer && !isCorrectAnswer && (
                                  <XCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                                )}
                                <span className="text-gray-900 text-base">{option}</span>
                              </div>
                              {isCorrectAnswer && (
                                <span className="text-green-700 font-bold text-sm whitespace-nowrap">
                                  ✓ Correct Answer
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {!wasAnswered && (
                    <div className="mt-4 p-4 bg-gray-100 border-l-4 border-gray-400 rounded">
                      <p className="text-sm font-semibold text-gray-700">⏭️ You skipped this question.</p>
                      <p className="text-sm text-gray-600 mt-1">Correct Answer: <span className="font-bold text-green-700">{q.correctAnswer}</span></p>
                    </div>
                  )}

                  {q.explanation && (
                    <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                      <p className="text-sm font-bold text-blue-900 mb-2">💡 Explanation:</p>
                      <p className="text-sm text-blue-800 leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* AI Suggestion Box */}
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300 shadow-lg">
          <h3 className="text-xl font-bold text-purple-900 mb-3">💡 AI Suggestion</h3>
          <p className="text-gray-800 mb-2">
            {incorrectAnswers > totalQuestions * 0.3 
              ? "Focus on improving your weak areas based on your wrong answers."
              : "Great job! Keep practicing to maintain consistency."}
          </p>
          <p className="text-gray-700">
            {session.testType === "pyq" 
              ? "Try taking more PYQ sets this week to build exam confidence."
              : session.testType === "ai"
              ? "AI questions help you think critically — keep solving them!"
              : "Mock tests simulate real exams — practice regularly for best results."}
          </p>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pb-8">
          <Button
            onClick={() => {
              const testType = session.testType;
              if (testType === "mock") navigate("/tests/mock");
              else if (testType === "pyq") navigate("/tests/pyq");
              else if (testType === "ai") navigate("/tests/ai");
              else navigate("/dashboard");
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 text-lg font-semibold shadow-lg"
          >
            🔁 Retake Test
          </Button>
          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
            className="px-10 py-4 text-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            📘 Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}