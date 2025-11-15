"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuthPage;
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var input_otp_1 = require("@/components/ui/input-otp");
var checkbox_1 = require("@/components/ui/checkbox");
var use_auth_1 = require("@/hooks/use-auth");
var lucide_react_1 = require("lucide-react");
var react_1 = require("react");
var react_router_1 = require("react-router");
var framer_motion_1 = require("framer-motion");
var react_2 = require("convex/react");
var api_1 = require("@/convex/_generated/api");
function Auth(_a) {
    var _this = this;
    var _b = _a === void 0 ? {} : _a, redirectAfterAuth = _b.redirectAfterAuth;
    var _c = (0, use_auth_1.useAuth)(), authLoading = _c.isLoading, isAuthenticated = _c.isAuthenticated, user = _c.user, signIn = _c.signIn;
    var navigate = (0, react_router_1.useNavigate)();
    var _d = (0, react_1.useState)("signIn"), step = _d[0], setStep = _d[1];
    var _e = (0, react_1.useState)(""), otp = _e[0], setOtp = _e[1];
    var _f = (0, react_1.useState)(false), isLoading = _f[0], setIsLoading = _f[1];
    var _g = (0, react_1.useState)(null), error = _g[0], setError = _g[1];
    var _h = (0, react_1.useState)(false), rememberMe = _h[0], setRememberMe = _h[1];
    var _j = (0, react_1.useState)(false), isCreatingAccount = _j[0], setIsCreatingAccount = _j[1];
    var autoCompleteRegistration = (0, react_2.useMutation)(api_1.api.authHelpers.autoCompleteRegistration);
    (0, react_1.useEffect)(function () {
        var _a;
        if (!authLoading && isAuthenticated && user !== undefined && user !== null) {
            // Auto-complete registration for new Gmail users
            if (isCreatingAccount && ((_a = user.email) === null || _a === void 0 ? void 0 : _a.endsWith("@gmail.com"))) {
                autoCompleteRegistration().catch(console.error);
            }
            if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
                navigate("/admin", { replace: true });
            }
            else {
                var redirect = redirectAfterAuth || "/student";
                navigate(redirect, { replace: true });
            }
        }
    }, [authLoading, isAuthenticated, user, navigate, redirectAfterAuth, isCreatingAccount, autoCompleteRegistration]);
    var handleEmailSubmit = function (event) { return __awaiter(_this, void 0, void 0, function () {
        var formData, email, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    setIsLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    formData = new FormData(event.currentTarget);
                    email = formData.get("email").toLowerCase().trim();
                    // Validate Gmail only
                    if (!email.endsWith("@gmail.com")) {
                        setError("Only Gmail accounts are allowed. Please use a Gmail address.");
                        setIsLoading(false);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, signIn("email-otp", formData)];
                case 2:
                    _a.sent();
                    setStep({ email: email });
                    setIsLoading(false);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Email sign-in error:", error_1);
                    setError(error_1 instanceof Error
                        ? error_1.message
                        : "Failed to send verification code. Please try again.");
                    setIsLoading(false);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleOtpSubmit = function (event) { return __awaiter(_this, void 0, void 0, function () {
        var formData, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    setIsLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    formData = new FormData(event.currentTarget);
                    return [4 /*yield*/, signIn("email-otp", formData)];
                case 2:
                    _a.sent();
                    // If creating account, mark as registered
                    if (isCreatingAccount) {
                        // The completeRegistration will be called after successful auth redirect
                        // This is handled by the auth system automatically
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error("OTP verification error:", error_2);
                    setError("The verification code you entered is incorrect.");
                    setIsLoading(false);
                    setOtp("");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Guest login disabled for Gmail-only authentication
    // const handleGuestLogin = async () => {
    //   setIsLoading(true);
    //   setError(null);
    //   try {
    //     await signIn("anonymous");
    //   } catch (error) {
    //     console.error("Guest login error:", error);
    //     setError(`Failed to sign in as guest: ${error instanceof Error ? error.message : 'Unknown error'}`);
    //     setIsLoading(false);
    //   }
    // };
    var handleCreateAccount = function () {
        setIsCreatingAccount(true);
    };
    var handleBackToSignIn = function () {
        setIsCreatingAccount(false);
        setError(null);
    };
    return (<div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#5B21B6] via-[#7C3AED] to-[#A855F7] flex items-center justify-center p-4">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{
            backgroundImage: 'url(https://harmless-tapir-303.convex.cloud/api/storage/8fad9960-4961-4061-bdf4-2ba74032189d)',
            backgroundBlendMode: 'overlay'
        }}/>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating DNA Strands */}
        <framer_motion_1.motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-20 left-10 opacity-20">
          <lucide_react_1.Dna className="w-24 h-24 text-white"/>
        </framer_motion_1.motion.div>
        
        <framer_motion_1.motion.div animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-32 right-16 opacity-20">
          <lucide_react_1.Microscope className="w-32 h-32 text-white"/>
        </framer_motion_1.motion.div>

        <framer_motion_1.motion.div animate={{ y: [0, -15, 0], x: [0, 10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/3 right-20 opacity-20">
          <lucide_react_1.TestTube className="w-20 h-20 text-white"/>
        </framer_motion_1.motion.div>

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-400/30 rounded-full blur-3xl"/>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl"/>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"/>
      </div>

      {/* Home Button */}
      <button_1.Button onClick={function () { return navigate("/"); }} variant="ghost" className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 z-50">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        Home
      </button_1.Button>

      {/* Main Content Container */}
      <framer_motion_1.motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <framer_motion_1.motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="flex justify-center mb-4">
            <img src="https://harmless-tapir-303.convex.cloud/api/storage/6068c740-5624-49d7-8c20-c6c805df135b" alt="MLT Logo" className="w-32 h-32 object-contain drop-shadow-2xl" onError={function (e) { e.currentTarget.src = "/logo_bg.png"; }}/>
          </framer_motion_1.motion.div>
          
          <framer_motion_1.motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }} className="text-white text-sm font-light tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
            AI-Powered Learning for Future Medical Lab Professionals
          </framer_motion_1.motion.p>
        </div>

        {/* Glassmorphism Login Card */}
        <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl" style={{
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 0 60px rgba(124, 58, 237, 0.3)',
        }}>
          {step === "signIn" ? (<div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {isCreatingAccount ? "Create Account" : "Welcome Back"}
                </h2>
                <p className="text-white text-sm">
                  {isCreatingAccount
                ? "Start your medical learning journey"
                : "Sign in to continue your learning"}
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <div className="space-y-4">
                  <div className="relative group">
                    <lucide_react_1.Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60 group-focus-within:text-white transition-colors"/>
                    <input_1.Input name="email" placeholder="Enter your email" type="email" className="pl-12 h-12 bg-white/10 border-white/30 rounded-2xl text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/50 transition-all shadow-inner" style={{ fontFamily: "'Inter', sans-serif" }} disabled={isLoading} required/>
                  </div>
                </div>

                {error && (<framer_motion_1.motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-300 bg-red-500/20 p-3 rounded-xl border border-red-400/30">
                    {error}
                  </framer_motion_1.motion.p>)}

                {!isCreatingAccount && (<div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <checkbox_1.Checkbox id="remember" checked={rememberMe} onCheckedChange={function (checked) { return setRememberMe(checked); }} className="border-white/30 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#7C3AED] data-[state=checked]:to-[#22D3EE]"/>
                      <label htmlFor="remember" className="text-white cursor-pointer">
                        Remember me
                      </label>
                    </div>
                  </div>)}

                <button_1.Button type="submit" disabled={isLoading} className="w-full h-12 bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] text-white rounded-2xl text-base font-semibold transition-all duration-300 border-0" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {isLoading ? (<>
                      <lucide_react_1.Loader2 className="mr-2 h-5 w-5 animate-spin"/>
                      {isCreatingAccount ? "Creating..." : "Signing In..."}
                    </>) : (isCreatingAccount ? "Create Account" : "Login")}
                </button_1.Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-transparent px-2 text-white">
                      {isCreatingAccount ? "Already have an account?" : "New to MLT Prep?"}
                    </span>
                  </div>
                </div>

                <button_1.Button type="button" onClick={isCreatingAccount ? handleBackToSignIn : handleCreateAccount} variant="outline" className="w-full h-12 bg-transparent border-2 border-white/30 hover:bg-white/10 hover:border-white/50 text-white rounded-2xl text-base font-semibold transition-all" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {isCreatingAccount ? "Sign In Instead" : "Create New Account"}
                </button_1.Button>
              </form>
            </div>) : (<div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Check your email
                </h2>
                <p className="text-white text-sm">We've sent a code to {step.email}</p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <input type="hidden" name="email" value={step.email}/>
                <input type="hidden" name="code" value={otp}/>

                <div className="flex justify-center">
                  <input_otp_1.InputOTP value={otp} onChange={setOtp} maxLength={6} disabled={isLoading} onKeyDown={function (e) {
                if (e.key === "Enter" && otp.length === 6 && !isLoading) {
                    var form = e.target.closest("form");
                    if (form) {
                        form.requestSubmit();
                    }
                }
            }}>
                    <input_otp_1.InputOTPGroup className="gap-2">
                      {Array.from({ length: 6 }).map(function (_, index) { return (<input_otp_1.InputOTPSlot key={index} index={index} className="bg-white/10 border-2 border-white/30 text-white text-xl font-semibold w-12 h-12 rounded-xl shadow-inner"/>); })}
                    </input_otp_1.InputOTPGroup>
                  </input_otp_1.InputOTP>
                </div>

                {error && (<framer_motion_1.motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-300 bg-red-500/20 p-3 rounded-xl border border-red-400/30 text-center">
                    {error}
                  </framer_motion_1.motion.p>)}

                <p className="text-sm text-white text-center">
                  Didn't receive a code?{" "}
                  <button type="button" className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors" onClick={function () { return setStep("signIn"); }}>
                    Try again
                  </button>
                </p>

                <button_1.Button type="submit" className="w-full h-12 bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] text-white rounded-2xl text-base font-semibold transition-all duration-300 border-0" disabled={isLoading || otp.length !== 6} style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {isLoading ? (<>
                      <lucide_react_1.Loader2 className="mr-2 h-5 w-5 animate-spin"/>
                      Verifying...
                    </>) : (<>
                      Verify Code
                      <lucide_react_1.ArrowRight className="ml-2 h-5 w-5"/>
                    </>)}
                </button_1.Button>

                <button_1.Button type="button" variant="outline" onClick={function () { return setStep("signIn"); }} disabled={isLoading} className="w-full h-12 bg-transparent border-2 border-white/30 hover:bg-white/10 hover:border-white/50 text-white rounded-2xl transition-all">
                  Use different email
                </button_1.Button>
              </form>
            </div>)}
        </framer_motion_1.motion.div>

        {/* Footer Text */}
        <framer_motion_1.motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }} className="text-center text-white text-xs mt-6" style={{ fontFamily: "'Inter', sans-serif" }}>
          © 2024 MLT Prep. All rights reserved.
        </framer_motion_1.motion.p>
      </framer_motion_1.motion.div>
    </div>);
}
function AuthPage(props) {
    return (<react_1.Suspense>
      <Auth {...props}/>
    </react_1.Suspense>);
}
