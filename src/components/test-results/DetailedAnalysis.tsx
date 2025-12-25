import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Crown,
  TrendingUp,
  ChevronRight,
  XCircle
} from "lucide-react";
import { useNavigate } from "react-router";

interface Question {
  _id: string;
  question: string;
  topic?: string;
  subtopic?: string;
  userAnswer?: string;
  correctAnswer: string;
  isCorrect?: boolean;
  explanation?: string;
}

interface DetailedAnalysisProps {
  questions: Question[];
  timeSpent: number; // in seconds
  totalQuestions: number;
}

export default function DetailedAnalysis({ questions, timeSpent, totalQuestions }: DetailedAnalysisProps) {
  const navigate = useNavigate();

  // --- Data Processing ---
  const incorrectQuestions = questions.filter(q => q.userAnswer && !q.isCorrect);
  
  // Group mistakes by topic
  const mistakesByTopic: Record<string, number> = {};
  incorrectQuestions.forEach(q => {
    const topic = q.topic || "General";
    mistakesByTopic[topic] = (mistakesByTopic[topic] || 0) + 1;
  });

  // Find weakest topic
  const sortedTopics = Object.entries(mistakesByTopic).sort((a, b) => b[1] - a[1]);
  const weakestTopic = sortedTopics[0];
  const marksLost = incorrectQuestions.length;

  // Time Analysis
  const avgTimePerQuestion = totalQuestions > 0 ? Math.round(timeSpent / totalQuestions) : 0;
  
  // Topic Performance
  const topicStats: Record<string, { total: number; correct: number }> = {};
  questions.forEach(q => {
    const topic = q.topic || "General";
    if (!topicStats[topic]) topicStats[topic] = { total: 0, correct: 0 };
    topicStats[topic].total++;
    if (q.isCorrect) topicStats[topic].correct++;
  });

  const topicPerformance = Object.entries(topicStats).map(([topic, stats]) => ({
    topic,
    accuracy: Math.round((stats.correct / stats.total) * 100),
    total: stats.total
  })).sort((a, b) => a.accuracy - b.accuracy); // Weakest first

  return (
    <Card className="overflow-hidden border-0 shadow-2xl bg-white rounded-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-6 w-6 text-yellow-300 fill-yellow-300" />
              <h2 className="text-2xl font-bold">Detailed Analysis</h2>
            </div>
            <p className="text-purple-100 text-sm opacity-90">
              Identify your mistakes, improve weak areas, and boost your score.
            </p>
          </div>
          <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 px-3 py-1 backdrop-blur-sm cursor-default">
            <CheckCircle2 className="h-3 w-3 mr-1 text-green-300" /> Premium Unlocked
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Mistake Analysis Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <h3>Mistake Analysis</h3>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4 text-red-800 font-medium">
              <XCircle className="h-5 w-5 text-red-500" />
              <p>You lost <span className="font-bold">{marksLost} marks</span> due to mistakes in {weakestTopic ? weakestTopic[0] : "various topics"}</p>
            </div>

            <div className="space-y-3">
              {incorrectQuestions.slice(0, 3).map((q, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 shadow-sm border border-red-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                        {q.topic || "General"}
                      </Badge>
                      <span className="text-xs text-gray-500 line-clamp-1">{q.subtopic}</span>
                    </div>
                    <p className="text-gray-900 font-medium line-clamp-1">{q.question}</p>
                    <p className="text-xs text-gray-500">
                      Your Answer: <span className="text-red-500 line-through mr-2">{q.userAnswer}</span>
                      Correct Answer: <span className="text-green-600 font-medium">{q.correctAnswer}</span>
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 shrink-0"
                    onClick={() => navigate("/practice")}
                  >
                    View Explanation <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              ))}
              {incorrectQuestions.length === 0 && (
                <div className="text-center py-4 text-green-600 font-medium">
                  No mistakes found! Excellent work.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Time Analysis Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
            <Clock className="h-5 w-5 text-orange-500" />
            <h3>Time Analysis</h3>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: Avg Time */}
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average time per question</p>
                  <p className="text-2xl font-bold text-gray-900">{avgTimePerQuestion} seconds</p>
                  <p className="text-xs text-orange-600 mt-1">
                    {avgTimePerQuestion > 60 ? "Slower than average" : "Good pace"}
                  </p>
                </div>
              </div>
              
              {/* Right: Fast/Slow info */}
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Accuracy Speed</p>
                  <p className="text-lg font-bold text-gray-900">
                    {avgTimePerQuestion < 45 ? "Fast & Accurate" : "Steady Pace"}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {avgTimePerQuestion < 45 ? "Great job maintaining speed!" : "Focus on accuracy first."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Topic Weaknesses Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
            <TrendingUp className="h-5 w-5 text-pink-500" />
            <h3>Topic Weaknesses</h3>
          </div>
          <div className="bg-pink-50 border border-pink-100 rounded-xl p-6">
            <div className="flex flex-wrap gap-6 justify-between items-center">
              {topicPerformance.slice(0, 3).map((topic, idx) => (
                <div key={idx} className="flex items-center gap-3 min-w-[150px]">
                  <div className={`w-2 h-2 rounded-full ${topic.accuracy < 50 ? 'bg-red-500' : 'bg-green-500'}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{topic.topic}</p>
                    <p className={`text-lg font-bold ${topic.accuracy < 50 ? 'text-red-600' : 'text-green-600'}`}>
                      {topic.accuracy}%
                    </p>
                  </div>
                </div>
              ))}
              {topicPerformance.length === 0 && (
                <p className="text-gray-500 w-full text-center">No topic data available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}