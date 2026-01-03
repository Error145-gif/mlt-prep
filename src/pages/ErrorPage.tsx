import { useSearchParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const message = searchParams.get("message") || "An unexpected error occurred.";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-lg shadow-lg p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground">Authentication Error</h1>
        
        <div className="bg-muted/50 p-4 rounded-md border border-muted">
          <p className="text-muted-foreground font-mono text-sm break-words">
            {message}
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          Please try logging in again. If the problem persists, contact support.
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