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

export default function MockTests() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const mockTests = useQuery(api.student.getMockTests, {});
  const subscriptionAccess = useQuery(api.student.checkSubscriptionAccess);

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

  const handleStartTest = (topicId: string) => {
    if (!subscriptionAccess?.hasAccess) {
      navigate("/dashboard");
      return;
    }
    navigate(`/test/start?type=mock&topicId=${topicId}`);
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Mock Tests</h1>
          <p className="text-white/70 mt-1">Practice with comprehensive topic-wise tests</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTests.map((test, index) => (
            <motion.div
              key={test.topicId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10 hover:bg-white/15 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <FileText className="h-8 w-8 text-blue-400" />
                    <Badge>{test.questionCount} Questions</Badge>
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
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    disabled={!subscriptionAccess?.hasAccess}
                  >
                    Start Test
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
