import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { useNavigate } from "react-router";

export default function WeeklyTestCard() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="glass-card border-white/30 backdrop-blur-xl bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/50">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            Weekly Free Mock Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-white/90">
              🎯 100 Lab Technician questions • Available every Sunday • Free for all users
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => navigate("/weekly-test")}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-yellow-500/50"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Play Sunday Mock
              </Button>
              <Button
                onClick={() => navigate("/weekly-leaderboard")}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                View Leaderboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
