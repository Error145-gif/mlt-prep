import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate } from "react-router";
import { Loader2, Users, CreditCard, FileText, AlertCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const stats = useQuery(api.analytics.getDashboardStats);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/auth" />;
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
      title: "Pending Questions",
      value: stats?.pendingQuestions || 0,
      icon: AlertCircle,
      color: "from-red-400 to-red-600",
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-white/80">
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
        <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
          <CardHeader>
            <CardTitle className="text-white">Recently Uploaded Content</CardTitle>
          </CardHeader>
          <CardContent>
            {!stats?.recentContent || stats.recentContent.length === 0 ? (
              <p className="text-white/60 text-center py-8">No content uploaded yet</p>
            ) : (
              <div className="space-y-3">
                {stats.recentContent.map((content) => (
                  <div
                    key={content._id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div>
                      <p className="font-medium text-white">{content.title}</p>
                      <p className="text-sm text-white/60">{content.type.toUpperCase()}</p>
                    </div>
                    <div className="text-sm text-white/60">
                      {content.views} views
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
          <CardHeader>
            <CardTitle className="text-white">Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {!stats?.recentPayments || stats.recentPayments.length === 0 ? (
              <p className="text-white/60 text-center py-8">No payments yet</p>
            ) : (
              <div className="space-y-3">
                {stats.recentPayments.map((payment) => (
                  <div
                    key={payment._id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div>
                      <p className="font-medium text-white">₹{payment.amount}</p>
                      <p className="text-sm text-white/60">{payment.status}</p>
                    </div>
                    <div className="text-sm text-white/60">
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
