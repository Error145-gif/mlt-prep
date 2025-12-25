import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock, Activity } from "lucide-react";
import { useNavigate } from "react-router";

interface LockedAnalysisProps {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
}

export default function LockedAnalysis({ score, totalQuestions, correctAnswers }: LockedAnalysisProps) {
  const navigate = useNavigate();
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100) || 0;

  return (
    <Card className="relative overflow-hidden border-2 border-purple-200 shadow-xl bg-white">
      {/* Header Section - Visible */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-600" />
            Performance Overview
          </h3>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-full">
            Free View
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Overall Score</p>
            <p className="text-3xl font-black text-gray-900">{score}%</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Accuracy</p>
            <p className="text-3xl font-black text-gray-900">{accuracy}%</p>
          </div>
        </div>
      </div>

      {/* Blurred Content Preview */}
      <div className="relative p-6 space-y-6">
        {/* Blur Overlay */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[6px] z-10 flex flex-col items-center justify-center text-center p-6">
          <div className="bg-white p-8 rounded-2xl shadow-2xl border border-purple-100 max-w-md w-full transform transition-all hover:scale-105 duration-300">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Unlock Detailed Analysis</h3>
            <p className="text-gray-600 mb-6">
              Get deep insights into your mistakes, time management, and weak topics to improve your score.
            </p>
            <Button 
              onClick={() => navigate("/subscription-plans")}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-6 text-lg shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              🔒 Upgrade to Unlock
            </Button>
            <p className="mt-4 text-xs text-gray-400 font-medium">
              Premium members score 35% higher on average
            </p>
          </div>
        </div>

        {/* Fake Content for Background Visuals */}
        <div className="opacity-40 pointer-events-none select-none filter blur-sm">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-32 bg-red-50 rounded-xl border border-red-100"></div>
              <div className="h-32 bg-yellow-50 rounded-xl border border-yellow-100"></div>
              <div className="h-32 bg-green-50 rounded-xl border border-green-100"></div>
            </div>
            <div className="h-64 bg-gray-50 rounded-xl border border-gray-200"></div>
          </div>
        </div>
      </div>
    </Card>
  );
}