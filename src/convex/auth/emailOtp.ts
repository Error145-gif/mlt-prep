import { Email } from "@convex-dev/auth/providers/Email";
import { alphabet, generateRandomString } from "oslo/crypto";

export const emailOtp = Email({
  id: "email-otp",
  maxAge: 60 * 15, // 15 minutes
  generateVerificationToken() {
    return generateRandomString(6, alphabet("0-9"));
  },
  async sendVerificationRequest({ identifier: email, token }) {
    try {
      const response = await fetch(
        "https://email.vly.ai/send_otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.VLY_EMAIL_API_KEY || "vlytothemoon2025",
          },
          body: JSON.stringify({
            to: email,
            otp: token,
            appName: process.env.VLY_APP_NAME || "MLT Prep",
          }),
        },
      );
      
      if (!response.ok || response.status !== 200) {
        throw new Error(`Email service returned status ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to send OTP email:", error);
      throw new Error(`Failed to send OTP: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});