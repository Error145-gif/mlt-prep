import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, FileText, BookMarked, Brain, Trophy, BookOpen, TrendingUp, TrendingDown } from "lucide-react";

interface PerformanceBreakdownProps {
  stats: {
    mockTests: { avgScore: number };
    pyqTests: { avgScore: number };
    aiTests: { avgScore: number };
    strongestSubject: string;
    weakestSubject: string;
    improvementRate: number;
  };
}

export default function PerformanceBreakdown({ stats }: PerformanceBreakdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="glass-card border-white/30 backdrop-blur-xl bg-gradient-to-br from-white/10 via-purple-500/10 to-pink-500/10 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50">
              <BarChart className="h-5 w-5 text-white" />
            </div>
            Performance Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mock Tests */}
            <motion.div 
              className="space-y-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-white font-semibold">Mock Tests</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/90 text-sm">Accuracy</span>
                  <span className="text-white font-bold text-lg">{stats?.mockTests?.avgScore || 0}%</span>
                </div>
                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(stats?.mockTests?.avgScore || 0, 100)}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full shadow-lg shadow-blue-500/50"
                  />
                </div>
              </div>
            </motion.div>

            {/* PYQ Tests */}
            <motion.div 
              className="space-y-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30">
                  <BookMarked className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-white font-semibold">PYQ Tests</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/90 text-sm">Accuracy</span>
                  <span className="text-white font-bold text-lg">{stats?.pyqTests?.avgScore || 0}%</span>
                </div>
                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(stats?.pyqTests?.avgScore || 0, 100)}%` }}
                    transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                    className="absolute h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full shadow-lg shadow-green-500/50"
                  />
                </div>
              </div>
            </motion.div>

            {/* AI Tests */}
            <motion.div 
              className="space-y-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-white font-semibold">AI Tests</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/90 text-sm">Accuracy</span>
                  <span className="text-white font-bold text-lg">{stats?.aiTests?.avgScore || 0}%</span>
                </div>
                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(stats?.aiTests?.avgScore || 0, 100)}%` }}
                    transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                    className="absolute h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full shadow-lg shadow-purple-500/50"
                  />
                </div>
              </div>
            </motion.div>

            {/* Strongest Subject */}
            <motion.div 
              className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/30">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-white font-semibold">Strongest Subject</h3>
              </div>
              <div className="text-white/90 text-xl font-bold">{stats?.strongestSubject || "N/A"}</div>
            </motion.div>

            {/* Weakest Subject */}
            <motion.div 
              className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-sm border border-red-400/30 hover:border-red-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 shadow-lg shadow-red-500/30">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-white font-semibold">Needs Improvement</h3>
              </div>
              <div className="text-white/90 text-xl font-bold">{stats?.weakestSubject || "N/A"}</div>
            </motion.div>

            {/* Improvement Rate */}
            <motion.div 
              className={`space-y-3 p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:shadow-lg ${
                stats.improvementRate >= 0 
                  ? 'bg-gradient-to-br from-green-500/10 to-teal-500/10 border-green-400/30 hover:border-green-400/50 hover:shadow-green-500/20' 
                  : 'bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-400/30 hover:border-red-400/50 hover:shadow-red-500/20'
              }`}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg shadow-lg ${
                  stats.improvementRate >= 0 
                    ? 'bg-gradient-to-br from-green-500 to-teal-500 shadow-green-500/30' 
                    : 'bg-gradient-to-br from-red-500 to-orange-500 shadow-red-500/30'
                }`}>
                  {stats.improvementRate >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-white" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-white" />
                  )}
                </div>
                <h3 className="text-white font-semibold">Last Test Change</h3>
              </div>
              <div className={`text-2xl font-bold ${(stats?.improvementRate || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {(stats?.improvementRate || 0) >= 0 ? '+' : ''}{stats?.improvementRate || 0}%
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
