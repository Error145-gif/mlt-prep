import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, FileText, TrendingUp, Award, Clock, AlertCircle, CreditCard, User, Target, Brain, BookMarked, BarChart, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function StudentDashboard() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const stats = useQuery(api.student.getStudentDashboardStats);
  const subscriptionAccess = useQuery(api.student.checkSubscriptionAccess);
  const userProfile = useQuery(api.users.getUserProfile);

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

  const profileCompletion = userProfile ? 
    (userProfile.name ? 25 : 0) + 
    (userProfile.avatarUrl ? 25 : 0) + 
    (userProfile.examPreparation ? 25 : 0) + 
    (userProfile.state ? 25 : 0) : 0;

  return (
    <div className="min-h-screen p-6 lg:p-8 relative">
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
      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {userProfile?.avatarUrl && (
              <Avatar className="h-16 w-16 border-2 border-white/20">
                <AvatarImage src={userProfile.avatarUrl} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl">
                  {userProfile.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            )}
            <div>
              <h1 className="text-3xl font-bold text-white">Welcome back, {userProfile?.name || "Student"}!</h1>
              <p className="text-white/70 mt-1">Continue your MLT learning journey</p>
            </div>
          </div>
          {subscriptionAccess && !subscriptionAccess.hasAccess && (
            <Button 
              onClick={() => navigate("/subscription")}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              View Plans
            </Button>
          )}
        </div>

        {/* Profile Completion Alert */}
        {userProfile && profileCompletion < 100 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card border border-blue-500/50 backdrop-blur-xl bg-blue-500/10 p-4 rounded-xl cursor-pointer hover:bg-blue-500/15 transition-all"
            onClick={() => navigate("/profile")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-white font-medium">Complete your profile ({profileCompletion}%)</p>
                  <p className="text-white/70 text-sm">Add your details for a personalized experience</p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Complete Profile
              </Button>
            </div>
          </motion.div>
        )}

        {/* Subscription Alert */}
        {subscriptionAccess && !subscriptionAccess.hasAccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card border border-orange-500/50 backdrop-blur-xl bg-orange-500/10 p-4 rounded-xl cursor-pointer hover:bg-orange-500/15 transition-all"
            onClick={() => navigate("/subscription")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-orange-400" />
                <div>
                  <p className="text-white font-medium">
                    {subscriptionAccess.reason === "no_subscription" && "Start your 7-day free trial!"}
                    {subscriptionAccess.reason === "expired" && "Your trial has expired"}
                  </p>
                  <p className="text-white/70 text-sm">
                    {subscriptionAccess.reason === "no_subscription" && "Get full access to all features"}
                    {subscriptionAccess.reason === "expired" && "Subscribe to continue learning"}
                  </p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                View Plans
              </Button>
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
                <p className="text-xs text-white/60 mt-1">Tests completed</p>
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
                <p className="text-xs text-white/60 mt-1">Overall performance</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/70">Overall Accuracy</CardTitle>
                <Target className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.overallAccuracy}%</div>
                <p className="text-xs text-white/60 mt-1">Correct answers</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/70">Subscription</CardTitle>
                <Clock className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <Badge variant={stats.subscriptionStatus === "active" ? "default" : "destructive"}>
                  {stats.subscriptionStatus}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Test Type Analytics */}
        <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Test Performance by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mock Tests */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <h3 className="text-white font-semibold">Mock Tests</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Tests Taken</span>
                    <span className="text-white font-bold text-lg">{stats.mockTests.count}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Avg Score</span>
                    <span className="text-white font-bold text-lg">{stats.mockTests.avgScore}%</span>
                  </div>
                  <Progress value={stats.mockTests.avgScore} className="h-2" />
                </div>
              </div>

              {/* PYQ Tests */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BookMarked className="h-5 w-5 text-green-400" />
                  <h3 className="text-white font-semibold">PYQ Tests</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Tests Taken</span>
                    <span className="text-white font-bold text-lg">{stats.pyqTests.count}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Avg Score</span>
                    <span className="text-white font-bold text-lg">{stats.pyqTests.avgScore}%</span>
                  </div>
                  <Progress value={stats.pyqTests.avgScore} className="h-2" />
                </div>
              </div>

              {/* AI Tests */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  <h3 className="text-white font-semibold">AI Tests</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Tests Taken</span>
                    <span className="text-white font-bold text-lg">{stats.aiTests.count}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Avg Score</span>
                    <span className="text-white font-bold text-lg">{stats.aiTests.avgScore}%</span>
                  </div>
                  <Progress value={stats.aiTests.avgScore} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Performance Graph */}
        {stats.recentTestPerformance && stats.recentTestPerformance.length > 0 && (
          <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Test Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentTestPerformance.map((test, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-white border-white/30">
                          {test.type.toUpperCase()}
                        </Badge>
                        <span className="text-white/70 text-sm">
                          {new Date(test.date).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-white font-bold">{test.score}%</span>
                    </div>
                    <Progress value={test.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completed Tests - Available for Retake */}
        {stats.totalTests > 0 && (
          <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Your Completed Tests
              </CardTitle>
              <p className="text-white/70 text-sm">Tests you can retake anytime</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.mockTests.count > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-white font-medium">Mock Tests</p>
                        <p className="text-white/60 text-sm">{stats.mockTests.count} attempts • Avg: {stats.mockTests.avgScore}%</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => navigate("/tests/mock")}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      Re-Test
                    </Button>
                  </div>
                )}
                {stats.pyqTests.count > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-white font-medium">PYQ Sets</p>
                        <p className="text-white/60 text-sm">
                          {stats.pyqTests.count} {stats.pyqTests.count === 1 ? 'attempt' : 'attempts'} • 
                          Avg: {stats.pyqTests.avgScore}% • 
                          10 mins per 20 questions
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => navigate("/tests/pyq")}
                      className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                    >
                      Re-Test
                    </Button>
                  </div>
                )}
                {stats.aiTests.count > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <Brain className="h-5 w-5 text-purple-400" />
                      <div>
                        <p className="text-white font-medium">AI Questions</p>
                        <p className="text-white/60 text-sm">{stats.aiTests.count} attempts • Avg: {stats.aiTests.avgScore}%</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => navigate("/tests/ai")}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                    >
                      Re-Test
                    </Button>
                  </div>
                )}
                {stats.totalTests === 0 && (
                  <p className="text-white/60 text-center py-4">No completed tests yet. Start your first test below!</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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