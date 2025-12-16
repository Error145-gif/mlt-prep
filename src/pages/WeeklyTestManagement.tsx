import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Trophy, Lock, Unlock, Calendar, Plus, X, Archive, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import AdminSidebar from "@/components/AdminSidebar";
import { useState } from "react";

export default function WeeklyTestManagement() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTestTitle, setNewTestTitle] = useState("");
  const [newTestDescription, setNewTestDescription] = useState("");
  const [newTestDate, setNewTestDate] = useState("");
  const [showArchivedTests, setShowArchivedTests] = useState(false);

  const allTests = useQuery(
    api.weeklyTests.getAllWeeklyTestsWithStats,
    isAuthenticated && user?.role === "admin" ? {} : "skip"
  );

  const adminLeaderboard = useQuery(
    api.weeklyTests.getAdminWeeklyLeaderboard,
    selectedTestId ? { weeklyTestId: selectedTestId as any } : "skip"
  );

  const createWeeklyTest = useMutation(api.weeklyTests.createWeeklyTest);
  const deleteWeeklyTest = useMutation(api.weeklyTests.deleteWeeklyTest);
  const toggleLeaderboard = useMutation(api.weeklyTests.toggleLeaderboardRelease);
  const archiveTest = useMutation(api.weeklyTests.archiveWeeklyTest);

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
      toast.success(!currentStatus ? "Leaderboard released to paid users!" : "Leaderboard hidden from users");
    } catch (error: any) {
      toast.error(error.message || "Failed to toggle leaderboard");
    }
  };

  const handleArchiveTest = async (testId: string) => {
    if (!confirm("Archive this test? It will be hidden from users but remain viewable by admins.")) {
      return;
    }

    try {
      await archiveTest({ weeklyTestId: testId as any });
      toast.success("Test archived successfully!");
      if (selectedTestId === testId) {
        setSelectedTestId(null);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to archive test");
    }
  };

  const handleDeleteTest = async (testId: string) => {
    if (!confirm("Permanently delete this test? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteWeeklyTest({ weeklyTestId: testId as any });
      toast.success("Test deleted successfully!");
      if (selectedTestId === testId) {
        setSelectedTestId(null);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete test");
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

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      draft: { bg: "bg-gray-500/20", text: "text-gray-300" },
      scheduled: { bg: "bg-blue-500/20", text: "text-blue-300" },
      active: { bg: "bg-green-500/20", text: "text-green-300" },
      completed: { bg: "bg-purple-500/20", text: "text-purple-300" },
      archived: { bg: "bg-orange-500/20", text: "text-orange-300" },
    };
    const badge = badges[status] || badges.draft;
    return (
      <span className={`px-2 py-1 rounded text-xs font-bold ${badge.bg} ${badge.text}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const filteredTests = allTests?.filter((test: any) => 
    showArchivedTests ? test.status === "archived" : test.status !== "archived"
  );

  const selectedTest = allTests?.find((t: any) => t._id === selectedTestId);

  return (
    <div className="min-h-screen p-6 relative">
      <AdminSidebar />
      
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6 relative z-10 ml-0 lg:ml-64"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Weekly Test Management</h1>
            <p className="text-white/70 mt-1">Manage Sunday Free Mock Tests & Leaderboards</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowArchivedTests(!showArchivedTests)}
              variant="outline"
              className="bg-white/10 border-white/30 text-white"
            >
              <Eye className="h-4 w-4 mr-2" />
              {showArchivedTests ? "Show Active" : "Show Archived"}
            </Button>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Week Test
            </Button>
          </div>
        </div>

        {showCreateForm && (
          <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
            <CardHeader>
              <CardTitle className="text-white">Create New Weekly Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Test Title *</Label>
                <Input
                  value={newTestTitle}
                  onChange={(e) => setNewTestTitle(e.target.value)}
                  placeholder="e.g., Sunday Free Mock Test - Week 1"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Label className="text-white">Description</Label>
                <Textarea
                  value={newTestDescription}
                  onChange={(e) => setNewTestDescription(e.target.value)}
                  placeholder="Optional description"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Label className="text-white">Schedule Date (Must be Sunday) *</Label>
                <Input
                  type="date"
                  value={newTestDate}
                  onChange={(e) => setNewTestDate(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="flex gap-4">
                <Button onClick={handleCreateTest} className="bg-green-500 hover:bg-green-600">
                  Create Test (Auto-selects 100 Questions)
                </Button>
                <Button onClick={() => setShowCreateForm(false)} variant="outline" className="bg-white/10 border-white/30 text-white">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test List */}
        <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
          <CardHeader>
            <CardTitle className="text-white">Weekly Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredTests?.map((test: any) => (
                <div
                  key={test._id}
                  className={`p-4 rounded-lg border-2 transition-all relative cursor-pointer ${
                    selectedTestId === test._id
                      ? "border-yellow-400 bg-yellow-500/20"
                      : "border-white/20 bg-white/5 hover:bg-white/10"
                  }`}
                  onClick={() => setSelectedTestId(test._id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="h-4 w-4 text-white" />
                        <span className="text-white font-semibold">{test.title}</span>
                        {getStatusBadge(test.status || "draft")}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="text-white/70">
                          <span className="font-medium">Attempts:</span> {test.totalAttempts || 0}
                        </div>
                        <div className="text-white/70">
                          <span className="font-medium">Submissions:</span> {test.totalSubmissions || 0}
                        </div>
                        <div className="text-green-300">
                          <span className="font-medium">Paid:</span> {test.paidUsersCount || 0}
                        </div>
                        <div className="text-orange-300">
                          <span className="font-medium">Free:</span> {test.freeUsersCount || 0}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {test.status !== "archived" && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArchiveTest(test._id);
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/20"
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTest(test._id);
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard Release Control */}
        {selectedTest && (
          <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>Leaderboard Release Control</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-normal text-white/70">
                    {selectedTest.leaderboardPublishedAt ? "Released to Paid Users" : "Hidden from All Users"}
                  </span>
                  <Switch
                    checked={!!selectedTest.leaderboardPublishedAt}
                    onCheckedChange={() => handleToggleLeaderboard(selectedTest._id, !!selectedTest.leaderboardPublishedAt)}
                  />
                  {selectedTest.leaderboardPublishedAt ? (
                    <Unlock className="h-5 w-5 text-green-400" />
                  ) : (
                    <Lock className="h-5 w-5 text-red-400" />
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 text-sm">
                Toggle ON to release leaderboard to PAID users only. Toggle OFF to hide from all users.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Admin Leaderboard Preview */}
        {adminLeaderboard && adminLeaderboard.length > 0 && (
          <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-400" />
                Leaderboard Preview (Admin Only - Always Visible)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left p-3">Rank</th>
                      <th className="text-left p-3">User</th>
                      <th className="text-left p-3">Score</th>
                      <th className="text-left p-3">Accuracy</th>
                      <th className="text-left p-3">Avg Time</th>
                      <th className="text-left p-3">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminLeaderboard.map((entry: any) => (
                      <tr key={entry._id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="p-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            entry.rank === 1 ? "bg-gradient-to-br from-yellow-400 to-yellow-600" :
                            entry.rank === 2 ? "bg-gradient-to-br from-gray-300 to-gray-500" :
                            entry.rank === 3 ? "bg-gradient-to-br from-orange-500 to-orange-700" :
                            "bg-white/10"
                          }`}>
                            {entry.rank}
                          </div>
                        </td>
                        <td className="p-3">
                          <div>
                            <p className="font-semibold">{entry.userName}</p>
                            <p className="text-xs text-white/60">{entry.userEmail}</p>
                          </div>
                        </td>
                        <td className="p-3 font-bold">{Math.round(entry.score)}%</td>
                        <td className="p-3">{Math.round(entry.accuracy)}%</td>
                        <td className="p-3">{Math.round(entry.avgTimePerQuestion)}s</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            entry.userType === "PAID" 
                              ? "bg-green-500/30 text-green-300" 
                              : "bg-orange-500/30 text-orange-300"
                          }`}>
                            {entry.userType}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}