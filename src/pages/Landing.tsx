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

  const DOWNLOAD_URL =
    "https://drive.google.com/uc?export=download&id=1GYJUbNp9GJuEBYpkF3IwMy6YxvSl8gvz";

  useEffect(() => {
    document.title = "MLT Prep - AI-Powered Medical Lab Technology Learning";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Master MLT with AI-powered questions, previous year papers, mock tests, and progress tracking."
      );
    }
  }, []);

  const handleMakeAdmin = async () => {
    try {
      await makeAdmin({});
      toast.success("You are now an admin!");
      setTimeout(() => navigate("/admin"), 1000);
    } catch (error: any) {
      toast.error("Failed to activate admin");
    }
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Questions",
      description: "Practice with AI-generated MCQs tailored to MLT exam patterns",
    },
    {
      icon: BookOpen,
      title: "Previous Year Questions",
      description: "Access comprehensive PYQ sets organized by exam and year",
    },
    {
      icon: Award,
      title: "Mock Tests",
      description: "Take full-length mock tests to simulate real exam conditions",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your performance with detailed analytics and rankings",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden">

      {/* BACKGROUND */}
      <div
        className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500"
      />

      {/* NAVBAR */}
      <nav className="glass-card border-b border-white/20 backdrop-blur-xl bg-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src="https://harmless-tapir-303.convex.cloud/api/storage/f860104a-418e-4fd0-bb3b-3bf6e1bc71db"
              className="h-12"
            />
            <span className="text-white font-bold text-xl">MLT Prep</span>
          </div>

          <div className="flex gap-2">
            {isAuthenticated ? (
              <>
                {user?.role === "admin" && (
                  <Button onClick={() => navigate("/admin")}>Admin</Button>
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

                <Button onClick={() => signOut()} variant="outline">
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
      <section className="max-w-7xl mx-auto px-4 py-20">

        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >

            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-white">
              <Sparkles className="h-4 w-4" />
              AI Powered MLT Learning
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold text-white">
              MLT Exam Preparation With
              <span className="block text-yellow-300">
                AI Smart Learning
              </span>
            </h1>

            <p className="text-white/80 text-lg">
              DMLT, BMLT, Govt Lab Technician Mock Tests & PYQs
            </p>

            {/* BUTTON ROW */}
            <div className="flex flex-wrap gap-4 pt-4">

              {/* EXISTING START BUTTON */}
              <motion.div whileHover={{ scale: 1.05 }}>
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
                  {isAuthenticated
                    ? user?.role === "admin"
                      ? "Admin Panel"
                      : "Go To Dashboard"
                    : "Start Learning"}

                  <ArrowRight className="ml-2" />
                </Button>
              </motion.div>

              {/* ✅ DOWNLOAD BUTTON ADDED */}
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  size="lg"
                  onClick={() => window.open(DOWNLOAD_URL, "_blank")}
                  className="bg-gradient-to-r from-green-500 to-emerald-600"
                >
                  ⬇ Download App
                </Button>
              </motion.div>

            </div>

          </motion.div>

          {/* RIGHT MASCOT */}
          <motion.div
            animate={isMobile ? {} : { y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="flex justify-center"
          >
            <img
              src="https://harmless-tapir-303.convex.cloud/api/storage/95eceda1-7789-4d29-bf58-640afb9f4499"
              className="w-72 drop-shadow-2xl"
            />
          </motion.div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 py-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {features.map((item) => (
          <div
            key={item.title}
            className="bg-white/20 p-6 rounded-xl text-white"
          >
            <item.icon className="mb-3" />
            <h3 className="font-bold">{item.title}</h3>
            <p className="text-white/70 text-sm">{item.description}</p>
          </div>
        ))}

      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/20 text-center py-6 text-white/60">
        © 2024 MLT Prep. All rights reserved.
      </footer>

    </div>
  );
}
