import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Lock, 
  Crown, 
  AlertCircle, 
  XCircle, 
  ChevronRight, 
  Clock, 
  TrendingUp,
  CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router";

export default function LockedAnalysis() {
  const navigate = useNavigate();

  return (
    <Card className="relative overflow-hidden border-0 shadow-2xl bg-white rounded-2xl">
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
          <Badge className="bg-yellow-400/20 text-yellow-100 border-yellow-400/30 px-3 py-1 backdrop-blur-sm">
            <Lock className="h-3 w-3 mr-1" /> Premium Feature
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-8 relative">
        {/* Blur Overlay */}
        <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-[2px] flex flex-col items-center justify-end pb-8">
           <Button 
              onClick={() => navigate("/subscription-plans")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-6 px-8 text-lg shadow-xl hover:shadow-purple-500/25 transition-all rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-700"
            >
              <Lock className="mr-2 h-5 w-5" /> Upgrade to Unlock Detailed Analysis
            </Button>
        </div>

        {/* Mistake Analysis Section (Preview) */}
        <div className="space-y-4 opacity-60 pointer-events-none select-none">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <h3>Mistake Analysis</h3>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4 text-red-800 font-medium">
              <XCircle className="h-5 w-5 text-red-500" />
              <p>You lost <span className="font-bold">12 marks</span> due to mistakes in Hematology</p>
            </div>

            <div className="space-y-3">
              {[
                { topic: "Hematology", q: "Low Iron Levels...", ans: "Anemia" },
                { topic: "Biochemistry", q: "Calculating pH Level...", ans: "7.52" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 shadow-sm border border-red-100 flex items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        {item.topic}
                      </Badge>
                    </div>
                    <p className="text-gray-900 font-medium">{item.q}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-purple-600">
                    View Explanation <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Time Analysis Section (Preview) */}
        <div className="space-y-4 opacity-60 pointer-events-none select-none">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
            <Clock className="h-5 w-5 text-orange-500" />
            <h3>Time Analysis</h3>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average time per question</p>
                  <p className="text-2xl font-bold text-gray-900">53 seconds</p>
                  <p className="text-xs text-orange-600 mt-1">Slower than average</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Accuracy Speed</p>
                  <p className="text-lg font-bold text-gray-900">Steady Pace</p>
                  <p className="text-xs text-green-600 mt-1">Focus on accuracy first.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Topic Weaknesses Section (Preview) */}
        <div className="space-y-4 opacity-60 pointer-events-none select-none">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
            <TrendingUp className="h-5 w-5 text-pink-500" />
            <h3>Topic Weaknesses</h3>
          </div>
          <div className="bg-pink-50 border border-pink-100 rounded-xl p-6">
            <div className="flex flex-wrap gap-6 justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Hematology</p>
                  <p className="text-lg font-bold text-red-600">41%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Microbiology</p>
                  <p className="text-lg font-bold text-green-600">76%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Biochemistry</p>
                  <p className="text-lg font-bold text-red-600">39%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}