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
exports.default = UserAnalytics;
var use_auth_1 = require("@/hooks/use-auth");
var react_1 = require("convex/react");
var api_1 = require("@/convex/_generated/api");
var react_router_1 = require("react-router");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var alert_dialog_1 = require("@/components/ui/alert-dialog");
var framer_motion_2 = require("framer-motion");
var sonner_1 = require("sonner");
var react_2 = require("react");
function UserAnalytics() {
    var _this = this;
    var _a = (0, use_auth_1.useAuth)(), isLoading = _a.isLoading, isAuthenticated = _a.isAuthenticated, user = _a.user;
    var navigate = (0, react_router_1.useNavigate)();
    var users = (0, react_1.useQuery)(api_1.api.analytics.getAllRegisteredUsers);
    var deleteUser = (0, react_1.useMutation)(api_1.api.userManagement.deleteUser);
    var resetAllUserData = (0, react_1.useMutation)(api_1.api.userDataReset.resetAllUserData);
    var _b = (0, react_2.useState)(null), selectedUser = _b[0], setSelectedUser = _b[1];
    var _c = (0, react_2.useState)(false), isDeleting = _c[0], setIsDeleting = _c[1];
    var _d = (0, react_2.useState)(false), isResetting = _d[0], setIsResetting = _d[1];
    var _e = (0, react_2.useState)(false), isMenuOpen = _e[0], setIsMenuOpen = _e[1];
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <lucide_react_1.Loader2 className="h-8 w-8 animate-spin"/>
      </div>);
    }
    if (!isAuthenticated || (user === null || user === void 0 ? void 0 : user.role) !== "admin") {
        return <react_router_1.Navigate to="/auth"/>;
    }
    var handleDeleteUser = function (userId) { return __awaiter(_this, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsDeleting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, deleteUser({ userId: userId })];
                case 2:
                    result = _a.sent();
                    sonner_1.toast.success("User ".concat(result.deletedEmail, " has been deleted successfully"));
                    setSelectedUser(null);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    sonner_1.toast.error(error_1 instanceof Error ? error_1.message : "Failed to delete user");
                    return [3 /*break*/, 5];
                case 4:
                    setIsDeleting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleResetAllUsers = function () { return __awaiter(_this, void 0, void 0, function () {
        var result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsResetting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, resetAllUserData({})];
                case 2:
                    result = _a.sent();
                    sonner_1.toast.success("Successfully reset all user data! Deleted ".concat(result.deletedCounts.users, " users and their related data."));
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    sonner_1.toast.error("Failed to reset user data");
                    console.error(error_2);
                    return [3 /*break*/, 5];
                case 4:
                    setIsResetting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="min-h-screen p-6 relative">
      {/* Animated gradient background matching Landing page */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500"/>
      
      {/* Animated orbs */}
      <framer_motion_2.motion.div className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl" animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
        }} transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
        }}/>
      <framer_motion_2.motion.div className="fixed top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl" animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
        }} transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 1,
        }}/>
      <framer_motion_2.motion.div className="fixed bottom-0 left-1/4 w-[600px] h-[600px] bg-pink-400/40 rounded-full blur-3xl" animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
        }} transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
            delay: 0.5,
        }}/>
      <framer_motion_2.motion.div className="fixed top-1/2 right-1/4 w-[400px] h-[400px] bg-cyan-400/40 rounded-full blur-3xl" animate={{
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

      <framer_motion_2.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={function () { return setIsMenuOpen(!isMenuOpen); }} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all">
              {isMenuOpen ? <lucide_react_1.X className="h-6 w-6"/> : <lucide_react_1.Menu className="h-6 w-6"/>}
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">User Management</h1>
              <p className="text-white/70 mt-1">Manage registered users and their accounts</p>
            </div>
          </div>
          
          <alert_dialog_1.AlertDialog>
            <alert_dialog_1.AlertDialogTrigger asChild>
              <button_1.Button variant="destructive" className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30">
                <lucide_react_1.Trash2 className="h-4 w-4 mr-2"/>
                Reset All User Data
              </button_1.Button>
            </alert_dialog_1.AlertDialogTrigger>
            <alert_dialog_1.AlertDialogContent className="glass-card border-white/20 backdrop-blur-xl bg-gray-900/95">
              <alert_dialog_1.AlertDialogHeader>
                <alert_dialog_1.AlertDialogTitle className="text-white">Are you absolutely sure?</alert_dialog_1.AlertDialogTitle>
                <alert_dialog_1.AlertDialogDescription className="text-white/70">
                  This action will permanently delete ALL user accounts and their related data including:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>User profiles and accounts</li>
                    <li>Test scores and results</li>
                    <li>Progress tracking data</li>
                    <li>Subscriptions and payments</li>
                    <li>Feedback submissions</li>
                  </ul>
                  <p className="mt-3 font-semibold text-red-400">
                    Your admin account will be preserved. This action cannot be undone.
                  </p>
                </alert_dialog_1.AlertDialogDescription>
              </alert_dialog_1.AlertDialogHeader>
              <alert_dialog_1.AlertDialogFooter>
                <alert_dialog_1.AlertDialogCancel className="bg-white/10 text-white border-white/20">Cancel</alert_dialog_1.AlertDialogCancel>
                <alert_dialog_1.AlertDialogAction onClick={handleResetAllUsers} disabled={isResetting} className="bg-red-500 hover:bg-red-600 text-white">
                  {isResetting ? (<>
                      <lucide_react_1.Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                      Resetting...
                    </>) : ("Yes, Reset All Data")}
                </alert_dialog_1.AlertDialogAction>
              </alert_dialog_1.AlertDialogFooter>
            </alert_dialog_1.AlertDialogContent>
          </alert_dialog_1.AlertDialog>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <card_1.Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
            <card_1.CardHeader className="flex flex-row items-center justify-between pb-2">
              <card_1.CardTitle className="text-sm font-medium text-white/90">
                Total Registered Users
              </card_1.CardTitle>
              <lucide_react_1.Users className="h-5 w-5 text-white"/>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-3xl font-bold text-white">{(users === null || users === void 0 ? void 0 : users.totalUsers) || 0}</div>
              <p className="text-xs text-white/70 mt-1">Gmail accounts registered</p>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
            <card_1.CardHeader className="flex flex-row items-center justify-between pb-2">
              <card_1.CardTitle className="text-sm font-medium text-white/90">
                Active Users
              </card_1.CardTitle>
              <lucide_react_1.Mail className="h-5 w-5 text-white"/>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-3xl font-bold text-white">{(users === null || users === void 0 ? void 0 : users.activeUsers) || 0}</div>
              <p className="text-xs text-white/70 mt-1">Completed registration</p>
            </card_1.CardContent>
          </card_1.Card>
        </div>

        {/* Users List */}
        <card_1.Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
          <card_1.CardHeader>
            <card_1.CardTitle className="text-white">All Registered Users</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            {!users || users.users.length === 0 ? (<p className="text-white/60 text-center py-8">No users registered yet</p>) : (<div className="space-y-3">
                {users.users.map(function (userData, index) {
                var _a, _b, _c, _d;
                return (<framer_motion_2.motion.div key={userData._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center justify-between p-4 rounded-lg bg-white/10 border border-white/20 hover:bg-white/15 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {((_b = (_a = userData.name) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.toUpperCase()) || ((_d = (_c = userData.email) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.toUpperCase()) || "?"}
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {userData.name || "Anonymous User"}
                          </p>
                          <p className="text-sm text-white/70">{userData.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-white/60">Role</p>
                        <p className="text-sm font-medium text-white capitalize">{userData.role || "user"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-white/60">Status</p>
                        <p className="text-sm font-medium text-white">
                          {userData.isRegistered ? "Active" : "Pending"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-white/60">Joined</p>
                        <p className="text-sm font-medium text-white">
                          {new Date(userData._creationTime).toLocaleDateString()}
                        </p>
                      </div>
                      {userData.role !== "admin" && (<button_1.Button variant="destructive" size="sm" onClick={function () { return setSelectedUser({ id: userData._id, email: userData.email }); }} className="bg-red-500/80 hover:bg-red-600 text-white">
                          <lucide_react_1.Trash2 className="h-4 w-4"/>
                        </button_1.Button>)}
                    </div>
                  </framer_motion_2.motion.div>);
            })}
              </div>)}
          </card_1.CardContent>
        </card_1.Card>
      </framer_motion_2.motion.div>
    </div>);
}
