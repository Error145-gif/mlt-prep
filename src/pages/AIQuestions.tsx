import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Clock, Target, Sparkles, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";

export default function AIQuestions() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const aiTests = useQuery(api.student.getAIQuestions, {});
  const canAccessAI = useQuery(api.student.canAccessTestType, { testType: "ai" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  if (!aiTests || aiTests.length === 0) {
    return (
      <div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white">No AI Tests Available</h1>
          <p className="text-white/70 mt-2">Check back soon for new AI-generated questions</p>
        </div>
      </div>
    );
  }

  const handleStartTest = (topicId: string | null, setNumber: number, isFirstTest: boolean) => {
    // Check if user has paid subscription
    const hasPaidSubscription = canAccessAI?.reason === "paid_subscription";
    
    // If not first test and no paid subscription, it's locked
    if (!isFirstTest && !hasPaidSubscription) {
      toast.error("This test is locked! Subscribe to unlock all tests.");
      setTimeout(() => navigate("/subscription"), 1000);
      return;
    }
    
    // If first test but free trial already used, redirect to subscription
    if (isFirstTest && canAccessAI?.reason === "free_trial_used") {
      toast.error("Your free trial is used. Please subscribe to continue.");
      setTimeout(() => navigate("/subscription"), 500);
      return;
    }
    
    const topicParam = topicId ? `&topicId=${topicId}` : "";
    navigate(`/test-start?type=ai${topicParam}&setNumber=${setNumber}`);
  };

  return (
    <div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
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
          backgroundImage: 'url(https://harmless-tapir-303.convex.cloud/api/storage/248a8492-0c51-4de9-a100-32eccdb346c2)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Hamburger Menu - Mobile Only */}
      <div className="fixed top-4 right-4 z-50 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 bg-white/10"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-16 right-0 z-40 md:hidden bg-white/10 backdrop-blur-xl border-l border-white/20 w-64 h-screen p-4 space-y-3"
          >
            <Button
              onClick={() => {
                navigate("/student");
                setIsMenuOpen(false);
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Dashboard
            </Button>
            <Button
              onClick={() => {
                navigate("/mock-tests");
                setIsMenuOpen(false);
              }}
              variant="outline"
              className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              Mock Tests
            </Button>
            <Button
              onClick={() => {
                navigate("/pyq-sets");
                setIsMenuOpen(false);
              }}
              variant="outline"
              className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              PYQ Sets
            </Button>
            <Button
              onClick={() => {
                navigate("/profile");
                setIsMenuOpen(false);
              }}
              variant="outline"
              className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              Profile
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">AI-Generated Questions</h1>
          <p className="text-white/70 mt-1">Practice with AI-curated topic-wise questions (25 questions per set)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiTests.map((test, index) => {
            const isFirstTest = index === 0;
            const hasPaidSubscription = canAccessAI?.reason === "paid_subscription";
            const isLocked = !isFirstTest && !hasPaidSubscription;
            
            return (
              <motion.div
                key={`${test.topicId}-${test.setNumber}`}
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
                        <Sparkles className="h-8 w-8 text-purple-400" />
                      )}
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                        Set {test.setNumber}/{test.totalSets}
                      </Badge>
                    </div>
                    <CardTitle className="text-white mt-4 flex items-center gap-2">
                      AI Challenge Test
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
                      <span className="text-sm">30 mins</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Target className="h-4 w-4" />
                      <span className="text-sm">{test.questionCount} Questions</span>
                    </div>
                    {isLocked ? (
                      <Button
                        onClick={() => {
                          toast.error("This test is locked! Subscribe to unlock all tests.");
                          setTimeout(() => navigate("/subscription"), 1000);
                        }}
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                      >
                        <img 
                          src="https://harmless-tapir-303.convex.cloud/api/storage/22271688-6e3c-45a0-a31d-8c82daf67b1e" 
                          alt="Locked"
                          className="h-4 w-4 mr-2"
                        />
                        Unlock with Subscription
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleStartTest(test.topicId, test.setNumber, isFirstTest)}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                      >
                        {test.hasCompleted ? (canAccessAI?.canAccess ? "Re-Test" : "Subscribe to Re-Test") : isFirstTest && canAccessAI?.reason === "free_trial" ? "Start Free Test" : "Start Test"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}