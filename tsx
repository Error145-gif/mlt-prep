    import { useAuth } from "@/hooks/use-auth";
    import { useMutation } from "convex/react";
    import { api } from "@/convex/_generated/api";
    import { useEffect } from "react";

    export function AuthListener() {
      const { isAuthenticated } = useAuth();
      const autoCompleteRegistration = useMutation(api.authHelpers.autoCompleteRegistration);

      useEffect(() => {
        if (isAuthenticated) {
          autoCompleteRegistration();
        }
      }, [isAuthenticated, autoCompleteRegistration]);

      return null;
    }
    