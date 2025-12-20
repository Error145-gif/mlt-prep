import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Sparkles } from "lucide-react";

export default function NextStepCard() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="glass-card border-white/30 backdrop-blur-xl bg-gradient-to-br from-orange-400/30 via-yellow-400/30 to-pink-400/30 shadow-2xl">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="p-3 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 shadow-lg"
            >
              <Sparkles className="h-6 w-6 text-white" />
            </motion.div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">Your Next Step</h2>
              <p className="text-white/90 text-lg mb-4">
                Start with a Free Test to check your exam level
              </p>
              <Button
                onClick={() => navigate("/tests/mock")}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold text-base px-8 py-6 shadow-lg shadow-orange-500/50"
              >
                START FREE TEST →
              </Button>
              <p className="text-white/80 text-sm mt-3">
                Takes 10 minutes · No payment required
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
