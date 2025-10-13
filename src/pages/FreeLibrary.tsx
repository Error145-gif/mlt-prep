import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, Eye, FileText, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export default function FreeLibrary() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const studyMaterials = useQuery(api.studyMaterials.getAllStudyMaterials);
  const incrementViews = useMutation(api.studyMaterials.incrementViews);
  const subscriptionAccess = useQuery(api.student.checkSubscriptionAccess);

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
          backgroundImage: 'url(https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

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

        {!studyMaterials ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-white text-xl">Loading materials...</div>
          </div>
        ) : !hasLibraryAccess ? (
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
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="inline-block mb-6"
                >
                  <Lock className="h-24 w-24 text-white/80" />
                </motion.div>
                
                <h2 className="text-3xl font-bold text-white mb-4">
                  Library Access Locked
                </h2>
                
                <p className="text-white/90 text-lg mb-6">
                  Library access is only available with 4-month or yearly subscription plans.
                </p>
                
                <Button
                  onClick={() => navigate("/subscription")}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  View Subscription Plans
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : studyMaterials.length === 0 ? (
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
                  No Materials Yet
                </h2>
                
                <p className="text-white/90 text-lg mb-6">
                  Study materials will be added soon. Check back later!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studyMaterials.map((material, index) => (
              <motion.div
                key={material._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20 hover:bg-white/30 transition-all duration-300 h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg mb-2">
                          {material.title}
                        </CardTitle>
                        {material.category && (
                          <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white">
                            {material.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    {material.description && (
                      <p className="text-white/80 text-sm mb-4">
                        {material.description}
                      </p>
                    )}
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-white/70 text-sm">
                        <Eye className="h-4 w-4" />
                        <span>{material.views} views</span>
                      </div>
                      
                      <Button
                        onClick={() => handleDownload(material._id, material.fileUrl, material.title)}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        disabled={!hasLibraryAccess}
                      >
                        {hasLibraryAccess ? (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
                            Locked
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}