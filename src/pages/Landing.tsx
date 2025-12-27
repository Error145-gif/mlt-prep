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
    // Set meta tags for SEO
    document.title = "MLT Prep - AI-Powered Medical Lab Technology Learning";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Master MLT with AI-powered questions, previous year papers, mock tests, and progress tracking. 7-day free trial for medical lab technology students.");
    }
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute("content", "MLT, Medical Lab Technology, ESIC MLT, mock tests, PYQ, AI questions, exam preparation");
    }

    // Add canonical tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', window.location.href);

    // Add JSON-LD schema for homepage only
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

    // Cleanup function
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

  // Auto-activate admin for authorized emails - optimized to run only once
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
  }, [isAuthenticated, user?._id, user?.role]); // Only run when these specific values change

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
      {/* Lab Background Image - Lighter - Optimized for mobile */}
      <div 
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: isMobile 
            ? 'url(https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&q=50&auto=format&fit=crop&fm=webp)' 
            : 'url(https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&q=60&auto=format&fit=crop&fm=webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: isMobile ? 'scroll' : 'fixed',
          willChange: 'transform'
        }}
      />

      {/* Animated Background Gradients - Vibrant Purple/Blue Theme */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-400/30 rounded-full blur-xl md:blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-purple-500/30 rounded-full blur-xl md:blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-pink-400/25 rounded-full blur-xl md:blur-3xl" />
        <div className="absolute top-1/4 right-1/3 w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-cyan-400/25 rounded-full blur-xl md:blur-3xl" />
        
        {/* Floating Medical Icons - Hidden on mobile for performance */}
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

      {/* Navigation */}
      <nav className="glass-card border-b border-white/20 backdrop-blur-xl bg-white/10 sticky top-0 z-50 shadow-lg">
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
            <span className="text-lg sm:text-2xl font-bold text-white drop-shadow-lg">MLT Prep</span>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center gap-2 sm:gap-4">
            {isAuthenticated ? (
              <>
                {user?.role === "admin" && (
                  <Button
                    onClick={() => navigate("/admin")}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
                  >
                    Admin
                  </Button>
                )}
                {user?.role !== "admin" && (user?.email === "ak6722909@gmail.com" || user?.email === "historyindia145@gmail.com") && (
                  <Button
                    onClick={handleMakeAdmin}
                    className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
                  >
                    Activate Admin
                  </Button>
                )}
                <Button
                  onClick={() => navigate("/student")}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
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
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2"
              >
                Get Started
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4 sm:space-y-6 text-center lg:text-left"
          >
          <motion.div 
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full glass-card border border-white/30 backdrop-blur-xl bg-white/20 text-white mb-4 shadow-md text-xs sm:text-sm"
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
          
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight drop-shadow-2xl">
            Medical Lab Technician (MLT) Exam Preparation with <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">AI-Powered Mock Tests & PYQs</span>
          </h1>
          
          <p className="text-base sm:text-xl text-white/90 max-w-2xl mx-auto lg:mx-0 drop-shadow-lg mb-4">
            Complete Medical Lab Technician (MLT) Exam preparation for DMLT, BMLT, and Lab Technician Govt Exam with comprehensive MLT Mock Tests, Medical Lab PYQs, and AI-generated Medical Lab MCQs.
          </p>

          {/* NEW: Social Proof Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center lg:justify-start gap-6 py-4"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white">223+</div>
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

          {/* NEW: Pricing Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card border border-yellow-400/50 backdrop-blur-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-sm font-medium">🎉 Limited Time Offer</p>
                <p className="text-2xl font-bold text-white">₹399 for 4 Months</p>
                <p className="text-white/70 text-xs line-through">Regular: ₹496</p>
              </div>
              <div className="text-right">
                <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Save ₹97
                </div>
                <p className="text-white/80 text-xs mt-1">Most Popular</p>
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
          
            <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-4">
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
            </div>

            {/* NEW: Trust Badge */}
            <p className="text-white/70 text-sm text-center lg:text-left">
              ✓ No credit card required • ✓ Cancel anytime • ✓ 100% Money-back guarantee
            </p>
          </motion.div>

          {/* Right side - Professional MLT Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30 backdrop-blur-xl"
              >
                <img
                  src="https://harmless-tapir-303.convex.cloud/api/storage/f1e8fe00-6b4f-4f35-8a35-c8d49f523e0e"
                  alt="Professional Medical Lab Technicians"
                  loading="eager"
                  fetchPriority="high"
                  className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] object-cover"
                />
                {/* Overlay gradient for better text visibility if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none" />
              </motion.div>
              
              {/* Trust Badge Overlay */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -bottom-4 -right-4 glass-card border border-white/30 backdrop-blur-xl bg-white/20 px-4 py-3 rounded-2xl shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-2 border-white" />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 border-2 border-white" />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-orange-600 border-2 border-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-sm">223+ Students</p>
                    <p className="text-white/70 text-xs">Preparing with us</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* NEW: Free vs Premium Comparison Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
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
            {/* Free Plan */}
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

            {/* Premium Plan */}
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
              <Button
                onClick={() => navigate("/subscription-plans")}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
              >
                Upgrade Now - Save ₹97 →
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
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

      {/* SEO Block */}
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

      {/* Footer */}
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
              <h3 className="text-white font-semibold mb-3">Policies</h3>
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