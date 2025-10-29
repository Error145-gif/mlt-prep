import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Lock, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import StudentNav from "@/components/StudentNav";

export default function AIQuestions() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const aiTests = useQuery(api.student.getAIQuestions, {});
  const userProfile = useQuery(api.users.getUserProfile);
  const canAccessAI = useQuery(api.student.canAccessTestType, { testType: "ai" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [instructionsRead, setInstructionsRead] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || !aiTests) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="text-white text-xl">Loading...</div>
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

  const handleSelectTest = (test: any) => {
    const isFirstTest = aiTests.length > 0 && aiTests[0] === test;
    const hasPaidSubscription = canAccessAI?.reason === "paid_subscription";
    
    if (!isFirstTest && !hasPaidSubscription) {
      toast.error("This test is locked! Subscribe to unlock all tests.");
      setTimeout(() => navigate("/subscription"), 1000);
      return;
    }
    
    if (isFirstTest && canAccessAI?.reason === "free_trial_used") {
      toast.error("Your free trial is used. Please subscribe to continue.");
      setTimeout(() => navigate("/subscription"), 500);
      return;
    }
    
    setSelectedTest(test);
    setInstructionsRead(false);
  };

  const handleStartTest = () => {
    if (!selectedTest || !instructionsRead) {
      toast.error("Please read and confirm the instructions before starting.");
      return;
    }
    const topicParam = selectedTest.topicId ? `&topicId=${selectedTest.topicId}` : "";
    navigate(`/test-start?type=ai${topicParam}&setNumber=${selectedTest.setNumber}`);
  };

  // If a test is selected, show instructions
  if (selectedTest) {
    return (
      <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
        <StudentNav />
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-2xl mx-auto">
          <Button
            onClick={() => setSelectedTest(null)}
            variant="outline"
            className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            ← Back to Tests
          </Button>

          <Card className="p-6 mb-6 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <p className="text-3xl mb-1">🤖</p>
                <p className="text-sm text-gray-600 font-medium">Type</p>
                <p className="text-lg font-bold text-purple-900">AI Test</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <p className="text-3xl mb-1">⏱️</p>
                <p className="text-sm text-gray-600 font-medium">Duration</p>
                <p className="text-lg font-bold text-blue-900">30 mins</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
                <p className="text-3xl mb-1">❓</p>
                <p className="text-sm text-gray-600 font-medium">Questions</p>
                <p className="text-lg font-bold text-pink-900">{selectedTest.questionCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 md:p-8 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              📋 General Instructions
            </h2>

            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border-l-4 border-orange-500">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  ⏰ Timer & Auto-Submit
                </h3>
                <p className="text-sm text-gray-700">
                  The countdown timer (top-right) will auto-submit your test when it reaches <strong>00:00</strong>. No manual submission needed!
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  🎨 Question Status Colors
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-gray-400 bg-white rounded"></div>
                    <span className="text-gray-700">⚪ Not Visited</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-red-500 rounded"></div>
                    <span className="text-gray-700">🔴 Visited / Not Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-500 rounded"></div>
                    <span className="text-gray-700">🟢 Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-purple-500 rounded"></div>
                    <span className="text-gray-700">🟣 Marked for Review</span>
                  </div>
                  <div className="flex items-center gap-2 md:col-span-2">
                    <div className="w-5 h-5 bg-orange-500 rounded"></div>
                    <span className="text-gray-700">🟠 Answered + Marked</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-500">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  🧭 Navigation Tips
                </h3>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• Click question numbers to jump directly</li>
                  <li>• Use <strong className="text-green-700">Save & Next</strong> to record and move ahead</li>
                  <li>• Use <strong className="text-purple-700">Mark for Review & Next</strong> to flag questions</li>
                  <li>• ⚠️ Switching without saving loses your answer!</li>
                </ul>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-l-4 border-purple-500">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  ✍️ Answering Questions
                </h3>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• Select one option (A–D) by clicking</li>
                  <li>• Click again or press <strong>Clear Response</strong> to deselect</li>
                  <li>• Always click <strong className="text-green-700">Save & Next</strong> to confirm</li>
                  <li>• You can revisit and change answers anytime</li>
                </ul>
              </div>

              <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border-l-4 border-yellow-500">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  🛡️ Safety Reminders
                </h3>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• Don't refresh or close the browser</li>
                  <li>• Responses are autosaved when you click Save & Next</li>
                  <li>• Short network drops won't affect saved data</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
              <p className="text-sm text-indigo-900 text-center">
                🤖 <strong>AI-Powered Analysis:</strong> Our system will analyze your responses to improve your next test performance.
              </p>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-200">
              <p className="text-center text-gray-700 italic">
                "Every click brings you closer to mastery. Focus on learning, not just scores." 💪
              </p>
            </div>

            {/* Checkbox for instructions confirmation */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-start gap-3">
              <input
                type="checkbox"
                id="instructions-read"
                checked={instructionsRead}
                onChange={(e) => setInstructionsRead(e.target.checked)}
                className="mt-1 w-5 h-5 cursor-pointer"
              />
              <label htmlFor="instructions-read" className="text-sm text-gray-700 cursor-pointer">
                I have read and understood the instructions. I declare that I am not carrying any prohibited items and agree to follow all test guidelines.
              </label>
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <Button
                onClick={() => setSelectedTest(null)}
                variant="outline"
                className="px-8 py-3"
              >
                Cancel
              </Button>
              <Button
                onClick={handleStartTest}
                disabled={!instructionsRead}
                className={`px-12 py-3 text-lg font-bold shadow-lg hover:shadow-xl transition-all ${
                  instructionsRead
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    : "bg-gray-400 text-gray-600 cursor-not-allowed"
                }`}
              >
                Start Test 🚀
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Show list of available AI tests
  return (
    <div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
      <StudentNav />
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">AI-Generated Questions</h1>
          <p className="text-white/70 mt-1">Select an AI test set to practice with AI-curated topic-wise questions (25 questions per set)</p>
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
                      <Button
                        disabled
                        className="w-full bg-gray-500 cursor-not-allowed"
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Locked
                      </Button>
                    ) : (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                            {test.hasCompleted ? "Re-Take Test" : "Start Test"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-2 space-y-2">
                          <Button
                            onClick={() => handleSelectTest(test)}
                            variant="ghost"
                            className="w-full justify-start text-sm"
                          >
                            Click to test
                          </Button>
                          <Button
                            onClick={() => {
                              const topicParam = test.topicId ? `&topicId=${test.topicId}` : "";
                              window.open(`/test-start?type=ai${topicParam}&setNumber=${test.setNumber}`, '_blank');
                            }}
                            variant="ghost"
                            className="w-full justify-start text-sm"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open in new tab
                          </Button>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}