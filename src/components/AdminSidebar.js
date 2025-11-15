"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminSidebar;
var react_router_1 = require("react-router");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var use_auth_1 = require("@/hooks/use-auth");
function AdminSidebar() {
    var location = (0, react_router_1.useLocation)();
    var _a = (0, react_1.useState)(false), isOpen = _a[0], setIsOpen = _a[1];
    var signOut = (0, use_auth_1.useAuth)().signOut;
    // Open sidebar by default on desktop
    (0, react_1.useEffect)(function () {
        if (typeof window === 'undefined')
            return;
        var handleResize = function () {
            if (window.innerWidth >= 768) {
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
    var navItems = [
        { path: "/admin", icon: lucide_react_1.LayoutDashboard, label: "Dashboard" },
        { path: "/admin/questions", icon: lucide_react_1.HelpCircle, label: "Questions" },
        { path: "/admin/study-materials", icon: lucide_react_1.FileText, label: "Study Materials" },
        { path: "/admin/analytics", icon: lucide_react_1.Users, label: "Analytics" },
        { path: "/admin/subscriptions", icon: lucide_react_1.CreditCard, label: "Subscriptions" },
        { path: "/admin/coupons", icon: lucide_react_1.Tag, label: "Coupons" },
        { path: "/admin/notifications", icon: lucide_react_1.Bell, label: "Notifications" },
        { path: "/admin/feedback", icon: lucide_react_1.MessageSquare, label: "Feedback" },
    ];
    return (<>
      {/* Menu Toggle Button - Now visible on all screens */}
      <button_1.Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white hover:bg-white/20 transition-all" onClick={function () { return setIsOpen(!isOpen); }}>
        {isOpen ? <lucide_react_1.X className="h-5 w-5"/> : <lucide_react_1.Menu className="h-5 w-5"/>}
      </button_1.Button>

      {/* Sidebar */}
      <framer_motion_1.AnimatePresence>
        {isOpen && (<framer_motion_1.motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed left-0 top-0 h-screen w-64 border-r border-white/20 backdrop-blur-xl bg-gradient-to-b from-gray-900/95 to-gray-800/95 p-6 z-40 shadow-2xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 mb-8">
                <img src="/logo.svg" alt="Logo" className="h-10 w-10"/>
                <h2 className="text-xl font-bold text-white">MLT Admin</h2>
              </div>

              <nav className="flex-1 space-y-2">
                {navItems.map(function (item) {
                var isActive = location.pathname === item.path;
                return (<react_router_1.Link key={item.path} to={item.path} onClick={function () {
                        // Only close on mobile
                        if (typeof window !== 'undefined' && window.innerWidth < 768) {
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

              <button_1.Button onClick={function () { return signOut(); }} variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10">
                Sign Out
              </button_1.Button>
            </div>
          </framer_motion_1.motion.aside>)}
      </framer_motion_1.AnimatePresence>

      {/* Overlay - Visible when sidebar is open on mobile */}
      {isOpen && typeof window !== 'undefined' && window.innerWidth < 768 && (<div className="fixed inset-0 bg-black/50 z-30" onClick={function () { return setIsOpen(false); }}/>)}
    </>);
}
