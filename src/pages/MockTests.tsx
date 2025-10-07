import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { toast } from "sonner";

export default function MockTests() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const mockTests = useQuery(api.student.getMockTests, {});
  const canAccessMock = useQuery(api.student.canAccessTestType, { testType: "mock" });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || !mockTests) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const handleStartTest = (topicId: string | null, setNumber: number) => {
    if (!canAccessMock?.canAccess) {
      if (canAccessMock?.reason === "free_trial_used") {
        toast.error("Your free trial is used. Please subscribe to continue.");
      } else {
        toast.info("Please subscribe to access this test.");
      }
      setTimeout(() => navigate("/subscription"), 500);
      return;
    }
    // Build URL with set number
    if (topicId) {
      navigate(`/test/start?type=mock&topicId=${topicId}&setNumber=${setNumber}`);
    } else {
      navigate(`/test/start?type=mock&setNumber=${setNumber}`);
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Mock Tests</h1>
          <p className="text-white/70 mt-1">Practice with comprehensive topic-wise tests (100 questions per set)</p>
          {canAccessMock?.reason === "free_trial" && (
            <p className="text-yellow-400 mt-2">🎁 Free trial: You can take one mock test for free!</p>
          )}
          {canAccessMock?.reason === "free_trial_used" && (
            <p className="text-red-400 mt-2">⚠️ Free trial used. Subscribe to continue testing.</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTests.map((test, index) => (
            <motion.div
              key={`${test.topicId}-${test.setNumber}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10 hover:bg-white/15 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <FileText className="h-8 w-8 text-blue-400" />
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      Set {test.setNumber}/{test.totalSets}
                    </Badge>
                  </div>
                  <CardTitle className="text-white mt-4">{test.topicName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-white/70">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">60 mins</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <Target className="h-4 w-4" />
                    <span className="text-sm">{test.questionCount} Questions</span>
                  </div>
                  <Button
                    onClick={() => handleStartTest(test.topicId, test.setNumber)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    disabled={!canAccessMock?.canAccess}
                  >
                    {test.hasCompleted ? (canAccessMock?.canAccess ? "Re-Test" : "Subscribe to Re-Test") : "Start Test"}
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