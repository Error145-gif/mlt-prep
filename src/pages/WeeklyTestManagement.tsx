import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Users, Trophy, Lock, Unlock, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import AdminSidebar from "@/components/AdminSidebar";
import { useState } from "react";

export default function WeeklyTestManagement() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

  const allTests = useQuery(
    api.weeklyTests.getAllWeeklyTests,
    isAuthenticated && user?.role === "admin" ? {} : "skip"
  );

  const currentTest = useQuery(api.weeklyTests.getCurrentWeeklyTest);

  const testStats = useQuery(
    api.weeklyTests.getWeeklyTestStats,
    selectedTestId ? { weeklyTestId: selectedTestId as any } : "skip"
  );

  const adminLeaderboard = useQuery(
    api.weeklyTests.getAdminWeeklyLeaderboard,
    selectedTestId ? { weeklyTestId: selectedTestId as any } : "skip"
  );

  const releaseLeaderboard = useMutation(api.weeklyTests.releaseLeaderboard);

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

  // Auto-select current test
  if (!selectedTestId && currentTest) {
    setSelectedTestId(currentTest._id);
  }

  const handleReleaseLeaderboard = async () => {
    if (!selectedTestId) return;

    try {
      await releaseLeaderboard({ weeklyTestId: selectedTestId as any });
      toast.success("Leaderboard released to paid users!");
    } catch (error: any) {
      toast.error(error.message || "Failed to release leaderboard");
    }
  };

  return (
    <div className="min-h-screen p-6 relative">
      <AdminSidebar />
      
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6 relative z-10 ml-0 lg:ml-64"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Weekly Test Management</h1>
          <p className="text-white/70 mt-1">Manage Sunday Free Mock Tests & Leaderboards</p>
        </div>

        {/* Test Selection */}
        <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
          <CardHeader>
            <CardTitle className="text-white">Select Weekly Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allTests?.map((test: any) => (
                <button
                  key={test._id}
                  onClick={() => setSelectedTestId(test._id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedTestId === test._id
                      ? "border-yellow-400 bg-yellow-500/20"
                      : "border-white/20 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-white" />
                    <span className="text-white font-semibold">{test.title}</span>
                  </div>
                  <p className="text-white/70 text-sm">
                    Status: <span className="font-medium">{test.status}</span>
                  </p>
                  <p className="text-white/70 text-sm">
                    Attempts: <span className="font-medium">{test.totalAttempts || 0}</span>
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Test Statistics */}
        {testStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white/90">Total Attempts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  <span className="text-3xl font-bold text-white">{testStats.totalAttempts}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/30 backdrop-blur-xl bg-green-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white/90">Paid Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-green-400" />
                  <span className="text-3xl font-bold text-white">{testStats.paidUserCount}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/30 backdrop-blur-xl bg-orange-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white/90">Free Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-400" />
                  <span className="text-3xl font-bold text-white">{testStats.freeUserCount}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/30 backdrop-blur-xl bg-purple-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white/90">Leaderboard Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {testStats.isLeaderboardReleased ? (
                    <>
                      <Unlock className="h-5 w-5 text-green-400" />
                      <span className="text-lg font-bold text-green-400">Released</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5 text-red-400" />
                      <span className="text-lg font-bold text-red-400">Locked</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Release Leaderboard Button */}
        {testStats && !testStats.isLeaderboardReleased && (
          <Card className="glass-card border-yellow-500/50 backdrop-blur-xl bg-yellow-500/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">Release Leaderboard (This Week)</h3>
                  <p className="text-white/80 text-sm">
                    This will unlock the leaderboard for all PAID users. FREE users will remain locked.
                  </p>
                </div>
                <Button
                  onClick={handleReleaseLeaderboard}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold"
                >
                  <Unlock className="h-4 w-4 mr-2" />
                  Release Leaderboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Admin Leaderboard View */}
        {adminLeaderboard && adminLeaderboard.length > 0 && (
          <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-400" />
                Admin Leaderboard View (Always Visible)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {adminLeaderboard.map((entry: any, index: number) => (
                  <motion.div
                    key={entry._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg backdrop-blur-sm border ${
                      entry.rank === 1
                        ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50"
                        : entry.rank === 2
                        ? "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50"
                        : entry.rank === 3
                        ? "bg-gradient-to-r from-orange-600/20 to-orange-700/20 border-orange-600/50"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                            entry.rank === 1
                              ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white"
                              : entry.rank === 2
                              ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white"
                              : entry.rank === 3
                              ? "bg-gradient-to-br from-orange-500 to-orange-700 text-white"
                              : "bg-white/10 text-white"
                          }`}
                        >
                          {entry.rank}
                        </div>
                        <div>
                          <p className="text-white font-semibold">{entry.userName}</p>
                          <p className="text-white/60 text-sm">{entry.userEmail}</p>
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded ${
                              entry.userType === "PAID"
                                ? "bg-green-500/30 text-green-300"
                                : "bg-orange-500/30 text-orange-300"
                            }`}
                          >
                            {entry.userType}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-white font-bold">{Math.round(entry.accuracy)}%</p>
                          <p className="text-white/60 text-xs">Accuracy</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">{Math.round(entry.avgTimePerQuestion)}s</p>
                          <p className="text-white/60 text-xs">Avg Time</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}