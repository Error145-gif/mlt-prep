import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  MessageSquare,
  Image as ImageIcon,
  AlertTriangle,
  FileQuestion,
  CreditCard,
  Tags,
  Trophy,
  X,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

export default function AdminSidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAuth();

  // Open sidebar by default on desktop
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Listen for window resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/questions", icon: FileQuestion, label: "Questions" },
    { path: "/admin/weekly-tests", icon: Trophy, label: "Weekly Tests" },
    { path: "/admin/image-questions", icon: ImageIcon, label: "Image Questions" },
    { path: "/admin/reported-errors", icon: AlertTriangle, label: "Reported Errors" },
    { path: "/admin/study-materials", icon: BookOpen, label: "Study Materials" },
    { path: "/admin/analytics", icon: Settings, label: "Analytics" },
    { path: "/admin/subscriptions", icon: CreditCard, label: "Subscriptions" },
    { path: "/admin/coupons", icon: Tags, label: "Coupons" },
    { path: "/admin/notifications", icon: MessageSquare, label: "Notifications" },
    { path: "/admin/feedback", icon: Trophy, label: "Feedback" },
  ];

  return (
    <>
      {/* Menu Toggle Button - Now visible on all screens */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white hover:bg-white/20 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-screen w-64 border-r border-white/20 backdrop-blur-xl bg-gradient-to-b from-gray-900/95 to-gray-800/95 p-6 z-40 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 mb-8">
                <img src="/logo.svg" alt="Logo" className="h-10 w-10" />
                <h2 className="text-xl font-bold text-white">MLT Admin</h2>
              </div>

              <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        // Only close on mobile
                        if (typeof window !== 'undefined' && window.innerWidth < 768) {
                          setIsOpen(false);
                        }
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <Button
                onClick={() => signOut()}
                variant="ghost"
                className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
              >
                Sign Out
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay - Visible when sidebar is open on mobile */}
      {isOpen && typeof window !== 'undefined' && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}