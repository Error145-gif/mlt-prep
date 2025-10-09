import { useQuery, useAction, useMutation, useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useSearchParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, MapPin, BookOpen, Tag, CreditCard, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Add Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentSummary() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const convex = useConvex();
  const userProfile = useQuery(api.users.getUserProfile);
  const createOrder = useAction(api.razorpay.createOrder);
  const verifyPayment = useAction(api.razorpay.verifyPayment);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    type: "percentage" | "fixed";
  } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Get plan details from URL params
  const planId = searchParams.get("plan");
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

  if (!planId || !planName || !basePrice) {
    navigate("/subscription");
    return null;
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    try {
      // Validate the coupon using the Convex query
      const validation = await convex.query(api.coupons.validateCoupon, { code: couponCode.trim() });
      
      if (validation && validation.valid) {
        setAppliedCoupon({
          code: couponCode.toUpperCase(),
          discount: validation.discount || 0,
          type: validation.type || "percentage",
        });
        toast.success(validation.message || "Coupon applied successfully!");
      } else {
        toast.error(validation?.message || "Invalid coupon code");
      }
    } catch (error) {
      toast.error("Failed to apply coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.info("Coupon removed");
  };

  const calculateFinalAmount = () => {
    let finalAmount = basePrice;
    
    if (appliedCoupon) {
      if (appliedCoupon.type === "percentage") {
        finalAmount = basePrice - (basePrice * appliedCoupon.discount) / 100;
      } else {
        finalAmount = basePrice - appliedCoupon.discount;
      }
    }
    
    return Math.max(0, Math.round(finalAmount));
  };

  const handlePayNow = async () => {
    try {
      const finalAmount = calculateFinalAmount();
      toast.loading("Creating order...");
      
      const orderResult = await createOrder({
        amount: finalAmount,
        planName: planName || "",
        customerEmail: user?.email || "",
        customerName: user?.name || "",
      });

      toast.dismiss();

      if (!orderResult.success) {
        toast.error("Failed to create order");
        return;
      }

      // Open Razorpay checkout
      const options = {
        key: orderResult.keyId,
        amount: orderResult.amount,
        currency: orderResult.currency,
        name: "MLT Prep",
        description: planName,
        order_id: orderResult.orderId,
        handler: async function (response: any) {
          try {
            toast.loading("Verifying payment...");
            
            const verifyResult = await verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            toast.dismiss();

            if (verifyResult.success) {
              // Redirect to payment status with details
              navigate(`/payment-status?status=success&plan=${planName}&amount=${finalAmount}&coupon=${appliedCoupon?.code || ""}&transactionId=${response.razorpay_payment_id}`);
            } else {
              toast.error("Payment verification failed");
              navigate("/payment-status?status=failed");
            }
          } catch (error: any) {
            toast.dismiss();
            toast.error(error.message || "Payment verification failed");
            navigate("/payment-status?status=failed");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#3b82f6",
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || "Failed to initiate payment");
    }
  };

  const finalAmount = calculateFinalAmount();
  const discount = basePrice - finalAmount;

  return (
    <div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-pink-400/25 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white">Payment Summary</h1>
          <p className="text-white/70 mt-1">Review your subscription details before payment</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User & Subscription Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Details Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="h-5 w-5" />
                    User Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-white/70" />
                    <div>
                      <p className="text-xs text-white/50">Name</p>
                      <p className="text-white font-medium">{userProfile.name || "Not set"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-white/70" />
                    <div>
                      <p className="text-xs text-white/50">Email</p>
                      <p className="text-white font-medium">{userProfile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-white/70" />
                    <div>
                      <p className="text-xs text-white/50">State</p>
                      <p className="text-white font-medium">{userProfile.state || "Not set"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-white/70" />
                    <div>
                      <p className="text-xs text-white/50">Exam Preparation</p>
                      <p className="text-white font-medium">{userProfile.examPreparation || "Not set"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Subscription Details Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Subscription Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Base Amount</span>
                    <span className="text-white font-medium">₹{basePrice}</span>
                  </div>
                  {appliedCoupon && (
                    <>
                      <div className="flex justify-between items-center text-green-400">
                        <span className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          Discount ({appliedCoupon.code})
                        </span>
                        <span className="font-medium">
                          - ₹{discount}
                        </span>
                      </div>
                    </>
                  )}
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-white font-semibold">Total Amount</span>
                    <span className="text-white font-bold">₹{finalAmount}</span>
                  </div>
                  <p className="text-xs text-white/50 text-center">
                    (Including 18% GST)
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Coupon & Payment */}
          <div className="space-y-6">
            {/* Coupon Code Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Apply Coupon
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!appliedCoupon ? (
                    <>
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                      <Button
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon || !couponCode.trim()}
                        className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                      >
                        {isApplyingCoupon ? "Applying..." : "Apply Coupon"}
                      </Button>
                      <div className="text-xs text-white/50">
                        <p>Enter your coupon code to get a discount</p>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          <div>
                            <p className="text-white font-medium">{appliedCoupon.code}</p>
                            <p className="text-xs text-white/70">
                              {appliedCoupon.type === "percentage" 
                                ? `${appliedCoupon.discount}% off` 
                                : `₹${appliedCoupon.discount} off`}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={handleRemoveCoupon}
                        variant="outline"
                        className="w-full border-white/20 text-white hover:bg-white/10"
                      >
                        Remove Coupon
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                <CardContent className="pt-6">
                  <Button
                    onClick={handlePayNow}
                    className="w-full h-14 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Pay ₹{finalAmount}
                  </Button>
                  <p className="text-xs text-white/50 text-center mt-3">
                    Secure payment powered by Razorpay
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Button
            onClick={() => navigate("/subscription")}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Back to Plans
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
