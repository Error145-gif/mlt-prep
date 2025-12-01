import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate, useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function WeeklyTestManagement() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");

  const weeklyTests = useQuery(api.weeklyTests.getAllWeeklyTests);
  const createTest = useMutation(api.weeklyTests.createWeeklyTest);
  const updateStatus = useMutation(api.weeklyTests.updateWeeklyTestStatus);
  const deleteTest = useMutation(api.weeklyTests.deleteWeeklyTest);

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

  const handleCreateTest = async () => {
    if (!title || !scheduledDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const date = new Date(scheduledDate);
    if (date.getDay() !== 0) {
      toast.error("Weekly tests must be scheduled on Sunday");
      return;
    }

    try {
      await createTest({
        title,
        description: description || undefined,
        scheduledDate: date.getTime(),
      });
      
      toast.success("Weekly test created successfully with 100 random questions!");
      setShowCreateForm(false);
      setTitle("");
      setDescription("");
      setScheduledDate("");
    } catch (error: any) {
      toast.error(error.message || "Failed to create test");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Weekly Test Management</h1>
            <p className="text-white/70 mt-1">Manage Sunday free mock tests</p>
          </div>
          <Button
            onClick={() => navigate("/admin")}
            variant="outline"
            className="bg-white/10 border-white/30 text-white"
          >
            Back to Dashboard
          </Button>
        </div>

        {!showCreateForm && (
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Weekly Test
          </Button>
        )}

        {showCreateForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
              <CardHeader>
                <CardTitle className="text-white">Create Weekly Test</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Title</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Weekly Free Mock Test - Week 1"
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Description (Optional)</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Test description..."
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Scheduled Date (Sunday only)</Label>
                  <Input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="bg-white/10 border-white/30 text-white"
                  />
                </div>
                <div className="flex gap-4">
                  <Button onClick={handleCreateTest} className="bg-gradient-to-r from-green-500 to-emerald-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Test (Auto-select 100 Questions)
                  </Button>
                  <Button onClick={() => setShowCreateForm(false)} variant="outline" className="bg-white/10 border-white/30 text-white">
                    Cancel
                  </Button>
                </div>
                <p className="text-white/70 text-sm mt-2">
                  ℹ️ The system will automatically select 100 random approved questions for this test.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {weeklyTests?.map((test: any) => (
            <Card key={test._id} className="relative overflow-hidden">
              <div className="absolute top-2 right-2 flex gap-2">
                <Badge
                  className={
                    test.status === "active"
                      ? "bg-green-500/20 text-green-300 border-green-500/30"
                      : test.status === "completed"
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                      : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                  }
                >
                  {test.status}
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">{test.title}</CardTitle>
                    <p className="text-white/70 text-sm mt-1">
                      {test.scheduledDate ? new Date(test.scheduledDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }) : "Date not scheduled"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-white/90">
                  <p>Questions: {test.questions?.length || 0}</p>
                  <p>Total Attempts: {test.totalAttempts}</p>
                  {test.leaderboardPublishedAt && (
                    <p className="flex items-center gap-2 text-green-300">
                      <CheckCircle className="h-4 w-4" />
                      Leaderboard Published
                    </p>
                  )}
                </div>
                <div className="flex gap-4">
                  {test.status === "scheduled" && (
                    <Button
                      onClick={() => updateStatus({ weeklyTestId: test._id, status: "active" })}
                      className="bg-gradient-to-r from-green-500 to-emerald-600"
                    >
                      Activate Test
                    </Button>
                  )}
                  <Button
                    onClick={() => deleteTest({ weeklyTestId: test._id })}
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}