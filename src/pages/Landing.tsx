import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, Brain, Award, TrendingUp, Sparkles, ArrowRight, LogOut, CheckCircle, X } from "lucide-react";
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

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Master MLT with AI-powered questions, previous year papers, mock tests, and progress tracking. 7-day free trial for medical lab technology students.");
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute("content", "MLT, Medical Lab Technology, ESIC MLT, mock tests, PYQ, AI questions, exam preparation");
    }

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', window.location.href);

    try {
      let schemaScript = document.querySelector('script[type="application/ld+json"][data-page="landing"]');
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.setAttribute('type', 'application/ld+json');
        schemaScript.setAttribute('data-page', 'landing');
        schemaScript.textContent = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "MLT Prep",
          "url": "https://www.mltprep.online",
          "logo": "https://harmless-tapir-303.convex.cloud/api/storage/39c4275e-7220-41f1-b10f-c38ae74bf9f1",
          "description": "MLT exam preparation with AI-powered mock tests, PYQs, and analytics for DMLT, BMLT and Govt MLT exams."
        });
        document.head.appendChild(schemaScript);
      }
    } catch (e) {
      console.error("Error adding JSON-LD schema:", e);
    }

    return () => {
      const schema = document.querySelector('script[type="application/ld+json"][data-page="landing"]');
      if (schema) {
        schema.remove();
      }
    };
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
          } catch (error: any) {
            console.error("Auto-activation failed:", error);
          }
        }
      }
    };

    autoActivateAdmin();
  }, [isAuthenticated, user?._id, user?.role, makeAdmin]);

  const handleMakeAdmin = async () => {
    try {
      await makeAdmin({});
      toast.success("You are now an admin! Redirecting...");
      setTimeout(() => navigate("/admin"), 1000);
    } catch (error: any) {
      toast.error(error?.message || "Failed to make you an admin. Please try again.");
    }
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Medical Lab Questions",
      description: "Practice with AI-generated Medical Lab MCQs tailored to MLT Exam and Lab Technician Exam patterns",
    },
    {
      icon: BookOpen,
      title: "Medical Lab PYQs",
      description: "Access comprehensive Medical Lab PYQs and MLT Previous Year Questions organized by exam and year",
    },
    {
      icon: Award,
      title: "MLT Mock Tests",
      description: "Take full-length MLT Mock Tests and Lab Technician Govt Exam practice tests to simulate real exam conditions",
    },
    {
      icon: TrendingUp,
      title: "Track Medical Lab Tech Progress",
      description: "Monitor your Medical Lab Technician Exam performance with detailed analytics and rankings",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <div 
        className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: window.innerWidth < 768 ? "scroll" : "fixed"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/60 via-purple-600/60 to-pink-500/60" />
        <div className="absolute inset-0 bg-white/10" />

        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-pink-400/20 rounded-full blur-3xl" />

        <motion.div
          className="hidden md:block absolute top-20 left-10 text-6xl opacity-20"
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
          className="hidden md:block absolute top-40 right-20 text-5xl opacity-20"
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
          className="hidden md:block absolute bottom-32 left-1/4 text-5xl opacity-20"
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
          className="hidden md:block absolute bottom-20 right-1/3 text-4xl opacity-20"
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

      <nav className="glass-card border-b border-white/20 backdrop-blur-xl bg-white/10 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img
              src="/logo.png"
              alt="MLT Logo"
              loading="eager"
              fetchPriority="high"
              width="64"
              height="64"
              className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
              onError={(e) => {
                e.currentTarget.src = "/favicon.png";
              }}
            />
            <span className="text-lg sm:text-2xl font-bold text-white drop-shadow-sm">MLT Prep</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {isAuthenticated ? (
              <>
                {user?.role === "admin" && (
                  <Button
                    onClick={() => navigate("/admin")}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
                  >
                    Admin
                  </Button>
                )}
                {user?.role !== "admin" && (user?.email === "ak6722909@gmail.com" || user?.email === "historyindia145@gmail.com") && (
                  <Button
                    onClick={handleMakeAdmin}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
                  >
                    Activate Admin
                  </Button>
                )}
                <Button
                  onClick={() => navigate("/student")}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
                >
                  Dashboard
                </Button>
                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
                >
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2"
              >
                Get Started
              </Button>
            )}
          </div>
        </div>
      </nav>

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 sm:space-y-6 text-center"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full glass-card border border-white/30 backdrop-blur-xl bg-white/10 text-white mb-4 shadow-sm text-xs sm:text-sm"
            animate={isMobile ? {} : {
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
              animate={isMobile ? {} : { rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
            </motion.div>
            <span>AI-Powered Medical Lab Technology Learning</span>
          </motion.div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight">
            Medical Lab Technician (MLT) Exam Preparation with <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 bg-clip-text text-transparent">AI-Powered Mock Tests & PYQs</span>
          </h1>

          <p className="text-base sm:text-xl text-white/90 max-w-2xl mx-auto lg:mx-0 mb-4">
            Complete Medical Lab Technician (MLT) Exam preparation for DMLT, BMLT, and Lab Technician Govt Exam with comprehensive MLT Mock Tests, Medical Lab PYQs, and AI-generated Medical Lab MCQs.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center lg:justify-start gap-6 py-4"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white">250+</div>
              <div className="text-sm text-white/70">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">5000+</div>
              <div className="text-sm text-white/70">Practice Questions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">95%</div>
              <div className="text-sm text-white/70">Success Rate</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card border-2 border-orange-400/60 backdrop-blur-xl bg-gradient-to-r from-orange-500/30 to-red-500/30 p-5 rounded-2xl shadow-2xl relative overflow-hidden"
          >
            <motion.div
              className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-bl-xl shadow-lg"
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 0 0 rgba(220, 38, 38, 0.7)",
                  "0 0 0 10px rgba(220, 38, 38, 0)",
                  "0 0 0 0 rgba(220, 38, 38, 0)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🔥 MOST POPULAR
            </motion.div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm font-bold mb-1">🔥 Limited Time Offer</p>
                <p className="text-3xl font-bold text-white drop-shadow-lg">₹399 for 4 Months</p>
                <p className="text-white/80 text-sm line-through">Regular: ₹496</p>
              </div>
              <div className="text-right">
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg mb-2 animate-pulse">
                  SAVE ₹97 • 20% OFF
                </div>
                <p className="text-white font-bold text-xs">⭐ Best Value</p>
                <p className="text-yellow-300 text-xs">Just ₹99/month</p>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-2 text-sm sm:text-base text-white/80 font-medium">
            <span>Medical Lab Mock Tests</span>
            <span>•</span>
            <span>Lab Technician PYQs</span>
            <span>•</span>
            <span>Medical Lab MCQs</span>
            <span>•</span>
            <span>Lab Technician Govt Exam Prep</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => navigate(isAuthenticated ? (user?.role === "admin" ? "/admin" : "/student") : "/auth")}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-sm sm:text-lg px-6 sm:px-8 py-2 sm:py-3 shadow-lg hover:shadow-2xl transition-shadow"
              >
                {isAuthenticated ? (user?.role === "admin" ? "Admin Panel" : "Go to Dashboard") : "Start Free Trial - 1 Test Per Type"}
                <motion.div
                  animate={isMobile ? {} : { x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="inline-block ml-2"
                >
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </motion.div>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => {
                  window.location.href = "https://drive.google.com/uc?export=download&id=1cJX9PAteyin685LEYIV_QH9ZjvqK2OlS";
                }}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm sm:text-lg px-6 sm:px-8 py-6 shadow-lg hover:shadow-2xl transition-shadow rounded-2xl w-full sm:w-auto"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <svg 
                      className="h-5 w-5 sm:h-6 sm:w-6" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                      />
                    </svg>
                    <span className="font-bold">Download MLTPrep APK</span>
                  </div>
                  <span className="text-xs text-white/90 font-normal">Android • Version 1.3</span>
                </div>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-2"
          >
            <p className="text-white/90 text-sm font-medium">
              ✓ No credit card required • ✓ Cancel anytime
            </p>
            <motion.p 
              className="text-yellow-300 text-base font-bold"
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              🛡️ 100% Money-back guarantee - Risk FREE!
            </motion.p>
            <p className="text-white/70 text-xs">
              ⏰ Offer expires in 48 hours • 🎯 Join 250+ students preparing smarter
            </p>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-10 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col items-center"
        >
          <motion.img
            src="https://harmless-tapir-303.convex.cloud/api/storage/182277e1-c82a-44a7-8408-287e25a1c39e"
            alt="RBC Mascot - Happy New Year - MLT Prep"
            loading="eager"
            fetchPriority="high"
            className="w-[70%] md:w-[40%] lg:w-[35%] h-auto object-contain"
            style={{
              filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))'
            }}
            animate={!isMobile ? {
              rotate: [0, -10, 10, -10, 10, 0],
              y: [0, -10, 0],
            } : undefined}
            transition={!isMobile ? {
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut",
            } : undefined}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 glass-card border border-purple-200/50 backdrop-blur-xl bg-white/70 px-6 py-3 rounded-2xl shadow-sm"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-2 border-white" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 border-2 border-white" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-orange-600 border-2 border-white" />
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-sm">250+ Students</p>
                <p className="text-white/70 text-xs">Preparing with us</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-4xl font-bold text-white drop-shadow-lg mb-2 sm:mb-4">Everything You Need to Succeed</h2>
          <p className="text-white/90 text-base sm:text-lg drop-shadow-md">Comprehensive preparation tools for DMLT, BMLT, and government lab technician exams</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
              className="glass-card border border-white/30 backdrop-blur-xl bg-white/20 p-4 sm:p-6 rounded-2xl hover:bg-white/30 transition-all duration-300 shadow-xl"
            >
              <motion.div 
                className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 w-fit mb-3 sm:mb-4"
                animate={isMobile ? {} : {
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
                <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </motion.div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/70 text-sm sm:text-base">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.div
            className="inline-block bg-red-600 text-white text-sm font-bold px-6 py-2 rounded-full mb-4"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          >
            ⚡ LIMITED TIME: Save ₹97 Today Only!
          </motion.div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white drop-shadow-lg mb-2 sm:mb-4">Why Upgrade to Premium?</h2>
          <p className="text-white/90 text-base sm:text-lg drop-shadow-md">See what you're missing with the free plan</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-card border border-white/30 backdrop-blur-xl bg-white/20 rounded-3xl overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-white/20">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Free Plan</h3>
                <p className="text-white/70">Limited Access</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white/90">1 Mock Test only</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white/90">1 PYQ Set only</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white/90">1 AI Practice only</span>
                </li>
                <li className="flex items-start gap-3 opacity-50">
                  <X className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white/70 line-through">Detailed Analytics</span>
                </li>
                <li className="flex items-start gap-3 opacity-50">
                  <X className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white/70 line-through">Rank & Leaderboard</span>
                </li>
                <li className="flex items-start gap-3 opacity-50">
                  <X className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white/70 line-through">Weak Area Analysis</span>
                </li>
              </ul>
            </div>

            <div className="p-6 sm:p-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <div className="text-center mb-6">
                <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-900 text-xs font-bold px-3 py-1 rounded-full mb-2">
                  MOST POPULAR
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Premium Plan</h3>
                <p className="text-white/90">Full Access - ₹399/4 months</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Unlimited Mock Tests</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">All PYQ Sets with Solutions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Unlimited AI Practice</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Detailed Performance Analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Rank & Leaderboard Access</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Topic-wise Weak Area Analysis</span>
                </li>
              </ul>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => navigate("/subscription-plans")}
                  className="w-full mt-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 text-lg shadow-2xl relative overflow-hidden"
                >
                  <motion.span
                    className="absolute inset-0 bg-white/20"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <span className="relative">🔥 Upgrade Now - Save ₹97 →</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="glass-card border border-white/20 backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 p-8 sm:p-12 rounded-3xl text-center"
        >
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">Ready to Start Your Journey?</h2>
          <p className="text-white/70 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of students preparing for DMLT, BMLT, and government lab technician exams with our comprehensive platform
          </p>
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </motion.div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-card border border-white/20 backdrop-blur-xl bg-white/10 p-6 sm:p-8 rounded-2xl"
        >
          <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-4">
            MLT Prep is India's premier exam preparation platform for medical lab technicians. We offer AI-powered practice questions, comprehensive previous year papers, and full-length mock tests designed for DMLT, BMLT, AIIMS, ESIC, RRB Paramedical, and state government exams.
          </p>
          <div className="flex flex-wrap gap-2 text-sm text-white/70">
            <span className="px-3 py-1 bg-white/10 rounded-full">MLT Exam</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">Medical Lab Technician</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">DMLT Medical Lab Course</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">BMLT Medical Lab Course</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">Lab Technician Govt Exam</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">Medical Lab PYQs</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">Medical Lab MCQs</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">MLT Mock Tests</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">Paramedical Exam</span>
          </div>
        </motion.div>
      </section>

      <footer className="relative z-10 border-t border-white/20 backdrop-blur-xl bg-transparent py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6">
            <div>
              <h3 className="text-white font-semibold mb-3">MLT Prep</h3>
              <p className="text-white/60 text-sm">
                India's leading exam preparation platform offering mock tests, MCQs, previous year questions, and comprehensive resources for DMLT, BMLT, and government lab technician exams.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Quick Links</h3>
              <div className="space-y-2">
                <button onClick={() => navigate("/contact-us")} className="block text-white/60 hover:text-white text-sm transition-colors text-left w-full">Contact Us</button>
                <button onClick={() => navigate("/terms")} className="block text-white/60 hover:text-white text-sm transition-colors text-left w-full">Terms & Conditions</button>
                <button onClick={() => navigate("/privacy")} className="block text-white/60 hover:text-white text-sm transition-colors text-left w-full">Privacy Policy</button>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Medical Lab Exam Preparation</h3>
              <div className="space-y-2">
                <button onClick={() => navigate("/mlt-exam")} className="block text-white/60 hover:text-white text-sm transition-colors text-left w-full">Medical Lab Technician Exam</button>
                <button onClick={() => navigate("/lab-technician-exam")} className="block text-white/60 hover:text-white text-sm transition-colors text-left w-full">Lab Technician Govt Exam</button>
                <button onClick={() => navigate("/dmlt-exam")} className="block text-white/60 hover:text-white text-sm transition-colors text-left w-full">DMLT Medical Lab Course</button>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <button onClick={() => navigate("/shipping-policy")} className="block text-white/60 hover:text-white text-sm transition-colors text-left w-full">Shipping Policy</button>
                <button onClick={() => navigate("/refund-policy")} className="block text-white/60 hover:text-white text-sm transition-colors text-left w-full">Refund Policy</button>
              </div>
            </div>
          </div>
          <div className="text-center text-white/60 pt-6 border-t border-white/20">
            <p className="text-sm">© 2024 MLT Prep. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
