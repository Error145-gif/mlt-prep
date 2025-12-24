"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";

export const sendTestEmail = action({
  args: { email: v.string() },
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is missing");
      return { success: false, error: "RESEND_API_KEY is missing" };
    }
    
    console.log(`Attempting to send test email to ${args.email} with key length: ${apiKey.length}`);

    try {
      // Try with the configured sender first
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: "MLT Prep <no-reply@mltprep.online>",
          to: args.email,
          subject: "MLT Prep Email Test",
          html: "<p>This is a test email to verify your Resend configuration.</p>",
        }),
      });

      const data = await response.json();
      console.log("Resend response:", JSON.stringify(data));
      
      if (!response.ok) {
        return { success: false, error: data.message || data.name || "Unknown error", details: data };
      }

      return { success: true, id: data.id };
    } catch (e) {
      console.error("Fetch error:", e);
      return { success: false, error: String(e) };
    }
  },
});