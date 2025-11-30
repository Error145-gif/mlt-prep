import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestResultHeaderProps {
  user: any;
  userProfile: any;
  testTypeInfo: {
    name: string;
    icon: string;
    color: string;
  };
  session: any;
  timeSpent: number;
  totalQuestions: number;
}

export default function TestResultHeader({ user, userProfile, testTypeInfo, session, timeSpent, totalQuestions }: TestResultHeaderProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`bg-gradient-to-r ${testTypeInfo.color} text-white px-6 py-6 shadow-lg`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            {userProfile?.avatarUrl ? (
              <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                <AvatarImage src={userProfile.avatarUrl} />
                <AvatarFallback className="bg-white text-blue-600 font-bold">
                  {userProfile.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                <AvatarFallback className="bg-white text-blue-600 font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            )}
            <div>
              <p className="text-2xl font-bold">{user?.name || "Student"}</p>
              <p className="text-sm opacity-90">Test Results</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="opacity-80">Test Type</p>
            <p className="font-bold text-lg">{testTypeInfo.icon} {testTypeInfo.name}</p>
          </div>
          <div>
            <p className="opacity-80">Attempt Date</p>
            <p className="font-semibold">{formatDate(session._creationTime)}</p>
          </div>
          <div>
            <p className="opacity-80">Time Taken</p>
            <p className="font-semibold">⏱️ {formatTime(timeSpent)}</p>
          </div>
          <div>
            <p className="opacity-80">Total Questions</p>
            <p className="font-semibold">🧩 {totalQuestions}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
