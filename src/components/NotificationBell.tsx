import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

export default function NotificationBell() {
  const notifications = useQuery(api.notifications.getUserNotifications);
  const unreadCount = useQuery(api.notifications.getUnreadCount);
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);
  
  const previousCountRef = useRef<number>(0);
  const hasRequestedPermission = useRef(false);

  // Request notification permission on mount
  useEffect(() => {
    if (!hasRequestedPermission.current && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
      hasRequestedPermission.current = true;
    }
  }, []);

  // Show browser notification and toast when new notification arrives
  useEffect(() => {
    if (unreadCount !== undefined && unreadCount > previousCountRef.current) {
      // Get the latest notification
      const latestNotification = notifications?.[0];
      
      if (latestNotification && !latestNotification.isRead) {
        // Show toast notification
        toast.info(latestNotification.title, {
          description: latestNotification.message,
          duration: 5000,
        });

        // Show browser notification if permission granted
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(latestNotification.title, {
            body: latestNotification.message,
            icon: "/logo.png",
            badge: "/logo.png",
            tag: latestNotification._id,
          });
        }
      }
    }
    
    if (unreadCount !== undefined) {
      previousCountRef.current = unreadCount;
    }
  }, [unreadCount, notifications]);

  const handleNotificationClick = async (notificationId: Id<"notifications">) => {
    await markAsRead({ notificationId });
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    toast.success("All notifications marked as read");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-white hover:bg-white/10"
        >
          <Bell className="h-5 w-5" />
          {unreadCount !== undefined && unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 glass-card border-white/20 backdrop-blur-xl bg-white/10"
      >
        <div className="flex items-center justify-between p-2">
          <h3 className="font-semibold text-white">Notifications</h3>
          {unreadCount !== undefined && unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              className="text-xs text-white/80 hover:text-white hover:bg-white/10"
            >
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator className="bg-white/20" />
        <ScrollArea className="h-[400px]">
          {!notifications || notifications.length === 0 ? (
            <div className="p-4 text-center text-white/60 text-sm">
              No notifications yet
            </div>
          ) : (
            notifications.map((notif) => (
              <DropdownMenuItem
                key={notif._id}
                className={`p-3 cursor-pointer ${
                  !notif.isRead ? "bg-blue-500/10" : ""
                }`}
                onClick={() => handleNotificationClick(notif._id)}
              >
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-white text-sm">
                      {notif.title}
                    </p>
                    {!notif.isRead && (
                      <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-white/80 text-xs">{notif.message}</p>
                  {notif.sentAt && (
                    <p className="text-white/60 text-xs">
                      {new Date(notif.sentAt).toLocaleDateString()} at{" "}
                      {new Date(notif.sentAt).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
