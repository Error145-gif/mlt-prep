import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, LogOut, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useAuthActions } from "@convex-dev/auth/react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Landing() {

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { signOut } = useAuthActions();
  const isMobile = useIsMobile();

  const appDownloadUrl =
    "https://drive.google.com/uc?export=download&id=1GYJUbNp9GJuEBYpkF3IwMy6YxvSl8gvz";

  return (
    <div className="min-h-screen relative overflow-hidden">

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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-purple-700/80 to-pink-600/80" />
      </div>

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white/10 backdrop-blur-xl border-b border-white/20">

        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="/logo.png" className="h-10" />
          <span className="text-white font-bold text-lg tracking-wide">
            MLT Prep
          </span>
        </div>

        {isAuthenticated ? (
          <div className="flex gap-2">
            <Button
              onClick={() => navigate("/student")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Dashboard
            </Button>

            <Button
              onClick={() => signOut()}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => navigate("/auth")}
            className="bg-white text-blue-600 font-bold hover:bg-gray-200"
          >
            Login
          </Button>
        )}

      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-24 text-center">

        <div className="inline-flex items-center gap-2 bg-white/20 px-5 py-1.5 rounded-full text-white text-sm mb-6">
          <Sparkles className="h-4 w-4 text-yellow-300" />
          AI Powered Medical Exam Preparation
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-6xl font-black text-white leading-tight"
        >
          Crack MLT Exams With <br />
          <span className="text-yellow-300">
            AI Mock Tests & PYQs
          </span>
        </motion.h1>

        <p className="text-white/80 mt-6 max-w-2xl mx-auto text-base sm:text-lg">
          Prepare smarter for DMLT, BMLT, AIIMS, ESIC and Government Lab Technician exams using AI powered practice system.
        </p>

        {/* CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">

          <Button
            onClick={() => navigate("/auth")}
            className="bg-blue-600 hover:bg-blue-700 px-10 py-6 text-lg rounded-xl shadow-xl"
          >
            Start Free Trial
            <ArrowRight className="ml-2" />
          </Button>

          <Button
            onClick={() => window.open(appDownloadUrl, "_blank")}
            className="bg-green-600 hover:bg-green-700 px-10 py-6 text-lg rounded-xl shadow-xl"
          >
            Download App
            <Download className="ml-2" />
          </Button>

        </div>

        <p className="text-white/60 text-xs mt-3">
          After download enable "Install unknown apps"
        </p>

      </section>

      {/* MASCOT */}
      <section className="flex justify-center mt-20">

        <motion.img
          src="https://harmless-tapir-303.convex.cloud/api/storage/182277e1-c82a-44a7-8408-287e25a1c39e"
          className="w-36 sm:w-52 drop-shadow-2xl"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

      </section>

      {/* STATS */}
      <section className="flex justify-center gap-6 mt-12 flex-wrap">

        {["250+ Students", "5000+ Questions", "95% Success"].map((item) => (
          <div
            key={item}
            className="bg-white/15 backdrop-blur-md px-7 py-3 rounded-xl text-white font-semibold tracking-wide"
          >
            {item}
          </div>
        ))}

      </section>

      {/* FOOTER */}
      <footer className="mt-24 py-10 text-center text-white/50 text-sm">
        © 2026 MLT Prep • All Rights Reserved
      </footer>

    </div>
  );
}
