import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, FileText, TrendingUp, Award, Clock, AlertCircle, CreditCard, User, Target, Brain, BookMarked, BarChart, Zap, Trophy, Flame, Sparkles, TrendingDown } from "lucide-react";
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

  // Format subscription expiry date
  const formatExpiryDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate days remaining
  const getDaysRemaining = (endDate: number) => {
    const now = Date.now();
    const diff = endDate - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  // Format time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Get performance score color
  const getPerformanceColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-600";
    if (score >= 50) return "from-yellow-500 to-orange-600";
    return "from-red-500 to-pink-600";
  };

  const getPerformanceBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-500/20 text-green-300 border-green-500/30";
    if (score >= 50) return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    return "bg-red-500/20 text-red-300 border-red-500/30";
  };

  const getPerformanceLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 50) return "Moderate";
    return "Needs Work";
  };

  return (
    <div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-pink-400/25 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] bg-cyan-400/25 rounded-full blur-3xl" />
      </div>

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
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">Welcome back, {userProfile?.name || "Student"}!</h1>
              <p className="text-white/90 mt-1 drop-shadow-md">Continue your MLT learning journey</p>
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

        {/* Performance Score - PROMINENT DISPLAY */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card border border-white/30 backdrop-blur-xl bg-white/10 p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-white/90 text-lg mb-2 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Exam Readiness Score
              </h2>
              <div className="flex items-center gap-4">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getPerformanceColor(stats.performanceScore)} flex items-center justify-center shadow-lg`}>
                  <span className="text-4xl font-bold text-white">{stats.performanceScore}</span>
                </div>
                <div>
                  <Badge className={`${getPerformanceBadgeColor(stats.performanceScore)} text-lg px-4 py-1`}>
                    {getPerformanceLabel(stats.performanceScore)}
                  </Badge>
                  <p className="text-white/80 text-sm mt-2">
                    Based on accuracy, consistency & improvement
                  </p>
                </div>
              </div>
            </div>
            {stats.consistencyStreak > 0 && (
              <div className="text-center">
                <Flame className="h-12 w-12 text-orange-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{stats.consistencyStreak}</p>
                <p className="text-white/80 text-sm">Day Streak</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* AI Insights Card */}
        {stats.aiInsights && stats.aiInsights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card border border-purple-500/50 backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-5 rounded-xl"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <h3 className="text-white font-semibold text-lg">Smart Insights</h3>
            </div>
            <div className="space-y-2">
              {stats.aiInsights.map((insight, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-white/95 text-base leading-relaxed"
                >
                  {insight}
                </motion.p>
              ))}
            </div>
          </motion.div>
        )}

        {/* Subscription Status Card */}
        {subscriptionAccess && subscriptionAccess.hasAccess && subscriptionAccess.subscription && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card border border-green-500/50 backdrop-blur-xl bg-green-500/10 p-4 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-teal-600">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium text-lg">Active Subscription</p>
                  <p className="text-white/90 text-sm">
                    {subscriptionAccess.subscription.planName}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">Expires on</p>
                <p className="text-white font-bold text-lg">
                  {formatExpiryDate(subscriptionAccess.subscription.endDate)}
                </p>
                <Badge className="mt-1 bg-green-500/20 text-green-300 border-green-500/30">
                  {getDaysRemaining(subscriptionAccess.subscription.endDate)} days left
                </Badge>
              </div>
            </div>
          </motion.div>
        )}

        {/* User Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/90">Total Tests</CardTitle>
                <FileText className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalTests}</div>
                <p className="text-xs text-white/80 mt-1">Tests completed</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/90">Questions Attempted</CardTitle>
                <Target className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalQuestionsAttempted}</div>
                <p className="text-xs text-white/80 mt-1">Total questions</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/90">Avg Time/Question</CardTitle>
                <Clock className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.avgTimePerQuestion}s</div>
                <p className="text-xs text-white/80 mt-1">Per question</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/90">Overall Accuracy</CardTitle>
                <Award className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.overallAccuracy}%</div>
                <p className="text-xs text-white/80 mt-1">Correct answers</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Performance Breakdown */}
        <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Performance Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Mock Tests */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <h3 className="text-white font-semibold">Mock Tests</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white/90 text-sm">Accuracy</span>
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
                    <span className="text-white/90 text-sm">Accuracy</span>
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
                    <span className="text-white/90 text-sm">Accuracy</span>
                    <span className="text-white font-bold text-lg">{stats.aiTests.avgScore}%</span>
                  </div>
                  <Progress value={stats.aiTests.avgScore} className="h-2" />
                </div>
              </div>

              {/* Strongest Subject */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  <h3 className="text-white font-semibold">Strongest Subject</h3>
                </div>
                <div className="text-white/90 text-lg font-medium">{stats.strongestSubject}</div>
              </div>

              {/* Weakest Subject */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-red-400" />
                  <h3 className="text-white font-semibold">Needs Improvement</h3>
                </div>
                <div className="text-white/90 text-lg font-medium">{stats.weakestSubject}</div>
              </div>

              {/* Improvement Rate */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {stats.improvementRate >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-400" />
                  )}
                  <h3 className="text-white font-semibold">Last Test Change</h3>
                </div>
                <div className={`text-lg font-bold ${stats.improvementRate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.improvementRate >= 0 ? '+' : ''}{stats.improvementRate}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Metrics */}
        <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Engagement Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                  <span className="text-white/90">Total Study Time</span>
                </div>
                <div className="text-2xl font-bold text-white">{formatTime(stats.totalStudyTime)}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-400" />
                  <span className="text-white/90">Avg Questions/Test</span>
                </div>
                <div className="text-2xl font-bold text-white">{stats.avgQuestionsPerTest}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-400" />
                  <span className="text-white/90">Consistency Streak</span>
                </div>
                <div className="text-2xl font-bold text-white">{stats.consistencyStreak} days</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
            <Card className="glass-card border-white/30 backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate("/tests/mock")}>
              <CardHeader>
                <FileText className="h-8 w-8 text-blue-400 mb-2" />
                <CardTitle className="text-white">Mock Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90">Practice with comprehensive mock tests</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
            <Card className="glass-card border-white/30 backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-teal-600/20 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate("/tests/pyq")}>
              <CardHeader>
                <BookOpen className="h-8 w-8 text-green-400 mb-2" />
                <CardTitle className="text-white">PYQ Sets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90">Solve previous year questions</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}>
            <Card className="glass-card border-white/30 backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate("/tests/ai")}>
              <CardHeader>
                <Brain className="h-8 w-8 text-purple-400 mb-2" />
                <CardTitle className="text-white">AI Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90">Practice with AI-generated questions</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}