import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Sparkles, CheckCircle, Clock, TrendingUp } from "lucide-react";

export default function UpgradeSection() {
  const navigate = useNavigate();

  const benefits = [
    "Unlimited Mock Tests & PYQs",
    "Topic-wise weak area analysis",
    "Exam readiness score & rank",
    "Detailed performance analytics"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card className="glass-card border-white/30 backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 relative overflow-hidden">
        {/* Urgency Badge */}
        <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
          Limited Offer
        </div>

        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            Unlock Full Access - Save ₹97 Today!
          </CardTitle>
          <p className="text-white/80 text-sm mt-2">
            Join 223+ students preparing smarter with Premium
          </p>
        </CardHeader>
        <CardContent>
          {/* Pricing Highlight */}
          <div className="bg-white/10 rounded-xl p-4 mb-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-xs line-through">₹496</p>
                <p className="text-3xl font-bold text-white">₹399</p>
                <p className="text-white/80 text-sm">for 4 months</p>
              </div>
              <div className="text-right">
                <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Save 20%
                </div>
                <p className="text-white/70 text-xs mt-1">₹99/month</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-white/90">{benefit}</span>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <TrendingUp className="h-5 w-5 text-green-400 mx-auto mb-1" />
              <p className="text-white font-bold text-lg">2x Faster</p>
              <p className="text-white/70 text-xs">Improvement</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <Clock className="h-5 w-5 text-blue-400 mx-auto mb-1" />
              <p className="text-white font-bold text-lg">5000+</p>
              <p className="text-white/70 text-xs">Questions</p>
            </div>
          </div>

          <Button
            onClick={() => navigate("/subscription-plans")}
            size="lg"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/50"
          >
            Upgrade to Premium - Save ₹97 →
          </Button>
          <p className="text-white/70 text-xs text-center mt-3">
            ✓ 100% Money-back guarantee • ✓ Cancel anytime
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}