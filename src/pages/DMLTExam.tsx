// @ts-nocheck
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router";
import { Home, BookOpen, FileText, ArrowRight, Brain, Award } from "lucide-react";

export default function DMLTExam() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl" />
      </div>

      {/* Lab Background Image */}
      <div 
        className="fixed inset-0 opacity-15"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&q=80&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-3"
        >
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white hover:bg-white/20"
          >
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
          <Button
            onClick={() => navigate("/tests/mock")}
            variant="outline"
            className="glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white hover:bg-white/20"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Mock Tests
          </Button>
          <Button
            onClick={() => navigate("/tests/pyq")}
            variant="outline"
            className="glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white hover:bg-white/20"
          >
            <FileText className="h-4 w-4 mr-2" />
            PYQ Sets
          </Button>
          <Button
            onClick={() => navigate("/tests/ai")}
            variant="outline"
            className="glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white hover:bg-white/20"
          >
            <Brain className="h-4 w-4 mr-2" />
            AI Questions
          </Button>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <CardContent className="p-8 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                DMLT Exam Preparation Online
              </h1>
              
              <p className="text-lg text-white/90">
                Complete DMLT (Diploma in Medical Lab Technology) exam preparation with AI-powered mock tests, previous year questions, and government job-focused content.
              </p>

              <div className="space-y-6 pt-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-3">
                    DMLT Exam Coverage
                  </h2>
                  <ul className="space-y-2 text-white/80">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5" />
                      <span>DMLT entrance exams for government colleges</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5" />
                      <span>State-level DMLT admission tests</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5" />
                      <span>DMLT government job exams (AIIMS, ESIC, DSSSB, RRB)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5" />
                      <span>Paramedical staff nurse and lab technician recruitment</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-3">
                    Why Choose MLT Prep for DMLT?
                  </h2>
                  <ul className="space-y-2 text-white/80">
                    <li className="flex items-start gap-2">
                      <Award className="h-5 w-5 text-purple-300 flex-shrink-0 mt-0.5" />
                      <span>DMLT syllabus-aligned mock tests</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Award className="h-5 w-5 text-purple-300 flex-shrink-0 mt-0.5" />
                      <span>Previous year DMLT exam questions (PYQs)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Award className="h-5 w-5 text-purple-300 flex-shrink-0 mt-0.5" />
                      <span>AI-generated practice questions for all DMLT subjects</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Award className="h-5 w-5 text-purple-300 flex-shrink-0 mt-0.5" />
                      <span>Government job exam pattern practice</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Award className="h-5 w-5 text-purple-300 flex-shrink-0 mt-0.5" />
                      <span>Performance tracking and weak area analysis</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-3">
                    DMLT Subjects Covered
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-white/80">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                      <span>Clinical Biochemistry</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                      <span>Microbiology</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                      <span>Pathology</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                      <span>Hematology</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                      <span>Immunology</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                      <span>Blood Banking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                      <span>Histopathology</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                      <span>Lab Management</span>
                    </div>
                  </div>
                </div>

                <p className="text-lg text-white/90 pt-4">
                  Prepare for DMLT entrance exams, government job recruitment, and paramedical staff positions with our comprehensive platform. Perfect for DMLT students targeting AIIMS, ESIC, RRB, DSSSB, and state government lab technician positions.
                </p>

                <div className="flex flex-wrap gap-3 pt-6">
                  <Button
                    onClick={() => navigate("/auth")}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* SEO Keywords Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card border-white/20 backdrop-blur-xl bg-white/10 p-6 rounded-2xl"
        >
          <div className="flex flex-wrap gap-2 text-sm text-white/70">
            <span className="px-3 py-1 bg-white/10 rounded-full">DMLT Exam</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">DMLT Mock Test</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">DMLT Entrance Exam</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">DMLT Government Jobs</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">DMLT PYQs</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">Paramedical Exam</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">AIIMS DMLT</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">ESIC Paramedical</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">RRB Paramedical</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">DMLT Syllabus</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
