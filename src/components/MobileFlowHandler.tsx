import { useEffect } from "react";
import { useSearchParams } from "react-router";

/**
 * MobileFlowHandler
 * 
 * This component detects if the user is accessing the site via the mobile app
 * by checking for 'is_mobile' or 'mobile' query parameters.
 * 
 * If detected, it persists this state to sessionStorage so that subsequent
 * navigations (e.g. from Landing -> Auth) still know it's a mobile flow.
 * 
 * This ensures that the Auth page correctly redirects to /mobile-auth-callback
 * instead of the web dashboard.
 */
export function MobileFlowHandler() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const isMobileParam = searchParams.get("is_mobile") === "true" || searchParams.get("mobile") === "true";
    
    if (isMobileParam) {
      // Persist to session storage
      sessionStorage.setItem("is_mobile", "true");
      console.log("[MobileFlowHandler] Mobile flow detected via URL params, persisted to sessionStorage");
    }
  }, [searchParams]);

  return null;
}
