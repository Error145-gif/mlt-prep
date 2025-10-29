import { Link, useLocation } from "react-router";
import { Home, BookOpen, FileText, BarChart3, Library, Menu, X, MessageSquare, User, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import NotificationBell from "@/components/NotificationBell";

export default function StudentNav() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAuth();
  const userProfile = useQuery(api.users.getUserProfile);

  // Open sidebar by default on desktop
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
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
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/tests/mock", icon: FileText, label: "Mock Tests" },
    { path: "/tests/pyq", icon: BookOpen, label: "PYQ Sets" },
    { path: "/tests/ai", icon: BarChart3, label: "AI Questions" },
    { path: "/subscription", icon: CreditCard, label: "Subscription" },
    { path: "/feedback", icon: MessageSquare, label: "Feedback" },
    { path: "/free-library", icon: Library, label: "Library" },
    { path: "/contact-us", icon: MessageSquare, label: "Contact Us" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <>
      {/* Mobile Menu Button - Now visible on all screens */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white"
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
            className="fixed left-0 top-0 h-screen w-64 glass-card border-r border-white/20 backdrop-blur-xl bg-white/10 p-6 z-40"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  {userProfile?.avatarUrl ? (
                    <Avatar className="h-10 w-10 border-2 border-white/20">
                      <AvatarImage src={userProfile.avatarUrl} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {userProfile.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <img src="/logo.svg" alt="Logo" className="h-10 w-10" />
                  )}
                  <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-white">MLT Prep</h2>
                    {userProfile?.name && (
                      <span className="text-sm text-white/70">{userProfile.name}</span>
                    )}
                  </div>
                </div>
                <NotificationBell />
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
                        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
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

      {/* Overlay for mobile */}
      {isOpen && typeof window !== 'undefined' && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}