import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, Brain } from "lucide-react";
import { useNavigate } from "react-router";

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
        <Card className="glass-card border-white/30 backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate("/tests/mock")}>
          <CardHeader>
            <FileText className="h-8 w-8 text-blue-400 mb-2" />
            <CardTitle className="text-white">Mock Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/90">Practice with comprehensive mock tests</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
        <Card className="glass-card border-white/30 backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-teal-600/20 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate("/tests/pyq")}>
          <CardHeader>
            <BookOpen className="h-8 w-8 text-green-400 mb-2" />
            <CardTitle className="text-white">PYQ Sets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/90">Solve previous year questions</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}>
        <Card className="glass-card border-white/30 backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate("/tests/ai")}>
          <CardHeader>
            <Brain className="h-8 w-8 text-purple-400 mb-2" />
            <CardTitle className="text-white">AI Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/90">Practice with AI-generated questions</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
