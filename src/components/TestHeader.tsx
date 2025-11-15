// @ts-nocheck
import { Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface TestHeaderProps {
  testName: string;
  timeRemaining: number;
  userName?: string;
  avatarUrl?: string;
  questionsAnswered: number;
  totalQuestions: number;
}

export function TestHeader({
  testName,
  timeRemaining,
  userName,
  avatarUrl,
  questionsAnswered,
  totalQuestions,
}: TestHeaderProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isLowTime = timeRemaining < 300; // Less than 5 minutes
  const progressPercentage = (questionsAnswered / totalQuestions) * 100;

  return (
    <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
            {testName}
          </h1>
          <div className="flex items-center gap-6">
            <motion.div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isLowTime
                  ? "bg-red-50 text-red-700"
                  : "bg-blue-50 text-blue-700"
              } shadow-sm`}
              animate={isLowTime ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Clock className="h-5 w-5" />
              <span className="font-mono text-lg font-semibold">
                {formatTime(timeRemaining)}
              </span>
            </motion.div>
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex shadow-sm hover:shadow-md transition-shadow"
            >
              Full Screen
            </Button>
            <div className="flex items-center gap-3">
              <div className="relative">
                {avatarUrl ? (
                  <Avatar className="h-10 w-10 border-2 border-blue-500 shadow-md">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                      {userName?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md">
                    {userName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
                <svg className="absolute -inset-1 -z-10" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="4"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    strokeDasharray={`${progressPercentage * 3.01} 301`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    className="transition-all duration-500"
                  />
                </svg>
              </div>
              <span className="font-medium text-gray-700 hidden md:block">
                {userName || "Student"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="h-1 bg-gray-100">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}