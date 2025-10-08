import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate } from "react-router";
import { Loader2, Users, CreditCard, FileText, AlertCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const stats = useQuery(
    api.analytics.getDashboardStats,
    user?.role === "admin" ? {} : "skip"
  );
  const makeAdmin = useMutation(api.users.makeCurrentUserAdmin);

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

  // If user is authenticated but not admin, show button to become admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-white text-center">Admin Access Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-white/70 text-center">
              You need admin privileges to access this dashboard.
            </p>
            <Button
              onClick={async () => {
                try {
                  await makeAdmin();
                  toast.success("Admin access granted!");
                  window.location.reload();
                } catch (error) {
                  toast.error("Failed to grant admin access");
                }
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Grant Admin Access
            </Button>
          </CardContent>
        </Card>
      </div>
    );
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
  ];

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      {/* Animated Background Gradients - Same as Landing */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-pink-400/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] bg-cyan-400/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }} />
      </div>

      {/* Lab Background Image */}
      <div 
        className="fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-7xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">Dashboard</h1>
        </div>

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
              <div className="space-y-3">
                {stats.recentContent.map((content) => (
                  <div
                    key={content._id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
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
              <div className="space-y-3">
                {stats.recentPayments.map((payment) => (
                  <div
                    key={payment._id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
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