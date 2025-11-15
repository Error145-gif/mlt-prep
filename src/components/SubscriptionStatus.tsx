// @ts-nocheck
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";

interface SubscriptionStatusProps {
  subscription: any;
}

export default function SubscriptionStatus({ subscription }: SubscriptionStatusProps) {
  const formatExpiryDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysRemaining = (endDate: number) => {
    const now = Date.now();
    const diff = endDate - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card border border-green-500/50 backdrop-blur-xl bg-green-500/10 p-4 rounded-xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-teal-600">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-white font-medium text-lg">Active Subscription</p>
            <p className="text-white/90 text-sm">
              {subscription.planName}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white/80 text-sm">Expires on</p>
          <p className="text-white font-bold text-lg">
            {formatExpiryDate(subscription.endDate)}
          </p>
          <Badge className="mt-1 bg-green-500/20 text-green-300 border-green-500/30">
            {getDaysRemaining(subscription.endDate)} days left
          </Badge>
        </div>
      </div>
    </motion.div>
  );
}