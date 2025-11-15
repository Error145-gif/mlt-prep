"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TestResultsHistory;
var react_1 = require("convex/react");
var api_1 = require("@/convex/_generated/api");
var react_2 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var react_router_1 = require("react-router");
function TestResultsHistory() {
    var navigate = (0, react_router_1.useNavigate)();
    var _a = (0, react_2.useState)(null), cursor = _a[0], setCursor = _a[1];
    var _b = (0, react_2.useState)([]), history = _b[0], setHistory = _b[1];
    var _c = (0, react_2.useState)(false), isDone = _c[0], setIsDone = _c[1];
    var _d = (0, react_2.useState)([null]), pageStack = _d[0], setPageStack = _d[1];
    var results = (0, react_1.useQuery)(api_1.api.student.getTestHistoryPaginated, {
        paginationOpts: { numItems: 10, cursor: cursor },
    });
    if (results && results.page.length > 0) {
        if (JSON.stringify(results.page) !== JSON.stringify(history)) {
            setHistory(results.page);
            setIsDone(results.isDone);
        }
    }
    var handleNextPage = function () {
        if (results === null || results === void 0 ? void 0 : results.continueCursor) {
            setPageStack(__spreadArray(__spreadArray([], pageStack, true), [results.continueCursor], false));
            setCursor(results.continueCursor);
        }
    };
    var handlePreviousPage = function () {
        if (pageStack.length > 1) {
            var newStack = pageStack.slice(0, -1);
            setPageStack(newStack);
            setCursor(newStack[newStack.length - 1]);
        }
    };
    var getTestTypeColor = function (testType) {
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
    var getTestTypeLabel = function (testType) {
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
    var formatDate = function (timestamp) {
        return new Date(timestamp).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    var formatTime = function (seconds) {
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return "".concat(hours, "h ").concat(minutes, "m");
        }
        return "".concat(minutes, "m");
    };
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Test History</h2>
        <div className="text-sm text-white/70">
          Page {pageStack.length} • {history.length} results
        </div>
      </div>

      {history.length === 0 ? (<card_1.Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
          <card_1.CardContent className="pt-8 text-center">
            <p className="text-white/70">No test results yet. Start a test to see your history!</p>
          </card_1.CardContent>
        </card_1.Card>) : (<>
          <div className="space-y-4">
            {history.map(function (result, index) { return (<framer_motion_1.motion.div key={result._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <card_1.Card className="glass-card border-white/30 backdrop-blur-xl bg-white/10 hover:bg-white/20 cursor-pointer transition-all duration-300 hover:scale-102" onClick={function () { return navigate("/test-results?sessionId=".concat(result.sessionId)); }}>
                  <card_1.CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <badge_1.Badge className={"".concat(getTestTypeColor(result.testType), " border")}>
                            {getTestTypeLabel(result.testType)}
                          </badge_1.Badge>
                          <span className="text-white/70 text-sm flex items-center gap-1">
                            <lucide_react_1.Calendar className="h-4 w-4"/>
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
                        <div className={"text-3xl font-bold ".concat(result.score >= 80 ? 'text-green-400' :
                    result.score >= 50 ? 'text-yellow-400' :
                        'text-red-400')}>
                          {Math.round(result.score)}
                        </div>
                        <p className="text-white/70 text-xs mt-1">View Details →</p>
                      </div>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>
              </framer_motion_1.motion.div>); })}
          </div>

          <div className="flex items-center justify-between pt-4">
            <button_1.Button onClick={handlePreviousPage} disabled={pageStack.length <= 1} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white disabled:opacity-50 disabled:cursor-not-allowed">
              <lucide_react_1.ChevronLeft className="h-4 w-4"/>
              Previous
            </button_1.Button>

            <div className="text-white/70 text-sm">
              Page {pageStack.length}
            </div>

            <button_1.Button onClick={handleNextPage} disabled={isDone} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white disabled:opacity-50 disabled:cursor-not-allowed">
              Next
              <lucide_react_1.ChevronRight className="h-4 w-4"/>
            </button_1.Button>
          </div>
        </>)}
    </div>);
}
