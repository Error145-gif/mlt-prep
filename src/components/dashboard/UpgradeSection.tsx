import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Sparkles, CheckCircle } from "lucide-react";

export default function UpgradeSection() {
  const navigate = useNavigate();

  const benefits = [
    "Topic-wise weak area analysis",
    "Exam readiness score",
    "Rank & leaderboard",
    "Unlimited practice"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card className="glass-card border-white/30 backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            Improve Faster with Premium
          </CardTitle>
        </CardHeader>
        <CardContent>
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
          <Button
            onClick={() => navigate("/subscription-plans")}
            size="lg"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/50"
          >
            Upgrade to Premium →
          </Button>
          <p className="text-white/70 text-xs text-center mt-3">
            Students using Premium improve 2x faster.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
