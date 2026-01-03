// THIS FILE IS READ ONLY. Do not touch this file unless you are correctly adding a new auth provider in accordance to the vly auth documentation

import { convexAuth } from "@convex-dev/auth/server";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { Password } from "@convex-dev/auth/providers/Password";
import Google from "@auth/core/providers/google";
import { Email } from "@convex-dev/auth/providers/Email";
import { alphabet, generateRandomString } from "oslo/crypto";
import { internal } from "./_generated/api";

const convexSiteUrl = "https://successful-bandicoot-650.convex.site";
// SITE_URL is your frontend domain (e.g., https://mltprep.online).
// This is where users are redirected after login.
const appSiteUrl = (process.env.SITE_URL || convexSiteUrl).replace(/\/$/, "");

const emailOtp = Email({
  id: "email-otp",
  maxAge: 60 * 10, // 10 minutes
  generateVerificationToken() {
    return generateRandomString(6, alphabet("0-9"));
  },
  async sendVerificationRequest({ identifier: email, token }) {
    if (!email || typeof email !== "string") {
      throw new Error("Email is required for verification");
    }

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
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }), 
    Password({ 
      reset: emailOtp,
      profile(params) {
        return {
          email: params.email as string,
          name: (params.email as string)?.split('@')[0],
        };
      },
      validatePasswordRequirements: (password: string) => {
        if (!password || password.length < 6) {
          return {
            passwordValid: false,
            errorMessage: "Password must be at least 6 characters long",
          };
        }
        return { passwordValid: true };
      },
    }), 
    emailOtp, 
    Anonymous
  ],
  callbacks: {
    async redirect({ redirectTo }) {
      // Respect the redirectTo parameter from the sign-in call
      // This allows Auth.tsx to control where users go after authentication
      console.log("[AUTH] Redirect requested to:", redirectTo);

      const normalizedPath =
        !redirectTo || redirectTo === "/"
          ? "/auth?authError=google_failed"
          : redirectTo;

      const finalUrl = `${appSiteUrl}${normalizedPath}`;

      console.log("[AUTH] Final redirect URL:", finalUrl);
      return finalUrl;
    },
    async createOrUpdateUser(ctx, args) {
      console.log("=".repeat(60));
      console.log("🔥 AUTH CALLBACK FIRED 🔥");
      console.log("=".repeat(60));
      console.log("[AUTH] createOrUpdateUser triggered");
      console.log("[AUTH] Profile email:", args.profile.email);
      console.log("[AUTH] Provider:", args.provider);
      console.log("[AUTH] Existing user ID:", args.existingUserId);
      
      let userId: any = null;

      // 1. Check if user already exists (linked via authAccounts)
      if (args.existingUserId) {
        console.log("[AUTH] User already exists (linked):", args.existingUserId);
        userId = args.existingUserId;
        
        // Update last active time
        await ctx.db.patch(userId, {
          lastActive: Date.now(),
        });
      }
      // 2. Check if user exists by email (Account Linking Prevention)
      else if (args.profile.email) {
        const userByEmail = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("email"), args.profile.email as string))
          .first();

        if (userByEmail) {
          console.log("[AUTH] User found by email, linking:", userByEmail._id);
          userId = userByEmail._id;
          
          // Update last active time
          await ctx.db.patch(userId, {
            lastActive: Date.now(),
          });
        } else {
          // 3. Create NEW user (only happens on first signup)
          console.log("[AUTH] Creating NEW user for:", args.profile.email);
          
          userId = await ctx.db.insert("users", {
            email: args.profile.email as string | undefined,
            name: (args.profile.name as string) || "User",
            image: args.profile.picture as string | undefined,
            role: "user",
            welcomeEmailSent: false,
            isRegistered: true, 
            registrationCompleted: true,
            lastActive: Date.now(),
          });
          
          console.log("[AUTH] New user created:", userId);
        }
      }

      // 4. SEND WELCOME EMAIL ONLY FOR NEW USERS
      if (userId && args.profile.email && !args.existingUserId) {
        const user = await ctx.db.get(userId);
        console.log("[AUTH] 🔍 NEW USER DETECTED - Checking welcome email status...");
        console.log("[AUTH] User welcomeEmailSent flag:", user?.welcomeEmailSent);
        
        if (user && user.welcomeEmailSent !== true) {
          console.log("=".repeat(60));
          console.log("📧 WELCOME EMAIL TRIGGER ACTIVATED (NEW USER) 📧");
          console.log("=".repeat(60));
          console.log("[AUTH] Scheduling welcome email for NEW user:", args.profile.email);
          
          try {
            await ctx.scheduler.runAfter(0, internal.emails.sendWelcomeEmail, {
              email: args.profile.email as string,
              name: (args.profile.name as string) || user.name || "User",
              userId: userId,
            });
            console.log("[AUTH] ✅ Welcome email scheduled successfully for new user");
          } catch (err) {
            console.error("[AUTH] ❌ Failed to schedule welcome email:", err);
          }
        } else {
          console.log("[AUTH] Welcome email already sent for this new user. Skipping.");
        }
      } else if (args.existingUserId) {
        console.log("[AUTH] Existing user login detected - skipping welcome email");
      }

      console.log("----------- AUTH CALLBACK END -----------");
      return userId;
    },
  },
});

// completeGoogleLogin is no longer needed - Convex Auth handles this via createOrUpdateUser callback