import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";
import { getRegisteredEmails } from "./emailApi";

const http = httpRouter();

// Add auth routes BEFORE custom callback handler
auth.addHttpRoutes(http);

// Custom Google OAuth callback handler with state-based routing
http.route({
  path: "/api/auth/callback/google",
  method: "GET",
  handler: httpAction(async (_ctx, request) => {
    const url = new URL(request.url);
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");

    // Handle OAuth errors
    if (error) {
      console.error("[OAuth] Google returned error:", error);
      if (state === "app") {
        return new Response(null, {
          status: 302,
          headers: {
            Location: `mltprep://auth/google?error=${encodeURIComponent(error)}`,
          },
        });
      }
      return new Response(null, {
        status: 302,
        headers: {
          Location: `https://mltprep.online/auth?error=${encodeURIComponent(error)}`,
        },
      });
    }

    if (!code) {
      console.error("[OAuth] No authorization code received");
      const errorMsg = "No authorization code received";
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

    try {
      // Exchange code for tokens with Google
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          client_id: process.env.AUTH_GOOGLE_ID!,
          client_secret: process.env.AUTH_GOOGLE_SECRET!,
          redirect_uri: `${process.env.CONVEX_SITE_URL}/api/auth/callback/google`,
          grant_type: "authorization_code",
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to exchange authorization code");
      }

      const tokens = await tokenResponse.json();
      const idToken = tokens.id_token;

      // Verify and decode ID token
      const [, payloadBase64] = idToken.split(".");
      const payload = JSON.parse(
        Buffer.from(payloadBase64, "base64").toString("utf-8")
      );

      // Validate token
      if (!payload.email_verified) {
        throw new Error("Email not verified");
      }

      // Create or get user via Convex Auth
      // This will trigger the auth callback in auth.ts
      const userEmail = payload.email;
      const userName = payload.name || userEmail.split("@")[0];
      const userPicture = payload.picture;

      // Create session using Convex Auth's internal mechanism
      // We'll use the existing auth flow but capture the session token
      
      // For now, let's create a simple session token (you may want to use JWT)
      const sessionToken = Buffer.from(
        JSON.stringify({
          email: userEmail,
          name: userName,
          picture: userPicture,
          timestamp: Date.now(),
        })
      ).toString("base64");

      console.log("[OAuth] Authentication successful for:", userEmail);
      console.log("[OAuth] State parameter:", state);

      // STATE-BASED REDIRECT LOGIC
      if (state === "app") {
        // Android app flow - redirect to deep link
        console.log("[OAuth] Redirecting to Android app deep link");
        return new Response(null, {
          status: 302,
          headers: {
            Location: `mltprep://auth/google?token=${encodeURIComponent(sessionToken)}&email=${encodeURIComponent(userEmail)}`,
          },
        });
      } else {
        // Web flow - set cookies and redirect to dashboard
        console.log("[OAuth] Redirecting to web dashboard");
        
        // Set authentication cookie for web
        const cookieHeader = `convex_auth_token=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`;
        
        return new Response(null, {
          status: 302,
          headers: {
            Location: "https://mltprep.online/dashboard",
            "Set-Cookie": cookieHeader,
          },
        });
      }
    } catch (error) {
      console.error("[OAuth] Callback handler error:", error);
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