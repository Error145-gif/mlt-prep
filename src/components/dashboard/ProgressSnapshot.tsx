import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { TrendingUp, Lock, BarChart2 } from "lucide-react";

interface ProgressSnapshotProps {
  stats: {
    totalTests: number;
    overallAccuracy: number;
  };
  isAnalyticsLocked?: boolean;
  onLockedCTA?: () => void;
}

export default function ProgressSnapshot({ stats, isAnalyticsLocked, onLockedCTA }: ProgressSnapshotProps) {
  const navigate = useNavigate();

  const handleDetailedClick = () => {
    if (isAnalyticsLocked) {
      if (onLockedCTA) {
        onLockedCTA();
      } else {
        navigate("/subscription-plans");
      }
      return;
    }
    navigate("/overall-analytics");
  };

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
            {isAnalyticsLocked ? (
              <>
                <p className="text-white/80 text-sm mb-3 flex items-center gap-2">
                  <Lock className="h-3 w-3 text-orange-300" />
                  View your comprehensive performance analytics.
                </p>
                <Button
                  onClick={handleDetailedClick}
                  variant="outline"
                  className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10 font-semibold"
                >
                  📊 View Detailed Analysis →
                </Button>
              </>
            ) : (
              <>
                <p className="text-white/80 text-sm mb-3 flex items-center gap-2">
                  <BarChart2 className="h-3 w-3 text-green-300" />
                  View your comprehensive performance analytics.
                </p>
                <Button
                  onClick={handleDetailedClick}
                  variant="outline"
                  className="w-full border-2 border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold"
                >
                  📊 View Detailed Analysis →
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}