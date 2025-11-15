"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PYQSets;
var react_1 = require("convex/react");
var api_1 = require("@/convex/_generated/api");
var use_auth_1 = require("@/hooks/use-auth");
var react_router_1 = require("react-router");
var react_2 = require("react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var framer_motion_1 = require("framer-motion");
var sonner_1 = require("sonner");
var lucide_react_1 = require("lucide-react");
var StudentNav_1 = require("@/components/StudentNav");
function PYQSets() {
    var _a = (0, use_auth_1.useAuth)(), isAuthenticated = _a.isAuthenticated, isLoading = _a.isLoading, user = _a.user;
    var navigate = (0, react_router_1.useNavigate)();
    var pyqSets = (0, react_1.useQuery)(api_1.api.student.getPYQSets);
    var userProfile = (0, react_1.useQuery)(api_1.api.users.getUserProfile);
    var canAccessPYQ = (0, react_1.useQuery)(api_1.api.student.canAccessTestType, { testType: "pyq" });
    var _b = (0, react_2.useState)(null), selectedSet = _b[0], setSelectedSet = _b[1];
    var _c = (0, react_2.useState)(false), isMenuOpen = _c[0], setIsMenuOpen = _c[1];
    (0, react_2.useEffect)(function () {
        if (!isLoading && !isAuthenticated) {
            navigate("/auth");
        }
    }, [isAuthenticated, isLoading, navigate]);
    if (isLoading || !pyqSets) {
        return (<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="text-white text-xl">Loading...</div>
      </div>);
    }
    if (!pyqSets || pyqSets.length === 0) {
        return (<div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500"/>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white">No PYQ Sets Available</h1>
          <p className="text-white/70 mt-2">Check back soon for previous year questions</p>
        </div>
      </div>);
    }
    var handleSelectSet = function (set) {
        var isFirstTest = pyqSets.length > 0 && pyqSets[0] === set;
        var hasPaidSubscription = (canAccessPYQ === null || canAccessPYQ === void 0 ? void 0 : canAccessPYQ.reason) === "paid_subscription";
        if (!isFirstTest && !hasPaidSubscription) {
            sonner_1.toast.error("This test is locked! Subscribe to unlock all tests.");
            setTimeout(function () { return navigate("/subscription"); }, 1000);
            return;
        }
        if (isFirstTest && (canAccessPYQ === null || canAccessPYQ === void 0 ? void 0 : canAccessPYQ.reason) === "free_trial_used") {
            sonner_1.toast.error("Your free trial is used. Please subscribe to continue.");
            setTimeout(function () { return navigate("/subscription"); }, 500);
            return;
        }
        // Direct start - navigate immediately
        navigate("/test-start?type=pyq&year=".concat(set.year, "&setNumber=").concat(set.setNumber));
    };
    // If a set is selected, show instructions
    if (selectedSet) {
        return (<div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl animate-pulse"/>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}/>
        </div>

        <div className="max-w-2xl mx-auto">
          <button_1.Button onClick={function () { return setSelectedSet(null); }} variant="outline" className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
            ← Back to Sets
          </button_1.Button>

          <card_1.Card className="p-6 mb-6 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <p className="text-3xl mb-1">📘</p>
                <p className="text-sm text-gray-600 font-medium">Exam</p>
                <p className="text-lg font-bold text-blue-900">{selectedSet.examName}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <p className="text-3xl mb-1">📅</p>
                <p className="text-sm text-gray-600 font-medium">Year</p>
                <p className="text-lg font-bold text-purple-900">{selectedSet.year}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
                <p className="text-3xl mb-1">❓</p>
                <p className="text-sm text-gray-600 font-medium">Questions</p>
                <p className="text-lg font-bold text-pink-900">{selectedSet.questionCount}</p>
              </div>
            </div>
          </card_1.Card>

          <card_1.Card className="p-6 md:p-8 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
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

            <div className="mt-6 flex justify-center gap-4">
              <button_1.Button onClick={function () { return setSelectedSet(null); }} variant="outline" className="px-8 py-3">
                Cancel
              </button_1.Button>
              <button_1.Button onClick={function () { return handleSelectSet(selectedSet); }} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-3 text-lg font-bold shadow-lg hover:shadow-xl transition-all">
                Start Test 🚀
              </button_1.Button>
            </div>
          </card_1.Card>
        </div>
      </div>);
    }
    // Show list of available PYQ sets
    return (<div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
      <StudentNav_1.default />
      
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl animate-pulse"/>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}/>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6 pt-20">
        <div>
          <h1 className="text-3xl font-bold text-white">Previous Year Questions</h1>
          <p className="text-white/70 mt-1">Select an exam and year to practice with previous year questions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pyqSets.map(function (set, index) {
            var isFirstTest = index === 0;
            var hasPaidSubscription = (canAccessPYQ === null || canAccessPYQ === void 0 ? void 0 : canAccessPYQ.reason) === "paid_subscription";
            var isLocked = !isFirstTest && !hasPaidSubscription;
            return (<framer_motion_1.motion.div key={"".concat(set.examName, "-").concat(set.year, "-").concat(set.setNumber)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <card_1.Card className={"glass-card border-white/20 backdrop-blur-xl bg-white/10 hover:bg-white/15 transition-all cursor-pointer ".concat(isLocked ? 'opacity-60' : '')}>
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white">{set.examName}</h3>
                        <p className="text-white/70 text-sm">Year: {set.year}</p>
                      </div>
                      {isLocked && (<lucide_react_1.Lock className="h-6 w-6 text-yellow-400"/>)}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-white/70">
                        <span className="text-sm">📝 Set {set.setNumber}/{set.totalSets}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/70">
                        <span className="text-sm">❓ {set.questionCount} Questions</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/70">
                        <span className="text-sm">🕒 ~{Math.ceil(set.questionCount / 20) * 10} mins</span>
                      </div>
                    </div>

                    {set.subjects && set.subjects.length > 0 && (<div className="flex flex-wrap gap-2">
                        {set.subjects.slice(0, 3).map(function (subject) { return (<badge_1.Badge key={subject} className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                            {subject}
                          </badge_1.Badge>); })}
                        {set.subjects.length > 3 && (<badge_1.Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                            +{set.subjects.length - 3} more
                          </badge_1.Badge>)}
                      </div>)}

                    {set.hasCompleted && (<badge_1.Badge className="bg-green-500/20 text-green-300 border-green-500/30 w-full text-center justify-center">
                        ✓ Completed
                      </badge_1.Badge>)}

                    {isLocked ? (<button_1.Button disabled className="w-full bg-gray-500 cursor-not-allowed">
                        <lucide_react_1.Lock className="h-4 w-4 mr-2"/>
                        Locked
                      </button_1.Button>) : (<button_1.Button onClick={function () { return handleSelectSet(set); }} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                        {set.hasCompleted ? "Re-Take Test" : "Start Test"}
                      </button_1.Button>)}
                  </div>
                </card_1.Card>
              </framer_motion_1.motion.div>);
        })}
        </div>
      </div>
    </div>);
}
