import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, Target, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import StudentNav from "@/components/StudentNav";

export default function WeeklyLeaderboard() {
  const navigate = useNavigate();
  const [numItems] = useState(50);

  const currentTest = useQuery(api.weeklyTests.getCurrentWeeklyTest);
  const leaderboardData = useQuery(
    api.weeklyTests.getWeeklyLeaderboard,
    currentTest?._id
      ? {
          weeklyTestId: currentTest._id,
          paginationOpts: { numItems, cursor: null },
        }
      : "skip"
  );

  if (!currentTest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <StudentNav />
        <div className="max-w-4xl mx-auto p-6 pt-24">
          <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertCircle className="h-6 w-6" />
                No Active Weekly Test
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white/90">
              <p>There is no active weekly test at the moment.</p>
              <Button onClick={() => navigate("/student")} className="mt-4">
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isLeaderboardPublished = !!currentTest.leaderboardPublishedAt;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
      <StudentNav />
      <div className="max-w-6xl mx-auto p-6 pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20 mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-400" />
                  {currentTest.title} - Leaderboard
                </CardTitle>
                <div className="text-white/80 text-sm">
                  {isLeaderboardPublished ? "Final Results" : "Live Rankings"}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!isLeaderboardPublished && (
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
                  <p className="text-white/90 text-sm">
                    ⏳ Leaderboard updating... Final results will be published Monday evening.
                  </p>
                </div>
              )}

              {!leaderboardData ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              ) : leaderboardData.page.length === 0 ? (
                <div className="text-center py-12 text-white/80">
                  <p>No attempts yet. Be the first to take the test!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboardData.page.map((entry: any, index: number) => (
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
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="flex items-center gap-2 text-white">
                              <Target className="h-4 w-4" />
                              <span className="font-bold">{Math.round(entry.accuracy)}%</span>
                            </div>
                            <p className="text-white/60 text-xs">Accuracy</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 text-white">
                              <Clock className="h-4 w-4" />
                              <span className="font-bold">{Math.round(entry.avgTimePerQuestion)}s</span>
                            </div>
                            <p className="text-white/60 text-xs">Avg Time</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="mt-6 flex justify-center">
                <Button onClick={() => navigate("/student")} variant="outline" className="bg-white/10 border-white/30 text-white">
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
