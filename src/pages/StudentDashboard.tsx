import { useEffect, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
 
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

  // Memoize user type to avoid recalculation
  const { isFreeTrialUser } = useMemo(() => {
    // A user is considered "free trial" if they are NOT a paid subscriber
    // This includes: free_trial, no_subscription, expired, or not_authenticated
    const isPaid = subscriptionAccess?.hasAccess && subscriptionAccess?.isPaid;
    const isTrial = !isPaid; // Anyone who is NOT paid is treated as free trial
    return { isFreeTrialUser: isTrial };
  }, [subscriptionAccess]);

  // Show minimal loading only during initial auth check
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
  } : null;

  const profileCompletion = userProfile ? 
    (userProfile.name ? 25 : 0) + 
    (userProfile.avatarUrl ? 25 : 0) + 
    (userProfile.examPreparation ? 25 : 0) + 
    (userProfile.state ? 25 : 0) : 0;

  const isProfileIncomplete = profileCompletion < 100;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StudentNav />

      {/* Animated Background - Always visible */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl" />
      </div>

      {/* Lab Background Image - Always visible */}
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

      {/* FREE TRIAL BANNER - Show immediately if subscription data available */}
      {subscriptionAccess && isFreeTrialUser && (
        <div className="fixed top-16 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-semibold">Trial Access: Limited</p>
                <p className="text-sm text-white/90">You are using a 7-day trial with restricted features. Unlock full preparation with Premium.</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate("/subscription-plans")}
              className="bg-white text-red-600 hover:bg-white/90 font-semibold whitespace-nowrap"
            >
              Upgrade Now – Get Full Access
            </Button>
          </div>
        </div>
      )}

      {/* Profile Completion Gate Overlay */}
      {userProfile && isProfileIncomplete && (
        <ProfileCompletionOverlay profileCompletion={profileCompletion} userProfile={userProfile} />
      )}

      {/* Main Dashboard Content - Render immediately with progressive loading */}
      <div className={`relative z-10 max-w-7xl mx-auto space-y-6 transition-all duration-500 ${isFreeTrialUser ? 'pt-24' : ''} ${isProfileIncomplete ? 'blur-sm pointer-events-none' : ''}`}>
        
        {/* Header - Show immediately with skeleton if needed */}
        {userProfile && subscriptionAccess ? (
          <DashboardHeader userProfile={userProfile} subscriptionAccess={subscriptionAccess} />
        ) : (
          <div className="glass-card border-white/30 backdrop-blur-xl bg-white/20 p-6 rounded-xl">
            <Skeleton className="h-8 w-64 bg-white/20" />
          </div>
        )}

        {/* Performance Score - Show skeleton while loading */}
        <div className="relative">
          {isFreeTrialUser ? (
            <div className="glass-card border-white/30 backdrop-blur-xl bg-white/20 p-6 rounded-xl min-h-[150px] flex flex-col items-center justify-center">
              <Lock className="h-12 w-12 text-white mb-2" />
              <p className="text-white font-semibold text-lg">🔒 Available with Full Access</p>
              <p className="text-white/80 text-sm mt-2">❌ Not Exam Ready – Trial access cannot improve this score</p>
            </div>
          ) : displayStats ? (
            <PerformanceScore performanceScore={displayStats.performanceScore || 0} consistencyStreak={displayStats.consistencyStreak || 0} />
          ) : (
            <div className="glass-card border-white/30 backdrop-blur-xl bg-white/20 p-6 rounded-xl">
              <Skeleton className="h-32 w-full bg-white/20" />
            </div>
          )}
        </div>

        {/* AI Insights Card - Show skeleton while loading */}
        {isFreeTrialUser ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card border border-purple-500/50 backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-5 rounded-xl min-h-[150px] flex flex-col items-center justify-center"
          >
            <Lock className="h-12 w-12 text-white mb-2" />
            <p className="text-white font-semibold text-lg">🔒 Smart Insights</p>
            <p className="text-white/80 text-sm mt-2">Available with Full Access</p>
          </motion.div>
        ) : displayStats?.aiInsights && displayStats.aiInsights.length > 0 ? (
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
        ) : !displayStats ? (
          <div className="glass-card border-white/30 backdrop-blur-xl bg-white/20 p-6 rounded-xl">
            <Skeleton className="h-24 w-full bg-white/20" />
          </div>
        ) : null}

        {/* Subscription Status Card */}
        {subscriptionAccess?.subscription && subscriptionAccess.subscription.status === "active" && (
          <SubscriptionStatus subscription={subscriptionAccess.subscription} />
        )}

        {/* User Overview Grid - Show skeleton while loading */}
        {isFreeTrialUser ? (
          <div className="glass-card border-white/30 backdrop-blur-xl bg-white/20 p-6 rounded-xl min-h-[200px] flex flex-col items-center justify-center">
            <Lock className="h-12 w-12 text-white mb-2" />
            <p className="text-white font-semibold text-lg">🔒 Performance Overview</p>
            <p className="text-white/80 text-sm mt-2">Available with Full Access</p>
          </div>
        ) : displayStats ? (
          <DashboardStatsGrid stats={displayStats} isFreeTrialUser={isFreeTrialUser} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card border-white/30 backdrop-blur-xl bg-white/20 p-5 rounded-xl">
                <Skeleton className="h-24 w-full bg-white/20" />
              </div>
            ))}
          </div>
        )}

        {/* Performance Breakdown - Show skeleton while loading */}
        <div className="relative">
          {isFreeTrialUser ? (
            <div className="glass-card border-white/30 backdrop-blur-xl bg-white/20 p-6 rounded-xl min-h-[200px] flex flex-col items-center justify-center">
              <Lock className="h-12 w-12 text-white mb-2" />
              <p className="text-white font-semibold text-lg">🔒 Performance Breakdown</p>
              <p className="text-white/80 text-sm mt-2">Available with Full Access</p>
            </div>
          ) : displayStats ? (
            <PerformanceBreakdown stats={displayStats} />
          ) : (
            <div className="glass-card border-white/30 backdrop-blur-xl bg-white/20 p-6 rounded-xl">
              <Skeleton className="h-48 w-full bg-white/20" />
            </div>
          )}
        </div>

        {/* Engagement Metrics - Show skeleton while loading */}
        <div className="relative">
          {isFreeTrialUser ? (
            <div className="glass-card border-white/30 backdrop-blur-xl bg-white/20 p-6 rounded-xl min-h-[150px] flex flex-col items-center justify-center">
              <Lock className="h-12 w-12 text-white mb-2" />
              <p className="text-white font-semibold text-lg">🔒 Engagement Metrics</p>
              <p className="text-white/80 text-sm mt-2">Available with Full Access</p>
            </div>
          ) : displayStats ? (
            <EngagementMetrics stats={displayStats} />
          ) : (
            <div className="glass-card border-white/30 backdrop-blur-xl bg-white/20 p-6 rounded-xl">
              <Skeleton className="h-32 w-full bg-white/20" />
            </div>
          )}
        </div>

        {/* Weekly Free Test Section - Always visible */}
        <div className="relative">
          <WeeklyTestCard />
          {isFreeTrialUser && (
            <div className="mt-2 text-center">
              <p className="text-white/90 text-sm bg-orange-500/20 backdrop-blur-sm rounded-lg py-2 px-4 border border-orange-500/30">
                Free mock shows exam level. Full practice requires upgrade.
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions - Always visible */}
        <QuickActions />

        {/* Test Results History - Always visible */}
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