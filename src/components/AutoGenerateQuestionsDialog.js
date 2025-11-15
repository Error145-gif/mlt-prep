"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoGenerateQuestionsDialog = AutoGenerateQuestionsDialog;
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var select_1 = require("@/components/ui/select");
var lucide_react_1 = require("lucide-react");
function AutoGenerateQuestionsDialog(_a) {
    var _this = this;
    var topics = _a.topics, onGenerate = _a.onGenerate, isGenerating = _a.isGenerating;
    var _b = (0, react_1.useState)(500), questionCount = _b[0], setQuestionCount = _b[1];
    var _c = (0, react_1.useState)("all"), difficulty = _c[0], setDifficulty = _c[1];
    var _d = (0, react_1.useState)("all_topics"), selectedTopicId = _d[0], setSelectedTopicId = _d[1];
    var handleGenerate = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, onGenerate(questionCount, difficulty === "all" ? undefined : difficulty, selectedTopicId && selectedTopicId !== "all_topics" ? selectedTopicId : undefined)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return (<div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label_1.Label className="text-white">Number of Questions</label_1.Label>
          <input_1.Input type="number" value={questionCount} onChange={function (e) { return setQuestionCount(Math.max(1, parseInt(e.target.value) || 500)); }} className="bg-white/5 border-white/10 text-white" min={1} max={1000} disabled={isGenerating}/>
          <p className="text-xs text-white/60 mt-1">
            Minimum: 1 question | Recommended: 500-1000 questions per batch
          </p>
        </div>

        <div>
          <label_1.Label className="text-white">Difficulty Level</label_1.Label>
          <select_1.Select value={difficulty} onValueChange={setDifficulty} disabled={isGenerating}>
            <select_1.SelectTrigger className="bg-white/5 border-white/10 text-white">
              <select_1.SelectValue />
            </select_1.SelectTrigger>
            <select_1.SelectContent>
              <select_1.SelectItem value="all">All Levels (Mixed)</select_1.SelectItem>
              <select_1.SelectItem value="easy">Easy</select_1.SelectItem>
              <select_1.SelectItem value="medium">Medium</select_1.SelectItem>
              <select_1.SelectItem value="hard">Hard</select_1.SelectItem>
            </select_1.SelectContent>
          </select_1.Select>
        </div>

        <div>
          <label_1.Label className="text-white">Topic (Optional)</label_1.Label>
          <select_1.Select value={selectedTopicId} onValueChange={setSelectedTopicId} disabled={isGenerating}>
            <select_1.SelectTrigger className="bg-white/5 border-white/10 text-white">
              <select_1.SelectValue placeholder="All Topics"/>
            </select_1.SelectTrigger>
            <select_1.SelectContent>
              <select_1.SelectItem value="all_topics">All Topics</select_1.SelectItem>
              {topics === null || topics === void 0 ? void 0 : topics.map(function (topic) { return (<select_1.SelectItem key={topic._id} value={topic._id}>
                  {topic.name}
                </select_1.SelectItem>); })}
            </select_1.SelectContent>
          </select_1.Select>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <lucide_react_1.Sparkles className="h-5 w-5 text-blue-300 mt-0.5 flex-shrink-0"/>
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-300">AI-Powered Generation</p>
            <p className="text-xs text-white/70">
              Questions are automatically generated using advanced AI based on Medical Lab Technology knowledge. 
              No PDF upload required. The AI will create diverse, high-quality questions covering various MLT topics.
            </p>
          </div>
        </div>
      </div>

      <button_1.Button onClick={handleGenerate} disabled={isGenerating || questionCount < 1} className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0" size="lg">
        {isGenerating ? (<>
            <lucide_react_1.Loader2 className="h-5 w-5 mr-2 animate-spin"/>
            Generating {questionCount} Questions...
          </>) : (<>
            <lucide_react_1.Sparkles className="h-5 w-5 mr-2"/>
            Generate {questionCount} Questions
          </>)}
      </button_1.Button>
    </div>);
}
