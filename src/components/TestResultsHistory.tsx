// @ts-nocheck
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

export default function TestResultsHistory() {
  const navigate = useNavigate();
  const [cursor, setCursor] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [pageStack, setPageStack] = useState<(string | null)[]>([null]);

  const results = useQuery(api.student.getTestHistoryPaginated, {
    paginationOpts: { numItems: 10, cursor },
  });

  if (results && results.page.length > 0) {
    if (JSON.stringify(results.page) !== JSON.stringify(history)) {
      setHistory(results.page);
      setIsDone(results.isDone);
    }
  }

  const handleNextPage = () => {
    if (results?.continueCursor) {
      setPageStack([...pageStack, results.continueCursor]);
      setCursor(results.continueCursor);
    }
  };

  const handlePreviousPage = () => {
    if (pageStack.length > 1) {
      const newStack = pageStack.slice(0, -1);
      setPageStack(newStack);
      setCursor(newStack[newStack.length - 1]);
    }
  };

  const getTestTypeColor = (testType: string) => {
    switch (testType) {
      case "mock":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "pyq":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "ai":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getTestTypeLabel = (testType: string) => {
    switch (testType) {
      case "mock":
        return "Mock Test";
      case "pyq":
        return "PYQ Set";
      case "ai":
        return "AI Test";
      default:
        return "Test";
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Test History</h2>
        <div className="text-sm text-white/70">
          Page {pageStack.length} • {history.length} results
        </div>
      </div>

      {history.length === 0 ? (
        <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
          <CardContent className="pt-8 text-center">
            <p className="text-white/70">No test results yet. Start a test to see your history!</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {history.map((result, index) => (
              <motion.div
                key={result._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="glass-card border-white/30 backdrop-blur-xl bg-white/10 hover:bg-white/20 cursor-pointer transition-all duration-300 hover:scale-102"
                  onClick={() => navigate(`/test-results?sessionId=${result.sessionId}`)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <Badge className={`${getTestTypeColor(result.testType)} border`}>
                            {getTestTypeLabel(result.testType)}
                          </Badge>
                          <span className="text-white/70 text-sm flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(result._creationTime)}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-3">
                          <div className="space-y-1">
                            <p className="text-white/70 text-xs">Score</p>
                            <p className="text-2xl font-bold text-white">{Math.round(result.score)}%</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-white/70 text-xs">Correct</p>
                            <p className="text-lg font-semibold text-green-400">
                              {result.correctAnswers}/{result.totalQuestions}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-white/70 text-xs">Time</p>
                            <p className="text-lg font-semibold text-blue-400">
                              {formatTime(result.timeSpent)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${
                          result.score >= 80 ? 'text-green-400' :
                          result.score >= 50 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {Math.round(result.score)}
                        </div>
                        <p className="text-white/70 text-xs mt-1">View Details →</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              onClick={handlePreviousPage}
              disabled={pageStack.length <= 1}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="text-white/70 text-sm">
              Page {pageStack.length}
            </div>

            <Button
              onClick={handleNextPage}
              disabled={isDone}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}