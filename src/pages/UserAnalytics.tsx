import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate } from "react-router";
import { Loader2, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function UserAnalytics() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const usersAnalytics = useQuery(api.analytics.getAllUsersAnalytics);

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

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <h1 className="text-3xl font-bold tracking-tight text-white">User Analytics</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {!usersAnalytics || usersAnalytics.length === 0 ? (
            <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10 col-span-full">
              <CardContent className="py-12 text-center">
                <p className="text-white/60">No user data available</p>
              </CardContent>
            </Card>
          ) : (
            usersAnalytics.map((userData: any, index: number) => (
              <motion.div
                key={userData._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">
                      {userData.name || userData.email || "Anonymous User"}
                    </CardTitle>
                    <p className="text-sm text-white/60">{userData.email}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Progress:</span>
                      <span className="text-white font-medium">{userData.totalProgress} items</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Avg Score:</span>
                      <span className="text-white font-medium">
                        {userData.avgScore ? `${userData.avgScore.toFixed(1)}%` : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Role:</span>
                      <span className="text-white font-medium capitalize">{userData.role || "user"}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
