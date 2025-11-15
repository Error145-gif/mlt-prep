"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Landing;
var framer_motion_1 = require("framer-motion");
var button_1 = require("@/components/ui/button");
var react_router_1 = require("react-router");
var use_auth_1 = require("@/hooks/use-auth");
var lucide_react_1 = require("lucide-react");
var react_1 = require("convex/react");
var api_1 = require("@/convex/_generated/api");
var sonner_1 = require("sonner");
var react_2 = require("react");
var react_3 = require("@convex-dev/auth/react");
function Landing() {
    var _this = this;
    var signOut = (0, react_3.useAuthActions)().signOut;
    (0, react_2.useEffect)(function () {
        // Set meta tags for SEO
        document.title = "MLT Prep - AI-Powered Medical Lab Technology Learning";
        var metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute("content", "Master MLT with AI-powered questions, previous year papers, mock tests, and progress tracking. 7-day free trial for medical lab technology students.");
        }
        var metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.setAttribute("content", "MLT, Medical Lab Technology, ESIC MLT, mock tests, PYQ, AI questions, exam preparation");
        }
    }, []);
    var navigate = (0, react_router_1.useNavigate)();
    var _a = (0, use_auth_1.useAuth)(), isAuthenticated = _a.isAuthenticated, user = _a.user, isLoading = _a.isLoading;
    var makeAdmin = (0, react_1.useMutation)(api_1.api.users.makeCurrentUserAdmin);
    var handleMakeAdmin = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, makeAdmin({})];
                case 1:
                    _a.sent();
                    sonner_1.toast.success("You are now an admin! Redirecting...");
                    setTimeout(function () { return navigate("/admin"); }, 1000);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    sonner_1.toast.error(error_1.message || "Failed to make you an admin. Please try again.");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var features = [
        {
            icon: lucide_react_1.Brain,
            title: "AI-Powered Questions",
            description: "Practice with AI-generated MCQs tailored to MLT exam patterns",
        },
        {
            icon: lucide_react_1.BookOpen,
            title: "Previous Year Questions",
            description: "Access comprehensive PYQ sets organized by exam and year",
        },
        {
            icon: lucide_react_1.Award,
            title: "Mock Tests",
            description: "Take full-length mock tests to simulate real exam conditions",
        },
        {
            icon: lucide_react_1.TrendingUp,
            title: "Track Progress",
            description: "Monitor your performance with detailed analytics and rankings",
        },
    ];
    return (<div className="min-h-screen relative overflow-hidden">
      {/* Lab Background Image - Lighter */}
      <div className="fixed inset-0 z-0 opacity-20" style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&q=80&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
        }}/>

      {/* Animated Background Gradients - Vibrant Purple/Blue Theme */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl"/>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl"/>
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-pink-400/25 rounded-full blur-3xl"/>
        <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] bg-cyan-400/25 rounded-full blur-3xl"/>
        
        {/* Floating Medical Icons */}
        <framer_motion_1.motion.div className="absolute top-20 left-10 text-6xl opacity-20" animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
        }} transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
        }}>
          💉
        </framer_motion_1.motion.div>
        
        <framer_motion_1.motion.div className="absolute top-40 right-20 text-5xl opacity-20" animate={{
            y: [0, 25, 0],
            rotate: [0, -15, 15, 0],
        }} transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
        }}>
          🔬
        </framer_motion_1.motion.div>
        
        <framer_motion_1.motion.div className="absolute bottom-32 left-1/4 text-5xl opacity-20" animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
        }} transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
        }}>
          🧪
        </framer_motion_1.motion.div>
        
        <framer_motion_1.motion.div className="absolute bottom-20 right-1/3 text-4xl opacity-20" animate={{
            y: [0, 30, 0],
            rotate: [0, 20, -20, 0],
        }} transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
        }}>
          🩺
        </framer_motion_1.motion.div>
      </div>

      {/* Navigation */}
      <nav className="glass-card border-b border-white/20 backdrop-blur-xl bg-white/10 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={function () { return navigate("/"); }}>
            <img src="https://harmless-tapir-303.convex.cloud/api/storage/6068c740-5624-49d7-8c20-c6c805df135b" alt="MLT Logo" loading="eager" className="h-16 w-16 object-contain" onError={function (e) { e.currentTarget.src = "/logo_bg.png"; }}/>
            <span className="text-2xl font-bold text-white drop-shadow-lg">MLT Prep</span>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (<>
                {(user === null || user === void 0 ? void 0 : user.role) === "admin" && (<button_1.Button onClick={function () { return navigate("/admin"); }} className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                    Admin Panel
                  </button_1.Button>)}
                {(user === null || user === void 0 ? void 0 : user.role) !== "admin" && (user === null || user === void 0 ? void 0 : user.email) === "ak6722909@gmail.com" && (<button_1.Button onClick={handleMakeAdmin} className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700">
                    Activate Admin Access
                  </button_1.Button>)}
                <button_1.Button onClick={function () { return navigate("/student"); }} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Dashboard
                </button_1.Button>
                <button_1.Button onClick={function () { return signOut(); }} variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                  <lucide_react_1.LogOut className="h-4 w-4 mr-2"/>
                  Sign Out
                </button_1.Button>
              </>) : (<button_1.Button onClick={function () { return navigate("/auth"); }} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Get Started
              </button_1.Button>)}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <framer_motion_1.motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-6 text-center lg:text-left">
          <framer_motion_1.motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/30 backdrop-blur-xl bg-white/20 text-white mb-4 shadow-md" animate={{
            boxShadow: [
                "0 0 20px rgba(255, 255, 255, 0.3)",
                "0 0 40px rgba(255, 255, 255, 0.6)",
                "0 0 20px rgba(255, 255, 255, 0.3)",
            ],
        }} transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
        }}>
            <framer_motion_1.motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
              <lucide_react_1.Sparkles className="h-4 w-4"/>
            </framer_motion_1.motion.div>
            <span className="text-sm">AI-Powered Medical Lab Technology Learning</span>
          </framer_motion_1.motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight drop-shadow-2xl">
            Master MLT with
            <br />
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              Smart Learning
            </span>
          </h1>
          
          <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-lg">
            Comprehensive study materials, AI-generated practice questions, and personalized analytics to help you excel in Medical Lab Technology
          </p>
          
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
              <framer_motion_1.motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button_1.Button onClick={function () { return navigate(isAuthenticated ? ((user === null || user === void 0 ? void 0 : user.role) === "admin" ? "/admin" : "/student") : "/auth"); }} size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 shadow-lg hover:shadow-2xl transition-shadow">
                  {isAuthenticated ? ((user === null || user === void 0 ? void 0 : user.role) === "admin" ? "Admin Panel" : "Go to Dashboard") : "Start Learning"}
                  <framer_motion_1.motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="inline-block ml-2">
                    <lucide_react_1.ArrowRight className="h-5 w-5"/>
                  </framer_motion_1.motion.div>
                </button_1.Button>
              </framer_motion_1.motion.div>
            </div>
          </framer_motion_1.motion.div>

          {/* Right side - Animated Character */}
          <framer_motion_1.motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex justify-center lg:justify-end">
            <framer_motion_1.motion.div animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
        }} transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
        }} className="relative">
              <framer_motion_1.motion.img src="https://harmless-tapir-303.convex.cloud/api/storage/95eceda1-7789-4d29-bf58-640afb9f4499" alt="MLT Mascot" loading="lazy" className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 drop-shadow-2xl" animate={{
            scale: [1, 1.05, 1],
        }} transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
        }}/>
            </framer_motion_1.motion.div>
          </framer_motion_1.motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <framer_motion_1.motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white drop-shadow-lg mb-4">Everything You Need to Succeed</h2>
          <p className="text-white/90 text-lg drop-shadow-md">Powerful features designed for effective learning</p>
        </framer_motion_1.motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(function (feature, index) { return (<framer_motion_1.motion.div key={feature.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 60px rgba(139, 92, 246, 0.4)",
                transition: { duration: 0.3 }
            }} className="glass-card border border-white/30 backdrop-blur-xl bg-white/20 p-6 rounded-2xl hover:bg-white/30 transition-all duration-300 shadow-xl">
              <framer_motion_1.motion.div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 w-fit mb-4" animate={{
                boxShadow: [
                    "0 0 20px rgba(139, 92, 246, 0.5)",
                    "0 0 40px rgba(139, 92, 246, 0.8)",
                    "0 0 20px rgba(139, 92, 246, 0.5)",
                ],
            }} transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
            }}>
                <feature.icon className="h-6 w-6 text-white"/>
              </framer_motion_1.motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </framer_motion_1.motion.div>); })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <framer_motion_1.motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="glass-card border border-white/20 backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 p-12 rounded-3xl text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students mastering Medical Lab Technology with our comprehensive platform
          </p>
          <button_1.Button onClick={function () { return navigate("/auth"); }} size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8">
            Get Started Free
            <lucide_react_1.ArrowRight className="ml-2 h-5 w-5"/>
          </button_1.Button>
        </framer_motion_1.motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/20 backdrop-blur-xl bg-transparent py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <h3 className="text-white font-semibold mb-3">MLT Prep</h3>
              <p className="text-white/60 text-sm">
                Comprehensive Medical Lab Technology education platform for government and technical exam preparation.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Quick Links</h3>
              <div className="space-y-2">
                <a href="/contact-us" className="block text-white/60 hover:text-white text-sm transition-colors">Contact Us</a>
                <a href="/terms" className="block text-white/60 hover:text-white text-sm transition-colors">Terms & Conditions</a>
                <a href="/privacy" className="block text-white/60 hover:text-white text-sm transition-colors">Privacy Policy</a>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Policies</h3>
              <div className="space-y-2">
                <a href="/shipping-policy" className="block text-white/60 hover:text-white text-sm transition-colors">Shipping Policy</a>
                <a href="/refund-policy" className="block text-white/60 hover:text-white text-sm transition-colors">Refund Policy</a>
              </div>
            </div>
          </div>
          <div className="text-center text-white/60 pt-6 border-t border-white/20">
            <p>© 2024 MLT Prep. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>);
}
