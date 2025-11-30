import { Card } from "@/components/ui/card";

interface RankAnalyticsProps {
  rank: number;
  totalCandidates: number;
  avgTimePerQuestion: number;
  speedPercentile: number;
}

export default function RankAnalytics({ rank, totalCandidates, avgTimePerQuestion, speedPercentile }: RankAnalyticsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-6 bg-white shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🏆 Leaderboard Position</h3>
        <div className="space-y-2">
          <p className="text-gray-700">Total Students Attempted: <span className="font-bold">{totalCandidates}</span></p>
          <p className="text-gray-700">Your Rank: <span className="font-bold text-orange-600">#{rank}</span></p>
          <div className="mt-4 bg-gradient-to-r from-orange-100 to-yellow-100 p-4 rounded-lg">
            <p className="text-sm text-gray-800">
              {rank <= totalCandidates * 0.1 ? "🌟 You're in the top 10%!" : 
               rank <= totalCandidates * 0.25 ? "⭐ You're in the top 25%!" :
               "Keep practicing to improve your rank!"}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">⏱️ Time Analytics</h3>
        <div className="space-y-2">
          <p className="text-gray-700">Avg Time/Question: <span className="font-bold">{avgTimePerQuestion.toFixed(1)}s</span></p>
          <p className="text-gray-700">Your Speed: 
            <span className={`font-bold ml-2 ${speedPercentile >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
              {speedPercentile >= 70 ? '🔥 Faster than ' + speedPercentile + '% of users' : 
               '⏳ Try to answer a bit quicker next time'}
            </span>
          </p>
        </div>
      </Card>
    </div>
  );
}
