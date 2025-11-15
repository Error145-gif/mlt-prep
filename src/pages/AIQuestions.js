"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AIQuestions;
var react_1 = require("convex/react");
var api_1 = require("@/convex/_generated/api");
var use_auth_1 = require("@/hooks/use-auth");
var react_router_1 = require("react-router");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var react_2 = require("react");
var sonner_1 = require("sonner");
var StudentNav_1 = require("@/components/StudentNav");
function AIQuestions() {
    var _a = (0, use_auth_1.useAuth)(), isAuthenticated = _a.isAuthenticated, isLoading = _a.isLoading;
    var navigate = (0, react_router_1.useNavigate)();
    var aiTests = (0, react_1.useQuery)(api_1.api.student.getAIQuestions, {});
    var canAccessAI = (0, react_1.useQuery)(api_1.api.student.canAccessTestType, { testType: "ai" });
    (0, react_2.useEffect)(function () {
        if (!isLoading && !isAuthenticated) {
            navigate("/auth");
        }
    }, [isAuthenticated, isLoading, navigate]);
    if (isLoading || !aiTests) {
        return (<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="text-white text-xl">Loading...</div>
      </div>);
    }
    if (!aiTests || aiTests.length === 0) {
        return (<div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
        <StudentNav_1.default />
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500"/>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white">No AI Tests Available</h1>
          <p className="text-white/70 mt-2">Check back soon for new AI-generated questions</p>
        </div>
      </div>);
    }
    var handleStartTest = function (test, isFirstTest) {
        var hasPaidSubscription = (canAccessAI === null || canAccessAI === void 0 ? void 0 : canAccessAI.reason) === "paid_subscription";
        if (!isFirstTest && !hasPaidSubscription) {
            sonner_1.toast.error("This test is locked! Subscribe to unlock all tests.");
            setTimeout(function () { return navigate("/subscription"); }, 1000);
            return;
        }
        if (isFirstTest && (canAccessAI === null || canAccessAI === void 0 ? void 0 : canAccessAI.reason) === "free_trial_used") {
            sonner_1.toast.error("Your free trial is used. Please subscribe to continue.");
            setTimeout(function () { return navigate("/subscription"); }, 500);
            return;
        }
        navigate("/test-start?type=ai&topicId=general&setNumber=".concat(test.setNumber));
    };
    // Show list of available AI tests
    return (<div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
      <StudentNav_1.default />
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl animate-pulse"/>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}/>
      </div>

      {/* Lab Background Image */}
      <div className="fixed inset-0 -z-10 opacity-15" style={{
            backgroundImage: 'url(https://harmless-tapir-303.convex.cloud/api/storage/1e73bac3-1079-442a-b8f9-4e8b71bf087f)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
        }}/>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">AI-Generated Questions</h1>
          <p className="text-white/70 mt-1">Select an AI test set to practice with AI-curated topic-wise questions (25 questions per set)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiTests.map(function (test, index) {
            var isFirstTest = index === 0;
            var hasPaidSubscription = (canAccessAI === null || canAccessAI === void 0 ? void 0 : canAccessAI.reason) === "paid_subscription";
            var isLocked = !isFirstTest && !hasPaidSubscription;
            return (<framer_motion_1.motion.div key={"".concat(test.topicId, "-").concat(test.setNumber)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <card_1.Card className={"glass-card border-white/20 backdrop-blur-xl bg-white/10 hover:bg-white/15 transition-all cursor-pointer ".concat(isLocked ? 'opacity-60' : '')}>
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white">AI Challenge Test</h3>
                        <p className="text-white/70 text-sm">Set {test.setNumber}/{test.totalSets}</p>
                      </div>
                      {isLocked && (<lucide_react_1.Lock className="h-6 w-6 text-yellow-400"/>)}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-white/70">
                        <span className="text-sm">⏱️ 30 mins</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/70">
                        <span className="text-sm">❓ {test.questionCount} Questions</span>
                      </div>
                    </div>

                    {test.hasCompleted && (<badge_1.Badge className="bg-green-500/20 text-green-300 border-green-500/30 w-full text-center justify-center">
                        ✓ Completed
                      </badge_1.Badge>)}

                    {isLocked ? (<button_1.Button disabled className="w-full bg-gray-500 cursor-not-allowed">
                        <lucide_react_1.Lock className="h-4 w-4 mr-2"/>
                        Locked
                      </button_1.Button>) : (<button_1.Button onClick={function () { return handleStartTest(test, isFirstTest); }} className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                        {test.hasCompleted ? "Re-Take Test" : "Start Test"}
                      </button_1.Button>)}
                  </div>
                </card_1.Card>
              </framer_motion_1.motion.div>);
        })}
        </div>
      </div>
    </div>);
}
