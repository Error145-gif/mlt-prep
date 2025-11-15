"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MockTests;
var react_1 = require("convex/react");
var api_1 = require("@/convex/_generated/api");
var use_auth_1 = require("@/hooks/use-auth");
var react_router_1 = require("react-router");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var react_2 = require("react");
var sonner_1 = require("sonner");
var StudentNav_1 = require("@/components/StudentNav");
function MockTests() {
    var _a = (0, use_auth_1.useAuth)(), isAuthenticated = _a.isAuthenticated, isLoading = _a.isLoading;
    var navigate = (0, react_router_1.useNavigate)();
    var mockTests = (0, react_1.useQuery)(api_1.api.student.getMockTests, {});
    var canAccessMock = (0, react_1.useQuery)(api_1.api.student.canAccessTestType, { testType: "mock" });
    (0, react_2.useEffect)(function () {
        if (!isLoading && !isAuthenticated) {
            navigate("/auth");
        }
    }, [isAuthenticated, isLoading, navigate]);
    if (isLoading || !mockTests) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>);
    }
    var handleStartTest = function (topicId, setNumber, isFirstTest) {
        var hasPaidSubscription = (canAccessMock === null || canAccessMock === void 0 ? void 0 : canAccessMock.reason) === "paid_subscription";
        if (!isFirstTest && !hasPaidSubscription) {
            sonner_1.toast.error("This test is locked! Subscribe to unlock all tests.");
            setTimeout(function () { return navigate("/subscription"); }, 1000);
            return;
        }
        if (isFirstTest && (canAccessMock === null || canAccessMock === void 0 ? void 0 : canAccessMock.reason) === "free_trial_used") {
            sonner_1.toast.error("Your free trial is used. Please subscribe to continue.");
            setTimeout(function () { return navigate("/subscription"); }, 500);
            return;
        }
        if (topicId) {
            navigate("/test-start?type=mock&topicId=".concat(topicId, "&setNumber=").concat(setNumber));
        }
        else {
            navigate("/test-start?type=mock&setNumber=".concat(setNumber));
        }
    };
    return (<div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
      <StudentNav_1.default />
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl animate-pulse"/>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}/>
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-pink-400/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}/>
        <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] bg-cyan-400/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }}/>
      </div>

      {/* Lab Background Image */}
      <div className="fixed inset-0 z-0 opacity-10" style={{
            backgroundImage: 'url(https://harmless-tapir-303.convex.cloud/api/storage/b5c7b06f-8b6e-4419-949e-f800852edc5e)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}/>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Mock Tests</h1>
          <p className="text-white/70 mt-1">Practice with comprehensive topic-wise tests (100 questions per set)</p>
          {(canAccessMock === null || canAccessMock === void 0 ? void 0 : canAccessMock.reason) === "free_trial" && (<p className="text-yellow-400 mt-2">🎁 Free trial: You can take one mock test for free!</p>)}
          {(canAccessMock === null || canAccessMock === void 0 ? void 0 : canAccessMock.reason) === "free_trial_used" && (<p className="text-red-400 mt-2">⚠️ Free trial used. Subscribe to continue testing.</p>)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTests.map(function (test, index) {
            var isFirstTest = index === 0;
            var hasPaidSubscription = (canAccessMock === null || canAccessMock === void 0 ? void 0 : canAccessMock.reason) === "paid_subscription";
            var isLocked = !isFirstTest && !hasPaidSubscription;
            return (<framer_motion_1.motion.div key={"".concat(test.topicId, "-").concat(test.setNumber)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <card_1.Card className={"glass-card border-white/20 backdrop-blur-xl bg-white/10 hover:bg-white/15 transition-all ".concat(isLocked ? 'opacity-60' : '')}>
                  <card_1.CardHeader>
                    <div className="flex items-center justify-between">
                      {isLocked ? (<img src="https://harmless-tapir-303.convex.cloud/api/storage/22271688-6e3c-45a0-a31d-8c82daf67b1e" alt="Locked" className="h-12 w-12 object-contain"/>) : (<lucide_react_1.FileText className="h-8 w-8 text-blue-400"/>)}
                      <badge_1.Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        Set {test.setNumber}/{test.totalSets}
                      </badge_1.Badge>
                    </div>
                    <card_1.CardTitle className="text-white mt-4 flex items-center gap-2">
                      {test.topicName}
                      {isLocked && (<img src="https://harmless-tapir-303.convex.cloud/api/storage/22271688-6e3c-45a0-a31d-8c82daf67b1e" alt="Locked" className="h-6 w-6 object-contain"/>)}
                    </card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-white/70">
                      <lucide_react_1.Clock className="h-4 w-4"/>
                      <span className="text-sm">60 mins</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <lucide_react_1.Target className="h-4 w-4"/>
                      <span className="text-sm">{test.questionCount} Questions</span>
                    </div>
                    {isLocked ? (<button_1.Button onClick={function () {
                        sonner_1.toast.error("This test is locked! Subscribe to unlock all tests.");
                        setTimeout(function () { return navigate("/subscription"); }, 1000);
                    }} className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700">
                        <img src="https://harmless-tapir-303.convex.cloud/api/storage/22271688-6e3c-45a0-a31d-8c82daf67b1e" alt="Locked" className="h-4 w-4 mr-2"/>
                        Unlock with Subscription
                      </button_1.Button>) : (<button_1.Button onClick={function () { return handleStartTest(test.topicId, test.setNumber, isFirstTest); }} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                        {test.hasCompleted ? ((canAccessMock === null || canAccessMock === void 0 ? void 0 : canAccessMock.canAccess) ? "Re-Test" : "Subscribe to Re-Test") : isFirstTest && (canAccessMock === null || canAccessMock === void 0 ? void 0 : canAccessMock.reason) === "free_trial" ? "Start Free Test" : "Start Test"}
                      </button_1.Button>)}
                  </card_1.CardContent>
                </card_1.Card>
              </framer_motion_1.motion.div>);
        })}
        </div>
      </div>
    </div>);
}
