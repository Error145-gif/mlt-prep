"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StudentDashboard;
var react_1 = require("convex/react");
var api_1 = require("@/convex/_generated/api");
var use_auth_1 = require("@/hooks/use-auth");
var react_router_1 = require("react-router");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var react_2 = require("react");
var DashboardHeader_1 = require("@/components/DashboardHeader");
var PerformanceScore_1 = require("@/components/PerformanceScore");
var SubscriptionStatus_1 = require("@/components/SubscriptionStatus");
var StudentNav_1 = require("@/components/StudentNav");
var TestResultsHistory_1 = require("@/components/TestResultsHistory");
function StudentDashboard() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
    var _0 = (0, use_auth_1.useAuth)(), user = _0.user, isAuthenticated = _0.isAuthenticated, isLoading = _0.isLoading;
    var navigate = (0, react_router_1.useNavigate)();
    var stats = (0, react_1.useQuery)(api_1.api.student.getStudentDashboardStats);
    var subscriptionAccess = (0, react_1.useQuery)(api_1.api.student.checkSubscriptionAccess);
    var userProfile = (0, react_1.useQuery)(api_1.api.users.getUserProfile);
    (0, react_2.useEffect)(function () {
        if (!isLoading && !isAuthenticated) {
            navigate("/auth");
        }
    }, [isAuthenticated, isLoading, navigate]);
    // Redirect only if confirmed not authenticated
    (0, react_2.useEffect)(function () {
        if (!isLoading && !isAuthenticated) {
            navigate("/auth");
        }
    }, [isAuthenticated, isLoading, navigate]);
    // Show loading only during initial auth check
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="text-white text-xl">Loading...</div>
      </div>);
    }
    // If not authenticated after loading, don't render
    if (!isAuthenticated) {
        return null;
    }
    // Safe stats with proper null checks
    var displayStats = stats ? {
        totalTests: (_a = stats.totalTests) !== null && _a !== void 0 ? _a : 0,
        totalQuestionsAttempted: (_b = stats.totalQuestionsAttempted) !== null && _b !== void 0 ? _b : 0,
        avgTimePerQuestion: (_c = stats.avgTimePerQuestion) !== null && _c !== void 0 ? _c : 0,
        overallAccuracy: (_d = stats.overallAccuracy) !== null && _d !== void 0 ? _d : 0,
        performanceScore: (_e = stats.performanceScore) !== null && _e !== void 0 ? _e : 0,
        consistencyStreak: (_f = stats.consistencyStreak) !== null && _f !== void 0 ? _f : 0,
        mockTests: { avgScore: (_h = (_g = stats.mockTests) === null || _g === void 0 ? void 0 : _g.avgScore) !== null && _h !== void 0 ? _h : 0 },
        pyqTests: { avgScore: (_k = (_j = stats.pyqTests) === null || _j === void 0 ? void 0 : _j.avgScore) !== null && _k !== void 0 ? _k : 0 },
        aiTests: { avgScore: (_m = (_l = stats.aiTests) === null || _l === void 0 ? void 0 : _l.avgScore) !== null && _m !== void 0 ? _m : 0 },
        strongestSubject: (_o = stats.strongestSubject) !== null && _o !== void 0 ? _o : "N/A",
        weakestSubject: (_p = stats.weakestSubject) !== null && _p !== void 0 ? _p : "N/A",
        improvementRate: (_q = stats.improvementRate) !== null && _q !== void 0 ? _q : 0,
        totalStudyTime: (_r = stats.totalStudyTime) !== null && _r !== void 0 ? _r : 0,
        avgQuestionsPerTest: (_s = stats.avgQuestionsPerTest) !== null && _s !== void 0 ? _s : 0,
        aiInsights: (_t = stats.aiInsights) !== null && _t !== void 0 ? _t : []
    } : {
        totalTests: 0,
        totalQuestionsAttempted: 0,
        avgTimePerQuestion: 0,
        overallAccuracy: 0,
        performanceScore: 0,
        consistencyStreak: 0,
        mockTests: { avgScore: 0 },
        pyqTests: { avgScore: 0 },
        aiTests: { avgScore: 0 },
        strongestSubject: "N/A",
        weakestSubject: "N/A",
        improvementRate: 0,
        totalStudyTime: 0,
        avgQuestionsPerTest: 0,
        aiInsights: []
    };
    var isLoadingData = !stats || !subscriptionAccess || !userProfile;
    var profileCompletion = userProfile ?
        (userProfile.name ? 25 : 0) +
            (userProfile.avatarUrl ? 25 : 0) +
            (userProfile.examPreparation ? 25 : 0) +
            (userProfile.state ? 25 : 0) : 0;
    var isProfileIncomplete = profileCompletion < 100;
    // Format subscription expiry date
    var formatExpiryDate = function (timestamp) {
        return new Date(timestamp).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    // Calculate days remaining
    var getDaysRemaining = function (endDate) {
        var now = Date.now();
        var diff = endDate - now;
        var days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    };
    // Format time
    var formatTime = function (seconds) {
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return "".concat(hours, "h ").concat(minutes, "m");
        }
        return "".concat(minutes, "m");
    };
    // Get performance score color
    var getPerformanceColor = function (score) {
        if (score >= 80)
            return "from-green-500 to-emerald-600";
        if (score >= 50)
            return "from-yellow-500 to-orange-600";
        return "from-red-500 to-pink-600";
    };
    var getPerformanceBadgeColor = function (score) {
        if (score >= 80)
            return "bg-green-500/20 text-green-300 border-green-500/30";
        if (score >= 50)
            return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
        return "bg-red-500/20 text-red-300 border-red-500/30";
    };
    var getPerformanceLabel = function (score) {
        if (score >= 80)
            return "Excellent";
        if (score >= 50)
            return "Moderate";
        return "Needs Work";
    };
    return (<div className="min-h-screen relative overflow-hidden">
      <StudentNav_1.default />

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl"/>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl"/>
      </div>

      {/* Lab Background Image */}
      <div className="fixed inset-0 z-0 opacity-10" style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&q=80&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
        }}/>

      {/* Profile Completion Gate Overlay */}
      {isProfileIncomplete && (<framer_motion_1.motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <framer_motion_1.motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="relative max-w-md mx-4 p-8 rounded-2xl bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/30 shadow-2xl">
            {/* Glowing particles effect */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute top-0 left-1/4 w-32 h-32 bg-violet-400/30 rounded-full blur-3xl animate-pulse"/>
              <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-pink-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}/>
            </div>

            <div className="relative z-10 text-center space-y-6">
              {/* Lock Icon */}
              <framer_motion_1.motion.div animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
            }} transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
            }} className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg shadow-violet-500/50">
                <span className="text-4xl">🔒</span>
              </framer_motion_1.motion.div>

              {/* Title */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h2>
                <p className="text-white/80 text-sm">
                  Unlock AI Tests, Mock Tests, and PYQ Questions by completing your profile setup.
                </p>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-white/90">
                  <span>Profile Completion</span>
                  <span className="font-bold">{profileCompletion}%</span>
                </div>
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                  <framer_motion_1.motion.div initial={{ width: 0 }} animate={{ width: "".concat(profileCompletion, "%") }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-full shadow-lg shadow-violet-500/50"/>
                </div>
              </div>

              {/* Missing Fields */}
              <div className="text-left space-y-2 p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-2">Required Fields:</p>
                {!(userProfile === null || userProfile === void 0 ? void 0 : userProfile.name) && (<div className="flex items-center gap-2 text-white/80 text-sm">
                    <lucide_react_1.X className="h-4 w-4 text-red-400"/>
                    <span>Full Name</span>
                  </div>)}
                {!(userProfile === null || userProfile === void 0 ? void 0 : userProfile.avatarUrl) && (<div className="flex items-center gap-2 text-white/80 text-sm">
                    <lucide_react_1.X className="h-4 w-4 text-red-400"/>
                    <span>Profile Avatar</span>
                  </div>)}
                {!(userProfile === null || userProfile === void 0 ? void 0 : userProfile.examPreparation) && (<div className="flex items-center gap-2 text-white/80 text-sm">
                    <lucide_react_1.X className="h-4 w-4 text-red-400"/>
                    <span>Exam Preparation</span>
                  </div>)}
                {!(userProfile === null || userProfile === void 0 ? void 0 : userProfile.state) && (<div className="flex items-center gap-2 text-white/80 text-sm">
                    <lucide_react_1.X className="h-4 w-4 text-red-400"/>
                    <span>State</span>
                  </div>)}
              </div>

              {/* Complete Profile Button */}
              <button_1.Button onClick={function () { return navigate("/profile"); }} className="w-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-6 rounded-xl shadow-lg shadow-violet-500/50 hover:shadow-violet-500/70 transition-all duration-300">
                <lucide_react_1.User className="h-5 w-5 mr-2"/>
                Complete Profile Now
              </button_1.Button>
            </div>
          </framer_motion_1.motion.div>
        </framer_motion_1.motion.div>)}

      {/* Main Dashboard Content - Blurred when profile incomplete, show loading skeleton if data not ready */}
      <div className={"relative z-10 max-w-7xl mx-auto space-y-6 transition-all duration-500 ".concat(isProfileIncomplete ? 'blur-sm pointer-events-none' : '')}>
        {isLoadingData && (<div className="glass-card border-white/30 backdrop-blur-xl bg-white/20 p-6 rounded-xl">
            <div className="text-white text-center">Loading your dashboard data...</div>
          </div>)}
        {/* Header */}
        <DashboardHeader_1.default userProfile={userProfile} subscriptionAccess={subscriptionAccess}/>

        {/* Performance Score - PROMINENT DISPLAY */}
        <PerformanceScore_1.default performanceScore={displayStats.performanceScore || 0} consistencyStreak={displayStats.consistencyStreak || 0}/>

        {/* AI Insights Card */}
        {displayStats.aiInsights && displayStats.aiInsights.length > 0 && (<framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card border border-purple-500/50 backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-5 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <lucide_react_1.Sparkles className="h-5 w-5 text-yellow-400"/>
              <h3 className="text-white font-semibold text-lg">Smart Insights</h3>
            </div>
            <div className="space-y-2">
              {displayStats.aiInsights.map(function (insight, index) { return (<framer_motion_1.motion.p key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.1 }} className="text-white/95 text-base leading-relaxed">
                  {insight}
                </framer_motion_1.motion.p>); })}
            </div>
          </framer_motion_1.motion.div>)}

        {/* Subscription Status Card */}
        {subscriptionAccess && subscriptionAccess.hasAccess && subscriptionAccess.subscription && (<SubscriptionStatus_1.default subscription={subscriptionAccess.subscription}/>)}

        {/* User Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <card_1.Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
              <card_1.CardHeader className="flex flex-row items-center justify-between pb-2">
                <card_1.CardTitle className="text-sm font-medium text-white/90">Total Tests</card_1.CardTitle>
                <lucide_react_1.FileText className="h-4 w-4 text-blue-400"/>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="text-2xl font-bold text-white">{displayStats.totalTests || 0}</div>
                <p className="text-xs text-white/80 mt-1">Tests completed</p>
              </card_1.CardContent>
            </card_1.Card>
          </framer_motion_1.motion.div>

          <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <card_1.Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
              <card_1.CardHeader className="flex flex-row items-center justify-between pb-2">
                <card_1.CardTitle className="text-sm font-medium text-white/90">Questions Attempted</card_1.CardTitle>
                <lucide_react_1.Target className="h-4 w-4 text-purple-400"/>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="text-2xl font-bold text-white">{displayStats.totalQuestionsAttempted || 0}</div>
                <p className="text-xs text-white/80 mt-1">Total questions</p>
              </card_1.CardContent>
            </card_1.Card>
          </framer_motion_1.motion.div>

          <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <card_1.Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
              <card_1.CardHeader className="flex flex-row items-center justify-between pb-2">
                <card_1.CardTitle className="text-sm font-medium text-white/90">Avg Time/Question</card_1.CardTitle>
                <lucide_react_1.Clock className="h-4 w-4 text-orange-400"/>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="text-2xl font-bold text-white">{displayStats.avgTimePerQuestion || 0}s</div>
                <p className="text-xs text-white/80 mt-1">Per question</p>
              </card_1.CardContent>
            </card_1.Card>
          </framer_motion_1.motion.div>

          <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <card_1.Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
              <card_1.CardHeader className="flex flex-row items-center justify-between pb-2">
                <card_1.CardTitle className="text-sm font-medium text-white/90">Overall Accuracy</card_1.CardTitle>
                <lucide_react_1.Award className="h-4 w-4 text-green-400"/>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="text-2xl font-bold text-white">{displayStats.overallAccuracy || 0}%</div>
                <p className="text-xs text-white/80 mt-1">Correct answers</p>
              </card_1.CardContent>
            </card_1.Card>
          </framer_motion_1.motion.div>
        </div>

        {/* Performance Breakdown */}
        <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <card_1.Card className="glass-card border-white/30 backdrop-blur-xl bg-gradient-to-br from-white/10 via-purple-500/10 to-pink-500/10 shadow-2xl">
            <card_1.CardHeader>
              <card_1.CardTitle className="text-white flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50">
                  <lucide_react_1.BarChart className="h-5 w-5 text-white"/>
                </div>
                Performance Breakdown
              </card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Mock Tests */}
                <framer_motion_1.motion.div className="space-y-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                      <lucide_react_1.FileText className="h-5 w-5 text-white"/>
                    </div>
                    <h3 className="text-white font-semibold">Mock Tests</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/90 text-sm">Accuracy</span>
                      <span className="text-white font-bold text-lg">{((_u = displayStats === null || displayStats === void 0 ? void 0 : displayStats.mockTests) === null || _u === void 0 ? void 0 : _u.avgScore) || 0}%</span>
                    </div>
                    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                      <framer_motion_1.motion.div initial={{ width: 0 }} animate={{ width: "".concat(Math.min(((_v = displayStats === null || displayStats === void 0 ? void 0 : displayStats.mockTests) === null || _v === void 0 ? void 0 : _v.avgScore) || 0, 100), "%") }} transition={{ duration: 1, delay: 0.5, ease: "easeOut" }} className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full shadow-lg shadow-blue-500/50"/>
                    </div>
                  </div>
                </framer_motion_1.motion.div>

                {/* PYQ Tests */}
                <framer_motion_1.motion.div className="space-y-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30">
                      <lucide_react_1.BookMarked className="h-5 w-5 text-white"/>
                    </div>
                    <h3 className="text-white font-semibold">PYQ Tests</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/90 text-sm">Accuracy</span>
                      <span className="text-white font-bold text-lg">{((_w = displayStats === null || displayStats === void 0 ? void 0 : displayStats.pyqTests) === null || _w === void 0 ? void 0 : _w.avgScore) || 0}%</span>
                    </div>
                    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                      <framer_motion_1.motion.div initial={{ width: 0 }} animate={{ width: "".concat(Math.min(((_x = displayStats === null || displayStats === void 0 ? void 0 : displayStats.pyqTests) === null || _x === void 0 ? void 0 : _x.avgScore) || 0, 100), "%") }} transition={{ duration: 1, delay: 0.6, ease: "easeOut" }} className="absolute h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full shadow-lg shadow-green-500/50"/>
                    </div>
                  </div>
                </framer_motion_1.motion.div>

                {/* AI Tests */}
                <framer_motion_1.motion.div className="space-y-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30">
                      <lucide_react_1.Brain className="h-5 w-5 text-white"/>
                    </div>
                    <h3 className="text-white font-semibold">AI Tests</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/90 text-sm">Accuracy</span>
                      <span className="text-white font-bold text-lg">{((_y = displayStats === null || displayStats === void 0 ? void 0 : displayStats.aiTests) === null || _y === void 0 ? void 0 : _y.avgScore) || 0}%</span>
                    </div>
                    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                      <framer_motion_1.motion.div initial={{ width: 0 }} animate={{ width: "".concat(Math.min(((_z = displayStats === null || displayStats === void 0 ? void 0 : displayStats.aiTests) === null || _z === void 0 ? void 0 : _z.avgScore) || 0, 100), "%") }} transition={{ duration: 1, delay: 0.7, ease: "easeOut" }} className="absolute h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full shadow-lg shadow-purple-500/50"/>
                    </div>
                  </div>
                </framer_motion_1.motion.div>

                {/* Strongest Subject */}
                <framer_motion_1.motion.div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/30">
                      <lucide_react_1.Trophy className="h-5 w-5 text-white"/>
                    </div>
                    <h3 className="text-white font-semibold">Strongest Subject</h3>
                  </div>
                  <div className="text-white/90 text-xl font-bold">{(displayStats === null || displayStats === void 0 ? void 0 : displayStats.strongestSubject) || "N/A"}</div>
                </framer_motion_1.motion.div>

                {/* Weakest Subject */}
                <framer_motion_1.motion.div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-sm border border-red-400/30 hover:border-red-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 shadow-lg shadow-red-500/30">
                      <lucide_react_1.BookOpen className="h-5 w-5 text-white"/>
                    </div>
                    <h3 className="text-white font-semibold">Needs Improvement</h3>
                  </div>
                  <div className="text-white/90 text-xl font-bold">{(displayStats === null || displayStats === void 0 ? void 0 : displayStats.weakestSubject) || "N/A"}</div>
                </framer_motion_1.motion.div>

                {/* Improvement Rate */}
                <framer_motion_1.motion.div className={"space-y-3 p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:shadow-lg ".concat(displayStats.improvementRate >= 0
            ? 'bg-gradient-to-br from-green-500/10 to-teal-500/10 border-green-400/30 hover:border-green-400/50 hover:shadow-green-500/20'
            : 'bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-400/30 hover:border-red-400/50 hover:shadow-red-500/20')} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                  <div className="flex items-center gap-2">
                    <div className={"p-2 rounded-lg shadow-lg ".concat(displayStats.improvementRate >= 0
            ? 'bg-gradient-to-br from-green-500 to-teal-500 shadow-green-500/30'
            : 'bg-gradient-to-br from-red-500 to-orange-500 shadow-red-500/30')}>
                      {displayStats.improvementRate >= 0 ? (<lucide_react_1.TrendingUp className="h-5 w-5 text-white"/>) : (<lucide_react_1.TrendingDown className="h-5 w-5 text-white"/>)}
                    </div>
                    <h3 className="text-white font-semibold">Last Test Change</h3>
                  </div>
                  <div className={"text-2xl font-bold ".concat(((displayStats === null || displayStats === void 0 ? void 0 : displayStats.improvementRate) || 0) >= 0 ? 'text-green-400' : 'text-red-400')}>
                    {((displayStats === null || displayStats === void 0 ? void 0 : displayStats.improvementRate) || 0) >= 0 ? '+' : ''}{(displayStats === null || displayStats === void 0 ? void 0 : displayStats.improvementRate) || 0}%
                  </div>
                </framer_motion_1.motion.div>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </framer_motion_1.motion.div>

        {/* Engagement Metrics */}
        <card_1.Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
          <card_1.CardHeader>
            <card_1.CardTitle className="text-white flex items-center gap-2">
              <lucide_react_1.Zap className="h-5 w-5"/>
              Engagement Metrics
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <lucide_react_1.Clock className="h-5 w-5 text-blue-400"/>
                  <span className="text-white/90">Total Study Time</span>
                </div>
                <div className="text-2xl font-bold text-white">{formatTime((displayStats === null || displayStats === void 0 ? void 0 : displayStats.totalStudyTime) || 0)}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <lucide_react_1.Target className="h-5 w-5 text-purple-400"/>
                  <span className="text-white/90">Avg Questions/Test</span>
                </div>
                <div className="text-2xl font-bold text-white">{(displayStats === null || displayStats === void 0 ? void 0 : displayStats.avgQuestionsPerTest) || 0}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <lucide_react_1.Flame className="h-5 w-5 text-orange-400"/>
                  <span className="text-white/90">Consistency Streak</span>
                </div>
                <div className="text-2xl font-bold text-white">{(displayStats === null || displayStats === void 0 ? void 0 : displayStats.consistencyStreak) || 0} days</div>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <framer_motion_1.motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
            <card_1.Card className="glass-card border-white/30 backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 cursor-pointer hover:scale-105 transition-transform" onClick={function () { return navigate("/tests/mock"); }}>
              <card_1.CardHeader>
                <lucide_react_1.FileText className="h-8 w-8 text-blue-400 mb-2"/>
                <card_1.CardTitle className="text-white">Mock Tests</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <p className="text-white/90">Practice with comprehensive mock tests</p>
              </card_1.CardContent>
            </card_1.Card>
          </framer_motion_1.motion.div>

          <framer_motion_1.motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
            <card_1.Card className="glass-card border-white/30 backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-teal-600/20 cursor-pointer hover:scale-105 transition-transform" onClick={function () { return navigate("/tests/pyq"); }}>
              <card_1.CardHeader>
                <lucide_react_1.BookOpen className="h-8 w-8 text-green-400 mb-2"/>
                <card_1.CardTitle className="text-white">PYQ Sets</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <p className="text-white/90">Solve previous year questions</p>
              </card_1.CardContent>
            </card_1.Card>
          </framer_motion_1.motion.div>

          <framer_motion_1.motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}>
            <card_1.Card className="glass-card border-white/30 backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 cursor-pointer hover:scale-105 transition-transform" onClick={function () { return navigate("/tests/ai"); }}>
              <card_1.CardHeader>
                <lucide_react_1.Brain className="h-8 w-8 text-purple-400 mb-2"/>
                <card_1.CardTitle className="text-white">AI Questions</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <p className="text-white/90">Practice with AI-generated questions</p>
              </card_1.CardContent>
            </card_1.Card>
          </framer_motion_1.motion.div>
        </div>

        {/* Test Results History with Pagination */}
        <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <TestResultsHistory_1.default />
        </framer_motion_1.motion.div>
      </div>
    </div>);
}
