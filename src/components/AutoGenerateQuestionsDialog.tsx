// @ts-nocheck
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface AutoGenerateQuestionsDialogProps {
  topics?: Array<{ _id: Id<"topics">; name: string }>;
  onGenerate: (count: number, difficulty?: string, topicId?: Id<"topics">) => Promise<void>;
  isGenerating: boolean;
}

export function AutoGenerateQuestionsDialog({ 
  topics, 
  onGenerate, 
  isGenerating 
}: AutoGenerateQuestionsDialogProps) {
  const [questionCount, setQuestionCount] = useState(500);
  const [difficulty, setDifficulty] = useState<string>("all");
  const [selectedTopicId, setSelectedTopicId] = useState<string>("all_topics");

  const handleGenerate = async () => {
    await onGenerate(
      questionCount,
      difficulty === "all" ? undefined : difficulty,
      selectedTopicId && selectedTopicId !== "all_topics" ? (selectedTopicId as Id<"topics">) : undefined
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-white">Number of Questions</Label>
          <Input
            type="number"
            value={questionCount}
            onChange={(e) => setQuestionCount(Math.max(1, parseInt(e.target.value) || 500))}
            className="bg-white/5 border-white/10 text-white"
            min={1}
            max={1000}
            disabled={isGenerating}
          />
          <p className="text-xs text-white/60 mt-1">
            Minimum: 1 question | Recommended: 500-1000 questions per batch
          </p>
        </div>

        <div>
          <Label className="text-white">Difficulty Level</Label>
          <Select value={difficulty} onValueChange={setDifficulty} disabled={isGenerating}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels (Mixed)</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white">Topic (Optional)</Label>
          <Select value={selectedTopicId} onValueChange={setSelectedTopicId} disabled={isGenerating}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="All Topics" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_topics">All Topics</SelectItem>
              {topics?.map((topic) => (
                <SelectItem key={topic._id} value={topic._id}>
                  {topic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-blue-300 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-300">AI-Powered Generation</p>
            <p className="text-xs text-white/70">
              Questions are automatically generated using advanced AI based on Medical Lab Technology knowledge. 
              No PDF upload required. The AI will create diverse, high-quality questions covering various MLT topics.
            </p>
          </div>
        </div>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={isGenerating || questionCount < 1}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Generating {questionCount} Questions...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5 mr-2" />
            Generate {questionCount} Questions
          </>
        )}
      </Button>
    </div>
  );
}