import { useMutation, useQuery } from "convex/react";
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
import { useAction } from "convex/react";
import { load } from "@cashfreepayments/cashfree-js";

export default function SubscriptionPlans() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const subscriptionAccess = useQuery(api.student.checkSubscriptionAccess);
  const startFreeTrial = useMutation(api.subscriptions.startFreeTrial);
  const createSubscription = useMutation(api.subscriptions.createSubscription);
  const createCashfreeOrder = useAction(api.cashfree.createOrder);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

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

  const handleSubscribe = async (planId: string, amount: number, planName: string) => {
    if (!user) {
      toast.error("Please login to subscribe");
      navigate("/auth");
      return;
    }

    try {
      toast.info("Initiating payment...");
      
      // Create order on backend
      const orderResponse = await createCashfreeOrder({
        orderAmount: amount,
        customerName: user.name || "Student",
        customerEmail: user.email || "",
        customerPhone: "9999999999", // Default phone number
        planName: planName,
      });

      if (!orderResponse.success || !orderResponse.paymentSessionId) {
        throw new Error("Failed to create payment session");
      }

      // Load Cashfree SDK and initiate checkout
      const cashfree = await load({
        mode: "sandbox", // Change to "production" for live
      });

      const checkoutOptions = {
        paymentSessionId: orderResponse.paymentSessionId,
        redirectTarget: "_self" as const,
      };

      cashfree.checkout(checkoutOptions);
    } catch (error: any) {
      console.error("Payment initiation error:", error);
      toast.error(error.message || "Failed to initiate payment. Please try again.");
    }
  };

  const plans = [
    {
      name: "Free Trial",
      price: 0,
      duration: "7 days",
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
      name: "Monthly",
      price: 99,
      duration: "per month",
      icon: Zap,
      color: "from-purple-500 to-pink-600",
      features: [
        "Unlimited mock tests",
        "All PYQ sets",
        "Advanced analytics",
        "Unlimited practice questions",
        "Priority support",
      ],
      action: () => handleSubscribe("monthly", 99, "Monthly Plan"),
      buttonText: "Subscribe",
    },
    {
      name: "4 Months",
      price: 399,
      duration: "4 months",
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
      action: () => handleSubscribe("4months", 399, "4 Months Plan"),
      buttonText: "Best Value",
    },
    {
      name: "Yearly",
      price: 599,
      originalPrice: 798,
      duration: "12 months",
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
      action: () => handleSubscribe("yearly", 599, "Yearly Plan"),
      buttonText: "Maximum Savings",
    },
  ];

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-white/70 text-lg">Start with a 7-day free trial, then select the plan that works best for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
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
                      <span className="text-white/60">/{plan.duration}</span>
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