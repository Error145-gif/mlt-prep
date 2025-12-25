import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router";

interface RecentActivityProps {
  isFreeTrialUser?: boolean;
  recentTests?: Array<{
    score: number;
    type: string;
    date: number;
    sessionId?: string;
  }>;
}

export default function RecentActivity({ isFreeTrialUser = false, recentTests = [] }: RecentActivityProps) {
  const navigate = useNavigate();
  // Reverse the array to show newest first (input is chronological for charts)
  const displayTests = [...recentTests].reverse();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Your Recent Tests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {displayTests && displayTests.length > 0 ? (
            <div className="space-y-3">
              {displayTests.slice(0, 5).map((test, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
                  onClick={() => test.sessionId && navigate(`/test-results?sessionId=${test.sessionId}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${test.score >= 50 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                      {test.score >= 50 ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-white font-medium capitalize">{test.type === 'pyq' ? 'PYQ Test' : test.type === 'ai' ? 'AI Practice' : 'Mock Test'}</p>
                      <p className="text-white/60 text-xs">
                        {new Date(test.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={test.score >= 50 ? "default" : "destructive"} className={test.score >= 50 ? "bg-green-500 hover:bg-green-600" : ""}>
                      {test.score}%
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-white/70 text-center py-8">
              <p className="mb-2">No tests attempted yet</p>
              <p className="text-sm">Start your first test to see your progress here</p>
            </div>
          )}
          
          {isFreeTrialUser && (
            <div className="border-t border-white/20 pt-4 mt-4">
              <p className="text-white/80 text-sm text-center">
                Upgrade to see detailed analysis for each test.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}