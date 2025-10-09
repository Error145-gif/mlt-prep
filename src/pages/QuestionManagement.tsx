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
  const [pyqYear, setPyqYear] = useState<number>(new Date().getFullYear());
  const [pyqExamName, setPyqExamName] = useState<string>("");
  
  // AI bulk questions state - 100 separate sections
  const [aiBulkQuestions, setAiBulkQuestions] = useState<string[]>(Array(100).fill(""));
  
  // PYQ bulk questions state - 100 separate sections
  const [pyqBulkQuestions, setPyqBulkQuestions] = useState<string[]>(Array(100).fill(""));
  
  const questions = useQuery(api.questions.getQuestions, {});
  const topics = useQuery(api.topics.getAllTopics);
  const reviewQuestion = useMutation(api.questions.reviewQuestion);
  const createQuestion = useMutation(api.questions.createQuestion);
  const deleteQuestion = useMutation(api.questions.deleteQuestion);
  const batchCreateQuestions = useMutation(api.questions.batchCreateQuestions);
  const generateUploadUrl = useMutation(api.content.generateUploadUrl);
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

  // Bulk manual entry state - 100 separate sections
  const [bulkQuestions, setBulkQuestions] = useState<string[]>(Array(100).fill(""));

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
      setBulkQuestions(Array(100).fill(""));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add questions. Please try again.");
      console.error("Bulk add error:", error);
    }
  };

  const handlePYQManualSubmit = async () => {
    try {
      // Validate exam name and year first
      if (!pyqExamName || !pyqExamName.trim()) {
        toast.error("Please enter an exam name");
        return;
      }
      
      if (!pyqYear || pyqYear < 2000 || pyqYear > new Date().getFullYear()) {
        toast.error("Please enter a valid year");
        return;
      }
      
      // Parse PYQ questions from plain text format
      const questionBlocks = pyqBulkQuestions.filter(block => block.trim());
      
      if (questionBlocks.length === 0) {
        toast.error("No questions found. Please paste questions in the correct format.");
        return;
      }
      
      if (questionBlocks.length > 100) {
        toast.error("Cannot add more than 100 questions at once");
        return;
      }
      
      console.log(`Processing ${questionBlocks.length} PYQ questions for ${pyqExamName} (${pyqYear})...`);
      
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
        if (!question.question || question.question.trim() === '') {
          throw new Error(`Question ${index + 1} is missing question text`);
        }
        if (!question.correctAnswer || question.correctAnswer.trim() === '') {
          throw new Error(`Question ${index + 1} is missing correct answer`);
        }
        if (!question.subject) {
          question.subject = "General";
        }
        
        // Validate MCQ has options
        if (question.type === 'mcq' && (!question.options || question.options.length < 2)) {
          throw new Error(`Question ${index + 1}: MCQ must have at least 2 options`);
        }
        
        console.log(`Successfully parsed PYQ question ${index + 1}:`, question.question.substring(0, 50) + '...');
        
        return question;
      });
      
      console.log(`Attempting to save ${parsedQuestions.length} PYQ questions to database...`);
      const result = await batchCreateQuestions({ questions: parsedQuestions });
      console.log(`Database save result:`, result);
      
      toast.success(`${parsedQuestions.length} PYQ questions added successfully for ${pyqExamName} (${pyqYear})!`);
      setShowPYQManualForm(false);
      setPyqBulkQuestions(Array(100).fill(""));
      setPyqExamName("");
      setPyqYear(new Date().getFullYear());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to parse PYQ questions. Please check your format.");
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
    <div className="min-h-screen p-6 relative">
      {/* Fixed animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 -z-10" />
      
      {/* Animated orbs */}
      <div className="fixed top-20 left-20 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl animate-pulse -z-10" />
      <div className="fixed top-40 right-20 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDelay: '1s' }} />
      <div className="fixed bottom-20 left-1/3 w-[600px] h-[600px] bg-pink-400/40 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDelay: '0.5s' }} />
      <div className="fixed bottom-40 right-1/4 w-[400px] h-[400px] bg-cyan-400/40 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDelay: '0.7s' }} />
      
      {/* Lab background image */}
      <div 
        className="fixed inset-0 -z-10 opacity-10"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

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
                  Bulk Add (Up to 100)
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/20 backdrop-blur-xl bg-white/10 max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-white">Bulk Add Questions (Up to 100)</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  <div>
                    <Label className="text-white">Paste Questions in Plain Text (100 Separate Sections)</Label>
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

            <Dialog open={showPYQManualForm} onOpenChange={setShowPYQManualForm}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30">
                  <FileText className="h-4 w-4 mr-2" />
                  Add PYQ Questions
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/20 backdrop-blur-xl bg-white/10 max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-white">Add PYQ Questions (Up to 100)</DialogTitle>
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
                      <Label className="text-white">Paste PYQ Questions in Plain Text (100 Separate Sections)</Label>
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
                    
                  {pyqBulkQuestions.map((question, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-white font-semibold">PYQ Question {index + 1}</Label>
                        {question.trim() && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newQuestions = [...pyqBulkQuestions];
                              newQuestions[index] = "";
                              setPyqBulkQuestions(newQuestions);
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
                          const newQuestions = [...pyqBulkQuestions];
                          newQuestions[index] = e.target.value;
                          setPyqBulkQuestions(newQuestions);
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
          </div>
        </div>

        {/* Question Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{questions?.length || 0}</p>
                <p className="text-sm text-white/60">Total Questions</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-blue-500/20 backdrop-blur-xl bg-blue-500/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-300">{questions?.filter(q => q.source === "manual" || !q.source).length || 0}</p>
                <p className="text-sm text-blue-200">Manual/Mock</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-purple-500/20 backdrop-blur-xl bg-purple-500/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-300">{questions?.filter(q => q.source === "ai").length || 0}</p>
                <p className="text-sm text-purple-200">AI Questions</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-orange-500/20 backdrop-blur-xl bg-orange-500/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-300">{questions?.filter(q => q.source === "pyq").length || 0}</p>
                <p className="text-sm text-orange-200">PYQ</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-red-500/20 backdrop-blur-xl bg-red-500/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-300">{duplicateQuestions.size}</p>
                <p className="text-sm text-red-200">Duplicates</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="glass-card border-white/20 backdrop-blur-xl bg-white/10 flex-wrap">
            <TabsTrigger value="all" className="data-[state=active]:bg-white/20">
              All Questions
            </TabsTrigger>
            <TabsTrigger value="manual" className="data-[state=active]:bg-white/20">
              <FileText className="h-4 w-4 mr-2" />
              Manual/Mock
            </TabsTrigger>
            <TabsTrigger value="ai" className="data-[state=active]:bg-white/20">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Questions
            </TabsTrigger>
            <TabsTrigger value="pyq" className="data-[state=active]:bg-white/20">
              <Upload className="h-4 w-4 mr-2" />
              PYQ
            </TabsTrigger>
            <TabsTrigger value="duplicates" className="data-[state=active]:bg-white/20">
              <XCircle className="h-4 w-4 mr-2" />
              Duplicates Only
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
              questions
                .filter((q) => {
                  // Filter by active tab
                  if (activeTab === "manual") return q.source === "manual" || !q.source;
                  if (activeTab === "ai") return q.source === "ai";
                  if (activeTab === "pyq") return q.source === "pyq";
                  if (activeTab === "duplicates") return duplicateQuestions.has(q._id);
                  if (activeTab === "approved") return q.status === "approved";
                  return true; // "all" tab shows everything
                })
                .map((question, index) => {
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