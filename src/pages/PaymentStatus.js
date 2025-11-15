"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PaymentStatus;
var react_1 = require("react");
var react_router_1 = require("react-router");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var lucide_react_2 = require("lucide-react");
var react_2 = require("react");
var framer_motion_1 = require("framer-motion");
function PaymentStatus() {
    var searchParams = (0, react_router_1.useSearchParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var _a = (0, react_2.useState)(false), isMenuOpen = _a[0], setIsMenuOpen = _a[1];
    var status = searchParams.get("status");
    var isSuccess = status === "success";
    (0, react_1.useEffect)(function () {
        var timer = setTimeout(function () {
            navigate("/dashboard");
        }, 5000);
        return function () { return clearTimeout(timer); };
    }, [navigate]);
    return (<div className="min-h-screen p-6 lg:p-8 relative overflow-hidden flex items-center justify-center">
      {/* Hamburger Menu Button - Mobile Only */}
      <button onClick={function () { return setIsMenuOpen(!isMenuOpen); }} className="fixed top-6 right-6 z-50 md:hidden bg-white/20 backdrop-blur-sm p-2 rounded-lg hover:bg-white/30 transition-all">
        {isMenuOpen ? (<lucide_react_2.X className="h-6 w-6 text-white"/>) : (<lucide_react_2.Menu className="h-6 w-6 text-white"/>)}
      </button>

      {/* Mobile Menu */}
      <framer_motion_1.AnimatePresence>
        {isMenuOpen && (<framer_motion_1.motion.div initial={{ opacity: 0, x: 300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 300 }} transition={{ duration: 0.3 }} className="fixed top-0 right-0 h-screen w-64 bg-gradient-to-br from-blue-600 to-purple-700 z-40 md:hidden shadow-2xl p-6 space-y-4">
            <div className="mt-12 space-y-3">
              <button onClick={function () {
                navigate("/dashboard");
                setIsMenuOpen(false);
            }} className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all">
                📊 Dashboard
              </button>
              <button onClick={function () {
                navigate("/tests/mock");
                setIsMenuOpen(false);
            }} className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all">
                🧩 Mock Tests
              </button>
              <button onClick={function () {
                navigate("/tests/pyq");
                setIsMenuOpen(false);
            }} className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all">
                📚 PYQ Sets
              </button>
              <button onClick={function () {
                navigate("/tests/ai");
                setIsMenuOpen(false);
            }} className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all">
                🤖 AI Questions
              </button>
              <button onClick={function () {
                navigate("/profile");
                setIsMenuOpen(false);
            }} className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all">
                👤 Profile
              </button>
            </div>
          </framer_motion_1.motion.div>)}
      </framer_motion_1.AnimatePresence>

      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl"/>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl"/>
      </div>

      <framer_motion_1.motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 max-w-2xl w-full">
        <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
          <card_1.CardHeader className="text-center">
            <framer_motion_1.motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="flex justify-center mb-4">
              <div className={"p-4 ".concat(isSuccess ? 'bg-green-500/20' : 'bg-red-500/20', " rounded-full")}>
                {isSuccess ? (<lucide_react_1.CheckCircle className="h-16 w-16 text-green-400"/>) : (<lucide_react_1.XCircle className="h-16 w-16 text-red-400"/>)}
              </div>
            </framer_motion_1.motion.div>
            <card_1.CardTitle className="text-3xl text-white">
              {isSuccess ? "Payment Successful!" : "Payment Failed"}
            </card_1.CardTitle>
            <p className="text-white/70 mt-2">
              {isSuccess
            ? "Your subscription has been activated successfully. An invoice has been sent to your email."
            : "There was an issue processing your payment. Please try again or contact support."}
            </p>
          </card_1.CardHeader>
          
          <card_1.CardContent className="space-y-4">
            <div className="space-y-3">
              <button_1.Button onClick={function () { return navigate("/dashboard"); }} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Go to Dashboard
              </button_1.Button>
              {!isSuccess && (<button_1.Button onClick={function () { return navigate("/subscription"); }} variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  Try Again
                </button_1.Button>)}
            </div>
            <p className="text-xs text-white/50 text-center">
              Redirecting to dashboard in 5 seconds...
            </p>
          </card_1.CardContent>
        </card_1.Card>
      </framer_motion_1.motion.div>
    </div>);
}
