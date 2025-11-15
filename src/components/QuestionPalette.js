"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionPalette = QuestionPalette;
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
function QuestionPalette(_a) {
    var questions = _a.questions, currentQuestionIndex = _a.currentQuestionIndex, getQuestionStatus = _a.getQuestionStatus, onQuestionClick = _a.onQuestionClick, onSubmitTest = _a.onSubmitTest, showOnMobile = _a.showOnMobile, onClose = _a.onClose;
    var getStatusColor = function (status) {
        switch (status) {
            case "answered":
                return "bg-green-500 text-white shadow-md hover:shadow-lg";
            case "marked":
                return "bg-purple-500 text-white shadow-md hover:shadow-lg";
            case "marked-answered":
                return "bg-orange-500 text-white shadow-md hover:shadow-lg";
            case "not-answered":
                return "bg-red-500 text-white shadow-md hover:shadow-lg";
            default:
                return "bg-white border-2 border-gray-300 text-gray-700 shadow-sm hover:shadow-md";
        }
    };
    var content = (<div className="h-full flex flex-col bg-white/95 backdrop-blur-sm" style={{ userSelect: 'none' }}>
      <div className="md:hidden flex justify-between items-center p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 text-lg">Question Palette</h3>
        <button_1.Button variant="ghost" size="sm" onClick={onClose}>
          <lucide_react_1.X className="h-5 w-5"/>
        </button_1.Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
            Questions
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map(function (_, index) {
            var status = getQuestionStatus(index);
            return (<framer_motion_1.motion.button key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={function () { return onQuestionClick(index); }} className={"w-11 h-11 rounded-lg flex items-center justify-center font-semibold text-sm transition-all ".concat(getStatusColor(status), " ").concat(currentQuestionIndex === index
                    ? "ring-4 ring-blue-400 ring-offset-2"
                    : "")}>
                  {index + 1}
                </framer_motion_1.motion.button>);
        })}
          </div>
        </div>

        <div className="space-y-3 text-sm mt-8 p-4 bg-gray-50 rounded-xl">
          <h4 className="font-semibold text-gray-700 mb-3">Legend</h4>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-md shadow-sm"></div>
            <span className="text-gray-700">Answered</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-red-500 rounded-md shadow-sm"></div>
            <span className="text-gray-700">Not Answered</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded-md shadow-sm"></div>
            <span className="text-gray-700">Not Visited</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-purple-500 rounded-md shadow-sm"></div>
            <span className="text-gray-700">Marked</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-orange-500 rounded-md shadow-sm"></div>
            <span className="text-gray-700">Marked & Answered</span>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button_1.Button onClick={onSubmitTest} className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md hover:shadow-lg transition-all font-semibold py-6 text-base">
          Submit Test
        </button_1.Button>
      </div>
    </div>);
    return (<>
      <framer_motion_1.AnimatePresence>
        {showOnMobile && (<framer_motion_1.motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 md:hidden">
            {content}
          </framer_motion_1.motion.div>)}
      </framer_motion_1.AnimatePresence>
      <div className="hidden md:block w-80 border-l border-gray-200 shadow-lg">
        {content}
      </div>
    </>);
}
