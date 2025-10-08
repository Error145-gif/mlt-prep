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
    <div className="min-h-screen relative overflow-hidden">
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

      {/* Content */}
      <div className="relative z-10 p-6">
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
    </div>
  );
}