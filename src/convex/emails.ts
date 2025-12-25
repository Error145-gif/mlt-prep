"use node";
import { internalAction } from "./_generated/server";
import { v } from "convex/values";

export const sendWelcomeEmail = internalAction({
  args: {
    email: v.string(),
    name: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    console.log(`[WELCOME EMAIL] Starting send process for: ${args.email}`);
    console.log(`[WELCOME EMAIL] User ID: ${args.userId}, Name: ${args.name}`);
    
    if (!process.env.RESEND_API_KEY) {
      console.error("[WELCOME EMAIL] RESEND_API_KEY is missing in environment variables");
      return { success: false, error: "Missing API Key" };
    }
    
    console.log("[WELCOME EMAIL] API Key found, proceeding with email send...");

    try {
      const dashboardLink = "https://mltprep.online/student";
      
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "MLT Prep <no-reply@mltprep.online>",
          to: args.email,
          subject: "Welcome to MLT Prep 🎉 Your ₹1 Plan is Ready",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
              <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #7C3AED; margin-bottom: 20px;">Welcome to MLT Prep 🎉</h2>
                <p style="font-size: 16px; color: #333;">Hi ${args.name},</p>
                <p style="font-size: 16px; color: #333;">Welcome to MLT Prep 👋 Your account has been successfully created.</p>
                
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 10px; margin: 25px 0; text-align: center;">
                  <h3 style="color: white; margin: 0 0 15px 0; font-size: 22px;">🎁 Special Welcome Offer</h3>
                  <p style="color: white; margin: 10px 0; font-size: 18px;">Get access to our Monthly Plan for just <strong style="font-size: 28px;">₹1</strong></p>
                  <p style="color: white; margin: 15px 0; font-size: 16px;">Use coupon code:</p>
                  <div style="background-color: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; display: inline-block;">
                    <strong style="color: white; font-size: 32px; letter-spacing: 4px; font-family: monospace;">WELCOME1</strong>
                  </div>
                </div>
                
                <p style="font-size: 16px; color: #333; text-align: center; margin: 20px 0;">Or click below to access your dashboard:</p>
                <div style="text-align: center; margin: 25px 0;">
                  <a href="${dashboardLink}?coupon=WELCOME1" style="display: inline-block; background-color: #7C3AED; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(124, 58, 237, 0.3);">
                    👉 Go to Dashboard
                  </a>
                </div>
                
                <p style="color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">This welcome offer is available for new users only.</p>
                
                <p style="font-size: 16px; color: #333; margin-top: 30px;">Happy learning,<br><strong>Team MLT Prep</strong></p>
              </div>
            </div>
          `,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("[WELCOME EMAIL] Resend API error:", JSON.stringify(errorData));
        throw new Error(`Failed to send welcome email: ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      console.log("[WELCOME EMAIL] ✅ Email sent successfully! Email ID:", result.id);

      // Mark welcome email as sent
      const { internal } = await import("./_generated/api");
      await ctx.runMutation(internal.authHelpers.markWelcomeEmailSent, {
        userId: args.userId,
      });

      return { success: true, emailId: result.id };
    } catch (error) {
      console.error("[WELCOME EMAIL] ❌ Error sending email:", error);
      return { success: false, error: String(error) };
    }
  },
});