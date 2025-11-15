"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminDashboard;
var use_auth_1 = require("@/hooks/use-auth");
var react_1 = require("convex/react");
var api_1 = require("@/convex/_generated/api");
var react_router_1 = require("react-router");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var react_2 = require("react");
var react_3 = require("@convex-dev/auth/react");
function AdminDashboard() {
    var _a = (0, use_auth_1.useAuth)(), isLoading = _a.isLoading, isAuthenticated = _a.isAuthenticated, user = _a.user;
    var signOut = (0, react_3.useAuthActions)().signOut;
    var navigate = (0, react_router_1.useNavigate)();
    var _b = (0, react_2.useState)(false), isMenuOpen = _b[0], setIsMenuOpen = _b[1];
    var stats = (0, react_1.useQuery)(api_1.api.analytics.getDashboardStats, (user === null || user === void 0 ? void 0 : user.role) === "admin" ? {} : "skip");
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <lucide_react_1.Loader2 className="h-8 w-8 animate-spin"/>
      </div>);
    }
    if (!isAuthenticated) {
        return <react_router_1.Navigate to="/auth"/>;
    }
    // If user is authenticated but not admin, redirect to dashboard
    if ((user === null || user === void 0 ? void 0 : user.role) !== "admin") {
        return <react_router_1.Navigate to="/dashboard"/>;
    }
    var statCards = [
        {
            title: "Total Users",
            value: (stats === null || stats === void 0 ? void 0 : stats.totalUsers) || 0,
            icon: lucide_react_1.Users,
            color: "from-blue-400 to-blue-600",
        },
        {
            title: "Active Subscriptions",
            value: (stats === null || stats === void 0 ? void 0 : stats.activeSubscriptions) || 0,
            icon: lucide_react_1.CreditCard,
            color: "from-green-400 to-green-600",
        },
        {
            title: "Total Revenue",
            value: "\u20B9".concat((stats === null || stats === void 0 ? void 0 : stats.totalRevenue) || 0),
            icon: lucide_react_1.TrendingUp,
            color: "from-purple-400 to-purple-600",
        },
        {
            title: "Total Content",
            value: (stats === null || stats === void 0 ? void 0 : stats.totalContent) || 0,
            icon: lucide_react_1.FileText,
            color: "from-orange-400 to-orange-600",
        },
        {
            title: "Total Questions",
            value: (stats === null || stats === void 0 ? void 0 : stats.totalQuestions) || 0,
            icon: lucide_react_1.FileText,
            color: "from-cyan-400 to-cyan-600",
        },
        {
            title: "Approved Questions",
            value: (stats === null || stats === void 0 ? void 0 : stats.approvedQuestions) || 0,
            icon: lucide_react_1.FileText,
            color: "from-teal-400 to-teal-600",
        },
        {
            title: "Manual Questions",
            value: (stats === null || stats === void 0 ? void 0 : stats.manualQuestions) || 0,
            icon: lucide_react_1.FileText,
            color: "from-indigo-400 to-indigo-600",
        },
        {
            title: "Pending Questions",
            value: (stats === null || stats === void 0 ? void 0 : stats.pendingQuestions) || 0,
            icon: lucide_react_1.AlertCircle,
            color: "from-red-400 to-red-600",
        },
        {
            title: "Mock Test Sets",
            value: (stats === null || stats === void 0 ? void 0 : stats.mockTestSets) || 0,
            icon: lucide_react_1.FileText,
            color: "from-emerald-400 to-emerald-600",
        },
        {
            title: "AI Test Sets",
            value: (stats === null || stats === void 0 ? void 0 : stats.aiTestSets) || 0,
            icon: lucide_react_1.FileText,
            color: "from-violet-400 to-violet-600",
        },
        {
            title: "PYQ Test Sets",
            value: (stats === null || stats === void 0 ? void 0 : stats.pyqTestSets) || 0,
            icon: lucide_react_1.FileText,
            color: "from-rose-400 to-rose-600",
        },
    ];
    return (<div className="min-h-screen p-6 relative">
      {/* Animated gradient background matching Landing page */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500"/>
      
      {/* Animated orbs */}
      <framer_motion_1.motion.div className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl" animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
        }} transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
        }}/>
      <framer_motion_1.motion.div className="fixed top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl" animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
        }} transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 1,
        }}/>
      <framer_motion_1.motion.div className="fixed bottom-0 left-1/4 w-[600px] h-[600px] bg-pink-400/40 rounded-full blur-3xl" animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
        }} transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
            delay: 0.5,
        }}/>
      <framer_motion_1.motion.div className="fixed top-1/2 right-1/4 w-[400px] h-[400px] bg-cyan-400/40 rounded-full blur-3xl" animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
        }} transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear",
            delay: 0.7,
        }}/>

      {/* Lab background image */}
      <div className="fixed inset-0 opacity-10" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
        }}/>

      <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={function () { return setIsMenuOpen(!isMenuOpen); }} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">
              {isMenuOpen ? <lucide_react_1.X className="h-6 w-6"/> : <lucide_react_1.Menu className="h-6 w-6"/>}
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-white/70 mt-1">Manage your MLT Prep platform</p>
            </div>
          </div>
          <button_1.Button onClick={function () { return signOut(); }} variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
            <lucide_react_1.LogOut className="h-4 w-4 mr-2"/>
            Sign Out
          </button_1.Button>
        </div>

        {/* Mobile Navigation Menu */}
        <framer_motion_1.AnimatePresence>
          {isMenuOpen && (<framer_motion_1.motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="glass-card border-white/20 backdrop-blur-xl bg-white/10 rounded-lg overflow-hidden">
              <div className="flex flex-col p-4 space-y-2">
                <button onClick={function () { navigate("/admin"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Dashboard</button>
                <button onClick={function () { navigate("/admin/questions"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Questions</button>
                <button onClick={function () { navigate("/admin/image-questions"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10 flex items-center gap-2">
                  <lucide_react_1.Image className="h-4 w-4"/>
                  Image Questions
                </button>
                <button onClick={function () { navigate("/admin/content"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Content</button>
                <button onClick={function () { navigate("/admin/study-materials"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Study Materials</button>
                <button onClick={function () { navigate("/admin/analytics"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Analytics</button>
                <button onClick={function () { navigate("/admin/subscriptions"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Subscriptions</button>
                <button onClick={function () { navigate("/admin/coupons"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Coupons</button>
                <button onClick={function () { navigate("/admin/notifications"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Notifications</button>
                <button onClick={function () { navigate("/admin/feedback"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Feedback</button>
              </div>
            </framer_motion_1.motion.div>)}
        </framer_motion_1.AnimatePresence>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {statCards.map(function (stat, index) { return (<framer_motion_1.motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <card_1.Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
                <card_1.CardHeader className="flex flex-row items-center justify-between pb-2">
                  <card_1.CardTitle className="text-sm font-medium text-white/90">
                    {stat.title}
                  </card_1.CardTitle>
                  <div className={"p-2 rounded-lg bg-gradient-to-br ".concat(stat.color)}>
                    <stat.icon className="h-4 w-4 text-white"/>
                  </div>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                </card_1.CardContent>
              </card_1.Card>
            </framer_motion_1.motion.div>); })}
        </div>

        {/* Recent Content */}
        <card_1.Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
          <card_1.CardHeader>
            <card_1.CardTitle className="text-white">Recently Uploaded Content</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            {!(stats === null || stats === void 0 ? void 0 : stats.recentContent) || stats.recentContent.length === 0 ? (<p className="text-white/80 text-center py-8">No content uploaded yet</p>) : (<div className="space-y-3">
                {stats.recentContent.map(function (content) { return (<div key={content._id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <div>
                      <p className="font-medium text-white">{content.title}</p>
                      <p className="text-sm text-white/80">{content.type.toUpperCase()}</p>
                    </div>
                    <div className="text-sm text-white/80">
                      {content.views} views
                    </div>
                  </div>); })}
              </div>)}
          </card_1.CardContent>
        </card_1.Card>

        {/* Recent Payments */}
        <card_1.Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
          <card_1.CardHeader>
            <card_1.CardTitle className="text-white">Recent Payments</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            {!(stats === null || stats === void 0 ? void 0 : stats.recentPayments) || stats.recentPayments.length === 0 ? (<p className="text-white/80 text-center py-8">No payments yet</p>) : (<div className="space-y-3">
                {stats.recentPayments.map(function (payment) { return (<div key={payment._id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <div>
                      <p className="font-medium text-white">₹{payment.amount}</p>
                      <p className="text-sm text-white/80">{payment.status}</p>
                    </div>
                    <div className="text-sm text-white/80">
                      {new Date(payment._creationTime).toLocaleDateString()}
                    </div>
                  </div>); })}
              </div>)}
          </card_1.CardContent>
        </card_1.Card>
      </framer_motion_1.motion.div>
    </div>);
}
