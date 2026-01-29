import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, Brain, Award, TrendingUp, Sparkles, ArrowRight, Download, CheckCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Landing() {
  const isMobile = useIsMobile();
  
  // Direct Download Link: Isse user seedha download karega bina Drive preview ke
  const appDownloadUrl = "https://drive.google.com/uc?export=download&id=1RnnhSOe4eBsvJJAe_YYc-BaCMgw9Jlv1";

  useEffect(() => {
    document.title = "MLT Prep - AI-Powered Medical Lab Technology Learning";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Master MLT with AI-powered questions, previous year papers, mock tests, and progress tracking.");
    }
  }, []);

  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const makeAdmin = useMutation(api.users.makeCurrentUserAdmin);

  useEffect(() => {
    const autoActivateAdmin = async () => {
      if (isAuthenticated && user && user.role !== "admin") {
        const allowedEmails = ["ak6722909@gmail.com", "historyindia145@gmail.com"];
        if (allowedEmails.includes(user.email?.toLowerCase().trim() || "")) {
          try {
            await makeAdmin({});
            toast.success("Admin access activated!");
            setTimeout(() => window.location.reload(), 800);
          } catch (error) {
            console.error("Auto-activation failed:", error);
          }
        }
      }
    };
    autoActivateAdmin();
  }, [isAuthenticated, user?._id, user?.role, makeAdmin]);

  const features = [
    { icon: Brain, title: "AI-Powered Medical Lab Questions", description: "Practice with AI-generated Medical Lab MCQs tailored to MLT Exam patterns" },
    { icon: BookOpen, title: "Medical Lab PYQs", description: "Access comprehensive Medical Lab PYQs and MLT Previous Year Questions" },
    { icon: Award, title: "MLT Mock Tests", description: "Take full-length MLT Mock Tests to simulate real exam conditions" },
    { icon: TrendingUp, title: "Track Progress", description: "Monitor your performance with detailed analytics and rankings" },
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Background with Animation */}
      <div 
        className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/60 via-purple-600/60 to-pink-500/60" />
        <div className="absolute inset-0 bg-white/10" />
      </div>

      {/* Navigation */}
      <nav className="glass-card border-b border-white/20 backdrop-blur-xl bg-white/10 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/logo.png" alt="MLT Logo" className="h-12 w-12 sm:h-16 sm:w-16 object-contain" />
            <span className="text-lg sm:text-2xl font-bold text-white drop-shadow-sm">MLT Prep</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {isAuthenticated ? (
              <Button onClick={() => navigate("/student")} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">Dashboard</Button>
            ) : (
              <Button onClick={() => navigate("/auth")} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">Get Started</Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/30 backdrop-blur-xl bg-white/10 text-white mb-4 shadow-sm text-sm">
            <Sparkles className="h-4 w-4 text-yellow-300" />
            <span>AI-Powered Medical Lab Technology Learning</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight drop-shadow-md">
            MLT Exam Preparation with <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-500 bg-clip-text text-transparent">AI Mock Tests & PYQs</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-4">
            Complete preparation for DMLT, BMLT, and Govt Exams with AI-generated MCQs and Detailed Analytics.
          </p>

          {/* Download APK Card - Engaging & Direct */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="max-w-lg mx-auto glass-card border-2 border-white/50 bg-gradient-to-br from-blue-600/40 to-purple-700/40 p-8 rounded-3xl shadow-2xl my-10 backdrop-blur-md"
          >
            <div className="mb-4">
              <span className="bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full uppercase">Direct Download</span>
              <h3 className="text-2xl font-black text-white mt-2">MLTprep Android App</h3>
            </div>
            <Button 
              onClick={() => window.location.href = appDownloadUrl}
              size="lg"
              className="w-full bg-white text-blue-700 hover:bg-blue-50 px-8 py-8 rounded-2xl text-2xl font-black shadow-[0_10px_20px_rgba(0,0,0,0.2)] flex gap-3 group transition-all hover:-translate-y-1"
            >
              <Download className="w-8 h-8 group-hover:animate-bounce" />
              DOWNLOAD APK
            </Button>
            <p className="mt-4 text-white/80 text-xs font-medium tracking-widest flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" /> NO PREVIEW • DIRECT FILE DOWNLOAD
            </p>
          </motion.div>

          {/* Social Proof Stats */}
          <div className="flex flex-wrap justify-center gap-6 py-4">
            <div className="text-center"><div className="text-3xl font-bold text-white">250+</div><div className="text-sm text-white/70">Students</div></div>
            <div className="text-center"><div className="text-3xl font-bold text-white">5000+</div><div className="text-sm text-white/70">Questions</div></div>
            <div className="text-center"><div className="text-3xl font-bold text-white">95%</div><div className="text-sm text-white/70">Success Rate</div></div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Button onClick={() => navigate("/auth")} size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-lg px-8 py-6 shadow-xl">
              Start Free Trial <ArrowRight className="ml-2" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* RBC Mascot Section */}
      <section className="relative z-10 flex flex-col items-center pb-20">
        <motion.img 
          src="https://harmless-tapir-303.convex.cloud/api/storage/182277e1-c82a-44a7-8408-287e25a1c39e"
          className="w-48 sm:w-64 h-auto drop-shadow-2xl"
          animate={!isMobile ? { rotate: [0, -10, 10, 0], y: [0, -15, 0] } : {}}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-20">
        {features.map((f, i) => (
          <motion.div key={i} whileHover={{ y: -5 }} className="glass-card p-6 rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur-md shadow-lg">
            <f.icon className="h-10 w-10 mb-4 text-yellow-300" />
            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
            <p className="text-white/70 text-sm">{f.description}</p>
          </motion.div>
        ))}
      </section>

      <footer className="relative z-10 text-center py-10 text-white/50 border-t border-white/10">
        <p>© 2026 MLTprep.online - Master Your Future</p>
      </footer>
    </div>
  );
}
