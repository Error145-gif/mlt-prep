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
  // Initialize open state based on screen width (desktop defaults to open, mobile to closed)
  const [isOpen, setIsOpen] = useState(() => window.innerWidth >= 1024);
  const { signOut, isAuthenticated } = useAuth();
  const userProfile = useQuery(api.users.getUserProfile);

  // Close sidebar when location changes on mobile/tablet only
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  // Handle window resize to auto-open/close based on breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const primaryNavItems = [
    { path: "/student", icon: Home, label: "Dashboard" },
    { path: "/tests/mock", icon: FileText, label: "Mock Tests" },
    { path: "/tests/pyq", icon: BookOpen, label: "PYQ Sets" },
    { path: "/tests/ai", icon: Brain, label: "AI Questions" },
  ];

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
      {/* Hamburger Menu Button - Visible when sidebar is CLOSED */}
      {isAuthenticated && !isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 bg-slate-900 text-white hover:bg-slate-800 border border-slate-700 shadow-lg flex"
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}

      {/* Sidebar - Toggleable on all screens */}
      {isAuthenticated && (
        <AnimatePresence>
          {isOpen && (
            <motion.aside
              initial={{ x: -264 }}
              animate={{ x: 0 }}
              exit={{ x: -264 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-700 p-6 z-50 shadow-2xl block"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    {userProfile?.avatarUrl ? (
                      <Avatar className="h-10 w-10 border-2 border-slate-700">
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
                        <span className="text-sm text-slate-400">{userProfile.name}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <NotificationBell />
                    <Button
                      onClick={() => setIsOpen(false)}
                      variant="ghost"
                      size="icon"
                      className="text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Primary Navigation */}
                <nav className="flex-1 space-y-2">
                  {primaryNavItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                          isActive
                            ? "bg-blue-600 text-white shadow-lg"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}

                  {/* Upgrade CTA */}
                  <Link
                    to="/subscription-plans"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-semibold mt-2 ${
                      location.pathname === "/subscription-plans"
                        ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/50"
                        : "bg-gradient-to-r from-red-500/80 to-pink-500/80 text-white hover:from-red-500 hover:to-pink-500 shadow-md"
                    }`}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>🔥 Upgrade</span>
                  </Link>

                  <div className="flex-1" />

                  {/* Secondary Navigation */}
                  <div className="space-y-1 pt-6 mt-auto border-t border-slate-700">
                    {secondaryNavItems.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm ${
                            isActive
                              ? "bg-slate-800 text-white"
                              : "text-slate-400 hover:bg-slate-800 hover:text-slate-300"
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
                  className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800 mt-4"
                >
                  Sign Out
                </Button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      )}
    </>
  );
}