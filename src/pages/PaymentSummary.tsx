// @ts-nocheck
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useSearchParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { User, Mail, MapPin, BookOpen, CheckCircle, Tag, Lock, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PaymentSummary() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userProfile = useQuery(api.users.getUserProfile);
  
  const [couponCode, setCouponCode] = useState("");
  const validateCoupon = useQuery(
    api.coupons.validateCoupon,
    couponCode ? { code: couponCode } : "skip"
  );
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const planName = searchParams.get("name");
  const basePrice = parseFloat(searchParams.get("price") || "0");
  const duration = parseInt(searchParams.get("duration") || "0");
  
  // Payment gateway actions
  const createRazorpayOrder = useAction(api.razorpay.createOrder);
  const verifyRazorpayPayment = useAction(api.razorpay.verifyPayment);
  const createCashfreeOrder = useAction(api.cashfree.createOrder);
  const verifyCashfreePayment = useAction(api.cashfree.verifyPayment);
  
  // Coupon tracking
  const trackCouponUsage = useMutation(api.coupons.trackCouponUsage);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!planName || !basePrice) {
    navigate("/subscription-plans");
    return null;
  }

  const isProfileComplete = userProfile.name && userProfile.state && userProfile.examPreparation;
  
  if (!isProfileComplete) {
    return (
      <div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600">
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
                    onClick={() => navigate("/subscription-plans")}
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

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.type === "percentage") {
      const discountAmount = (basePrice * appliedCoupon.discount) / 100;
      return discountAmount;
    }
    
    return appliedCoupon.discount;
  };

  const discount = calculateDiscount();
  const finalAmount = Math.max(basePrice - discount, 0);

  const handleApplyCoupon = () => {
    if (validateCoupon && validateCoupon.valid) {
      setAppliedCoupon({
        discount: validateCoupon.discount,
        type: validateCoupon.type,
        couponId: validateCoupon.couponId,
      });
      toast.success(validateCoupon.message);
    } else if (validateCoupon) {
      toast.error(validateCoupon.message);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.success("Coupon removed");
  };

  const handleRazorpayPayment = async () => {
    if (!user?._id) {
      toast.error("User not found");
      return;
    }

    const waitForRazorpay = async (): Promise<boolean> => {
      if (typeof window === 'undefined') return false;
      
      if ((window as any).Razorpay) return true;
      
      for (let i = 0; i < 50; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if ((window as any).Razorpay) return true;
      }
      
      return false;
    };

    const isLoaded = await waitForRazorpay();
    
    if (!isLoaded) {
      toast.error("Payment gateway not loaded. Please check your connection and refresh the page.");
      return;
    }

    try {
      toast.loading("Initializing Razorpay payment...");
      
      const order = await createRazorpayOrder({
        amount: finalAmount,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          userId: user._id,
          planName: planName || "",
          duration: duration,
        },
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        order_id: order.id,
        amount: finalAmount * 100,
        currency: "INR",
        name: "MLT Prep",
        description: `${planName} Plan`,
        prefill: {
          name: userProfile?.name || "",
          email: userProfile?.email || "",
        },
        handler: async (response: any) => {
          try {
            await verifyRazorpayPayment({
              orderId: order.id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              userId: user._id,
              planName: planName || "",
              amount: finalAmount,
              duration: duration,
            });
            
            if (appliedCoupon && appliedCoupon.couponId) {
              try {
                await trackCouponUsage({
                  couponId: appliedCoupon.couponId,
                  userId: user._id,
                  orderId: order.id,
                  discountAmount: discount,
                });
              } catch (error) {
                console.error("Failed to track coupon usage:", error);
              }
            }
            
            navigate("/payment-status?status=success&gateway=razorpay");
          } catch (error) {
            toast.error("Payment verification failed");
            navigate("/payment-status?status=failed&gateway=razorpay");
          }
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate payment");
    }
  };

  const handleCashfreePayment = async () => {
    if (!user?._id) {
      toast.error("User not found");
      return;
    }

    // Robust Cashfree SDK loader
    const loadCashfreeSdk = async (): Promise<boolean> => {
      if ((window as any).Cashfree) return true;

      console.log("Cashfree SDK not found immediately, waiting...");
      
      // Wait up to 5 seconds
      for (let i = 0; i < 50; i++) {
        if ((window as any).Cashfree) {
          console.log(`Cashfree SDK loaded after ${i * 100}ms`);
          return true;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // If still not found, try dynamic injection
      console.log("Cashfree SDK not found, attempting dynamic injection...");
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
        script.onload = () => {
          console.log("Cashfree SDK injected and loaded");
          resolve(true);
        };
        script.onerror = () => {
          console.error("Failed to inject Cashfree SDK");
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    const isSdkLoaded = await loadCashfreeSdk();

    if (!isSdkLoaded) {
      console.error("Cashfree SDK failed to load");
      toast.error("Unable to load Cashfree payment gateway. Please check your internet connection or try Razorpay.", {
        duration: 5000,
      });
      return;
    }
    
    console.log("Cashfree SDK detected, proceeding with payment");

    try {
      toast.loading("Initializing Cashfree payment...");
      
      const order = await createCashfreeOrder({
        amount: finalAmount,
        currency: "INR",
        userId: user._id,
        planName: planName || "",
        duration: duration,
        customerEmail: userProfile?.email,
        customerPhone: userProfile?.phone || "9999999999",
      });

      console.log("Cashfree order created:", order);

      const checkoutOptions = {
        paymentSessionId: order.paymentSessionId,
        returnUrl: `${window.location.origin}/payment-status?gateway=cashfree&order_id=${order.orderId}&planName=${encodeURIComponent(planName || "")}&amount=${finalAmount}&duration=${duration}`,
      };

      const cashfreeMode = order.environment === "SANDBOX" ? "sandbox" : "production";
      console.log("Opening Cashfree checkout with options:", checkoutOptions);
      console.log("Using Cashfree mode:", cashfreeMode);

      // Initialize Cashfree with proper configuration
      const cashfree = new (window as any).Cashfree({ mode: cashfreeMode });
      
      if (!cashfree) {
        throw new Error("Failed to initialize Cashfree SDK");
      }

      cashfree.checkout(checkoutOptions).then(async (result: any) => {
        console.log("Cashfree checkout result:", result);
        
        if (result.error) {
          toast.error(result.error.message || "Payment failed");
          navigate("/payment-status?status=failed&gateway=cashfree");
          return;
        }

        if (result.paymentDetails) {
          try {
            await verifyCashfreePayment({
              orderId: order.orderId,
              userId: user._id,
              planName: planName || "",
              amount: finalAmount,
              duration: duration,
            });

            if (appliedCoupon && appliedCoupon.couponId) {
              try {
                await trackCouponUsage({
                  couponId: appliedCoupon.couponId,
                  userId: user._id,
                  orderId: order.orderId,
                  discountAmount: discount,
                });
              } catch (error) {
                console.error("Failed to track coupon usage:", error);
              }
            }

            navigate("/payment-status?status=success&gateway=cashfree");
          } catch (error) {
            toast.error("Payment verification failed");
            navigate("/payment-status?status=failed&gateway=cashfree");
          }
        }
      });
    } catch (error: any) {
      console.error("Cashfree payment error:", error);
      toast.error(error.message || "Failed to initiate Cashfree payment");
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-4xl font-bold text-white">Payment Summary</h1>
          <p className="text-white/80 text-lg">Review your subscription details</p>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 justify-center">
            <CheckCircle className="h-6 w-6 text-green-300" />
            <div className="text-center">
              <p className="text-white font-bold text-lg">You're almost ready to upgrade</p>
              <p className="text-white/80 text-sm">You're unlocking full MLT exam preparation with verified tests and analytics.</p>
            </div>
          </div>
        </motion.div>

        {/* Payment Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/10">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selected Plan */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span className="font-semibold">Selected Plan</span>
                  <Badge className="bg-white/20 text-white border-white/30 ml-auto">
                    {planName}
                  </Badge>
                </div>

                <div className="space-y-3 text-white/90">
                  <div className="flex justify-between items-center">
                    <span>Duration</span>
                    <span className="font-semibold">{duration} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Base Amount</span>
                    <span className="font-semibold">₹{basePrice}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between items-center text-green-300">
                      <span>Discount Applied</span>
                      <span className="font-semibold">- ₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-white/20 pt-3 flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Total Amount</span>
                    <span className="text-3xl font-bold text-white">₹{finalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <p className="text-white/70 text-sm text-center">
                  No hidden charges • One-time payment • Secure checkout
                </p>
              </div>

              {/* Coupon Code Section */}
              <div className="space-y-3 bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 text-white font-semibold mb-3">
                  <Tag className="h-5 w-5" />
                  <span>Have a Coupon Code?</span>
                </div>
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={!couponCode}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      Apply
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-300" />
                      <span className="text-white font-semibold">{couponCode}</span>
                      <span className="text-green-300 text-sm">
                        (₹{discount.toFixed(2)} off)
                      </span>
                    </div>
                    <Button
                      onClick={handleRemoveCoupon}
                      variant="ghost"
                      size="sm"
                      className="text-white/80 hover:text-white hover:bg-white/10"
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>

              {/* Your Information */}
              <div className="space-y-3 bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 text-white font-semibold mb-3">
                  <User className="h-5 w-5" />
                  <span>Your Information</span>
                </div>
                <div className="space-y-2 text-white/80 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{userProfile.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{userProfile.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{userProfile.state}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{userProfile.examPreparation}</span>
                  </div>
                </div>
              </div>

              {/* Security Info */}
              <div className="space-y-2 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>Secure Payment • UPI / Cards / Netbanking supported</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>Instant access after payment</span>
                </div>
              </div>

              {/* Payment Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleCashfreePayment}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-6 text-lg"
                >
                  Pay Securely with Cashfree
                </Button>
                <Button
                  onClick={handleRazorpayPayment}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-6 text-lg"
                >
                  Pay Securely with Razorpay
                </Button>
                <Button
                  onClick={() => navigate("/subscription-plans")}
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/10 py-6 text-lg"
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