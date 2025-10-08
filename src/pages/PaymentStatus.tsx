import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

export default function PaymentStatus() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const status = searchParams.get("status");

  useEffect(() => {
    // Redirect to dashboard after 3 seconds
    const timer = setTimeout(() => navigate("/dashboard"), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const isSuccess = status === "success";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-purple-50">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        {isSuccess ? (
          <>
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
            <p className="text-gray-600">
              Your subscription has been activated. Redirecting to dashboard...
            </p>
          </>
        ) : (
          <>
            <XCircle className="h-16 w-16 text-red-600 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Payment Failed</h2>
            <p className="text-gray-600">
              There was an issue processing your payment. Please try again.
            </p>
          </>
        )}
        <Button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Go to Dashboard
        </Button>
      </Card>
    </div>
  );
}