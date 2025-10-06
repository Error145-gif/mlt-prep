import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Loader2, Mail, UserX } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

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

  useEffect(() => {
    if (!authLoading && isAuthenticated && user !== undefined) {
      if (user?.role === "admin") {
        navigate("/admin");
      } else {
        const redirect = redirectAfterAuth || "/dashboard";
        navigate(redirect);
      }
    }
  }, [authLoading, isAuthenticated, user, navigate, redirectAfterAuth]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      setStep({ email: formData.get("email") as string });
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
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("The verification code you entered is incorrect.");
      setIsLoading(false);
      setOtp("");
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
    } catch (error) {
      console.error("Guest login error:", error);
      setError(`Failed to sign in as guest: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative Purple Section */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white/30 rounded-full" />
        <div className="absolute top-20 right-20 w-2 h-2 bg-white rounded-full" />
        <div className="absolute top-40 right-32 w-2 h-2 bg-white rounded-full" />
        <div className="absolute top-60 right-44 w-2 h-2 bg-white rounded-full" />
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-white rounded-full" />
        <div className="absolute bottom-40 left-32 w-2 h-2 bg-white rounded-full" />
        
        {/* Wavy Lines */}
        <svg className="absolute top-0 left-0 w-48 h-full opacity-20" viewBox="0 0 100 500">
          <path d="M 20 0 Q 40 50 20 100 T 20 200 T 20 300 T 20 400 T 20 500" stroke="white" strokeWidth="2" fill="none" />
          <path d="M 40 0 Q 60 50 40 100 T 40 200 T 40 300 T 40 400 T 40 500" stroke="white" strokeWidth="2" fill="none" />
          <path d="M 60 0 Q 80 50 60 100 T 60 200 T 60 300 T 60 400 T 60 500" stroke="white" strokeWidth="2" fill="none" />
        </svg>

        {/* Bottom Right Wavy Pattern */}
        <svg className="absolute bottom-0 right-0 w-96 h-96 opacity-30" viewBox="0 0 400 400">
          <path d="M 0 200 Q 100 150 200 200 T 400 200 L 400 400 L 0 400 Z" fill="white" fillOpacity="0.1" />
          <path d="M 0 250 Q 100 200 200 250 T 400 250 L 400 400 L 0 400 Z" fill="white" fillOpacity="0.1" />
          <path d="M 50 300 Q 150 250 250 300 T 450 300" stroke="white" strokeWidth="2" fill="none" />
        </svg>

        {/* Plus Signs */}
        <div className="absolute top-16 left-1/2 text-white text-4xl opacity-40">+</div>
        <div className="absolute bottom-1/3 right-1/4 text-white text-4xl opacity-40">+</div>

        {/* Circle Outlines */}
        <div className="absolute bottom-1/4 left-1/4 w-16 h-16 border-2 border-white/30 rounded-full" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl font-bold mb-4"
          >
            Welcome back!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xl text-white/90"
          >
            You can sign in to access with your existing account.
          </motion.p>
        </div>
      </motion.div>

      {/* Right Side - Sign In Form */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-8"
      >
        <div className="w-full max-w-md">
          {step === "signIn" ? (
            <div className="space-y-8">
              {/* Logo for mobile */}
              <div className="lg:hidden flex justify-center mb-8">
                <img
                  src="./logo.svg"
                  alt="Logo"
                  width={64}
                  height={64}
                  className="rounded-lg cursor-pointer"
                  onClick={() => navigate("/")}
                />
              </div>

              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-2">sign In</h2>
                <p className="text-gray-500">Enter your credentials to access your account</p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      name="email"
                      placeholder="Username or email"
                      type="email"
                      className="pl-12 h-14 bg-white border-gray-200 rounded-full text-gray-800 placeholder:text-gray-400"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <label htmlFor="remember" className="text-gray-600 cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <button type="button" className="text-gray-600 hover:text-purple-600 transition-colors">
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-lg font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-gray-50 px-4 text-gray-500">Or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-14 border-gray-200 rounded-full text-gray-700 hover:bg-gray-100"
                  onClick={handleGuestLogin}
                  disabled={isLoading}
                >
                  <UserX className="mr-2 h-5 w-5" />
                  Continue as Guest
                </Button>

                <p className="text-center text-gray-600">
                  New here?{" "}
                  <button type="button" className="text-purple-600 hover:text-purple-700 font-semibold">
                    Create an Account
                  </button>
                </p>
              </form>
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-2">Check your email</h2>
                <p className="text-gray-500">We've sent a code to {step.email}</p>
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
                    <InputOTPGroup>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <InputOTPSlot key={index} index={index} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                <p className="text-sm text-gray-600 text-center">
                  Didn't receive a code?{" "}
                  <button
                    type="button"
                    className="text-purple-600 hover:text-purple-700 font-semibold"
                    onClick={() => setStep("signIn")}
                  >
                    Try again
                  </button>
                </p>

                <Button
                  type="submit"
                  className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-lg font-semibold"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify code
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep("signIn")}
                  disabled={isLoading}
                  className="w-full h-14 text-gray-700 hover:bg-gray-100 rounded-full"
                >
                  Use different email
                </Button>
              </form>
            </div>
          )}

          <div className="mt-8 text-center text-sm text-gray-500">
            Secured by{" "}
            <a
              href="https://vly.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              vly.ai
            </a>
          </div>
        </div>
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