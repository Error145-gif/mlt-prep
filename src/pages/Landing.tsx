// @ts-nocheck
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, Brain, Award, TrendingUp, Sparkles, ArrowRight, LogOut } from "lucide-react";
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

  useEffect(() => {
    document.title = "MLT Prep - AI-Powered Medical Lab Technology Learning";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Master MLT with AI-powered questions, previous year papers, mock tests, and progress tracking."
      );
    }

    return () => {};
  }, []);

  const handleMakeAdmin = async () => {
    try {
      await makeAdmin({});
      toast.success("Admin activated");
      setTimeout(() => navigate("/admin"), 800);
    } catch (err: any) {
      toast.error("Admin activation failed");
    }
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Medical Lab Questions",
      description: "AI generated MCQs based on MLT exam pattern",
    },
    {
      icon: BookOpen,
      title: "Medical Lab PYQs",
      description: "Previous year questions with structured sets",
    },
    {
      icon: Award,
      title: "MLT Mock Tests",
      description: "Full length mock tests for real exam practice",
    },
    {
      icon: TrendingUp,
      title: "Track Medical Lab Tech Progress",
      description: "Performance analytics & ranking system",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden">

      {/* Background Image */}
      <div
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&q=80&auto=format&fit=crop)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />

      {/* Gradient Layer */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500" />

      {/* NAVBAR */}
      <nav className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src="https://harmless-tapir-303.convex.cloud/api/storage/f860104a-418e-4fd0-bb3b-3bf6e1bc71db"
              className="h-12 w-12"
            />
            <span className="text-white font-bold text-xl">
              MLT Prep
            </span>
          </div>

          <div className="flex gap-2">
            {isAuthenticated ? (
              <>
                {user?.role === "admin" && (
                  <Button onClick={() => navigate("/admin")}>
                    Admin
                  </Button>
                )}

                {user?.role !== "admin" &&
                  user?.email === "ak6722909@gmail.com" && (
                    <Button onClick={handleMakeAdmin}>
                      Activate Admin
                    </Button>
                  )}

                <Button onClick={() => navigate("/student")}>
                  Dashboard
                </Button>

                <Button variant="outline" onClick={() => signOut()}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate("/auth")}>
                Get Started
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white mb-4">
              <Sparkles className="h-4 w-4" />
              AI-Powered Medical Lab Technology Learning
            </div>

            <h1 className="text-white font-bold text-4xl md:text-6xl leading-tight">
              Medical Lab Technician (MLT) Exam Preparation
              <span className="block text-yellow-300">
                with AI-Powered Mock Tests & PYQs
              </span>
            </h1>

            <p className="text-white/80 mt-4 max-w-xl">
              Complete preparation for DMLT, BMLT and Lab Technician Govt Exams
            </p>

            {/* MAIN CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">

              <Button
                size="lg"
                onClick={() =>
                  navigate(
                    isAuthenticated
                      ? user?.role === "admin"
                        ? "/admin"
                        : "/student"
                      : "/auth"
                  )
                }
                className="bg-gradient-to-r from-blue-500 to-purple-600"
              >
                {isAuthenticated ? "Go to Dashboard" : "Start Learning"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              {/* DOWNLOAD BUTTON (ADDED) */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  onClick={() =>
                    window.open(
                      "https://drive.google.com/uc?export=download&id=1GYJUbNp9GJuEBYpkF3IwMy6YxvSl8gvz",
                      "_blank"
                    )
                  }
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                >
                  ⬇ Download MLT Prep App
                </Button>
              </motion.div>

            </div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <motion.img
              src="https://harmless-tapir-303.convex.cloud/api/storage/95eceda1-7789-4d29-bf58-640afb9f4499"
              className="w-72 md:w-96"
              animate={isMobile ? {} : { y: [0, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-white text-center text-3xl font-bold mb-10">
          Everything You Need to Succeed
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {features.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white/20 backdrop-blur-xl rounded-xl p-6 text-white"
            >
              <item.icon className="h-7 w-7 mb-3" />
              <h3 className="font-semibold mb-1">
                {item.title}
              </h3>
              <p className="text-white/70 text-sm">
                {item.description}
              </p>
            </motion.div>
          ))}

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/20 py-6 text-center text-white/70">
        © 2024 MLT Prep. All rights reserved.
      </footer>

    </div>
  );
}