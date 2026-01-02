// @ts-nocheck
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, Target, AlertCircle, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { toast } from "sonner";
import StudentNav from "@/components/StudentNav";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function PYQSets() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const pyqSets = useQuery(api.student.getPYQSets, {});
  const canAccessPYQ = useQuery(api.student.canAccessTestType, { testType: "pyq" });
  const adUnlockedTests = useQuery(api.student.getAdUnlockedTests, { testType: "pyq" });
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
          <div className="text-white text-xl">Loading PYQ Sets...</div>
        </div>
      </div>
    );
  }

  if (!pyqSets || pyqSets.length === 0) {
    return (
      <div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
        <StudentNav />
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500" />
        <div className="relative z-10 max-w-2xl mx-auto text-center mt-20">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-3xl font-bold text-white">No PYQ Sets Available</h1>
          <p className="text-white/70 mt-2">Check back soon or contact support</p>
          <Button 
            onClick={() => navigate("/student")} 
            className="mt-6 bg-white text-blue-600 hover:bg-white/90"
          >
            Return to Dashboard
          </Button>
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
    const isMonthlyStarter = canAccessPYQ?.reason === "monthly_starter_limit_reached" || 
                             canAccessPYQ?.reason === "monthly_starter_limit_reached_ad_available" ||
                             (canAccessPYQ?.setLimit && canAccessPYQ?.setLimit > 1); // > 1 implies paid limited plan

    if (isMonthlyStarter) {
      const limit = canAccessPYQ?.setLimit || 20;
      // If test is beyond limit AND not ad unlocked
      if (test.setNumber > limit && !isAdUnlocked) {
         toast.error(`This set is locked. Limit: ${limit} sets. Watch an ad to unlock!`);
         return;
      }
    } else {
      // Free user or Unlimited
      // If unlimited (paid_subscription), canAccess is true.
      // If free, canAccess might be false if trial used.
      
      if (!canAccessPYQ?.canAccess && !isAdUnlocked) {
        if (canAccessPYQ?.reason === "free_trial_used") {
           // Allow retaking Set 1?
           if (test.setNumber === 1) {
             // Allow
           } else {
             toast.error("Your free trial is used. Please subscribe to continue.");
             setTimeout(() => navigate("/subscription-plans"), 1000);
             return;
           }
        } else {
          toast.error("Subscribe to unlock PYQ Sets!");
          setTimeout(() => navigate("/subscription-plans"), 1000);
          return;
        }
      }
    }
    
    navigate(`/test-start?type=pyq&topicId=${test.year}&setNumber=${test.setNumber}`);
  };

  const handleUnlockWithAd = async (test: any) => {
    try {
      await unlockTestWithAd({ testType: "pyq", testSetNumber: test.setNumber });
      toast.success("Test unlocked! You can now take this test.");
    } catch (error: any) {
      toast.error(error.message || "Failed to unlock test. Please try again.");
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-8 relative overflow-hidden pb-24 transition-all duration-300">
      <StudentNav />
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-pink-400/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] bg-cyan-400/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }} />
      </div>

      {/* Lab Background Image */}
      <div 
        className="fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage: 'url(https://harmless-tapir-303.convex.cloud/api/storage/b5c7b06f-8b6e-4419-949e-f800852edc5e)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Previous Year Questions</h1>
          <p className="text-white/70 mt-1">Practice with actual exam questions from previous years</p>
          {canAccessPYQ?.reason === "free_trial" && (
            <p className="text-yellow-400 mt-2">🎁 Free trial: You can take one PYQ set for free!</p>
          )}
          {canAccessPYQ?.reason === "free_trial_used" && (
            <p className="text-red-400 mt-2">⚠️ Free trial used. Subscribe to continue testing.</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pyqSets.map((test, index) => {
            const isFirstTest = index === 0;
            const isFreeUser = canAccessPYQ?.reason === "free_trial";
            const hasPaidSubscription = canAccessPYQ?.reason === "paid_subscription";
            const isMonthlyStarter = hasPaidSubscription && canAccessPYQ?.setLimit;
            
            // Check if this test is ad-unlocked
            const isAdUnlocked = adUnlockedTests?.some(
              (t) => t.testSetNumber === test.setNumber
            );
            
            // Lock logic:
            // - Free users: only first test unlocked
            // - Monthly Starter (₹99): unlock up to setLimit (20 for PYQ), then allow ad unlock for 2 more
            // - Premium: all unlocked
            let isLocked = false;
            let canUnlockWithAd = false;
            
            if (isFreeUser) {
              // Free user - only first test
              isLocked = !isFirstTest;
            } else if (isMonthlyStarter && canAccessPYQ?.setLimit) {
              // Monthly Starter - lock tests beyond the limit
              if (index >= canAccessPYQ.setLimit) {
                if (!isAdUnlocked) {
                  isLocked = true;
                  // Allow ad unlock for up to 2 more tests after the limit
                  if (index < canAccessPYQ.setLimit + 2) {
                    canUnlockWithAd = true;
                  }
                }
              }
            }
            // Premium users: isLocked stays false
            
            // If ad unlocked, it's not locked
            if (isAdUnlocked) {
              isLocked = false;
            }
            
            return (
              <motion.div
                key={`${test.examName}-${test.year}-${test.setNumber}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`glass-card border-white/20 backdrop-blur-xl bg-white/10 hover:bg-white/15 transition-all ${isLocked ? 'opacity-60' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      {isLocked ? (
                        <img 
                          src="https://harmless-tapir-303.convex.cloud/api/storage/22271688-6e3c-45a0-a31d-8c82daf67b1e" 
                          alt="Locked"
                          className="h-12 w-12 object-contain"
                        />
                      ) : (
                        <FileText className="h-8 w-8 text-blue-400" />
                      )}
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {test.year}
                      </Badge>
                    </div>
                    <CardTitle className="text-white mt-4 flex items-center gap-2">
                      {test.examName} - Set {test.setNumber}
                      {isLocked && (
                        <img 
                          src="https://harmless-tapir-303.convex.cloud/api/storage/22271688-6e3c-45a0-a31d-8c82daf67b1e" 
                          alt="Locked"
                          className="h-6 w-6 object-contain"
                        />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-white/70">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">45 mins</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Target className="h-4 w-4" />
                      <span className="text-sm">{test.questionCount} Questions</span>
                    </div>
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
                          onClick={() => {
                            toast.error("This test is locked! Subscribe to unlock all tests.");
                            setTimeout(() => navigate("/subscription-plans"), 1000);
                          }}
                          className="w-full bg-gray-500 cursor-not-allowed"
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Locked - Subscribe
                        </Button>
                      )
                    ) : (
                      <Button
                        onClick={() => handleStartTest(test, isFirstTest)}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        {test.hasCompleted ? (canAccessPYQ?.canAccess ? "Re-Test" : "Subscribe to Re-Test") : isFirstTest && canAccessPYQ?.reason === "free_trial" ? "Start Free Test" : "Start Test"}
                      </Button>
                    )}
                  </CardContent>
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