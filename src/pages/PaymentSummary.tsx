import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useSearchParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { User, Mail, MapPin, BookOpen, CheckCircle, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentSummary() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userProfile = useQuery(api.users.getUserProfile);
  const createOrder = useAction(api.razorpay.createOrder);
  const verifyPayment = useAction(api.razorpay.verifyPayment);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const planName = searchParams.get("name");
  const basePrice = parseFloat(searchParams.get("price") || "0");
  const duration = parseInt(searchParams.get("duration") || "0");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (isLoading || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!planName || !basePrice) {
    navigate("/subscription");
    return null;
  }

  const isProfileComplete = userProfile.name && userProfile.state && userProfile.examPreparation;
  
  if (!isProfileComplete) {
    return (
      <div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10 p-8">
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <User className="h-10 w-10 text-yellow-400" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Complete Your Profile First</h2>
                  <p className="text-white/70">
                    Please complete your profile before proceeding with subscription.
                  </p>
                </div>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${userProfile.name ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      {userProfile.name ? <CheckCircle className="h-4 w-4 text-green-400" /> : <span className="text-red-400">✕</span>}
                    </div>
                    <span className="text-white">Full Name</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${userProfile.state ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      {userProfile.state ? <CheckCircle className="h-4 w-4 text-green-400" /> : <span className="text-red-400">✕</span>}
                    </div>
                    <span className="text-white">State</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${userProfile.examPreparation ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      {userProfile.examPreparation ? <CheckCircle className="h-4 w-4 text-green-400" /> : <span className="text-red-400">✕</span>}
                    </div>
                    <span className="text-white">Exam Preparation</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 pt-4">
                  <Button
                    onClick={() => navigate("/profile")}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    Complete Profile Now
                  </Button>
                  <Button
                    onClick={() => navigate("/subscription")}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    Back to Plans
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsValidatingCoupon(true);
    try {
      const validateCoupon = await fetch(`${import.meta.env.VITE_CONVEX_URL}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: "coupons:validateCoupon",
          args: { code: couponCode.toUpperCase() },
        }),
      }).then(res => res.json());

      const result = validateCoupon.value;
      
      if (result.valid) {
        setAppliedCoupon(result);
        toast.success(result.message);
      } else {
        setAppliedCoupon(null);
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error("Failed to validate coupon");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const calculateFinalAmount = () => {
    if (!appliedCoupon) return basePrice;
    
    if (appliedCoupon.type === "percentage") {
      return Math.round(basePrice - (basePrice * appliedCoupon.discount / 100));
    } else {
      return Math.max(0, basePrice - appliedCoupon.discount);
    }
  };

  const finalAmount = calculateFinalAmount();
  const discountAmount = basePrice - finalAmount;

  const handlePayment = async () => {
    if (!userProfile.email) {
      toast.error("Email not found. Please complete your profile.");
      return;
    }

    setIsProcessing(true);
    try {
      const orderResult = await createOrder({
        amount: finalAmount,
        planName: planName,
        duration: duration,
      });

      if (!orderResult.success || !orderResult.orderId) {
        toast.error(orderResult.error || "Failed to create order");
        setIsProcessing(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResult.amount,
        currency: orderResult.currency,
        name: "MLT Prep",
        description: `${planName} Subscription`,
        order_id: orderResult.orderId,
        prefill: {
          name: userProfile.name || "",
          email: userProfile.email,
          contact: "",
        },
        theme: {
          color: "#3b82f6",
        },
        handler: async function (response: any) {
          try {
            const verifyResult = await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              planName: planName,
              amount: finalAmount,
              duration: duration,
            });

            if (verifyResult.success) {
              toast.success("Payment successful! Your subscription is now active.");
              navigate("/payment-status?status=success");
            } else {
              toast.error(verifyResult.error || "Payment verification failed");
              navigate("/payment-status?status=failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed");
            navigate("/payment-status?status=failed");
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.info("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to initiate payment");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white">Subscription Summary</h1>
          <p className="text-white/70 mt-1">Review your subscription details</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-5 w-5 text-white" />
                  <h3 className="text-white font-semibold">Apply Coupon Code</h3>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                    disabled={isValidatingCoupon || !!appliedCoupon}
                  />
                  {!appliedCoupon ? (
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={isValidatingCoupon || !couponCode.trim()}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      {isValidatingCoupon ? "Validating..." : "Apply"}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponCode("");
                      }}
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                {appliedCoupon && (
                  <div className="mt-3 p-3 bg-green-500/20 border border-green-400/50 rounded-lg">
                    <p className="text-green-300 text-sm flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      {appliedCoupon.message}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4 bg-white/5 p-6 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Selected Plan</span>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    {planName}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Duration</span>
                  <span className="text-white font-medium">{duration} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Base Amount</span>
                  <span className="text-white font-medium">₹{basePrice}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between items-center">
                    <span className="text-green-300">Discount</span>
                    <span className="text-green-300 font-medium">- ₹{discountAmount}</span>
                  </div>
                )}
                <div className="border-t border-white/20 pt-4 flex justify-between items-center">
                  <span className="text-white font-semibold text-lg">Total Amount</span>
                  <span className="text-white font-bold text-2xl">₹{finalAmount}</span>
                </div>
              </div>

              <div className="space-y-4 bg-white/5 p-6 rounded-lg">
                <h3 className="text-white font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Your Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-white/70">
                    <User className="h-4 w-4" />
                    <span>{userProfile.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <Mail className="h-4 w-4" />
                    <span>{userProfile.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <MapPin className="h-4 w-4" />
                    <span>{userProfile.state}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <BookOpen className="h-4 w-4" />
                    <span>{userProfile.examPreparation}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {isProcessing ? "Processing..." : `Pay ₹${finalAmount}`}
                </Button>
                <Button
                  onClick={() => navigate("/subscription")}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Back to Plans
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}