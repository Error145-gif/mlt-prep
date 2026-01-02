authSessions: defineTable({
  userId: v.id("users"),
  expirationTime: v.number(),
}).index("expirationTime", ["expirationTime"]).index("userId", ["userId"]),

const sessionId = await ctx.db.insert("authSessions", {
  userId,
  expirationTime: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
});