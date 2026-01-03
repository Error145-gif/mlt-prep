import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useConvexAuth } from "convex/react";
import { useAuthToken } from "@convex-dev/auth/react";
import { Loader2 } from "lucide-react";

// Define the interface for the Android Javascript Bridge
declare global {
  interface Window {
    Android?: {
      onAuthSuccess: (token: string) => void;
    };
  }
}

/**
 * MobileAuthCallback Page
 * 
 * This page is designed to be loaded by the Android WebView after the native app
 * intercepts the `mltprep://auth-success?code=...` deep link.
 * 
 * The Android app should extract the `code` from the deep link and load:
 * https://mltprep.online/mobile-auth-callback?code=THE_CODE
 * 
 * The ConvexAuthProvider will automatically detect the `code` param and establish the session.
 * Once established, this page retrieves the session token and passes it back to the Android app.
 */
export default function MobileAuthCallback() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const token = useAuthToken();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    const handleAuthSuccess = async () => {
      if (isAuthenticated) {
        setStatus("Authenticated! Retrieving session...");
        
        if (token) {
          setStatus("Session retrieved. Syncing with App...");
          console.log("Session token retrieved successfully");

          // 1. Pass token to Android via Javascript Interface (Preferred)
          if (window.Android && window.Android.onAuthSuccess) {
            console.log("Calling window.Android.onAuthSuccess");
            window.Android.onAuthSuccess(token);
          }

          // 2. Pass token via Deep Link Redirect (Fallback)
          // The Android app should intercept this URL
          const deepLink = `mltprep://session-authenticated?token=${encodeURIComponent(token)}`;
          console.log("Redirecting to deep link:", deepLink);
          window.location.href = deepLink;

          // 3. Also redirect to dashboard on the webview as a visual confirmation
          // (The app might close the webview before this happens)
          const timer = setTimeout(() => {
            navigate("/student", { replace: true });
          }, 2000);
          return () => clearTimeout(timer);
        } else {
          setStatus("Waiting for token...");
        }
      }
    };

    handleAuthSuccess();
  }, [isAuthenticated, token, navigate]);

  useEffect(() => {
    const code = searchParams.get("code");
    
    if (!isLoading && !isAuthenticated) {
      if (!code) {
        setStatus("Error: No verification code found.");
        // Redirect to login after delay
        setTimeout(() => navigate("/auth"), 3000);
      } else {
        setStatus("Verifying credentials...");
        // ConvexAuthProvider automatically handles the code exchange when it sees the ?code= param
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
          <p className="text-white/80 text-lg font-light">{status}</p>
        </div>

        {!isAuthenticated && !isLoading && !searchParams.get("code") && (
          <button 
            onClick={() => navigate("/auth")}
            className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors font-medium"
          >
            Return to Login
          </button>
        )}
      </div>
    </div>
  );
}