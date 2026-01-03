import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";
import { getRegisteredEmails } from "./emailApi";
import { internal } from "./_generated/api";

const http = httpRouter();

// Helper to verify Google ID Token
async function verifyGoogleToken(token: string) {
  try {
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    if (!response.ok) {
      console.error("Google token verification failed:", await response.text());
      return null;
    }
    return await response.json();
  } catch (e) {
    console.error("Error verifying Google token:", e);
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
    const url = new URL(request.url);
    const mobileToken = url.searchParams.get("mobile_token");
    
    if (!mobileToken) {
      return new Response("Missing mobile_token", { status: 400 });
    }
    
    // Verify Google Token
    const googleUser = await verifyGoogleToken(mobileToken);
    if (!googleUser || !googleUser.email) {
      return new Response("Invalid Google Token", { status: 401 });
    }
    
    // Find or Create User and Get Session ID
    const sessionId = await ctx.runMutation(internal.users.ensureUserFromMobile, {
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
    });
    
    // Redirect to Student Dashboard with Session Cookie
    const siteUrl = process.env.SITE_URL || "https://mltprep.online";
    const dashboardUrl = `${siteUrl}/student`;
    
    return new Response(null, {
      status: 302,
      headers: {
        "Location": dashboardUrl,
        "Set-Cookie": `CONVEX_AUTH_TOKEN=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`,
      },
    });
  }),
});

// Register email API endpoint
http.route({
  path: "/api/emails/registered",
  method: "GET",
  handler: getRegisteredEmails,
});

export default http;