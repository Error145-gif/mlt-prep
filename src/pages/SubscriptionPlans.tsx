import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, BookOpen, Brain, Library, BarChart3, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useEffect } from "react";

// Razorpay types
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-600 text-xl">Loading...</div>
      </div>
    );
  }

  // Check if user has any active subscription (paid or free trial)
  const hasAnySubscription = subscriptionAccess?.subscription?.status === "active";
  const hasPaidSubscription = subscriptionAccess?.hasAccess && subscriptionAccess?.isPaid;
  const hasFreeTrial = subscriptionAccess?.reason === "free_trial" && hasAnySubscription;

  const handleFreeTrial = async () => {
    if (hasAnySubscription) {
      toast.error("You already have an active subscription!");
      return;
    }

    try {
      await startFreeTrial({});
      toast.success("7-day free trial activated!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to start trial");
    }
  };

  const handleSubscribe = async (planId: string, amount: number, planName: string, duration: number) => {
    if (hasPaidSubscription) {
      toast.error("You already have an active paid subscription! Check your dashboard for expiry date.");
      return;
    }

    try {
      // Create Razorpay order
      const orderResult = await createOrder({ amount, planName, duration });

      if (!orderResult.success) {
        toast.error(orderResult.error || "Failed to create order");
        return;
      }

      // Open Razorpay checkout
      const options = {
        key: "rzp_live_RStd1rQAde32Tp",
        amount: orderResult.amount,
        currency: orderResult.currency,
        name: "MLT Prep",
        description: planName,
        order_id: orderResult.orderId,
        handler: async function (response: any) {
          try {
            const verifyResult = await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              planName,
              amount,
              duration,
            });

            if (verifyResult.success) {
              toast.success("Payment successful! Subscription activated.");
              navigate("/payment-status?status=success");
            } else {
              toast.error("Payment verification failed");
              navigate("/payment-status?status=failed");
            }
          } catch (error: any) {
            toast.error(error.message || "Payment verification failed");
            navigate("/payment-status?status=failed");
          }
        },
        prefill: {
          email: user?.email || "",
          name: user?.name || "",
        },
        theme: {
          color: "#007BFF",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
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
      badge: hasAnySubscription && !hasPaidSubscription ? "Active" : null,
      features: [
        { text: "Limited Mock Tests", icon: BookOpen },
        { text: "Limited PYQ Sets", icon: BookOpen },
        { text: "Limited AI-Based Questions", icon: Brain },
        { text: "Basic Analytics", icon: BarChart3 },
      ],
      action: () => handleFreeTrial(),
      buttonText: hasAnySubscription ? "Already Subscribed" : "Start Free Trial",
      disabled: hasAnySubscription,
    },
    {
      id: "monthly",
      name: "Monthly",
      price: 99,
      duration: 30,
      durationText: "month",
      icon: BookOpen,
      badge: "Popular Choice",
      features: [
        { text: "Unlimited Mock Tests", icon: BookOpen },
        { text: "All PYQ Sets", icon: BookOpen },
        { text: "All AI-Based Question Sets", icon: Brain },
        { text: "Advanced Analytics", icon: BarChart3 },
      ],
      action: () => handleSubscribe("monthly", 99, "Monthly Plan", 30),
      buttonText: hasPaidSubscription ? "Already Subscribed" : "Subscribe Now",
      disabled: hasPaidSubscription,
    },
    {
      id: "4months",
      name: "4 Months",
      price: 399,
      originalPrice: 496,
      savings: "Save ₹97",
      duration: 120,
      durationText: "4 months",
      icon: Library,
      badge: "Most Popular",
      popular: true,
      features: [
        { text: "Everything in Monthly Plan", icon: Check },
        { text: "Library Access", icon: Library },
        { text: "Extended Validity (4 Months)", icon: Check },
      ],
      action: () => handleSubscribe("4months", 399, "4 Months Plan", 120),
      buttonText: hasPaidSubscription ? "Already Subscribed" : "Get 4-Month Plan",
      disabled: hasPaidSubscription,
    },
    {
      id: "yearly",
      name: "Yearly",
      price: 599,
      originalPrice: 1188,
      savings: "Save ₹589",
      duration: 365,
      durationText: "year",
      icon: Library,
      badge: "Best Value",
      features: [
        { text: "Everything in 4-Month Plan", icon: Check },
        { text: "1 Year Full Access to All Content", icon: Check },
      ],
      action: () => handleSubscribe("yearly", 599, "Yearly Plan", 365),
      buttonText: hasPaidSubscription ? "Already Subscribed" : "Go Yearly – Save Big",
      disabled: hasPaidSubscription,
    },
  ];

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Choose Your Plan</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Start with a 7-day Free Trial, then unlock full access to all study sections.
          </p>
          {hasAnySubscription && (
            <Badge className="mt-4 bg-green-100 text-green-700 border-green-300 text-sm px-4 py-2">
              ✓ You have an active subscription
            </Badge>
          )}
        </div>

        {/* Plans */}
        <div className="space-y-4">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`border-2 ${plan.popular ? 'border-blue-500 shadow-lg' : 'border-gray-200'} rounded-2xl overflow-hidden ${plan.disabled ? 'opacity-60' : ''}`}>
                <CardHeader className="bg-gradient-to-r from-blue-50 to-white pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-blue-100">
                        <plan.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-900">{plan.name}</CardTitle>
                        {plan.badge && (
                          <Badge className="mt-1 bg-blue-100 text-blue-700 border-blue-300 text-xs">
                            {plan.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {plan.originalPrice && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 line-through text-sm">₹{plan.originalPrice}</span>
                          <Badge className="bg-red-100 text-red-700 border-red-300 text-xs">{plan.savings}</Badge>
                        </div>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-gray-900">₹{plan.price}</span>
                        <span className="text-gray-500 text-sm">/{plan.durationText}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="p-1 rounded-full bg-blue-50">
                          <feature.icon className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-gray-700 text-sm">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={plan.action}
                    className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'} text-white rounded-xl py-6 text-base font-semibold`}
                    disabled={plan.disabled}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-12 bg-gray-50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Feature</th>
                  <th className="text-center py-3 px-2 font-semibold text-gray-700">Free Trial</th>
                  <th className="text-center py-3 px-2 font-semibold text-gray-700">Monthly</th>
                  <th className="text-center py-3 px-2 font-semibold text-gray-700">4 Months</th>
                  <th className="text-center py-3 px-2 font-semibold text-gray-700">Yearly</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2 text-gray-700">Mock Tests</td>
                  <td className="text-center py-3 px-2 text-gray-500">Limited</td>
                  <td className="text-center py-3 px-2"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-3 px-2"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-3 px-2"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2 text-gray-700">PYQ Sets</td>
                  <td className="text-center py-3 px-2 text-gray-500">Limited</td>
                  <td className="text-center py-3 px-2"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-3 px-2"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-3 px-2"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2 text-gray-700">AI-Based Questions</td>
                  <td className="text-center py-3 px-2 text-gray-500">Limited</td>
                  <td className="text-center py-3 px-2"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-3 px-2"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-3 px-2"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2 text-gray-700">Library Access</td>
                  <td className="text-center py-3 px-2"><X className="h-5 w-5 text-red-500 mx-auto" /></td>
                  <td className="text-center py-3 px-2"><X className="h-5 w-5 text-red-500 mx-auto" /></td>
                  <td className="text-center py-3 px-2"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-3 px-2"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-2 text-gray-700">Analytics</td>
                  <td className="text-center py-3 px-2 text-gray-500">Basic</td>
                  <td className="text-center py-3 px-2 text-gray-700">Advanced</td>
                  <td className="text-center py-3 px-2 text-gray-700">Advanced</td>
                  <td className="text-center py-3 px-2 text-gray-700">Advanced</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Users with 4-Month or Yearly subscriptions get Library Access in addition to all other features.
          </p>
        </div>
      </div>
    </div>
  );
}