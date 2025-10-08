import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function PaymentStatus() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  
  const verifyPayment = useAction(api.cashfree.verifyPayment);
  
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    if (!orderId) {
      navigate("/dashboard");
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        const result = await verifyPayment({ orderId });
        
        if (result.success && result.status === "PAID") {
          setStatus("success");
          setPaymentDetails(result);
        } else {
          setStatus("failed");
          setPaymentDetails(result);
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setStatus("failed");
      }
    };

    checkPaymentStatus();
  }, [orderId, verifyPayment, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-purple-50">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        {status === "loading" && (
          <>
            <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Verifying Payment...</h2>
            <p className="text-gray-600">Please wait while we confirm your payment</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Payment Successful! 🎉</h2>
            <p className="text-gray-600">
              Your subscription has been activated successfully.
            </p>
            {paymentDetails && (
              <div className="bg-green-50 p-4 rounded-lg text-left">
                <p className="text-sm text-gray-700">
                  <strong>Order ID:</strong> {orderId}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Amount:</strong> ₹{paymentDetails.amount}
                </p>
              </div>
            )}
            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Go to Dashboard
            </Button>
          </>
        )}

        {status === "failed" && (
          <>
            <XCircle className="h-16 w-16 text-red-600 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Payment Failed</h2>
            <p className="text-gray-600">
              Unfortunately, your payment could not be processed. Please try again.
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => navigate("/subscription")}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Try Again
              </Button>
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="w-full"
              >
                Back to Dashboard
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
