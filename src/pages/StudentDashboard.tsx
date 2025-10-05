import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, FileText, TrendingUp, Award, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function StudentDashboard() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const stats = useQuery(api.student.getStudentDashboardStats);
  const subscriptionAccess = useQuery(api.student.checkSubscriptionAccess);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name || "Student"}!</h1>
            <p className="text-white/70 mt-1">Continue your MLT learning journey</p>
          </div>
          {subscriptionAccess && !subscriptionAccess.hasAccess && (
            <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
              Upgrade Plan
            </Button>
          )}
        </div>

        {/* Subscription Alert */}
        {subscriptionAccess && !subscriptionAccess.hasAccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card border border-orange-500/50 backdrop-blur-xl bg-orange-500/10 p-4 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-orange-400" />
              <div>
                <p className="text-white font-medium">
                  {subscriptionAccess.reason === "no_subscription" && "No active subscription"}
                  {subscriptionAccess.reason === "expired" && "Your subscription has expired"}
                </p>
                <p className="text-white/70 text-sm">Upgrade to access all features</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/70">Total Tests</CardTitle>
                <FileText className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalTests}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/70">Average Score</CardTitle>
                <Award className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.avgScore}%</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/70">Subscription</CardTitle>
                <Clock className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <Badge variant={stats.subscriptionStatus === "active" ? "default" : "destructive"}>
                  {stats.subscriptionStatus}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/70">Weak Topics</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.weakTopics.length}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Weak Topics */}
        {stats.weakTopics.length > 0 && (
          <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <CardHeader>
              <CardTitle className="text-white">Topics to Focus On</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.weakTopics.map((topic, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white">{topic.name}</span>
                    <span className="text-white/70">{topic.score}%</span>
                  </div>
                  <Progress value={topic.score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
            <Card className="glass-card border-white/20 backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate("/tests/mock")}>
              <CardHeader>
                <FileText className="h-8 w-8 text-blue-400 mb-2" />
                <CardTitle className="text-white">Mock Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">Practice with comprehensive mock tests</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
            <Card className="glass-card border-white/20 backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-teal-600/20 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate("/tests/pyq")}>
              <CardHeader>
                <BookOpen className="h-8 w-8 text-green-400 mb-2" />
                <CardTitle className="text-white">PYQ Sets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">Solve previous year questions</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}>
            <Card className="glass-card border-white/20 backdrop-blur-xl bg-gradient-to-br from-orange-500/20 to-pink-600/20 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate("/practice")}>
              <CardHeader>
                <Award className="h-8 w-8 text-orange-400 mb-2" />
                <CardTitle className="text-white">Practice Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">Topic-wise practice questions</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Content */}
        {stats.recentContent && stats.recentContent.length > 0 && (
          <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <CardHeader>
              <CardTitle className="text-white">Recent Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentContent.map((content) => (
                  <div key={content._id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-white font-medium">{content.title}</p>
                        <p className="text-white/60 text-sm">{content.type}</p>
                      </div>
                    </div>
                    <Badge>{content.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
