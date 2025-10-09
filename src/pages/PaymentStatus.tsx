import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Tag, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

export default function PaymentStatus() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const status = searchParams.get("status");
  const planName = searchParams.get("plan");
  const amount = searchParams.get("amount");
  const coupon = searchParams.get("coupon");
  const transactionId = searchParams.get("transactionId");

  const isSuccess = status === "success";

  useEffect(() => {
    // Redirect to dashboard after 5 seconds on success
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  return (
    <div className="min-h-screen p-6 lg:p-8 relative overflow-hidden flex items-center justify-center">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 max-w-2xl w-full"
      >
        <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="flex justify-center mb-4"
            >
              {isSuccess ? (
                <div className="p-4 bg-green-500/20 rounded-full">
                  <CheckCircle className="h-16 w-16 text-green-400" />
                </div>
              ) : (
                <div className="p-4 bg-red-500/20 rounded-full">
                  <XCircle className="h-16 w-16 text-red-400" />
                </div>
              )}
            </motion.div>
            <CardTitle className="text-3xl text-white">
              {isSuccess ? "Payment Successful!" : "Payment Failed"}
            </CardTitle>
            <p className="text-white/70 mt-2">
              {isSuccess 
                ? "Your subscription has been activated successfully" 
                : "There was an issue processing your payment"}
            </p>
          </CardHeader>
          
          {isSuccess && (
            <CardContent className="space-y-6">
              <div className="space-y-4 bg-white/5 p-6 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Subscription Plan</span>
                  <span className="text-white font-semibold">{planName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Amount Paid</span>
                  <span className="text-white font-semibold">₹{amount}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Coupon Applied
                    </span>
                    <span className="text-green-400 font-semibold">{coupon}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-white/70 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Transaction ID
                  </span>
                  <span className="text-white font-mono text-sm">{transactionId}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Go to Dashboard
                </Button>
                <p className="text-xs text-white/50 text-center">
                  Redirecting to dashboard in 5 seconds...
                </p>
              </div>
            </CardContent>
          )}

          {!isSuccess && (
            <CardContent className="space-y-4">
              <p className="text-white/70 text-center">
                Please try again or contact support if the issue persists.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate("/subscription")}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => navigate("/contact")}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Contact Support
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>
    </div>
  );
}