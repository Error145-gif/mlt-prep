"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PerformanceScore;
var framer_motion_1 = require("framer-motion");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
function PerformanceScore(_a) {
    var performanceScore = _a.performanceScore, consistencyStreak = _a.consistencyStreak;
    var getPerformanceColor = function (score) {
        if (score >= 80)
            return "from-green-500 to-emerald-600";
        if (score >= 50)
            return "from-yellow-500 to-orange-600";
        return "from-red-500 to-pink-600";
    };
    var getPerformanceBadgeColor = function (score) {
        if (score >= 80)
            return "bg-green-500/20 text-green-300 border-green-500/30";
        if (score >= 50)
            return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
        return "bg-red-500/20 text-red-300 border-red-500/30";
    };
    var getPerformanceLabel = function (score) {
        if (score >= 80)
            return "Excellent";
        if (score >= 50)
            return "Moderate";
        return "Needs Work";
    };
    return (<framer_motion_1.motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="glass-card border border-white/30 backdrop-blur-xl bg-white/10 p-6 rounded-xl">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-white/90 text-lg mb-2 flex items-center gap-2">
            <lucide_react_1.Target className="h-5 w-5"/>
            Exam Readiness Score
          </h2>
          <div className="flex items-center gap-4">
            <div className={"w-24 h-24 rounded-full bg-gradient-to-br ".concat(getPerformanceColor(performanceScore), " flex items-center justify-center shadow-lg")}>
              <span className="text-4xl font-bold text-white">{performanceScore}</span>
            </div>
            <div>
              <badge_1.Badge className={"".concat(getPerformanceBadgeColor(performanceScore), " text-lg px-4 py-1")}>
                {getPerformanceLabel(performanceScore)}
              </badge_1.Badge>
              <p className="text-white/80 text-sm mt-2">
                Based on accuracy, consistency & improvement
              </p>
            </div>
          </div>
        </div>
        {consistencyStreak > 0 && (<div className="text-center">
            <lucide_react_1.Flame className="h-12 w-12 text-orange-400 mx-auto mb-2"/>
            <p className="text-3xl font-bold text-white">{consistencyStreak}</p>
            <p className="text-white/80 text-sm">Day Streak</p>
          </div>)}
      </div>
    </framer_motion_1.motion.div>);
}
