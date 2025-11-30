import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Clock, Target, Flame } from "lucide-react";

interface EngagementMetricsProps {
  stats: {
    totalStudyTime: number;
    avgQuestionsPerTest: number;
    consistencyStreak: number;
  };
}

export default function EngagementMetrics({ stats }: EngagementMetricsProps) {
  // Format time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Engagement Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-400" />
              <span className="text-white/90">Total Study Time</span>
            </div>
            <div className="text-2xl font-bold text-white">{formatTime(stats?.totalStudyTime || 0)}</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-400" />
              <span className="text-white/90">Avg Questions/Test</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats?.avgQuestionsPerTest || 0}</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-400" />
              <span className="text-white/90">Consistency Streak</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats?.consistencyStreak || 0} days</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
