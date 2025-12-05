import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

// Create a fallback session endpoint to prevent 404s on idle
http.route({
  path: "/api/session",
  method: "GET",
  handler: httpAction(async (_ctx, _request) => {
    return new Response(JSON.stringify({ status: "ok" }), {
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
    return new Response(JSON.stringify({ status: "ok" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }),
});

export default http;