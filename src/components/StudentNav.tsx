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

  // Open sidebar by default on desktop, closed on mobile
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when location changes (for mobile/tablet only)
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [location.pathname]);

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
      {/* Desktop Menu Button - Only shown on desktop */}
      {isAuthenticated && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 shadow-lg hidden lg:block"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}

      {/* Sidebar - Hidden on mobile (bottom nav used instead), visible on desktop */}
      <AnimatePresence>
        {isOpen && isAuthenticated && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-700 p-6 z-40 shadow-2xl hidden lg:block"
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
                <NotificationBell />
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

      {/* Overlay for tablet/desktop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 hidden lg:block"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}