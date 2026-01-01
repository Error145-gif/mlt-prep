import { Link, useLocation } from "react-router";
import { Home, FileText, BookOpen, Brain, User, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Library, MessageSquare, Mail } from "lucide-react";

export default function MobileBottomNav() {
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainNavItems = [
    { path: "/student", icon: Home, label: "Home" },
    { path: "/tests/mock", icon: FileText, label: "Tests" },
    { path: "/tests/ai", icon: Brain, label: "AI" },
    { path: "/library", icon: BookOpen, label: "Library" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  const moreItems = [
    { path: "/tests/pyq", icon: BookOpen, label: "PYQ Sets" },
    { path: "/feedback", icon: MessageSquare, label: "Feedback" },
    { path: "/contact-us", icon: Mail, label: "Contact Us" },
    { path: "/subscription", icon: Library, label: "Upgrade Plan" },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 shadow-2xl lg:hidden">
        <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
          {mainNavItems.map((item) => {
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
                    isActive ? "text-white" : "text-slate-400"
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

          {/* More Menu */}
          <Sheet open={isMoreOpen} onOpenChange={setIsMoreOpen}>
            <SheetTrigger asChild>
              <button className="relative flex flex-col items-center justify-center min-w-0 flex-1 px-1">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg transition-all text-slate-400"
                >
                  <MoreHorizontal className="h-5 w-5 relative z-10" />
                  <span className="text-xs font-medium relative z-10">More</span>
                </motion.div>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-slate-900 border-slate-700">
              <div className="py-4 space-y-2">
                <h3 className="text-lg font-semibold text-white mb-4">More Options</h3>
                {moreItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMoreOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
}