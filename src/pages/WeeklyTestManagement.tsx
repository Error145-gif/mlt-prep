import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Loader2, Trophy, Lock, Calendar, Plus, Users, CheckCircle, DollarSign, User } from "lucide-react";
import { toast } from "sonner";
import AdminSidebar from "@/components/AdminSidebar";
import { useState } from "react";
import { format } from "date-fns";

export default function WeeklyTestManagement() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTestTitle, setNewTestTitle] = useState("");
  const [newTestDescription, setNewTestDescription] = useState("");
  const [newTestDate, setNewTestDate] = useState("");

  const allTests = useQuery(
    api.weeklyTests.getAllWeeklyTestsWithStats,
    isAuthenticated && user?.role === "admin" ? {} : "skip"
  );

  const adminLeaderboard = useQuery(
    api.weeklyTests.getAdminWeeklyLeaderboard,
    selectedTestId ? { weeklyTestId: selectedTestId as any } : "skip"
  );

  const createWeeklyTest = useMutation(api.weeklyTests.createWeeklyTest);
  const toggleLeaderboard = useMutation(api.weeklyTests.toggleLeaderboardRelease);

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

  const handleToggleLeaderboard = async (testId: string, currentStatus: boolean) => {
    try {
      await toggleLeaderboard({ 
        weeklyTestId: testId as any, 
        shouldRelease: !currentStatus 
      });
      toast.success(!currentStatus ? "Leaderboard generated for PAID users!" : "Leaderboard hidden");
    } catch (error: any) {
      toast.error(error.message || "Failed to toggle leaderboard");
    }
  };

  const handleCreateTest = async () => {
    if (!newTestTitle || !newTestDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const selectedDate = new Date(newTestDate);
    if (selectedDate.getDay() !== 0) {
      toast.error("Weekly test must be scheduled on a Sunday");
      return;
    }

    try {
      await createWeeklyTest({
        title: newTestTitle,
        description: newTestDescription,
        scheduledDate: selectedDate.getTime(),
      });
      toast.success("Weekly test created successfully!");
      setShowCreateForm(false);
      setNewTestTitle("");
      setNewTestDescription("");
      setNewTestDate("");
    } catch (error: any) {
      toast.error(error.message || "Failed to create test");
    }
  };

  const selectedTest = allTests?.find((t: any) => t._id === selectedTestId);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <div className="flex-1 p-6 ml-0 lg:ml-64 bg-gradient-to-br from-blue-600 via-purple-700 to-purple-900 min-h-screen">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Weekly Tests Management</h1>
              <p className="text-white/70">Manage Free Sunday Tests & Premium Leaderboards</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: Weekly Tests Management */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="bg-white/10 border-white/20 backdrop-blur-xl text-white">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Weekly Tests</span>
                    <Button 
                      onClick={() => setShowCreateForm(!showCreateForm)}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Create New Test
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {showCreateForm && (
                    <div className="bg-white/10 p-4 rounded-lg border border-white/20 mb-4 space-y-3">
                      <h3 className="font-semibold text-sm">New Sunday Test</h3>
                      <Input
                        value={newTestTitle}
                        onChange={(e) => setNewTestTitle(e.target.value)}
                        placeholder="Test Title (e.g. Sunday Mock #1)"
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                      />
                      <Input
                        type="date"
                        value={newTestDate}
                        onChange={(e) => setNewTestDate(e.target.value)}
                        className="bg-white/5 border-white/20 text-white"
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(false)} className="text-white/70 hover:text-white">Cancel</Button>
                        <Button size="sm" onClick={handleCreateTest} className="bg-blue-500 hover:bg-blue-600">Create</Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {allTests?.map((test: any) => (
                      <div
                        key={test._id}
                        onClick={() => setSelectedTestId(test._id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          selectedTestId === test._id
                            ? "bg-white text-purple-900 border-white shadow-lg scale-[1.02]"
                            : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className={`h-4 w-4 ${selectedTestId === test._id ? "text-purple-600" : "text-white/70"}`} />
                            <span className="font-bold text-sm">
                              {format(new Date(test.scheduledDate || test._creationTime), "MMM dd, yyyy")}
                            </span>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            selectedTestId === test._id ? "bg-purple-100 text-purple-700" : "bg-white/10 text-white/70"
                          }`}>
                            {test.title}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className={`p-2 rounded-lg ${selectedTestId === test._id ? "bg-purple-50" : "bg-white/5"}`}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <Users className={`h-3 w-3 ${selectedTestId === test._id ? "text-purple-500" : "text-white/60"}`} />
                              <span className={`text-xs ${selectedTestId === test._id ? "text-purple-700" : "text-white/60"}`}>Unique Users</span>
                            </div>
                            <p className="text-lg font-bold">{test.totalAttempts || 0}</p>
                          </div>
                          <div className={`p-2 rounded-lg ${selectedTestId === test._id ? "bg-green-50" : "bg-white/5"}`}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <CheckCircle className={`h-3 w-3 ${selectedTestId === test._id ? "text-green-500" : "text-white/60"}`} />
                              <span className={`text-xs ${selectedTestId === test._id ? "text-green-700" : "text-white/60"}`}>Total Attempts</span>
                            </div>
                            <p className="text-lg font-bold">{test.totalSubmissions || 0}</p>
                          </div>
                          <div className={`p-2 rounded-lg ${selectedTestId === test._id ? "bg-yellow-50" : "bg-white/5"}`}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <DollarSign className={`h-3 w-3 ${selectedTestId === test._id ? "text-yellow-600" : "text-white/60"}`} />
                              <span className={`text-xs ${selectedTestId === test._id ? "text-yellow-700" : "text-white/60"}`}>Paid Users</span>
                            </div>
                            <p className="text-lg font-bold">{test.paidUsersCount || 0}</p>
                          </div>
                          <div className={`p-2 rounded-lg ${selectedTestId === test._id ? "bg-orange-50" : "bg-white/5"}`}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <User className={`h-3 w-3 ${selectedTestId === test._id ? "text-orange-500" : "text-white/60"}`} />
                              <span className={`text-xs ${selectedTestId === test._id ? "text-orange-700" : "text-white/60"}`}>Free Users</span>
                            </div>
                            <p className="text-lg font-bold">{test.freeUsersCount || 0}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN: Sunday Leaderboard */}
            <div className="lg:col-span-7">
              <Card className="bg-white h-full border-none shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 border-b border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-purple-900 flex items-center gap-2">
                        <Trophy className="h-6 w-6 text-yellow-500" />
                        Sunday Leaderboard
                      </h2>
                      <p className="text-purple-700/70 text-sm">Premium Analytics | Weekly Top Performers</p>
                    </div>
                    {selectedTest && (
                      <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-purple-100">
                        <span className="text-sm font-medium text-gray-600">Leaderboard Generated:</span>
                        <Switch
                          checked={!!selectedTest.leaderboardPublishedAt}
                          onCheckedChange={() => handleToggleLeaderboard(selectedTest._id, !!selectedTest.leaderboardPublishedAt)}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <CardContent className="p-0">
                  {!selectedTest ? (
                    <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
                      <Trophy className="h-16 w-16 mb-4 opacity-20" />
                      <p>Select a test to view leaderboard</p>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full">
                      <div className="p-4 bg-yellow-50 border-b border-yellow-100 flex items-center gap-2 text-yellow-800 text-sm">
                        <Lock className="h-4 w-4" />
                        <span className="font-medium">Tip:</span> Leaderboard is a strict premium feature. Only paid users are ranked.
                      </div>

                      <div className="overflow-auto max-h-[600px]">
                        <table className="w-full">
                          <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                              <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
                              <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                              <th className="text-right p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                              <th className="text-right p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Accuracy</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {adminLeaderboard?.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                  No paid users have attempted this test yet, or leaderboard not generated.
                                </td>
                              </tr>
                            ) : (
                              adminLeaderboard?.map((entry: any) => (
                                <tr key={entry._id} className="hover:bg-gray-50 transition-colors">
                                  <td className="p-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                      entry.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                                      entry.rank === 2 ? "bg-gray-100 text-gray-700" :
                                      entry.rank === 3 ? "bg-orange-100 text-orange-700" :
                                      "text-gray-500"
                                    }`}>
                                      #{entry.rank}
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">
                                        {entry.userName.charAt(0)}
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-900">{entry.userName}</p>
                                        <p className="text-xs text-gray-500">{entry.userEmail}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-4 text-right font-bold text-gray-900">
                                    {Math.round(entry.score)}%
                                  </td>
                                  <td className="p-4 text-right text-gray-600">
                                    {Math.round(entry.accuracy)}%
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="p-4 border-t border-gray-100 bg-gray-50 text-center text-xs text-gray-500">
                        Showing top performers among {selectedTest.paidUsersCount || 0} paid users
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}