import { Card } from "@/components/ui/card";

interface AccuracyChartProps {
  score: number;
  motivation: {
    message: string;
    quote: string;
    color: string;
  };
}

export default function AccuracyChart({ score, motivation }: AccuracyChartProps) {
  const getAccuracyColor = () => {
    if (score >= 85) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="p-8 bg-white shadow-xl">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative w-48 h-48">
            <svg className="transform -rotate-90 w-48 h-48">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke={score >= 85 ? "#4CAF50" : score >= 60 ? "#FFC107" : "#F44336"}
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${(score / 100) * 553} 553`}
                strokeLinecap="round"
                className="transition-all duration-2000 ease-out animate-in"
                style={{
                  animation: 'drawCircle 2s ease-out forwards',
                  strokeDashoffset: 553,
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-in fade-in zoom-in duration-1000" style={{ animationDelay: '500ms' }}>
                <p className={`text-5xl font-bold ${getAccuracyColor()} animate-in zoom-in duration-700`} style={{ animationDelay: '1000ms' }}>
                  {score.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600 mt-1 animate-in fade-in duration-500" style={{ animationDelay: '1500ms' }}>Accuracy</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className={`text-2xl font-bold ${motivation.color} mb-2`}>
            {motivation.message}
          </h2>
          <p className="text-gray-600 italic">"{motivation.quote}"</p>
        </div>
      </div>
    </Card>
  );
}
