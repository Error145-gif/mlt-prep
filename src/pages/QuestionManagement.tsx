import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate } from "react-router";
import { useState } from "react";
import { Loader2, CheckCircle, XCircle, Plus, Upload, FileText, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Id } from "@/convex/_generated/dataModel";
import { AutoGenerateQuestionsDialog } from "@/components/AutoGenerateQuestionsDialog";

export default function QuestionManagement() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [showManualForm, setShowManualForm] = useState(false);
  const [showBulkManualForm, setShowBulkManualForm] = useState(false);
  const [showPYQManualForm, setShowPYQManualForm] = useState(false);
  const [showAIUpload, setShowAIUpload] = useState(false);
  const [showPYQUpload, setShowPYQUpload] = useState(false);
  const [showAutoGenerate, setShowAutoGenerate] = useState(false);
  const [showAIBulkForm, setShowAIBulkForm] = useState(false);
  const [pyqYear, setPyqYear] = useState<number>(new Date().getFullYear());
  const [pyqExamName, setPyqExamName] = useState<string>("");
  
  // AI bulk questions state - 50 separate sections
  const [aiBulkQuestions, setAiBulkQuestions] = useState<string[]>(Array(50).fill(""));
  
  // PYQ bulk questions state - 50 separate sections
  const [pyqBulkQuestions, setPyqBulkQuestions] = useState<string[]>(Array(50).fill(""));
  
  const questions = useQuery(api.questions.getQuestions, { status: activeTab === "all" ? undefined : activeTab });
  const topics = useQuery(api.topics.getAllTopics);
  const reviewQuestion = useMutation(api.questions.reviewQuestion);
  const createQuestion = useMutation(api.questions.createQuestion);
  const deleteQuestion = useMutation(api.questions.deleteQuestion);
  const batchCreateQuestions = useMutation(api.questions.batchCreateQuestions);
  const generateUploadUrl = useMutation(api.content.generateUploadUrl);
  const generateAIQuestions = useAction(api.aiQuestions.generateQuestionsFromAI);
  const generateAIQuestionsFromPDF = useAction(api.aiQuestions.generateQuestionsFromPDF);
  const extractPYQ = useAction(api.aiQuestions.extractPYQFromPDF);
  const batchCreateQuestionsAction = useAction(api.aiQuestions.batchCreateQuestions);

  // Manual question form state
  const [manualQuestion, setManualQuestion] = useState({
    type: "mcq",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    explanation: "",
    difficulty: "medium",
    topicId: "",
    subject: "",
    examName: "",
  });

  // Bulk manual entry state - 20 separate sections
  const [bulkQuestions, setBulkQuestions] = useState<string[]>(Array(20).fill(""));

  // AI generated questions preview
  const [aiQuestions, setAiQuestions] = useState<any[]>([]);
  const [pyqQuestions, setPyqQuestions] = useState<any[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [savingQuestions, setSavingQuestions] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/auth" />;
  }

  const handleReview = async (id: Id<"questions">, status: string) => {
    try {
      await reviewQuestion({ id, status });
      toast.success(`Question ${status}!`);
    } catch (error) {
      toast.error("Failed to review question");
    }
  };

  const handleManualSubmit = async () => {
    try {
      await createQuestion({
        ...manualQuestion,
        topicId: manualQuestion.topicId ? (manualQuestion.topicId as Id<"topics">) : undefined,
        options: manualQuestion.type === "mcq" ? manualQuestion.options : undefined,
        source: "manual",
        examName: manualQuestion.examName || undefined,
        subject: manualQuestion.subject || undefined,
      });
      toast.success("Question created successfully!");
      setShowManualForm(false);
      setManualQuestion({
        type: "mcq",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        explanation: "",
        difficulty: "medium",
        topicId: "",
        subject: "",
        examName: "",
      });
    } catch (error) {
      toast.error("Failed to create question");
    }
  };

  const handleBulkManualSubmit = async () => {
    try {
      // Filter out empty question blocks
      const questionBlocks = bulkQuestions.filter(block => block.trim());
      
      if (questionBlocks.length === 0) {
        toast.error("No questions found. Please paste questions in the correct format.");
        return;
      }
      
      console.log(`Processing ${questionBlocks.length} question blocks...`);
      
      const parsedQuestions = [];
      const errors = [];
      
      for (let index = 0; index < questionBlocks.length; index++) {
        const block = questionBlocks[index];
        try {
          const lines = block.split('\n').map(line => line.trim()).filter(line => line);
          const question: any = {
            type: "mcq",
            difficulty: "medium",
            source: "manual"
          };
          
          lines.forEach(line => {
            const colonIndex = line.indexOf(':');
            
            if (colonIndex === -1) return;
            
            const key = line.substring(0, colonIndex).trim().toLowerCase();
            const value = line.substring(colonIndex + 1).trim();
            
            if (!value) return;
            
            switch (key) {
              case 'q':
              case 'question':
                question.question = value;
                break;
              case 'a':
              case 'answer':
              case 'correct answer':
                question.correctAnswer = value;
                break;
              case 'options':
              case 'option':
                question.options = value.split('|').map(opt => opt.trim()).filter(opt => opt);
                break;
              case 'subject':
                question.subject = value;
                break;
              case 'topic':
                const matchingTopic = topics?.find(t => 
                  t.name.toLowerCase() === value.toLowerCase()
                );
                if (matchingTopic) {
                  question.topicId = matchingTopic._id;
                }
                break;
              case 'difficulty':
                const diff = value.toLowerCase();
                question.difficulty = ['easy', 'medium', 'hard'].includes(diff) ? diff : 'medium';
                break;
              case 'type':
                const typeStr = value.toLowerCase().replace(/[^a-z]/g, '');
                if (typeStr === 'truefalse' || typeStr === 'tf') {
                  question.type = 'true_false';
                } else if (typeStr === 'shortanswer' || typeStr === 'sa') {
                  question.type = 'short_answer';
                } else {
                  question.type = 'mcq';
                }
                break;
              case 'explanation':
                question.explanation = value;
                break;
              case 'exam':
              case 'exam name':
                question.examName = value;
                break;
            }
          });
          
          // Validate required fields
          if (!question.question || question.question.trim() === '') {
            throw new Error(`Missing question text. Please ensure the line starts with "Q:" or "Question:"`);
          }
          if (!question.correctAnswer || question.correctAnswer.trim() === '') {
            throw new Error(`Missing correct answer. Please ensure the line starts with "A:" or "Answer:"`);
          }
          if (!question.subject) {
            question.subject = "General";
          }
          
          // Validate MCQ has options
          if (question.type === 'mcq' && (!question.options || question.options.length < 2)) {
            throw new Error(`MCQ must have at least 2 options. Please ensure the line starts with "Options:" and options are separated by "|"`);
          }
          
          parsedQuestions.push(question);
          console.log(`Successfully parsed question ${index + 1}:`, question.question.substring(0, 50) + '...');
        } catch (error) {
          const errorMsg = `Question ${index + 1}: ${error instanceof Error ? error.message : 'Invalid format'}`;
          errors.push(errorMsg);
          console.error(errorMsg);
          console.error('Failed block content:', block);
        }
      }
      
      if (parsedQuestions.length === 0) {
        toast.error("No valid questions found. Please check your format.");
        if (errors.length > 0) {
          console.error("Parsing errors:", errors);
          toast.error(`First error: ${errors[0]}`);
        }
        return;
      }
      
      console.log(`Attempting to save ${parsedQuestions.length} questions to database...`);
      const result = await batchCreateQuestions({ questions: parsedQuestions });
      console.log(`Database save result:`, result);
      
      if (errors.length > 0) {
        toast.warning(`${parsedQuestions.length} questions added. ${errors.length} questions had errors.`);
        console.error("Parsing errors:", errors);
      } else {
        toast.success(`${parsedQuestions.length} questions added successfully!`);
      }
      
      setShowBulkManualForm(false);
      setBulkQuestions(Array(20).fill(""));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add questions. Please try again.");
      console.error("Bulk add error:", error);
    }
  };

  const handleAIBulkSubmit = async () => {
    try {
      // Filter out empty question blocks
      const questionBlocks = aiBulkQuestions.filter(block => block.trim());
      
      if (questionBlocks.length === 0) {
        toast.error("No questions found. Please paste questions in the correct format.");
        return;
      }
      
      if (questionBlocks.length > 50) {
        toast.error("Cannot add more than 50 questions at once");
        return;
      }
      
      console.log(`Processing ${questionBlocks.length} AI question blocks...`);
      
      const parsedQuestions = [];
      const errors = [];
      
      for (let index = 0; index < questionBlocks.length; index++) {
        const block = questionBlocks[index];
        try {
          const lines = block.split('\n').filter(line => line.trim());
          const question: any = {
            type: "mcq",
            difficulty: "medium",
            source: "ai"
          };
          
          lines.forEach(line => {
            const trimmedLine = line.trim();
            const colonIndex = trimmedLine.indexOf(':');
            
            if (colonIndex === -1) return;
            
            const key = trimmedLine.substring(0, colonIndex).trim().toLowerCase();
            const value = trimmedLine.substring(colonIndex + 1).trim();
            
            if (!value) return;
            
            switch (key) {
              case 'q':
              case 'question':
                question.question = value;
                break;
              case 'a':
              case 'answer':
              case 'correct answer':
                question.correctAnswer = value;
                break;
              case 'options':
              case 'option':
                question.options = value.split('|').map(opt => opt.trim()).filter(opt => opt);
                break;
              case 'subject':
                question.subject = value;
                break;
              case 'topic':
                const matchingTopic = topics?.find(t => 
                  t.name.toLowerCase() === value.toLowerCase()
                );
                if (matchingTopic) {
                  question.topicId = matchingTopic._id;
                }
                break;
              case 'difficulty':
                const diff = value.toLowerCase();
                question.difficulty = ['easy', 'medium', 'hard'].includes(diff) ? diff : 'medium';
                break;
              case 'type':
                const typeStr = value.toLowerCase().replace(/[^a-z]/g, '');
                if (typeStr === 'truefalse' || typeStr === 'tf') {
                  question.type = 'true_false';
                } else if (typeStr === 'shortanswer' || typeStr === 'sa') {
                  question.type = 'short_answer';
                } else {
                  question.type = 'mcq';
                }
                break;
              case 'explanation':
                question.explanation = value;
                break;
            }
          });
          
          // Validate required fields
          if (!question.question) {
            throw new Error(`Missing question text`);
          }
          if (!question.correctAnswer) {
            throw new Error(`Missing correct answer`);
          }
          if (!question.subject) {
            question.subject = "General";
          }
          
          // Validate MCQ has options
          if (question.type === 'mcq' && (!question.options || question.options.length < 2)) {
            throw new Error(`MCQ must have at least 2 options`);
          }
          
          parsedQuestions.push(question);
          console.log(`Successfully parsed AI question ${index + 1}:`, question.question.substring(0, 50) + '...');
        } catch (error) {
          const errorMsg = `Question ${index + 1}: ${error instanceof Error ? error.message : 'Invalid format'}`;
          errors.push(errorMsg);
          console.error(errorMsg);
        }
      }
      
      if (parsedQuestions.length === 0) {
        toast.error("No valid questions found. Please check your format.");
        if (errors.length > 0) {
          console.error("Parsing errors:", errors);
          toast.error(`Errors: ${errors.slice(0, 3).join('; ')}`);
        }
        return;
      }
      
      console.log(`Attempting to save ${parsedQuestions.length} AI questions to database...`);
      const result = await batchCreateQuestions({ questions: parsedQuestions });
      console.log(`Database save result:`, result);
      
      if (errors.length > 0) {
        toast.warning(`${parsedQuestions.length} AI questions added. ${errors.length} questions had errors.`);
        console.error("Parsing errors:", errors);
      } else {
        toast.success(`${parsedQuestions.length} AI questions added successfully!`);
      }
      
      setShowAIBulkForm(false);
      setAiBulkQuestions(Array(50).fill(""));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add AI questions. Please try again.");
      console.error("AI bulk add error:", error);
    }
  };

  const handlePYQManualSubmit = async () => {
    try {
      // Parse PYQ questions from plain text format
      const questionBlocks = bulkQuestions.filter(block => block.trim());
      
      if (questionBlocks.length === 0) {
        toast.error("No questions found. Please paste questions in the correct format.");
        return;
      }
      
      if (questionBlocks.length > 50) {
        toast.error("Cannot add more than 50 questions at once");
        return;
      }
      
      const parsedQuestions = questionBlocks.map((block, index) => {
        const lines = block.split('\n').filter(line => line.trim());
        const question: any = {
          type: "mcq",
          difficulty: "medium",
          source: "pyq",
          examName: pyqExamName,
          year: pyqYear
        };
        
        lines.forEach(line => {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('Q:')) {
            question.question = trimmedLine.substring(2).trim();
          } else if (trimmedLine.startsWith('A:')) {
            question.correctAnswer = trimmedLine.substring(2).trim();
          } else if (trimmedLine.startsWith('Options:')) {
            question.options = trimmedLine.substring(8).split('|').map(opt => opt.trim());
          } else if (trimmedLine.startsWith('Subject:')) {
            question.subject = trimmedLine.substring(8).trim();
          } else if (trimmedLine.startsWith('Topic:')) {
            const topicName = trimmedLine.substring(6).trim();
            const matchingTopic = topics?.find(t => t.name.toLowerCase() === topicName.toLowerCase());
            if (matchingTopic) {
              question.topicId = matchingTopic._id;
            }
          } else if (trimmedLine.startsWith('Difficulty:')) {
            question.difficulty = trimmedLine.substring(11).trim().toLowerCase();
          } else if (trimmedLine.startsWith('Type:')) {
            const typeStr = trimmedLine.substring(5).trim().toLowerCase();
            question.type = typeStr === 'true/false' || typeStr === 'truefalse' ? 'true_false' : 
                           typeStr === 'short answer' || typeStr === 'shortanswer' ? 'short_answer' : 'mcq';
          } else if (trimmedLine.startsWith('Explanation:')) {
            question.explanation = trimmedLine.substring(12).trim();
          }
        });
        
        // Validate required fields
        if (!question.question || !question.correctAnswer) {
          throw new Error(`Question ${index + 1} is missing required fields (Q: or A:)`);
        }
        
        return question;
      });
      
      await batchCreateQuestions({ questions: parsedQuestions });
      toast.success(`${parsedQuestions.length} PYQ questions added successfully!`);
      setShowPYQManualForm(false);
      setBulkQuestions(Array(20).fill(""));
      setPyqExamName("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to parse PYQ questions. Please check your format.");
    }
  };

  const handleAIUpload = async (file: File) => {
    try {
      setUploadingFile(true);
      
      // Validate file
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        toast.error("File size must be less than 100MB");
        return;
      }
      
      toast.info("Uploading PDF...");
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      if (!result.ok) {
        throw new Error("Failed to upload file");
      }
      
      const { storageId } = await result.json();
      
      toast.info("Generating questions with AI... This may take a moment.");
      const generated = await generateAIQuestionsFromPDF({ fileId: storageId });
      
      if (!generated || generated.length === 0) {
        toast.error("No questions were generated. Please try again.");
        return;
      }
      
      setAiQuestions(generated);
      toast.success(`${generated.length} questions generated! Review and save them.`);
    } catch (error) {
      console.error("AI generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate questions. Please check your API key and try again.");
    } finally {
      setUploadingFile(false);
    }
  };

  const handlePYQUpload = async (file: File, year: number) => {
    try {
      setUploadingFile(true);
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      
      const extracted = await extractPYQ({ fileId: storageId, year });
      setPyqQuestions(extracted);
      toast.success("PYQ extracted! Review and save them.");
    } catch (error) {
      toast.error("Failed to extract PYQ");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSavePYQQuestions = async () => {
    try {
      setSavingQuestions(true);
      await batchCreateQuestionsAction({ questions: pyqQuestions });
      toast.success(`${pyqQuestions.length} PYQ questions saved successfully!`);
      setPyqQuestions([]);
      setShowPYQUpload(false);
    } catch (error) {
      toast.error("Failed to save PYQ questions");
    } finally {
      setSavingQuestions(false);
    }
  };

  const handleAutoGenerate = async (count: number, difficulty?: string, topicId?: Id<"topics">) => {
    try {
      setUploadingFile(true);
      toast.info(`Generating ${count} questions with AI... This may take a moment.`);
      
      const generated = await generateAIQuestions({ 
        questionCount: count, 
        difficulty,
        topicId 
      });
      
      if (!generated || generated.length === 0) {
        toast.error("No questions were generated. Please try again.");
        return;
      }
      
      setAiQuestions(generated);
      toast.success(`${generated.length} questions generated! Review and save them.`);
      setShowAutoGenerate(false);
    } catch (error) {
      console.error("Auto generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate questions. Please check your API key and try again.");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSaveAIQuestions = async () => {
    try {
      setSavingQuestions(true);
      await batchCreateQuestionsAction({ questions: aiQuestions });
      toast.success(`${aiQuestions.length} AI questions saved successfully!`);
      setAiQuestions([]);
    } catch (error) {
      toast.error("Failed to save AI questions");
    } finally {
      setSavingQuestions(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Rejected</Badge>;
      default:
        return null;
    }
  };

  const getSourceBadge = (source?: string) => {
    switch (source) {
      case "manual":
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Manual</Badge>;
      case "ai":
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">AI</Badge>;
      case "pyq":
        return <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">PYQ</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Unknown</Badge>;
    }
  };

  const getDuplicateQuestions = () => {
    if (!questions) return new Set<string>();
    
    const questionTextMap = new Map<string, number>();
    const duplicateIds = new Set<string>();
    
    // Count occurrences of each question text
    questions.forEach(q => {
      const normalizedText = q.question.toLowerCase().trim();
      questionTextMap.set(normalizedText, (questionTextMap.get(normalizedText) || 0) + 1);
    });
    
    // Mark questions as duplicates if they appear more than once
    questions.forEach(q => {
      const normalizedText = q.question.toLowerCase().trim();
      if (questionTextMap.get(normalizedText)! > 1) {
        duplicateIds.add(q._id);
      }
    });
    
    return duplicateIds;
  };

  const duplicateQuestions = getDuplicateQuestions();

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-white">Question Management</h1>
          <div className="flex gap-2 flex-wrap">
            <Dialog open={showManualForm} onOpenChange={setShowManualForm}>
              <DialogTrigger asChild>
                <Button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Single Question
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/20 backdrop-blur-xl bg-white/10 max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-white">Add Question Manually</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Subject</Label>
                    <Input
                      value={manualQuestion.subject}
                      onChange={(e) => setManualQuestion({ ...manualQuestion, subject: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="e.g., Hematology, Microbiology"
                    />
                  </div>

                  <div>
                    <Label className="text-white">Exam Name (Optional)</Label>
                    <Input
                      value={manualQuestion.examName}
                      onChange={(e) => setManualQuestion({ ...manualQuestion, examName: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="e.g., RRB Section Officer"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white">Question Type</Label>
                    <Select value={manualQuestion.type} onValueChange={(v) => setManualQuestion({ ...manualQuestion, type: v })}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mcq">MCQ</SelectItem>
                        <SelectItem value="true_false">True/False</SelectItem>
                        <SelectItem value="short_answer">Short Answer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-white">Question Text</Label>
                    <Textarea
                      value={manualQuestion.question}
                      onChange={(e) => setManualQuestion({ ...manualQuestion, question: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                      rows={3}
                    />
                  </div>

                  {manualQuestion.type === "mcq" && (
                    <div>
                      <Label className="text-white">Options</Label>
                      {manualQuestion.options.map((opt, idx) => (
                        <Input
                          key={idx}
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...manualQuestion.options];
                            newOpts[idx] = e.target.value;
                            setManualQuestion({ ...manualQuestion, options: newOpts });
                          }}
                          className="bg-white/5 border-white/10 text-white mt-2"
                          placeholder={`Option ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}

                  <div>
                    <Label className="text-white">Correct Answer</Label>
                    <Input
                      value={manualQuestion.correctAnswer}
                      onChange={(e) => setManualQuestion({ ...manualQuestion, correctAnswer: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-white">Explanation (Optional)</Label>
                    <Textarea
                      value={manualQuestion.explanation}
                      onChange={(e) => setManualQuestion({ ...manualQuestion, explanation: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label className="text-white">Topic</Label>
                    <Select value={manualQuestion.topicId} onValueChange={(v) => setManualQuestion({ ...manualQuestion, topicId: v })}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {topics?.map((topic) => (
                          <SelectItem key={topic._id} value={topic._id}>
                            {topic.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Difficulty</Label>
                    <Select value={manualQuestion.difficulty} onValueChange={(v) => setManualQuestion({ ...manualQuestion, difficulty: v })}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleManualSubmit} className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30">
                      Save Question
                    </Button>
                    <Button onClick={() => setShowManualForm(false)} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showBulkManualForm} onOpenChange={setShowBulkManualForm}>
              <DialogTrigger asChild>
                <Button className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30">
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Add (Up to 50)
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/20 backdrop-blur-xl bg-white/10 max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-white">Bulk Add Questions (Up to 50)</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  <div>
                    <Label className="text-white">Paste Questions in Plain Text (20 Separate Sections)</Label>
                    <p className="text-white/60 text-sm mb-2">
                      Format each question like this:
                    </p>
                    <div className="bg-white/5 border border-white/10 rounded p-3 mb-4 text-xs text-white/70 font-mono">
                      Q: What is EDTA?<br/>
                      A: Anticoagulant<br/>
                      Options: Anticoagulant | Stain | Buffer | Enzyme<br/>
                      Subject: Hematology<br/>
                      Topic: Anticoagulants<br/>
                      Difficulty: Easy<br/>
                      Type: MCQ<br/>
                      Explanation: EDTA is used to prevent blood clotting
                    </div>
                  </div>
                  
                  {bulkQuestions.map((question, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-white font-semibold">Question {index + 1}</Label>
                        {question.trim() && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newQuestions = [...bulkQuestions];
                              newQuestions[index] = "";
                              setBulkQuestions(newQuestions);
                            }}
                            className="text-red-300 hover:text-red-200 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Clear
                          </Button>
                        )}
                      </div>
                      <Textarea
                        value={question}
                        onChange={(e) => {
                          const newQuestions = [...bulkQuestions];
                          newQuestions[index] = e.target.value;
                          setBulkQuestions(newQuestions);
                        }}
                        className="bg-white/5 border-white/10 text-white font-mono text-sm"
                        rows={8}
                        placeholder={`Q: Question text here?&#10;A: Answer here&#10;Options: Option1 | Option2 | Option3 | Option4&#10;Subject: Subject name&#10;Topic: Topic name&#10;Difficulty: Easy&#10;Type: MCQ`}
                      />
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Button onClick={handleBulkManualSubmit} className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30">
                      Add All Questions
                    </Button>
                    <Button onClick={() => setShowBulkManualForm(false)} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showAIBulkForm} onOpenChange={setShowAIBulkForm}>
              <DialogTrigger asChild>
                <Button className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Bulk Add (Up to 50)
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/20 backdrop-blur-xl bg-white/10 max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-white">AI Bulk Add Questions (Up to 50)</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  <div>
                    <Label className="text-white">Paste AI Questions in Plain Text (50 Separate Sections)</Label>
                    <p className="text-white/60 text-sm mb-2">
                      Format each question like this:
                    </p>
                    <div className="bg-white/5 border border-white/10 rounded p-3 mb-4 text-xs text-white/70 font-mono">
                      Q: What is EDTA?<br/>
                      A: Anticoagulant<br/>
                      Options: Anticoagulant | Stain | Buffer | Enzyme<br/>
                      Subject: Hematology<br/>
                      Topic: Anticoagulants<br/>
                      Difficulty: Easy<br/>
                      Type: MCQ<br/>
                      Explanation: EDTA is used to prevent blood clotting
                    </div>
                  </div>
                  
                  {aiBulkQuestions.map((question, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-white font-semibold">AI Question {index + 1}</Label>
                        {question.trim() && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newQuestions = [...aiBulkQuestions];
                              newQuestions[index] = "";
                              setAiBulkQuestions(newQuestions);
                            }}
                            className="text-red-300 hover:text-red-200 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Clear
                          </Button>
                        )}
                      </div>
                      <Textarea
                        value={question}
                        onChange={(e) => {
                          const newQuestions = [...aiBulkQuestions];
                          newQuestions[index] = e.target.value;
                          setAiBulkQuestions(newQuestions);
                        }}
                        className="bg-white/5 border-white/10 text-white font-mono text-sm"
                        rows={8}
                        placeholder={`Q: Question text here?&#10;A: Answer here&#10;Options: Option1 | Option2 | Option3 | Option4&#10;Subject: Subject name&#10;Topic: Topic name&#10;Difficulty: Easy&#10;Type: MCQ`}
                      />
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Button onClick={handleAIBulkSubmit} className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30">
                      Add All AI Questions
                    </Button>
                    <Button onClick={() => setShowAIBulkForm(false)} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showPYQManualForm} onOpenChange={setShowPYQManualForm}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30">
                  <FileText className="h-4 w-4 mr-2" />
                  Add PYQ Questions
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/20 backdrop-blur-xl bg-white/10 max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-white">Add PYQ Questions (Up to 50)</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Exam Name</Label>
                    <Input
                      value={pyqExamName}
                      onChange={(e) => setPyqExamName(e.target.value)}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="e.g., RRB Section Officer, AIIMS MLT"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Year</Label>
                    <Input
                      type="number"
                      value={pyqYear}
                      onChange={(e) => setPyqYear(parseInt(e.target.value))}
                      className="bg-white/5 border-white/10 text-white"
                      min={2000}
                      max={new Date().getFullYear()}
                    />
                  </div>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    <div>
                      <Label className="text-white">Paste PYQ Questions in Plain Text (20 Separate Sections)</Label>
                      <p className="text-white/60 text-sm mb-2">
                        Format each question like this:
                      </p>
                      <div className="bg-white/5 border border-white/10 rounded p-3 mb-4 text-xs text-white/70 font-mono">
                        Q: What is EDTA?<br/>
                        A: Anticoagulant<br/>
                        Options: Anticoagulant | Stain | Buffer | Enzyme<br/>
                        Subject: Hematology<br/>
                        Topic: Anticoagulants<br/>
                        Difficulty: Easy<br/>
                        Type: MCQ
                      </div>
                    </div>
                    
                    {bulkQuestions.map((question, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-white font-semibold">PYQ Question {index + 1}</Label>
                          {question.trim() && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newQuestions = [...bulkQuestions];
                                newQuestions[index] = "";
                                setBulkQuestions(newQuestions);
                              }}
                              className="text-red-300 hover:text-red-200 hover:bg-red-500/20"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Clear
                            </Button>
                          )}
                        </div>
                        <Textarea
                          value={question}
                          onChange={(e) => {
                            const newQuestions = [...bulkQuestions];
                            newQuestions[index] = e.target.value;
                            setBulkQuestions(newQuestions);
                          }}
                          className="bg-white/5 border-white/10 text-white font-mono text-sm"
                          rows={8}
                          placeholder={`Q: Question text here?&#10;A: Answer here&#10;Options: Option1 | Option2 | Option3 | Option4&#10;Subject: Subject name&#10;Topic: Topic name&#10;Difficulty: Easy&#10;Type: MCQ`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handlePYQManualSubmit} className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30">
                      Add All PYQ Questions
                    </Button>
                    <Button onClick={() => setShowPYQManualForm(false)} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showAutoGenerate} onOpenChange={setShowAutoGenerate}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Auto Generate AI Questions
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/20 backdrop-blur-xl bg-white/10 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Auto Generate AI Questions</DialogTitle>
                </DialogHeader>
                <AutoGenerateQuestionsDialog
                  topics={topics}
                  onGenerate={handleAutoGenerate}
                  isGenerating={uploadingFile}
                />
              </DialogContent>
            </Dialog>

            <Dialog open={showPYQUpload} onOpenChange={setShowPYQUpload}>
              <DialogTrigger asChild>
                <Button className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30">
                  <Upload className="h-4 w-4 mr-2" />
                  Extract PYQ from PDF
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/20 backdrop-blur-xl bg-white/10 max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-white">Extract PYQ from PDF</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Year</Label>
                    <Input
                      type="number"
                      value={pyqYear}
                      onChange={(e) => setPyqYear(parseInt(e.target.value))}
                      className="bg-white/5 border-white/10 text-white"
                      min={2000}
                      max={new Date().getFullYear()}
                    />
                  </div>
                  <div>
                    <Label className="text-white">Upload PDF</Label>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.type !== "application/pdf") {
                            toast.error("Please upload a PDF file");
                            return;
                          }
                          if (file.size > 100 * 1024 * 1024) {
                            toast.error("File size must be less than 100MB");
                            return;
                          }
                          handlePYQUpload(file, pyqYear);
                        }
                      }}
                      className="bg-white/5 border-white/10 text-white"
                      disabled={uploadingFile}
                    />
                    {uploadingFile && (
                      <div className="flex items-center gap-2 mt-2 text-white/60">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Extracting PYQ...</span>
                      </div>
                    )}
                  </div>
                  {aiQuestions.length > 0 && (
                    <div className="space-y-4 mt-6">
                      <div className="flex items-center justify-between">
                        <p className="text-white font-medium">{aiQuestions.length} AI questions generated</p>
                        <Button
                          onClick={handleSaveAIQuestions}
                          disabled={savingQuestions}
                          className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30"
                        >
                          {savingQuestions ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save All Questions"
                          )}
                        </Button>
                      </div>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {aiQuestions.map((q, idx) => (
                          <div key={idx} className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-white font-medium mb-2">{q.question}</p>
                            {q.options && (
                              <div className="space-y-1 mb-2">
                                {q.options.map((opt: string, optIdx: number) => (
                                  <div
                                    key={optIdx}
                                    className={`text-sm p-2 rounded ${
                                      opt === q.correctAnswer
                                        ? "bg-green-500/20 text-green-300"
                                        : "text-white/70"
                                    }`}
                                  >
                                    {opt}
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="flex gap-2 text-xs text-white/60">
                              <span>{q.subject || "General"}</span>
                              <span>•</span>
                              <span>{q.topic || "Various"}</span>
                              <span>•</span>
                              <span className="capitalize">{q.difficulty}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showPYQUpload} onOpenChange={setShowPYQUpload}>
              <DialogTrigger asChild>
                <Button className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30">
                  <Upload className="h-4 w-4 mr-2" />
                  Extract PYQ from PDF
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/20 backdrop-blur-xl bg-white/10 max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-white">Extract PYQ from PDF</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Year</Label>
                    <Input
                      type="number"
                      value={pyqYear}
                      onChange={(e) => setPyqYear(parseInt(e.target.value))}
                      className="bg-white/5 border-white/10 text-white"
                      min={2000}
                      max={new Date().getFullYear()}
                    />
                  </div>
                  <div>
                    <Label className="text-white">Upload PDF</Label>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.type !== "application/pdf") {
                            toast.error("Please upload a PDF file");
                            return;
                          }
                          if (file.size > 100 * 1024 * 1024) {
                            toast.error("File size must be less than 100MB");
                            return;
                          }
                          handlePYQUpload(file, pyqYear);
                        }
                      }}
                      className="bg-white/5 border-white/10 text-white"
                      disabled={uploadingFile}
                    />
                    {uploadingFile && (
                      <div className="flex items-center gap-2 mt-2 text-white/60">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Extracting PYQ...</span>
                      </div>
                    )}
                  </div>
                  {pyqQuestions.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-white font-medium">{pyqQuestions.length} PYQ questions extracted</p>
                        <Button
                          onClick={handleSavePYQQuestions}
                          disabled={savingQuestions}
                          className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30"
                        >
                          {savingQuestions ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save All Questions"
                          )}
                        </Button>
                      </div>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {pyqQuestions.map((q, idx) => (
                          <div key={idx} className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-white font-medium mb-2">{q.question}</p>
                            {q.options && (
                              <div className="space-y-1 mb-2">
                                {q.options.map((opt: string, optIdx: number) => (
                                  <div
                                    key={optIdx}
                                    className={`text-sm p-2 rounded ${
                                      opt === q.correctAnswer
                                        ? "bg-green-500/20 text-green-300"
                                        : "text-white/70"
                                    }`}
                                  >
                                    {opt}
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="flex gap-2 text-xs text-white/60">
                              <span>Year: {q.year}</span>
                              <span>•</span>
                              <span className="capitalize">{q.difficulty}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <TabsTrigger value="all" className="data-[state=active]:bg-white/20">
              All Questions
            </TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-white/20">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approved
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-6">
            {!questions || questions.length === 0 ? (
              <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                <CardContent className="py-12 text-center">
                  <p className="text-white/60">No questions found</p>
                </CardContent>
              </Card>
            ) : (
              questions.map((question, index) => {
                const isDuplicate = duplicateQuestions.has(question._id);
                
                return (
                  <motion.div
                    key={question._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`glass-card backdrop-blur-xl ${
                      isDuplicate 
                        ? 'border-red-500/50 bg-red-500/10' 
                        : 'border-white/20 bg-white/10'
                    }`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <CardTitle className="text-white text-lg">{question.question}</CardTitle>
                              {isDuplicate && (
                                <Badge className="bg-red-500/30 text-red-200 border-red-500/50">
                                  Duplicate
                                </Badge>
                              )}
                              {getStatusBadge(question.status)}
                              {getSourceBadge(question.source)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-white/60 flex-wrap">
                              <span>{question.type.replace("_", " ").toUpperCase()}</span>
                              <span>•</span>
                              <span>{question.topicName}</span>
                              {question.difficulty && (
                                <>
                                  <span>•</span>
                                  <span className="capitalize">{question.difficulty}</span>
                                </>
                              )}
                              {question.year && (
                                <>
                                  <span>•</span>
                                  <span>Year: {question.year}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <Button
                            onClick={async () => {
                              try {
                                await deleteQuestion({ id: question._id });
                                toast.success("Question deleted");
                              } catch {
                                toast.error("Failed to delete");
                              }
                            }}
                            variant="ghost"
                            size="icon"
                            className={`${
                              isDuplicate 
                                ? 'text-red-200 hover:bg-red-500/30' 
                                : 'text-red-300 hover:bg-red-500/20'
                            }`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {question.options && question.options.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-white/80">Options:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {question.options.map((option, idx) => (
                                <div
                                  key={idx}
                                  className={`p-2 rounded-lg border ${
                                    option === question.correctAnswer
                                      ? "bg-green-500/10 border-green-500/30 text-green-300"
                                      : "bg-white/5 border-white/10 text-white/80"
                                  }`}
                                >
                                  {option}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-white/80">Correct Answer:</p>
                          <p className="text-white mt-1">{question.correctAnswer}</p>
                        </div>
                        {question.explanation && (
                          <div>
                            <p className="text-sm font-medium text-white/80">Explanation:</p>
                            <p className="text-white/60 mt-1">{question.explanation}</p>
                          </div>
                        )}
                        {question.status === "pending" && (
                          <div className="flex gap-2 pt-4">
                            <Button
                              onClick={() => handleReview(question._id, "approved")}
                              className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleReview(question._id, "rejected")}
                              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}