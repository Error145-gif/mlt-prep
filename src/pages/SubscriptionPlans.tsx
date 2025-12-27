import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Target, Trophy, Menu, X } from "lucide-react";
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

  const hasPaidSubscription = subscriptionAccess?.hasAccess && subscriptionAccess?.isPaid;

  const handleSubscribe = (_planId: string, amount: number, planName: string, duration: number) => {
    if (hasPaidSubscription) {
      toast.error("You already have an active paid subscription! Check your dashboard for expiry date.");
      return;
    }

    navigate(`/payment-summary?name=${planName}&price=${amount}&duration=${duration}`);
  };

  const plans = [
    {
      id: "monthly",
      name: "Monthly Starter",
      subtitle: "Try Before You Commit",
      price: 99,
      duration: 30,
      icon: Target,
      description: "Perfect for testing the platform before committing to longer plans.",
      features: [
        "Unlimited Mock Tests",
        "All PYQ Sets with explanations",
        "AI-based practice questions",
        "Rank & leaderboard access",
        "Full performance analysis",
      ],
      bestFor: "Students who want to test the platform first",
      targetAudience: [
        "First-time users exploring the platform",
      ],
      buttonText: "Start for ₹99",
      highlighted: false,
      badge: "Try First",
    },
    {
      id: "4months",
      name: "4-Month Plan",
      subtitle: "🔥 Most Popular - Best Value",
      price: 399,
      originalPrice: 496,
      duration: 120,
      icon: Star,
      badge: "SAVE ₹97 • 20% OFF",
      description: "Complete one exam preparation cycle without interruptions. Most students choose this!",
      features: [
        "Everything in Monthly Starter",
        "Extended access for 4 months",
        "Consistent practice & progress tracking",
        "No renewal stress during preparation",
        "Library Access (Coming Soon)",
        "Priority support",
      ],
      bestFor: "Serious exam aspirants (Recommended)",
      targetAudience: [
        "Students with upcoming exams in 3-4 months",
        "Those who want uninterrupted preparation",
      ],
      buttonText: "Get 4 Months - Save ₹97",
      priceSubtext: "Just ₹99/month",
      highlighted: true,
      testimonial: "223+ students already preparing with us!",
    },
    {
      id: "yearly",
      name: "Yearly Plan",
      subtitle: "Maximum Savings - Long-term Prep",
      price: 599,
      originalPrice: 1188,
      duration: 365,
      icon: Trophy,
      badge: "SAVE ₹589 • 50% OFF",
      description: "Best for repeat aspirants and long-term government exam preparation.",
      features: [
        "Everything in 4-Month Plan",
        "Full access for 1 year",
        "Ideal for repeaters & long-term goals",
        "Library Access (Coming Soon)",
        "Lifetime doubt support",
        "Early access to new features",
      ],
      bestFor: "Long-term preparation & repeat aspirants",
      targetAudience: [
        "Students preparing for multiple attempts",
        "Long-term government exam preparation",
      ],
      buttonText: "Get Yearly - Save ₹589",
      priceSubtext: "Just ₹49/month",
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      <StudentNav />
      
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-3xl" />
      </div>

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
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8 pt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="inline-block bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full mb-2 animate-pulse">
            🔥 Limited Time Offer - Save Up To 50%
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Choose Your Plan
          </h1>
          <p className="text-white/90 text-lg drop-shadow-md">
            Join 223+ students • Upgrade anytime • 100% Money-back guarantee
          </p>
          {hasPaidSubscription && (
            <Badge className="mt-4 bg-white/90 text-purple-700 border-white backdrop-blur-xl text-sm px-4 py-2 shadow-lg">
              ✓ You have an active paid subscription
            </Badge>
          )}
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={plan.highlighted ? "md:scale-105" : ""}
            >
              <Card
                className={`h-full border-2 rounded-3xl overflow-hidden backdrop-blur-xl ${
                  plan.highlighted
                    ? "border-yellow-400/60 shadow-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30"
                    : "border-white/30 bg-white/20"
                }`}
              >
                {plan.badge && (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-center py-2 px-4">
                    <p className="text-sm font-bold text-purple-900 flex items-center justify-center gap-2">
                      <Star className="h-4 w-4 fill-purple-900" />
                      {plan.badge}
                    </p>
                  </div>
                )}

                <CardHeader className="space-y-3 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                        <plan.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                        <p className="text-white/70 text-sm mt-1">{plan.subtitle}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {plan.originalPrice && (
                      <div className="flex items-center gap-2">
                        <span className="text-white/60 line-through text-lg">₹{plan.originalPrice}</span>
                        <Badge className="bg-red-500/80 text-white border-red-400/50 text-xs">
                          Save ₹{plan.originalPrice - plan.price}
                        </Badge>
                      </div>
                    )}
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">₹{plan.price}</span>
                    </div>
                    {plan.priceSubtext && (
                      <p className="text-white/70 text-sm">{plan.priceSubtext}</p>
                    )}
                  </div>

                  <p className="text-white/90 text-sm leading-relaxed">{plan.description}</p>

                  {plan.testimonial && (
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                      <p className="text-white/90 text-xs font-medium">{plan.testimonial}</p>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* What you get */}
                  <div className="space-y-3">
                    <h3 className="text-white font-semibold">What you get:</h3>
                    <div className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-white/90 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Best for */}
                  {plan.bestFor && (
                    <div className="bg-white/10 rounded-lg p-3 space-y-2">
                      <p className="text-white/90 text-sm">
                        <span className="font-semibold">Best for:</span> {plan.bestFor}
                      </p>
                    </div>
                  )}

                  {/* Who is this for */}
                  {plan.targetAudience && (
                    <div className="space-y-2">
                      <h3 className="text-white font-semibold text-sm">Who is this for:</h3>
                      <div className="space-y-1">
                        {plan.targetAudience.map((audience, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-purple-300 flex-shrink-0 mt-0.5" />
                            <span className="text-white/80 text-sm">{audience}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSubscribe(plan.id, plan.price, plan.name, plan.duration)}
                    className={`w-full py-6 text-base font-semibold rounded-xl shadow-lg ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        : "bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-purple-900"
                    }`}
                    disabled={hasPaidSubscription}
                  >
                    {hasPaidSubscription ? "Already Subscribed" : plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card border border-white/30 backdrop-blur-xl bg-white/20 rounded-xl p-6 text-center"
        >
          <h3 className="text-xl font-bold text-white mb-4">Why Students Trust MLT Prep</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-3xl font-bold text-white">223+</p>
              <p className="text-white/80 text-sm">Active Students</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">5000+</p>
              <p className="text-white/80 text-sm">Practice Questions</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">95%</p>
              <p className="text-white/80 text-sm">Success Rate</p>
            </div>
          </div>
          <p className="text-white/90 text-sm mt-4">
            ✓ 100% Money-back guarantee • ✓ Cancel anytime • ✓ Secure payment
          </p>
        </motion.div>

        {/* Bottom Note */}
        <div className="glass-card border border-white/30 backdrop-blur-xl bg-white/20 rounded-xl p-4 text-center">
          <p className="text-sm text-white">
            <strong>Note:</strong> All plans include unlimited access to Mock Tests, PYQ Sets, and AI Questions. Library access will be unlocked automatically when released.
          </p>
        </div>
      </div>
    </div>
  );
}