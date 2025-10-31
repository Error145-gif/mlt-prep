import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, FileText, TrendingUp, Award, Clock, AlertCircle, CreditCard, User, Target, Brain, BookMarked, BarChart, Zap, Trophy, Flame, Sparkles, TrendingDown, X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DashboardHeader from "@/components/DashboardHeader";
import PerformanceScore from "@/components/PerformanceScore";
import SubscriptionStatus from "@/components/SubscriptionStatus";
import StudentNav from "@/components/StudentNav";
import TestResultsHistory from "@/components/TestResultsHistory";

export default function StudentDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const stats = useQuery(api.student.getStudentDashboardStats);
  const subscriptionAccess = useQuery(api.student.checkSubscriptionAccess);
  const userProfile = useQuery(api.users.getUserProfile);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Redirect only if confirmed not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading only during initial auth check
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // If not authenticated after loading, don't render
  if (!isAuthenticated) {
    return null;
  }

  // Safe stats with proper null checks
  const displayStats = stats ? {
    totalTests: stats.totalTests ?? 0,
    totalQuestionsAttempted: stats.totalQuestionsAttempted ?? 0,
    avgTimePerQuestion: stats.avgTimePerQuestion ?? 0,
    overallAccuracy: stats.overallAccuracy ?? 0,
    performanceScore: stats.performanceScore ?? 0,
    consistencyStreak: stats.consistencyStreak ?? 0,
    mockTests: { avgScore: stats.mockTests?.avgScore ?? 0 },
    pyqTests: { avgScore: stats.pyqTests?.avgScore ?? 0 },
    aiTests: { avgScore: stats.aiTests?.avgScore ?? 0 },
    strongestSubject: stats.strongestSubject ?? "N/A",
    weakestSubject: stats.weakestSubject ?? "N/A",
    improvementRate: stats.improvementRate ?? 0,
    totalStudyTime: stats.totalStudyTime ?? 0,
    avgQuestionsPerTest: stats.avgQuestionsPerTest ?? 0,
    aiInsights: stats.aiInsights ?? []
  } : {
    totalTests: 0,
    totalQuestionsAttempted: 0,
    avgTimePerQuestion: 0,
    overallAccuracy: 0,
    performanceScore: 0,
    consistencyStreak: 0,
    mockTests: { avgScore: 0 },
    pyqTests: { avgScore: 0 },
    aiTests: { avgScore: 0 },
    strongestSubject: "N/A",
    weakestSubject: "N/A",
    improvementRate: 0,
    totalStudyTime: 0,
    avgQuestionsPerTest: 0,
    aiInsights: []
  };

  const isLoadingData = !stats || !subscriptionAccess || !userProfile;

  const profileCompletion = userProfile ? 
    (userProfile.name ? 25 : 0) + 
    (userProfile.avatarUrl ? 25 : 0) + 
    (userProfile.examPreparation ? 25 : 0) + 
    (userProfile.state ? 25 : 0) : 0;

  const isProfileIncomplete = profileCompletion < 100;

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
    <div className="min-h-screen relative overflow-hidden">
      <StudentNav />

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl" />
      </div>

      {/* Lab Background Image */}
      <div 
        className="fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&q=80&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />

      {/* Profile Completion Gate Overlay */}
      {isProfileIncomplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-md mx-4 p-8 rounded-2xl bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/30 shadow-2xl"
          >
            {/* Glowing particles effect */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute top-0 left-1/4 w-32 h-32 bg-violet-400/30 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-pink-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10 text-center space-y-6">
              {/* Lock Icon */}
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg shadow-violet-500/50"
              >
                <span className="text-4xl">🔒</span>
              </motion.div>

              {/* Title */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h2>
                <p className="text-white/80 text-sm">
                  Unlock AI Tests, Mock Tests, and PYQ Questions by completing your profile setup.
                </p>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-white/90">
                  <span>Profile Completion</span>
                  <span className="font-bold">{profileCompletion}%</span>
                </div>
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${profileCompletion}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-full shadow-lg shadow-violet-500/50"
                  />
                </div>
              </div>

              {/* Missing Fields */}
              <div className="text-left space-y-2 p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-2">Required Fields:</p>
                {!userProfile?.name && (
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <X className="h-4 w-4 text-red-400" />
                    <span>Full Name</span>
                  </div>
                )}
                {!userProfile?.avatarUrl && (
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <X className="h-4 w-4 text-red-400" />
                    <span>Profile Avatar</span>
                  </div>
                )}
                {!userProfile?.examPreparation && (
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <X className="h-4 w-4 text-red-400" />
                    <span>Exam Preparation</span>
                  </div>
                )}
                {!userProfile?.state && (
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <X className="h-4 w-4 text-red-400" />
                    <span>State</span>
                  </div>
                )}
              </div>

              {/* Complete Profile Button */}
              <Button
                onClick={() => navigate("/profile")}
                className="w-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-6 rounded-xl shadow-lg shadow-violet-500/50 hover:shadow-violet-500/70 transition-all duration-300"
              >
                <User className="h-5 w-5 mr-2" />
                Complete Profile Now
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Main Dashboard Content - Blurred when profile incomplete, show loading skeleton if data not ready */}
      <div className={`relative z-10 max-w-7xl mx-auto space-y-6 transition-all duration-500 ${isProfileIncomplete ? 'blur-sm pointer-events-none' : ''}`}>
        {isLoadingData && (
          <div className="glass-card border-white/30 backdrop-blur-xl bg-white/20 p-6 rounded-xl">
            <div className="text-white text-center">Loading your dashboard data...</div>
          </div>
        )}
        {/* Header */}
        <DashboardHeader userProfile={userProfile} subscriptionAccess={subscriptionAccess} />

        {/* Performance Score - PROMINENT DISPLAY */}
        <PerformanceScore performanceScore={displayStats.performanceScore || 0} consistencyStreak={displayStats.consistencyStreak || 0} />

        {/* AI Insights Card */}
        {displayStats.aiInsights && displayStats.aiInsights.length > 0 && (
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
              {displayStats.aiInsights.map((insight, index) => (
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
          <SubscriptionStatus subscription={subscriptionAccess.subscription} />
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
                <div className="text-2xl font-bold text-white">{displayStats.totalTests || 0}</div>
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
                <div className="text-2xl font-bold text-white">{displayStats.totalQuestionsAttempted || 0}</div>
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
                <div className="text-2xl font-bold text-white">{displayStats.avgTimePerQuestion || 0}s</div>
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
                <div className="text-2xl font-bold text-white">{displayStats.overallAccuracy || 0}%</div>
                <p className="text-xs text-white/80 mt-1">Correct answers</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Performance Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card border-white/30 backdrop-blur-xl bg-gradient-to-br from-white/10 via-purple-500/10 to-pink-500/10 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50">
                  <BarChart className="h-5 w-5 text-white" />
                </div>
                Performance Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Mock Tests */}
                <motion.div 
                  className="space-y-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-white font-semibold">Mock Tests</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/90 text-sm">Accuracy</span>
                      <span className="text-white font-bold text-lg">{displayStats?.mockTests?.avgScore || 0}%</span>
                    </div>
                    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(displayStats?.mockTests?.avgScore || 0, 100)}%` }}
                        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                        className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full shadow-lg shadow-blue-500/50"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* PYQ Tests */}
                <motion.div 
                  className="space-y-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30">
                      <BookMarked className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-white font-semibold">PYQ Tests</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/90 text-sm">Accuracy</span>
                      <span className="text-white font-bold text-lg">{displayStats?.pyqTests?.avgScore || 0}%</span>
                    </div>
                    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(displayStats?.pyqTests?.avgScore || 0, 100)}%` }}
                        transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                        className="absolute h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full shadow-lg shadow-green-500/50"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* AI Tests */}
                <motion.div 
                  className="space-y-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-white font-semibold">AI Tests</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/90 text-sm">Accuracy</span>
                      <span className="text-white font-bold text-lg">{displayStats?.aiTests?.avgScore || 0}%</span>
                    </div>
                    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(displayStats?.aiTests?.avgScore || 0, 100)}%` }}
                        transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                        className="absolute h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full shadow-lg shadow-purple-500/50"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Strongest Subject */}
                <motion.div 
                  className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/30">
                      <Trophy className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-white font-semibold">Strongest Subject</h3>
                  </div>
                  <div className="text-white/90 text-xl font-bold">{displayStats?.strongestSubject || "N/A"}</div>
                </motion.div>

                {/* Weakest Subject */}
                <motion.div 
                  className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-sm border border-red-400/30 hover:border-red-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 shadow-lg shadow-red-500/30">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-white font-semibold">Needs Improvement</h3>
                  </div>
                  <div className="text-white/90 text-xl font-bold">{displayStats?.weakestSubject || "N/A"}</div>
                </motion.div>

                {/* Improvement Rate */}
                <motion.div 
                  className={`space-y-3 p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:shadow-lg ${
                    displayStats.improvementRate >= 0 
                      ? 'bg-gradient-to-br from-green-500/10 to-teal-500/10 border-green-400/30 hover:border-green-400/50 hover:shadow-green-500/20' 
                      : 'bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-400/30 hover:border-red-400/50 hover:shadow-red-500/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg shadow-lg ${
                      displayStats.improvementRate >= 0 
                        ? 'bg-gradient-to-br from-green-500 to-teal-500 shadow-green-500/30' 
                        : 'bg-gradient-to-br from-red-500 to-orange-500 shadow-red-500/30'
                    }`}>
                      {displayStats.improvementRate >= 0 ? (
                        <TrendingUp className="h-5 w-5 text-white" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <h3 className="text-white font-semibold">Last Test Change</h3>
                  </div>
                  <div className={`text-2xl font-bold ${(displayStats?.improvementRate || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {(displayStats?.improvementRate || 0) >= 0 ? '+' : ''}{displayStats?.improvementRate || 0}%
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

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
                <div className="text-2xl font-bold text-white">{formatTime(displayStats?.totalStudyTime || 0)}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-400" />
                  <span className="text-white/90">Avg Questions/Test</span>
                </div>
                <div className="text-2xl font-bold text-white">{displayStats?.avgQuestionsPerTest || 0}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-400" />
                  <span className="text-white/90">Consistency Streak</span>
                </div>
                <div className="text-2xl font-bold text-white">{displayStats?.consistencyStreak || 0} days</div>
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

        {/* Test Results History with Pagination */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <TestResultsHistory />
        </motion.div>
      </div>
    </div>
  );
}