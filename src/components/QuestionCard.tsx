import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface QuestionCardProps {
  questionNumber: number;
  questionText: string;
  options: string[];
  selectedAnswer?: string;
  onAnswerChange: (answer: string) => void;
  onSaveAndNext: () => void;
  onMarkForReview: () => void;
  onClearResponse: () => void;
  isLastQuestion: boolean;
}

export function QuestionCard({
  questionNumber,
  questionText,
  options,
  selectedAnswer,
  onAnswerChange,
  onSaveAndNext,
  onMarkForReview,
  onClearResponse,
  isLastQuestion,
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="p-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm h-full flex flex-col">
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
          <p className="text-lg leading-relaxed text-gray-800 mb-8 font-normal">
            {questionText}
          </p>

          <RadioGroup value={selectedAnswer || ""} onValueChange={onAnswerChange}>
            <div className="space-y-4">
              {options.map((option: string, idx: number) => {
                const isSelected = selectedAnswer === option;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div
                      className={`flex items-center space-x-4 p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 shadow-sm hover:shadow-md"
                      }`}
                    >
                      <RadioGroupItem
                        value={option}
                        id={`option-${idx}`}
                        className="border-2 w-5 h-5 text-blue-600"
                      />
                      <Label
                        htmlFor={`option-${idx}`}
                        className="cursor-pointer text-base text-gray-800 font-medium flex-1 leading-relaxed"
                      >
                        {option}
                      </Label>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onMarkForReview}
            className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-300 shadow-sm hover:shadow-md transition-all font-medium px-6"
          >
            Mark for Review & Next
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClearResponse}
              className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300 shadow-sm hover:shadow-md transition-all font-medium px-6"
            >
              Clear Response
            </Button>
            <Button
              onClick={onSaveAndNext}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all font-medium px-8"
            >
              {isLastQuestion ? "Save" : "Save & Next"}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
