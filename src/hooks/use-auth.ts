import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { useMemo } from "react";

export function useAuth() {
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth();
  
  // Only query user data if authenticated, skip otherwise
  const user = useQuery(
    api.users.currentUser,
    isAuthenticated ? {} : "skip"
  ) as any;
  
  const { signIn, signOut } = useAuthActions();

  // Memoize the loading state to prevent unnecessary re-renders
  const isLoading = useMemo(() => {
    // Auth is loading if convex auth is loading
    // OR if authenticated but user data hasn't loaded yet
    return isAuthLoading || (isAuthenticated && user === undefined);
  }, [isAuthLoading, isAuthenticated, user]);

  return {
    isLoading,
    isAuthenticated,
    user,
    signIn,
    signOut,
  };
}