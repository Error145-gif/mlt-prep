"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = useAuth;
var api_1 = require("@/convex/_generated/api");
var react_1 = require("@convex-dev/auth/react");
var react_2 = require("convex/react");
var react_3 = require("react");
function useAuth() {
    var _a = (0, react_2.useConvexAuth)(), isAuthLoading = _a.isLoading, isAuthenticated = _a.isAuthenticated;
    var user = (0, react_2.useQuery)(api_1.api.users.currentUser);
    var _b = (0, react_1.useAuthActions)(), signIn = _b.signIn, signOut = _b.signOut;
    var _c = (0, react_3.useState)(true), isLoading = _c[0], setIsLoading = _c[1];
    // This effect updates the loading state once auth is loaded and user data is available
    // It ensures we only show content when both authentication state and user data are ready
    (0, react_3.useEffect)(function () {
        if (!isAuthLoading && user !== undefined) {
            setIsLoading(false);
        }
    }, [isAuthLoading, user]);
    return {
        isLoading: isLoading,
        isAuthenticated: isAuthenticated,
        user: user,
        signIn: signIn,
        signOut: signOut,
    };
}
