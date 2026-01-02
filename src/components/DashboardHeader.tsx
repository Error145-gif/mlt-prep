// @ts-nocheck
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CreditCard, Crown, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router";

interface DashboardHeaderProps {
  userProfile: any;
  subscriptionAccess: any;
}

export default function DashboardHeader({ userProfile, subscriptionAccess }: DashboardHeaderProps) {
  const navigate = useNavigate();
  
  const isPaid = subscriptionAccess?.hasAccess && subscriptionAccess?.planType !== "free";
  const daysRemaining = subscriptionAccess?.daysRemaining || 0;
  const expiryDate = subscriptionAccess?.endDate 
    ? new Date(subscriptionAccess.endDate).toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      }) 
    : "";

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {userProfile?.avatarUrl && (
          <Avatar className="h-16 w-16 border-2 border-white/20">
            <AvatarImage src={userProfile.avatarUrl} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl">
              {userProfile.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        )}
        <div>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">Welcome back, {userProfile?.name || "Student"}!</h1>
          <p className="text-white/90 mt-1 drop-shadow-md">Continue your MLT learning journey</p>
        </div>
      </div>

      {/* Subscription Status Box */}
      {isPaid && subscriptionAccess ? (
        <div className="bg-green-500/20 backdrop-blur-md border border-green-400/30 rounded-xl p-3 flex items-center gap-4 shadow-lg">
          <div className="bg-green-500 p-2 rounded-lg shadow-inner">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-green-100 font-bold text-sm uppercase tracking-wide">Premium Active</p>
              <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">PRO</span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-green-50">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {daysRemaining} Days Left
              </span>
              <span className="w-1 h-1 bg-green-400 rounded-full"></span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Exp: {expiryDate}
              </span>
            </div>
          </div>
        </div>
      ) : (
        subscriptionAccess && !subscriptionAccess.hasAccess && (
          <Button 
            onClick={() => navigate("/subscription-plans")}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg shadow-orange-500/20"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            View Plans
          </Button>
        )
      )}
    </div>
  );
}