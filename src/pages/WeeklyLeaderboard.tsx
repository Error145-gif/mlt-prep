import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, Target, Loader2, AlertCircle, Lock, Crown } from "lucide-react";
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

  // Determine user type - Check if user has PAID subscription
  const isPaidUser = subscriptionAccess?.hasAccess && subscriptionAccess?.isPaid;
  // STRICT SECURITY: If the backend attempt says it's locked, we treat it as locked regardless of client-side subscription state
  const isAttemptLocked = userAttempt?.isLocked === true;
  const isFreeTrialUser = !isPaidUser || isAttemptLocked;

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

  // Show user's score if they attempted
  const userScore = userAttempt ? Math.round(userAttempt.score) : null;
  const userAccuracy = userAttempt && userAttempt.accuracy !== null ? Math.round(userAttempt.accuracy) : null;
  const userRank = userAttempt && userAttempt.rank ? userAttempt.rank : null;

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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* SCORE SECTION */}
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-white/70 text-sm mb-1">Marks Obtained</p>
                      {isFreeTrialUser ? (
                        <p className="text-white text-xl font-bold">
                          You scored {userScore} out of 100
                        </p>
                      ) : (
                        <p className="text-white text-3xl font-bold">{userScore} / 100</p>
                      )}
                    </div>

                    {/* ACCURACY SECTION */}
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-white/70 text-sm mb-1">Accuracy</p>
                      {isFreeTrialUser || userAccuracy === null ? (
                         <p className="text-white/50 text-lg font-bold flex items-center gap-2">
                           <Lock className="h-4 w-4" /> Locked
                         </p>
                      ) : (
                         <p className="text-white text-3xl font-bold">{userAccuracy}%</p>
                      )}
                    </div>

                    {/* RANK SECTION */}
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-white/70 text-sm mb-1">Rank</p>
                      {isFreeTrialUser || userRank === null ? (
                         <p className="text-white/50 text-lg font-bold flex items-center gap-2">
                           <Lock className="h-4 w-4" /> Locked
                         </p>
                      ) : (
                         <p className="text-white text-3xl font-bold">
                           {userRank ? `#${userRank}` : (leaderboardData?.status === "active" ? "Not Ranked" : "Pending")}
                         </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* LEADERBOARD SECTION */}
              <div className="mt-8">
                <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-400" />
                  Leaderboard
                </h3>

                {/* STATE 1: BEFORE MONDAY MORNING */}
                {leaderboardData?.status === "not_released" && (
                  <div className="bg-white rounded-xl p-8 text-center shadow-xl">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-purple-100 rounded-full">
                        <Clock className="h-8 w-8 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                          Sunday Leaderboard will be released on Monday morning.
                        </h4>
                        <p className="text-gray-600">
                          Top performers and ranks will be available after leaderboard release.
                        </p>
                      </div>
                      <Button 
                        onClick={() => navigate("/student")}
                        variant="outline"
                        className="mt-2"
                      >
                        Back to Dashboard
                      </Button>
                    </div>
                  </div>
                )}

                {/* STATE 2: LOCKED FOR FREE USERS */}
                {leaderboardData?.status === "locked" && (
                  <div className="bg-white rounded-xl p-8 text-center shadow-xl border-2 border-yellow-400/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
                      PREMIUM
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-yellow-100 rounded-full">
                        <Lock className="h-8 w-8 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                          Sunday Leaderboard is a strict premium feature.
                        </h4>
                        <p className="text-gray-600">
                          Upgrade to view your accuracy, rank, and top performers.
                        </p>
                      </div>
                      <Button 
                        onClick={() => navigate("/subscription-plans")}
                        size="lg"
                        className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold shadow-lg mt-2"
                      >
                        Upgrade to Premium
                      </Button>
                    </div>
                  </div>
                )}

                {/* STATE 3: ACTIVE LEADERBOARD (PAID USERS) */}
                {leaderboardData?.status === "active" && (
                  <div className="space-y-3">
                    {!leaderboardData.page || leaderboardData.page.length === 0 ? (
                      <div className="text-center py-12 text-white/80 bg-white/5 rounded-lg">
                        <p>No attempts yet. Be the first to take the test!</p>
                      </div>
                    ) : (
                      leaderboardData.page.map((entry: any, index: number) => (
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
                      ))
                    )}
                  </div>
                )}
                
                {/* Loading State */}
                {!leaderboardData && (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                )}
              </div>

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