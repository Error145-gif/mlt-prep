// @ts-nocheck
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export default function PaymentStatus() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failed" | "verifying">("verifying");
  const { user } = useAuth();
  const userProfile = useQuery(api.users.getUserProfile);
  
  const status = searchParams.get("status");
  const gateway = searchParams.get("gateway");
  const orderId = searchParams.get("order_id");
  const planName = searchParams.get("planName");
  
  const verifyCashfreePayment = useAction(api.cashfree.verifyPayment);

  const verifyPayment = async () => {
    if (gateway === "cashfree" && orderId) {
      setPaymentStatus("verifying");
      try {
        console.log("Verifying payment for order:", orderId);
        const result = await verifyCashfreePayment({
          orderId: orderId,
          userId: user?._id,
          planName: planName || "Subscription",
          amount: parseFloat(searchParams.get("amount") || "0"),
          duration: parseInt(searchParams.get("duration") || "30"),
        });
        
        if (result.success) {
          setPaymentStatus("success");
          toast.success("Payment verified successfully!");
        } else {
          setPaymentStatus("failed");
          toast.error(`Payment verification failed: ${result.status}`);
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setPaymentStatus("failed");
        toast.error("Could not verify payment. Please try again.");
      }
    } else if (status) {
      setPaymentStatus(status === "success" ? "success" : "failed");
    }
  };

  useEffect(() => {
    if (paymentStatus === "verifying") {
      verifyPayment();
    }
  }, [status, gateway, orderId]);

  useEffect(() => {
    if (paymentStatus === "success") {
      const timer = setTimeout(() => {
        navigate("/student");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus, navigate]);

  const isSuccess = paymentStatus === "success";
  const examName = userProfile?.examPreparation || "MLT Exam";

  const unlockedFeatures = [
    "Unlimited Mock Tests",
    "Full PYQ Practice",
    "Smart Analysis & Weak Topic Insights",
    "Rank & Leaderboard Access"
  ];

  return (
    <div className="min-h-screen p-6 lg:p-8 relative overflow-hidden flex items-center justify-center">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl w-full"
      >
        <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
          <CardHeader>
            <CardTitle className="text-white text-center text-3xl">
              {paymentStatus === "verifying" ? "Verifying Payment..." : isSuccess ? "Payment Successful 🎉" : "Payment Failed"}
            </CardTitle>
            {isSuccess && (
              <p className="text-white/90 text-center text-lg mt-2">Your Premium access is now active.</p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Verification State */}
            {paymentStatus === "verifying" && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-20 w-20 text-blue-400 animate-spin" />
                <p className="text-white/90">Please wait while we verify your payment...</p>
                <p className="text-white/70 text-sm">This may take a few moments</p>
              </div>
            )}

            {/* Success State */}
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* Lab Technician Illustration */}
                <div className="flex justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="relative"
                  >
                    <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                      <CheckCircle className="h-20 w-20 text-white" />
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-2 -right-2 text-4xl"
                    >
                      🔬
                    </motion.div>
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                      className="absolute -bottom-2 -left-2 text-4xl"
                    >
                      🧪
                    </motion.div>
                  </motion.div>
                </div>

                {/* Unlocked Features */}
                <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                  <h3 className="text-white font-semibold text-lg mb-4 text-center">What You've Unlocked:</h3>
                  <div className="space-y-3">
                    {unlockedFeatures.map((feature, index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-white/90 text-base">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Dynamic Exam Line */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-blue-400/30 text-center"
                >
                  <p className="text-white/90 text-lg">
                    Your preparation is now optimized for <span className="font-bold text-yellow-300">{examName}</span>
                  </p>
                </motion.div>

                {/* Primary CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="space-y-3"
                >
                  <Button
                    onClick={() => navigate("/student")}
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg py-6"
                  >
                    GO TO DASHBOARD →
                  </Button>
                  <p className="text-white/70 text-sm text-center">
                    Redirecting to dashboard in 4 seconds...
                  </p>
                </motion.div>
              </motion.div>
            )}

            {/* Failed State */}
            {paymentStatus === "failed" && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <XCircle className="h-20 w-20 text-red-400" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-white/90">Your payment could not be verified.</p>
                  <p className="text-white/70 text-sm">If money was deducted, it will be refunded automatically or contact support.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={verifyPayment}
                    className="w-full bg-white/20 hover:bg-white/30 text-white"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Check Status Again
                  </Button>
                  <Button
                    onClick={() => navigate("/student")}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    onClick={() => navigate("/subscription")}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}