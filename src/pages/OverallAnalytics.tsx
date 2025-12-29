import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  AlertCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  CheckCircle2,
  ArrowLeft,
  Lock,
  Download,
  Users,
  Mail
} from "lucide-react";
import StudentNav from "@/components/StudentNav";
import AdminSidebar from "@/components/AdminSidebar";
import { toast } from "sonner";

export default function OverallAnalytics() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const stats = useQuery(api.student.getStudentDashboardStats);
  const subscriptionAccess = useQuery(api.student.checkSubscriptionAccess);
  const testHistory = useQuery(api.student.getTestHistory);
  
  // Admin-specific queries
  const isAdmin = user?.role === "admin";
  const registeredUsers = useQuery(
    api.analytics.getAllRegisteredUsers,
    isAdmin ? {} : "skip"
  );

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // CSV Download Function
  const handleDownloadCSV = () => {
    if (!registeredUsers?.users) {
      toast.error("No user data available");
      return;
    }

    try {
      // Create CSV content
      const headers = ["Name", "Email", "Role", "Registration Status", "Joined Date"];
      const csvRows = [headers.join(",")];

      registeredUsers.users.forEach((user: any) => {
        const row = [
          user.name || "N/A",
          user.email || "N/A",
          user.role || "user",
          user.isRegistered ? "Registered" : "Pending",
          new Date(user._creationTime).toLocaleDateString()
        ];
        csvRows.push(row.join(","));
      });

      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `mlt_prep_students_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Downloaded ${registeredUsers.users.length} student emails`);
    } catch (error) {
      console.error("CSV Download Error:", error);
      toast.error("Failed to download CSV");
    }
  };

  const isPaidUser = subscriptionAccess?.hasAccess && subscriptionAccess?.isPaid;
  const isFreeTrialUser = !isPaidUser;

  if (!stats || !testHistory) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  // If admin, show admin analytics view
  if (isAdmin && registeredUsers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="flex">
          <AdminSidebar />
          <div className="flex-1 p-6 ml-0 md:ml-64">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <Button
                  onClick={() => navigate("/admin")}
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Admin Dashboard
                </Button>
              </div>

              {/* Registered Users Card */}
              <Card className="overflow-hidden border-0 shadow-2xl bg-white rounded-2xl">
                <div className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-6 w-6 text-white" />
                        <h1 className="text-3xl font-bold">Registered Users Analytics</h1>
                      </div>
                      <p className="text-purple-100 text-sm opacity-90">
                        Total registered students and email export
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Stats Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                      <p className="text-sm text-blue-700 font-medium">Total Users</p>
                      <p className="text-3xl font-bold text-blue-900">{registeredUsers.totalUsers}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                      <p className="text-sm text-green-700 font-medium">Active Users</p>
                      <p className="text-3xl font-bold text-green-900">{registeredUsers.activeUsers}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                      <p className="text-sm text-purple-700 font-medium">Emails Available</p>
                      <p className="text-3xl font-bold text-purple-900">
                        {registeredUsers.users.filter((u: any) => u.email).length}
                      </p>
                    </div>
                  </div>

                  {/* Download CSV Button */}
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-200 rounded-full">
                          <Mail className="h-6 w-6 text-orange-700" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Export Student Emails</h3>
                          <p className="text-sm text-gray-600">
                            Download all registered student emails as CSV file
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={handleDownloadCSV}
                        className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold shadow-lg"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download CSV
                      </Button>
                    </div>
                  </div>

                  {/* User List Preview */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      Recent Registered Users
                    </h3>
                    <div className="max-h-96 overflow-y-auto space-y-2">
                      {registeredUsers.users.slice(0, 50).map((user: any) => (
                        <div
                          key={user._id}
                          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{user.name || "No Name"}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant={user.isRegistered ? "default" : "secondary"}
                                className={user.isRegistered ? "bg-green-500" : "bg-gray-400"}
                              >
                                {user.isRegistered ? "Active" : "Pending"}
                              </Badge>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(user._creationTime).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Student view (existing code)
  const allSessions = testHistory;
  const allIncorrectAnswers: Array<{topic: string; count: number}> = [];
  const topicStats: Record<string, { correct: number; total: number }> = {};

  allSessions.forEach((session: any) => {
    if (session.answers) {
      session.answers.forEach((ans: any) => {
        const topic = ans.topic || "General";
        if (!topicStats[topic]) {
          topicStats[topic] = { correct: 0, total: 0 };
        }
        topicStats[topic].total++;
        if (ans.isCorrect) {
          topicStats[topic].correct++;
        } else {
          const existing = allIncorrectAnswers.find(t => t.topic === topic);
          if (existing) {
            existing.count++;
          } else {
            allIncorrectAnswers.push({ topic, count: 1 });
          }
        }
      });
    }
  });

  const sortedMistakes = allIncorrectAnswers.sort((a, b) => b.count - a.count);
  const weakestTopic = sortedMistakes[0];
  const totalMarksLost = sortedMistakes.reduce((sum, t) => sum + t.count, 0);

  const topicPerformance = Object.entries(topicStats).map(([topic, data]) => ({
    topic,
    accuracy: Math.round((data.correct / data.total) * 100),
    total: data.total
  })).sort((a, b) => a.accuracy - b.accuracy);

  const avgTimePerQuestion = stats.avgTimePerQuestion || 0;
  const totalTests = stats.totalTests || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600">
      <StudentNav />
      
      <div className="max-w-6xl mx-auto p-6 pt-24 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate("/student")}
            variant="ghost"
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Button>
          {isPaidUser && (
            <Badge className="bg-yellow-400/20 text-yellow-100 border-yellow-400/30 px-3 py-1">
              <Crown className="h-3 w-3 mr-1 fill-yellow-300 text-yellow-300" /> Premium Active
            </Badge>
          )}
        </div>

        {/* Main Analytics Card */}
        <Card className="overflow-hidden border-0 shadow-2xl bg-white rounded-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-6 w-6 text-yellow-300 fill-yellow-300" />
                  <h1 className="text-3xl font-bold">Detailed Analysis</h1>
                </div>
                <p className="text-purple-100 text-sm opacity-90">
                  Comprehensive performance analytics across all your tests
                </p>
              </div>
              {!isPaidUser && (
                <Badge className="bg-yellow-400/20 text-yellow-100 border-yellow-400/30 px-3 py-1">
                  <Lock className="h-3 w-3 mr-1" /> Premium Feature
                </Badge>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8 relative">
            {/* Free User Blur Overlay */}
            {isFreeTrialUser && (
              <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-[2px] flex flex-col items-center justify-center">
                <Button 
                  onClick={() => navigate("/subscription-plans")}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-6 px-8 text-lg shadow-xl"
                >
                  <Lock className="mr-2 h-5 w-5" /> Upgrade to Unlock Detailed Analysis
                </Button>
              </div>
            )}

            {/* Overall Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-700 font-medium">Tests Attempted</p>
                <p className="text-3xl font-bold text-blue-900">{totalTests}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                <p className="text-sm text-green-700 font-medium">Average Score</p>
                <p className="text-3xl font-bold text-green-900">{stats.avgScore}%</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                <p className="text-sm text-purple-700 font-medium">Overall Accuracy</p>
                <p className="text-3xl font-bold text-purple-900">{stats.overallAccuracy}%</p>
              </div>
            </div>

            {/* Mistake Analysis Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h3>Mistake Analysis</h3>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4 text-red-800 font-medium">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <p>You lost <span className="font-bold">{totalMarksLost} marks</span> across all tests{weakestTopic ? `, most in ${weakestTopic.topic}` : ""}</p>
                </div>

                <div className="space-y-3">
                  {sortedMistakes.slice(0, 5).map((mistake, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4 shadow-sm border border-red-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            {mistake.topic}
                          </Badge>
                          <p className="text-gray-700 font-medium">{mistake.count} mistakes</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {sortedMistakes.length === 0 && (
                    <div className="text-center py-4 text-green-600 font-medium">
                      No mistakes found! Excellent work.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Time Analysis Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                <Clock className="h-5 w-5 text-orange-500" />
                <h3>Time Analysis</h3>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-200 rounded-full">
                      <Clock className="h-6 w-6 text-orange-700" />
                    </div>
                    <div>
                      <p className="text-sm text-orange-700 font-medium">Average time per question</p>
                      <p className="text-2xl font-bold text-orange-900">{Math.round(avgTimePerQuestion)} seconds</p>
                      <p className="text-xs text-orange-600 mt-1">
                        {avgTimePerQuestion < 30 ? "Fast pace" : avgTimePerQuestion < 45 ? "Steady pace" : "Take your time"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-200 rounded-full">
                      <CheckCircle2 className="h-6 w-6 text-green-700" />
                    </div>
                    <div>
                      <p className="text-sm text-green-700 font-medium">Questions Attempted</p>
                      <p className="text-2xl font-bold text-green-900">{stats.totalQuestionsAttempted}</p>
                      <p className="text-xs text-green-600 mt-1">Keep practicing!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Topic Weaknesses Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                <TrendingUp className="h-5 w-5 text-pink-500" />
                <h3>Topic Weaknesses</h3>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {topicPerformance.slice(0, 3).map((topic, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${topic.accuracy < 50 ? 'bg-red-500' : topic.accuracy < 70 ? 'bg-yellow-500' : 'bg-green-500'}`} />
                      <div>
                        <p className="text-sm font-medium text-gray-700">{topic.topic}</p>
                        <p className={`text-xl font-bold ${topic.accuracy < 50 ? 'text-red-600' : topic.accuracy < 70 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {topic.accuracy}%
                        </p>
                        <p className="text-xs text-gray-500">{topic.total} questions</p>
                      </div>
                    </div>
                  ))}
                  {topicPerformance.length === 0 && (
                    <p className="text-gray-500 col-span-3 text-center">No topic data available yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}