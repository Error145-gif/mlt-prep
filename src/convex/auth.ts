// THIS FILE IS READ ONLY. Do not touch this file unless you are correctly adding a new auth provider in accordance to the vly auth documentation

import { convexAuth } from "@convex-dev/auth/server";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { Password } from "@convex-dev/auth/providers/Password";
import Google from "@auth/core/providers/google";
import { Email } from "@convex-dev/auth/providers/Email";
import { alphabet, generateRandomString } from "oslo/crypto";

const emailOtp = Email({
  id: "email-otp",
  maxAge: 60 * 10, // 10 minutes
  generateVerificationToken() {
    return generateRandomString(6, alphabet("0-9"));
  },
  async sendVerificationRequest({ identifier: email, token }) {
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is missing");
      throw new Error("Server configuration error: RESEND_API_KEY is missing. Please check your environment variables.");
    }

    try {
      const response = await fetch(
        "https://api.resend.com/emails",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "MLT Prep <no-reply@mltprep.online>",
            to: email,
            subject: "Reset your MLT Prep password",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Reset your MLT Prep password</h2>
                <p>Hi there,</p>
                <p>We received a request to reset your MLT Prep account password.</p>
                <p>Your One-Time Password (OTP) is:</p>
                <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
                  ${token}
                </div>
                <p><strong>This OTP is valid for 10 minutes.</strong></p>
                <p style="color: #dc2626; font-weight: 600;">⚠️ Do not share this OTP with anyone.</p>
                <p>If you did not request this, you can safely ignore this email.</p>
                <br>
                <p>Team MLT Prep</p>
              </div>
            `,
          }),
        },
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Resend API error response:", errorData);
        // Throw a more descriptive error
        throw new Error(`Email provider error: ${errorData.message || JSON.stringify(errorData)}`);
      }
      
      // Log success
      console.log("OTP Email sent successfully to:", email);

    } catch (error) {
      console.error("Failed to send OTP email via Resend:", error);
      // Ensure the error message is propagated
      throw new Error(error instanceof Error ? error.message : "Failed to send OTP email");
    }
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google, Password({ reset: emailOtp }), emailOtp, Anonymous],
});