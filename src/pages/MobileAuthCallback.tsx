import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useConvexAuth } from "convex/react";
import { useAuthToken } from "@convex-dev/auth/react";
import { Loader2, Smartphone, LayoutDashboard, Copy, ExternalLink, HelpCircle, CheckCircle, AlertTriangle } from "lucide-react";
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
      onAuthSuccess?: (token: string) => void;
    };
  }
}

/**
 * MobileAuthCallback Page (The Bouncer)
 * 
 * This page acts as a traffic controller:
 * 1. It receives the user after Google Login.
 * 2. It retrieves the session token.
 * 3. It IMMEDIATELY attempts to open the app via multiple methods.
 * 4. Shows a prominent button if automatic redirect fails.
 */
export default function MobileAuthCallback() {
  const { isAuthenticated } = useConvexAuth();
  const token = useAuthToken();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Checking authentication...");
  const [showOpenButton, setShowOpenButton] = useState(false);
  const [deepLinkUrl, setDeepLinkUrl] = useState<string>("mltprep://auth-success");
  const [intentUrl, setIntentUrl] = useState<string>("");
  const [autoRedirectAttempted, setAutoRedirectAttempted] = useState(false);

  // Initialize URLs when token is available
  useEffect(() => {
    if (isAuthenticated && token) {
       // Get package name from storage or default
       const packageName = localStorage.getItem("mobile_package_name") || "com.mltprep.app";
       
       // Standard Deep Link
       const deepLink = `mltprep://auth-success?token=${encodeURIComponent(token)}`;
       setDeepLinkUrl(deepLink);

       // Android Intent URL (More reliable for Android Chrome)
       // Format: intent://<host>#Intent;scheme=<scheme>;package=<package_name>;S.<extra_name>=<extra_value>;end
       const iUrl = `intent://auth-success?token=${encodeURIComponent(token)}#Intent;scheme=mltprep;package=${packageName};S.token=${encodeURIComponent(token)};end;`;
       setIntentUrl(iUrl);
       
       setStatus("Authentication successful!");
       setShowOpenButton(true);
       console.log(`[MOBILE_AUTH] ✅ Token retrieved. Package: ${packageName}`);
    } else if (isAuthenticated && !token) {
       setStatus("Finalizing authentication...");
    }
  }, [isAuthenticated, token]);

  // AGGRESSIVE Auto-redirect logic - try multiple methods immediately
  useEffect(() => {
    if (isAuthenticated && token && (deepLinkUrl || intentUrl) && !autoRedirectAttempted) {
      const isAndroid = /Android/i.test(navigator.userAgent);
      console.log(`[MOBILE_AUTH] 🚀 Auto-redirect starting. Device: ${isAndroid ? 'Android' : 'Other'}`);
      
      setAutoRedirectAttempted(true);
      setStatus("Opening app...");

      // Try WebView Bridge first (most reliable if in WebView)
      if (window.Android && window.Android.onAuthSuccess) {
        console.log("[MOBILE_AUTH] 📱 WebView Bridge detected. Calling onAuthSuccess.");
        try {
          window.Android.onAuthSuccess(token);
          setStatus("Returning to app...");
          return; // Exit early if WebView bridge works
        } catch (e) {
          console.error("[MOBILE_AUTH] WebView bridge failed:", e);
        }
      }

      // Method 1: Immediate Intent URL (for Android Chrome)
      if (isAndroid && intentUrl) {
        console.log("[MOBILE_AUTH] Trying Intent URL immediately:", intentUrl);
        window.location.href = intentUrl;
      }

      // Method 2: Custom scheme after short delay (Fallback)
      setTimeout(() => {
        console.log("[MOBILE_AUTH] Trying Custom Scheme:", deepLinkUrl);
        window.location.href = deepLinkUrl;
      }, 1000);

      // Show manual button after all auto attempts
      setTimeout(() => {
        setStatus("Tap the button below to open the app");
        setShowOpenButton(true);
      }, 2500);
    }
  }, [isAuthenticated, token, deepLinkUrl, intentUrl, autoRedirectAttempted]);

  const handleOpenApp = () => {
    console.log("[MOBILE_AUTH] 👆 User clicked OPEN APP button");
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    // Try all methods when user clicks
    if (isAndroid && intentUrl) {
      console.log("[MOBILE_AUTH] Opening via Intent URL");
      window.location.href = intentUrl;
      
      // Fallback to deep link if intent fails (e.g. app not installed or package name wrong)
      setTimeout(() => {
        window.location.href = deepLinkUrl;
      }, 500);
    } else {
      console.log("[MOBILE_AUTH] Opening via Custom Scheme");
      window.location.href = deepLinkUrl;
    }
    
    toast.success("Opening app...");
  };

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      toast.success("Token copied to clipboard");
    }
  };

  const handleWebFallback = () => {
    // Clear mobile flag so they don't get redirected back here
    localStorage.removeItem("is_mobile");
    sessionStorage.removeItem("is_mobile");
    navigate("/student");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#5B21B6] via-[#7C3AED] to-[#A855F7] text-white p-4">
      <div className="text-center space-y-6 max-w-md w-full bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-xl">
        {/* Show success checkmark if authenticated, otherwise show spinner */}
        {isAuthenticated ? (
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30 animate-in zoom-in duration-300">
            <CheckCircle className="w-12 h-12 text-white" strokeWidth={3} />
          </div>
        ) : (
          <Loader2 className="w-16 h-16 animate-spin mx-auto text-white/80" />
        )}
        
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {isAuthenticated ? "Login Successful! ✅" : "Logging In"}
          </h2>
          <p className="text-white/80 text-base font-light mb-6">{status}</p>
          
          {showOpenButton && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-white/90 text-lg font-semibold mb-4">
                👇 Tap here to open the app
              </p>
              
              {/* PRIMARY OPEN APP BUTTON - Large and prominent */}
              <Button 
                onClick={handleOpenApp}
                className="w-full py-10 text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-2xl transform transition hover:scale-105 rounded-2xl border-4 border-green-300/50 animate-pulse"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <Smartphone className="w-10 h-10 mr-3" />
                OPEN APP
              </Button>

              {/* Alternative method for Android */}
              {intentUrl && (
                <Button 
                  onClick={() => {
                    console.log("[MOBILE_AUTH] Trying alternative Intent method");
                    window.location.href = intentUrl;
                  }}
                  variant="outline"
                  className="w-full py-6 text-base font-semibold bg-white/10 hover:bg-white/20 text-white border-2 border-white/40 rounded-xl"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Try Alternative Method
                </Button>
              )}

              <div className="pt-4 border-t border-white/20 mt-6">
                <Accordion type="single" collapsible className="w-full border-none">
                  <AccordionItem value="troubleshoot" className="border-none">
                    <AccordionTrigger className="text-white/60 hover:text-white py-2 justify-center text-sm">
                      <span className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        App not opening?
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div className="bg-black/20 p-4 rounded-xl space-y-3">
                        <div className="flex items-start gap-2 text-left text-xs text-yellow-200 bg-yellow-500/20 p-2 rounded">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <p>Ensure you have the latest version of the app installed.</p>
                        </div>
                        
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleCopyToken}
                          className="w-full bg-white/20 hover:bg-white/30 text-white border-none"
                        >
                          <Copy className="w-3 h-3 mr-2" />
                          Copy Auth Token
                        </Button>
                        
                        {/* Display token for manual entry if needed */}
                        <div className="text-[10px] text-white/40 break-all font-mono bg-black/30 p-2 rounded select-all">
                          {token}
                        </div>

                        <Button 
                          variant="ghost" 
                          onClick={handleWebFallback}
                          className="w-full text-white/70 hover:text-white hover:bg-white/10"
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Continue to Web Dashboard
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}