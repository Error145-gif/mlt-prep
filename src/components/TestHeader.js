"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestHeader = TestHeader;
var lucide_react_1 = require("lucide-react");
var avatar_1 = require("@/components/ui/avatar");
var button_1 = require("@/components/ui/button");
var framer_motion_1 = require("framer-motion");
function TestHeader(_a) {
    var _b, _c;
    var testName = _a.testName, timeRemaining = _a.timeRemaining, userName = _a.userName, avatarUrl = _a.avatarUrl, questionsAnswered = _a.questionsAnswered, totalQuestions = _a.totalQuestions;
    var formatTime = function (seconds) {
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds % 3600) / 60);
        var secs = seconds % 60;
        return "".concat(hours.toString().padStart(2, "0"), ":").concat(minutes
            .toString()
            .padStart(2, "0"), ":").concat(secs.toString().padStart(2, "0"));
    };
    var isLowTime = timeRemaining < 300; // Less than 5 minutes
    var progressPercentage = (questionsAnswered / totalQuestions) * 100;
    return (<div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
            {testName}
          </h1>
          <div className="flex items-center gap-6">
            <framer_motion_1.motion.div className={"flex items-center gap-2 px-4 py-2 rounded-full ".concat(isLowTime
            ? "bg-red-50 text-red-700"
            : "bg-blue-50 text-blue-700", " shadow-sm")} animate={isLowTime ? { scale: [1, 1.05, 1] } : {}} transition={{ duration: 1, repeat: Infinity }}>
              <lucide_react_1.Clock className="h-5 w-5"/>
              <span className="font-mono text-lg font-semibold">
                {formatTime(timeRemaining)}
              </span>
            </framer_motion_1.motion.div>
            <button_1.Button variant="outline" size="sm" className="hidden md:flex shadow-sm hover:shadow-md transition-shadow">
              Full Screen
            </button_1.Button>
            <div className="flex items-center gap-3">
              <div className="relative">
                {avatarUrl ? (<avatar_1.Avatar className="h-10 w-10 border-2 border-blue-500 shadow-md">
                    <avatar_1.AvatarImage src={avatarUrl}/>
                    <avatar_1.AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                      {((_b = userName === null || userName === void 0 ? void 0 : userName.charAt(0)) === null || _b === void 0 ? void 0 : _b.toUpperCase()) || "U"}
                    </avatar_1.AvatarFallback>
                  </avatar_1.Avatar>) : (<div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md">
                    {((_c = userName === null || userName === void 0 ? void 0 : userName.charAt(0)) === null || _c === void 0 ? void 0 : _c.toUpperCase()) || "U"}
                  </div>)}
                <svg className="absolute -inset-1 -z-10" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="48" fill="none" stroke="#e5e7eb" strokeWidth="4"/>
                  <circle cx="50" cy="50" r="48" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray={"".concat(progressPercentage * 3.01, " 301")} strokeLinecap="round" transform="rotate(-90 50 50)" className="transition-all duration-500"/>
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
        <framer_motion_1.motion.div className="h-full bg-gradient-to-r from-blue-500 to-purple-600" initial={{ width: 0 }} animate={{ width: "".concat(progressPercentage, "%") }} transition={{ duration: 0.5 }}/>
      </div>
    </div>);
}
