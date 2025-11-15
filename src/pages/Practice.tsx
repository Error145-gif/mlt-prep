// @ts-nocheck
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Library, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import StudentNav from "@/components/StudentNav";

export default function Practice() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const topics = useQuery(api.topics.getAllTopics);
  const subscriptionAccess = useQuery(api.student.checkSubscriptionAccess);
  
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [questionLimit, setQuestionLimit] = useState<number>(10);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const handleStartPractice = () => {
    if (!subscriptionAccess?.hasAccess) {
      navigate("/dashboard");
      return;
    }
    const params = new URLSearchParams();
    params.set("type", "practice");
    if (selectedTopic !== "all") params.set("topicId", selectedTopic);
    if (selectedDifficulty !== "all") params.set("difficulty", selectedDifficulty);
    params.set("limit", questionLimit.toString());
    navigate(`/test/start?${params.toString()}`);
  };

  return (
    <div className="min-h-screen p-6 lg:p-8 relative">
      <StudentNav />
      {/* Lab Background Image */}
      <div 
        className="fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Practice Mode</h1>
          <p className="text-white/70 mt-1">Customize your practice session</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Library className="h-8 w-8 text-orange-400" />
                <CardTitle className="text-white">Configure Practice Session</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white">Select Topic</Label>
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="All Topics" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Topics</SelectItem>
                    {topics?.map((topic) => (
                      <SelectItem key={topic._id} value={topic._id}>
                        {topic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Difficulty Level</Label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Number of Questions (10-100)</Label>
                <Select value={questionLimit.toString()} onValueChange={(v) => setQuestionLimit(parseInt(v))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="20">20 Questions</SelectItem>
                    <SelectItem value="30">30 Questions</SelectItem>
                    <SelectItem value="50">50 Questions</SelectItem>
                    <SelectItem value="75">75 Questions</SelectItem>
                    <SelectItem value="100">100 Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleStartPractice}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700"
                disabled={!subscriptionAccess?.hasAccess}
              >
                <Target className="h-4 w-4 mr-2" />
                Start Practice
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}