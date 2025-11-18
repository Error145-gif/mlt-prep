// @ts-nocheck
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router";
import { Home, BookOpen, FileText, ArrowRight, Brain } from "lucide-react";
import { useEffect } from "react";

export default function LabTechnicianExam() {
  const navigate = useNavigate();

  useEffect(() => {
    // Add canonical tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', window.location.href);
  }, []);

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
                Lab Technician Exam Preparation Online
              </h1>
              
              <p className="text-lg text-white/90">
                AI-powered mock tests and PYQs for Lab Technician exams across India including AIIMS, ESIC, DSSSB, RRB.
              </p>

              <div className="space-y-6 pt-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-3">
                    Why Choose MLT Prep?
                  </h2>
                  <ul className="space-y-2 text-white/80">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5" />
                      <span>Smart question generation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5" />
                      <span>Real exam-based mock tests</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5" />
                      <span>Govt exam syllabus targeting</span>
                    </li>
                  </ul>
                </div>

                <p className="text-lg text-white/90 pt-4">
                  Prepare for AIIMS Lab Technician, ESIC Paramedical, DSSSB Lab Tech, RRB Paramedical, and State Government Lab Technician exams with our comprehensive platform.
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
            <span className="px-3 py-1 bg-white/10 rounded-full">Lab Technician Mock Test</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">Paramedical Exam</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">DMLT Exam</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">BMLT Exam</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">AIIMS Lab Technician</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">ESIC Paramedical</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">DSSSB Lab Tech</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">RRB Paramedical</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">Lab Tech PYQs</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}