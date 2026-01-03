import { useEffect } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router";
import { useConvexAuth } from "convex/react";

/**
 * MobileFlowHandler
 * 
 * This component detects if the user is accessing the site via the mobile app
 * by checking for 'is_mobile' or 'mobile' query parameters.
 * 
 * It persists this state in localStorage (more robust than sessionStorage).
 * 
 * CRITICAL: If a user is authenticated and has the 'is_mobile' flag,
 * this component forces a redirect to /mobile-auth-callback.
 * This ensures that even if the auth flow redirects to /, the user
 * is bounced back to the page that can open the mobile app.
 */
export function MobileFlowHandler() {
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isMobileParam = searchParams.get("is_mobile");
    const mobileParam = searchParams.get("mobile");
    const platformParam = searchParams.get("platform");
    
    // Check if mobile params are present and true
    if (isMobileParam === "true" || mobileParam === "true" || platformParam === "android") {
      console.log("📱 Mobile flow detected via URL params. Persisting to storage.");
      // Use localStorage for better persistence across redirects/tabs
      localStorage.setItem("is_mobile", "true");
      sessionStorage.setItem("is_mobile", "true");
    }
  }, [searchParams]);

  useEffect(() => {
    // Don't do anything while loading
    if (isLoading) return;

    // Check both storages
    const isMobile = localStorage.getItem("is_mobile") === "true" || sessionStorage.getItem("is_mobile") === "true";
    
    // If we are:
    // 1. Authenticated
    // 2. Flagged as mobile user
    // 3. NOT on the callback page
    // THEN: Redirect to callback page to open the app
    if (isAuthenticated && isMobile && location.pathname !== "/mobile-auth-callback" && location.pathname !== "/error") {
       console.log("📱 Mobile user detected on web route. Redirecting to mobile callback...");
       navigate("/mobile-auth-callback", { replace: true });
    }
  }, [isAuthenticated, isLoading, location, navigate]);

  return null;
}