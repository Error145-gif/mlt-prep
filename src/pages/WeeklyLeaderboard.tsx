import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, Target, Loader2, AlertCircle, Lock } from "lucide-react";
import { motion } from "framer-motion";
import StudentNav from "@/components/StudentNav";

export default function WeeklyLeaderboard() {
  const navigate = useNavigate();
  const [numItems] = useState(50);

  const currentTest = useQuery(api.weeklyTests.getCurrentWeeklyTest);
  const subscriptionAccess = useQuery(api.student.checkSubscriptionAccess);
  const userAttempt = useQuery(
    api.weeklyTests.getUserWeeklyTestAttempt,
    currentTest?._id ? { weeklyTestId: currentTest._id } : "skip"
  );
  const leaderboardData = useQuery(
    api.weeklyTests.getWeeklyLeaderboard,
    currentTest?._id
      ? {
          weeklyTestId: currentTest._id,
          paginationOpts: { numItems, cursor: null },
        }
      : "skip"
  );

  // Determine user type
  const isPaidUser = subscriptionAccess?.hasAccess && subscriptionAccess?.isPaid;
  const isFreeTrialUser = !isPaidUser; // Anyone who is NOT a paid subscriber is treated as free trial

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

  // Show user's score if they attempted
  const userScore = userAttempt ? Math.round(userAttempt.score) : null;
  const userAccuracy = userAttempt ? Math.round(userAttempt.accuracy) : null;

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
                  {currentTest.title} - Results
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {/* Show user's score - visible to ALL users */}
              {userScore !== null && (
                <div className="bg-white/10 border border-white/20 rounded-lg p-6 mb-6">
                  <h3 className="text-white text-xl font-bold mb-4">Your Performance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/70 text-sm">Accuracy</p>
                      <p className="text-white text-3xl font-bold">{userAccuracy}%</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Score</p>
                      <p className="text-white text-3xl font-bold">{userScore}%</p>
                    </div>
                  </div>
                </div>
              )}

              {/* FREE TRIAL USER - Always show lock message */}
              {isFreeTrialUser && (
                <div className="bg-orange-500/20 border-2 border-orange-500/50 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="h-8 w-8 text-orange-300" />
                    <div>
                      <p className="text-white font-bold text-lg">🔒 Rank & leaderboard are available after upgrade.</p>
                      <p className="text-white/90">Upgrade to check your exact rank.</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate("/subscription-plans")}
                    className="bg-white text-orange-600 hover:bg-white/90 font-semibold w-full"
                  >
                    Upgrade Now – Check Your Rank
                  </Button>
                </div>
              )}

              {/* PAID USER - Show leaderboard based on admin release */}
              {isPaidUser && (
                <>
                  {!isLeaderboardPublished ? (
                    <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-6 mb-6">
                      <p className="text-white/90 text-center">
                        ⏳ Leaderboard will be released by admin soon.
                      </p>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
                </>
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