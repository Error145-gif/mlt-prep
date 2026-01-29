import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, Brain, Award, TrendingUp, Sparkles, ArrowRight, LogOut, CheckCircle, X, Download, Phone, Mail, ShieldCheck, FileText } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useEffect } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Landing() {
  const { signOut } = useAuthActions();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const makeAdmin = useMutation(api.users.makeCurrentUserAdmin);
  
  const appDownloadUrl = "https://drive.google.com/uc?export=download&id=1RnnhSOe4eBsvJJAe_YYc-BaCMgw9Jlv1";

  useEffect(() => {
    document.title = "MLT Prep - India's Premier MLT Exam Platform";
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* --- ORIGINAL ENGAGING BACKGROUND --- */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: isMobile ? "scroll" : "fixed"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/70 via-purple-600/70 to-pink-500/70" />
        <div className="absolute inset-0 bg-white/5" />
        
        {/* Floating Icons */}
        {!isMobile && (
          <>
            <motion.div className="absolute top-20 left-10 text-6xl opacity-20" animate={{ y: [0, -30, 0] }} transition={{ duration: 6, repeat: Infinity }}>💉</motion.div>
            <motion.div className="absolute top-40 right-20 text-5xl opacity-20" animate={{ y: [0, 25, 0] }} transition={{ duration: 7, repeat: Infinity }}>🔬</motion.div>
            <motion.div className="absolute bottom-32 left-1/4 text-5xl opacity-20" animate={{ y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity }}>🧪</motion.div>
            <motion.div className="absolute bottom-20 right-1/3 text-4xl opacity-20" animate={{ y: [0, 30, 0] }} transition={{ duration: 5, repeat: Infinity }}>🩺</motion.div>
          </>
        )}
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="glass-card border-b border-white/20 backdrop-blur-xl bg-white/10 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/logo.png" alt="MLT Logo" className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />
            <span className="text-xl font-bold text-white drop-shadow-sm">MLT Prep</span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {isAuthenticated ? (
              <>
                <Button onClick={() => navigate("/student")} size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">Dashboard</Button>
                <Button onClick={() => signOut()} variant="outline" size="sm" className="bg-white/10 text-white border-white/30">
                  <LogOut className="h-4 w-4 mr-1" /> <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate("/auth")} size="sm" className="bg-white text-blue-600 font-bold hover:bg-blue-50">Login</Button>
            )}
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pt-10 pb-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs sm:text-sm">
            <Sparkles className="h-4 w-4 text-yellow-300" />
            <span>AI-Powered Medical Technology Preparation</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Crack MLT Exams with <br/> <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent underline decoration-orange-400">AI Mock Tests & PYQs</span>
          </h1>

          <p className="text-sm sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            India's Prep is the premier platform for AI-powered MCQs, previous year papers (PYQ), and progress tracking for DMLT, BMLT, and Govt MLT Exams.
          </p>

          {/* --- NEW HORIZONTAL DOWNLOAD BUTTON --- */}
          <motion.div whileHover={{ scale: 1.02 }} className="max-w-2xl mx-auto mt-8">
            <Button 
              onClick={() => window.open(appDownloadUrl, '_self')}
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-10 py-8 rounded-2xl text-xl font-black shadow-2xl flex flex-col sm:flex-row items-center gap-3 group transition-all"
            >
              <Download className="w-8 h-8 group-hover:animate-bounce" />
              <div className="text-left">
                <p className="text-xs font-bold opacity-80 leading-none">OFFICIAL APP</p>
                <p>INSTALL MLTPREP APK NOW</p>
              </div>
              <div className="hidden sm:block ml-4 px-3 py-1 bg-white/20 rounded-lg text-xs font-medium">
                v2.1 • Safe
              </div>
            </Button>
            <p className="text-white/60 text-[10px] mt-2 tracking-widest uppercase">✓ Fast Download • ✓ No Preview • ✓ Verified Safe</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 py-4">
             <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-center min-w-[100px]">
                <div className="text-2xl font-bold text-white">250+</div>
                <div className="text-[10px] text-white/60 uppercase">Students</div>
             </div>
             <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-center min-w-[100px]">
                <div className="text-2xl font-bold text-white">5000+</div>
                <div className="text-[10px] text-white/60 uppercase">MCQs</div>
             </div>
             <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-center min-w-[100px]">
                <div className="text-2xl font-bold text-white">95%</div>
                <div className="text-[10px] text-white/60 uppercase">Success</div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* --- MASCOT --- */}
      <section className="relative z-10 flex justify-center pb-10">
        <motion.img 
          src="https://harmless-tapir-303.convex.cloud/api/storage/182277e1-c82a-44a7-8408-287e25a1c39e"
          className="w-40 sm:w-56 h-auto drop-shadow-2xl"
          animate={{ rotate: [0, -5, 5, 0], y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-3 py-10">
        {[
          { icon: Brain, title: "AI Practice", color: "text-blue-400" },
          { icon: BookOpen, title: "PYQ Sets", color: "text-purple-400" },
          { icon: Award, title: "Mock Tests", color: "text-pink-400" },
          { icon: TrendingUp, title: "Analytics", color: "text-yellow-400" },
        ].map((f, i) => (
          <div key={i} className="glass-card p-4 rounded-2xl border border-white/10 bg-white/5 text-center backdrop-blur-md">
            <f.icon className={`h-8 w-8 mx-auto mb-2 ${f.color}`} />
            <h3 className="text-xs sm:text-sm font-bold text-white">{f.title}</h3>
          </div>
        ))}
      </section>

      {/* --- RESTORED FOOTER & POLICIES --- */}
      <footer className="relative z-10 bg-black/40 backdrop-blur-3xl border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="MLT Logo" className="h-10 w-10" />
              <span className="text-xl font-bold text-white">MLT Prep</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">
              Leading Medical Lab Technology exam preparation platform. We empower students to achieve excellence through AI technology and verified resources.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold flex items-center gap-2 underline decoration-blue-500">
              <ShieldCheck className="h-4 w-4" /> Policies & Quick Links
            </h4>
            <div className="grid grid-cols-1 gap-2">
              <button onClick={() => navigate("/contact-us")} className="text-sm text-white/50 hover:text-white flex items-center gap-2 transition-all w-fit"><Phone className="h-3 w-3" /> Contact Us</button>
              <button onClick={() => navigate("/terms")} className="text-sm text-white/50 hover:text-white flex items-center gap-2 transition-all w-fit"><FileText className="h-3 w-3" /> Terms & Conditions</button>
              <button onClick={() => navigate("/privacy")} className="text-sm text-white/50 hover:text-white flex items-center gap-2 transition-all w-fit"><ShieldCheck className="h-3 w-3" /> Privacy Policy</button>
              <button onClick={() => navigate("/refund-policy")} className="text-sm text-white/50 hover:text-white flex items-center gap-2 transition-all w-fit"><Mail className="h-3 w-3" /> Refund Policy</button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold underline decoration-purple-500 text-sm uppercase">Get in Touch</h4>
            <p className="text-xs text-white/40 italic">For any queries regarding exams or technical support, please mail us at support@mltprep.online</p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">© 2026 MLTprep.online • Made for Excellence</p>
        </div>
      </footer>

      {/* Hidden elements to satisfy build imports */}
      <div className="hidden"><CheckCircle /><X /></div>
    </div>
  );
}
