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
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #7C3AED;">Welcome to MLT Prep 🎉</h2>
              <p>Hi ${args.name},</p>
              <p>Welcome to MLT Prep 👋 Your account has been successfully created.</p>
              
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="color: white; margin: 0;">🎁 Special Welcome Offer</h3>
                <p style="color: white; margin: 10px 0;">Get access to our Monthly Plan for just <strong>₹1</strong></p>
                <p style="color: white; margin: 10px 0;">Use coupon code: <strong style="font-size: 24px; letter-spacing: 2px;">WELCOME1</strong></p>
              </div>
              
              <p>Or click below to access your dashboard (coupon auto-applied):</p>
              <a href="${dashboardLink}?coupon=WELCOME1" style="display: inline-block; background-color: #7C3AED; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 0;">
                Go to Dashboard
              </a>
              
              <p style="color: #666; font-size: 14px; margin-top: 20px;">This offer is valid for new users only.</p>
              
              <br>
              <p>Happy learning,<br><strong>Team MLT Prep</strong></p>
            </div>
          `,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Resend API error:", errorData);
        throw new Error(`Failed to send welcome email: ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      console.log("Welcome email sent successfully:", result);

      // Mark welcome email as sent
      const { internal } = await import("./_generated/api");
      await ctx.runMutation(internal.authHelpers.markWelcomeEmailSent, {
        userId: args.userId,
      });

      return { success: true, emailId: result.id };
    } catch (error) {
      console.error("Error sending welcome email:", error);
      throw error;
    }
  },
});