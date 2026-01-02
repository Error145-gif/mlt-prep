import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";
import { getRegisteredEmails } from "./emailApi";
import { internal } from "./_generated/api";

const http = httpRouter();

// Custom Google Callback Handler
http.route({
  path: "/api/auth/callback/google",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code) {
      return new Response("Missing code", { status: 400 });
    }

    // Construct the redirect URI based on the actual request URL to avoid mismatches
    const redirectUri = `${url.origin}/api/auth/callback/google`;

    try {
      // Process auth and get session ID
      const sessionId = await ctx.runAction(internal.authActions.processGoogleAuthCallback, {
        code,
        redirectUri,
      });

      if (state === "app") {
        // Android App Redirect (Deep Link)
        return new Response(null, {
          status: 302,
          headers: {
            Location: `mltprep://auth/google?token=${sessionId}`,
          },
        });
      } else {
        // Web Redirect (Cookie)
        // Note: If the callback happened on convex.site, this cookie will be set for convex.site.
        // If the user is redirected to mltprep.online, they might not be logged in there unless
        // the callback also happened on mltprep.online.
        return new Response(null, {
          status: 302,
          headers: {
            "Set-Cookie": `CONVEX_AUTH_SESSION_ID=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`,
            Location: "https://mltprep.online/dashboard",
          },
        });
      }
    } catch (error) {
      console.error("Google Auth Error:", error);
      return new Response(`Authentication failed: ${error instanceof Error ? error.message : "Unknown error"}`, { status: 500 });
    }
  }),
});

// Add auth routes - this includes the default Google OAuth callback
// Note: Our custom route above takes precedence for /api/auth/callback/google
auth.addHttpRoutes(http);

// Note: The state parameter handling is now done in src/convex/auth.ts
// through the Convex Auth callbacks system, which properly handles
// session creation and state-based redirects.

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

// Register email API endpoint
http.route({
  path: "/api/emails/registered",
  method: "GET",
  handler: getRegisteredEmails,
});

export default http;