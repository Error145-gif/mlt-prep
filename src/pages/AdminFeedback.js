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
exports.default = AdminFeedback;
var react_1 = require("convex/react");
var api_1 = require("@/convex/_generated/api");
var use_auth_1 = require("@/hooks/use-auth");
var react_router_1 = require("react-router");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var textarea_1 = require("@/components/ui/textarea");
var badge_1 = require("@/components/ui/badge");
var select_1 = require("@/components/ui/select");
var dialog_1 = require("@/components/ui/dialog");
var label_1 = require("@/components/ui/label");
var lucide_react_2 = require("lucide-react");
var framer_motion_2 = require("framer-motion");
var react_2 = require("react");
var sonner_1 = require("sonner");
function AdminFeedback() {
    var _this = this;
    var _a = (0, use_auth_1.useAuth)(), isLoading = _a.isLoading, isAuthenticated = _a.isAuthenticated, user = _a.user;
    var navigate = (0, react_router_1.useNavigate)();
    var _b = (0, react_2.useState)(undefined), statusFilter = _b[0], setStatusFilter = _b[1];
    var _c = (0, react_2.useState)(undefined), categoryFilter = _c[0], setCategoryFilter = _c[1];
    var _d = (0, react_2.useState)(false), isMenuOpen = _d[0], setIsMenuOpen = _d[1];
    var feedback = (0, react_1.useQuery)(api_1.api.feedback.getAllFeedback, (user === null || user === void 0 ? void 0 : user.role) === "admin" ? { status: statusFilter, category: categoryFilter } : "skip");
    var stats = (0, react_1.useQuery)(api_1.api.feedback.getFeedbackStats, (user === null || user === void 0 ? void 0 : user.role) === "admin" ? {} : "skip");
    var updateStatus = (0, react_1.useMutation)(api_1.api.feedback.updateFeedbackStatus);
    var _e = (0, react_2.useState)(null), selectedFeedback = _e[0], setSelectedFeedback = _e[1];
    var _f = (0, react_2.useState)(""), adminNotes = _f[0], setAdminNotes = _f[1];
    var _g = (0, react_2.useState)(""), newStatus = _g[0], setNewStatus = _g[1];
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <lucide_react_2.Loader2 className="h-8 w-8 animate-spin text-white"/>
      </div>);
    }
    if (!isAuthenticated || (user === null || user === void 0 ? void 0 : user.role) !== "admin") {
        return <react_router_1.Navigate to="/auth"/>;
    }
    var handleUpdateStatus = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedFeedback || !newStatus)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, updateStatus({
                            feedbackId: selectedFeedback._id,
                            status: newStatus,
                            adminNotes: adminNotes || undefined,
                        })];
                case 2:
                    _a.sent();
                    sonner_1.toast.success("Feedback updated successfully");
                    setSelectedFeedback(null);
                    setAdminNotes("");
                    setNewStatus("");
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    sonner_1.toast.error("Failed to update feedback");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
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
      <framer_motion_2.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <button onClick={function () { return setIsMenuOpen(!isMenuOpen); }} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all">
              {isMenuOpen ? <lucide_react_1.X className="h-6 w-6"/> : <lucide_react_1.Menu className="h-6 w-6"/>}
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">User Feedback</h1>
              <p className="text-white/70 mt-1">Manage and respond to user feedback</p>
            </div>
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

        {/* Stats Cards */}
        {stats && (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
              <card_1.CardHeader className="flex flex-row items-center justify-between pb-2">
                <card_1.CardTitle className="text-sm font-medium text-white/80">Total Feedback</card_1.CardTitle>
                <lucide_react_2.MessageSquare className="h-4 w-4 text-blue-400"/>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="text-2xl font-bold text-white">{stats.total}</div>
              </card_1.CardContent>
            </card_1.Card>

            <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
              <card_1.CardHeader className="flex flex-row items-center justify-between pb-2">
                <card_1.CardTitle className="text-sm font-medium text-white/80">New</card_1.CardTitle>
                <lucide_react_2.AlertCircle className="h-4 w-4 text-orange-400"/>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="text-2xl font-bold text-white">{stats.new}</div>
              </card_1.CardContent>
            </card_1.Card>

            <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
              <card_1.CardHeader className="flex flex-row items-center justify-between pb-2">
                <card_1.CardTitle className="text-sm font-medium text-white/80">Average Rating</card_1.CardTitle>
                <lucide_react_2.Star className="h-4 w-4 text-yellow-400"/>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="text-2xl font-bold text-white">{stats.avgRating.toFixed(1)}</div>
              </card_1.CardContent>
            </card_1.Card>

            <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
              <card_1.CardHeader className="flex flex-row items-center justify-between pb-2">
                <card_1.CardTitle className="text-sm font-medium text-white/80">Resolved</card_1.CardTitle>
                <lucide_react_2.CheckCircle className="h-4 w-4 text-green-400"/>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="text-2xl font-bold text-white">{stats.resolved}</div>
              </card_1.CardContent>
            </card_1.Card>
          </div>)}

        {/* Filters */}
        <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
          <card_1.CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <label_1.Label className="text-white mb-2 block">Filter by Status</label_1.Label>
                <select_1.Select value={statusFilter || "all"} onValueChange={function (v) { return setStatusFilter(v === "all" ? undefined : v); }}>
                  <select_1.SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <select_1.SelectValue />
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    <select_1.SelectItem value="all">All Status</select_1.SelectItem>
                    <select_1.SelectItem value="new">New</select_1.SelectItem>
                    <select_1.SelectItem value="reviewed">Reviewed</select_1.SelectItem>
                    <select_1.SelectItem value="resolved">Resolved</select_1.SelectItem>
                  </select_1.SelectContent>
                </select_1.Select>
              </div>
              <div className="flex-1">
                <label_1.Label className="text-white mb-2 block">Filter by Category</label_1.Label>
                <select_1.Select value={categoryFilter || "all"} onValueChange={function (v) { return setCategoryFilter(v === "all" ? undefined : v); }}>
                  <select_1.SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <select_1.SelectValue />
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    <select_1.SelectItem value="all">All Categories</select_1.SelectItem>
                    <select_1.SelectItem value="bug">Bug Report</select_1.SelectItem>
                    <select_1.SelectItem value="feature">Feature Request</select_1.SelectItem>
                    <select_1.SelectItem value="improvement">Improvement</select_1.SelectItem>
                    <select_1.SelectItem value="other">Other</select_1.SelectItem>
                  </select_1.SelectContent>
                </select_1.Select>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {/* Feedback List */}
        <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
          <card_1.CardHeader>
            <card_1.CardTitle className="text-white">All Feedback</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            {!feedback || feedback.length === 0 ? (<p className="text-white/60 text-center py-8">No feedback found</p>) : (<div className="space-y-4">
                {feedback.map(function (item) { return (<div key={item._id} className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{item.userName || "Anonymous"}</span>
                          <span className="text-white/50 text-sm">{item.userEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <badge_1.Badge variant={item.status === "resolved" ? "default" :
                    item.status === "reviewed" ? "secondary" : "outline"}>
                            {item.status}
                          </badge_1.Badge>
                          <badge_1.Badge variant="outline">{item.category}</badge_1.Badge>
                          <div className="flex gap-1">
                            {Array.from({ length: item.rating }).map(function (_, i) { return (<lucide_react_2.Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400"/>); })}
                          </div>
                        </div>
                      </div>
                      <dialog_1.Dialog>
                        <dialog_1.DialogTrigger asChild>
                          <button_1.Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={function () {
                    setSelectedFeedback(item);
                    setNewStatus(item.status);
                    setAdminNotes(item.adminNotes || "");
                }}>
                            Manage
                          </button_1.Button>
                        </dialog_1.DialogTrigger>
                        <dialog_1.DialogContent className="bg-gray-900 border-white/20">
                          <dialog_1.DialogHeader>
                            <dialog_1.DialogTitle className="text-white">Manage Feedback</dialog_1.DialogTitle>
                          </dialog_1.DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label_1.Label className="text-white">Status</label_1.Label>
                              <select_1.Select value={newStatus} onValueChange={setNewStatus}>
                                <select_1.SelectTrigger className="bg-white/5 border-white/10 text-white mt-2">
                                  <select_1.SelectValue />
                                </select_1.SelectTrigger>
                                <select_1.SelectContent>
                                  <select_1.SelectItem value="new">New</select_1.SelectItem>
                                  <select_1.SelectItem value="reviewed">Reviewed</select_1.SelectItem>
                                  <select_1.SelectItem value="resolved">Resolved</select_1.SelectItem>
                                </select_1.SelectContent>
                              </select_1.Select>
                            </div>
                            <div>
                              <label_1.Label className="text-white">Admin Notes</label_1.Label>
                              <textarea_1.Textarea value={adminNotes} onChange={function (e) { return setAdminNotes(e.target.value); }} placeholder="Add notes or response..." className="bg-white/5 border-white/10 text-white mt-2"/>
                            </div>
                            <button_1.Button onClick={handleUpdateStatus} className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
                              Update Feedback
                            </button_1.Button>
                          </div>
                        </dialog_1.DialogContent>
                      </dialog_1.Dialog>
                    </div>
                    <p className="text-white">{item.message}</p>
                    {item.adminNotes && (<div className="p-3 rounded bg-blue-500/10 border border-blue-500/20">
                        <p className="text-sm text-blue-300 font-medium mb-1">Admin Response:</p>
                        <p className="text-sm text-white/80">{item.adminNotes}</p>
                      </div>)}
                    <p className="text-xs text-white/50">
                      Submitted: {new Date(item._creationTime).toLocaleString()}
                    </p>
                  </div>); })}
              </div>)}
          </card_1.CardContent>
        </card_1.Card>
      </framer_motion_2.motion.div>
    </div>);
}
