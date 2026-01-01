import { Link, useLocation } from "react-router";
import { Home, FileText, BookOpen, Brain, CreditCard, User } from "lucide-react";
import { motion } from "framer-motion";

export default function MobileBottomNav() {
  const location = useLocation();

  const navItems = [
    { path: "/student", icon: Home, label: "Home" },
    { path: "/tests/mock", icon: FileText, label: "Tests" },
    { path: "/tests/ai", icon: Brain, label: "AI" },
    { path: "/library", icon: BookOpen, label: "Library" },
    { path: "/subscription", icon: CreditCard, label: "Upgrade" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 shadow-2xl lg:hidden">
      <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path === "/tests/mock" && location.pathname.startsWith("/tests"));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center min-w-0 flex-1 px-1"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg transition-all ${
                  isActive
                    ? "text-white"
                    : "text-slate-400"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-600 rounded-lg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon className={`h-5 w-5 relative z-10 ${isActive ? "text-white" : ""}`} />
                <span className={`text-xs font-medium relative z-10 ${isActive ? "text-white" : ""}`}>
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
