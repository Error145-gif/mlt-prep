"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SubscriptionPlans;
var react_1 = require("convex/react");
var api_1 = require("@/convex/_generated/api");
var use_auth_1 = require("@/hooks/use-auth");
var react_router_1 = require("react-router");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var sonner_1 = require("sonner");
var react_2 = require("react");
var StudentNav_1 = require("@/components/StudentNav");
function SubscriptionPlans() {
    var _a;
    var _b = (0, use_auth_1.useAuth)(), isAuthenticated = _b.isAuthenticated, isLoading = _b.isLoading;
    var navigate = (0, react_router_1.useNavigate)();
    var subscriptionAccess = (0, react_1.useQuery)(api_1.api.student.checkSubscriptionAccess);
    var _c = (0, react_2.useState)(false), isMenuOpen = _c[0], setIsMenuOpen = _c[1];
    (0, react_2.useEffect)(function () {
        if (!isLoading && !isAuthenticated) {
            navigate("/auth");
        }
    }, [isAuthenticated, isLoading, navigate]);
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="text-white text-xl">Loading...</div>
      </div>);
    }
    var hasAnySubscription = ((_a = subscriptionAccess === null || subscriptionAccess === void 0 ? void 0 : subscriptionAccess.subscription) === null || _a === void 0 ? void 0 : _a.status) === "active";
    var hasPaidSubscription = (subscriptionAccess === null || subscriptionAccess === void 0 ? void 0 : subscriptionAccess.hasAccess) && (subscriptionAccess === null || subscriptionAccess === void 0 ? void 0 : subscriptionAccess.isPaid);
    var hasFreeTrial = (subscriptionAccess === null || subscriptionAccess === void 0 ? void 0 : subscriptionAccess.reason) === "free_trial" && hasAnySubscription;
    var handleSubscribe = function (planId, amount, planName, duration) {
        if (hasPaidSubscription) {
            sonner_1.toast.error("You already have an active paid subscription! Check your dashboard for expiry date.");
            return;
        }
        navigate("/payment-summary?name=".concat(planName, "&price=").concat(amount, "&duration=").concat(duration));
    };
    var plans = [
        {
            id: "trial",
            name: "Free Trial",
            price: 0,
            duration: 7,
            durationText: "7 days",
            icon: lucide_react_1.Sparkles,
            badge: hasFreeTrial ? "Active" : "Auto-Activated",
            features: [
                { text: "First Mock Test (Free)", icon: lucide_react_1.BookOpen },
                { text: "First PYQ Set (Free)", icon: lucide_react_1.BookOpen },
                { text: "First AI Test (Free)", icon: lucide_react_1.Brain },
                { text: "Basic Analytics", icon: lucide_react_1.BarChart3 },
            ],
            action: function () {
                sonner_1.toast.info("Free trial is automatically activated when you register!");
                navigate("/dashboard");
            },
            buttonText: hasFreeTrial ? "Active - Go to Dashboard" : "Already Activated",
            disabled: true,
        },
        {
            id: "monthly",
            name: "Monthly",
            price: 99,
            duration: 30,
            durationText: "month",
            icon: lucide_react_1.BookOpen,
            badge: "Popular Choice",
            features: [
                { text: "Unlimited Mock Tests", icon: lucide_react_1.BookOpen },
                { text: "All PYQ Sets", icon: lucide_react_1.BookOpen },
                { text: "All AI-Based Question Sets", icon: lucide_react_1.Brain },
                { text: "Advanced Analytics", icon: lucide_react_1.BarChart3 },
            ],
            action: function () { return handleSubscribe("monthly", 99, "Monthly Plan", 30); },
            buttonText: hasPaidSubscription ? "Already Subscribed" : "Subscribe Now",
            disabled: hasPaidSubscription,
        },
        {
            id: "4months",
            name: "4 Months",
            price: 399,
            originalPrice: 496,
            savings: "Save ₹97",
            duration: 120,
            durationText: "4 months",
            icon: lucide_react_1.Library,
            badge: "Most Popular",
            popular: true,
            features: [
                { text: "Everything in Monthly Plan", icon: lucide_react_1.Check },
                { text: "Library Access (Coming Soon)", icon: lucide_react_1.Library },
                { text: "Extended Validity (4 Months)", icon: lucide_react_1.Check },
            ],
            action: function () { return handleSubscribe("4months", 399, "4 Months Plan", 120); },
            buttonText: hasPaidSubscription ? "Already Subscribed" : "Subscribe Now",
            disabled: hasPaidSubscription,
        },
        {
            id: "yearly",
            name: "Yearly",
            price: 599,
            originalPrice: 1188,
            savings: "Save ₹589",
            duration: 365,
            durationText: "year",
            icon: lucide_react_1.Library,
            badge: "Best Value",
            features: [
                { text: "Everything in 4-Month Plan", icon: lucide_react_1.Check },
                { text: "1 Year Full Access to All Content", icon: lucide_react_1.Check },
            ],
            action: function () { return handleSubscribe("yearly", 599, "Yearly Plan", 365); },
            buttonText: hasPaidSubscription ? "Already Subscribed" : "Subscribe Now",
            disabled: hasPaidSubscription,
        },
    ];
    return (<div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      <StudentNav_1.default />
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl"/>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl"/>
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-pink-400/25 rounded-full blur-3xl"/>
      </div>

      <div className="fixed inset-0 z-0 opacity-15" style={{
            backgroundImage: 'url(https://harmless-tapir-303.convex.cloud/api/storage/79e8f0e0-a158-4a75-93f3-29c5c9224309)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
        }}/>

      {/* Hamburger Menu Button */}
      <button_1.Button variant="ghost" size="icon" className="fixed top-4 right-4 z-50 glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white md:hidden" onClick={function () { return setIsMenuOpen(!isMenuOpen); }}>
        {isMenuOpen ? <lucide_react_1.X className="h-5 w-5"/> : <lucide_react_1.Menu className="h-5 w-5"/>}
      </button_1.Button>

      {/* Mobile Menu */}
      <framer_motion_1.AnimatePresence>
        {isMenuOpen && (<framer_motion_1.motion.div initial={{ opacity: 0, x: 300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 300 }} className="fixed top-16 right-0 z-40 md:hidden bg-white/10 backdrop-blur-xl border-l border-white/20 w-64 h-screen p-4 space-y-3">
            <button_1.Button onClick={function () {
                navigate("/student");
                setIsMenuOpen(false);
            }} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              Dashboard
            </button_1.Button>
            <button_1.Button onClick={function () {
                navigate("/tests/mock");
                setIsMenuOpen(false);
            }} variant="outline" className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30">
              Mock Tests
            </button_1.Button>
            <button_1.Button onClick={function () {
                navigate("/tests/pyq");
                setIsMenuOpen(false);
            }} variant="outline" className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30">
              PYQ Sets
            </button_1.Button>
            <button_1.Button onClick={function () {
                navigate("/tests/ai");
                setIsMenuOpen(false);
            }} variant="outline" className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30">
              AI Questions
            </button_1.Button>
            <button_1.Button onClick={function () {
                navigate("/profile");
                setIsMenuOpen(false);
            }} variant="outline" className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30">
              Profile
            </button_1.Button>
          </framer_motion_1.motion.div>)}
      </framer_motion_1.AnimatePresence>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">Choose Your Plan</h1>
          <p className="text-white/90 text-sm md:text-base drop-shadow-md">
            Your 7-day Free Trial is automatically activated! Upgrade anytime for full access.
          </p>
          {hasFreeTrial && (<badge_1.Badge className="mt-4 bg-green-500/30 text-white border-green-400/50 backdrop-blur-xl text-sm px-4 py-2">
              ✓ Free Trial Active - First test of each type unlocked!
            </badge_1.Badge>)}
          {hasPaidSubscription && (<badge_1.Badge className="mt-4 bg-white/90 text-purple-700 border-white backdrop-blur-xl text-sm px-4 py-2 shadow-lg">
              ✓ You have an active paid subscription
            </badge_1.Badge>)}
        </div>

        <div className="space-y-4">
          {plans.map(function (plan, index) { return (<framer_motion_1.motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <card_1.Card className={"border-2 ".concat(plan.popular ? 'border-white/50 shadow-2xl' : 'border-white/30', " rounded-2xl overflow-hidden ").concat(plan.disabled && plan.id !== 'trial' ? 'opacity-60' : '', " glass-card backdrop-blur-xl bg-white/20")}>
                <card_1.CardHeader className="bg-gradient-to-r from-white/10 to-white/5 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                        <plan.icon className="h-6 w-6 text-white"/>
                      </div>
                      <div>
                        <card_1.CardTitle className="text-xl text-white">{plan.name}</card_1.CardTitle>
                        {plan.badge && (<badge_1.Badge className="mt-1 bg-white/20 text-white border-white/30 text-xs">
                            {plan.badge}
                          </badge_1.Badge>)}
                      </div>
                    </div>
                    <div className="text-right">
                      {plan.originalPrice && (<div className="flex items-center gap-2">
                          <span className="text-white/60 line-through text-sm">₹{plan.originalPrice}</span>
                          <badge_1.Badge className="bg-red-500/80 text-white border-red-400/50 text-xs">{plan.savings}</badge_1.Badge>
                        </div>)}
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white">₹{plan.price}</span>
                        <span className="text-white/70 text-sm">/{plan.durationText}</span>
                      </div>
                    </div>
                  </div>
                </card_1.CardHeader>
                <card_1.CardContent className="pt-4 space-y-4">
                  <div className="space-y-2">
                    {plan.features.map(function (feature, idx) { return (<div key={idx} className="flex items-center gap-3">
                        <div className="p-1 rounded-full bg-white/20">
                          <feature.icon className="h-4 w-4 text-white"/>
                        </div>
                        <span className="text-white/90 text-sm">{feature.text}</span>
                      </div>); })}
                  </div>
                  <button_1.Button onClick={plan.action} className="w-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] shadow-lg text-white rounded-xl py-6 text-base font-semibold" disabled={plan.disabled && plan.id !== 'trial'}>
                    {plan.buttonText}
                  </button_1.Button>
                </card_1.CardContent>
              </card_1.Card>
            </framer_motion_1.motion.div>); })}
        </div>

        <div className="mt-12 glass-card border border-white/30 backdrop-blur-xl bg-white/20 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 text-center">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-2 font-semibold text-white">Feature</th>
                  <th className="text-center py-3 px-2 font-semibold text-white">Free Trial</th>
                  <th className="text-center py-3 px-2 font-semibold text-white">Monthly</th>
                  <th className="text-center py-3 px-2 font-semibold text-white">4 Months</th>
                  <th className="text-center py-3 px-2 font-semibold text-white">Yearly</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-2 text-white/90">Mock Tests</td>
                  <td className="text-center py-3 px-2 text-white/70">First Test Only</td>
                  <td className="text-center py-3 px-2"><lucide_react_1.Check className="h-5 w-5 text-green-600 mx-auto"/></td>
                  <td className="text-center py-3 px-2"><lucide_react_1.Check className="h-5 w-5 text-green-600 mx-auto"/></td>
                  <td className="text-center py-3 px-2"><lucide_react_1.Check className="h-5 w-5 text-green-600 mx-auto"/></td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-2 text-white/90">PYQ Sets</td>
                  <td className="text-center py-3 px-2 text-white/70">First Set Only</td>
                  <td className="text-center py-3 px-2"><lucide_react_1.Check className="h-5 w-5 text-green-600 mx-auto"/></td>
                  <td className="text-center py-3 px-2"><lucide_react_1.Check className="h-5 w-5 text-green-600 mx-auto"/></td>
                  <td className="text-center py-3 px-2"><lucide_react_1.Check className="h-5 w-5 text-green-600 mx-auto"/></td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-2 text-white/90">AI-Based Questions</td>
                  <td className="text-center py-3 px-2 text-white/70">First Test Only</td>
                  <td className="text-center py-3 px-2"><lucide_react_1.Check className="h-5 w-5 text-green-600 mx-auto"/></td>
                  <td className="text-center py-3 px-2"><lucide_react_1.Check className="h-5 w-5 text-green-600 mx-auto"/></td>
                  <td className="text-center py-3 px-2"><lucide_react_1.Check className="h-5 w-5 text-green-600 mx-auto"/></td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-2 text-white/90">Library Access</td>
                  <td className="text-center py-3 px-2 text-white/70 text-sm">Coming Soon</td>
                  <td className="text-center py-3 px-2 text-white/70 text-sm">Coming Soon</td>
                  <td className="text-center py-3 px-2 text-white/70 text-sm">Coming Soon</td>
                  <td className="text-center py-3 px-2 text-white/70 text-sm">Coming Soon</td>
                </tr>
                <tr>
                  <td className="py-3 px-2 text-white/90">Analytics</td>
                  <td className="text-center py-3 px-2 text-white/70">Basic</td>
                  <td className="text-center py-3 px-2 text-white/90">Advanced</td>
                  <td className="text-center py-3 px-2 text-white/90">Advanced</td>
                  <td className="text-center py-3 px-2 text-white/90">Advanced</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card border border-white/30 backdrop-blur-xl bg-white/20 rounded-xl p-4 text-center">
          <p className="text-sm text-white">
            <strong>Note:</strong> Free trial is automatically activated when you register. You get access to the first test of each type (Mock, PYQ, AI). Upgrade anytime for unlimited access!
          </p>
        </div>
      </div>
    </div>);
}
