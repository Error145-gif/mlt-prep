import { useSearchParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const message = searchParams.get("message") || "An unknown error occurred";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Authentication Error</h1>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {message}
        </div>
        <p className="text-muted-foreground">
          We encountered an issue while trying to sign you in.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate("/auth")} variant="default">
            Back to Login
          </Button>
          <Button onClick={() => navigate("/")} variant="outline">
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
