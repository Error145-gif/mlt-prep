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
exports.default = FreeLibrary;
var use_auth_1 = require("@/hooks/use-auth");
var react_router_1 = require("react-router");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var react_1 = require("react");
var react_2 = require("convex/react");
var api_1 = require("@/convex/_generated/api");
var sonner_1 = require("sonner");
var StudentNav_1 = require("@/components/StudentNav");
function FreeLibrary() {
    var _this = this;
    var _a = (0, use_auth_1.useAuth)(), isAuthenticated = _a.isAuthenticated, isLoading = _a.isLoading;
    var navigate = (0, react_router_1.useNavigate)();
    var studyMaterials = (0, react_2.useQuery)(api_1.api.studyMaterials.getAllStudyMaterials);
    var incrementViews = (0, react_2.useMutation)(api_1.api.studyMaterials.incrementViews);
    var subscriptionAccess = (0, react_2.useQuery)(api_1.api.student.checkSubscriptionAccess);
    var _b = (0, react_1.useState)(false), isMenuOpen = _b[0], setIsMenuOpen = _b[1];
    (0, react_1.useEffect)(function () {
        if (!isLoading && !isAuthenticated) {
            navigate("/auth");
        }
    }, [isAuthenticated, isLoading, navigate]);
    // Check if user has 4-month or yearly subscription
    var hasLibraryAccess = (subscriptionAccess === null || subscriptionAccess === void 0 ? void 0 : subscriptionAccess.subscription) &&
        subscriptionAccess.isPaid &&
        (subscriptionAccess.subscription.planName === "4 Months Plan" ||
            subscriptionAccess.subscription.planName === "Yearly Plan");
    var handleDownload = function (materialId, fileUrl, title) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!hasLibraryAccess) {
                        sonner_1.toast.error("Library access is only available with 4-month or yearly subscription!");
                        setTimeout(function () { return navigate("/subscription"); }, 1500);
                        return [2 /*return*/];
                    }
                    if (!fileUrl) {
                        sonner_1.toast.error("File not available");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    // Increment view count
                    return [4 /*yield*/, incrementViews({ materialId: materialId })];
                case 2:
                    // Increment view count
                    _a.sent();
                    // Open file in new tab for download
                    window.open(fileUrl, "_blank");
                    sonner_1.toast.success("Opening file...");
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error downloading file:", error_1);
                    sonner_1.toast.error("Failed to open file");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>);
    }
    return (<div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
      <StudentNav_1.default />
      
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl"/>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl"/>
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-pink-400/25 rounded-full blur-3xl"/>
      </div>

      {/* Lab Background Image */}
      <div className="fixed inset-0 z-0 opacity-15" style={{
            backgroundImage: 'url(https://harmless-tapir-303.convex.cloud/api/storage/5d790ddc-cd7f-4bb6-bad0-66ff850ea5ed)',
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

      <div className="relative z-10 max-w-6xl mx-auto">
        <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Library
          </h1>
          <p className="text-white/90 text-lg drop-shadow-md">
            Study Material & Handwritten Notes
          </p>
        </framer_motion_1.motion.div>

        <framer_motion_1.motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <card_1.Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
            <card_1.CardContent className="p-12 text-center">
              <framer_motion_1.motion.div animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
        }} transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
        }} className="inline-block mb-6">
                <lucide_react_1.BookOpen className="h-24 w-24 text-white/80"/>
              </framer_motion_1.motion.div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                Coming Soon...
              </h2>
              
              <p className="text-white/90 text-lg mb-6">
                Study materials and handwritten notes will be available soon. Stay tuned!
              </p>
            </card_1.CardContent>
          </card_1.Card>
        </framer_motion_1.motion.div>
      </div>
    </div>);
}
