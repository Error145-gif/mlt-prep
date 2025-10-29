import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, BookOpen, Brain, Library, BarChart3, Sparkles, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import StudentNav from "@/components/StudentNav";

export default function SubscriptionPlans() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const subscriptionAccess = useQuery(api.student.checkSubscriptionAccess);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const hasAnySubscription = subscriptionAccess?.subscription?.status === "active";
  const hasPaidSubscription = subscriptionAccess?.hasAccess && subscriptionAccess?.isPaid;
  const hasFreeTrial = subscriptionAccess?.reason === "free_trial" && hasAnySubscription;

  const handleSubscribe = (planId: string, amount: number, planName: string, duration: number) => {
    if (hasPaidSubscription) {
      toast.error("You already have an active paid subscription! Check your dashboard for expiry date.");
      return;
    }

    navigate(`/payment-summary?name=${encodeURIComponent(planName)}&price=${amount}&duration=${duration}`);
  };

  const plans = [
    {
      id: "trial",
      name: "Free Trial",
      price: 0,
      duration: 7,
      durationText: "7 days",
      icon: Sparkles,
      badge: hasFreeTrial ? "Active" : "Auto-Activated",
      features: [
        { text: "First Mock Test (Free)", icon: BookOpen },
        { text: "First PYQ Set (Free)", icon: BookOpen },
        { text: "First AI Test (Free)", icon: Brain },
        { text: "Basic Analytics", icon: BarChart3 },
      ],
      action: () => {
        toast.info("Free trial is automatically activated when you register!");
        navigate("/dashboard");
      },
      buttonText: hasFreeTrial ? "Active - Go to Dashboard" : "Already Activated",
      disabled: true,
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
        { text: "Library Access (Coming Soon)", icon: Library },
        { text: "Extended Validity (4 Months)", icon: Check },
      ],
      action: () => handleSubscribe("4months", 399, "4 Months Plan", 120),
      buttonText: hasPaidSubscription ? "Already Subscribed" : "Subscribe Now",
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
      buttonText: hasPaidSubscription ? "Already Subscribed" : "Subscribe Now",
      disabled: hasPaidSubscription,
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      <StudentNav />
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-pink-400/25 rounded-full blur-3xl" />
      </div>

      <div 
        className="fixed inset-0 z-0 opacity-15"
        style={{
          backgroundImage: 'url(https://harmless-tapir-303.convex.cloud/api/storage/79e8f0e0-a158-4a75-93f3-29c5c9224309)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />

      {/* Hamburger Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-16 right-0 z-40 md:hidden bg-white/10 backdrop-blur-xl border-l border-white/20 w-64 h-screen p-4 space-y-3"
          >
            <Button
              onClick={() => {
                navigate("/student");
                setIsMenuOpen(false);
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Dashboard
            </Button>
            <Button
              onClick={() => {
                navigate("/tests/mock");
                setIsMenuOpen(false);
              }}
              variant="outline"
              className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              Mock Tests
            </Button>
            <Button
              onClick={() => {
                navigate("/tests/pyq");
                setIsMenuOpen(false);
              }}
              variant="outline"
              className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              PYQ Sets
            </Button>
            <Button
              onClick={() => {
                navigate("/tests/ai");
                setIsMenuOpen(false);
              }}
              variant="outline"
              className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              AI Questions
            </Button>
            <Button
              onClick={() => {
                navigate("/profile");
                setIsMenuOpen(false);
              }}
              variant="outline"
              className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              Profile
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">Choose Your Plan</h1>
          <p className="text-white/90 text-sm md:text-base drop-shadow-md">
            Your 7-day Free Trial is automatically activated! Upgrade anytime for full access.
          </p>
          {hasFreeTrial && (
            <Badge className="mt-4 bg-green-500/30 text-white border-green-400/50 backdrop-blur-xl text-sm px-4 py-2">
              ✓ Free Trial Active - First test of each type unlocked!
            </Badge>
          )}
          {hasPaidSubscription && (
            <Badge className="mt-4 bg-white/90 text-purple-700 border-white backdrop-blur-xl text-sm px-4 py-2 shadow-lg">
              ✓ You have an active paid subscription
            </Badge>
          )}
        </div>

        <div className="space-y-4">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`border-2 ${plan.popular ? 'border-white/50 shadow-2xl' : 'border-white/30'} rounded-2xl overflow-hidden ${plan.disabled && plan.id !== 'trial' ? 'opacity-60' : ''} glass-card backdrop-blur-xl bg-white/20`}>
                <CardHeader className="bg-gradient-to-r from-white/10 to-white/5 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                        <plan.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
                        {plan.badge && (
                          <Badge className="mt-1 bg-white/20 text-white border-white/30 text-xs">
                            {plan.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {plan.originalPrice && (
                        <div className="flex items-center gap-2">
                          <span className="text-white/60 line-through text-sm">₹{plan.originalPrice}</span>
                          <Badge className="bg-red-500/80 text-white border-red-400/50 text-xs">{plan.savings}</Badge>
                        </div>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white">₹{plan.price}</span>
                        <span className="text-white/70 text-sm">/{plan.durationText}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="p-1 rounded-full bg-white/20">
                          <feature.icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-white/90 text-sm">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={plan.action}
                    className="w-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] shadow-lg text-white rounded-xl py-6 text-base font-semibold"
                    disabled={plan.disabled && plan.id !== 'trial'}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 glass-card border border-white/30 backdrop-blur-xl bg-white/20 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 text-center">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-2 font-semibold text-white">Feature</th>
                  <th className="text-center py-3 px-2 font-semibold text-white">Free Trial</th>
                  <th className="text-center py-3 px-2 font-semibold text-white">Monthly</th>
                  <th className="text-center py-3 px-2 font-semibold text-white">4 Months</th>
                  <th className="text-center py-3 px-2 font-semibold text-white">Yearly</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-2 text-white/90">Mock Tests</td>
                  <td className="text-center py-3 px-2 text-white/70">First Test Only</td>
                  <td className="text-center py-3 px-2"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-3 px-2"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-3 px-2"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-2 text-white/90">PYQ Sets</td>
                  <td className="text-center py-3 px-2 text-white/70">First Set Only</td>
                  <td className="text-center py-3 px-2"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-3 px-2"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-3 px-2"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-2 text-white/90">AI-Based Questions</td>
                  <td className="text-center py-3 px-2 text-white/70">First Test Only</td>
                  <td className="text-center py-3 px-2"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-3 px-2"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-3 px-2"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-2 text-white/90">Library Access</td>
                  <td className="text-center py-3 px-2 text-white/70 text-sm">Coming Soon</td>
                  <td className="text-center py-3 px-2 text-white/70 text-sm">Coming Soon</td>
                  <td className="text-center py-3 px-2 text-white/70 text-sm">Coming Soon</td>
                  <td className="text-center py-3 px-2 text-white/70 text-sm">Coming Soon</td>
                </tr>
                <tr>
                  <td className="py-3 px-2 text-white/90">Analytics</td>
                  <td className="text-center py-3 px-2 text-white/70">Basic</td>
                  <td className="text-center py-3 px-2 text-white/90">Advanced</td>
                  <td className="text-center py-3 px-2 text-white/90">Advanced</td>
                  <td className="text-center py-3 px-2 text-white/90">Advanced</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card border border-white/30 backdrop-blur-xl bg-white/20 rounded-xl p-4 text-center">
          <p className="text-sm text-white">
            <strong>Note:</strong> Free trial is automatically activated when you register. You get access to the first test of each type (Mock, PYQ, AI). Upgrade anytime for unlimited access!
          </p>
        </div>
      </div>
    </div>
  );
}