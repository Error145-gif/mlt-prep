import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, Brain, Award, TrendingUp, Sparkles, ArrowRight, Shield } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const makeAdmin = useMutation(api.users.makeCurrentUserAdmin);

  const handleMakeAdmin = async () => {
    try {
      await makeAdmin({});
      toast.success("You are now an admin! Redirecting...");
      setTimeout(() => navigate("/admin"), 1000);
    } catch (error) {
      toast.error("Failed to make you an admin. Please try again.");
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: "Comprehensive Content",
      description: "Access PDFs, videos, and past-year questions curated by experts",
    },
    {
      icon: Brain,
      title: "AI-Powered Questions",
      description: "Practice with AI-generated MCQs, true/false, and short-answer questions",
    },
    {
      icon: Award,
      title: "Track Progress",
      description: "Monitor your learning journey with detailed analytics and insights",
    },
    {
      icon: TrendingUp,
      title: "Personalized Learning",
      description: "Get recommendations based on your weak topics and performance",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Navigation */}
      <nav className="glass-card border-b border-white/20 backdrop-blur-xl bg-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/logo.svg" alt="MLT Logo" className="h-10 w-10" />
            <span className="text-xl font-bold text-white">MLT Learning</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {user?.role !== "admin" && (
                  <Button
                    onClick={handleMakeAdmin}
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Become Admin
                  </Button>
                )}
                {user?.role === "admin" && (
                  <Button
                    onClick={() => navigate("/admin")}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                  >
                    Admin Panel
                  </Button>
                )}
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Dashboard
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Get Started
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/20 backdrop-blur-xl bg-white/10 text-white/90 mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm">AI-Powered Medical Lab Technology Learning</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
            Master MLT with
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Smart Learning
            </span>
          </h1>
          
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Comprehensive study materials, AI-generated practice questions, and personalized analytics to help you excel in Medical Lab Technology
          </p>
          
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              onClick={() => navigate(isAuthenticated ? (user?.role === "admin" ? "/admin" : "/dashboard") : "/auth")}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8"
            >
              {isAuthenticated ? (user?.role === "admin" ? "Admin Panel" : "Go to Dashboard") : "Start Learning"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Everything You Need to Succeed</h2>
          <p className="text-white/70 text-lg">Powerful features designed for effective learning</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card border border-white/20 backdrop-blur-xl bg-white/10 p-6 rounded-2xl hover:bg-white/15 transition-all"
            >
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 w-fit mb-4">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="glass-card border border-white/20 backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 p-12 rounded-3xl text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students mastering Medical Lab Technology with our comprehensive platform
          </p>
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 backdrop-blur-xl bg-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-white/60">
          <p>© 2024 MLT Learning. Powered by <a href="https://vly.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">vly.ai</a></p>
        </div>
      </footer>
    </div>
  );
}