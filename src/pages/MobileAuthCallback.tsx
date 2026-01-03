import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useConvexAuth } from "convex/react";
import { useAuthToken } from "@convex-dev/auth/react";
import { Loader2, Smartphone, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define the interface for the Android Javascript Bridge
declare global {
  interface Window {
    Android?: {
      onAuthSuccess: (token: string) => void;
    };
  }
}

/**
 * MobileAuthCallback Page (The Bouncer)
 * 
 * This page acts as a traffic controller:
 * 1. It receives the user after Google Login.
 * 2. It retrieves the session token.
 * 3. It IMMEDIATELY attempts to open the Android App via deep link.
 * 4. If the app doesn't open within a few seconds (meaning the user is on Desktop/Web),
 *    it falls back to the Web Dashboard.
 */
export default function MobileAuthCallback() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const token = useAuthToken();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Initializing...");
  const [deepLinkUrl, setDeepLinkUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthSuccess = async () => {
      if (isAuthenticated && token) {
        setStatus("Authenticated! Ready to open app...");
        console.log("Session token retrieved. Starting Bouncer flow...");
        console.log("[MOBILE_AUTH_CALLBACK] User authenticated, token available");

        // 1. Pass token to Android via Javascript Interface (Preferred for WebView)
        if (window.Android && window.Android.onAuthSuccess) {
          console.log("Calling window.Android.onAuthSuccess");
          window.Android.onAuthSuccess(token);
          // We can stop here if we are sure it's the WebView, but the deep link is a safe backup
        }

        // 2. THE BOUNCER LOGIC
        // Always try to open the deep link.
        // If the app is installed, it will intercept this.
        const deepLink = `mltprep://auth-success?token=${encodeURIComponent(token)}`;
        setDeepLinkUrl(deepLink);
        console.log("Attempting deep link:", deepLink);
        
        // Attempt automatic redirect (might be blocked by Chrome without user gesture)
        window.location.href = deepLink;

        // 3. Fallback to Web Dashboard
        // If the browser is still open after 4 seconds, it means the deep link didn't take over.
        // (User is likely on Desktop or Mobile Browser, not the App)
        const fallbackTimer = setTimeout(() => {
          console.log("Deep link didn't open app. Redirecting to Web Dashboard...");
          // Only redirect if we haven't manually cancelled or if the user hasn't interacted
          navigate("/student", { replace: true });
        }, 4000);

        return () => clearTimeout(fallbackTimer);
      } else if (isAuthenticated && !token) {
        setStatus("Waiting for token...");
        console.log("[MOBILE_AUTH_CALLBACK] User authenticated but token not yet available");
      } else if (!isAuthenticated && !isLoading) {
        console.log("[MOBILE_AUTH_CALLBACK] User not authenticated, checking for redirect");
      }
    };

    handleAuthSuccess();
  }, [isAuthenticated, token, navigate, isLoading]);

  useEffect(() => {
    const code = searchParams.get("code");
    
    if (!isLoading && !isAuthenticated) {
      if (!code) {
        // If no code and not authenticated, this might be a direct visit or error
        // Check if we just need to go to dashboard (already logged in but state not updated yet?)
        // Or send back to login
        setStatus("Checking session...");
        setTimeout(() => {
             if (!isAuthenticated) navigate("/auth");
        }, 2000);
      } else {
        setStatus("Verifying credentials...");
        // ConvexAuthProvider automatically handles the code exchange
      }
    }
  }, [isAuthenticated, isLoading, navigate, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#5B21B6] via-[#7C3AED] to-[#A855F7] text-white p-4">
      <div className="text-center space-y-6 max-w-md w-full bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-xl">
        {isAuthenticated ? (
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          <Loader2 className="w-16 h-16 animate-spin mx-auto text-white/80" />
        )}
        
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {isAuthenticated ? "Login Successful!" : "Logging In"}
          </h2>
          <p className="text-white/80 text-lg font-light mb-6">{status}</p>
          
          {isAuthenticated && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <p className="text-white/90 text-lg font-medium">
                 Tap the button below to open the app
               </p>
               
               {deepLinkUrl && (
                 <Button 
                   onClick={() => window.location.href = deepLinkUrl}
                   className="w-full py-8 text-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl transform transition hover:scale-105 rounded-xl border-2 border-blue-400/50"
                 >
                   <Smartphone className="w-8 h-8 mr-3" />
                   CLICK TO OPEN APP
                 </Button>
               )}

               <div className="flex flex-col items-center gap-2">
                 <p className="text-white/60 text-sm">
                   Not opening?
                 </p>
                 <Button 
                   variant="ghost" 
                   onClick={() => navigate("/student")}
                   className="text-white/70 hover:text-white hover:bg-white/10"
                 >
                   <LayoutDashboard className="w-4 h-4 mr-2" />
                   Continue to Web Dashboard
                 </Button>
               </div>
               
               <div className="pt-4 border-t border-white/10">
                 <p className="text-xs text-white/40 break-all font-mono">
                   {deepLinkUrl || "Generating link..."}
                 </p>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}