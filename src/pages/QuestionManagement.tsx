import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate } from "react-router";
import { useState } from "react";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Id } from "@/convex/_generated/dataModel";

export default function QuestionManagement() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState("pending");
  const questions = useQuery(api.questions.getQuestions, { status: activeTab });
  const reviewQuestion = useMutation(api.questions.reviewQuestion);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/auth" />;
  }

  const handleReview = async (id: Id<"questions">, status: string) => {
    try {
      await reviewQuestion({ id, status });
      toast.success(`Question ${status}!`);
    } catch (error) {
      toast.error("Failed to review question");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <h1 className="text-3xl font-bold tracking-tight text-white">Question Management</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <TabsTrigger value="pending" className="data-[state=active]:bg-white/20">
              <AlertCircle className="h-4 w-4 mr-2" />
              Pending
            </TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-white/20">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approved
            </TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-white/20">
              <XCircle className="h-4 w-4 mr-2" />
              Rejected
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-6">
            {!questions || questions.length === 0 ? (
              <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                <CardContent className="py-12 text-center">
                  <p className="text-white/60">No {activeTab} questions</p>
                </CardContent>
              </Card>
            ) : (
              questions.map((question, index) => (
                <motion.div
                  key={question._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-white text-lg">{question.question}</CardTitle>
                            {getStatusBadge(question.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-white/60">
                            <span>{question.type.replace("_", " ").toUpperCase()}</span>
                            <span>•</span>
                            <span>{question.contentTitle}</span>
                            <span>•</span>
                            <span>{question.topicName}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {question.options && question.options.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-white/80">Options:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {question.options.map((option, idx) => (
                              <div
                                key={idx}
                                className={`p-2 rounded-lg border ${
                                  option === question.correctAnswer
                                    ? "bg-green-500/10 border-green-500/30 text-green-300"
                                    : "bg-white/5 border-white/10 text-white/80"
                                }`}
                              >
                                {option}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-white/80">Correct Answer:</p>
                        <p className="text-white mt-1">{question.correctAnswer}</p>
                      </div>
                      {question.explanation && (
                        <div>
                          <p className="text-sm font-medium text-white/80">Explanation:</p>
                          <p className="text-white/60 mt-1">{question.explanation}</p>
                        </div>
                      )}
                      {activeTab === "pending" && (
                        <div className="flex gap-2 pt-4">
                          <Button
                            onClick={() => handleReview(question._id, "approved")}
                            className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleReview(question._id, "rejected")}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
