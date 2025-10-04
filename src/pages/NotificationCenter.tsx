import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate } from "react-router";
import { useState } from "react";
import { Loader2, Plus, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Id } from "@/convex/_generated/dataModel";

export default function NotificationCenter() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const notifications = useQuery(api.notifications.getAllNotifications);
  const createNotification = useMutation(api.notifications.createNotification);
  const sendNotification = useMutation(api.notifications.sendNotification);
  const deleteNotification = useMutation(api.notifications.deleteNotification);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "both",
  });

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
    try {
      await createNotification(formData);
      toast.success("Notification created!");
      setIsDialogOpen(false);
      setFormData({ title: "", message: "", type: "both" });
    } catch (error) {
      toast.error("Failed to create notification");
    }
  };

  const handleSend = async (id: Id<"notifications">) => {
    try {
      await sendNotification({ id });
      toast.success("Notification sent!");
    } catch (error) {
      toast.error("Failed to send notification");
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

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-white">Notification Center</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Notification</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white/80">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="bg-white/5 border-white/20 text-white"
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
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
                  Create Draft
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {!notifications || notifications.length === 0 ? (
            <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
              <CardContent className="py-12 text-center">
                <p className="text-white/60">No notifications created yet</p>
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
                      <div>
                        <CardTitle className="text-white">{notif.title}</CardTitle>
                        <p className="text-sm text-white/60 mt-1">By {notif.senderName}</p>
                      </div>
                      <Badge className={notif.status === "sent" ? "bg-green-500/20 text-green-300" : "bg-yellow-500/20 text-yellow-300"}>
                        {notif.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white/80">{notif.message}</p>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <span className="capitalize">{notif.type}</span>
                      {notif.sentAt && (
                        <>
                          <span>•</span>
                          <span>Sent {new Date(notif.sentAt).toLocaleString()}</span>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {notif.status === "draft" && (
                        <Button
                          onClick={() => handleSend(notif._id)}
                          className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send Now
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDelete(notif._id)}
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
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
