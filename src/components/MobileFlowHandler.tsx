import { useEffect } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router";
import { useConvexAuth } from "convex/react";

/**
 * MobileFlowHandler
 * 
 * This component detects if the user is accessing the site via the mobile app
 * by checking for 'is_mobile' or 'mobile' query parameters.
 * 
 * It persists this state in sessionStorage.
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
    
    // Check if mobile params are present and true
    if (isMobileParam === "true" || mobileParam === "true") {
      console.log("📱 Mobile flow detected via URL params. Persisting to storage.");
      sessionStorage.setItem("is_mobile", "true");
    }
  }, [searchParams]);

  useEffect(() => {
    // Don't do anything while loading
    if (isLoading) return;

    const isMobile = sessionStorage.getItem("is_mobile") === "true";
    
    // If we are:
    // 1. Authenticated
    // 2. Flagged as mobile user
    // 3. NOT on the callback page
    // THEN: Redirect to callback page to open the app
    if (isAuthenticated && isMobile && location.pathname !== "/mobile-auth-callback") {
       console.log("📱 Mobile user detected on web route. Redirecting to mobile callback...");
       navigate("/mobile-auth-callback", { replace: true });
    }
  }, [isAuthenticated, isLoading, location, navigate]);

  return null;
}
