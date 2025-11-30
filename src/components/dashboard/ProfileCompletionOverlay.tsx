import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { User, X } from "lucide-react";
import { useNavigate } from "react-router";

interface ProfileCompletionOverlayProps {
  profileCompletion: number;
  userProfile: any;
}

export default function ProfileCompletionOverlay({ profileCompletion, userProfile }: ProfileCompletionOverlayProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative max-w-md mx-4 p-8 rounded-2xl bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/30 shadow-2xl"
      >
        {/* Glowing particles effect */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-violet-400/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-pink-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 text-center space-y-6">
          {/* Lock Icon */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg shadow-violet-500/50"
          >
            <span className="text-4xl">🔒</span>
          </motion.div>

          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h2>
            <p className="text-white/80 text-sm">
              Unlock AI Tests, Mock Tests, and PYQ Questions by completing your profile setup.
            </p>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white/90">
              <span>Profile Completion</span>
              <span className="font-bold">{profileCompletion}%</span>
            </div>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${profileCompletion}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-full shadow-lg shadow-violet-500/50"
              />
            </div>
          </div>

          {/* Missing Fields */}
          <div className="text-left space-y-2 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-2">Required Fields:</p>
            {!userProfile?.name && (
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <X className="h-4 w-4 text-red-400" />
                <span>Full Name</span>
              </div>
            )}
            {!userProfile?.avatarUrl && (
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <X className="h-4 w-4 text-red-400" />
                <span>Profile Avatar</span>
              </div>
            )}
            {!userProfile?.examPreparation && (
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <X className="h-4 w-4 text-red-400" />
                <span>Exam Preparation</span>
              </div>
            )}
            {!userProfile?.state && (
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <X className="h-4 w-4 text-red-400" />
                <span>State</span>
              </div>
            )}
          </div>

          {/* Complete Profile Button */}
          <Button
            onClick={() => navigate("/profile")}
            className="w-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-6 rounded-xl shadow-lg shadow-violet-500/50 hover:shadow-violet-500/70 transition-all duration-300"
          >
            <User className="h-5 w-5 mr-2" />
            Complete Profile Now
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
