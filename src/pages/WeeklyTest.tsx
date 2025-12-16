import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Trophy, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import StudentNav from "@/components/StudentNav";
import { QuestionCard } from "@/components/QuestionCard";

export default function WeeklyTest() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [startTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // 60 minutes in seconds

  const currentTest = useQuery(api.weeklyTests.getCurrentWeeklyTest);
  const questions = useQuery(
    api.weeklyTests.getWeeklyTestQuestions,
    currentTest?._id ? { weeklyTestId: currentTest._id } : "skip"
  );
  const hasAttempted = useQuery(
    api.weeklyTests.hasUserAttemptedWeeklyTest,
    currentTest?._id ? { weeklyTestId: currentTest._id } : "skip"
  );
  const submitAttempt = useMutation(api.weeklyTests.submitWeeklyTestAttempt);

  // Timer countdown effect - runs for ALL users
  useEffect(() => {
    if (!questions || (questions as any).error || hasAttempted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questions, hasAttempted]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading || !currentTest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  const isReady = currentTest && (currentTest.status === "active" || (currentTest.status === "scheduled" && (currentTest.scheduledDate || 0) <= Date.now()));

  // Handle SCHEDULED status - show clear message
  if (currentTest && currentTest.status === "scheduled") {
    const scheduledDate = currentTest.scheduledDate ? new Date(currentTest.scheduledDate) : null;
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <StudentNav />
        <div className="max-w-2xl mx-auto p-6 pt-24">
          <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-6 w-6" />
                🕒 Sunday Free Test
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white/90 space-y-4">
              <p className="text-lg">This test will be active on Sunday.</p>
              {scheduledDate && (
                <p className="text-xl font-semibold">
                  Available on: {scheduledDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </p>
              )}
              <p className="text-white/70">Please come back on Sunday to attempt the test.</p>
              <Button onClick={() => navigate("/student")} className="mt-6">
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Handle no test or inactive test
  if (!currentTest || !isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <StudentNav />
        <div className="max-w-2xl mx-auto p-6 pt-24">
          <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertCircle className="h-6 w-6" />
                Weekly Test Not Available
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white/90">
              <p>No weekly test available at the moment. Check back soon!</p>
              <Button onClick={() => navigate("/student")} className="mt-6">
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (hasAttempted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <StudentNav />
        <div className="max-w-2xl mx-auto p-6 pt-24">
          <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-400" />
                Test Already Completed
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white/90">
              <p className="mb-4">You have already attempted this week's test.</p>
              <p className="text-white/70 mb-6">Check the leaderboard to see your ranking!</p>
              <div className="flex gap-4">
                <Button onClick={() => navigate("/weekly-leaderboard")} variant="outline" className="bg-white/10 border-white/30 text-white">
                  View Leaderboard
                </Button>
                <Button onClick={() => navigate("/student")}>
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!questions || (questions as any).error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20 p-6">
          <p className="text-white">{(questions as any)?.error || "Loading questions..."}</p>
        </Card>
      </div>
    );
  }

  const currentQuestion = (questions as any)[currentQuestionIndex];
  const totalQuestions = (questions as any).length;

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion._id]: answer });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < totalQuestions) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      const totalTimeSpent = Math.floor((Date.now() - startTime) / 1000);
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId: questionId as any,
        answer,
      }));

      const result = await submitAttempt({
        weeklyTestId: currentTest._id,
        answers: formattedAnswers,
        totalTimeSpent,
      });

      toast.success(`Test submitted! Score: ${Math.round(result.score)}%`);
      navigate("/weekly-leaderboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit test");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
      <StudentNav />
      <div className="max-w-4xl mx-auto p-6 pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20 mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">{currentTest.title}</CardTitle>
                <div className="flex items-center gap-4">
                  {/* Timer - visible to ALL users */}
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    timeRemaining < 300 ? 'bg-red-500/30 border-2 border-red-500' : 'bg-white/10'
                  }`}>
                    <Clock className={`h-5 w-5 ${timeRemaining < 300 ? 'text-red-300' : 'text-white'}`} />
                    <span className={`font-bold text-lg ${timeRemaining < 300 ? 'text-red-300' : 'text-white'}`}>
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                  <div className="text-white">
                    Question {currentQuestionIndex + 1} / {totalQuestions}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <QuestionCard
            questionNumber={currentQuestionIndex + 1}
            questionText={currentQuestion.text || currentQuestion.question || ""}
            options={currentQuestion.options}
            selectedAnswer={answers[currentQuestion._id]}
            onAnswerChange={handleAnswer}
            onSaveAndNext={handleNext}
            onMarkForReview={() => {
              handleAnswer(answers[currentQuestion._id] || "");
              handleNext();
            }}
            onClearResponse={() => {
              const newAnswers = { ...answers };
              delete newAnswers[currentQuestion._id];
              setAnswers(newAnswers);
            }}
            isLastQuestion={currentQuestionIndex === totalQuestions - 1}
            imageUrl={currentQuestion.imageUrl}
            questionId={currentQuestion._id}
          />

          <div className="flex items-center justify-between mt-6">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              className="bg-white/10 border-white/30 text-white"
            >
              Previous
            </Button>

            <div className="text-white text-sm">
              {Object.keys(answers).length} / {totalQuestions} answered
            </div>

            {currentQuestionIndex === totalQuestions - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || Object.keys(answers).length < totalQuestions}
                className="bg-gradient-to-r from-green-500 to-emerald-500"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Submit Test
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}