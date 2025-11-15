"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { Resend } from "resend";

// Action to send invoice email
export const sendInvoiceEmail = action({
  args: {
    userId: v.id("users"),
    invoiceNumber: v.string(),
    userName: v.string(),
    userEmail: v.string(),
    planName: v.string(),
    amount: v.number(),
    duration: v.number(),
    transactionId: v.string(),
    issuedDate: v.number(),
  },
  handler: async (ctx, args) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Format date
    const date = new Date(args.issuedDate).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Create HTML email template
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - MLT Prep</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">MLT Prep</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Payment Invoice</p>
            </td>
          </tr>
          
          <!-- Invoice Details -->
          <tr>
            <td style="padding: 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Invoice Number</p>
                    <p style="margin: 0 0 20px 0; color: #333; font-size: 18px; font-weight: bold;">${args.invoiceNumber}</p>
                  </td>
                  <td align="right">
                    <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Date</p>
                    <p style="margin: 0 0 20px 0; color: #333; font-size: 16px;">${date}</p>
                  </td>
                </tr>
              </table>
              
              <div style="border-top: 2px solid #f0f0f0; margin: 20px 0;"></div>
              
              <!-- Customer Details -->
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Bill To:</h3>
              <p style="margin: 0 0 5px 0; color: #333; font-size: 16px; font-weight: bold;">${args.userName}</p>
              <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">${args.userEmail}</p>
              
              <div style="border-top: 2px solid #f0f0f0; margin: 20px 0;"></div>
              
              <!-- Subscription Details -->
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Subscription Details:</h3>
              <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f9f9f9; border-radius: 6px;">
                <tr>
                  <td style="color: #666; font-size: 14px; border-bottom: 1px solid #e0e0e0;">Plan Name</td>
                  <td align="right" style="color: #333; font-size: 14px; font-weight: bold; border-bottom: 1px solid #e0e0e0;">${args.planName}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 14px; border-bottom: 1px solid #e0e0e0;">Duration</td>
                  <td align="right" style="color: #333; font-size: 14px; border-bottom: 1px solid #e0e0e0;">${args.duration} days</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 14px; border-bottom: 1px solid #e0e0e0;">Transaction ID</td>
                  <td align="right" style="color: #333; font-size: 14px; border-bottom: 1px solid #e0e0e0;">${args.transactionId}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 16px; font-weight: bold; padding-top: 15px;">Total Amount Paid</td>
                  <td align="right" style="color: #667eea; font-size: 20px; font-weight: bold; padding-top: 15px;">₹${args.amount.toFixed(2)}</td>
                </tr>
              </table>
              
              <div style="border-top: 2px solid #f0f0f0; margin: 30px 0 20px 0;"></div>
              
              <!-- Thank You Message -->
              <div style="background-color: #f0f4ff; padding: 20px; border-radius: 6px; border-left: 4px solid #667eea;">
                <h3 style="color: #667eea; margin: 0 0 10px 0; font-size: 18px;">Thank You for Your Subscription! 🎉</h3>
                <p style="color: #555; margin: 0; font-size: 14px; line-height: 1.6;">
                  We're excited to have you on board! Your subscription is now active, and you have full access to all our premium features and content.
                </p>
              </div>
              
              <!-- Support Information -->
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <p style="color: #666; font-size: 13px; margin: 0 0 5px 0;">Need help? Contact our support team:</p>
                <p style="color: #667eea; font-size: 14px; margin: 0;">support@mltprep.com</p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                This is an automated invoice from MLT Prep.<br>
                Please keep this for your records.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    try {
      const { data, error } = await resend.emails.send({
        from: "MLT Prep <onboarding@resend.dev>",
        to: [args.userEmail],
        subject: `Invoice ${args.invoiceNumber} - MLT Prep Subscription`,
        html: htmlContent,
      });

      if (error) {
        console.error("Failed to send invoice email:", error);
        return { success: false, error: error.message };
      }

      return { success: true, messageId: data?.id };
    } catch (error: any) {
      console.error("Exception sending invoice email:", error);
      return { success: false, error: error.message };
    }
  },
});