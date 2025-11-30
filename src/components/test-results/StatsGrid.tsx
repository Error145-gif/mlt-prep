import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, MinusCircle, Trophy, Target } from "lucide-react";

interface StatsGridProps {
  correctAnswers: number;
  incorrectAnswers: number;
  skippedAnswers: number;
  marksObtained: number;
  totalMarks: number;
  rank: number;
  totalCandidates: number;
}

export default function StatsGrid({ correctAnswers, incorrectAnswers, skippedAnswers, marksObtained, totalMarks, rank, totalCandidates }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-300 text-center">
        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
        <p className="text-sm text-green-700 font-medium">Correct</p>
        <p className="text-3xl font-bold text-green-900">{correctAnswers}</p>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-300 text-center">
        <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
        <p className="text-sm text-red-700 font-medium">Wrong</p>
        <p className="text-3xl font-bold text-red-900">{incorrectAnswers}</p>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 text-center">
        <MinusCircle className="h-8 w-8 text-gray-600 mx-auto mb-2" />
        <p className="text-sm text-gray-700 font-medium">Skipped</p>
        <p className="text-3xl font-bold text-gray-900">{skippedAnswers}</p>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300 text-center">
        <Trophy className="h-8 w-8 text-purple-600 mx-auto mb-2" />
        <p className="text-sm text-purple-700 font-medium">Marks</p>
        <p className="text-2xl font-bold text-purple-900">{marksObtained}/{totalMarks}</p>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300 text-center">
        <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
        <p className="text-sm text-orange-700 font-medium">Rank</p>
        <p className="text-2xl font-bold text-orange-900">#{rank}</p>
        <p className="text-xs text-orange-600">of {totalCandidates}</p>
      </Card>
    </div>
  );
}
