import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function MobileAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    // If already authenticated, go straight to dashboard
    if (isAuthenticated) {
      console.log("[CALLBACK] User already authenticated. Redirecting to student dashboard.");
      navigate("/student", { replace: true });
      return;
    }

    const handleCallback = async () => {
      try {
        setStatus("Processing session...");
        
        // Get session from URL params (new flow) or cookie (old flow)
        const sessionFromUrl = searchParams.get("session");
        
        if (sessionFromUrl) {
          console.log("[CALLBACK] Found session in URL:", sessionFromUrl);
          
          // Set the cookie for Convex Auth
          // Note: This is critical for the WebView to be authenticated
          document.cookie = `convex_auth_token=${sessionFromUrl}; path=/; max-age=${60 * 60 * 24 * 30}; secure; samesite=lax`;
          
          setStatus("Session set. Redirecting...");
          
          // Give it a moment to set the cookie
          setTimeout(() => {
            navigate("/student", { replace: true });
          }, 1000);
          return;
        }

        // Fallback for old flow (if any)
        setStatus("No session found. Redirecting to login...");
        setTimeout(() => {
          navigate("/auth", { replace: true });
        }, 2000);
        
      } catch (error) {
        console.error("[CALLBACK] Error:", error);
        setStatus("Error occurred. Please try again.");
        setTimeout(() => {
          navigate("/auth", { replace: true });
        }, 2000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#5B21B6] via-[#7C3AED] to-[#A855F7] text-white p-4">
      <Loader2 className="h-12 w-12 animate-spin mb-4" />
      <h2 className="text-xl font-bold mb-2">Logging you in...</h2>
      <p className="text-white/80 text-sm">{status}</p>
    </div>
  );
}