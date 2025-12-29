import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

// Secure API endpoint to fetch registered user emails for email automation
export const getRegisteredEmails = httpAction(async (ctx, request) => {
  // Verify API key for security
  const authHeader = request.headers.get("Authorization");
  const apiKey = process.env.EMAIL_API_KEY;

  if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
    return new Response(
      JSON.stringify({ error: "Unauthorized - Invalid API key" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Fetch all registered users with verified emails
    const users = await ctx.runQuery(api.emailApi.getVerifiedUserEmails);

    return new Response(
      JSON.stringify({
        success: true,
        count: users.length,
        users: users,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching user emails:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});