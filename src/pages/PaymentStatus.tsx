import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function PaymentStatus() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const status = searchParams.get("status");
  const isSuccess = status === "success";

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen p-6 lg:p-8 relative overflow-hidden flex items-center justify-center">
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
              <div className={`p-4 ${isSuccess ? 'bg-green-500/20' : 'bg-red-500/20'} rounded-full`}>
                {isSuccess ? (
                  <CheckCircle className="h-16 w-16 text-green-400" />
                ) : (
                  <XCircle className="h-16 w-16 text-red-400" />
                )}
              </div>
            </motion.div>
            <CardTitle className="text-3xl text-white">
              {isSuccess ? "Payment Successful!" : "Payment Failed"}
            </CardTitle>
            <p className="text-white/70 mt-2">
              {isSuccess 
                ? "Your subscription has been activated successfully. An invoice has been sent to your email."
                : "There was an issue processing your payment. Please try again or contact support."}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/dashboard")}
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
            <p className="text-xs text-white/50 text-center">
              Redirecting to dashboard in 5 seconds...
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}