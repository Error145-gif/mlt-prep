"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionCard = QuestionCard;
var framer_motion_1 = require("framer-motion");
var card_1 = require("@/components/ui/card");
var radio_group_1 = require("@/components/ui/radio-group");
var label_1 = require("@/components/ui/label");
var button_1 = require("@/components/ui/button");
var sonner_1 = require("sonner");
function QuestionCard(_a) {
    var questionNumber = _a.questionNumber, questionText = _a.questionText, options = _a.options, selectedAnswer = _a.selectedAnswer, onAnswerChange = _a.onAnswerChange, onSaveAndNext = _a.onSaveAndNext, onMarkForReview = _a.onMarkForReview, onClearResponse = _a.onClearResponse, isLastQuestion = _a.isLastQuestion, imageUrl = _a.imageUrl;
    var handleCopy = function (e) {
        e.preventDefault();
        sonner_1.toast.error("Copying is disabled during tests");
    };
    var handleCut = function (e) {
        e.preventDefault();
        sonner_1.toast.error("Cutting is disabled during tests");
    };
    var handleContextMenu = function (e) {
        e.preventDefault();
        sonner_1.toast.error("Right-click is disabled during tests");
    };
    return (<framer_motion_1.motion.div key={questionNumber} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4, ease: "easeInOut" }} className="h-full" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }} onCopy={handleCopy} onCut={handleCut} onContextMenu={handleContextMenu}>
      <card_1.Card className="p-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm h-full flex flex-col">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-gray-900">
              Question {questionNumber}
            </span>
            <div className="flex items-center gap-3 text-sm">
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full font-medium shadow-sm">
                +1 Mark
              </span>
              <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full font-medium shadow-sm">
                -0.33 Negative
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 mb-6">
          <p className="text-lg leading-relaxed text-gray-800 mb-8 font-normal" style={{ userSelect: 'none' }}>
            {questionText}
          </p>

          {/* Display question image if it exists */}
          {imageUrl && (<div className="mb-6">
              <img src={imageUrl} alt="Question" className="max-w-full h-auto rounded-lg border-2 border-gray-200 shadow-sm" style={{ userSelect: 'none', pointerEvents: 'none' }} onContextMenu={function (e) { return e.preventDefault(); }} draggable={false}/>
            </div>)}

          <radio_group_1.RadioGroup value={selectedAnswer || ""} onValueChange={onAnswerChange}>
            <div className="space-y-4">
              {options.map(function (option, idx) {
            var isSelected = selectedAnswer === option;
            return (<framer_motion_1.motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} whileHover={{ scale: 1.02, x: 4 }} whileTap={{ scale: 0.98 }}>
                    <div className={"flex items-center space-x-4 p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer ".concat(isSelected
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 shadow-sm hover:shadow-md")} style={{ userSelect: 'none' }}>
                      <radio_group_1.RadioGroupItem value={option} id={"option-".concat(idx)} className="border-2 w-6 h-6 text-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"/>
                      <label_1.Label htmlFor={"option-".concat(idx)} className="cursor-pointer text-base text-gray-800 font-medium flex-1 leading-relaxed" style={{ userSelect: 'none' }}>
                        {option}
                      </label_1.Label>
                    </div>
                  </framer_motion_1.motion.div>);
        })}
            </div>
          </radio_group_1.RadioGroup>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-6 border-t border-gray-200">
          <button_1.Button variant="outline" onClick={onMarkForReview} className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-300 shadow-sm hover:shadow-md transition-all font-medium px-6 w-full sm:w-auto">
            Mark for Review & Next
          </button_1.Button>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button_1.Button variant="outline" onClick={onClearResponse} className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300 shadow-sm hover:shadow-md transition-all font-medium px-6 w-full sm:w-auto">
              Clear Response
            </button_1.Button>
            <button_1.Button onClick={onSaveAndNext} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all font-medium px-8 w-full sm:w-auto">
              {isLastQuestion ? "Save" : "Save & Next"}
            </button_1.Button>
          </div>
        </div>
      </card_1.Card>
    </framer_motion_1.motion.div>);
}
