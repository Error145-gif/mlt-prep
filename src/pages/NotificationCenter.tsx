import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate, useNavigate } from "react-router";
import { useState } from "react";
import { Loader2, Plus, Send, Trash2, Users, Mail, Bell, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

export default function NotificationCenter() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const notifications = useQuery(api.notifications.getAllNotifications);
  const allUsers = useQuery(api.notifications.getAllUsers);
  const createNotification = useMutation(api.notifications.createNotification);
  const sendNotification = useAction(api.notifications.sendNotification);
  const deleteNotification = useMutation(api.notifications.deleteNotification);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sendToAll, setSendToAll] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<Id<"users">[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "both",
  });

  // Notification templates
  const templates = [
    {
      name: "New Feature Announcement",
      title: "New Feature Available!",
      message: "We've added a new feature to help you prepare better. Check it out in your dashboard!",
    },
    {
      name: "Subscription Reminder",
      title: "Your Subscription is Expiring Soon",
      message: "Your subscription will expire in 3 days. Renew now to continue accessing all features!",
    },
    {
      name: "New Content Added",
      title: "New Study Materials Available",
      message: "We've added new PYQ questions and study materials. Start practicing now!",
    },
    {
      name: "Maintenance Notice",
      title: "Scheduled Maintenance",
      message: "We'll be performing maintenance on [DATE]. The platform may be unavailable for a short time.",
    },
  ];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sendToAll && selectedUsers.length === 0) {
      toast.error("Please select at least one user or choose 'Send to All'");
      return;
    }

    try {
      await createNotification({
        ...formData,
        sendToAll,
        targetUsers: sendToAll ? undefined : selectedUsers,
      });
      toast.success("Notification sent successfully! Users will see it now.");
      setIsDialogOpen(false);
      setFormData({ title: "", message: "", type: "both" });
      setSendToAll(true);
      setSelectedUsers([]);
    } catch (error) {
      toast.error("Failed to create notification");
    }
  };

  const handleSend = async (id: Id<"notifications">) => {
    try {
      await sendNotification({ id });
      toast.success("Notification sent successfully! Users will see it now.");
    } catch (error) {
      console.error("Failed to send notification:", error);
      toast.error("Failed to send notification: " + (error as Error).message);
    }
  };

  const handleDelete = async (id: Id<"notifications">) => {
    try {
      await deleteNotification({ id });
      toast.success("Notification deleted!");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const applyTemplate = (template: typeof templates[0]) => {
    setFormData({
      ...formData,
      title: template.title,
      message: template.message,
    });
  };

  const toggleUserSelection = (userId: Id<"users">) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="min-h-screen p-6 relative">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 z-0" />
      
      {/* Animated Orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-pink-400/40 rounded-full blur-3xl" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-400/40 rounded-full blur-3xl" style={{ animationDelay: '0.7s' }} />
      </div>

      {/* Lab Background Image */}
      <div 
        className="fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6 relative z-10"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Notification Center</h1>
              <p className="text-white/60 mt-1">Send notifications to users via email and push</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Notification</DialogTitle>
              </DialogHeader>
              
              {/* Quick Templates */}
              <div className="space-y-2">
                <Label className="text-white/80">Quick Templates</Label>
                <div className="grid grid-cols-2 gap-2">
                  {templates.map((template) => (
                    <Button
                      key={template.name}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => applyTemplate(template)}
                      className="bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:text-white text-xs"
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white/80">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="Enter notification title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message" className="text-white/80">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="bg-white/5 border-white/20 text-white"
                    rows={4}
                    placeholder="Enter notification message"
                  />
                </div>
                
                <div>
                  <Label htmlFor="type" className="text-white/80">Notification Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="push">Push Only</SelectItem>
                      <SelectItem value="email">Email Only</SelectItem>
                      <SelectItem value="both">Both (Recommended)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* User Targeting */}
                <div className="space-y-3">
                  <Label className="text-white/80">Target Audience</Label>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sendToAll"
                      checked={sendToAll}
                      onCheckedChange={(checked) => {
                        setSendToAll(checked as boolean);
                        if (checked) setSelectedUsers([]);
                      }}
                      className="border-white/20"
                    />
                    <label
                      htmlFor="sendToAll"
                      className="text-sm text-white/80 cursor-pointer"
                    >
                      Send to all users ({allUsers?.length || 0} users)
                    </label>
                  </div>

                  {!sendToAll && (
                    <div className="space-y-2 max-h-48 overflow-y-auto bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-xs text-white/60 mb-2">
                        Selected: {selectedUsers.length} user(s)
                      </p>
                      {allUsers?.map((u) => (
                        <div key={u._id} className="flex items-center space-x-2">
                          <Checkbox
                            id={u._id}
                            checked={selectedUsers.includes(u._id)}
                            onCheckedChange={() => toggleUserSelection(u._id)}
                            className="border-white/20"
                          />
                          <label
                            htmlFor={u._id}
                            className="text-sm text-white/80 cursor-pointer flex-1"
                          >
                            {u.name} ({u.email})
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600">
                    Create Draft
                  </Button>
                  <Button type="button" onClick={() => setIsDialogOpen(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card border-white/20 backdrop-blur-xl bg-white/10 rounded-lg overflow-hidden"
            >
              <div className="flex flex-col p-4 space-y-2">
                <button onClick={() => { navigate("/admin"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Dashboard</button>
                <button onClick={() => { navigate("/admin/questions"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Questions</button>
                <button onClick={() => { navigate("/admin/content"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Content</button>
                <button onClick={() => { navigate("/admin/study-materials"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Study Materials</button>
                <button onClick={() => { navigate("/admin/analytics"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Analytics</button>
                <button onClick={() => { navigate("/admin/subscriptions"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Subscriptions</button>
                <button onClick={() => { navigate("/admin/coupons"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Coupons</button>
                <button onClick={() => { navigate("/admin/notifications"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Notifications</button>
                <button onClick={() => { navigate("/admin/feedback"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Feedback</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-500/20">
                  <Bell className="h-6 w-6 text-blue-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {notifications?.length || 0}
                  </p>
                  <p className="text-sm text-white/60">Total Notifications</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-500/20">
                  <Send className="h-6 w-6 text-green-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {notifications?.filter(n => n.status === "sent").length || 0}
                  </p>
                  <p className="text-sm text-white/60">Sent</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-500/20">
                  <Users className="h-6 w-6 text-purple-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {allUsers?.length || 0}
                  </p>
                  <p className="text-sm text-white/60">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {!notifications || notifications.length === 0 ? (
            <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">No notifications created yet</p>
                <p className="text-white/40 text-sm mt-2">Create your first notification to engage with users</p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notif: any, index: number) => (
              <motion.div
                key={notif._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <CardTitle className="text-white">{notif.title}</CardTitle>
                          <Badge className={notif.status === "sent" ? "bg-green-500/20 text-green-300" : "bg-yellow-500/20 text-yellow-300"}>
                            {notif.status}
                          </Badge>
                          <Badge className="bg-blue-500/20 text-blue-300 capitalize">
                            {notif.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-white/60">
                          By {notif.senderName} • {notif.recipientCount} recipient(s)
                        </p>
                      </div>
                      <Button
                        onClick={() => handleDelete(notif._id)}
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white/80">{notif.message}</p>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      {notif.sentAt && (
                        <>
                          <Mail className="h-4 w-4" />
                          <span>Sent {new Date(notif.sentAt).toLocaleString()}</span>
                        </>
                      )}
                    </div>
                    {notif.status === "draft" && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => handleSend(notif._id)}
                          className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send Now
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}