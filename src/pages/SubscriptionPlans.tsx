import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, TrendingUp, Crown, Zap, Gift } from "lucide-react";
import { toast } from "sonner";
import StudentNav from "@/components/StudentNav";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SubscriptionPlans() {
  const navigate = useNavigate();
  const user = useQuery(api.users.getCurrentUser);
  const subscription = useQuery(api.student.getSubscriptionAccess);
  const createOrder = useMutation(api.cashfree.createOrder);
  const applyCoupon = useMutation(api.coupons.applyCoupon);
  
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const plans = [
    {
      id: "monthly",
      name: "Monthly Starter",
      subtitle: "Try Before You Commit",
      price: 99,
      originalPrice: 99,
      duration: 30,
      popular: false,
      savings: 0,
      description: "Perfect for testing the platform before committing to longer plans.",
      features: [
        "Unlimited Mock Tests",
        "20 PYQ Sets with explanations",
        "AI-based practice questions",
        "Rank & leaderboard access",
        "Full test analysis",
        "Detailed analysis locked (watch banner ads)",
        "Banner ads shown"
      ],
      bestFor: "Students who want to test the platform first",
      whoIsThisFor: "First-time users exploring the platform",
      badge: null,
      icon: Sparkles,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "4month",
      name: "4-Month Plan",
      subtitle: "Most Popular - Best Value",
      price: 399,
      originalPrice: 496,
      duration: 120,
      popular: true,
      savings: 97,
      savingsPercent: 20,
      description: "Complete one exam preparation cycle without interruptions. Most students choose this!",
      studentCount: "223+ students already preparing with us!",
      features: [
        "Everything in Monthly Starter",
        "Extended access for 4 months",
        "Consistent practice & progress tracking",
        "No renewal stress during preparation",
        "Library Access not included",
        "Priority support"
      ],
      bestFor: "Serious exam aspirants (Recommended)",
      whoIsThisFor: "Students with upcoming exams in 3-4 months • Those who want uninterrupted preparation",
      badge: "🔥 MOST POPULAR",
      icon: TrendingUp,
      color: "from-orange-500 to-red-500"
    },
    {
      id: "yearly",
      name: "Yearly Plan",
      subtitle: "Maximum Savings - Long-term Prep",
      price: 599,
      originalPrice: 1188,
      duration: 365,
      popular: false,
      savings: 589,
      savingsPercent: 50,
      description: "Best for repeat aspirants and long-term government exam preparation.",
      features: [
        "Full access for 1 year",
        "Ideal for repeaters & long-term goals",
        "Full Library Access",
        "Lifetime doubt support",
        "Early access to new features"
      ],
      bestFor: "Long-term preparation & repeat aspirants",
      whoIsThisFor: "Students preparing for multiple attempts • Long-term government exam preparation",
      badge: "SAVE ₹589",
      icon: Crown,
      color: "from-purple-500 to-pink-500"
    }
  ];

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    if (!selectedPlan) {
      toast.error("Please select a plan first");
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const plan = plans.find(p => p.id === selectedPlan);
      if (!plan) return;

      const result = await applyCoupon({
        code: couponCode.trim().toUpperCase(),
        orderAmount: plan.price,
      });

      setAppliedCoupon(result);
      toast.success(`Coupon applied! You saved ₹${result.discountAmount}`);
    } catch (error: any) {
      toast.error(error.message || "Invalid coupon code");
      setAppliedCoupon(null);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast.error("Please login to subscribe");
      navigate("/auth");
      return;
    }

    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    setSelectedPlan(planId);

    try {
      let finalAmount = plan.price;
      let couponId = undefined;

      if (appliedCoupon && appliedCoupon.couponId) {
        finalAmount = appliedCoupon.finalAmount;
        couponId = appliedCoupon.couponId;
      }

      const order = await createOrder({
        planName: plan.name,
        amount: finalAmount,
        duration: plan.duration,
        couponId,
      });

      if (order.paymentSessionId) {
        navigate(`/payment-summary?orderId=${order.orderId}`);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create order");
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <StudentNav />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1">
            Choose Your Plan
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Start Your MLT Exam Preparation
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Select the perfect plan for your exam preparation journey
          </p>
        </div>

        {/* Free User Access Info */}
        <Card className="mb-8 border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Gift className="w-6 h-6 text-green-600" />
              <CardTitle className="text-green-700">Try First - Free Access</CardTitle>
            </div>
            <CardDescription className="text-green-600">
              Every free user gets one-time base access (no ads required)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-green-700">
                <Check className="w-5 h-5" />
                <span>1 Mock Test</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <Check className="w-5 h-5" />
                <span>1 PYQ Test</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <Check className="w-5 h-5" />
                <span>1 AI-based Test</span>
              </div>
            </div>
            
            <div className="border-t border-green-200 pt-4 mt-4">
              <div className="flex items-start gap-2 mb-2">
                <Zap className="w-5 h-5 text-amber-600 mt-1" />
                <div>
                  <p className="font-semibold text-amber-700">Extra Access (Ad-Based)</p>
                  <p className="text-sm text-slate-600">After base access: Watch 1 ad = Unlock 1 test</p>
                  <p className="text-sm text-slate-600">Maximum 2 ad-unlocks per day (resets every 24 hours)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Subscription Status */}
        {subscription?.isPaid && (
          <Card className="mb-8 border-2 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Check className="w-6 h-6" />
                Active Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-lg font-semibold">{subscription.planName}</p>
                <p className="text-sm text-slate-600">
                  Valid until: {new Date(subscription.endDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-slate-600">
                  Days remaining: {subscription.daysRemaining}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isActive = subscription?.isPaid && subscription?.planName === plan.name;
            
            return (
              <Card 
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  plan.popular 
                    ? 'border-4 border-orange-500 scale-105 shadow-xl' 
                    : 'border-2 hover:border-blue-300'
                } ${isActive ? 'ring-4 ring-green-500' : ''}`}
              >
                {plan.badge && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                    {plan.badge}
                  </div>
                )}

                <CardHeader className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div>
                    <CardTitle className="text-2xl mb-1">{plan.name}</CardTitle>
                    <CardDescription className="text-base font-medium">
                      {plan.subtitle}
                    </CardDescription>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">₹{plan.price}</span>
                      {plan.originalPrice > plan.price && (
                        <span className="text-lg text-slate-400 line-through">
                          ₹{plan.originalPrice}
                        </span>
                      )}
                    </div>
                    {plan.savings > 0 && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        SAVE ₹{plan.savings} • {plan.savingsPercent}% OFF
                      </Badge>
                    )}
                    <p className="text-sm text-slate-500">
                      Just ₹{Math.round(plan.price / (plan.duration / 30))}/month
                    </p>
                  </div>

                  <p className="text-sm text-slate-600">{plan.description}</p>
                  {plan.studentCount && (
                    <p className="text-sm font-semibold text-blue-600">{plan.studentCount}</p>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <p className="font-semibold text-sm text-slate-700">What you get:</p>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <p className="text-sm font-semibold text-slate-700">Best for:</p>
                    <p className="text-sm text-slate-600">{plan.bestFor}</p>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <p className="text-sm font-semibold text-slate-700">Who is this for:</p>
                    <p className="text-sm text-slate-600">{plan.whoIsThisFor}</p>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-3">
                  {isActive ? (
                    <Button className="w-full" variant="outline" disabled>
                      <Check className="w-4 h-4 mr-2" />
                      Already Subscribed
                    </Button>
                  ) : (
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600' : ''}`}
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={selectedPlan === plan.id}
                    >
                      {selectedPlan === plan.id ? "Processing..." : "Subscribe Now"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Coupon Section */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-lg">Have a Coupon Code?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="coupon">Coupon Code</Label>
                <Input
                  id="coupon"
                  placeholder="Enter code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={!selectedPlan}
                />
              </div>
              <Button 
                onClick={handleApplyCoupon}
                disabled={isApplyingCoupon || !selectedPlan || !couponCode.trim()}
                className="mt-6"
              >
                {isApplyingCoupon ? "Applying..." : "Apply"}
              </Button>
            </div>
            
            {appliedCoupon && selectedPlan && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 font-medium">
                  Coupon applied! You saved ₹{appliedCoupon.discountAmount}
                </p>
                <p className="text-sm text-green-600">
                  Final amount: ₹{appliedCoupon.finalAmount}
                </p>
              </div>
            )}
            
            {!selectedPlan && (
              <p className="text-sm text-slate-500">
                Select a plan above to apply a coupon
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}