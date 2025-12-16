// @ts-nocheck
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useSearchParams } from "react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Id } from "@/convex/_generated/dataModel";
import { Lock } from "lucide-react";

// New Components
import TestResultHeader from "@/components/test-results/TestResultHeader";
import AccuracyChart from "@/components/test-results/AccuracyChart";
import StatsGrid from "@/components/test-results/StatsGrid";
import RankAnalytics from "@/components/test-results/RankAnalytics";
import QuestionReview from "@/components/test-results/QuestionReview";

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
  const subscriptionAccess = useQuery(api.student.checkSubscriptionAccess);

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

  // Determine user type - PAID has highest priority
  const isPaidUser = subscriptionAccess?.hasAccess && subscriptionAccess?.isPaid;
  const isFreeTrialUser = !isPaidUser && subscriptionAccess?.reason === "free_trial";

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

  // Speed comparison (mock calculation)
  const avgTimePerQuestion = totalQuestions > 0 ? timeSpent / totalQuestions : 0;
  const speedPercentile = avgTimePerQuestion < 25 ? 75 : avgTimePerQuestion < 35 ? 50 : 25;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      
      {/* Header with User Info */}
      <TestResultHeader 
        user={user} 
        userProfile={userProfile} 
        testTypeInfo={testTypeInfo} 
        session={session} 
        timeSpent={timeSpent} 
        totalQuestions={totalQuestions} 
      />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Animated Accuracy Circle */}
        <AccuracyChart score={score} motivation={motivation} />

        {/* FREE TRIAL CONVERSION MESSAGE - Show after accuracy */}
        {isFreeTrialUser && score < 70 && (
          <Card className="p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl border-2 border-orange-600">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">⚠️ Your score is below the safe exam range.</h3>
              <p className="text-lg">
                Trial access shows level, not full preparation.<br />
                Unlock complete practice, explanations, and AI guidance.
              </p>
              <Button 
                onClick={() => navigate("/subscription-plans")}
                className="bg-white text-red-600 hover:bg-white/90 font-semibold text-lg px-8 py-3"
              >
                Upgrade Now – Unlock Full Access
              </Button>
            </div>
          </Card>
        )}

        {/* Performance Stats Grid - Always visible */}
        <StatsGrid 
          correctAnswers={correctAnswers} 
          incorrectAnswers={incorrectAnswers} 
          skippedAnswers={skippedAnswers} 
          marksObtained={marksObtained} 
          totalMarks={totalMarks} 
          rank={rank} 
          totalCandidates={totalCandidates} 
        />

        {/* Rank & Speed Analytics - Locked for free trial */}
        {!isFreeTrialUser ? (
          <RankAnalytics 
            rank={rank} 
            totalCandidates={totalCandidates} 
            avgTimePerQuestion={avgTimePerQuestion} 
            speedPercentile={speedPercentile} 
          />
        ) : (
          <Card className="p-6 bg-gray-100 border-2 border-gray-400 shadow-lg relative">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-10">
              <Lock className="h-12 w-12 text-white mb-2" />
              <p className="text-white font-semibold text-lg text-center px-4">🔒 Rank & Speed Analytics available with Full Access</p>
            </div>
            <div className="opacity-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-white shadow-lg rounded-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">🏆 Leaderboard Position</h3>
                  <p className="text-gray-700">Hidden content...</p>
                </div>
                <div className="p-6 bg-white shadow-lg rounded-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">⏱️ Time Analytics</h3>
                  <p className="text-gray-700">Hidden content...</p>
                </div>
              </div>
            </div>
          </Card>
        )}

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

        {/* Detailed Question Review - Pass user type to component */}
        <QuestionReview questions={questions} isFreeTrialUser={isFreeTrialUser} />

        {/* AI Suggestion Box - Locked for free trial */}
        {!isFreeTrialUser ? (
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
        ) : (
          <Card className="p-6 bg-gray-100 border-2 border-gray-400 shadow-lg relative">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center">
              <Lock className="h-12 w-12 text-white mb-2" />
              <p className="text-white font-semibold text-lg">🔒 AI-based performance analysis unlocked after upgrade</p>
            </div>
            <div className="opacity-20">
              <h3 className="text-xl font-bold text-purple-900 mb-3">💡 AI Suggestion</h3>
              <p className="text-gray-800">Hidden content...</p>
            </div>
          </Card>
        )}

        {/* Action Buttons - Modified for free trial */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pb-8">
          {!isFreeTrialUser ? (
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
          ) : (
            <Button
              disabled
              className="bg-gray-400 text-gray-700 px-10 py-4 text-lg font-semibold cursor-not-allowed relative"
            >
              <Lock className="h-5 w-5 mr-2" />
              🔒 Retake test available with Full Access
            </Button>
          )}
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