// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Loader2, Mail, Microscope, TestTube, Dna, Lock, KeyRound } from "lucide-react";
import { Suspense, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

interface AuthProps {
  redirectAfterAuth?: string;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, user, signIn } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [step, setStep] = useState<"signIn" | "signUp" | "forgotPassword" | { email: string, mode: "otp" } | { email: string, code: string, mode: "setPassword" }>("signIn");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const autoCompleteRegistration = useMutation(api.authHelpers.autoCompleteRegistration);

  // Optimized redirect logic - only run once when auth state changes
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      // Auto-complete registration for ALL users (handles welcome email logic internally)
      // This ensures welcome email is sent for Google signups too
      autoCompleteRegistration().catch(console.error);
      
      // Immediate redirect without waiting
      const redirect = user?.role === "admin" ? "/admin" : (redirectAfterAuth || "/student");
      navigate(redirect, { replace: true });
    }
  }, [authLoading, isAuthenticated, user?.role, user?._id]); // Minimal dependencies

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("google");
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("Failed to sign in with Google. Please try again.");
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData(event.currentTarget);
      
      // Ensure flow parameter is set correctly for Password provider
      if (step === "signUp") {
        formData.set("flow", "signUp");
      } else {
        formData.set("flow", "signIn");
      }
      
      await signIn("password", formData);
      
      // For sign-up, complete registration after successful auth
      if (step === "signUp") {
        await autoCompleteRegistration().catch(console.error);
      }
      
      // Redirect handled by useEffect
    } catch (error) {
      console.error("Password sign-in error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      if (errorMessage.includes("InvalidAccountId")) {
        setError("Account not found. Please sign up first.");
      } else if (errorMessage.includes("Invalid password")) {
        setError("Invalid password. Please check your credentials.");
      } else {
        setError(
          error instanceof Error
            ? error.message
            : "Invalid email or password. Please try again."
        );
      }
      setIsLoading(false);
    }
  };

  const handleOtpRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData(event.currentTarget);
      const email = (formData.get("email") as string).toLowerCase().trim();
      
      // Use the password provider's reset flow to generate a token compatible with reset-verification
      formData.set("flow", "reset");
      await signIn("password", formData);
      
      setStep({ email, mode: "otp" });
    } catch (error) {
      console.error("OTP request error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      if (errorMessage.includes("InvalidAccountId")) {
        setError("No password set for this email. Please sign in with Google or create a new account.");
      } else {
        setError(
          error instanceof Error 
            ? error.message 
            : "Failed to send verification code. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email") as string;
      const code = formData.get("code") as string;
      
      // Move to password setting step instead of signing in directly
      setStep({ email, code, mode: "setPassword" });
      setIsLoading(false);
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("The verification code you entered is incorrect.");
      setOtp("");
      setIsLoading(false);
    }
  }, []);

  const handlePasswordReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData(event.currentTarget);
      const password = formData.get("password") as string;
      
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      formData.set("flow", "reset-verification");
      
      await signIn("password", formData);
      toast.success("Password set successfully! You can now login.");
      setStep("signIn");
    } catch (error) {
      console.error("Password reset error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      if (errorMessage.includes("Invalid password") || errorMessage.includes("validateDefaultPasswordRequirements")) {
        setError("Password must be at least 8 characters long.");
      } else {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to set password. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show minimal loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5B21B6] via-[#7C3AED] to-[#A855F7]">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  // Don't render if already authenticated (prevents flash)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#5B21B6] via-[#7C3AED] to-[#A855F7] flex items-center justify-center p-4">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: 'url(https://harmless-tapir-303.convex.cloud/api/storage/8fad9960-4961-4061-bdf4-2ba74032189d)',
          backgroundBlendMode: 'overlay'
        }}
      />
      
      {/* Animated Background Elements - Simplified for performance */}
      <div className="absolute inset-0 overflow-hidden">
        {!isMobile && (
          <>
            <motion.div
              animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 left-10 opacity-20"
            >
              <Dna className="w-24 h-24 text-white" />
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-32 right-16 opacity-20"
            >
              <Microscope className="w-32 h-32 text-white" />
            </motion.div>

            <motion.div
              animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/3 right-20 opacity-20"
            >
              <TestTube className="w-20 h-20 text-white" />
            </motion.div>
          </>
        )}

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
      </div>

      {/* Home Button */}
      <Button
        onClick={() => navigate("/")}
        variant="ghost"
        className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        Home
      </Button>

      {/* Main Content Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex justify-center mb-4"
          >
            <img
              src="https://harmless-tapir-303.convex.cloud/api/storage/6068c740-5624-49d7-8c20-c6c805df135b"
              alt="MLT Logo"
              className="w-32 h-32 object-contain drop-shadow-2xl"
              onError={(e) => { e.currentTarget.src = "/logo_bg.png"; }}
            />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-white text-sm font-light tracking-wide"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            AI-Powered Learning for Future Medical Lab Professionals
          </motion.p>
        </div>

        {/* Glassmorphism Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl"
          style={{
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 0 60px rgba(124, 58, 237, 0.3)',
          }}
        >
          {typeof step === "object" && step.mode === "setPassword" ? (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Set Your Password
                </h2>
                <p className="text-white text-sm">Create a new password for {step.email}</p>
              </div>

              <form onSubmit={handlePasswordReset} className="space-y-6">
                <input type="hidden" name="email" value={step.email} />
                <input type="hidden" name="code" value={step.code} />

                <div className="space-y-4">
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60 group-focus-within:text-white transition-colors" />
                    <Input
                      name="password"
                      placeholder="Enter new password"
                      type="password"
                      className="pl-12 h-12 bg-white/10 border-white/30 rounded-2xl text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/50 transition-all shadow-inner"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      disabled={isLoading}
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                  </div>
                  <p className="text-xs text-white/70 pl-1">
                    Password must be at least 8 characters long
                  </p>
                </div>

                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-300 bg-red-500/20 p-3 rounded-xl border border-red-400/30 text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] text-white rounded-2xl text-base font-semibold transition-all duration-300 border-0"
                  disabled={isLoading}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Setting Password...
                    </>
                  ) : (
                    <>
                      Set Password
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("signIn")}
                  disabled={isLoading}
                  className="w-full h-12 bg-transparent border-2 border-white/30 hover:bg-white/10 hover:border-white/50 text-white rounded-2xl transition-all"
                >
                  Back to Login
                </Button>
              </form>
            </div>
          ) : typeof step === "object" && step.mode === "otp" ? (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Check your email
                </h2>
                <p className="text-white text-sm">We've sent a code to {step.email}</p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <input type="hidden" name="email" value={step.email} />
                <input type="hidden" name="code" value={otp} />

                <div className="flex justify-center">
                  <InputOTP
                    value={otp}
                    onChange={setOtp}
                    maxLength={6}
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && otp.length === 6 && !isLoading) {
                        const form = (e.target as HTMLElement).closest("form");
                        if (form) {
                          form.requestSubmit();
                        }
                      }
                    }}
                  >
                    <InputOTPGroup className="gap-2">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <InputOTPSlot 
                          key={index} 
                          index={index}
                          className="bg-white/10 border-2 border-white/30 text-white text-xl font-semibold w-12 h-12 rounded-xl shadow-inner"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-300 bg-red-500/20 p-3 rounded-xl border border-red-400/30 text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <p className="text-sm text-white text-center">
                  Didn't receive a code?{" "}
                  <button
                    type="button"
                    className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors"
                    onClick={() => setStep("forgotPassword")}
                  >
                    Try again
                  </button>
                </p>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] text-white rounded-2xl text-base font-semibold transition-all duration-300 border-0"
                  disabled={isLoading || otp.length !== 6}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Code
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("signIn")}
                  disabled={isLoading}
                  className="w-full h-12 bg-transparent border-2 border-white/30 hover:bg-white/10 hover:border-white/50 text-white rounded-2xl transition-all"
                >
                  Back to Login
                </Button>
              </form>
            </div>
          ) : step === "forgotPassword" ? (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Reset Password
                </h2>
                <p className="text-white text-sm">
                  Enter your email to receive a verification code
                </p>
              </div>

              <form onSubmit={handleOtpRequest} className="space-y-5">
                <div className="space-y-4">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60 group-focus-within:text-white transition-colors" />
                    <Input
                      name="email"
                      placeholder="Enter your email"
                      type="email"
                      className="pl-12 h-12 bg-white/10 border-white/30 rounded-2xl text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/50 transition-all shadow-inner"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-300 bg-red-500/20 p-3 rounded-xl border border-red-400/30"
                  >
                    {error}
                  </motion.p>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] text-white rounded-2xl text-base font-semibold transition-all duration-300 border-0"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    "Send Code"
                  )}
                </Button>

                <Button
                  type="button"
                  onClick={() => setStep("signIn")}
                  variant="ghost"
                  className="w-full text-white hover:bg-white/10"
                >
                  Back to Login
                </Button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {step === "signUp" ? "Create Account" : "Welcome Back"}
                </h2>
                <p className="text-white text-sm">
                  {step === "signUp"
                    ? "Start your medical learning journey" 
                    : "Sign in to continue your learning"}
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full h-12 bg-white text-gray-900 hover:bg-gray-100 rounded-2xl text-base font-semibold transition-all flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  {step === "signUp" ? "Sign up with Google" : "Continue with Google"}
                </Button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-white/20 w-full"></div>
                  <span className="bg-transparent px-3 text-white/60 text-xs uppercase">Or</span>
                  <div className="border-t border-white/20 w-full"></div>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                  <div className="space-y-4">
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60 group-focus-within:text-white transition-colors" />
                      <Input
                        name="email"
                        placeholder="Enter your email"
                        type="email"
                        className="pl-12 h-12 bg-white/10 border-white/30 rounded-2xl text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/50 transition-all shadow-inner"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60 group-focus-within:text-white transition-colors" />
                      <Input
                        name="password"
                        placeholder="Password"
                        type="password"
                        className="pl-12 h-12 bg-white/10 border-white/30 rounded-2xl text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/50 transition-all shadow-inner"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                        disabled={isLoading}
                        required
                        minLength={8}
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-300 bg-red-500/20 p-3 rounded-xl border border-red-400/30"
                    >
                      {error}
                    </motion.p>
                  )}

                  {step === "signIn" && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="remember" 
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                          className="border-white/30 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#7C3AED] data-[state=checked]:to-[#22D3EE]"
                        />
                        <label htmlFor="remember" className="text-white cursor-pointer">
                          Remember me
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep("forgotPassword")}
                        className="text-cyan-300 hover:text-cyan-200 text-xs font-medium transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] text-white rounded-2xl text-base font-semibold transition-all duration-300 border-0"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {step === "signUp" ? "Creating Account..." : "Signing In..."}
                      </>
                    ) : (
                      step === "signUp" ? "Create Account" : "Login"
                    )}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-transparent px-2 text-white">
                        {step === "signUp" ? "Already have an account?" : "New to MLT Prep?"}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={() => {
                      setStep(step === "signUp" ? "signIn" : "signUp");
                      setError(null);
                    }}
                    variant="outline"
                    className="w-full h-12 bg-transparent border-2 border-white/30 hover:bg-white/10 hover:border-white/50 text-white rounded-2xl text-base font-semibold transition-all"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {step === "signUp" ? "Sign In Instead" : "Create New Account"}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </motion.div>

        {/* Footer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-center text-white text-xs mt-6"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          © 2024 MLT Prep. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5B21B6] via-[#7C3AED] to-[#A855F7]">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    }>
      <Auth {...props} />
    </Suspense>
  );
}