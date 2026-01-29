import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, Award, TrendingUp, Sparkles, ArrowRight, LogOut, Download, CheckCircle, Phone, Mail, ShieldCheck, FileText, X } from "lucide-react";
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

  const appDownloadUrl =
    "https://drive.google.com/uc?export=download&id=1RnnhSOe4eBsvJJAe_YYc-BaCMgw9Jlv1";

  useEffect(() => {
    document.title = "MLT Prep - India's Premier MLT Exam Platform";
  }, []);

  useEffect(() => {
    const autoActivate = async () => {
      if (isAuthenticated && user && user.role !== "admin") {
        const allowed = ["ak6722909@gmail.com", "historyindia145@gmail.com"];
        if (allowed.includes(user.email?.toLowerCase().trim() || "")) {
          try {
            await makeAdmin({});
            toast.success("Admin access activated!");
          } catch (e) {
            console.error(e);
          }
        }
      }
    };
    autoActivate();
  }, [isAuthenticated, user, makeAdmin]);

  return (
    <div className="min-h-screen relative overflow-x-hidden">

      {/* BACKGROUND */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: isMobile ? "scroll" : "fixed"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/70 via-purple-600/70 to-pink-500/70" />

        {!isMobile && (
          <>
            <motion.div className="absolute top-20 left-10 text-6xl opacity-20" animate={{ y: [0, -30, 0] }} transition={{ duration: 6, repeat: Infinity }}>💉</motion.div>
            <motion.div className="absolute top-40 right-20 text-5xl opacity-20" animate={{ y: [0, 25, 0] }} transition={{ duration: 7, repeat: Infinity }}>🔬</motion.div>
            <motion.div className="absolute bottom-32 left-1/4 text-5xl opacity-20" animate={{ y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity }}>🧪</motion.div>
            <motion.div className="absolute bottom-20 right-1/3 text-4xl opacity-20" animate={{ y: [0, 30, 0] }} transition={{ duration: 5, repeat: Infinity }}>🩺</motion.div>
          </>
        )}
      </div>

      {/* NAVBAR */}
      <nav className="glass-card border-b border-white/20 backdrop-blur-xl bg-white/10 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/logo.png" className="h-10 w-10" />
            <span className="text-white font-bold text-xl">MLT Prep</span>
          </div>

          {isAuthenticated ? (
            <div className="flex gap-3">
              <Button onClick={() => navigate("/student")} className="bg-blue-600">Dashboard</Button>
              <Button onClick={() => signOut()} variant="outline" className="border-white/30 text-white">
                <LogOut className="h-4 w-4 mr-1" /> Logout
              </Button>
            </div>
          ) : (
            <Button onClick={() => navigate("/auth")} className="bg-white text-blue-600 font-bold">
              Login
            </Button>
          )}

        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 pt-12 text-center relative z-10">

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>

          <div className="inline-flex gap-2 bg-white/20 px-4 py-1 rounded-full text-white text-sm mb-4">
            <Sparkles className="h-4 w-4 text-yellow-300" />
            AI Powered Preparation
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white">
            Crack MLT Exams with <br />
            <span className="text-yellow-300">AI Mock Tests & PYQs</span>
          </h1>

          {/* DOWNLOAD BUTTON */}
          <div className="max-w-xl mx-auto mt-8">

            <Button
              onClick={() => window.open(appDownloadUrl, "_blank")}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 py-7 rounded-2xl flex gap-4 justify-center items-center shadow-xl"
            >
              <Download className="w-7 h-7" />
              <div className="text-left">
                <p className="text-xs opacity-80">Official Android App</p>
                <p className="font-black text-lg">DOWNLOAD MLTPREP APP</p>
              </div>
            </Button>

            <p className="text-white/70 text-xs mt-2">
              After download enable "Install unknown apps"
            </p>

          </div>

          {/* STATS */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {["250+ Students", "5000+ MCQs", "95% Success"].map((stat) => (
              <div key={stat} className="bg-white/10 px-6 py-2 rounded-xl text-white font-bold">
                {stat}
              </div>
            ))}
          </div>

          <Button
            onClick={() => navigate("/auth")}
            className="mt-8 bg-blue-600 px-10 py-6 text-lg rounded-xl"
          >
            Start Free Trial <ArrowRight className="ml-2" />
          </Button>

        </motion.div>

      </section>

      {/* FOOTER */}
      <footer className="bg-black/40 mt-20 py-12 relative z-10">

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">

          <div>
            <div className="flex gap-2 items-center mb-3">
              <img src="/logo.png" className="h-10 w-10" />
              <span className="text-white font-bold">MLT Prep</span>
            </div>
            <p className="text-white/60 text-sm">
              India's leading MLT preparation platform.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3">Policies</h4>
            <div className="flex flex-col gap-2 text-white/60 text-sm">
              <button onClick={() => navigate("/contact-us")}>Contact Us</button>
              <button onClick={() => navigate("/terms")}>Terms</button>
              <button onClick={() => navigate("/privacy")}>Privacy Policy</button>
              <button onClick={() => navigate("/refund-policy")}>Refund Policy</button>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3">Support</h4>
            <p className="text-white/60 text-sm">support@mltprep.online</p>
          </div>

        </div>

        <p className="text-center text-white/40 text-xs mt-8">
          © 2026 MLTPREP.ONLINE
        </p>

      </footer>

      {/* Hidden icons to avoid TS unused warning */}
      <div className="hidden">
        <CheckCircle /><X /><TrendingUp /><Award /><BookOpen />
      </div>

    </div>
  );
}
