"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SubscriptionManagement;
var use_auth_1 = require("@/hooks/use-auth");
var react_1 = require("convex/react");
var api_1 = require("@/convex/_generated/api");
var react_router_1 = require("react-router");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var tabs_1 = require("@/components/ui/tabs");
var framer_motion_2 = require("framer-motion");
var react_2 = require("react");
function SubscriptionManagement() {
    var _a = (0, use_auth_1.useAuth)(), isLoading = _a.isLoading, isAuthenticated = _a.isAuthenticated, user = _a.user;
    var navigate = (0, react_router_1.useNavigate)();
    var _b = (0, react_2.useState)("all"), activeTab = _b[0], setActiveTab = _b[1];
    var _c = (0, react_2.useState)(false), isMenuOpen = _c[0], setIsMenuOpen = _c[1];
    var subscriptions = (0, react_1.useQuery)(api_1.api.subscriptions.getAllSubscriptions, activeTab === "all" ? {} : { status: activeTab });
    var payments = (0, react_1.useQuery)(api_1.api.subscriptions.getPaymentHistory, {});
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <lucide_react_1.Loader2 className="h-8 w-8 animate-spin"/>
      </div>);
    }
    if (!isAuthenticated || (user === null || user === void 0 ? void 0 : user.role) !== "admin") {
        return <react_router_1.Navigate to="/auth"/>;
    }
    var getStatusBadge = function (status) {
        switch (status) {
            case "active":
                return <badge_1.Badge className="bg-green-500/20 text-green-300 border-green-500/30">Active</badge_1.Badge>;
            case "inactive":
                return <badge_1.Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Inactive</badge_1.Badge>;
            case "expired":
                return <badge_1.Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">Expired</badge_1.Badge>;
            case "cancelled":
                return <badge_1.Badge className="bg-red-500/20 text-red-300 border-red-500/30">Cancelled</badge_1.Badge>;
            default:
                return null;
        }
    };
    return (<div className="min-h-screen p-6 relative">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 z-0"/>
      
      {/* Animated Orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl animate-pulse"/>
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}/>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-pink-400/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}/>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-400/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }}/>
      </div>

      {/* Lab Background Image */}
      <div className="fixed inset-0 z-0 opacity-10" style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}/>
      <framer_motion_2.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={function () { return setIsMenuOpen(!isMenuOpen); }} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">
              {isMenuOpen ? <lucide_react_1.X className="h-6 w-6"/> : <lucide_react_1.Menu className="h-6 w-6"/>}
            </button>
            <h1 className="text-3xl font-bold tracking-tight text-white">Subscription & Payments</h1>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <framer_motion_1.AnimatePresence>
          {isMenuOpen && (<framer_motion_2.motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="glass-card border-white/20 backdrop-blur-xl bg-white/10 rounded-lg overflow-hidden">
              <div className="flex flex-col p-4 space-y-2">
                <button onClick={function () { navigate("/admin"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Dashboard</button>
                <button onClick={function () { navigate("/admin/questions"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Questions</button>
                <button onClick={function () { navigate("/admin/content"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Content</button>
                <button onClick={function () { navigate("/admin/study-materials"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Study Materials</button>
                <button onClick={function () { navigate("/admin/analytics"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Analytics</button>
                <button onClick={function () { navigate("/admin/subscriptions"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Subscriptions</button>
                <button onClick={function () { navigate("/admin/coupons"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Coupons</button>
                <button onClick={function () { navigate("/admin/notifications"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Notifications</button>
                <button onClick={function () { navigate("/admin/feedback"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Feedback</button>
              </div>
            </framer_motion_2.motion.div>)}
        </framer_motion_1.AnimatePresence>

        <tabs_1.Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <tabs_1.TabsList className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <tabs_1.TabsTrigger value="all" className="data-[state=active]:bg-white/20">All</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="active" className="data-[state=active]:bg-white/20">Active</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="inactive" className="data-[state=active]:bg-white/20">Inactive</tabs_1.TabsTrigger>
            <tabs_1.TabsTrigger value="expired" className="data-[state=active]:bg-white/20">Expired</tabs_1.TabsTrigger>
          </tabs_1.TabsList>

          <tabs_1.TabsContent value={activeTab} className="space-y-4 mt-6">
            <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
              <card_1.CardHeader>
                <card_1.CardTitle className="text-white">Subscriptions</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                {!subscriptions || subscriptions.length === 0 ? (<p className="text-white/60 text-center py-8">No subscriptions found</p>) : (<div className="space-y-3">
                    {subscriptions.map(function (sub) { return (<div key={sub._id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                        <div>
                          <p className="font-medium text-white">{sub.userName}</p>
                          <p className="text-sm text-white/60">{sub.userEmail}</p>
                          <p className="text-sm text-white/60 mt-1">{sub.planName}</p>
                        </div>
                        <div className="text-right space-y-2">
                          {getStatusBadge(sub.status)}
                          <p className="text-sm text-white/60">₹{sub.amount}</p>
                          <p className="text-xs text-white/40">
                            {new Date(sub.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>); })}
                  </div>)}
              </card_1.CardContent>
            </card_1.Card>

            <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
              <card_1.CardHeader>
                <card_1.CardTitle className="text-white">Payment History</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                {!payments || payments.length === 0 ? (<p className="text-white/60 text-center py-8">No payments found</p>) : (<div className="space-y-3">
                    {payments.map(function (payment) { return (<div key={payment._id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                        <div>
                          <p className="font-medium text-white">{payment.userName}</p>
                          <p className="text-sm text-white/60">{payment.userEmail}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-white">₹{payment.amount}</p>
                          <p className="text-sm text-white/60 capitalize">{payment.status}</p>
                          <p className="text-xs text-white/40">
                            {new Date(payment._creationTime).toLocaleDateString()}
                          </p>
                        </div>
                      </div>); })}
                  </div>)}
              </card_1.CardContent>
            </card_1.Card>
          </tabs_1.TabsContent>
        </tabs_1.Tabs>
      </framer_motion_2.motion.div>
    </div>);
}
