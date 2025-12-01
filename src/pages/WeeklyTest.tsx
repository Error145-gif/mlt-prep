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

  if (!currentTest || !isReady) {
    const nextTestDate = currentTest?.scheduledDate ? new Date(currentTest.scheduledDate) : null;
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
              {nextTestDate ? (
                <>
                  <p className="mb-4">The next weekly free test will be available on:</p>
                  <p className="text-2xl font-bold">{nextTestDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                  <p className="mt-4 text-white/70">Check back on Sunday to participate!</p>
                </>
              ) : (
                <p>No weekly test scheduled at the moment. Check back soon!</p>
              )}
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
                <div className="flex items-center gap-2 text-white">
                  <Clock className="h-5 w-5" />
                  <span>Question {currentQuestionIndex + 1} / {totalQuestions}</span>
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