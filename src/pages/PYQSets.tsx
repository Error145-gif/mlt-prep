import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function PYQSets() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const pyqSets = useQuery(api.student.getPYQSets);
  const userProfile = useQuery(api.users.getUserProfile);
  const canAccessPYQ = useQuery(api.student.canAccessTestType, { testType: "pyq" });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || !pyqSets) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!pyqSets || pyqSets.length === 0) {
    return (
      <div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white">No PYQ Sets Available</h1>
          <p className="text-white/70 mt-2">Check back soon for previous year questions</p>
        </div>
      </div>
    );
  }

  const firstSet = pyqSets[0];

  const handleStartPYQ = () => {
    const isFirstTest = pyqSets.length > 0 && pyqSets[0] === firstSet;
    const hasPaidSubscription = canAccessPYQ?.reason === "paid_subscription";
    
    // If not first test and no paid subscription, it's locked
    if (!isFirstTest && !hasPaidSubscription) {
      toast.error("This test is locked! Subscribe to unlock all tests.");
      setTimeout(() => navigate("/subscription"), 1000);
      return;
    }
    
    // If first test but free trial already used, redirect to subscription
    if (isFirstTest && canAccessPYQ?.reason === "free_trial_used") {
      toast.error("Your free trial is used. Please subscribe to continue.");
      setTimeout(() => navigate("/subscription"), 500);
      return;
    }
    
    navigate(`/test-start?type=pyq&year=${firstSet.year}&setNumber=${firstSet.setNumber}`);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">📘</span>
            <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">Previous Year Questions</h1>
          </div>
          <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            {userProfile?.avatarUrl ? (
              <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                <AvatarImage src={userProfile.avatarUrl} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {userProfile.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            ) : (
              <User className="h-10 w-10 text-white" />
            )}
            <span className="font-semibold text-white">{userProfile?.name || "Student"}</span>
          </div>
        </div>

        {/* Test Summary Card */}
        <Card className="p-6 mb-6 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <p className="text-3xl mb-1">📘</p>
              <p className="text-sm text-gray-600 font-medium">Test Type</p>
              <p className="text-lg font-bold text-blue-900">PYQ Set</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <p className="text-3xl mb-1">🕒</p>
              <p className="text-sm text-gray-600 font-medium">Duration</p>
              <p className="text-lg font-bold text-purple-900">{Math.ceil(firstSet.questionCount / 20) * 10} mins</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
              <p className="text-3xl mb-1">❓</p>
              <p className="text-sm text-gray-600 font-medium">Questions</p>
              <p className="text-lg font-bold text-pink-900">{firstSet.questionCount}</p>
            </div>
          </div>
        </Card>

        {/* Instructions Card */}
        <Card className="p-6 md:p-8 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            📋 General Instructions
          </h2>

          <div className="space-y-6">
            {/* Timer Section */}
            <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border-l-4 border-orange-500">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                ⏰ Timer & Auto-Submit
              </h3>
              <p className="text-sm text-gray-700">
                The countdown timer (top-right) will auto-submit your test when it reaches <strong>00:00</strong>. No manual submission needed!
              </p>
            </div>

            {/* Question Palette */}
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
              <p className="text-xs text-gray-600 mt-3 italic">
                💡 Answers marked for review are still evaluated unless changed.
              </p>
            </div>

            {/* Navigation */}
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

            {/* Answering MCQs */}
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

            {/* Safety Reminders */}
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

          {/* AI Enhancement Note */}
          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
            <p className="text-sm text-indigo-900 text-center">
              🤖 <strong>AI-Powered Analysis:</strong> Our system will analyze your responses to improve your next test performance.
            </p>
          </div>

          {/* Motivational Quote */}
          <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-200">
            <p className="text-center text-gray-700 italic">
              "Every click brings you closer to mastery. Focus on learning, not just scores." 💪
            </p>
          </div>

          {/* Acceptance Checkbox */}
          <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
            <div className="flex items-start gap-3">
              <Checkbox
                id="accept"
                className="mt-1 h-5 w-5 border-2 border-blue-600 data-[state=checked]:bg-blue-600"
              />
              <Label htmlFor="accept" className="text-sm cursor-pointer text-gray-800 leading-relaxed">
                I have read and understood the instructions. I declare that I am not carrying any prohibited items and agree to follow all test guidelines.
              </Label>
            </div>
          </div>

          {/* Start Button */}
          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleStartPYQ}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all animate-pulse"
            >
              Start Test 🚀
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}