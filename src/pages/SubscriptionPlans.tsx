import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useEffect } from "react";

// Add Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function SubscriptionPlans() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const subscriptionAccess = useQuery(api.student.checkSubscriptionAccess);
  const startFreeTrial = useMutation(api.subscriptions.startFreeTrial);
  const createOrder = useAction(api.razorpay.createOrder);
  const verifyPayment = useAction(api.razorpay.verifyPayment);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const handleFreeTrial = async () => {
    try {
      await startFreeTrial({});
      toast.success("7-day free trial activated!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to start trial");
    }
  };

  const handleSubscribe = async (planId: string, amount: number, planName: string, duration: number) => {
    try {
      toast.loading("Creating order...");
      
      const orderResult = await createOrder({
        amount,
        planName,
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
              toast.success("Payment successful! Subscription activated.");
              navigate("/dashboard");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error: any) {
            toast.dismiss();
            toast.error(error.message || "Payment verification failed");
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

  const plans = [
    {
      id: "trial",
      name: "Free Trial",
      price: 0,
      duration: 7,
      durationText: "7 days",
      icon: Sparkles,
      color: "from-blue-500 to-cyan-600",
      features: [
        "Access to all mock tests",
        "PYQ practice sets",
        "Basic analytics",
        "Limited practice questions",
      ],
      action: () => handleFreeTrial(),
      buttonText: "Start Free Trial",
    },
    {
      id: "monthly",
      name: "Monthly",
      price: 99,
      duration: 30,
      durationText: "per month",
      icon: Zap,
      color: "from-purple-500 to-pink-600",
      features: [
        "Unlimited mock tests",
        "All PYQ sets",
        "Advanced analytics",
        "Unlimited practice questions",
        "Priority support",
      ],
      action: () => handleSubscribe("monthly", 99, "Monthly Plan", 30),
      buttonText: "Subscribe",
    },
    {
      id: "4months",
      name: "4 Months",
      price: 399,
      duration: 120,
      durationText: "4 months",
      icon: Crown,
      color: "from-orange-500 to-red-600",
      popular: true,
      features: [
        "Everything in Monthly",
        "Save ₹97",
        "Extended validity",
        "Exam preparation guide",
        "Weekly progress reports",
      ],
      action: () => handleSubscribe("4months", 399, "4 Months Plan", 120),
      buttonText: "Best Value",
    },
    {
      id: "yearly",
      name: "Yearly",
      price: 599,
      originalPrice: 798,
      duration: 365,
      durationText: "12 months",
      icon: Crown,
      color: "from-green-500 to-teal-600",
      discount: "Save ₹199",
      features: [
        "Everything in 4 Months",
        "Maximum savings",
        "1 year full access",
        "Personalized study plan",
        "One-on-one mentorship session",
      ],
      action: () => handleSubscribe("yearly", 599, "Yearly Plan", 365),
      buttonText: "Maximum Savings",
    },
  ];

  return (
    <div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-pink-400/25 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] bg-cyan-400/25 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-white/70 text-lg">Start with a 7-day free trial, then select the plan that works best for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-600 border-0">
                  Most Popular
                </Badge>
              )}
              <Card className={`glass-card border-white/20 backdrop-blur-xl bg-white/10 h-full ${plan.popular ? 'border-orange-500/50' : ''}`}>
                <CardHeader>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${plan.color} w-fit mb-4`}>
                    <plan.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    {plan.originalPrice && (
                      <div className="flex items-center gap-2">
                        <span className="text-white/50 line-through text-lg">₹{plan.originalPrice}</span>
                        <Badge className="bg-red-500/20 text-red-300 border-red-500/30">{plan.discount}</Badge>
                      </div>
                    )}
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">₹{plan.price}</span>
                      <span className="text-white/60">/{plan.durationText}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/80 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={plan.action}
                    className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90`}
                    disabled={subscriptionAccess?.hasAccess && plan.price === 0}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}