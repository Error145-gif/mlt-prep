// @ts-nocheck
import { v } from "convex/values";
import { mutation, query, action, internalQuery, internalMutation, internalAction } from "./_generated/server";
import { getCurrentUser } from "./users";
import { internal } from "./_generated/api";

// Get all notifications
export const getAllNotifications = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const notifications = await ctx.db.query("notifications").order("desc").collect();

    // Enrich with sender info and recipient count
    const enrichedNotifications = await Promise.all(
      notifications.map(async (notif) => {
        const sender = await ctx.db.get(notif.sentBy);
        let recipientCount = 0;
        
        if (notif.targetUsers && notif.targetUsers.length > 0) {
          recipientCount = notif.targetUsers.length;
        } else if (notif.status === "sent") {
          // If sent to all users, count all users
          const allUsers = await ctx.db.query("users").collect();
          recipientCount = allUsers.length;
        }
        
        return {
          ...notif,
          senderName: sender?.name || "Unknown",
          recipientCount,
        };
      })
    );

    return enrichedNotifications;
  },
});

// Get all users for targeting
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const users = await ctx.db.query("users").collect();
    return users.map(u => ({
      _id: u._id,
      name: u.name || "Unknown",
      email: u.email,
    }));
  },
});

// Create notification
export const createNotification = mutation({
  args: {
    title: v.string(),
    message: v.string(),
    type: v.string(),
    targetUsers: v.optional(v.array(v.id("users"))),
    sendToAll: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await ctx.db.insert("notifications", {
      title: args.title,
      message: args.message,
      type: args.type,
      targetUsers: args.sendToAll ? undefined : args.targetUsers,
      sentBy: user._id,
      status: "sent",
      sentAt: Date.now(),
    });
  },
});

// Send notification (now with email support)
export const sendNotification = action({
  args: {
    id: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    console.log("Sending notification with ID:", args.id);
    
    // Get the notification
    const notification = await ctx.runQuery(internal.notifications.getNotificationById, {
      id: args.id,
    });

    if (!notification) {
      console.error("Notification not found:", args.id);
      throw new Error("Notification not found");
    }

    console.log("Notification found:", notification.title, "Status:", notification.status);

    // Get target users
    let targetUsers;
    if (notification.targetUsers && notification.targetUsers.length > 0) {
      targetUsers = await ctx.runQuery(internal.notifications.getUsersByIds, {
        userIds: notification.targetUsers,
      });
      console.log(`Sending to ${targetUsers.length} specific users`);
    } else {
      // Send to all users
      targetUsers = await ctx.runQuery(internal.notifications.getAllUsersInternal, {});
      console.log(`Sending to all ${targetUsers.length} users`);
    }

    // Send emails if type includes email
    if (notification.type === "email" || notification.type === "both") {
      for (const user of targetUsers) {
        if (user.email) {
          try {
            await ctx.runAction(internal.notifications.sendNotificationEmail, {
              email: user.email,
              name: user.name || "User",
              title: notification.title,
              message: notification.message,
            });
          } catch (error) {
            console.error(`Failed to send email to ${user.email}:`, error);
          }
        }
      }
    }

    // Update notification status
    await ctx.runMutation(internal.notifications.updateNotificationStatus, {
      id: args.id,
    });

    console.log("Notification status updated to 'sent'");

    return args.id;
  },
});

// Internal query to get notification by ID
export const getNotificationById = internalQuery({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Internal query to get users by IDs
export const getUsersByIds = internalQuery({
  args: { userIds: v.array(v.id("users")) },
  handler: async (ctx, args) => {
    const users = await Promise.all(
      args.userIds.map(id => ctx.db.get(id))
    );
    return users.filter(u => u !== null);
  },
});

// Internal query to get all users
export const getAllUsersInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// Internal mutation to update notification status
export const updateNotificationStatus = internalMutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "sent",
      sentAt: Date.now(),
    });
  },
});

// Internal action to send email
export const sendNotificationEmail = internalAction({
  args: {
    email: v.string(),
    name: v.string(),
    title: v.string(),
    message: v.string(),
  },
  handler: async (_ctx, args) => {
    // This would integrate with Resend API
    // For now, just log it
    console.log(`Sending notification email to ${args.email}:`, {
      title: args.title,
      message: args.message,
    });
    
    // TODO: Integrate with Resend when ready
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'MLT Prep <notifications@mltprep.com>',
    //   to: args.email,
    //   subject: args.title,
    //   html: `<p>Hi ${args.name},</p><p>${args.message}</p>`,
    // });
  },
});

// Delete notification
export const deleteNotification = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Get user's notifications (for students)
export const getUserNotifications = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return []; // Return empty array instead of throwing error
    }

    // Get all sent notifications
    const allNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_status", (q) => q.eq("status", "sent"))
      .order("desc")
      .take(50);

    // Filter notifications for this user
    const userNotifications = allNotifications.filter((notif) => {
      // If targetUsers is undefined or empty, it's for all users
      if (!notif.targetUsers || notif.targetUsers.length === 0) {
        return true;
      }
      // Check if user is in targetUsers
      return notif.targetUsers.includes(user._id);
    });

    // Get read status for each notification
    const notificationsWithStatus = await Promise.all(
      userNotifications.map(async (notif) => {
        const readStatus = await ctx.db
          .query("userNotificationStatus")
          .withIndex("by_user_and_notification", (q) =>
            q.eq("userId", user._id).eq("notificationId", notif._id)
          )
          .first();

        return {
          ...notif,
          isRead: readStatus?.isRead || false,
          readAt: readStatus?.readAt,
        };
      })
    );

    return notificationsWithStatus;
  },
});

// Get unread notification count
export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return 0;
    }

    // Get all sent notifications
    const allNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_status", (q) => q.eq("status", "sent"))
      .collect();

    // Filter notifications for this user
    const userNotifications = allNotifications.filter((notif) => {
      if (!notif.targetUsers || notif.targetUsers.length === 0) {
        return true;
      }
      return notif.targetUsers.includes(user._id);
    });

    // Count unread
    let unreadCount = 0;
    for (const notif of userNotifications) {
      const readStatus = await ctx.db
        .query("userNotificationStatus")
        .withIndex("by_user_and_notification", (q) =>
          q.eq("userId", user._id).eq("notificationId", notif._id)
        )
        .first();

      if (!readStatus || !readStatus.isRead) {
        unreadCount++;
      }
    }

    return unreadCount;
  },
});

// Mark notification as read
export const markAsRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Check if status already exists
    const existing = await ctx.db
      .query("userNotificationStatus")
      .withIndex("by_user_and_notification", (q) =>
        q.eq("userId", user._id).eq("notificationId", args.notificationId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        isRead: true,
        readAt: Date.now(),
      });
    } else {
      await ctx.db.insert("userNotificationStatus", {
        userId: user._id,
        notificationId: args.notificationId,
        isRead: true,
        readAt: Date.now(),
      });
    }

    return args.notificationId;
  },
});

// Mark all notifications as read
export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Get all sent notifications for this user
    const allNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_status", (q) => q.eq("status", "sent"))
      .collect();

    const userNotifications = allNotifications.filter((notif) => {
      if (!notif.targetUsers || notif.targetUsers.length === 0) {
        return true;
      }
      return notif.targetUsers.includes(user._id);
    });

    // Mark each as read
    for (const notif of userNotifications) {
      const existing = await ctx.db
        .query("userNotificationStatus")
        .withIndex("by_user_and_notification", (q) =>
          q.eq("userId", user._id).eq("notificationId", notif._id)
        )
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          isRead: true,
          readAt: Date.now(),
        });
      } else {
        await ctx.db.insert("userNotificationStatus", {
          userId: user._id,
          notificationId: notif._id,
          isRead: true,
          readAt: Date.now(),
        });
      }
    }

    return true;
  },
});