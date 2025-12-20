import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface RecentActivityProps {
  isFreeTrialUser?: boolean;
}

export default function RecentActivity({ isFreeTrialUser = false }: RecentActivityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Your Recent Tests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-white/70 text-center py-8">
            <p className="mb-2">No tests attempted yet</p>
            <p className="text-sm">Start your first test to see your progress here</p>
          </div>
          {isFreeTrialUser && (
            <div className="border-t border-white/20 pt-4 mt-4">
              <p className="text-white/80 text-sm text-center">
                Upgrade to see detailed analysis for each test.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
