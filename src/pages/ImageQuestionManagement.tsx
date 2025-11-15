import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import ImageQuestionUpload from "@/components/ImageQuestionUpload";

export default function ImageQuestionManagement() {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/student" />;
  }

  return (
    <div className="min-h-screen p-6 relative">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500" />
      
      {/* Animated orbs */}
      <motion.div
        className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="fixed top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
          delay: 1,
        }}
      />

      {/* Lab background image */}
      <div 
        className="fixed inset-0 opacity-10"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6 relative z-10"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Image-Based Questions</h1>
          <p className="text-white/70 mt-1">Upload questions with images for AI and Mock tests</p>
        </div>

        <ImageQuestionUpload />
      </motion.div>
    </div>
  );
}
