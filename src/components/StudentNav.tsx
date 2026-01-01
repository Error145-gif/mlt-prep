// @ts-nocheck
import { Link, useLocation, useNavigate } from "react-router";
import { Home, FileText, BookOpen, Brain, CreditCard, Library, Menu, X, MessageSquare, User } from "lucide-react";
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
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { signOut, isAuthenticated } = useAuth();
  const userProfile = useQuery(api.users.getUserProfile);

  // Open sidebar by default on desktop
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
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

  // Close menu when location changes on mobile
  useEffect(() => {
    const width = window.innerWidth;
    if (width < 1024) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  // Primary navigation items (top - most visible)
  const primaryNavItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/tests/mock", icon: FileText, label: "Mock Tests" },
    { path: "/tests/pyq", icon: BookOpen, label: "PYQ Sets" },
    { path: "/tests/ai", icon: Brain, label: "AI Questions" },
  ];

  // Lower priority items (bottom - subtle)
  const secondaryNavItems = [
    { path: "/library", icon: Library, label: "Library" },
    { path: "/feedback", icon: MessageSquare, label: "Feedback" },
    { path: "/contact-us", icon: MessageSquare, label: "Contact Us" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <>
      {/* Mobile Menu Button - Only visible when authenticated */}
      {isAuthenticated && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}

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
                    <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
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

              {/* Primary Navigation - Top Section */}
              <nav className="flex-1 space-y-2">
                {primaryNavItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        // Only close on mobile
                        const width = window.innerWidth;
                        if (width < 1024) {
                          setIsOpen(false);
                        }
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                        isActive
                          ? "bg-white/20 text-white shadow-lg"
                          : "text-white/90 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                {/* Upgrade CTA - Highlighted */}
                <Link
                  to="/subscription"
                  onClick={() => {
                    const width = window.innerWidth;
                    if (width < 1024) {
                      setIsOpen(false);
                    }
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-semibold mt-2 ${
                    location.pathname === "/subscription"
                      ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/50"
                      : "bg-gradient-to-r from-orange-500/80 to-pink-500/80 text-white hover:from-orange-500 hover:to-pink-500 shadow-md"
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Upgrade</span>
                </Link>

                {/* Spacer to push secondary items to bottom */}
                <div className="flex-1" />

                {/* Secondary Navigation - Bottom Section (subtle) */}
                <div className="space-y-1 pt-6 mt-auto border-t border-white/10">
                  {secondaryNavItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => {
                          const width = window.innerWidth;
                          if (width < 1024) {
                            setIsOpen(false);
                          }
                        }}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm ${
                          isActive
                            ? "bg-white/10 text-white"
                            : "text-white/60 hover:bg-white/5 hover:text-white/80"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </nav>

              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10 mt-4"
              >
                Sign Out
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}