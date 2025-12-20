import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, Brain } from "lucide-react";
import { useNavigate } from "react-router";

export default function SimplePracticeArea() {
  const navigate = useNavigate();

  const practiceOptions = [
    {
      icon: FileText,
      title: "Mock Tests",
      description: "Full-length exam pattern tests",
      color: "from-blue-500 to-blue-600",
      path: "/tests/mock"
    },
    {
      icon: BookOpen,
      title: "PYQ Sets",
      description: "Previous year questions by topic",
      color: "from-green-500 to-green-600",
      path: "/tests/pyq"
    },
    {
      icon: Brain,
      title: "AI Questions",
      description: "Smart daily practice questions",
      color: "from-purple-500 to-purple-600",
      path: "/tests/ai"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/10">
        <CardHeader>
          <CardTitle className="text-white">Practice Area</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {practiceOptions.map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate(option.path)}
                className="cursor-pointer p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300"
              >
                <div className={`p-3 rounded-lg bg-gradient-to-br ${option.color} shadow-lg mb-3 inline-block`}>
                  <option.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{option.title}</h3>
                <p className="text-white/70 text-sm">{option.description}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
