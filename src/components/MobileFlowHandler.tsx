import { useEffect } from "react";
import { useSearchParams } from "react-router";

/**
 * MobileFlowHandler
 * 
 * This component detects if the user is accessing the site via the mobile app
 * by checking for 'is_mobile' or 'mobile' query parameters.
 * 
 * It persists this state in localStorage (more robust than sessionStorage).
 */
export function MobileFlowHandler() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const isMobileParam = searchParams.get("is_mobile");
    const mobileParam = searchParams.get("mobile");
    const platformParam = searchParams.get("platform");
    const packageParam = searchParams.get("package");
    
    // Check if mobile params are present and true
    if (isMobileParam === "true" || mobileParam === "true" || platformParam === "android") {
      console.log("📱 Mobile flow detected via URL params. Persisting to storage.");
      // Use localStorage for better persistence across redirects/tabs
      localStorage.setItem("is_mobile", "true");
      sessionStorage.setItem("is_mobile", "true");
    }

    // Persist package name if provided (for Intent URLs)
    if (packageParam) {
      console.log(`📦 Package name detected: ${packageParam}`);
      localStorage.setItem("mobile_package_name", packageParam);
    }
  }, [searchParams]);

  return null;
}