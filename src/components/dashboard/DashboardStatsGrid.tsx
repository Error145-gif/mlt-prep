import { motion } from "framer-motion";
import { Target, TrendingUp, TrendingDown } from "lucide-react";

interface DashboardStatsGridProps {
  stats: {
    strongestSubject: string;
    weakestSubject: string;
    overallAccuracy: number;
    totalTests: number;
    totalQuestionsAttempted: number;
    avgTimePerQuestion: number;
  };
  isFreeTrialUser?: boolean;
}

export default function DashboardStatsGrid({ stats, isFreeTrialUser = false }: DashboardStatsGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {/* Strongest Subject - Always visible */}
      <div className="glass-card border border-green-500/50 backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-5 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-5 w-5 text-green-400" />
          <h3 className="text-white font-semibold">Strongest Subject</h3>
        </div>
        <p className="text-3xl font-bold text-white">{stats.strongestSubject}</p>
        <p className="text-white/70 text-sm mt-1">Keep up the great work!</p>
      </div>

      {/* Needs Improvement - Always visible with disclaimer for free trial */}
      <div className="glass-card border border-red-500/50 backdrop-blur-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 p-5 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <TrendingDown className="h-5 w-5 text-red-400" />
          <h3 className="text-white font-semibold">Needs Improvement</h3>
        </div>
        <p className="text-3xl font-bold text-white">{stats.weakestSubject}</p>
        {isFreeTrialUser ? (
          <p className="text-orange-300 text-sm mt-1 font-medium">Fix weak areas with Premium access</p>
        ) : (
          <p className="text-white/70 text-sm mt-1">Focus here for better results</p>
        )}
      </div>

      {/* Exam Readiness - Show score only for free trial */}
      <div className="glass-card border border-blue-500/50 backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-5 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-5 w-5 text-blue-400" />
          <h3 className="text-white font-semibold">Exam Readiness</h3>
        </div>
        <p className="text-3xl font-bold text-white">{stats.overallAccuracy}%</p>
        {isFreeTrialUser ? (
          <p className="text-red-300 text-sm mt-1 font-medium">❌ Not Exam Ready – Trial access cannot improve this score</p>
        ) : (
          <p className="text-white/70 text-sm mt-1">
            {stats.overallAccuracy >= 80 ? "You're exam ready! 🎯" : "Keep practicing to improve"}
          </p>
        )}
      </div>
    </motion.div>
  );
}