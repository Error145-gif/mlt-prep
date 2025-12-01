import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, TrendingUp, Menu, X, Loader2, CreditCard, AlertCircle, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export default function AdminDashboard() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const { signOut } = useAuthActions();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const stats = useQuery(
    api.analytics.getDashboardStats,
    user?.role === "admin" ? {} : undefined
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  // If user is authenticated but not admin, redirect to dashboard
  if (user?.role !== "admin") {
    return <Navigate to="/student" />;
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "from-blue-400 to-blue-600",
    },
    {
      title: "Active Subscriptions",
      value: stats?.activeSubscriptions || 0,
      icon: CreditCard,
      color: "from-green-400 to-green-600",
    },
    {
      title: "Total Revenue",
      value: `₹${stats?.totalRevenue || 0}`,
      icon: TrendingUp,
      color: "from-purple-400 to-purple-600",
    },
    {
      title: "Total Content",
      value: stats?.totalContent || 0,
      icon: FileText,
      color: "from-orange-400 to-orange-600",
    },
    {
      title: "Total Questions",
      value: stats?.totalQuestions || 0,
      icon: FileText,
      color: "from-cyan-400 to-cyan-600",
    },
    {
      title: "Approved Questions",
      value: stats?.approvedQuestions || 0,
      icon: FileText,
      color: "from-teal-400 to-teal-600",
    },
    {
      title: "Manual Questions",
      value: stats?.manualQuestions || 0,
      icon: FileText,
      color: "from-indigo-400 to-indigo-600",
    },
    {
      title: "Pending Questions",
      value: stats?.pendingQuestions || 0,
      icon: AlertCircle,
      color: "from-red-400 to-red-600",
    },
    {
      title: "Mock Test Sets",
      value: stats?.mockTestSets || 0,
      icon: FileText,
      color: "from-emerald-400 to-emerald-600",
    },
    {
      title: "AI Test Sets",
      value: stats?.aiTestSets || 0,
      icon: FileText,
      color: "from-violet-400 to-violet-600",
    },
    {
      title: "PYQ Test Sets",
      value: stats?.pyqTestSets || 0,
      icon: FileText,
      color: "from-rose-400 to-rose-600",
    },
  ];

  return (
    <div className="min-h-screen p-6 relative">
      {/* Animated gradient background matching Landing page */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500" />
      
      {/* Animated orbs */}
      <motion.div
        className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="fixed top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
          delay: 1,
        }}
      />
      <motion.div
        className="fixed bottom-0 left-1/4 w-[600px] h-[600px] bg-pink-400/40 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
          delay: 0.5,
        }}
      />
      <motion.div
        className="fixed top-1/2 right-1/4 w-[400px] h-[400px] bg-cyan-400/40 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear",
          delay: 0.7,
        }}
      />

      {/* Lab background image */}
      <div 
        className="fixed inset-0 opacity-10"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6 relative z-10"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-white/70 mt-1">Manage your MLT Prep platform</p>
            </div>
          </div>
          <Button
            onClick={() => signOut()}
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border-white/30"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card border-white/20 backdrop-blur-xl bg-white/10 rounded-lg overflow-hidden"
            >
              <div className="flex flex-col p-4 space-y-2">
                <button onClick={() => { navigate("/admin"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Dashboard</button>
                <button onClick={() => { navigate("/admin/questions"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Questions</button>
                <button onClick={() => { navigate("/admin/weekly-tests"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10 font-bold">📅 Weekly Tests</button>
                <button onClick={() => { navigate("/admin/content"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Content</button>
                <button onClick={() => { navigate("/admin/study-materials"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Study Materials</button>
                <button onClick={() => { navigate("/admin/analytics"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Analytics</button>
                <button onClick={() => { navigate("/admin/subscriptions"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Subscriptions</button>
                <button onClick={() => { navigate("/admin/coupons"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Coupons</button>
                <button onClick={() => { navigate("/admin/notifications"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Notifications</button>
                <button onClick={() => { navigate("/admin/feedback"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Feedback</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-white/90">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Content */}
        <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
          <CardHeader>
            <CardTitle className="text-white">Recently Uploaded Content</CardTitle>
          </CardHeader>
          <CardContent>
            {!stats?.recentContent || stats.recentContent.length === 0 ? (
              <p className="text-white/80 text-center py-8">No content uploaded yet</p>
            ) : (
              <div className="space-y-4">
                {stats.recentContent.map((content: any) => (
                  <div
                    key={content._id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-white">{content.title}</p>
                      <p className="text-sm text-white/80">{content.type.toUpperCase()}</p>
                    </div>
                    <div className="text-sm text-white/80">
                      {content.views} views
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
          <CardHeader>
            <CardTitle className="text-white">Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {!stats?.recentPayments || stats.recentPayments.length === 0 ? (
              <p className="text-white/80 text-center py-8">No payments yet</p>
            ) : (
              <div className="space-y-4">
                {stats.recentPayments.map((payment: any) => (
                  <div
                    key={payment._id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-white">₹{payment.amount}</p>
                      <p className="text-sm text-white/80">{payment.status}</p>
                    </div>
                    <div className="text-sm text-white/80">
                      {new Date(payment._creationTime).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}