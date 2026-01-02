// @ts-nocheck
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { toast } from "sonner";
import StudentNav from "@/components/StudentNav";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function AIQuestions() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const aiTests = useQuery(api.student.getAIQuestions, {});
  const canAccessAI = useQuery(api.student.canAccessTestType, { testType: "ai" });
  const adUnlockedTests = useQuery(api.student.getAdUnlockedTests, { testType: "ai" });
  const unlockTestWithAd = useMutation(api.student.unlockTestWithAd);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
          <div className="text-white text-xl">Loading AI Tests...</div>
        </div>
      </div>
    );
  }

  if (!aiTests || aiTests.length === 0) {
    return (
      <div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
        <StudentNav />
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white">No AI Tests Available</h1>
          <p className="text-white/70 mt-2">Check back soon for new AI-generated questions</p>
        </div>
      </div>
    );
  }

  const handleStartTest = (test: any, isFirstTest: boolean) => {
    // Check if this specific test is unlocked via ad
    const isAdUnlocked = adUnlockedTests?.some(
      (t) => t.testSetNumber === test.setNumber
    );

    // Check subscription access
    if (!canAccessAI?.canAccess && !isAdUnlocked) {
      if (canAccessAI?.reason === "monthly_starter_limit_reached") {
        toast.error(`Monthly Starter limit reached! You've used ${canAccessAI.setsUsed}/${canAccessAI.setLimit} sets. Watch ads to unlock 2 more!`);
      } else if (canAccessAI?.reason === "free_trial_used") {
        toast.error("Your free trial is used. Please subscribe to continue.");
      } else {
        toast.error("Subscribe to unlock AI Tests!");
      }
      setTimeout(() => navigate("/subscription-plans"), 1000);
      return;
    }
    
    navigate(`/test-start?type=ai&topicId=general&setNumber=${test.setNumber}`);
  };

  const handleUnlockWithAd = async (test: any) => {
    try {
      await unlockTestWithAd({ testType: "ai", testSetNumber: test.setNumber });
      toast.success("Test unlocked! You can now take this test.");
    } catch (error) {
      toast.error("Failed to unlock test. Please try again.");
    }
  };

  // Show list of available AI tests
  return (
    <div className="min-h-screen p-6 lg:p-8 relative overflow-hidden pb-24 transition-all duration-300">
      <StudentNav />
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Lab Background Image */}
      <div 
        className="fixed inset-0 -z-10 opacity-15"
        style={{
          backgroundImage: 'url(https://harmless-tapir-303.convex.cloud/api/storage/1e73bac3-1079-442a-b8f9-4e8b71bf087f)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">AI-Generated Questions</h1>
          <p className="text-white/70 mt-1">Select an AI test set to practice with AI-curated topic-wise questions (25 questions per set)</p>
          {canAccessAI?.reason === "paid_subscription" && canAccessAI?.setLimit && (
            <p className="text-yellow-300 mt-2 text-sm">
              ⚡ Monthly Starter Plan: {canAccessAI.setsUsed || 0}/{canAccessAI.setLimit} sets used
            </p>
          )}
        </div>

        {!canAccessAI?.canAccess && canAccessAI?.reason === "monthly_starter_limit_reached" && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-orange-900 mb-2">
              Monthly Starter Limit Reached
            </h3>
            <p className="text-orange-700 mb-4">
              You've completed {canAccessAI.setsUsed} out of {canAccessAI.setLimit} AI question sets allowed in your Monthly Starter plan.
            </p>
            <Button
              onClick={() => navigate("/subscription-plans")}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Upgrade to Premium for Unlimited Access
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiTests.map((test, index) => {
            const isFirstTest = index === 0;
            const isFreeUser = canAccessAI?.reason === "free_trial";
            const hasPaidSubscription = canAccessAI?.reason === "paid_subscription";
            const isMonthlyStarter = hasPaidSubscription && canAccessAI?.setLimit;
            
            // Check if this test is ad-unlocked
            const isAdUnlocked = adUnlockedTests?.some(
              (t) => t.testSetNumber === test.setNumber
            );
            
            // Lock logic:
            // - Free users: only first test unlocked
            // - Monthly Starter (₹99): unlock up to setLimit (25 for AI), then allow ad unlock for 2 more
            // - Premium: all unlocked
            let isLocked = false;
            let canUnlockWithAd = false;
            
            if (isFreeUser) {
              // Free user - only first test
              isLocked = !isFirstTest;
            } else if (isMonthlyStarter && canAccessAI?.setLimit) {
              // Monthly Starter - lock tests beyond the limit
              if (index >= canAccessAI.setLimit) {
                if (!isAdUnlocked) {
                  isLocked = true;
                  // Allow ad unlock for up to 2 more tests after the limit
                  if (index < canAccessAI.setLimit + 2) {
                    canUnlockWithAd = true;
                  }
                }
              }
            }
            // Premium users: isLocked stays false
            
            return (
              <motion.div
                key={`${test.topicId}-${test.setNumber}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`glass-card border-white/20 backdrop-blur-xl bg-white/10 hover:bg-white/15 transition-all cursor-pointer ${isLocked ? 'opacity-60' : ''}`}>
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white">AI Challenge Test</h3>
                        <p className="text-white/70 text-sm">Set {test.setNumber}/{test.totalSets}</p>
                      </div>
                      {isLocked && (
                        <Lock className="h-6 w-6 text-yellow-400" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-white/70">
                        <span className="text-sm">⏱️ 30 mins</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/70">
                        <span className="text-sm">❓ {test.questionCount} Questions</span>
                      </div>
                    </div>

                    {test.hasCompleted && (
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30 w-full text-center justify-center">
                        ✓ Completed
                      </Badge>
                    )}

                    {isLocked ? (
                      canUnlockWithAd ? (
                        <Button
                          onClick={() => handleUnlockWithAd(test)}
                          className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                        >
                          🎬 Watch Ad to Unlock
                        </Button>
                      ) : (
                        <Button
                          disabled
                          className="w-full bg-gray-500 cursor-not-allowed"
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Locked - Subscribe to Unlock
                        </Button>
                      )
                    ) : (
                      <Button
                        onClick={() => handleStartTest(test, isFirstTest)}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                      >
                        {test.hasCompleted ? "Re-Take Test" : "Start Test"}
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}