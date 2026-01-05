import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Helper to verify Google ID Token
async function verifyGoogleToken(token: string) {
  try {
    console.log("[VERIFY] Starting Google token verification...");
    
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("[VERIFY] ❌ Google token verification FAILED:", errorText);
      return null;
    }
    
    const userData = await response.json();
    console.log("[VERIFY] ✅ Token verified successfully for:", userData.email);
    return userData;
  } catch (e) {
    console.error("[VERIFY] ❌ Exception during token verification:", e);
    return null;
  }
}

export const verifyAndSignInGoogle = action({
  args: {
    idToken: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("[ACTION] 🚀 verifyAndSignInGoogle called");
    
    // 1. Verify Token
    const googleUser = await verifyGoogleToken(args.idToken);
    
    if (!googleUser || !googleUser.email) {
      throw new Error("Invalid Google Token");
    }

    // 2. Create/Find User and Get Session
    // We use the internal mutation we already have
    // Explicitly cast to string to avoid TS inference issues
    const sessionId = (await ctx.runMutation(internal.users.ensureUserFromMobile, {
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
    })) as string;

    console.log("[ACTION] ✅ Session created:", sessionId);

    return {
      sessionId,
      userId: googleUser.sub as string,
    };
  },
});