"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ImageQuestionManagement;
var use_auth_1 = require("@/hooks/use-auth");
var react_router_1 = require("react-router");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var ImageQuestionUpload_1 = require("@/components/ImageQuestionUpload");
var button_1 = require("@/components/ui/button");
var react_1 = require("@convex-dev/auth/react");
var react_2 = require("react");
function ImageQuestionManagement() {
    var _a = (0, use_auth_1.useAuth)(), isLoading = _a.isLoading, isAuthenticated = _a.isAuthenticated, user = _a.user;
    var signOut = (0, react_1.useAuthActions)().signOut;
    var navigate = (0, react_router_1.useNavigate)();
    var _b = (0, react_2.useState)(false), isMenuOpen = _b[0], setIsMenuOpen = _b[1];
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <lucide_react_1.Loader2 className="h-8 w-8 animate-spin"/>
      </div>);
    }
    if (!isAuthenticated) {
        return <react_router_1.Navigate to="/auth"/>;
    }
    if ((user === null || user === void 0 ? void 0 : user.role) !== "admin") {
        return <react_router_1.Navigate to="/student"/>;
    }
    return (<div className="min-h-screen p-6 relative">
      {/* Animated gradient background */}
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

      {/* Lab background image */}
      <div className="fixed inset-0 opacity-10" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
        }}/>

      <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={function () { return setIsMenuOpen(!isMenuOpen); }} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">
              {isMenuOpen ? <lucide_react_1.X className="h-6 w-6"/> : <lucide_react_1.Menu className="h-6 w-6"/>}
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Image-Based Questions</h1>
              <p className="text-white/70 mt-1">Upload questions with images for AI and Mock tests</p>
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

        <ImageQuestionUpload_1.default />
      </framer_motion_1.motion.div>
    </div>);
}
