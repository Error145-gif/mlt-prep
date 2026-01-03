import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useConvexAuth } from "convex/react";
import { useAuthToken } from "@convex-dev/auth/react";
import { Loader2, Smartphone, LayoutDashboard, Copy, ExternalLink, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
 * 3. It IMMEDIATELY shows the "CLICK TO OPEN APP" button.
 * 4. When clicked, it attempts to open the Android App via deep link.
 * 5. If the app doesn't open, user can manually navigate to web dashboard.
 */
export default function MobileAuthCallback() {
  const { isAuthenticated } = useConvexAuth();
  const token = useAuthToken();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Ready to open app...");
  const [deepLinkUrl, setDeepLinkUrl] = useState<string>("mltprep://auth-success");
  const [intentUrl, setIntentUrl] = useState<string>("");

  // Initialize URLs when token is available
  useEffect(() => {
    if (isAuthenticated && token) {
       // Standard Deep Link
       const deepLink = `mltprep://auth-success?token=${encodeURIComponent(token)}`;
       setDeepLinkUrl(deepLink);

       // Android Intent URL (More reliable for Android Chrome)
       // format: intent://<path>#Intent;scheme=<scheme>;package=<package_name>;end;
       const iUrl = `intent://auth-success?token=${encodeURIComponent(token)}#Intent;scheme=mltprep;package=com.mltprep.app;end;`;
       setIntentUrl(iUrl);
       
       setStatus("Authenticated! Opening app...");
       console.log("[MOBILE_AUTH] Token retrieved. URLs prepared.");
    } else if (isAuthenticated && !token) {
       setStatus("Finalizing authentication...");
    }
  }, [isAuthenticated, token]);

  // Auto-redirect logic
  useEffect(() => {
    if (isAuthenticated && token && (deepLinkUrl || intentUrl)) {
      const isAndroid = /Android/i.test(navigator.userAgent);
      console.log(`[MOBILE_AUTH] Auto-redirect starting. Device: ${isAndroid ? 'Android' : 'Other'}`);

      // Increased delay slightly to ensure browser is ready
      const timer = setTimeout(() => {
        if (isAndroid && intentUrl) {
          console.log("[MOBILE_AUTH] Trying Intent URL:", intentUrl);
          window.location.href = intentUrl;
          
          // Fallback to custom scheme after a short delay if intent fails (though we can't easily detect failure)
          setTimeout(() => {
             console.log("[MOBILE_AUTH] Intent fallback -> Custom Scheme");
             window.location.href = deepLinkUrl;
          }, 2500);
        } else {
          console.log("[MOBILE_AUTH] Trying Custom Scheme:", deepLinkUrl);
          window.location.href = deepLinkUrl;
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, token, deepLinkUrl, intentUrl]);

  // Handle WebView Bridge
  useEffect(() => {
    if (isAuthenticated && token && window.Android && window.Android.onAuthSuccess) {
      console.log("[MOBILE_AUTH] WebView Bridge detected. Calling onAuthSuccess.");
      setStatus("Returning to app...");
      window.Android.onAuthSuccess(token);
    }
  }, [isAuthenticated, token]);

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      toast.success("Token copied to clipboard");
    }
  };

  const handleWebFallback = () => {
    // Clear mobile flag so they don't get redirected back here
    sessionStorage.removeItem("is_mobile");
    localStorage.removeItem("is_mobile");
    navigate("/student");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#5B21B6] via-[#7C3AED] to-[#A855F7] text-white p-4">
      <div className="text-center space-y-6 max-w-md w-full bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-xl">
        {/* Show success checkmark if authenticated, otherwise show spinner */}
        {isAuthenticated ? (
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30 animate-in zoom-in duration-300">
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
          <p className="text-white/80 text-lg font-light mb-6 animate-pulse">{status}</p>
          
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="text-white/90 text-lg font-medium">
              Tap the button below to open the app
            </p>
            
            <Button 
              onClick={() => window.location.href = deepLinkUrl}
              className="w-full py-8 text-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl transform transition hover:scale-105 rounded-xl border-2 border-blue-400/50"
            >
              <Smartphone className="w-8 h-8 mr-3" />
              OPEN APP
            </Button>

            {intentUrl && (
              <Button 
                onClick={() => window.location.href = intentUrl}
                variant="outline"
                className="w-full py-6 text-lg font-semibold bg-white/10 hover:bg-white/20 text-white border-white/30"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                OPEN APP (ALTERNATIVE)
              </Button>
            )}

            <div className="pt-4">
              <Accordion type="single" collapsible className="w-full border-none">
                <AccordionItem value="troubleshoot" className="border-none">
                  <AccordionTrigger className="text-white/60 hover:text-white py-2 justify-center text-sm">
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" />
                      Having trouble?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div className="bg-black/20 p-4 rounded-xl space-y-3">
                      <p className="text-xs text-white/70 text-center">
                        If the app doesn't open automatically, try copying the token and pasting it in the app manually (if supported), or continue to the web dashboard.
                      </p>
                      
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleCopyToken}
                        className="w-full bg-white/20 hover:bg-white/30 text-white border-none"
                      >
                        <Copy className="w-3 h-3 mr-2" />
                        Copy Auth Token
                      </Button>

                      <Button 
                        variant="ghost" 
                        onClick={handleWebFallback}
                        className="w-full text-white/70 hover:text-white hover:bg-white/10"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Continue to Web Dashboard
                      </Button>
                    </div>
                    
                    <div className="text-[10px] text-white/20 break-all font-mono text-center">
                      {deepLinkUrl}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}