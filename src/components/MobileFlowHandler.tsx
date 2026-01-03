import { useEffect } from "react";
import { useSearchParams } from "react-router";

/**
 * MobileFlowHandler
 * 
 * This component detects if the user is accessing the site via the mobile app
 * by checking for 'is_mobile' or 'mobile' query parameters.
 * 
 * It persists this state in sessionStorage so that authentication flows
 * (which might involve redirects) know to redirect back to the mobile app callback.
 */
export function MobileFlowHandler() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const isMobileParam = searchParams.get("is_mobile");
    const mobileParam = searchParams.get("mobile");
    
    // Check if mobile params are present and true
    if (isMobileParam === "true" || mobileParam === "true") {
      console.log("📱 Mobile flow detected via URL params. Persisting to storage.");
      sessionStorage.setItem("is_mobile", "true");
    }
  }, [searchParams]);

  return null;
}
