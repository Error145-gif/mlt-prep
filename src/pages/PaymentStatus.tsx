import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function PaymentStatus() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard after a short delay
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-purple-50">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        <AlertCircle className="h-16 w-16 text-blue-600 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900">Payment Gateway Not Configured</h2>
        <p className="text-gray-600">
          The payment gateway is currently being set up. You'll be redirected to the dashboard.
        </p>
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