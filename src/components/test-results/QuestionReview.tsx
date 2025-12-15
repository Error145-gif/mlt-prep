import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Lock } from "lucide-react";

interface QuestionReviewProps {
  questions: any[];
  isFreeTrialUser?: boolean;
}

export default function QuestionReview({ questions, isFreeTrialUser = false }: QuestionReviewProps) {
  return (
    <Card className="p-6 bg-white shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">📝 Detailed Question Review</h3>
      <div className="space-y-6">
        {questions.map((q: any, index: number) => {
          const isCorrect = q.isCorrect === true;
          const wasAnswered = q.userAnswer !== undefined && q.userAnswer !== null && q.userAnswer !== "";
          
          // Robust normalization matching backend
          const normalize = (text: string) => {
            if (!text) return "";
            return text.trim().toLowerCase().replace(/\s+/g, ' ');
          };

          // Determine if explanation should be locked (show first 2, lock rest for free trial)
          const shouldLockExplanation = isFreeTrialUser && index >= 2;
          
          return (
            <div
              key={q._id}
              className={`p-6 rounded-xl border-2 shadow-md ${
                isCorrect
                  ? "bg-green-50 border-green-400"
                  : wasAnswered
                  ? "bg-red-50 border-red-400"
                  : "bg-gray-50 border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-bold text-xl text-gray-900">Q{index + 1}.</span>
                  {isCorrect ? (
                    <Badge className="bg-green-600 text-white text-sm">✅ Correct</Badge>
                  ) : wasAnswered ? (
                    <Badge className="bg-red-600 text-white text-sm">❌ Wrong</Badge>
                  ) : (
                    <Badge className="bg-gray-600 text-white text-sm">⏭️ Skipped</Badge>
                  )}
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                    1 Mark
                  </Badge>
                </div>
                {q.difficulty && (
                  <Badge variant="outline" className="capitalize text-xs">
                    {q.difficulty}
                  </Badge>
                )}
              </div>

              <p className="text-gray-900 font-medium mb-5 text-lg leading-relaxed">{q.question}</p>

              {q.type === "mcq" && q.options && (
                <div className="space-y-3 ml-4">
                  {q.options.map((option: string, idx: number) => {
                    const normalizedOption = normalize(option);
                    const normalizedCorrectAnswer = normalize(q.correctAnswer || "");
                    const normalizedUserAnswer = normalize(q.userAnswer || "");
                    
                    const isCorrectAnswer = normalizedOption === normalizedCorrectAnswer;
                    const isUserAnswer = normalizedOption === normalizedUserAnswer;
                    
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isCorrectAnswer
                            ? "bg-green-100 border-green-500 font-semibold shadow-sm"
                            : isUserAnswer && !isCorrectAnswer
                            ? "bg-red-100 border-red-500 shadow-sm"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {isCorrectAnswer && (
                              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <XCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                            )}
                            <span className="text-gray-900 text-base">{option}</span>
                          </div>
                          {isCorrectAnswer && (
                            <span className="text-green-700 font-bold text-sm whitespace-nowrap">
                              ✓ Correct Answer
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {!wasAnswered && (
                <div className="mt-4 p-4 bg-gray-100 border-l-4 border-gray-400 rounded">
                  <p className="text-sm font-semibold text-gray-700">⏭️ You skipped this question.</p>
                  <p className="text-sm text-gray-600 mt-1">Correct Answer: <span className="font-bold text-green-700">{q.correctAnswer}</span></p>
                </div>
              )}

              {/* Explanation - Locked for free trial after first 2 questions */}
              {q.explanation && (
                <div className="mt-4 relative">
                  {!shouldLockExplanation ? (
                    <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                      <p className="text-sm font-bold text-blue-900 mb-2">💡 Explanation:</p>
                      <p className="text-sm text-blue-800 leading-relaxed">{q.explanation}</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-100 border-l-4 border-gray-400 rounded-lg relative">
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center">
                        <Lock className="h-8 w-8 text-white mb-2" />
                        <p className="text-white font-semibold text-sm">🔒 Detailed explanations available with Full Access</p>
                      </div>
                      <div className="opacity-20">
                        <p className="text-sm font-bold text-blue-900 mb-2">💡 Explanation:</p>
                        <p className="text-sm text-blue-800">Hidden content...</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}