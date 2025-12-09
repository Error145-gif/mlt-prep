import { motion } from "framer-motion";
import { Id } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Flag } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

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
  imageUrl?: string;
  questionId: string | Id<"questions">;
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
  imageUrl,
  questionId,
}: QuestionCardProps) {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportIssueType, setReportIssueType] = useState("wrong_answer");
  const [reportDescription, setReportDescription] = useState("");
  const reportQuestion = useMutation(api.questions.reportQuestion);

  const handleReportSubmit = async () => {
    // Debug: Log the questionId to see what we're receiving
    console.log("QuestionCard questionId:", questionId, "Type:", typeof questionId);
    
    if (!reportDescription.trim()) {
      toast.error("Please provide a description of the error");
      return;
    }

    try {
      // Ensure questionId is properly typed as Id<"questions">
      const qId = typeof questionId === "string" && questionId.startsWith("j") 
        ? questionId as Id<"questions">
        : questionId as Id<"questions">;
      
      console.log("Submitting report with qId:", qId);
      
      await reportQuestion({
        questionId: qId,
        issueType: reportIssueType,
        description: reportDescription,
      });
      toast.success("Error reported successfully. Thank you!");
      setIsReportDialogOpen(false);
      setReportDescription("");
      setReportIssueType("wrong_answer");
    } catch (error: any) {
      toast.error(error?.message || "Failed to submit report");
      console.error("Report submission error:", error);
    }
  };

  const handleCopy = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    toast.error("Copying is disabled during tests");
  };

  const handleCut = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    toast.error("Cutting is disabled during tests");
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    toast.error("Right-click is disabled during tests");
  };

  return (
    <motion.div
      key={questionNumber}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="h-full"
      style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
      onCopy={handleCopy}
      onCut={handleCut}
      onContextMenu={handleContextMenu}
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsReportDialogOpen(true)}
            className="text-gray-500 hover:text-red-600 hover:bg-red-50"
            title="Report Error"
          >
            <Flag className="w-4 h-4 mr-2" />
            Report Error
          </Button>
        </div>

        <div className="flex-1 mb-6">
          <p className="text-lg leading-relaxed text-gray-800 mb-8 font-normal" style={{ userSelect: 'none' }}>
            {questionText}
          </p>

          {/* Display question image if it exists */}
          {imageUrl && (
            <div className="mb-6">
              <img
                src={imageUrl}
                alt="Question"
                className="max-w-full h-auto rounded-lg border-2 border-gray-200 shadow-sm"
                style={{ userSelect: 'none', pointerEvents: 'none' }}
                onContextMenu={(e: React.MouseEvent<HTMLImageElement>) => e.preventDefault()}
                draggable={false}
              />
            </div>
          )}

          <RadioGroup value={selectedAnswer || ""} onValueChange={onAnswerChange}>
            <div className="space-y-4">
              {options.map((option: string, idx: number) => {
                const isSelected = selectedAnswer === option;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className={`flex items-center space-x-4 p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 shadow-sm hover:shadow-md"
                      }`}
                      style={{ userSelect: 'none' }}
                    >
                      <RadioGroupItem
                        value={option}
                        id={`option-${idx}`}
                        className="border-2 w-6 h-6 text-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <Label
                        htmlFor={`option-${idx}`}
                        className="cursor-pointer text-base text-gray-800 font-medium flex-1 leading-relaxed"
                        style={{ userSelect: 'none' }}
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

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onMarkForReview}
            className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-300 shadow-sm hover:shadow-md transition-all font-medium px-6 w-full sm:w-auto"
          >
            Mark for Review & Next
          </Button>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={onClearResponse}
              className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300 shadow-sm hover:shadow-md transition-all font-medium px-6 w-full sm:w-auto"
            >
              Clear Response
            </Button>
            <Button
              onClick={onSaveAndNext}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all font-medium px-8 w-full sm:w-auto"
            >
              {isLastQuestion ? "Save" : "Save & Next"}
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Question Error</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Issue Type</label>
              <Select value={reportIssueType} onValueChange={setReportIssueType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wrong_answer">Wrong Answer</SelectItem>
                  <SelectItem value="typo">Spelling/Grammar Mistake</SelectItem>
                  <SelectItem value="image_issue">Image Issue</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Please describe the error..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReportSubmit} className="bg-red-600 hover:bg-red-700">
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}