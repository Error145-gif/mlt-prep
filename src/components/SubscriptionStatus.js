"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SubscriptionStatus;
var framer_motion_1 = require("framer-motion");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
function SubscriptionStatus(_a) {
    var subscription = _a.subscription;
    var formatExpiryDate = function (timestamp) {
        return new Date(timestamp).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    var getDaysRemaining = function (endDate) {
        var now = Date.now();
        var diff = endDate - now;
        var days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    };
    return (<framer_motion_1.motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card border border-green-500/50 backdrop-blur-xl bg-green-500/10 p-4 rounded-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-teal-600">
            <lucide_react_1.CreditCard className="h-6 w-6 text-white"/>
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
          <badge_1.Badge className="mt-1 bg-green-500/20 text-green-300 border-green-500/30">
            {getDaysRemaining(subscription.endDate)} days left
          </badge_1.Badge>
        </div>
      </div>
    </framer_motion_1.motion.div>);
}
