import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";
import { getRegisteredEmails } from "./emailApi";

const http = httpRouter();

// Add auth routes - this includes the default Google OAuth callback
auth.addHttpRoutes(http);

// Override the Google OAuth callback to add state-based routing
http.route({
  path: "/api/auth/callback/google",
  method: "GET",
  handler: httpAction(async (_ctx, request) => {
    const url = new URL(request.url);
    const state = url.searchParams.get("state");
    
    console.log("[OAuth Callback] State parameter:", state);
    console.log("[OAuth Callback] Full URL:", request.url);

    // First, let Convex Auth handle the OAuth callback normally
    // This will create/update the user and establish the session
    try {
      // Forward the request to Convex Auth's default handler
      // by calling the auth system's callback processing
      const authResponse = await fetch(request.url, {
        method: "GET",
        headers: request.headers,
      });

      // Get the session token from the auth response cookies
      const cookies = authResponse.headers.get("set-cookie");
      let sessionToken = "";
      
      if (cookies) {
        const tokenMatch = cookies.match(/convexAuth=([^;]+)/);
        if (tokenMatch) {
          sessionToken = tokenMatch[1];
        }
      }

      console.log("[OAuth Callback] Session established:", !!sessionToken);

      // STATE-BASED REDIRECT LOGIC
      if (state === "app") {
        // Android app flow - redirect to deep link with session token
        console.log("[OAuth Callback] Redirecting to Android app deep link");
        
        return new Response(null, {
          status: 302,
          headers: {
            Location: `mltprep://auth/google?token=${encodeURIComponent(sessionToken)}`,
            // Don't set cookies for app flow
          },
        });
      } else {
        // Web flow (state === "web" or missing) - redirect to dashboard with cookies
        console.log("[OAuth Callback] Redirecting to web dashboard");
        
        return new Response(null, {
          status: 302,
          headers: {
            Location: "https://mltprep.online/dashboard",
            "Set-Cookie": cookies || "",
          },
        });
      }
    } catch (error) {
      console.error("[OAuth Callback] Error:", error);
      const errorMsg = error instanceof Error ? error.message : "Authentication failed";
      
      if (state === "app") {
        return new Response(null, {
          status: 302,
          headers: {
            Location: `mltprep://auth/google?error=${encodeURIComponent(errorMsg)}`,
          },
        });
      }
      
      return new Response(null, {
        status: 302,
        headers: {
          Location: `https://mltprep.online/auth?error=${encodeURIComponent(errorMsg)}`,
        },
      });
    }
  }),
});

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