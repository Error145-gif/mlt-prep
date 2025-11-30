import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";

import { useEffect, useState } from "react";

export function useAuth() {
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth();
  // Skip querying currentUser until we know the auth state to prevent runtime crashes
  const user = useQuery(
    api.users.currentUser,
    isAuthenticated ? {} : "skip"
  ) as any;
  const { signIn, signOut } = useAuthActions();

  const [isLoading, setIsLoading] = useState(true);

  // Consider loading complete once auth state resolves (don't wait on `user`)
  useEffect(() => {
    if (!isAuthLoading) {
      setIsLoading(false);
    }
  }, [isAuthLoading]);

  return {
    isLoading,
    isAuthenticated,
    user,
    signIn,
    signOut,
  };
}