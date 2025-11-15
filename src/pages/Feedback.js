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
exports.default = Feedback;
var react_1 = require("convex/react");
var api_1 = require("@/convex/_generated/api");
var use_auth_1 = require("@/hooks/use-auth");
var react_router_1 = require("react-router");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var textarea_1 = require("@/components/ui/textarea");
var label_1 = require("@/components/ui/label");
var select_1 = require("@/components/ui/select");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var react_2 = require("react");
var sonner_1 = require("sonner");
var StudentNav_1 = require("@/components/StudentNav");
function Feedback() {
    var _this = this;
    var _a = (0, use_auth_1.useAuth)(), isAuthenticated = _a.isAuthenticated, isLoading = _a.isLoading;
    var navigate = (0, react_router_1.useNavigate)();
    var myFeedback = (0, react_1.useQuery)(api_1.api.feedback.getMyFeedback);
    var submitFeedback = (0, react_1.useMutation)(api_1.api.feedback.submitFeedback);
    var _b = (0, react_2.useState)(5), rating = _b[0], setRating = _b[1];
    var _c = (0, react_2.useState)("improvement"), category = _c[0], setCategory = _c[1];
    var _d = (0, react_2.useState)(""), message = _d[0], setMessage = _d[1];
    var _e = (0, react_2.useState)(false), isSubmitting = _e[0], setIsSubmitting = _e[1];
    var _f = (0, react_2.useState)(false), isMenuOpen = _f[0], setIsMenuOpen = _f[1];
    (0, react_2.useEffect)(function () {
        if (!isLoading && !isAuthenticated) {
            navigate("/auth");
        }
    }, [isAuthenticated, isLoading, navigate]);
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!message.trim()) {
                        sonner_1.toast.error("Please enter your feedback");
                        return [2 /*return*/];
                    }
                    setIsSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, submitFeedback({ rating: rating, category: category, message: message })];
                case 2:
                    _a.sent();
                    sonner_1.toast.success("Feedback submitted successfully!");
                    setMessage("");
                    setRating(5);
                    setCategory("improvement");
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    sonner_1.toast.error("Failed to submit feedback");
                    return [3 /*break*/, 5];
                case 4:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
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
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl animate-pulse"/>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}/>
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-pink-400/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}/>
        <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] bg-cyan-400/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }}/>
      </div>

      {/* Lab Background Image */}
      <div className="fixed inset-0 -z-10 opacity-15" style={{
            backgroundImage: 'url(https://harmless-tapir-303.convex.cloud/api/storage/8bc8f98d-c6cd-4f01-bf46-c5c4f7e11a17)',
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
                navigate("/subscription");
                setIsMenuOpen(false);
            }} variant="outline" className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30">
              Subscription
            </button_1.Button>
          </framer_motion_1.motion.div>)}
      </framer_motion_1.AnimatePresence>
      
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Feedback</h1>
          <p className="text-white/70 mt-1">Help us improve your learning experience</p>
        </div>

        {/* Submit Feedback Form */}
        <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <card_1.CardHeader>
              <div className="flex items-center gap-3">
                <lucide_react_1.MessageSquare className="h-8 w-8 text-blue-400"/>
                <card_1.CardTitle className="text-white">Share Your Feedback</card_1.CardTitle>
              </div>
            </card_1.CardHeader>
            <card_1.CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label_1.Label className="text-white">Rating</label_1.Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(function (star) { return (<button key={star} type="button" onClick={function () { return setRating(star); }} className="transition-transform hover:scale-110">
                        <lucide_react_1.Star className={"h-8 w-8 ".concat(star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-white/30")}/>
                      </button>); })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label_1.Label className="text-white">Category</label_1.Label>
                  <select_1.Select value={category} onValueChange={setCategory}>
                    <select_1.SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <select_1.SelectValue />
                    </select_1.SelectTrigger>
                    <select_1.SelectContent>
                      <select_1.SelectItem value="bug">Bug Report</select_1.SelectItem>
                      <select_1.SelectItem value="feature">Feature Request</select_1.SelectItem>
                      <select_1.SelectItem value="improvement">Improvement</select_1.SelectItem>
                      <select_1.SelectItem value="other">Other</select_1.SelectItem>
                    </select_1.SelectContent>
                  </select_1.Select>
                </div>

                <div className="space-y-2">
                  <label_1.Label className="text-white">Your Feedback</label_1.Label>
                  <textarea_1.Textarea value={message} onChange={function (e) { return setMessage(e.target.value); }} placeholder="Tell us what you think..." className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-32" required/>
                </div>

                <button_1.Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <lucide_react_1.Send className="h-4 w-4 mr-2"/>
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </button_1.Button>
              </form>
            </card_1.CardContent>
          </card_1.Card>
        </framer_motion_1.motion.div>

        {/* Previous Feedback */}
        {myFeedback && myFeedback.length > 0 && (<card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <card_1.CardHeader>
              <card_1.CardTitle className="text-white">Your Previous Feedback</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              {myFeedback.map(function (feedback) { return (<div key={feedback._id} className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <badge_1.Badge variant={feedback.status === "resolved" ? "default" :
                    feedback.status === "reviewed" ? "secondary" : "outline"}>
                        {feedback.status}
                      </badge_1.Badge>
                      <badge_1.Badge variant="outline">{feedback.category}</badge_1.Badge>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: feedback.rating }).map(function (_, i) { return (<lucide_react_1.Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400"/>); })}
                    </div>
                  </div>
                  <p className="text-white">{feedback.message}</p>
                  {feedback.adminNotes && (<div className="mt-2 p-3 rounded bg-blue-500/10 border border-blue-500/20">
                      <p className="text-sm text-blue-300 font-medium mb-1">Admin Response:</p>
                      <p className="text-sm text-white/80">{feedback.adminNotes}</p>
                    </div>)}
                  <p className="text-xs text-white/50">
                    {new Date(feedback._creationTime).toLocaleDateString()}
                  </p>
                </div>); })}
            </card_1.CardContent>
          </card_1.Card>)}
      </div>
    </div>);
}
