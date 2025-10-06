import { Link, useLocation } from "react-router";
import { LayoutDashboard, FileText, HelpCircle, Users, CreditCard, Bell, Menu, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

export default function AdminSidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAuth();

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/questions", icon: HelpCircle, label: "Questions" },
    { path: "/admin/analytics", icon: Users, label: "Analytics" },
    { path: "/admin/subscriptions", icon: CreditCard, label: "Subscriptions" },
    { path: "/admin/notifications", icon: Bell, label: "Notifications" },
    { path: "/admin/feedback", icon: MessageSquare, label: "Feedback" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed left-0 top-0 h-screen w-64 glass-card border-r border-white/20 backdrop-blur-xl bg-white/10 p-6 z-40 lg:translate-x-0"
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
                      onClick={() => setIsOpen(false)}
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
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
