import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get all notifications
export const getAllNotifications = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const notifications = await ctx.db.query("notifications").order("desc").collect();

    // Enrich with sender info
    const enrichedNotifications = await Promise.all(
      notifications.map(async (notif) => {
        const sender = await ctx.db.get(notif.sentBy);
        return {
          ...notif,
          senderName: sender?.name || "Unknown",
        };
      })
    );

    return enrichedNotifications;
  },
});

// Create notification
export const createNotification = mutation({
  args: {
    title: v.string(),
    message: v.string(),
    type: v.string(),
    targetUsers: v.optional(v.array(v.id("users"))),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await ctx.db.insert("notifications", {
      ...args,
      sentBy: user._id,
      status: "draft",
    });
  },
});

// Send notification
export const sendNotification = mutation({
  args: {
    id: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      status: "sent",
      sentAt: Date.now(),
    });

    return args.id;
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
