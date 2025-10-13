import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useSearchParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, MapPin, BookOpen, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function PaymentSummary() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userProfile = useQuery(api.users.getUserProfile);

  const planName = searchParams.get("name");
  const basePrice = parseFloat(searchParams.get("price") || "0");
  const duration = parseInt(searchParams.get("duration") || "0");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!planName || !basePrice) {
    navigate("/subscription");
    return null;
  }

  const isProfileComplete = userProfile.name && userProfile.state && userProfile.examPreparation;
  
  if (!isProfileComplete) {
    return (
      <div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10 p-8">
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <User className="h-10 w-10 text-yellow-400" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Complete Your Profile First</h2>
                  <p className="text-white/70">
                    Please complete your profile before proceeding with subscription.
                  </p>
                </div>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${userProfile.name ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      {userProfile.name ? <CheckCircle className="h-4 w-4 text-green-400" /> : <span className="text-red-400">✕</span>}
                    </div>
                    <span className="text-white">Full Name</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${userProfile.state ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      {userProfile.state ? <CheckCircle className="h-4 w-4 text-green-400" /> : <span className="text-red-400">✕</span>}
                    </div>
                    <span className="text-white">State</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${userProfile.examPreparation ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      {userProfile.examPreparation ? <CheckCircle className="h-4 w-4 text-green-400" /> : <span className="text-red-400">✕</span>}
                    </div>
                    <span className="text-white">Exam Preparation</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 pt-4">
                  <Button
                    onClick={() => navigate("/profile")}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    Complete Profile Now
                  </Button>
                  <Button
                    onClick={() => navigate("/subscription")}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    Back to Plans
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white">Subscription Summary</h1>
          <p className="text-white/70 mt-1">Review your subscription details</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                Payment Processing Temporarily Unavailable
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 bg-white/5 p-6 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Selected Plan</span>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    {planName}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Duration</span>
                  <span className="text-white font-medium">{duration} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Amount</span>
                  <span className="text-white font-medium">₹{basePrice}</span>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-200 text-sm">
                  Payment processing is currently being set up. Please contact support for subscription activation.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => navigate("/contact-us")}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Contact Support
                </Button>
                <Button
                  onClick={() => navigate("/subscription")}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Back to Plans
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}