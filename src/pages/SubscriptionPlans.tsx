import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, TrendingUp, Crown, Zap, Gift, Star } from "lucide-react";
import { toast } from "sonner";
import StudentNav from "@/components/StudentNav";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SubscriptionPlans() {
  const navigate = useNavigate();
  const user = useQuery(api.users.currentUser);
  const subscription = useQuery(api.student.checkSubscriptionAccess);
  const referralStats = useQuery(api.referrals.getReferralStats);
  
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [starsToUse, setStarsToUse] = useState<{ [key: string]: number }>({});

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
      studentCount: "250+ students already preparing with us!",
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

  const handleStarsChange = (planId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    const maxStarsAllowed = Math.floor((plan.price * 50) / 100); // 50% max
    const availableStars = referralStats?.wallet?.availableStars || 0;
    const maxUsable = Math.min(maxStarsAllowed, availableStars);

    setStarsToUse({
      ...starsToUse,
      [planId]: Math.min(numValue, maxUsable)
    });
  };

  const calculateFinalPrice = (planId: string, originalPrice: number) => {
    const stars = starsToUse[planId] || 0;
    return originalPrice - stars;
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
      const starsUsed = starsToUse[planId] || 0;
      const finalPrice = calculateFinalPrice(planId, plan.price);

      // Navigate to payment summary with plan details and stars
      navigate(`/payment-summary?name=${encodeURIComponent(plan.name)}&price=${plan.price}&duration=${plan.duration}&starsUsed=${starsUsed}&finalPrice=${finalPrice}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create order");
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600">
      <StudentNav />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <Badge className="mb-4 bg-white/20 backdrop-blur-sm text-white px-4 py-1 border-0">
            Choose Your Plan
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Start Your MLT Exam Preparation
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Select the perfect plan for your exam preparation journey
          </p>
        </div>

        {/* Star Wallet Display */}
        {referralStats && referralStats.wallet.availableStars > 0 && (
          <Card className="mb-8 border-2 border-yellow-300 bg-gradient-to-r from-yellow-400 to-orange-400 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-purple-700 fill-purple-700" />
                <CardTitle className="text-purple-900">Your Star Wallet</CardTitle>
              </div>
              <CardDescription className="text-purple-800 font-medium">
                Use your Stars to get discounts on subscriptions (up to 50% off)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-purple-900">
                  {referralStats.wallet.availableStars} Stars
                </div>
                <div className="text-sm text-purple-800">
                  = ₹{referralStats.wallet.availableStars} discount available
                </div>
              </div>
              {referralStats.expiringStars > 0 && (
                <p className="text-sm text-purple-800 mt-2">
                  ⚠️ {referralStats.expiringStars} Stars expiring in next 30 days
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Free User Access Info */}
        <Card className="mb-8 border-2 border-yellow-300 bg-gradient-to-r from-yellow-400 to-orange-400 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Gift className="w-6 h-6 text-purple-700" />
              <CardTitle className="text-purple-900">Try First - Free Access</CardTitle>
            </div>
            <CardDescription className="text-purple-800 font-medium">
              Every free user gets one-time base access (no ads required)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-purple-900 font-medium">
                <Check className="w-5 h-5" />
                <span>1 Mock Test</span>
              </div>
              <div className="flex items-center gap-2 text-purple-900 font-medium">
                <Check className="w-5 h-5" />
                <span>1 PYQ Test</span>
              </div>
              <div className="flex items-center gap-2 text-purple-900 font-medium">
                <Check className="w-5 h-5" />
                <span>1 AI-based Test</span>
              </div>
            </div>
            
            <div className="border-t border-purple-300 pt-4 mt-4">
              <div className="flex items-start gap-2 mb-2">
                <Zap className="w-5 h-5 text-purple-700 mt-1" />
                <div>
                  <p className="font-semibold text-purple-900">Extra Access (Ad-Based)</p>
                  <p className="text-sm text-purple-800">After base access: Watch 1 ad = Unlock 1 test</p>
                  <p className="text-sm text-purple-800">Maximum 2 ad-unlocks per day (resets every 24 hours)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Subscription Status */}
        {subscription?.isPaid && (
          <Card className="mb-8 border-2 border-green-300 bg-white/95 backdrop-blur-sm shadow-xl">
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
            const starsUsed = starsToUse[plan.id] || 0;
            const finalPrice = calculateFinalPrice(plan.id, plan.price);
            const maxStarsAllowed = Math.floor((plan.price * 50) / 100);
            const availableStars = referralStats?.wallet?.availableStars || 0;
            const maxUsable = Math.min(maxStarsAllowed, availableStars);
            
            return (
              <Card 
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl bg-white/95 backdrop-blur-sm ${
                  plan.popular 
                    ? 'border-4 border-orange-400 scale-105 shadow-2xl' 
                    : 'border-2 border-white/50 hover:border-white'
                } ${isActive ? 'ring-4 ring-green-400' : ''}`}
              >
                {plan.badge && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg shadow-lg">
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
                  {/* Star Usage Section */}
                  {!isActive && availableStars > 0 && (
                    <div className="border-2 border-yellow-300 rounded-lg p-4 bg-yellow-50 space-y-3">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                        <Label className="font-semibold text-slate-700">Use Your Stars</Label>
                      </div>
                      <div className="space-y-2">
                        <Input
                          type="number"
                          min="0"
                          max={maxUsable}
                          value={starsUsed}
                          onChange={(e) => handleStarsChange(plan.id, e.target.value)}
                          placeholder="Enter stars to use"
                          className="border-yellow-300"
                        />
                        <p className="text-xs text-slate-600">
                          Max {maxUsable} Stars (50% of ₹{plan.price})
                        </p>
                      </div>
                      {starsUsed > 0 && (
                        <div className="space-y-1 pt-2 border-t border-yellow-300">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Original Price:</span>
                            <span className="font-semibold">₹{plan.price}</span>
                          </div>
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Star Discount:</span>
                            <span className="font-semibold">-₹{starsUsed}</span>
                          </div>
                          <div className="flex justify-between text-lg font-bold text-purple-700 pt-1 border-t border-yellow-300">
                            <span>Final Price:</span>
                            <span>₹{finalPrice}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

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
                      {selectedPlan === plan.id ? "Processing..." : starsUsed > 0 ? `Pay ₹${finalPrice} (${starsUsed} Stars Applied)` : "Subscribe Now"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Motivational Section */}
        <Card className="max-w-3xl mx-auto bg-gradient-to-br from-orange-500 to-pink-600 border-0 shadow-2xl">
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Crown className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-3xl font-bold text-white">
                Join 250+ Students Already Preparing!
              </h3>
              <p className="text-xl text-white/90 font-medium">
                Don't let this opportunity slip away
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 py-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">100%</div>
                <div className="text-sm text-white/90">Money-back Guarantee</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-sm text-white/90">Doubt Support</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">∞</div>
                <div className="text-sm text-white/90">Unlimited Practice</div>
              </div>
            </div>

            <div className="space-y-3 text-white/90 text-left bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                <p className="text-base">
                  <strong className="text-white">Start preparing today</strong> - Instant access to all features
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                <p className="text-base">
                  <strong className="text-white">Proven results</strong> - Students improving scores by 30%+
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                <p className="text-base">
                  <strong className="text-white">Risk-free</strong> - Cancel anytime, full refund within 7 days
                </p>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-2xl font-bold text-white mb-2">
                🎯 Your Dream Job is Just One Subscription Away!
              </p>
              <p className="text-lg text-white/90">
                Select your plan above and start your journey to success
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}