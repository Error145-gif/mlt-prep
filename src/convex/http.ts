import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";
import { getRegisteredEmails } from "./emailApi";
import { internal } from "./_generated/api";

const http = httpRouter();

// Helper to verify Google ID Token
async function verifyGoogleToken(token: string) {
  try {
    console.log("[VERIFY] Starting Google token verification...");
    console.log("[VERIFY] Token length:", token?.length);
    console.log("[VERIFY] Token preview:", token?.substring(0, 50) + "...");
    
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    
    console.log("[VERIFY] Google API response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("[VERIFY] ❌ Google token verification FAILED");
      console.error("[VERIFY] Status:", response.status);
      console.error("[VERIFY] Error:", errorText);
      return null;
    }
    
    const userData = await response.json();
    console.log("[VERIFY] ✅ Token verified successfully");
    console.log("[VERIFY] User email:", userData.email);
    console.log("[VERIFY] User name:", userData.name);
    
    return userData;
  } catch (e) {
    console.error("[VERIFY] ❌ Exception during token verification:", e);
    return null;
  }
}

// Add auth routes FIRST - Let Convex Auth handle OAuth properly
auth.addHttpRoutes(http);

// Note: Convex Auth now handles /api/auth/callback/google internally
// The state parameter and session management is handled in src/convex/auth.ts callbacks

// Create a fallback session endpoint to prevent 404s on idle
http.route({
  path: "/api/session",
  method: "GET",
  handler: httpAction(async (_ctx, _request) => {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
      },
    });
  }),
});

// Handle POST requests for session as well
http.route({
  path: "/api/session",
  method: "POST",
  handler: httpAction(async (_ctx, _request) => {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }),
});

// Mobile Auth Callback Endpoint
http.route({
  path: "/auth/mobile-callback",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    console.log("=".repeat(60));
    console.log("[HTTP] 🚀 MOBILE AUTH CALLBACK TRIGGERED");
    console.log("=".repeat(60));
    
    const url = new URL(request.url);
    const mobileToken = url.searchParams.get("mobile_token");
    
    console.log("[HTTP] Full URL:", request.url);
    console.log("[HTTP] Has mobile_token param:", !!mobileToken);
    
    if (!mobileToken) {
      console.error("[HTTP] ❌ MISSING mobile_token parameter");
      return new Response(null, {
        status: 302,
        headers: {
          "Location": "/auth?authError=missing_token",
        },
      });
    }
    
    console.log("[HTTP] Token received, length:", mobileToken.length);
    
    // Verify Google Token
    console.log("[HTTP] 🔍 Starting Google token verification...");
    const googleUser = await verifyGoogleToken(mobileToken);
    
    if (!googleUser || !googleUser.email) {
      console.error("[HTTP] ❌ INVALID GOOGLE TOKEN");
      console.error("[HTTP] Google response:", JSON.stringify(googleUser, null, 2));
      return new Response(null, {
        status: 302,
        headers: {
          "Location": "/auth?authError=invalid_token",
        },
      });
    }
    
    console.log("[HTTP] ✅ Google user verified successfully");
    console.log("[HTTP] Email:", googleUser.email);
    console.log("[HTTP] Name:", googleUser.name);
    
    try {
      console.log("[HTTP] 💾 Creating/finding user and session...");
      
      // Find or Create User and Get Session ID
      const sessionId = await ctx.runMutation(internal.users.ensureUserFromMobile, {
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      });
      
      console.log("[HTTP] ✅ Session created successfully:", sessionId);
      
      // Redirect to Mobile Auth Callback page
      const dashboardUrl = `/mobile-auth-callback?session=${sessionId}`;
      
      console.log("[HTTP] ➡️ Redirecting to:", dashboardUrl);
      console.log("=".repeat(60));
      
      return new Response(null, {
        status: 302,
        headers: {
          "Location": dashboardUrl,
          "Set-Cookie": `convex_auth_token=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`,
        },
      });
    } catch (error) {
      console.error("[HTTP] ❌ ERROR creating session");
      console.error("[HTTP] Error details:", error);
      console.error("[HTTP] Error stack:", error instanceof Error ? error.stack : "No stack");
      return new Response(null, {
        status: 302,
        headers: {
          "Location": "/auth?authError=session_failed",
        },
      });
    }
  }),
});

// Register email API endpoint
http.route({
  path: "/api/emails/registered",
  method: "GET",
  handler: getRegisteredEmails,
});

export default http;