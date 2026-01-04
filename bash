import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState, FormEvent, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { useAuth, useSignIn } from "@clerk/clerk-react";
import { isMobile } from "../hooks/use-mobile";
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

type Platform = 'web' | 'android' | 'ios' | 'electron';

const getPlatform = (): Platform => {
  if (Capacitor.isNativePlatform()) {
    if (Capacitor.getPlatform() === 'android') return 'android';
    if (Capacitor.getPlatform() === 'ios') return 'ios';
  }
  if (Capacitor.isElectron()) return 'electron';
  return 'web';
};

export default function Auth() {
  const { isSignedIn } = useAuth();
  const { signIn } = useSignIn();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState<"signIn" | "signUp" | "otp" | "forgotPassword" | "resetPassword">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [isOTPSending, setIsOTPSending] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [platform, setPlatform] = useState<Platform>('web');

  const sendSignInOtp = useMutation(api.authActions.sendSignInOtp);
  const verifySignInOtp = useMutation(api.authActions.verifySignInOtp);
  const signUpWithEmail = useMutation(api.authActions.signUpWithEmail);
  const loginWithEmail = useMutation(api.authActions.loginWithEmail);
  const sendPasswordResetOtp = useMutation(api.authActions.sendPasswordResetOtp);
  const verifyPasswordResetOtp = useMutation(api.authActions.verifyPasswordResetOtp);
  const resetPassword = useMutation(api.authActions.resetPassword);
  const checkEmailRegistered = useQuery(api.users.checkEmailRegistered, email ? { email } : "skip");

  useEffect(() => {
    if (isSignedIn) {
      navigate("/student");
    }
  }, [isSignedIn, navigate]);

  useEffect(() => {
    setIsMobileDevice(isMobile());
    setPlatform(getPlatform());

    if (getPlatform() === 'android' || getPlatform() === 'ios') {
      GoogleAuth.initialize({
        clientId: 'YOUR_ANDROID_OAUTH_CLIENT_ID.apps.googleusercontent.com', // Replace with your actual Android Client ID
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });
    }
  }, []);

  const handleNativeGoogleLogin = async () => {
    setIsLoading(true);
    try {
      if (platform === 'android' || platform === 'ios') {
        const result = await GoogleAuth.signIn();
        if (result && result.authentication && result.authentication.idToken) {
          // Send ID token to your backend for verification and session creation
          const siteUrl = process.env.VITE_APP_URL || "https://mltprep.online";
          const response = await fetch(\`${siteUrl}/auth/mobile-callback?mobile_token=\${result.authentication.idToken}\`);

          if (response.ok) {
            const redirectUrl = response.url;
            window.location.href = redirectUrl; // This should handle the session cookie and redirect
          } else {
            const errorData = await response.text();
            console.error("Backend mobile auth failed:", errorData);
            toast.error("Failed to sign in with Google (Backend error). Please try again.");
          }
        } else {
          toast.error("Google sign-in failed: No ID token received.");
        }
      } else {
        toast.error("Native Google login attempted on a non-native platform.");
      }
    } catch (error: any) {
      console.error("Native Google Sign-In error:", error);
      toast.error(\`Failed to sign in with Google: \${error.message || "Unknown error"}\`);
    } finally {
      setIsLoading(false);
    }
  };


  const handleGoogleSignIn = async () => {
    if (platform === 'android' || platform === 'ios') {
      handleNativeGoogleLogin();
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/student",
      });
      if (result.status === "complete") {
        navigate("/student");
      }
    } catch (error: any) {
      console.error("Google Sign-In error:", error);
      toast.error(\`Failed to sign in with Google: \${error.errors?.[0]?.longMessage || error.message || "Unknown error"}\`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (stage === "signIn") {
        const userCheck = await checkEmailRegistered;
        if (userCheck?.exists && !userCheck?.isRegistered) {
          toast.error("Please complete your registration first.");
          setIsLoading(false);
          return;
        }
        if (!userCheck?.exists) {
          toast.error("Account not registered. Please create an account first.");
          setIsLoading(false);
          return;
        }

        const result = await loginWithEmail({ email, password });
        if (result.success) {
          navigate("/student");
        } else {
          toast.error(result.message);
        }
      } else if (stage === "signUp") {
        if (!email.endsWith("@gmail.com")) {
          toast.error("Only Gmail accounts are allowed for sign up.");
          setIsLoading(false);
          return;
        }

        const userCheck = await checkEmailRegistered;
        if (userCheck?.exists) {
          toast.error("Account already exists. Please sign in.");
          setIsLoading(false);
          return;
        }

        const result = await signUpWithEmail({ email, password, name: email.split('@')[0] });
        if (result.success) {
          toast.success("Account created successfully. Please sign in.");
          setStage("signIn");
        } else {
          toast.error(result.message);
        }
      }
    } catch (error: any) {
      console.error("Email auth error:", error);
      toast.error(\`Authentication failed: \${error.message || "Unknown error"}\`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setIsOTPSending(true);
    try {
      const result = await sendSignInOtp({ email });
      if (result.success) {
        toast.success("OTP sent to your email.");
        setStage("otp");
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error("Send OTP error:", error);
      toast.error(\`Failed to send OTP: \${error.message || "Unknown error"}\`);
    } finally {
      setIsOTPSending(false);
    }
  };

  const handleVerifyOtp = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const result = await verifySignInOtp({ email, otp });
      if (result.success) {
        toast.success("OTP verified. You are now signed in.");
        navigate("/student");
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      toast.error(\`Failed to verify OTP: \${error.message || "Unknown error"}\`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPasswordResetOtp = async () => {
    setIsOTPSending(true);
    try {
      const result = await sendPasswordResetOtp({ email });
      if (result.success) {
        toast.success("Password reset OTP sent to your email.");
        setStage("otp"); // Reuse OTP stage for password reset
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error("Send password reset OTP error:", error);
      toast.error(\`Failed to send password reset OTP: \${error.message || "Unknown error"}\`);
    } finally {
      setIsOTPSending(false);
    }
  };

  const handleVerifyPasswordResetOtp = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const result = await verifyPasswordResetOtp({ email, otp });
      if (result.success && result.resetToken) {
        setResetToken(result.resetToken);
        setStage("resetPassword");
        toast.success("OTP verified. Please set your new password.");
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error("Verify password reset OTP error:", error);
      toast.error(\`Failed to verify OTP: \${error.message || "Unknown error"}\`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirm password do not match.");
      setIsLoading(false);
      return;
    }
    try {
      const result = await resetPassword({ email, token: resetToken, newPassword });
      if (result.success) {
        toast.success("Password reset successfully. Please sign in.");
        setStage("signIn");
        setNewPassword("");
        setConfirmNewPassword("");
        setResetToken("");
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(\`Failed to reset password: \${error.message || "Unknown error"}\`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center space-y-4 mb-6">
          <img src="/logo.png" alt="MLT Prep" className="h-16 w-16" />
          <h1 className="text-3xl font-bold text-gray-800">MLT Prep</h1>
          <p className="text-gray-600 text-center">
            {stage === "signIn" && "Sign in to your account"}
            {stage === "signUp" && "Create your account"}
            {stage === "otp" && "Verify OTP"}
            {stage === "forgotPassword" && "Forgot Password?"}
            {stage === "resetPassword" && "Reset Password"}
          </p>
        </div>

        {stage !== "otp" && stage !== "resetPassword" && (
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading || isOTPSending}
            />
            {(stage === "signIn" || stage === "signUp") && (
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading || isOTPSending}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-1 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading || isOTPSending}>
              {isLoading ? "Loading..." : stage === "signIn" ? "Sign In" : "Sign Up"}
            </Button>
          </form>
        )}

        {stage === "otp" && (
          <form onSubmit={stage === "otp" && resetToken ? handleVerifyPasswordResetOtp : handleVerifyOtp} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              disabled={isLoading}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
            <Button
              variant="link"
              className="w-full"
              onClick={stage === "otp" && resetToken ? handleSendPasswordResetOtp : handleSendOtp}
              disabled={isOTPSending || isLoading}
            >
              {isOTPSending ? "Sending..." : "Resend OTP"}
            </Button>
          </form>
        )}

        {stage === "resetPassword" && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-1 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </div>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-1 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </Button>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        )}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleGoogleSignIn}
          disabled={isLoading || isOTPSending}
        >
          <img src="/google-icon.svg" alt="Google" className="h-5 w-5" />
          {isLoading && (platform === 'android' || platform === 'ios') ? "Signing in with Google..." : "Google"}
        </Button>

        <div className="mt-6 text-center text-sm">
          {stage === "signIn" && (
            <>
              Don't have an account?{" "}
              <Link to="#" onClick={() => setStage("signUp")} className="text-emerald-600 hover:underline">
                Sign up
              </Link>
            </>
          )}
          {stage === "signUp" && (
            <>
              Already have an account?{" "}
              <Link to="#" onClick={() => setStage("signIn")} className="text-emerald-600 hover:underline">
                Sign in
              </Link>
            </>
          )}
          {(stage === "signIn" || stage === "otp" || stage === "forgotPassword") && (
            <div className="mt-2">
              <Link to="#" onClick={() => { setStage("forgotPassword"); setOtp(""); }} className="text-emerald-600 hover:underline">
                Forgot Password?
              </Link>
            </div>
          )}
          {stage === "otp" && resetToken && (
            <div className="mt-2">
              <Link to="#" onClick={() => { setStage("forgotPassword"); setOtp(""); setResetToken(""); }} className="text-emerald-600 hover:underline">
                Go back to Forgot Password
              </Link>
            </div>
          )}
          {stage === "resetPassword" && (
            <div className="mt-2">
              <Link to="#" onClick={() => { setStage("signIn"); setOtp(""); setResetToken(""); }} className="text-emerald-600 hover:underline">
                Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}