import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, Brain, Lock, CheckCircle, Star } from "lucide-react";
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";

interface SimplePracticeAreaProps {
  subscriptionAccess?: any;
}

export default function SimplePracticeArea({ subscriptionAccess }: SimplePracticeAreaProps) {
  const navigate = useNavigate();

  const isPremium = subscriptionAccess?.hasAccess;
  const freeTrialRemaining = subscriptionAccess?.freeTrialRemaining;

  const getStatus = (type: 'mock' | 'pyq' | 'ai') => {
    if (isPremium) return { status: 'unlocked', label: 'Premium Access', icon: Star, color: 'bg-yellow-500' };
    
    // If data is loading or undefined, assume unlocked for safety or loading state
    if (!freeTrialRemaining) return { status: 'loading', label: 'Loading...', icon: null, color: 'bg-gray-500' };

    const remaining = freeTrialRemaining[type];
    if (remaining > 0) return { status: 'free', label: '1 Free Test Available', icon: CheckCircle, color: 'bg-green-500' };
    return { status: 'locked', label: 'Locked - Upgrade', icon: Lock, color: 'bg-red-500' };
  };

  const practiceOptions = [
    {
      id: 'mock',
      icon: FileText,
      title: "Mock Tests",
      description: "Full-length exam pattern tests",
      color: "from-blue-500 to-blue-600",
      path: "/tests/mock"
    },
    {
      id: 'pyq',
      icon: BookOpen,
      title: "PYQ Sets",
      description: "Previous year questions by topic",
      color: "from-green-500 to-green-600",
      path: "/tests/pyq"
    },
    {
      id: 'ai',
      icon: Brain,
      title: "AI Questions",
      description: "Smart daily practice questions",
      color: "from-purple-500 to-purple-600",
      path: "/tests/ai"
    }
  ];

  const handleNavigation = (path: string, status: string) => {
    if (status === 'locked') {
      navigate("/subscription-plans");
    } else {
      navigate(path);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Practice Area</span>
            {!isPremium && (
              <Badge variant="outline" className="text-white border-white/40 bg-white/10">
                Free Trial Mode
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {practiceOptions.map((option, index) => {
              const { status, label, icon: StatusIcon, color: statusColor } = getStatus(option.id as 'mock' | 'pyq' | 'ai');
              const isLocked = status === 'locked';

              return (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => handleNavigation(option.path, status)}
                  className={`relative cursor-pointer p-6 rounded-xl border transition-all duration-300 overflow-hidden group ${
                    isLocked 
                      ? "bg-gray-900/40 border-red-500/30 hover:border-red-500/60" 
                      : "bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/30"
                  }`}
                >
                  {/* Status Badge */}
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1 ${statusColor} shadow-lg z-10`}>
                    {StatusIcon && <StatusIcon className="h-3 w-3" />}
                    {label}
                  </div>

                  {/* Locked Overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-red-600 text-white px-4 py-2 rounded-full font-bold shadow-xl transform scale-110">
                        Click to Unlock
                      </div>
                    </div>
                  )}

                  <div className={`p-3 rounded-lg bg-gradient-to-br ${option.color} shadow-lg mb-3 inline-block relative z-10 ${isLocked ? 'grayscale opacity-70' : ''}`}>
                    <option.icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <h3 className={`text-white font-semibold text-lg mb-2 relative z-10 ${isLocked ? 'text-white/70' : ''}`}>
                    {option.title}
                  </h3>
                  <p className={`text-white/70 text-sm relative z-10 ${isLocked ? 'text-white/50' : ''}`}>
                    {option.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}