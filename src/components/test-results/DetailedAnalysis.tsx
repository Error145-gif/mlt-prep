import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  Clock, 
  Target, 
  Brain, 
  CheckCircle2, 
  XCircle,
  ArrowRight,
  AlertCircle
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
  score: number;
}

export default function DetailedAnalysis({ questions, timeSpent, totalQuestions, score }: DetailedAnalysisProps) {
  const navigate = useNavigate();

  // --- Data Processing ---

  // 1. Mistake Analysis
  const incorrectQuestions = questions.filter(q => q.userAnswer && !q.isCorrect);
  const skippedQuestions = questions.filter(q => !q.userAnswer);
  
  // Group mistakes by topic
  const mistakesByTopic: Record<string, number> = {};
  incorrectQuestions.forEach(q => {
    const topic = q.topic || "General";
    mistakesByTopic[topic] = (mistakesByTopic[topic] || 0) + 1;
  });

  // Find weakest topic from mistakes
  const weakestTopic = Object.entries(mistakesByTopic).sort((a, b) => b[1] - a[1])[0];
  const marksLost = incorrectQuestions.length; // Assuming 1 mark per question

  // 2. Time Analysis
  const avgTimePerQuestion = totalQuestions > 0 ? Math.round(timeSpent / totalQuestions) : 0;
  
  // 3. Topic-wise Performance
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

  // 4. Negative Marking (Simulation)
  const negativeMarkingLoss = incorrectQuestions.length * 0.25;
  const potentialScore = score + (negativeMarkingLoss / totalQuestions * 100);

  // 5. Exam Readiness
  const getReadiness = () => {
    if (score >= 80) return { status: "Exam Ready", color: "text-green-600", icon: CheckCircle2, msg: "You are well prepared!" };
    if (score >= 50) return { status: "Borderline", color: "text-yellow-600", icon: AlertTriangle, msg: "Needs more focused practice." };
    return { status: "Not Ready", color: "text-red-600", icon: XCircle, msg: "Selection unlikely without improvement." };
  };
  const readiness = getReadiness();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Premium Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Detailed Analysis</h2>
        <Badge variant="secondary" className="bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 border-amber-200 px-3 py-1">
          👑 Premium Insight
        </Badge>
      </div>

      {/* SECTION 1: Mistake Analysis */}
      <Card className="p-6 border-l-4 border-l-red-500 shadow-md">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Mistake Analysis</h3>
            <p className="text-gray-600">
              You lost <span className="font-bold text-red-600">{marksLost} marks</span> mainly due to mistakes in 
              <span className="font-bold text-gray-900"> {weakestTopic ? weakestTopic[0] : "various topics"}</span>.
            </p>
          </div>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {incorrectQuestions.slice(0, 5).map((q, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="bg-white text-xs">{q.topic || "General"}</Badge>
                <span className="text-xs font-bold text-red-500">Incorrect</span>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-3 line-clamp-2">{q.question}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="p-2 bg-red-50 rounded border border-red-100">
                  <span className="text-xs text-red-600 font-semibold block mb-1">Your Answer</span>
                  {q.userAnswer}
                </div>
                <div className="p-2 bg-green-50 rounded border border-green-100">
                  <span className="text-xs text-green-600 font-semibold block mb-1">Correct Answer</span>
                  {q.correctAnswer}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2 flex-wrap">
                <span className="text-xs text-gray-500 font-medium">Potential Reason:</span>
                {["Concept Gap", "Misread", "Guess"].map((reason) => (
                  <Badge key={reason} variant="secondary" className="text-[10px] bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer">
                    {reason}?
                  </Badge>
                ))}
              </div>
            </div>
          ))}
          {incorrectQuestions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <p>No incorrect answers! Outstanding work.</p>
            </div>
          )}
        </div>
      </Card>

      {/* SECTION 2 & 4: Time & Negative Marking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Time Analysis */}
        <Card className="p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-blue-600" />
            Time Analysis
          </h3>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-3xl font-black text-gray-900">{avgTimePerQuestion}s</p>
              <p className="text-sm text-gray-500">Avg. Time / Question</p>
            </div>
            <div className={`p-3 rounded-full ${avgTimePerQuestion > 60 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {avgTimePerQuestion > 60 ? <AlertTriangle className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Clock className="h-4 w-4 text-orange-500" />
              <span>Pace: {avgTimePerQuestion > 45 ? "Slow - Need to speed up" : "Good - Exam pace"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Target className="h-4 w-4 text-blue-500" />
              <span>Attempt Strategy: {skippedQuestions.length > 0 ? "Selective (Good)" : "Aggressive"}</span>
            </div>
          </div>
        </Card>

        {/* Negative Marking */}
        <Card className="p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Negative Marking Impact
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-100">
              <span className="text-sm font-medium text-orange-800">Marks Lost</span>
              <span className="text-xl font-bold text-orange-900">-{negativeMarkingLoss}</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Avoiding blind guesses could have improved your score to <span className="font-bold text-green-600">{Math.round(potentialScore)}%</span>.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${potentialScore}%` }}></div>
            </div>
            <p className="text-xs text-right text-gray-500">Potential Score vs Actual</p>
          </div>
        </Card>
      </div>

      {/* SECTION 3: Topic-wise Performance */}
      <Card className="p-6 shadow-md">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
          <Brain className="h-5 w-5 text-purple-600" />
          Topic-wise Performance
        </h3>
        <div className="space-y-5">
          {topicPerformance.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{item.topic}</span>
                <span className={`text-sm font-bold ${
                  item.accuracy >= 70 ? 'text-green-600' : item.accuracy >= 40 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {item.accuracy}%
                </span>
              </div>
              <Progress 
                value={item.accuracy} 
                className={`h-2 ${
                  item.accuracy >= 70 ? '[&>div]:bg-green-500' : item.accuracy >= 40 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
                }`} 
              />
            </div>
          ))}
        </div>
      </Card>

      {/* SECTION 5 & 6: Readiness & Action Plan */}
      <Card className="p-0 overflow-hidden shadow-lg border-2 border-blue-100">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3 mb-2">
            <readiness.icon className={`h-8 w-8 ${readiness.color}`} />
            <h3 className={`text-2xl font-bold ${readiness.color}`}>{readiness.status}</h3>
          </div>
          <p className="text-gray-700 font-medium mb-6">{readiness.msg}</p>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <h4 className="text-lg font-bold text-gray-900 mb-4">🚀 Personalized Action Plan</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="mt-1 min-w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">1</div>
                <p className="text-sm text-gray-700">
                  Revise <span className="font-bold text-gray-900">{topicPerformance[0]?.topic || "Basics"}</span> immediately. Accuracy is critical here.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 min-w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</div>
                <p className="text-sm text-gray-700">
                  Attempt 2 more <span className="font-bold text-gray-900">PYQ Sets</span> to understand question patterns better.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 min-w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">3</div>
                <p className="text-sm text-gray-700">
                  Reduce negative marking by skipping questions you are unsure about in the next Mock Test.
                </p>
              </li>
            </ul>
            
            <Button 
              onClick={() => navigate("/practice")}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 shadow-lg shadow-blue-200"
            >
              Start Improvement Plan <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}