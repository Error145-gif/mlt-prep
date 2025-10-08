import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function PaymentStatus() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const verifyPayment = useAction(api.cashfree.verifyPayment);
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    const checkPayment = async () => {
      if (!orderId) {
        setStatus("failed");
        toast.error("Invalid payment session");
        return;
      }

      try {
        const result = await verifyPayment({ orderId });
        
        if (result.success && result.status === "SUCCESS") {
          setStatus("success");
          toast.success("Payment successful! Your subscription is now active.");
          setTimeout(() => navigate("/dashboard"), 3000);
        } else {
          setStatus("failed");
          toast.error("Payment verification failed");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("failed");
        toast.error("Failed to verify payment");
      }
    };

    checkPayment();
  }, [orderId, verifyPayment, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-purple-50">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        {status === "loading" && (
          <>
            <Loader2 className="h-16 w-16 text-blue-600 mx-auto animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </>
        )}
        
        {status === "success" && (
          <>
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
            <p className="text-gray-600">
              Your subscription has been activated. Redirecting to dashboard...
            </p>
          </>
        )}
        
        {status === "failed" && (
          <>
            <XCircle className="h-16 w-16 text-red-600 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Payment Failed</h2>
            <p className="text-gray-600">
              We couldn't verify your payment. Please try again or contact support.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate("/subscription")}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Try Again
              </Button>
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="flex-1"
              >
                Go to Dashboard
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}