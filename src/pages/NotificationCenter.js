"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NotificationCenter;
var use_auth_1 = require("@/hooks/use-auth");
var react_1 = require("convex/react");
var api_1 = require("@/convex/_generated/api");
var react_router_1 = require("react-router");
var react_2 = require("react");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var dialog_1 = require("@/components/ui/dialog");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var select_1 = require("@/components/ui/select");
var badge_1 = require("@/components/ui/badge");
var checkbox_1 = require("@/components/ui/checkbox");
var sonner_1 = require("sonner");
function NotificationCenter() {
    var _this = this;
    var _a = (0, use_auth_1.useAuth)(), isLoading = _a.isLoading, isAuthenticated = _a.isAuthenticated, user = _a.user;
    var navigate = (0, react_router_1.useNavigate)();
    var notifications = (0, react_1.useQuery)(api_1.api.notifications.getAllNotifications);
    var allUsers = (0, react_1.useQuery)(api_1.api.notifications.getAllUsers);
    var createNotification = (0, react_1.useMutation)(api_1.api.notifications.createNotification);
    var sendNotification = (0, react_1.useAction)(api_1.api.notifications.sendNotification);
    var deleteNotification = (0, react_1.useMutation)(api_1.api.notifications.deleteNotification);
    var _b = (0, react_2.useState)(false), isDialogOpen = _b[0], setIsDialogOpen = _b[1];
    var _c = (0, react_2.useState)(true), sendToAll = _c[0], setSendToAll = _c[1];
    var _d = (0, react_2.useState)([]), selectedUsers = _d[0], setSelectedUsers = _d[1];
    var _e = (0, react_2.useState)(false), isMenuOpen = _e[0], setIsMenuOpen = _e[1];
    var _f = (0, react_2.useState)({
        title: "",
        message: "",
        type: "both",
    }), formData = _f[0], setFormData = _f[1];
    // Notification templates
    var templates = [
        {
            name: "New Feature Announcement",
            title: "New Feature Available!",
            message: "We've added a new feature to help you prepare better. Check it out in your dashboard!",
        },
        {
            name: "Subscription Reminder",
            title: "Your Subscription is Expiring Soon",
            message: "Your subscription will expire in 3 days. Renew now to continue accessing all features!",
        },
        {
            name: "New Content Added",
            title: "New Study Materials Available",
            message: "We've added new PYQ questions and study materials. Start practicing now!",
        },
        {
            name: "Maintenance Notice",
            title: "Scheduled Maintenance",
            message: "We'll be performing maintenance on [DATE]. The platform may be unavailable for a short time.",
        },
    ];
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <lucide_react_1.Loader2 className="h-8 w-8 animate-spin"/>
      </div>);
    }
    if (!isAuthenticated || (user === null || user === void 0 ? void 0 : user.role) !== "admin") {
        return <react_router_1.Navigate to="/auth"/>;
    }
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!sendToAll && selectedUsers.length === 0) {
                        sonner_1.toast.error("Please select at least one user or choose 'Send to All'");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, createNotification(__assign(__assign({}, formData), { sendToAll: sendToAll, targetUsers: sendToAll ? undefined : selectedUsers }))];
                case 2:
                    _a.sent();
                    sonner_1.toast.success("Notification sent successfully! Users will see it now.");
                    setIsDialogOpen(false);
                    setFormData({ title: "", message: "", type: "both" });
                    setSendToAll(true);
                    setSelectedUsers([]);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    sonner_1.toast.error("Failed to create notification");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleSend = function (id) { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, sendNotification({ id: id })];
                case 1:
                    _a.sent();
                    sonner_1.toast.success("Notification sent successfully! Users will see it now.");
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error("Failed to send notification:", error_2);
                    sonner_1.toast.error("Failed to send notification: " + error_2.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleDelete = function (id) { return __awaiter(_this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, deleteNotification({ id: id })];
                case 1:
                    _a.sent();
                    sonner_1.toast.success("Notification deleted!");
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    sonner_1.toast.error("Failed to delete notification");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var applyTemplate = function (template) {
        setFormData(__assign(__assign({}, formData), { title: template.title, message: template.message }));
    };
    var toggleUserSelection = function (userId) {
        setSelectedUsers(function (prev) {
            return prev.includes(userId)
                ? prev.filter(function (id) { return id !== userId; })
                : __spreadArray(__spreadArray([], prev, true), [userId], false);
        });
    };
    return (<div className="min-h-screen p-6 relative">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 z-0"/>
      
      {/* Animated Orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl"/>
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl" style={{ animationDelay: '1s' }}/>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-pink-400/40 rounded-full blur-3xl" style={{ animationDelay: '0.5s' }}/>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-400/40 rounded-full blur-3xl" style={{ animationDelay: '0.7s' }}/>
      </div>

      {/* Lab Background Image */}
      <div className="fixed inset-0 z-0 opacity-10" style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}/>
      
      <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={function () { return setIsMenuOpen(!isMenuOpen); }} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all">
              {isMenuOpen ? <lucide_react_1.X className="h-6 w-6"/> : <lucide_react_1.Menu className="h-6 w-6"/>}
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Notification Center</h1>
              <p className="text-white/60 mt-1">Send notifications to users via email and push</p>
            </div>
          </div>
          <dialog_1.Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <dialog_1.DialogTrigger asChild>
              <button_1.Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
                Create Notification
              </button_1.Button>
            </dialog_1.DialogTrigger>
            <dialog_1.DialogContent className="glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
              <dialog_1.DialogHeader>
                <dialog_1.DialogTitle className="text-white">Create New Notification</dialog_1.DialogTitle>
              </dialog_1.DialogHeader>
              
              {/* Quick Templates */}
              <div className="space-y-2">
                <label_1.Label className="text-white/80">Quick Templates</label_1.Label>
                <div className="grid grid-cols-2 gap-2">
                  {templates.map(function (template) { return (<button_1.Button key={template.name} type="button" variant="outline" size="sm" onClick={function () { return applyTemplate(template); }} className="bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:text-white text-xs">
                      {template.name}
                    </button_1.Button>); })}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label_1.Label htmlFor="title" className="text-white/80">Title</label_1.Label>
                  <input_1.Input id="title" value={formData.title} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { title: e.target.value })); }} required className="bg-white/5 border-white/20 text-white" placeholder="Enter notification title"/>
                </div>
                
                <div>
                  <label_1.Label htmlFor="message" className="text-white/80">Message</label_1.Label>
                  <textarea_1.Textarea id="message" value={formData.message} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { message: e.target.value })); }} required className="bg-white/5 border-white/20 text-white" rows={4} placeholder="Enter notification message"/>
                </div>
                
                <div>
                  <label_1.Label htmlFor="type" className="text-white/80">Notification Type</label_1.Label>
                  <select_1.Select value={formData.type} onValueChange={function (value) { return setFormData(__assign(__assign({}, formData), { type: value })); }}>
                    <select_1.SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <select_1.SelectValue />
                    </select_1.SelectTrigger>
                    <select_1.SelectContent>
                      <select_1.SelectItem value="push">Push Only</select_1.SelectItem>
                      <select_1.SelectItem value="email">Email Only</select_1.SelectItem>
                      <select_1.SelectItem value="both">Both (Recommended)</select_1.SelectItem>
                    </select_1.SelectContent>
                  </select_1.Select>
                </div>

                {/* User Targeting */}
                <div className="space-y-3">
                  <label_1.Label className="text-white/80">Target Audience</label_1.Label>
                  
                  <div className="flex items-center space-x-2">
                    <checkbox_1.Checkbox id="sendToAll" checked={sendToAll} onCheckedChange={function (checked) {
            setSendToAll(checked);
            if (checked)
                setSelectedUsers([]);
        }} className="border-white/20"/>
                    <label htmlFor="sendToAll" className="text-sm text-white/80 cursor-pointer">
                      Send to all users ({(allUsers === null || allUsers === void 0 ? void 0 : allUsers.length) || 0} users)
                    </label>
                  </div>

                  {!sendToAll && (<div className="space-y-2 max-h-48 overflow-y-auto bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-xs text-white/60 mb-2">
                        Selected: {selectedUsers.length} user(s)
                      </p>
                      {allUsers === null || allUsers === void 0 ? void 0 : allUsers.map(function (u) { return (<div key={u._id} className="flex items-center space-x-2">
                          <checkbox_1.Checkbox id={u._id} checked={selectedUsers.includes(u._id)} onCheckedChange={function () { return toggleUserSelection(u._id); }} className="border-white/20"/>
                          <label htmlFor={u._id} className="text-sm text-white/80 cursor-pointer flex-1">
                            {u.name} ({u.email})
                          </label>
                        </div>); })}
                    </div>)}
                </div>

                <div className="flex gap-2 pt-4">
                  <button_1.Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600">
                    Create Draft
                  </button_1.Button>
                  <button_1.Button type="button" onClick={function () { return setIsDialogOpen(false); }} variant="outline" className="flex-1">
                    Cancel
                  </button_1.Button>
                </div>
              </form>
            </dialog_1.DialogContent>
          </dialog_1.Dialog>
        </div>

        {/* Mobile Navigation Menu */}
        <framer_motion_1.AnimatePresence>
          {isMenuOpen && (<framer_motion_1.motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="glass-card border-white/20 backdrop-blur-xl bg-white/10 rounded-lg overflow-hidden">
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
            </framer_motion_1.motion.div>)}
        </framer_motion_1.AnimatePresence>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <card_1.CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-500/20">
                  <lucide_react_1.Bell className="h-6 w-6 text-blue-300"/>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {(notifications === null || notifications === void 0 ? void 0 : notifications.length) || 0}
                  </p>
                  <p className="text-sm text-white/60">Total Notifications</p>
                </div>
              </div>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <card_1.CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-500/20">
                  <lucide_react_1.Send className="h-6 w-6 text-green-300"/>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {(notifications === null || notifications === void 0 ? void 0 : notifications.filter(function (n) { return n.status === "sent"; }).length) || 0}
                  </p>
                  <p className="text-sm text-white/60">Sent</p>
                </div>
              </div>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <card_1.CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-500/20">
                  <lucide_react_1.Users className="h-6 w-6 text-purple-300"/>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {(allUsers === null || allUsers === void 0 ? void 0 : allUsers.length) || 0}
                  </p>
                  <p className="text-sm text-white/60">Total Users</p>
                </div>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </div>

        <div className="space-y-4">
          {!notifications || notifications.length === 0 ? (<card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
              <card_1.CardContent className="py-12 text-center">
                <lucide_react_1.Bell className="h-12 w-12 text-white/40 mx-auto mb-4"/>
                <p className="text-white/60">No notifications created yet</p>
                <p className="text-white/40 text-sm mt-2">Create your first notification to engage with users</p>
              </card_1.CardContent>
            </card_1.Card>) : (notifications.map(function (notif, index) { return (<framer_motion_1.motion.div key={notif._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <card_1.CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <card_1.CardTitle className="text-white">{notif.title}</card_1.CardTitle>
                          <badge_1.Badge className={notif.status === "sent" ? "bg-green-500/20 text-green-300" : "bg-yellow-500/20 text-yellow-300"}>
                            {notif.status}
                          </badge_1.Badge>
                          <badge_1.Badge className="bg-blue-500/20 text-blue-300 capitalize">
                            {notif.type}
                          </badge_1.Badge>
                        </div>
                        <p className="text-sm text-white/60">
                          By {notif.senderName} • {notif.recipientCount} recipient(s)
                        </p>
                      </div>
                      <button_1.Button onClick={function () { return handleDelete(notif._id); }} variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                        <lucide_react_1.Trash2 className="h-4 w-4"/>
                      </button_1.Button>
                    </div>
                  </card_1.CardHeader>
                  <card_1.CardContent className="space-y-4">
                    <p className="text-white/80">{notif.message}</p>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      {notif.sentAt && (<>
                          <lucide_react_1.Mail className="h-4 w-4"/>
                          <span>Sent {new Date(notif.sentAt).toLocaleString()}</span>
                        </>)}
                    </div>
                    {notif.status === "draft" && (<div className="flex gap-2 pt-2">
                        <button_1.Button onClick={function () { return handleSend(notif._id); }} className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30">
                          <lucide_react_1.Send className="h-4 w-4 mr-2"/>
                          Send Now
                        </button_1.Button>
                      </div>)}
                  </card_1.CardContent>
                </card_1.Card>
              </framer_motion_1.motion.div>); }))}
        </div>
      </framer_motion_1.motion.div>
    </div>);
}
