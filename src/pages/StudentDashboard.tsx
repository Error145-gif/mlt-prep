// @ts-nocheck
import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
 
import DashboardHeader from "@/components/DashboardHeader";
import PerformanceScore from "@/components/PerformanceScore";
import SubscriptionStatus from "@/components/SubscriptionStatus";
import StudentNav from "@/components/StudentNav";
import TestResultsHistory from "@/components/TestResultsHistory";

// New Components
import ProfileCompletionOverlay from "@/components/dashboard/ProfileCompletionOverlay";
import DashboardStatsGrid from "@/components/dashboard/DashboardStatsGrid";
import PerformanceBreakdown from "@/components/dashboard/PerformanceBreakdown";
import EngagementMetrics from "@/components/dashboard/EngagementMetrics";
import WeeklyTestCard from "@/components/dashboard/WeeklyTestCard";
import QuickActions from "@/components/dashboard/QuickActions";

export default function StudentDashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const stats = useQuery(api.student.getStudentDashboardStats);
  const subscriptionAccess = useQuery(api.student.checkSubscriptionAccess);
  const userProfile = useQuery(api.users.getUserProfile);

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
        <ProfileCompletionOverlay profileCompletion={profileCompletion} userProfile={userProfile} />
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
              {displayStats.aiInsights.map((insight: string, index: number) => (
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
        <DashboardStatsGrid stats={displayStats} />

        {/* Performance Breakdown */}
        <PerformanceBreakdown stats={displayStats} />

        {/* Engagement Metrics */}
        <EngagementMetrics stats={displayStats} />

        {/* Weekly Free Test Section */}
        <WeeklyTestCard />

        {/* Quick Actions */}
        <QuickActions />

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