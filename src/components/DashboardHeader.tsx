import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CreditCard, User } from "lucide-react";
import { useNavigate } from "react-router";

interface DashboardHeaderProps {
  userProfile: any;
  subscriptionAccess: any;
}

export default function DashboardHeader({ userProfile, subscriptionAccess }: DashboardHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
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
      {subscriptionAccess && !subscriptionAccess.hasAccess && (
        <Button 
          onClick={() => navigate("/subscription")}
          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          View Plans
        </Button>
      )}
    </div>
  );
}
