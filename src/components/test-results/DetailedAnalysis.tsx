import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle, 
  CheckCircle2, 
  Crown,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  XCircle,
  Lock,
  BookOpen,
  Target,
  Lightbulb
} from "lucide-react";
import { useState } from "react";

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
  isPaidUser?: boolean;
}

export default function DetailedAnalysis({ questions, isPaidUser = false }: DetailedAnalysisProps) {
  const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>({});

  const toggleExplanation = (id: string) => {
    setExpandedExplanations(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

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

  // Topic Performance with detailed stats
  const topicStats: Record<string, { total: number; correct: number; incorrect: number }> = {};
  questions.forEach(q => {
    const topic = q.topic || "General";
    if (!topicStats[topic]) topicStats[topic] = { total: 0, correct: 0, incorrect: 0 };
    topicStats[topic].total++;
    if (q.isCorrect) {
      topicStats[topic].correct++;
    } else if (q.userAnswer) {
      topicStats[topic].incorrect++;
    }
  });

  const topicPerformance = Object.entries(topicStats).map(([topic, stats]) => ({
    topic,
    accuracy: Math.round((stats.correct / stats.total) * 100),
    total: stats.total,
    correct: stats.correct,
    incorrect: stats.incorrect,
    skipped: stats.total - stats.correct - stats.incorrect
  })).sort((a, b) => a.accuracy - b.accuracy); // Weakest first

  // Generate subject-wise suggestions
  const getSubjectSuggestions = () => {
    const suggestions: Array<{ topic: string; message: string; priority: 'high' | 'medium' | 'low' }> = [];
    
    topicPerformance.forEach(perf => {
      if (perf.accuracy < 40) {
        suggestions.push({
          topic: perf.topic,
          message: `Critical: Focus heavily on ${perf.topic}. Your accuracy is ${perf.accuracy}%. Practice 20-30 questions daily from this topic.`,
          priority: 'high'
        });
      } else if (perf.accuracy < 60) {
        suggestions.push({
          topic: perf.topic,
          message: `Important: Strengthen ${perf.topic} concepts. Your accuracy is ${perf.accuracy}%. Review theory and solve 10-15 questions daily.`,
          priority: 'medium'
        });
      } else if (perf.accuracy < 80) {
        suggestions.push({
          topic: perf.topic,
          message: `Good progress in ${perf.topic} (${perf.accuracy}%). Practice 5-10 challenging questions to reach mastery.`,
          priority: 'low'
        });
      }
    });

    return suggestions;
  };

  const suggestions = getSubjectSuggestions();

  // FREE USERS: Show only first 2 explanations
  const maxFreeExplanations = 2;

  return (
    <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-purple-50 to-indigo-50 backdrop-blur-sm rounded-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-6 w-6 text-yellow-300 fill-yellow-300" />
              <h2 className="text-2xl font-bold">Detailed Analysis</h2>
            </div>
            <p className="text-purple-100 text-sm opacity-90">
              Identify your mistakes, improve weak areas, and boost your score with personalized suggestions.
            </p>
          </div>
          <Badge className={`${isPaidUser ? 'bg-white/20 hover:bg-white/30' : 'bg-yellow-400/20 border-yellow-400/30'} text-white border-0 px-3 py-1 backdrop-blur-sm cursor-default`}>
            {isPaidUser ? (
              <>
                <CheckCircle2 className="h-3 w-3 mr-1 text-green-300" /> Premium Unlocked
              </>
            ) : (
              <>
                <Lock className="h-3 w-3 mr-1" /> Limited Access
              </>
            )}
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Subject-wise Performance Overview */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
            <BookOpen className="h-5 w-5 text-blue-500" />
            <h3>Subject-wise Performance</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topicPerformance.map((topic, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 shadow-md border-2 border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-900">{topic.topic}</h4>
                  <Badge 
                    className={`${
                      topic.accuracy >= 80 ? 'bg-green-100 text-green-700' :
                      topic.accuracy >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      topic.accuracy >= 40 ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}
                  >
                    {topic.accuracy}%
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Questions:</span>
                    <span className="font-semibold">{topic.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">✓ Correct:</span>
                    <span className="font-semibold text-green-700">{topic.correct}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-600">✗ Incorrect:</span>
                    <span className="font-semibold text-red-700">{topic.incorrect}</span>
                  </div>
                  {topic.skipped > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">⊘ Skipped:</span>
                      <span className="font-semibold text-gray-600">{topic.skipped}</span>
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      topic.accuracy >= 80 ? 'bg-green-500' :
                      topic.accuracy >= 60 ? 'bg-yellow-500' :
                      topic.accuracy >= 40 ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${topic.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personalized Subject Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <h3>Personalized Study Suggestions</h3>
            </div>

            <div className="space-y-3">
              {suggestions.map((suggestion, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-xl border-2 ${
                    suggestion.priority === 'high' ? 'bg-red-50 border-red-200' :
                    suggestion.priority === 'medium' ? 'bg-orange-50 border-orange-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Target className={`h-5 w-5 mt-0.5 ${
                      suggestion.priority === 'high' ? 'text-red-600' :
                      suggestion.priority === 'medium' ? 'text-orange-600' :
                      'text-blue-600'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`${
                          suggestion.priority === 'high' ? 'bg-red-600' :
                          suggestion.priority === 'medium' ? 'bg-orange-600' :
                          'bg-blue-600'
                        } text-white`}>
                          {suggestion.priority === 'high' ? '🔴 High Priority' :
                           suggestion.priority === 'medium' ? '🟠 Medium Priority' :
                           '🔵 Low Priority'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-800 leading-relaxed">{suggestion.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
              {incorrectQuestions.slice(0, 5).map((q, idx) => {
                const canViewExplanation = isPaidUser || idx < maxFreeExplanations;
                
                return (
                  <div key={idx} className="bg-white rounded-lg p-4 shadow-sm border border-red-100 transition-all">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                            {q.topic || "General"}
                          </Badge>
                          <span className="text-xs text-gray-500 line-clamp-1">{q.subtopic}</span>
                        </div>
                        <p className="text-gray-900 font-medium">{q.question}</p>
                        <p className="text-xs text-gray-500">
                          Your Answer: <span className="text-red-500 line-through mr-2">{q.userAnswer}</span>
                          Correct Answer: <span className="text-green-600 font-medium">{q.correctAnswer}</span>
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`${canViewExplanation ? 'text-purple-600 hover:text-purple-700 hover:bg-purple-50' : 'text-gray-400 cursor-not-allowed'} shrink-0`}
                        onClick={() => canViewExplanation && toggleExplanation(q._id)}
                        disabled={!canViewExplanation}
                      >
                        {canViewExplanation ? (
                          <>
                            {expandedExplanations[q._id] ? "Hide Explanation" : "View Explanation"} 
                            {expandedExplanations[q._id] ? <ChevronDown className="h-4 w-4 ml-1" /> : <ChevronRight className="h-4 w-4 ml-1" />}
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4 mr-1" /> Locked
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {/* Inline Explanation */}
                    {canViewExplanation && expandedExplanations[q._id] && (
                      <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                          <p className="text-sm font-bold text-blue-900 mb-1">💡 Explanation:</p>
                          <p className="text-sm text-blue-800 leading-relaxed">
                            {q.explanation || "No detailed explanation available for this question."}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Locked Explanation Preview */}
                    {!canViewExplanation && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-100 z-10" />
                          <div className="blur-sm select-none pointer-events-none">
                            <p className="text-sm font-bold text-gray-900 mb-1">💡 Explanation:</p>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              This detailed explanation is available for Premium users only...
                            </p>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center z-20">
                            <Badge className="bg-purple-600 text-white px-4 py-2">
                              <Lock className="h-3 w-3 mr-1" /> Upgrade to Unlock
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {incorrectQuestions.length === 0 && (
                <div className="text-center py-4 text-green-600 font-medium">
                  No mistakes found! Excellent work.
                </div>
              )}
            </div>

            {/* Upgrade CTA for Free Users */}
            {!isPaidUser && incorrectQuestions.length > maxFreeExplanations && (
              <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg text-center">
                <p className="text-sm text-gray-700 mb-2">
                  🔒 <span className="font-semibold">{incorrectQuestions.length - maxFreeExplanations} more explanations</span> are locked
                </p>
                <Button 
                  onClick={() => window.location.href = '/subscription-plans'}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm"
                >
                  Upgrade to Premium - ₹399/4 months
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Topic Weaknesses Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
            <TrendingUp className="h-5 w-5 text-pink-500" />
            <h3>Areas Needing Attention</h3>
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