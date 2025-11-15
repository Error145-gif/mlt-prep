import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageQuestionUpload() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explanation, setExplanation] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [source, setSource] = useState("manual");
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const generateUploadUrl = useMutation(api.questions.generateUploadUrl);
  const createImageQuestion = useMutation(api.questions.createImageQuestion);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    if (!questionText.trim()) {
      toast.error("Please enter question text");
      return;
    }

    if (options.some(opt => !opt.trim())) {
      toast.error("Please fill all options");
      return;
    }

    if (!correctAnswer.trim()) {
      toast.error("Please enter the correct answer");
      return;
    }

    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setIsUploading(true);

    try {
      // Step 1: Get upload URL
      const uploadUrl = await generateUploadUrl();

      // Step 2: Upload image
      const uploadResult = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": imageFile.type },
        body: imageFile,
      });

      if (!uploadResult.ok) {
        throw new Error("Failed to upload image");
      }

      const { storageId } = await uploadResult.json();

      // Step 3: Create question with image
      await createImageQuestion({
        type: "mcq",
        question: questionText,
        options: options,
        correctAnswer: correctAnswer,
        explanation: explanation || undefined,
        difficulty: difficulty,
        source: source,
        subject: subject || undefined,
        topic: topic,
        imageStorageId: storageId,
      });

      toast.success("Image-based question created successfully!");

      // Reset form
      setImageFile(null);
      setImagePreview(null);
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
      setExplanation("");
      setDifficulty("medium");
      setSource("manual");
      setTopic("");
      setSubject("");
    } catch (error) {
      console.error("Error creating image question:", error);
      toast.error("Failed to create image question");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Upload Image-Based Question
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-white">Question Image</Label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
                disabled={isUploading}
              />
              <label htmlFor="image-upload">
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer bg-white/10 border-white/30 text-white hover:bg-white/20"
                  disabled={isUploading}
                  asChild
                >
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Select Image
                  </span>
                </Button>
              </label>
              {imageFile && (
                <span className="text-white text-sm">{imageFile.name}</span>
              )}
            </div>

            <AnimatePresence>
              {imagePreview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative mt-4"
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full h-auto rounded-lg border-2 border-white/30"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <Label className="text-white">Question Text</Label>
            <Textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter question text (optional if image is self-explanatory)"
              className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
              disabled={isUploading}
            />
          </div>

          {/* Options */}
          <div className="space-y-2">
            <Label className="text-white">Options</Label>
            {options.map((option, index) => (
              <Input
                key={index}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                disabled={isUploading}
              />
            ))}
          </div>

          {/* Correct Answer */}
          <div className="space-y-2">
            <Label className="text-white">Correct Answer</Label>
            <Input
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              placeholder="Enter the correct answer exactly as it appears in options"
              className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
              disabled={isUploading}
            />
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <Label className="text-white">Explanation (Optional)</Label>
            <Textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explain why this is the correct answer"
              className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
              disabled={isUploading}
            />
          </div>

          {/* Topic & Subject */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Topic</Label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Hematology"
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                disabled={isUploading}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Subject (Optional)</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Clinical Pathology"
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Difficulty & Source */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty} disabled={isUploading}>
                <SelectTrigger className="bg-white/10 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Add to Test Type</Label>
              <Select value={source} onValueChange={setSource} disabled={isUploading}>
                <SelectTrigger className="bg-white/10 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Mock Test</SelectItem>
                  <SelectItem value="ai">AI Test</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Create Image Question
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
