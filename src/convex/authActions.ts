import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const processGoogleAuthCallback = internalAction({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args): Promise<string> => {
    const clientId = process.env.AUTH_GOOGLE_ID;
    const clientSecret = process.env.AUTH_GOOGLE_SECRET;
    const redirectUri = `${process.env.CONVEX_SITE_URL}/api/auth/callback/google`;

    if (!clientId || !clientSecret) {
      throw new Error("Missing Google Auth credentials");
    }

    // 1. Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: args.code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error("Google Token Exchange Failed:", error);
      throw new Error("Failed to exchange code for token");
    }

    const tokens = await tokenResponse.json();
    
    // 2. Get User Info
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user info");
    }

    const userInfo = await userResponse.json();

    // 3. Create Session via Mutation
    const sessionId = await ctx.runMutation(internal.auth.completeGoogleLogin, {
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      sub: userInfo.sub,
    });

    return sessionId;
  },
});