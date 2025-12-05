// @ts-nocheck
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export default function PaymentStatus() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failed" | "verifying">("verifying");
  const { user } = useAuth();
  
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
          userId: user?._id, // Optional now, backend will use order's customer_id
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
    // Only auto-verify if we haven't verified yet
    if (paymentStatus === "verifying") {
      verifyPayment();
    }
  }, [status, gateway, orderId]); // Removed user dependency to allow verification without immediate auth sync

  useEffect(() => {
    if (paymentStatus === "success") {
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
              {paymentStatus === "verifying" ? "Verifying Payment..." : isSuccess ? "Payment Successful!" : "Payment Failed"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              {paymentStatus === "verifying" ? (
                <Loader2 className="h-20 w-20 text-blue-400 animate-spin" />
              ) : isSuccess ? (
                <CheckCircle className="h-20 w-20 text-green-400" />
              ) : (
                <XCircle className="h-20 w-20 text-red-400" />
              )}
            </div>

            <div className="text-center space-y-2">
              {paymentStatus === "verifying" ? (
                <>
                  <p className="text-white/90">Please wait while we verify your payment...</p>
                  <p className="text-white/70 text-sm">This may take a few moments</p>
                </>
              ) : isSuccess ? (
                <>
                  <p className="text-white/90 font-medium text-lg">Your subscription is now active!</p>
                  <p className="text-white/80">Plan: {planName}</p>
                  <p className="text-white/70 text-sm mt-4">Redirecting to dashboard in 5 seconds...</p>
                </>
              ) : (
                <>
                  <p className="text-white/90">Your payment could not be verified.</p>
                  <p className="text-white/70 text-sm">If money was deducted, it will be refunded automatically or contact support.</p>
                </>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {paymentStatus === "failed" && (
                <Button
                  onClick={verifyPayment}
                  className="w-full bg-white/20 hover:bg-white/30 text-white"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Check Status Again
                </Button>
              )}
              
              <Button
                onClick={() => navigate("/student")}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Go to Dashboard
              </Button>
              
              {!isSuccess && paymentStatus !== "verifying" && (
                <Button
                  onClick={() => navigate("/subscription")}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Try Again
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}