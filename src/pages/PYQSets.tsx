import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function PYQSets() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const pyqSets = useQuery(api.student.getPYQSets);
  const subscriptionAccess = useQuery(api.student.checkSubscriptionAccess);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || !pyqSets) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const handleStartPYQ = (year: number) => {
    if (!subscriptionAccess?.hasAccess) {
      navigate("/dashboard");
      return;
    }
    navigate(`/test/start?type=pyq&year=${year}`);
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Previous Year Questions</h1>
          <p className="text-white/70 mt-1">Practice with past exam papers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pyqSets.map((set, index) => (
            <motion.div
              key={set.year}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10 hover:bg-white/15 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <BookOpen className="h-8 w-8 text-green-400" />
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      {set.year}
                    </Badge>
                  </div>
                  <CardTitle className="text-white mt-4">{set.examName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-white/70">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{set.questionCount} Questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{Math.ceil(set.questionCount / 20) * 10} mins</span>
                  </div>
                  <Button
                    onClick={() => handleStartPYQ(set.year)}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                    disabled={!subscriptionAccess?.hasAccess}
                  >
                    {set.hasCompleted ? "Re-Test" : "Start PYQ Set"}
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
