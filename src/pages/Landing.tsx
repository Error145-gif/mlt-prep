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
    } catch (error: any) {
      toast.error(error.message || "Failed to make you an admin. Please try again.");
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Lab Background Image - Lighter */}
      <div 
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Animated Background Gradients - Vibrant Purple/Blue Theme */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-pink-400/25 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] bg-cyan-400/25 rounded-full blur-3xl" />
        
        {/* Floating Medical Icons */}
        <motion.div
          className="absolute top-20 left-10 text-6xl opacity-20"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          💉
        </motion.div>
        
        <motion.div
          className="absolute top-40 right-20 text-5xl opacity-20"
          animate={{
            y: [0, 25, 0],
            rotate: [0, -15, 15, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          🔬
        </motion.div>
        
        <motion.div
          className="absolute bottom-32 left-1/4 text-5xl opacity-20"
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          🧪
        </motion.div>
        
        <motion.div
          className="absolute bottom-20 right-1/3 text-4xl opacity-20"
          animate={{
            y: [0, 30, 0],
            rotate: [0, 20, -20, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          🩺
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="glass-card border-b border-white/20 backdrop-blur-xl bg-white/10 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/logo.svg" alt="MLT Logo" className="h-10 w-10" />
            <span className="text-xl font-bold text-white drop-shadow-lg">MLT Learning</span>
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
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 text-center lg:text-left"
          >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/30 backdrop-blur-xl bg-white/20 text-white mb-4 shadow-md"
            animate={{
              boxShadow: [
                "0 0 20px rgba(255, 255, 255, 0.3)",
                "0 0 40px rgba(255, 255, 255, 0.6)",
                "0 0 20px rgba(255, 255, 255, 0.3)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-4 w-4" />
            </motion.div>
            <span className="text-sm">AI-Powered Medical Lab Technology Learning</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight drop-shadow-2xl">
            Master MLT with
            <br />
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              Smart Learning
            </span>
          </h1>
          
          <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-lg">
            Comprehensive study materials, AI-generated practice questions, and personalized analytics to help you excel in Medical Lab Technology
          </p>
          
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => navigate(isAuthenticated ? (user?.role === "admin" ? "/admin" : "/dashboard") : "/auth")}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 shadow-lg hover:shadow-2xl transition-shadow"
                >
                  {isAuthenticated ? (user?.role === "admin" ? "Admin Panel" : "Go to Dashboard") : "Start Learning"}
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="inline-block ml-2"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Animated Character */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <motion.img
                src="https://harmless-tapir-303.convex.cloud/api/storage/95eceda1-7789-4d29-bf58-640afb9f4499"
                alt="MLT Mascot"
                className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 drop-shadow-2xl"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white drop-shadow-lg mb-4">Everything You Need to Succeed</h2>
          <p className="text-white/90 text-lg drop-shadow-md">Powerful features designed for effective learning</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 60px rgba(139, 92, 246, 0.4)",
                transition: { duration: 0.3 }
              }}
              className="glass-card border border-white/30 backdrop-blur-xl bg-white/20 p-6 rounded-2xl hover:bg-white/30 transition-all duration-300 shadow-xl"
            >
              <motion.div 
                className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 w-fit mb-4"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(139, 92, 246, 0.5)",
                    "0 0 40px rgba(139, 92, 246, 0.8)",
                    "0 0 20px rgba(139, 92, 246, 0.5)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
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
      <footer className="relative z-10 border-t border-white/20 backdrop-blur-xl bg-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <h3 className="text-white font-semibold mb-3">MLT Learning</h3>
              <p className="text-white/60 text-sm">
                Comprehensive Medical Lab Technology education platform for government and technical exam preparation.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Quick Links</h3>
              <div className="space-y-2">
                <a href="/contact" className="block text-white/60 hover:text-white text-sm transition-colors">Contact Us</a>
                <a href="/terms" className="block text-white/60 hover:text-white text-sm transition-colors">Terms & Conditions</a>
                <a href="/privacy" className="block text-white/60 hover:text-white text-sm transition-colors">Privacy Policy</a>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Policies</h3>
              <div className="space-y-2">
                <a href="/shipping-policy" className="block text-white/60 hover:text-white text-sm transition-colors">Shipping Policy</a>
                <a href="/refund-policy" className="block text-white/60 hover:text-white text-sm transition-colors">Refund Policy</a>
              </div>
            </div>
          </div>
          <div className="text-center text-white/60 pt-6 border-t border-white/20">
            <p>© 2024 MLT Learning. Powered by <a href="https://vly.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">vly.ai</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}