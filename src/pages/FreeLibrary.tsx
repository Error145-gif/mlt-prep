import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, Eye, FileText, Lock, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import StudentNav from "@/components/StudentNav";

export default function FreeLibrary() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const studyMaterials = useQuery(api.studyMaterials.getAllStudyMaterials);
  const incrementViews = useMutation(api.studyMaterials.incrementViews);
  const subscriptionAccess = useQuery(api.student.checkSubscriptionAccess);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Check if user has 4-month or yearly subscription
  const hasLibraryAccess = subscriptionAccess?.subscription && 
    subscriptionAccess.isPaid && 
    (subscriptionAccess.subscription.planName === "4 Months Plan" || 
     subscriptionAccess.subscription.planName === "Yearly Plan");

  const handleDownload = async (materialId: any, fileUrl: string | null, title: string) => {
    if (!hasLibraryAccess) {
      toast.error("Library access is only available with 4-month or yearly subscription!");
      setTimeout(() => navigate("/subscription"), 1500);
      return;
    }

    if (!fileUrl) {
      toast.error("File not available");
      return;
    }

    try {
      // Increment view count
      await incrementViews({ materialId });

      // Open file in new tab for download
      window.open(fileUrl, "_blank");
      toast.success("Opening file...");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to open file");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
      <StudentNav />
      
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-pink-400/25 rounded-full blur-3xl" />
      </div>

      {/* Lab Background Image */}
      <div 
        className="fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&q=80&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />

      {/* Hamburger Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-16 right-0 z-40 md:hidden bg-white/10 backdrop-blur-xl border-l border-white/20 w-64 h-screen p-4 space-y-3"
          >
            <Button
              onClick={() => {
                navigate("/student");
                setIsMenuOpen(false);
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Dashboard
            </Button>
            <Button
              onClick={() => {
                navigate("/tests/mock");
                setIsMenuOpen(false);
              }}
              variant="outline"
              className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              Mock Tests
            </Button>
            <Button
              onClick={() => {
                navigate("/tests/pyq");
                setIsMenuOpen(false);
              }}
              variant="outline"
              className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              PYQ Sets
            </Button>
            <Button
              onClick={() => {
                navigate("/tests/ai");
                setIsMenuOpen(false);
              }}
              variant="outline"
              className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              AI Questions
            </Button>
            <Button
              onClick={() => {
                navigate("/profile");
                setIsMenuOpen(false);
              }}
              variant="outline"
              className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              Profile
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Library
          </h1>
          <p className="text-white/90 text-lg drop-shadow-md">
            Study Material & Handwritten Notes
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
            <CardContent className="p-12 text-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-block mb-6"
              >
                <BookOpen className="h-24 w-24 text-white/80" />
              </motion.div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                Coming Soon...
              </h2>
              
              <p className="text-white/90 text-lg mb-6">
                Study materials and handwritten notes will be available soon. Stay tuned!
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}