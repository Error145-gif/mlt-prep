import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Clock, Target, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { toast } from "sonner";

export default function AIQuestions() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const aiTests = useQuery(api.student.getAIQuestions, {});
  const canAccessAI = useQuery(api.student.canAccessTestType, { testType: "ai" });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || !aiTests) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const handleStartTest = (topicId: string | null) => {
    if (!canAccessAI?.canAccess) {
      if (canAccessAI?.reason === "free_trial_used") {
        toast.error("Your free trial is used. Please subscribe to continue.");
      }
      navigate("/subscription");
      return;
    }
    // Only add topicId to URL if it exists
    if (topicId) {
      navigate(`/test/start?type=ai&topicId=${topicId}`);
    } else {
      navigate(`/test/start?type=ai`);
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">AI-Generated Questions</h1>
          <p className="text-white/70 mt-1">Practice with AI-curated topic-wise questions</p>
          {canAccessAI?.reason === "free_trial" && (
            <p className="text-yellow-400 mt-2">🎁 Free trial: You can take one AI test for free!</p>
          )}
          {canAccessAI?.reason === "free_trial_used" && (
            <p className="text-red-400 mt-2">⚠️ Free trial used. Subscribe to continue testing.</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiTests.map((test, index) => (
            <motion.div
              key={test.topicId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10 hover:bg-white/15 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Sparkles className="h-8 w-8 text-purple-400" />
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      {test.questionCount} Questions
                    </Badge>
                  </div>
                  <CardTitle className="text-white mt-4">{test.topicName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-white/70">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">~{Math.ceil(test.questionCount * 1.5)} mins</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <Target className="h-4 w-4" />
                    <span className="text-sm capitalize">{test.difficulty} difficulty</span>
                  </div>
                  <Button
                    onClick={() => handleStartTest(test.topicId)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                    disabled={!canAccessAI?.canAccess}
                  >
                    {test.hasCompleted ? (canAccessAI?.canAccess ? "Re-Test" : "Subscribe to Re-Test") : "Start AI Test"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}