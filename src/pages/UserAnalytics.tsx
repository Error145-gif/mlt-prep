import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate } from "react-router";
import { Loader2, Users, Mail, Trash2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";

export default function UserAnalytics() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const users = useQuery(api.analytics.getAllRegisteredUsers);
  const deleteUser = useMutation(api.userManagement.deleteUser);
  const resetAllUserData = useMutation(api.userDataReset.resetAllUserData);
  
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

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

  const handleDeleteUser = async (userId: Id<"users">) => {
    setIsDeleting(true);
    try {
      const result = await deleteUser({ userId });
      toast.success(`User ${result.deletedEmail} has been deleted successfully`);
      setSelectedUser(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetAllUsers = async () => {
    setIsResetting(true);
    try {
      const result = await resetAllUserData({});
      toast.success(`Successfully reset all user data! Deleted ${result.deletedCounts.users} users and their related data.`);
    } catch (error) {
      toast.error("Failed to reset user data");
      console.error(error);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 relative">
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-7xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            <p className="text-white/70 mt-1">Manage registered users and their accounts</p>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Reset All User Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="glass-card border-white/20 backdrop-blur-xl bg-gray-900/95">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-white/70">
                  This action will permanently delete ALL user accounts and their related data including:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>User profiles and accounts</li>
                    <li>Test scores and results</li>
                    <li>Progress tracking data</li>
                    <li>Subscriptions and payments</li>
                    <li>Feedback submissions</li>
                  </ul>
                  <p className="mt-3 font-semibold text-red-400">
                    Your admin account will be preserved. This action cannot be undone.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-white/10 text-white border-white/20">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleResetAllUsers}
                  disabled={isResetting}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  {isResetting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    "Yes, Reset All Data"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Reset All User Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="glass-card border-white/20 backdrop-blur-xl bg-gray-900/95">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-white/70">
                  This action will permanently delete ALL user accounts and their related data including:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>User profiles and accounts</li>
                    <li>Test scores and results</li>
                    <li>Progress tracking data</li>
                    <li>Subscriptions and payments</li>
                    <li>Feedback submissions</li>
                  </ul>
                  <p className="mt-3 font-semibold text-red-400">
                    Your admin account will be preserved. This action cannot be undone.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-white/10 text-white border-white/20">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleResetAllUsers}
                  disabled={isResetting}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  {isResetting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    "Yes, Reset All Data"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/90">
                Total Registered Users
              </CardTitle>
              <Users className="h-5 w-5 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{users?.totalUsers || 0}</div>
              <p className="text-xs text-white/70 mt-1">Gmail accounts registered</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/90">
                Active Users
              </CardTitle>
              <Mail className="h-5 w-5 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{users?.activeUsers || 0}</div>
              <p className="text-xs text-white/70 mt-1">Completed registration</p>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
          <CardHeader>
            <CardTitle className="text-white">All Registered Users</CardTitle>
          </CardHeader>
          <CardContent>
            {!users || users.users.length === 0 ? (
              <p className="text-white/60 text-center py-8">No users registered yet</p>
            ) : (
              <div className="space-y-3">
                {users.users.map((userData: any, index: number) => (
                  <motion.div
                    key={userData._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/10 border border-white/20 hover:bg-white/15 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {userData.name?.[0]?.toUpperCase() || userData.email?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {userData.name || "Anonymous User"}
                          </p>
                          <p className="text-sm text-white/70">{userData.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-white/60">Role</p>
                        <p className="text-sm font-medium text-white capitalize">{userData.role || "user"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-white/60">Status</p>
                        <p className="text-sm font-medium text-white">
                          {userData.isRegistered ? "Active" : "Pending"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-white/60">Joined</p>
                        <p className="text-sm font-medium text-white">
                          {new Date(userData._creationTime).toLocaleDateString()}
                        </p>
                      </div>
                      {userData.role !== "admin" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setSelectedUser({ id: userData._id, email: userData.email })}
                          className="bg-red-500/80 hover:bg-red-600 text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}