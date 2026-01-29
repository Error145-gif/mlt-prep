// @ts-nocheck

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import {
  BookOpen,
  Brain,
  Award,
  TrendingUp,
  Sparkles,
  ArrowRight,
  LogOut,
  CheckCircle,
  X,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useEffect } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Landing() {
  const { signOut } = useAuthActions();
  const isMobile = useIsMobile();

  useEffect(() => {
    document.title = "MLT Prep - AI-Powered Medical Lab Technology Learning";

    const metaDescription = document.querySelector(
      'meta[name="description"]'
    );
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Master MLT with AI-powered questions, previous year papers, mock tests, and progress tracking. 7-day free trial for medical lab technology students."
      );
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute(
        "content",
        "MLT, Medical Lab Technology, ESIC MLT, mock tests, PYQ, AI questions, exam preparation"
      );
    }

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", window.location.href);

    try {
      let schemaScript = document.querySelector(
        'script[type="application/ld+json"][data-page="landing"]'
      );
      if (!schemaScript) {
        schemaScript = document.createElement("script");
        schemaScript.setAttribute("type", "application/ld+json");
        schemaScript.setAttribute("data-page", "landing");
        schemaScript.textContent = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: "MLT Prep",
          url: "https://www.mltprep.online",
          logo: "https://harmless-tapir-303.convex.cloud/api/storage/39c4275e-7220-41f1-b10f-c38ae74bf9f1",
          description:
            "MLT exam preparation with AI-powered mock tests, PYQs, and analytics for DMLT, BMLT and Govt MLT exams.",
        });
        document.head.appendChild(schemaScript);
      }
    } catch (e) {
      console.error("Error adding JSON-LD schema:", e);
    }

    return () => {
      const schema = document.querySelector(
        'script[type="application/ld+json"][data-page="landing"]'
      );
      if (schema) schema.remove();
    };
  }, []);

  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const makeAdmin = useMutation(api.users.makeCurrentUserAdmin);

  useEffect(() => {
    const autoActivateAdmin = async () => {
      if (isAuthenticated && user && user.role !== "admin") {
        const allowedEmails = [
          "ak6722909@gmail.com",
          "historyindia145@gmail.com",
        ];

        if (
          allowedEmails.includes(user.email?.toLowerCase().trim() || "")
        ) {
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
  }, [isAuthenticated, user?._id, user?.role]);

  const handleMakeAdmin = async () => {
    try {
      await makeAdmin({});
      toast.success("You are now an admin! Redirecting...");
      setTimeout(() => navigate("/admin"), 1000);
    } catch (error: any) {
      toast.error(
        error.message || "Failed to make you an admin. Please try again."
      );
    }
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Medical Lab Questions",
      description:
        "Practice with AI-generated Medical Lab MCQs tailored to MLT Exam and Lab Technician Exam patterns",
    },
    {
      icon: BookOpen,
      title: "Medical Lab PYQs",
      description:
        "Access comprehensive Medical Lab PYQs and MLT Previous Year Questions organized by exam and year",
    },
    {
      icon: Award,
      title: "MLT Mock Tests",
      description:
        "Take full-length MLT Mock Tests and Lab Technician Govt Exam practice tests to simulate real exam conditions",
    },
    {
      icon: TrendingUp,
      title: "Track Medical Lab Tech Progress",
      description:
        "Monitor your Medical Lab Technician Exam performance with detailed analytics and rankings",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 text-center"
        >
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white">
            Medical Lab Technician (MLT) Exam Preparation with{" "}
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 bg-clip-text text-transparent">
              AI-Powered Mock Tests & PYQs
            </span>
          </h1>

          <Button
            onClick={() =>
              navigate(
                isAuthenticated
                  ? user?.role === "admin"
                    ? "/admin"
                    : "/student"
                  : "/auth"
              )
            }
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {isAuthenticated
              ? user?.role === "admin"
                ? "Admin Panel"
                : "Go to Dashboard"
              : "Start Free Trial"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card border border-white/30 backdrop-blur-xl bg-white/20 p-6 rounded-2xl"
            >
              <feature.icon className="h-6 w-6 text-white mb-3" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-white/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/20 backdrop-blur-xl bg-transparent py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-white/60">
          <p className="text-sm">© 2024 MLT Prep. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}