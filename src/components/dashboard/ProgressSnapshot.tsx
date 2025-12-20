import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { TrendingUp } from "lucide-react";

interface ProgressSnapshotProps {
  stats: {
    totalTests: number;
    overallAccuracy: number;
  };
  isFreeTrialUser?: boolean;
}

export default function ProgressSnapshot({ stats }: ProgressSnapshotProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your Current Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6 mb-4">
            <div>
              <p className="text-white/70 text-sm mb-1">Tests Attempted</p>
              <p className="text-3xl font-bold text-white">{stats.totalTests}</p>
            </div>
            <div>
              <p className="text-white/70 text-sm mb-1">Average Score</p>
              <p className="text-3xl font-bold text-white">{stats.overallAccuracy}%</p>
            </div>
            <div>
              <p className="text-white/70 text-sm mb-1">Last Test Score</p>
              <p className="text-3xl font-bold text-white">{stats.overallAccuracy}%</p>
            </div>
          </div>
          <div className="border-t border-white/20 pt-4">
            <p className="text-white/80 text-sm mb-3">
              Detailed topic-wise analysis is available with Premium.
            </p>
            <Button
              onClick={() => navigate("/subscription-plans")}
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              View Detailed Analysis →
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
