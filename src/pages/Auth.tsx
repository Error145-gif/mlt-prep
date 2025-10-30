import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Loader2, Mail, Microscope, TestTube, Dna } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface AuthProps {
  redirectAfterAuth?: string;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, user, signIn } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const autoCompleteRegistration = useMutation(api.authHelpers.autoCompleteRegistration);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user !== undefined && user !== null) {
      // Auto-complete registration for new Gmail users
      if (isCreatingAccount && user.email?.endsWith("@gmail.com")) {
        autoCompleteRegistration().catch(console.error);
      }
      
      if (user?.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        const redirect = redirectAfterAuth || "/student";
        navigate(redirect, { replace: true });
      }
    }
  }, [authLoading, isAuthenticated, user, navigate, redirectAfterAuth, isCreatingAccount, autoCompleteRegistration]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      const email = (formData.get("email") as string).toLowerCase().trim();

      // Validate Gmail only
      if (!email.endsWith("@gmail.com")) {
        setError("Only Gmail accounts are allowed. Please use a Gmail address.");
        setIsLoading(false);
        return;
      }

      await signIn("email-otp", formData);
      setStep({ email });
      setIsLoading(false);
    } catch (error) {
      console.error("Email sign-in error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send verification code. Please try again.",
      );
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      
      // If creating account, mark as registered
      if (isCreatingAccount) {
        // The completeRegistration will be called after successful auth redirect
        // This is handled by the auth system automatically
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("The verification code you entered is incorrect.");
      setIsLoading(false);
      setOtp("");
    }
  };

  // Guest login disabled for Gmail-only authentication
  // const handleGuestLogin = async () => {
  //   setIsLoading(true);
  //   setError(null);
  //   try {
  //     await signIn("anonymous");
  //   } catch (error) {
  //     console.error("Guest login error:", error);
  //     setError(`Failed to sign in as guest: ${error instanceof Error ? error.message : 'Unknown error'}`);
  //     setIsLoading(false);
  //   }
  // };

  const handleCreateAccount = () => {
    setIsCreatingAccount(true);
  };

  const handleBackToSignIn = () => {
    setIsCreatingAccount(false);
    setError(null);
  };

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
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating DNA Strands */}
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
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
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
            transition={{ delay: 0.4, duration: 0.6 }}
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
          transition={{ delay: 0.3, duration: 0.6 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl"
          style={{
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 0 60px rgba(124, 58, 237, 0.3)',
          }}
        >
          {step === "signIn" ? (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {isCreatingAccount ? "Create Account" : "Welcome Back"}
                </h2>
                <p className="text-white text-sm">
                  {isCreatingAccount 
                    ? "Start your medical learning journey" 
                    : "Sign in to continue your learning"}
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-5">
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

                {!isCreatingAccount && (
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
                      {isCreatingAccount ? "Creating..." : "Signing In..."}
                    </>
                  ) : (
                    isCreatingAccount ? "Create Account" : "Login"
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-transparent px-2 text-white">
                      {isCreatingAccount ? "Already have an account?" : "New to MLT Prep?"}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={isCreatingAccount ? handleBackToSignIn : handleCreateAccount}
                  variant="outline"
                  className="w-full h-12 bg-transparent border-2 border-white/30 hover:bg-white/10 hover:border-white/50 text-white rounded-2xl text-base font-semibold transition-all"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {isCreatingAccount ? "Sign In Instead" : "Create New Account"}
                </Button>
              </form>
            </div>
          ) : (
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
                    onClick={() => setStep("signIn")}
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
                  Use different email
                </Button>
              </form>
            </div>
          )}
        </motion.div>

        {/* Footer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
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
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}