import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate } from "react-router";
import { useState } from "react";
import { Loader2, CheckCircle, XCircle, Plus, Upload, FileText, Trash2, Sparkles, AlertTriangle, CheckCircle2, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  const [showAIBulkForm, setShowAIBulkForm] = useState(false);
  const [showMockTestCreator, setShowMockTestCreator] = useState(false);
  const [showAITestCreator, setShowAITestCreator] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [deleteSourceType, setDeleteSourceType] = useState<"manual" | "ai" | "pyq">("manual");
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);
  const [pyqYear, setPyqYear] = useState<number>(new Date().getFullYear());
  const [pyqExamName, setPyqExamName] = useState<string>("");
  const [showErrorQuestions, setShowErrorQuestions] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  
  // Mock test creator state
  const [mockTestName, setMockTestName] = useState("");
  const [mockTestTopicId, setMockTestTopicId] = useState("");
  const [mockTestNewTopicName, setMockTestNewTopicName] = useState("");
  const [mockTestQuestions, setMockTestQuestions] = useState("");
  const [creatingMockTest, setCreatingMockTest] = useState(false);
  
  // AI test creator state
  const [aiTestQuestions, setAiTestQuestions] = useState("");
  const [creatingAITest, setCreatingAITest] = useState(false);
  
  // AI bulk questions state - 100 separate sections
  const [aiBulkQuestions, setAiBulkQuestions] = useState<string[]>(Array(100).fill(""));
  
  // PYQ bulk questions state - 100 separate sections
  const [pyqBulkQuestions, setPyqBulkQuestions] = useState<string[]>(Array(100).fill(""));
  
  // State for Bulk Add & Create PYQ Test
  const [showBulkPYQDialog, setShowBulkPYQDialog] = useState(false);
  const [bulkPYQText, setBulkPYQText] = useState("");
  const [bulkPYQExamName, setBulkPYQExamName] = useState("");
  const [bulkPYQYear, setBulkPYQYear] = useState("");
  const [parsedPYQQuestions, setParsedPYQQuestions] = useState<any[]>([]);
  const [isCreatingPYQTest, setIsCreatingPYQTest] = useState(false);
  const [isDeletingQuestion, setIsDeletingQuestion] = useState<Id<"questions"> | null>(null);

  const questions = useQuery(api.questions.getQuestions, {});
  const topics = useQuery(api.topics.getAllTopics);
  const reviewQuestion = useMutation(api.questions.reviewQuestion);
  const createQuestion = useMutation(api.questions.createQuestion);
  const deleteQuestion = useMutation(api.questions.deleteQuestion);
  const batchCreateQuestions = useMutation(api.questions.batchCreateQuestions);
  const generateUploadUrl = useMutation(api.content.generateUploadUrl);
  const batchCreateQuestionsAction = useAction(api.aiQuestions.batchCreateQuestions);
  const createMockTestWithQuestions = useMutation(api.questions.createMockTestWithQuestions);
  const createAITestWithQuestions = useMutation(api.questions.createAITestWithQuestions);
  const createPYQTestMutation = useMutation(api.questions.createPYQTestWithQuestions);
  const deleteAllQuestionsBySource = useMutation(api.questions.deleteAllQuestionsBySource);
  const autoCreateSets = useMutation(api.questions.autoCreateTestSets);
  const [isAutoCreating, setIsAutoCreating] = useState(false);
  const [showAutoCreateDialog, setShowAutoCreateDialog] = useState(false);
  const [autoCreateSource, setAutoCreateSource] = useState<"manual" | "ai" | "pyq">("manual");
  const autoGenerateMistralQuestions = useAction(api.aiQuestions.autoGenerateMistralQuestions);

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

  const handleCreateAITest = async () => {
    try {
      setCreatingAITest(true);
      
      if (!aiTestQuestions.trim()) {
        toast.error("Please paste AI questions");
        setCreatingAITest(false);
        return;
      }

      // Parse questions
      const questionBlocks = aiTestQuestions.split(/\n\s*\n/).filter(block => block.trim());
      
      if (questionBlocks.length === 0) {
        toast.error("No questions found. Please paste questions in the correct format.");
        setCreatingAITest(false);
        return;
      }

      if (questionBlocks.length > 100) {
        toast.error("Cannot add more than 100 questions at once");
        setCreatingAITest(false);
        return;
      }

      toast.info(`Parsing ${questionBlocks.length} AI questions...`);

      const parsedQuestions = [];
      const errors = [];

      for (let index = 0; index < questionBlocks.length; index++) {
        const block = questionBlocks[index];
        try {
          const lines = block.split('\n').map(line => line.trim()).filter(line => line);
          const question: any = {
            type: "mcq",
            difficulty: "medium",
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
            throw new Error(`Missing question text`);
          }
          if (!question.correctAnswer || question.correctAnswer.trim() === '') {
            throw new Error(`Missing correct answer`);
          }
          if (!question.subject) {
            question.subject = "General";
          }
          if (question.type === 'mcq' && (!question.options || question.options.length < 2)) {
            throw new Error(`MCQ must have at least 2 options`);
          }
          
          parsedQuestions.push(question);
        } catch (error) {
          const errorMsg = `Question ${index + 1}: ${error instanceof Error ? error.message : 'Invalid format'}`;
          errors.push(errorMsg);
        }
      }

      if (parsedQuestions.length === 0) {
        toast.error("No valid questions found. Please check your format.");
        if (errors.length > 0) {
          toast.error(`First error: ${errors[0]}`);
        }
        setCreatingAITest(false);
        return;
      }

      toast.info(`Creating AI test with ${parsedQuestions.length} questions...`);

      // Auto-generate test set name based on timestamp
      const autoTestName = `AI Test ${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')} ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;

      // Create AI test with auto-generated name and default topic
      const result = await createAITestWithQuestions({
        testSetName: autoTestName,
        topicId: undefined,
        newTopicName: "General AI Questions",
        questions: parsedQuestions,
      });

      if (errors.length > 0) {
        toast.warning(`AI test created with ${result.questionCount} questions. ${errors.length} questions had parsing errors.`);
      } else {
        toast.success(`AI test created successfully with ${result.questionCount} questions!`);
      }

      // Reset form
      setShowAITestCreator(false);
      setAiTestQuestions("");
      setCreatingAITest(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create AI test. Please try again.");
      console.error("AI test creation error:", error);
      setCreatingAITest(false);
    }
  };

  const handleCreateMockTest = async () => {
    try {
      setCreatingMockTest(true);
      
      if (!mockTestQuestions.trim()) {
        toast.error("Please paste questions");
        setCreatingMockTest(false);
        return;
      }

      // Parse questions
      const questionBlocks = mockTestQuestions.split(/\n\s*\n/).filter(block => block.trim());
      
      if (questionBlocks.length === 0) {
        toast.error("No questions found. Please paste questions in the correct format.");
        setCreatingMockTest(false);
        return;
      }

      if (questionBlocks.length > 100) {
        toast.error("Cannot add more than 100 questions at once");
        setCreatingMockTest(false);
        return;
      }

      toast.info(`Parsing ${questionBlocks.length} questions...`);

      const parsedQuestions = [];
      const errors = [];

      for (let index = 0; index < questionBlocks.length; index++) {
        const block = questionBlocks[index];
        try {
          const lines = block.split('\n').map(line => line.trim()).filter(line => line);
          const question: any = {
            type: "mcq",
            difficulty: "medium",
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
            throw new Error(`Missing question text`);
          }
          if (!question.correctAnswer || question.correctAnswer.trim() === '') {
            throw new Error(`Missing correct answer`);
          }
          if (!question.subject) {
            question.subject = "General";
          }
          if (question.type === 'mcq' && (!question.options || question.options.length < 2)) {
            throw new Error(`MCQ must have at least 2 options`);
          }
          
          parsedQuestions.push(question);
        } catch (error) {
          const errorMsg = `Question ${index + 1}: ${error instanceof Error ? error.message : 'Invalid format'}`;
          errors.push(errorMsg);
        }
      }

      if (parsedQuestions.length === 0) {
        toast.error("No valid questions found. Please check your format.");
        if (errors.length > 0) {
          toast.error(`First error: ${errors[0]}`);
        }
        setCreatingMockTest(false);
        return;
      }

      toast.info(`Creating mock test with ${parsedQuestions.length} questions...`);

      // Auto-generate test set name based on timestamp
      const autoTestName = `Mock Test ${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')} ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;

      // Create mock test with auto-generated name and default topic
      const result = await createMockTestWithQuestions({
        testSetName: autoTestName,
        topicId: undefined,
        newTopicName: "General Mock Tests",
        questions: parsedQuestions,
      });

      if (errors.length > 0) {
        toast.warning(`Mock test created with ${result.questionCount} questions. ${errors.length} questions had parsing errors.`);
      } else {
        toast.success(`Mock test created successfully with ${result.questionCount} questions!`);
      }

      // Reset form
      setShowMockTestCreator(false);
      setMockTestQuestions("");
      setCreatingMockTest(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create mock test. Please try again.");
      console.error("Mock test creation error:", error);
      setCreatingMockTest(false);
    }
  };

  const handleBulkManualSubmit = async () => {
    try {
      setSavingQuestions(true);
      
      // Filter out empty question blocks
      const questionBlocks = bulkQuestions.filter(block => block.trim());
      
      if (questionBlocks.length === 0) {
        toast.error("No questions found. Please paste questions in the correct format.");
        setSavingQuestions(false);
        return;
      }
      
      console.log(`Processing ${questionBlocks.length} question blocks...`);
      toast.info(`Processing ${questionBlocks.length} questions... This may take a moment.`);
      
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
        setSavingQuestions(false);
        return;
      }
      
      console.log(`Attempting to save ${parsedQuestions.length} questions to database...`);
      toast.info(`Saving ${parsedQuestions.length} questions... Please wait.`);
      
      const result = await batchCreateQuestionsAction({ questions: parsedQuestions });
      const successCount = result.filter(r => r !== null).length;
      
      console.log(`Database save result: ${successCount}/${parsedQuestions.length} questions saved`);
      
      if (errors.length > 0) {
        toast.warning(`${successCount} questions added successfully. ${errors.length} questions had parsing errors.`);
        console.error("Parsing errors:", errors);
      } else if (successCount < parsedQuestions.length) {
        toast.warning(`${successCount} questions added successfully. ${parsedQuestions.length - successCount} questions failed to save.`);
      } else {
        toast.success(`All ${successCount} questions added successfully!`);
      }
      
      setShowBulkManualForm(false);
      setBulkQuestions(Array(100).fill(""));
      setSavingQuestions(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add questions. Please try again.");
      console.error("Bulk add error:", error);
      setSavingQuestions(false);
    }
  };

  const handleAIBulkSubmit = async () => {
    try {
      setSavingQuestions(true);
      
      // Filter out empty question blocks
      const questionBlocks = aiBulkQuestions.filter(block => block.trim());
      
      if (questionBlocks.length === 0) {
        toast.error("No questions found. Please paste questions in the correct format.");
        setSavingQuestions(false);
        return;
      }
      
      if (questionBlocks.length > 100) {
        toast.error("Cannot add more than 100 questions at once");
        setSavingQuestions(false);
        return;
      }
      
      console.log(`Processing ${questionBlocks.length} AI question blocks...`);
      toast.info(`Processing ${questionBlocks.length} AI questions... This may take a moment.`);
      
      const parsedQuestions = [];
      const errors = [];
      
      for (let index = 0; index < questionBlocks.length; index++) {
        const block = questionBlocks[index];
        try {
          const lines = block.split('\n').map(line => line.trim()).filter(line => line);
          const question: any = {
            type: "mcq",
            difficulty: "medium",
            source: "ai"
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
          console.log(`Successfully parsed AI question ${index + 1}:`, question.question.substring(0, 50) + '...');
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
        setSavingQuestions(false);
        return;
      }
      
      console.log(`Attempting to save ${parsedQuestions.length} AI questions to database...`);
      toast.info(`Saving ${parsedQuestions.length} AI questions... Please wait.`);
      
      const result = await batchCreateQuestionsAction({ questions: parsedQuestions });
      const successCount = result.filter(r => r !== null).length;
      
      console.log(`Database save result: ${successCount}/${parsedQuestions.length} AI questions saved`);
      
      if (errors.length > 0) {
        toast.warning(`${successCount} AI questions added successfully. ${errors.length} questions had parsing errors.`);
        console.error("Parsing errors:", errors);
      } else if (successCount < parsedQuestions.length) {
        toast.warning(`${successCount} AI questions added successfully. ${parsedQuestions.length - successCount} questions failed to save.`);
      } else {
        toast.success(`All ${successCount} AI questions added successfully!`);
      }
      
      setShowAIBulkForm(false);
      setAiBulkQuestions(Array(100).fill(""));
      setSavingQuestions(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add AI questions. Please try again.");
      console.error("AI bulk add error:", error);
      setSavingQuestions(false);
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

  // Handle Bulk PYQ Test Creation
  const handleCreatePYQTest = async () => {
    if (!bulkPYQExamName.trim()) {
      toast.error("Please enter an exam name");
      return;
    }

    const yearNum = parseInt(bulkPYQYear);
    if (!yearNum || yearNum < 1900 || yearNum > 2100) {
      toast.error("Please enter a valid exam year (e.g., 2024)");
      return;
    }

    if (parsedPYQQuestions.length === 0) {
      toast.error("Please paste questions first");
      return;
    }

    setIsCreatingPYQTest(true);
    try {
      const result = await createPYQTestMutation({
        examName: bulkPYQExamName.trim(),
        year: yearNum,
        questions: parsedPYQQuestions,
      });

      toast.success(
        `PYQ Test created successfully! ${result.totalQuestions} questions added for ${result.examName} ${result.year} (${result.numberOfSets} sets created)`
      );

      // Reset form
      setBulkPYQText("");
      setBulkPYQExamName("");
      setBulkPYQYear("");
      setParsedPYQQuestions([]);
      setShowBulkPYQDialog(false);
    } catch (error: any) {
      console.error("Error creating PYQ test:", error);
      toast.error(error.message || "Failed to create PYQ test");
    } finally {
      setIsCreatingPYQTest(false);
    }
  };

  const handleBulkDelete = async () => {
    try {
      setIsDeletingBulk(true);
      
      const result = await deleteAllQuestionsBySource({ source: deleteSourceType });
      
      if (result.success) {
        toast.success(`Successfully deleted ${result.deletedCount} ${deleteSourceType === 'manual' ? 'Mock/Manual' : deleteSourceType.toUpperCase()} questions!`);
        setShowBulkDeleteDialog(false);
      } else {
        toast.error("Failed to delete questions");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete questions");
      console.error("Bulk delete error:", error);
    } finally {
      setIsDeletingBulk(false);
    }
  };

  const handleDeleteQuestion = async (id: Id<"questions">) => {
    try {
      setIsDeletingQuestion(id);
      
      await deleteQuestion({ id });
      
      toast.success("Question deleted successfully!");
      setIsDeletingQuestion(null);
    } catch (error) {
      toast.error("Failed to delete question");
      setIsDeletingQuestion(null);
    }
  };

  const handleAutoCreateSets = async () => {
    setIsAutoCreating(true);
    try {
      const result = await autoCreateSets({
        source: autoCreateSource,
      });

      if (result.success) {
        toast.success(result.message);
        setShowAutoCreateDialog(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error auto-creating test sets:", error);
      toast.error("Failed to create test sets");
    } finally {
      setIsAutoCreating(false);
    }
  };

  const handleAutoGenerateAI = async () => {
    if (isGeneratingAI) return;
    
    setIsGeneratingAI(true);
    try {
      const result = await autoGenerateMistralQuestions({});
      
      if (result.success) {
        toast.success(`✅ ${result.saved} AI Questions Generated & Saved Successfully!`);
      } else {
        toast.error(`Failed to generate questions: ${result.message}`);
      }
    } catch (error: any) {
      console.error("Error generating AI questions:", error);
      toast.error(`Error: ${error.message || "Failed to generate AI questions"}`);
    } finally {
      setIsGeneratingAI(false);
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

  const getErrorQuestions = () => {
    if (!questions) return [];
    
    return questions.filter(question => {
      // Check if question is MCQ type
      if (question.type === 'mcq') {
        // Check if correctAnswer exists and is not empty
        if (!question.correctAnswer || question.correctAnswer.trim() === '') {
          return true;
        }
        
        // Check if options exist
        if (!question.options || question.options.length === 0) {
          return true;
        }
        
        // Check if correctAnswer matches any option (case-insensitive, trimmed)
        const normalizedCorrectAnswer = question.correctAnswer.trim().toLowerCase();
        const matchFound = question.options.some(option => 
          option.trim().toLowerCase() === normalizedCorrectAnswer
        );
        
        // If no match found, it's an error question
        if (!matchFound) {
          return true;
        }
      }
      
      return false;
    });
  };

  const errorQuestions = getErrorQuestions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 relative overflow-hidden">
      {/* Background elements */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1582719471384?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      
      {/* Animated orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl" />

      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Question Management</h1>
              <p className="text-white/80">Manage and organize test questions</p>
            </div>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="bg-white/10 backdrop-blur-md border border-white/20">
              <TabsTrigger value="all">All Questions</TabsTrigger>
              <TabsTrigger value="add">Add Question</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
              <TabsTrigger value="errors">Error Questions</TabsTrigger>
            </TabsList>

            {/* All Questions Tab */}
            <TabsContent value="all">
              <div className="space-y-6">
                <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Question Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
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
                  </CardContent>
                </Card>

                <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">AI Question Generation</CardTitle>
                    <CardDescription className="text-white/80">
                      Automatically generate 100 high-quality MLT MCQs using Mistral AI
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={handleAutoGenerateAI}
                      disabled={isGeneratingAI}
                      className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      {isGeneratingAI ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating 100 Questions...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Auto Generate 100 AI Questions
                        </>
                      )}
                    </Button>
                    <p className="text-sm text-white/70 mt-2">
                      This will generate 100 unique MLT exam questions covering Hematology, Biochemistry, Microbiology, and more.
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Error Questions</CardTitle>
                    <CardDescription className="text-white/80">
                      Questions with missing or mismatched answers that need to be fixed or deleted
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6 text-red-400" />
                        <h3 className="text-white">Error Questions</h3>
                      </div>
                      <Button
                        onClick={() => setShowErrorQuestions(!showErrorQuestions)}
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        {showErrorQuestions ? 'Hide' : 'Show'} ({errorQuestions.length})
                      </Button>
                    </div>
                    
                    {showErrorQuestions && (
                      <div className="space-y-4">
                        {errorQuestions.length === 0 ? (
                          <div className="text-center py-8">
                            <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-3" />
                            <p className="text-white/80">No error questions found! All questions are properly formatted.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {errorQuestions.map((question) => (
                              <div
                                key={question._id}
                                className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-lg p-4"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge variant="destructive">Error</Badge>
                                      <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                                        {question.type.toUpperCase()}
                                      </Badge>
                                      <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                                        {question.source || 'manual'}
                                      </Badge>
                                    </div>
                                    
                                    <p className="text-white font-medium mb-3">{question.question}</p>
                                    
                                    {question.options && question.options.length > 0 && (
                                      <div className="mb-3">
                                        <p className="text-sm font-medium text-white/80 mb-1">Options:</p>
                                        <div className="grid grid-cols-2 gap-2">
                                          {question.options.map((option, idx) => (
                                            <div key={idx} className="bg-white/5 rounded px-3 py-2 text-sm text-white/90">
                                              {option}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    <div className="bg-red-500/20 rounded px-3 py-2 mb-2">
                                      <p className="text-sm font-medium text-red-300">
                                        Correct Answer: {question.correctAnswer || '(Empty)'}
                                      </p>
                                    </div>
                                    
                                    <div className="text-sm text-yellow-300">
                                      <AlertTriangle className="h-4 w-4 inline mr-1" />
                                      Issue: {!question.correctAnswer || question.correctAnswer.trim() === '' 
                                        ? 'Correct answer is missing or empty'
                                        : !question.options || question.options.length === 0
                                        ? 'Options are missing'
                                        : 'Correct answer does not match any option'}
                                    </div>
                                  </div>
                                  
                                  <Button
                                    onClick={() => handleDeleteQuestion(question._id)}
                                    variant="destructive"
                                    size="sm"
                                    disabled={isDeletingQuestion === question._id}
                                    className="shrink-0"
                                  >
                                    {isDeletingQuestion === question._id ? (
                                      <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Deleting...
                                      </>
                                    ) : (
                                      <>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

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
              </div>
            </TabsContent>

            {/* Add Question Tab */}
            <TabsContent value="add">
              <div className="space-y-6">
                <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Add Single Question</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleManualSubmit} className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30">
                        Save Question
                      </Button>
                      <Button onClick={() => setShowManualForm(false)} variant="outline" className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>

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
              </div>
            </TabsContent>

            {/* Bulk Operations Tab */}
            <TabsContent value="bulk">
              <div className="space-y-6">
                <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Bulk Add Manual Questions (Up to 100)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
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
                  </CardContent>
                </Card>

                <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Bulk Add AI Questions (Up to 100)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white">Paste AI Questions in Plain Text (100 Separate Sections)</Label>
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
                        <Button onClick={handleAIBulkSubmit} className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30">
                          Add All AI Questions
                        </Button>
                        <Button onClick={() => setShowAIBulkForm(false)} variant="outline" className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Add PYQ Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
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
                  </CardContent>
                </Card>

                <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Bulk Add & Create Mock Test</CardTitle>
                    <p className="text-white/60 text-sm">Paste up to 100 questions to automatically create a mock test</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white font-semibold">Paste Questions (Up to 100) *</Label>
                        <p className="text-white/60 text-sm mb-2 mt-1">
                          Format each question like this (separate questions with a blank line):
                        </p>
                        <div className="bg-white/5 border border-white/10 rounded p-3 mb-3 text-xs text-white/70 font-mono">
                          Q: What is EDTA?<br/>
                          A: Anticoagulant<br/>
                          Options: Anticoagulant | Stain | Buffer | Enzyme<br/>
                          Subject: Hematology<br/>
                          Difficulty: Easy<br/>
                          Type: MCQ<br/>
                          Explanation: EDTA is used to prevent blood clotting
                        </div>
                        <Textarea
                          value={mockTestQuestions}
                          onChange={(e) => setMockTestQuestions(e.target.value)}
                          className="bg-white/5 border-white/10 text-white font-mono text-sm"
                          rows={15}
                          placeholder="Paste your questions here..."
                        />
                        <p className="text-white/60 text-xs mt-2">
                          {mockTestQuestions.split(/\n\s*\n/).filter(b => b.trim()).length} questions detected
                        </p>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button 
                          onClick={handleCreateMockTest} 
                          disabled={creatingMockTest}
                          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0"
                        >
                          {creatingMockTest ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Creating Mock Test...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Create Mock Test
                            </>
                          )}
                        </Button>
                        <Button 
                          onClick={() => {
                            setMockTestQuestions("");
                          }}
                          variant="outline" 
                          className="flex-1"
                          disabled={creatingMockTest}
                        >
                          Clear Form
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Bulk Add & Create AI Test</CardTitle>
                    <p className="text-white/60 text-sm">Paste up to 100 AI questions to automatically create an AI test</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white font-semibold">Paste AI Questions (Up to 100) *</Label>
                        <p className="text-white/60 text-sm mb-2 mt-1">
                          Format each question like this (separate questions with a blank line):
                        </p>
                        <div className="bg-white/5 border border-white/10 rounded p-3 mb-3 text-xs text-white/70 font-mono">
                          Q: What is EDTA?<br/>
                          A: Anticoagulant<br/>
                          Options: Anticoagulant | Stain | Buffer | Enzyme<br/>
                          Subject: Hematology<br/>
                          Difficulty: Easy<br/>
                          Type: MCQ<br/>
                          Explanation: EDTA is used to prevent blood clotting
                        </div>
                        <Textarea
                          value={aiTestQuestions}
                          onChange={(e) => setAiTestQuestions(e.target.value)}
                          className="bg-white/5 border-white/10 text-white font-mono text-sm"
                          rows={15}
                          placeholder="Paste your AI questions here..."
                        />
                        <p className="text-white/60 text-xs mt-2">
                          {aiTestQuestions.split(/\n\s*\n/).filter(b => b.trim()).length} questions detected
                        </p>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button 
                          onClick={handleCreateAITest} 
                          disabled={creatingAITest}
                          className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0"
                        >
                          {creatingAITest ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Creating AI Test...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Create AI Test
                            </>
                          )}
                        </Button>
                        <Button 
                          onClick={() => {
                            setAiTestQuestions("");
                          }}
                          variant="outline" 
                          className="flex-1"
                          disabled={creatingAITest}
                        >
                          Clear Form
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Bulk Add & Create PYQ Test</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-white/90 text-sm font-medium mb-2 block">
                            Exam Name *
                          </label>
                          <Input
                            placeholder="e.g., NEET MLT, AIIMS MLT"
                            value={bulkPYQExamName}
                            onChange={(e) => setBulkPYQExamName(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          />
                        </div>
                        <div>
                          <label className="text-white/90 text-sm font-medium mb-2 block">
                            Exam Year *
                          </label>
                          <Input
                            type="number"
                            placeholder="e.g., 2024"
                            value={bulkPYQYear}
                            onChange={(e) => setBulkPYQYear(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            min="1900"
                            max="2100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-white/90 text-sm font-medium mb-2 block">
                          Paste Questions *
                        </label>
                        <Textarea
                          placeholder={`Format each question as:
Q: Question text here?
A) Option 1
B) Option 2
C) Option 3
D) Option 4
Correct: A
Explanation: Explanation text here

(Leave a blank line between questions)`}
                          value={bulkPYQText}
                          onChange={(e) => {
                            setBulkPYQText(e.target.value);
                            const text = e.target.value.trim();
                            if (!text) {
                              setParsedPYQQuestions([]);
                              return;
                            }
                            
                            const blocks = text.split(/\n\s*\n/).filter(block => block.trim());
                            const parsed = blocks.map(block => {
                              const lines = block.trim().split('\n');
                              const questionLine = lines[0];
                              const options = lines.slice(1, 5);
                              const correctLine = lines.find(l => l.toLowerCase().startsWith('correct:'));
                              const explanationLine = lines.find(l => l.toLowerCase().startsWith('explanation:'));

                              // Extract option texts
                              const optionTexts = options.map(opt => opt.replace(/^[A-D]\)\s*/, '').trim());
                              
                              // Extract correct answer letter and map to actual option text
                              let correctAnswerText = '';
                              if (correctLine) {
                                const correctLetter = correctLine.replace(/^correct:\s*/i, '').trim().toUpperCase();
                                const letterIndex = correctLetter.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
                                if (letterIndex >= 0 && letterIndex < optionTexts.length) {
                                  correctAnswerText = optionTexts[letterIndex];
                                }
                              }

                              return {
                                type: 'mcq',
                                question: questionLine.replace(/^Q:\s*/, '').replace(/^\d+\.\s*/, '').trim(),
                                options: optionTexts,
                                correctAnswer: correctAnswerText,
                                explanation: explanationLine ? explanationLine.replace(/^explanation:\s*/i, '').trim() : '',
                                difficulty: 'medium',
                                subject: 'General'
                              };
                            });
                            
                            setParsedPYQQuestions(parsed);
                          }}
                          className="min-h-[300px] bg-white/10 border-white/20 text-white placeholder:text-white/50 font-mono text-sm"
                        />
                        <p className="text-white/60 text-sm mt-2">
                          Parsed: {parsedPYQQuestions.length} questions
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={handleCreatePYQTest}
                          disabled={
                            isCreatingPYQTest ||
                            parsedPYQQuestions.length === 0 ||
                            !bulkPYQExamName.trim() ||
                            !bulkPYQYear.trim()
                          }
                          className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                        >
                          {isCreatingPYQTest ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Creating PYQ Test...
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Create PYQ Test ({parsedPYQQuestions.length} questions)
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => {
                            setBulkPYQText("");
                            setBulkPYQExamName("");
                            setBulkPYQYear("");
                            setParsedPYQQuestions([]);
                          }}
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Auto Create Test Sets</CardTitle>
                    <p className="text-white/80">
                      Automatically organize unassigned questions into test sets with shuffled options to prevent answer patterns.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white">Question Source</Label>
                          <Select value={autoCreateSource} onValueChange={(value: any) => setAutoCreateSource(value)}>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="manual">Mock Tests (100 questions/set)</SelectItem>
                              <SelectItem value="pyq">PYQ Tests (20 questions/set)</SelectItem>
                              <SelectItem value="ai">AI Tests (25 questions/set)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3 text-sm">
                          <p className="text-blue-200">
                            ✨ The system will:
                          </p>
                          <ul className="list-disc list-inside text-blue-200/80 mt-2 space-y-1">
                            <li>Shuffle options for each question</li>
                            <li>Prevent consecutive same-position answers</li>
                            <li>Create complete sets automatically</li>
                          </ul>
                        </div>
                      </div>

                      <Button
                        onClick={handleAutoCreateSets}
                        disabled={isAutoCreating}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      >
                        {isAutoCreating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Sets...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Create Test Sets
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Bulk Delete Questions</CardTitle>
                    <p className="text-white/80">
                      ⚠️ Warning: This action cannot be undone!
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white font-semibold mb-2 block">Select Question Type to Delete</Label>
                        <Select value={deleteSourceType} onValueChange={(v: "manual" | "ai" | "pyq") => setDeleteSourceType(v)}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manual">
                              Mock/Manual Questions ({questions?.filter(q => q.source === "manual" || !q.source).length || 0})
                            </SelectItem>
                            <SelectItem value="ai">
                              AI Questions ({questions?.filter(q => q.source === "ai").length || 0})
                            </SelectItem>
                            <SelectItem value="pyq">
                              PYQ Questions ({questions?.filter(q => q.source === "pyq").length || 0})
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <p className="text-red-300 text-sm">
                          You are about to delete <strong>{questions?.filter(q => 
                            deleteSourceType === "manual" ? (q.source === "manual" || !q.source) : q.source === deleteSourceType
                          ).length || 0}</strong> questions.
                        </p>
                        <p className="text-red-200 text-xs mt-2">
                          This will permanently remove all {deleteSourceType === 'manual' ? 'Mock/Manual' : deleteSourceType.toUpperCase()} questions from the database.
                        </p>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button 
                          onClick={handleBulkDelete}
                          disabled={isDeletingBulk}
                          className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30"
                        >
                          {isDeletingBulk ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Confirm Delete
                            </>
                          )}
                        </Button>
                        <Button 
                          onClick={() => setShowBulkDeleteDialog(false)}
                          variant="outline" 
                          className="flex-1"
                          disabled={isDeletingBulk}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Error Questions Tab */}
            <TabsContent value="errors">
              <div className="space-y-6">
                <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Error Questions</CardTitle>
                    <CardDescription className="text-white/80">
                      Questions with missing or mismatched answers that need to be fixed or deleted
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6 text-red-400" />
                        <h3 className="text-white">Error Questions</h3>
                      </div>
                      <Button
                        onClick={() => setShowErrorQuestions(!showErrorQuestions)}
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        {showErrorQuestions ? 'Hide' : 'Show'} ({errorQuestions.length})
                      </Button>
                    </div>
                    
                    {showErrorQuestions && (
                      <div className="space-y-4">
                        {errorQuestions.length === 0 ? (
                          <div className="text-center py-8">
                            <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-3" />
                            <p className="text-white/80">No error questions found! All questions are properly formatted.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {errorQuestions.map((question) => (
                              <div
                                key={question._id}
                                className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-lg p-4"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge variant="destructive">Error</Badge>
                                      <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                                        {question.type.toUpperCase()}
                                      </Badge>
                                      <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                                        {question.source || 'manual'}
                                      </Badge>
                                    </div>
                                    
                                    <p className="text-white font-medium mb-3">{question.question}</p>
                                    
                                    {question.options && question.options.length > 0 && (
                                      <div className="mb-3">
                                        <p className="text-sm font-medium text-white/80 mb-1">Options:</p>
                                        <div className="grid grid-cols-2 gap-2">
                                          {question.options.map((option, idx) => (
                                            <div key={idx} className="bg-white/5 rounded px-3 py-2 text-sm text-white/90">
                                              {option}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    <div className="bg-red-500/20 rounded px-3 py-2 mb-2">
                                      <p className="text-sm font-medium text-red-300">
                                        Correct Answer: {question.correctAnswer || '(Empty)'}
                                      </p>
                                    </div>
                                    
                                    <div className="text-sm text-yellow-300">
                                      <AlertTriangle className="h-4 w-4 inline mr-1" />
                                      Issue: {!question.correctAnswer || question.correctAnswer.trim() === '' 
                                        ? 'Correct answer is missing or empty'
                                        : !question.options || question.options.length === 0
                                        ? 'Options are missing'
                                        : 'Correct answer does not match any option'}
                                    </div>
                                  </div>
                                  
                                  <Button
                                    onClick={() => handleDeleteQuestion(question._id)}
                                    variant="destructive"
                                    size="sm"
                                    disabled={isDeletingQuestion === question._id}
                                    className="shrink-0"
                                  >
                                    {isDeletingQuestion === question._id ? (
                                      <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Deleting...
                                      </>
                                    ) : (
                                      <>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Auto Create Test Sets Dialog */}
      <Dialog open={showAutoCreateDialog} onOpenChange={setShowAutoCreateDialog}>
        <DialogContent className="bg-gradient-to-br from-purple-900/95 to-blue-900/95 border-purple-500/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Auto Create Test Sets
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-white/80 text-sm">
              Automatically organize unassigned questions into test sets with shuffled options to prevent answer patterns.
            </p>
            
            <div className="space-y-2">
              <Label className="text-white">Question Source</Label>
              <Select value={autoCreateSource} onValueChange={(value: any) => setAutoCreateSource(value)}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Mock Tests (100 questions/set)</SelectItem>
                  <SelectItem value="pyq">PYQ Tests (20 questions/set)</SelectItem>
                  <SelectItem value="ai">AI Tests (25 questions/set)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3 text-sm">
              <p className="text-blue-200">
                ✨ The system will:
              </p>
              <ul className="list-disc list-inside text-blue-200/80 mt-2 space-y-1">
                <li>Shuffle options for each question</li>
                <li>Prevent consecutive same-position answers</li>
                <li>Create complete sets automatically</li>
              </ul>
            </div>

            <Button
              onClick={handleAutoCreateSets}
              disabled={isAutoCreating}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              {isAutoCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Sets...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create Test Sets
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}