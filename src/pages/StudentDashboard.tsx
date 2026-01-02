import { useEffect, useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Lock } from "lucide-react";
 
import DashboardHeader from "@/components/DashboardHeader";
import StudentNav from "@/components/StudentNav";
import MobileBottomNav from "@/components/MobileBottomNav";

// New Simplified Components
import ProfileCompletionOverlay from "@/components/dashboard/ProfileCompletionOverlay";
import NextStepCard from "@/components/dashboard/NextStepCard";
import ProgressSnapshot from "@/components/dashboard/ProgressSnapshot";
import WeeklyTestCard from "@/components/dashboard/WeeklyTestCard";
import SimplePracticeArea from "@/components/dashboard/SimplePracticeArea";
import UpgradeSection from "@/components/dashboard/UpgradeSection";
import RecentActivity from "@/components/dashboard/RecentActivity";

export default function StudentDashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const stats = useQuery(api.student.getStudentDashboardStats);
  const subscriptionAccess = useQuery(api.student.checkSubscriptionAccess);
  const userProfile = useQuery(api.users.getUserProfile);
  const [showAnalyticsUpsell, setShowAnalyticsUpsell] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Memoize user type to avoid recalculation
  const { isFreeTrialUser } = useMemo(() => {
    const hasFullAccess = subscriptionAccess?.hasAccess;
    const isTrial = !hasFullAccess;
    return { isFreeTrialUser: isTrial };
  }, [subscriptionAccess]);

  const isMonthlyStarterPlan = subscriptionAccess?.planType === "monthly_starter";
  const analyticsLocked = isFreeTrialUser || isMonthlyStarterPlan;

  // Show minimal loading only during initial auth check
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-white text-xl">Loading...</div>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

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
    aiInsights: stats.aiInsights ?? [],
    recentTestPerformance: stats.recentTestPerformance ?? []
  } : null;

  const profileCompletion = userProfile ? 
    (userProfile.name ? 25 : 0) + 
    (userProfile.avatarUrl ? 25 : 0) + 
    (userProfile.examPreparation ? 25 : 0) + 
    (userProfile.state ? 25 : 0) : 0;

  const isProfileIncomplete = profileCompletion < 100;
  
  // Check if this is first login (profile is completely empty)
  const isFirstLogin = userProfile && !userProfile.name && !userProfile.avatarUrl && !userProfile.examPreparation && !userProfile.state;

  return (
    <div className="min-h-screen relative overflow-hidden pb-20 lg:pb-0">
      <StudentNav />
      <MobileBottomNav />

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

      {/* FREE TRIAL BANNER */}
      {subscriptionAccess && isFreeTrialUser && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔒</span>
              <div>
                <p className="font-semibold text-sm md:text-base">Trial Mode — Limited Access</p>
                <p className="text-xs md:text-sm text-white/90">Unlock full preparation with Premium</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate("/subscription-plans")}
              size="sm"
              className="bg-white text-red-600 hover:bg-white/90 font-semibold whitespace-nowrap text-sm"
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      )}

      {/* First Login Modal OR Profile Completion Gate Overlay */}
      {userProfile && isProfileIncomplete && (
        <ProfileCompletionOverlay 
          profileCompletion={profileCompletion} 
          userProfile={userProfile}
          isFirstLogin={isFirstLogin}
        />
      )}

      {/* Main Dashboard Content - No left padding, content adjusts based on sidebar state */}
      <div className={`relative z-10 max-w-7xl mx-auto px-4 py-6 space-y-6 transition-all duration-500 ${isFreeTrialUser ? 'pt-16' : 'pt-6'} ${isProfileIncomplete ? 'blur-sm pointer-events-none' : ''}`}>
        
        {/* Header - Show immediately with skeleton if needed */}
        {userProfile && subscriptionAccess ? (
          <DashboardHeader userProfile={userProfile} subscriptionAccess={subscriptionAccess} />
        ) : (
          <div className="glass-card border-white/30 backdrop-blur-xl bg-white/20 p-6 rounded-xl">
            <Skeleton className="h-8 w-64 bg-white/20" />
          </div>
        )}

        {/* 1. YOUR NEXT STEP - Most prominent */}
        <NextStepCard />

        {/* 2. PROGRESS SNAPSHOT - No locks */}
        {displayStats ? (
          <ProgressSnapshot
            stats={displayStats}
            isAnalyticsLocked={analyticsLocked}
            onLockedCTA={() => setShowAnalyticsUpsell(true)}
          />
        ) : (
          <div className="glass-card border-white/30 backdrop-blur-xl bg-white/20 p-6 rounded-xl">
            <Skeleton className="h-48 w-full bg-white/20" />
          </div>
        )}

        {/* 3. WEEKLY FREE MOCK TEST - Highlighted */}
        <WeeklyTestCard isFreeTrialUser={isFreeTrialUser} />

        {/* 4. PRACTICE AREA - No confusion, no locks */}
        <SimplePracticeArea subscriptionAccess={subscriptionAccess} />

        {/* 5. UPGRADE SECTION - Benefits, not locks */}
        {isFreeTrialUser && <UpgradeSection />}

        {/* 6. RECENT ACTIVITY */}
        <RecentActivity 
          isFreeTrialUser={isFreeTrialUser} 
          recentTests={displayStats?.recentTestPerformance}
        />
      </div>
      {showAnalyticsUpsell && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full glass-card border-white/30 bg-white/10 backdrop-blur-2xl rounded-3xl p-8 text-center space-y-4"
          >
            <Lock className="h-12 w-12 text-yellow-300 mx-auto" />
            <p className="text-sm uppercase tracking-[0.35em] text-white/70">Premium analytics</p>
            <h3 className="text-3xl font-bold text-white">Unlock AI-powered insights</h3>
            <p className="text-white/80 text-sm">
              Upgrade to the ₹399 Premium plan to access detailed accuracy graphs, topic-wise trends, and personalized study recommendations.
            </p>
            <div className="space-y-3 pt-2">
              <Button
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold hover:from-yellow-300 hover:to-orange-400"
                onClick={() => {
                  setShowAnalyticsUpsell(false);
                  navigate("/subscription-plans");
                }}
              >
                Unlock with ₹399 Premium
              </Button>
              <Button
                variant="ghost"
                className="w-full text-white hover:bg-white/10"
                onClick={() => setShowAnalyticsUpsell(false)}
              >
                Maybe later
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}