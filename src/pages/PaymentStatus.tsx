// @ts-nocheck
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function PaymentStatus() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failed" | "verifying">("verifying");
  
  const verifyCashfreePayment = useAction(api.cashfree.verifyPayment);
  
  const gateway = searchParams.get("gateway");
  const orderId = searchParams.get("order_id");
  const status = searchParams.get("status");

  useEffect(() => {
    const verifyPayment = async () => {
      // Handle Razorpay redirect (simple status check)
      if (status && !gateway) {
        setPaymentStatus(status === "success" ? "success" : "failed");
        return;
      }

      // Handle Cashfree redirect
      if (gateway === "cashfree" && orderId) {
        setIsVerifying(true);
        try {
          // Verify payment with Cashfree
          const result = await verifyCashfreePayment({
            orderId: orderId,
            userId: "", // Will be fetched from context in backend
            planName: "", // Will be fetched from order in backend
            amount: 0, // Will be fetched from order in backend
            duration: 0, // Will be fetched from order in backend
          });

          if (result.success && result.status === "PAID") {
            setPaymentStatus("success");
            toast.success("Payment successful! Your subscription is now active.");
          } else {
            setPaymentStatus("failed");
            toast.error("Payment verification failed. Please contact support.");
          }
        } catch (error: any) {
          console.error("Payment verification error:", error);
          setPaymentStatus("failed");
          toast.error(error.message || "Payment verification failed");
        } finally {
          setIsVerifying(false);
        }
      }
    };

    verifyPayment();
  }, [gateway, orderId, status, verifyCashfreePayment]);

  useEffect(() => {
    if (paymentStatus !== "verifying") {
      const timer = setTimeout(() => {
        navigate("/student");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus, navigate]);

  const isSuccess = paymentStatus === "success";

  return (
    <div className="min-h-screen p-6 lg:p-8 relative overflow-hidden flex items-center justify-center">
      {/* Hamburger Menu Button - Mobile Only */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-6 right-6 z-50 md:hidden bg-white/20 backdrop-blur-sm p-2 rounded-lg hover:bg-white/30 transition-all"
      >
        {isMenuOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Menu className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 h-screen w-64 bg-gradient-to-br from-blue-600 to-purple-700 z-40 md:hidden shadow-2xl p-6 space-y-4"
          >
            <div className="mt-12 space-y-3">
              <button
                onClick={() => {
                  navigate("/student");
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all"
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => {
                  navigate("/tests/mock");
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all"
              >
                🧩 Mock Tests
              </button>
              <button
                onClick={() => {
                  navigate("/tests/pyq");
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all"
              >
                📚 PYQ Sets
              </button>
              <button
                onClick={() => {
                  navigate("/tests/ai");
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all"
              >
                🤖 AI Questions
              </button>
              <button
                onClick={() => {
                  navigate("/profile");
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all"
              >
                👤 Profile
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-md w-full"
      >
        <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
          <CardHeader>
            <CardTitle className="text-white text-center text-2xl">
              {isVerifying ? "Verifying Payment..." : isSuccess ? "Payment Successful!" : "Payment Failed"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              {isVerifying ? (
                <Loader2 className="h-20 w-20 text-blue-400 animate-spin" />
              ) : isSuccess ? (
                <CheckCircle className="h-20 w-20 text-green-400" />
              ) : (
                <XCircle className="h-20 w-20 text-red-400" />
              )}
            </div>

            <div className="text-center space-y-2">
              {isVerifying ? (
                <>
                  <p className="text-white/90">Please wait while we verify your payment...</p>
                  <p className="text-white/70 text-sm">This may take a few moments</p>
                </>
              ) : isSuccess ? (
                <>
                  <p className="text-white/90">Your subscription has been activated successfully!</p>
                  <p className="text-white/70 text-sm">Redirecting to dashboard in 5 seconds...</p>
                </>
              ) : (
                <>
                  <p className="text-white/90">Your payment could not be processed.</p>
                  <p className="text-white/70 text-sm">Please try again or contact support.</p>
                </>
              )}
            </div>

            {!isVerifying && (
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => navigate("/student")}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Go to Dashboard
                </Button>
                {!isSuccess && (
                  <Button
                    onClick={() => navigate("/subscription")}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    Try Again
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}