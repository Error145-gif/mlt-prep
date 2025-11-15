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
exports.default = StudentNav;
var react_router_1 = require("react-router");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var avatar_1 = require("@/components/ui/avatar");
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var use_auth_1 = require("@/hooks/use-auth");
var react_2 = require("convex/react");
var api_1 = require("@/convex/_generated/api");
var NotificationBell_1 = require("@/components/NotificationBell");
function StudentNav() {
    var _this = this;
    var _a, _b;
    var location = (0, react_router_1.useLocation)();
    var navigate = (0, react_router_1.useNavigate)();
    var _c = (0, react_1.useState)(false), isOpen = _c[0], setIsOpen = _c[1];
    var _d = (0, use_auth_1.useAuth)(), signOut = _d.signOut, isAuthenticated = _d.isAuthenticated;
    var userProfile = (0, react_2.useQuery)(api_1.api.users.getUserProfile);
    // Open sidebar by default on desktop
    (0, react_1.useEffect)(function () {
        var handleResize = function () {
            var width = window.innerWidth;
            if (width >= 1024) {
                setIsOpen(true);
            }
            else {
                setIsOpen(false);
            }
        };
        // Set initial state
        handleResize();
        // Listen for window resize
        window.addEventListener('resize', handleResize);
        return function () { return window.removeEventListener('resize', handleResize); };
    }, []);
    // Close menu when location changes on mobile
    (0, react_1.useEffect)(function () {
        var width = window.innerWidth;
        if (width < 1024) {
            setIsOpen(false);
        }
    }, [location.pathname]);
    var navItems = [
        { path: "/dashboard", icon: lucide_react_1.Home, label: "Dashboard" },
        { path: "/tests/mock", icon: lucide_react_1.FileText, label: "Mock Tests" },
        { path: "/tests/pyq", icon: lucide_react_1.BookOpen, label: "PYQ Sets" },
        { path: "/tests/ai", icon: lucide_react_1.BarChart3, label: "AI Questions" },
        { path: "/subscription", icon: lucide_react_1.CreditCard, label: "Subscription" },
        { path: "/feedback", icon: lucide_react_1.MessageSquare, label: "Feedback" },
        { path: "/free-library", icon: lucide_react_1.Library, label: "Library" },
        { path: "/contact-us", icon: lucide_react_1.MessageSquare, label: "Contact Us" },
        { path: "/profile", icon: lucide_react_1.User, label: "Profile" },
    ];
    var handleSignOut = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, signOut()];
                case 1:
                    _a.sent();
                    navigate("/");
                    return [2 /*return*/];
            }
        });
    }); };
    return (<>
      {/* Mobile Menu Button - Only visible when authenticated */}
      {isAuthenticated && (<button_1.Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white" onClick={function () { return setIsOpen(!isOpen); }}>
          {isOpen ? <lucide_react_1.X className="h-5 w-5"/> : <lucide_react_1.Menu className="h-5 w-5"/>}
        </button_1.Button>)}

      {/* Sidebar */}
      <framer_motion_1.AnimatePresence>
        {isOpen && (<framer_motion_1.motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="fixed left-0 top-0 h-screen w-64 glass-card border-r border-white/20 backdrop-blur-xl bg-white/10 p-6 z-40">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  {(userProfile === null || userProfile === void 0 ? void 0 : userProfile.avatarUrl) ? (<avatar_1.Avatar className="h-10 w-10 border-2 border-white/20">
                      <avatar_1.AvatarImage src={userProfile.avatarUrl}/>
                      <avatar_1.AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {((_b = (_a = userProfile.name) === null || _a === void 0 ? void 0 : _a.charAt(0)) === null || _b === void 0 ? void 0 : _b.toUpperCase()) || "U"}
                      </avatar_1.AvatarFallback>
                    </avatar_1.Avatar>) : (<img src="/logo.svg" alt="Logo" className="h-10 w-10"/>)}
                  <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-white">MLT Prep</h2>
                    {(userProfile === null || userProfile === void 0 ? void 0 : userProfile.name) && (<span className="text-sm text-white/70">{userProfile.name}</span>)}
                  </div>
                </div>
                <NotificationBell_1.default />
              </div>

              <nav className="flex-1 space-y-2">
                {navItems.map(function (item) {
                var isActive = location.pathname === item.path;
                return (<react_router_1.Link key={item.path} to={item.path} onClick={function () {
                        // Only close on mobile
                        var width = window.innerWidth;
                        if (width < 1024) {
                            setIsOpen(false);
                        }
                    }} className={"flex items-center gap-3 px-4 py-3 rounded-lg transition-all ".concat(isActive
                        ? "bg-white/20 text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white")}>
                      <item.icon className="h-5 w-5"/>
                      <span>{item.label}</span>
                    </react_router_1.Link>);
            })}
              </nav>

              <button_1.Button onClick={handleSignOut} variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10">
                Sign Out
              </button_1.Button>
            </div>
          </framer_motion_1.motion.aside>)}
      </framer_motion_1.AnimatePresence>

      {/* Overlay for mobile */}
      {isOpen && (<div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={function () { return setIsOpen(false); }}/>)}
    </>);
}
