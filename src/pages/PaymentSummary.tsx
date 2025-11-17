// @ts-nocheck
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useSearchParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { User, Mail, MapPin, BookOpen, CheckCircle, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Menu, X } from "lucide-react";

export default function PaymentSummary() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<"razorpay" | "cashfree">("razorpay");
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
  
  // Razorpay actions
  const createRazorpayOrder = useAction(api.razorpay.createOrder);
  const verifyRazorpayPayment = useAction(api.razorpay.verifyPayment);
  
  // Cashfree actions
  const createCashfreeOrder = useAction(api.cashfree.createOrder);
  
  // Coupon tracking
  const trackCouponUsage = useMutation(api.coupons.trackCouponUsage);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

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

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    console.log("Calculating discount:", { 
      type: appliedCoupon.type, 
      discount: appliedCoupon.discount, 
      basePrice 
    });
    
    if (appliedCoupon.type === "percentage") {
      const discountAmount = (basePrice * appliedCoupon.discount) / 100;
      console.log("Percentage discount calculated:", discountAmount);
      return discountAmount;
    }
    
    console.log("Fixed discount:", appliedCoupon.discount);
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
      console.log("Applied coupon:", { 
        discount: validateCoupon.discount, 
        type: validateCoupon.type,
        couponId: validateCoupon.couponId 
      });
    } else if (validateCoupon) {
      toast.error(validateCoupon.message);
    }
  };

  const handleCashfreePayment = async () => {
    if (!user?._id) {
      toast.error("User not found");
      return;
    }

    // Enhanced SDK loading check with retry mechanism for mobile
    const waitForCashfree = async (): Promise<boolean> => {
      if (typeof window === 'undefined') return false;
      
      // Check if already loaded
      if ((window as any).Cashfree) return true;
      
      // Wait up to 10 seconds for SDK to load
      for (let i = 0; i < 100; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if ((window as any).Cashfree) return true;
      }
      
      return false;
    };

    const isLoaded = await waitForCashfree();
    
    if (!isLoaded) {
      toast.error("Cashfree payment gateway failed to load. Please refresh the page and try again.");
      console.error("Cashfree SDK not loaded");
      return;
    }

    try {
      const loadingToast = toast.loading("Initializing Cashfree payment...");
      
      const order = await createCashfreeOrder({
        amount: finalAmount,
        currency: "INR",
        userId: user._id,
        planName: planName || "",
        duration: duration,
        customerEmail: userProfile?.email || user?.email || "",
        customerPhone: userProfile?.phone || "9999999999",
      });

      toast.dismiss(loadingToast);
      
      if (!order || !order.paymentSessionId) {
        throw new Error("Failed to create Cashfree order. Please try again.");
      }

      console.log("Cashfree order created:", {
        orderId: order.orderId,
        hasSessionId: !!order.paymentSessionId,
        sessionIdLength: order.paymentSessionId?.length,
        sessionIdPreview: order.paymentSessionId?.substring(0, 20) + "...",
        environment: order.environment,
      });

      // Load Cashfree SDK - use environment from backend
      const CashfreeSDK = (window as any).Cashfree;
      
      if (!CashfreeSDK) {
        throw new Error("Cashfree SDK not loaded. Please refresh the page and try again.");
      }
      
      const cashfree = CashfreeSDK({
        mode: order.environment || "SANDBOX",
      });
      
      console.log("Cashfree SDK initialized with mode:", order.environment || "SANDBOX");
      console.log("Cashfree SDK object:", cashfree);

      if (!cashfree || typeof cashfree.checkout !== 'function') {
        throw new Error("Cashfree SDK initialization failed - checkout method not available");
      }

      // Track coupon usage immediately after order creation for Cashfree
      if (appliedCoupon && appliedCoupon.couponId) {
        try {
          await trackCouponUsage({
            couponId: appliedCoupon.couponId,
            userId: user._id,
            orderId: order.orderId,
            discountAmount: discount,
          });
          console.log("Coupon usage tracked for Cashfree order");
        } catch (error) {
          console.error("Failed to track coupon usage:", error);
          // Don't block payment flow if tracking fails
        }
      }

      const checkoutOptions = {
        paymentSessionId: order.paymentSessionId,
        returnUrl: `${window.location.origin}/payment-status?gateway=cashfree&order_id=${order.orderId}`,
      };

      console.log("Opening Cashfree checkout with options:", checkoutOptions);

      cashfree.checkout(checkoutOptions).then(() => {
        console.log("Cashfree payment initiated successfully");
        toast.success("Redirecting to payment gateway...");
      }).catch((err: any) => {
        console.error("Cashfree checkout error:", err);
        toast.error("Failed to open payment gateway. Please try again.");
      });
    } catch (error: any) {
      console.error("Cashfree payment error:", error);
      toast.dismiss();
      
      if (error.message?.includes("configuration") || error.message?.includes("credentials")) {
        toast.error("Payment gateway not configured. Please contact support.");
      } else if (error.message?.includes("network")) {
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error(error.message || "Failed to initiate Cashfree payment. Please try again.");
      }
    }
  };

  const handleRazorpayPayment = async () => {
    if (!user?._id) {
      toast.error("User not found");
      return;
    }

    // Enhanced SDK loading check with retry mechanism for mobile
    const waitForRazorpay = async (): Promise<boolean> => {
      if (typeof window === 'undefined') return false;
      
      // Check if already loaded
      if ((window as any).Razorpay) return true;
      
      // Wait up to 5 seconds for SDK to load
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
            
            // Track coupon usage after successful payment
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
            
            navigate("/payment-status?status=success");
          } catch (error) {
            toast.error("Payment verification failed");
            navigate("/payment-status?status=failed");
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

  const handlePayment = () => {
    if (selectedGateway === "razorpay") {
      handleRazorpayPayment();
    } else {
      handleCashfreePayment();
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
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
                  navigate("/dashboard");
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

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white">Payment Summary</h1>
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
              {/* Payment Gateway Selection */}
              <div className="space-y-3 bg-white/5 p-6 rounded-lg">
                <h3 className="text-white font-medium flex items-center gap-2">
                  Select Payment Gateway
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedGateway("razorpay")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedGateway === "razorpay"
                        ? "border-blue-500 bg-blue-500/20"
                        : "border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="text-white font-semibold">Razorpay</div>
                    <div className="text-white/70 text-xs mt-1">Cards, UPI, Wallets</div>
                  </button>
                  <button
                    onClick={() => setSelectedGateway("cashfree")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedGateway === "cashfree"
                        ? "border-green-500 bg-green-500/20"
                        : "border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="text-white font-semibold">Cashfree</div>
                    <div className="text-white/70 text-xs mt-1">All Payment Methods</div>
                  </button>
                </div>
              </div>

              <div className="space-y-4 bg-white/5 p-6 rounded-lg">
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
                    <div className="flex justify-between items-center text-green-400">
                      <span>Discount Applied</span>
                      <span>- ₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-white/20 pt-4 flex justify-between items-center">
                    <span className="text-white font-semibold text-lg">Total Amount</span>
                    <span className="text-white font-bold text-2xl">₹{finalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3 bg-white/5 p-6 rounded-lg">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Have a Coupon Code?
                  </h3>
                  <div className="flex gap-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      disabled={!!appliedCoupon}
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={!couponCode || !!appliedCoupon}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Apply
                    </Button>
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
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    Pay with {selectedGateway === "razorpay" ? "Razorpay" : "Cashfree"}
                  </Button>
                  <Button
                    onClick={() => navigate("/subscription")}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    Back to Plans
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}