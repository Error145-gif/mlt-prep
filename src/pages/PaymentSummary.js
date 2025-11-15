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
exports.default = PaymentSummary;
var react_1 = require("convex/react");
var api_1 = require("@/convex/_generated/api");
var use_auth_1 = require("@/hooks/use-auth");
var react_router_1 = require("react-router");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var input_1 = require("@/components/ui/input");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var react_2 = require("react");
var sonner_1 = require("sonner");
var lucide_react_2 = require("lucide-react");
function PaymentSummary() {
    var _this = this;
    var _a = (0, use_auth_1.useAuth)(), isAuthenticated = _a.isAuthenticated, isLoading = _a.isLoading, user = _a.user;
    var navigate = (0, react_router_1.useNavigate)();
    var searchParams = (0, react_router_1.useSearchParams)()[0];
    var _b = (0, react_2.useState)(false), isMenuOpen = _b[0], setIsMenuOpen = _b[1];
    var _c = (0, react_2.useState)("razorpay"), selectedGateway = _c[0], setSelectedGateway = _c[1];
    var userProfile = (0, react_1.useQuery)(api_1.api.users.getUserProfile);
    var _d = (0, react_2.useState)(""), couponCode = _d[0], setCouponCode = _d[1];
    var validateCoupon = (0, react_1.useQuery)(api_1.api.coupons.validateCoupon, couponCode ? { code: couponCode } : "skip");
    var _e = (0, react_2.useState)(null), appliedCoupon = _e[0], setAppliedCoupon = _e[1];
    var planName = searchParams.get("name");
    var basePrice = parseFloat(searchParams.get("price") || "0");
    var duration = parseInt(searchParams.get("duration") || "0");
    // Razorpay actions
    var createRazorpayOrder = (0, react_1.useAction)(api_1.api.razorpay.createOrder);
    var verifyRazorpayPayment = (0, react_1.useAction)(api_1.api.razorpay.verifyPayment);
    // Cashfree actions
    var createCashfreeOrder = (0, react_1.useAction)(api_1.api.cashfree.createOrder);
    var verifyCashfreePayment = (0, react_1.useAction)(api_1.api.cashfree.verifyPayment);
    // Coupon tracking
    var trackCouponUsage = (0, react_1.useMutation)(api_1.api.coupons.trackCouponUsage);
    (0, react_2.useEffect)(function () {
        if (!isLoading && !isAuthenticated) {
            navigate("/auth");
        }
    }, [isAuthenticated, isLoading, navigate]);
    if (isLoading || !userProfile) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>);
    }
    if (!planName || !basePrice) {
        navigate("/subscription");
        return null;
    }
    var isProfileComplete = userProfile.name && userProfile.state && userProfile.examPreparation;
    if (!isProfileComplete) {
        return (<div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl"/>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl"/>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <framer_motion_1.motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10 p-8">
              <card_1.CardContent className="space-y-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <lucide_react_1.User className="h-10 w-10 text-yellow-400"/>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Complete Your Profile First</h2>
                  <p className="text-white/70">
                    Please complete your profile before proceeding with subscription.
                  </p>
                </div>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <div className={"w-6 h-6 rounded-full flex items-center justify-center ".concat(userProfile.name ? 'bg-green-500/20' : 'bg-red-500/20')}>
                      {userProfile.name ? <lucide_react_1.CheckCircle className="h-4 w-4 text-green-400"/> : <span className="text-red-400">✕</span>}
                    </div>
                    <span className="text-white">Full Name</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <div className={"w-6 h-6 rounded-full flex items-center justify-center ".concat(userProfile.state ? 'bg-green-500/20' : 'bg-red-500/20')}>
                      {userProfile.state ? <lucide_react_1.CheckCircle className="h-4 w-4 text-green-400"/> : <span className="text-red-400">✕</span>}
                    </div>
                    <span className="text-white">State</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <div className={"w-6 h-6 rounded-full flex items-center justify-center ".concat(userProfile.examPreparation ? 'bg-green-500/20' : 'bg-red-500/20')}>
                      {userProfile.examPreparation ? <lucide_react_1.CheckCircle className="h-4 w-4 text-green-400"/> : <span className="text-red-400">✕</span>}
                    </div>
                    <span className="text-white">Exam Preparation</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 pt-4">
                  <button_1.Button onClick={function () { return navigate("/profile"); }} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    Complete Profile Now
                  </button_1.Button>
                  <button_1.Button onClick={function () { return navigate("/subscription"); }} variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                    Back to Plans
                  </button_1.Button>
                </div>
              </card_1.CardContent>
            </card_1.Card>
          </framer_motion_1.motion.div>
        </div>
      </div>);
    }
    var calculateDiscount = function () {
        if (!appliedCoupon)
            return 0;
        console.log("Calculating discount:", {
            type: appliedCoupon.type,
            discount: appliedCoupon.discount,
            basePrice: basePrice
        });
        if (appliedCoupon.type === "percentage") {
            var discountAmount = (basePrice * appliedCoupon.discount) / 100;
            console.log("Percentage discount calculated:", discountAmount);
            return discountAmount;
        }
        console.log("Fixed discount:", appliedCoupon.discount);
        return appliedCoupon.discount;
    };
    var discount = calculateDiscount();
    var finalAmount = Math.max(basePrice - discount, 0);
    var handleApplyCoupon = function () {
        if (validateCoupon && validateCoupon.valid) {
            setAppliedCoupon({
                discount: validateCoupon.discount,
                type: validateCoupon.type,
                couponId: validateCoupon.couponId,
            });
            sonner_1.toast.success(validateCoupon.message);
            console.log("Applied coupon:", {
                discount: validateCoupon.discount,
                type: validateCoupon.type,
                couponId: validateCoupon.couponId
            });
        }
        else if (validateCoupon) {
            sonner_1.toast.error(validateCoupon.message);
        }
    };
    var handleCashfreePayment = function () { return __awaiter(_this, void 0, void 0, function () {
        var waitForCashfree, isLoaded, order, cashfree, error_1, error_2, checkoutOptions, error_3;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(user === null || user === void 0 ? void 0 : user._id)) {
                        sonner_1.toast.error("User not found");
                        return [2 /*return*/];
                    }
                    waitForCashfree = function () { return __awaiter(_this, void 0, void 0, function () {
                        var i;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (typeof window === 'undefined')
                                        return [2 /*return*/, false];
                                    // Check if already loaded
                                    if (window.Cashfree)
                                        return [2 /*return*/, true];
                                    i = 0;
                                    _a.label = 1;
                                case 1:
                                    if (!(i < 50)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                                case 2:
                                    _a.sent();
                                    if (window.Cashfree)
                                        return [2 /*return*/, true];
                                    _a.label = 3;
                                case 3:
                                    i++;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/, false];
                            }
                        });
                    }); };
                    return [4 /*yield*/, waitForCashfree()];
                case 1:
                    isLoaded = _a.sent();
                    if (!isLoaded) {
                        sonner_1.toast.error("Payment gateway not loaded. Please check your connection and refresh the page.");
                        return [2 /*return*/];
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 12, , 13]);
                    sonner_1.toast.loading("Initializing Cashfree payment...");
                    return [4 /*yield*/, createCashfreeOrder({
                            amount: finalAmount,
                            currency: "INR",
                            userId: user._id,
                            planName: planName || "",
                            duration: duration,
                        })];
                case 3:
                    order = _a.sent();
                    cashfree = window.Cashfree({
                        mode: import.meta.env.VITE_CASHFREE_ENVIRONMENT || "sandbox",
                    });
                    if (!(appliedCoupon && appliedCoupon.couponId)) return [3 /*break*/, 7];
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, trackCouponUsage({
                            couponId: appliedCoupon.couponId,
                            userId: user._id,
                            orderId: order.orderId,
                            discountAmount: discount,
                        })];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error("Failed to track coupon usage:", error_1);
                    return [3 /*break*/, 7];
                case 7:
                    if (!(appliedCoupon && appliedCoupon.couponId)) return [3 /*break*/, 11];
                    _a.label = 8;
                case 8:
                    _a.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, trackCouponUsage({
                            couponId: appliedCoupon.couponId,
                            userId: user._id,
                            orderId: order.orderId,
                            discountAmount: discount,
                        })];
                case 9:
                    _a.sent();
                    console.log("Coupon usage tracked for Cashfree order");
                    return [3 /*break*/, 11];
                case 10:
                    error_2 = _a.sent();
                    console.error("Failed to track coupon usage:", error_2);
                    return [3 /*break*/, 11];
                case 11:
                    checkoutOptions = {
                        paymentSessionId: order.paymentSessionId,
                        returnUrl: "".concat(window.location.origin, "/payment-status?gateway=cashfree&order_id=").concat(order.orderId),
                    };
                    cashfree.checkout(checkoutOptions).then(function () {
                        console.log("Payment initiated");
                    });
                    return [3 /*break*/, 13];
                case 12:
                    error_3 = _a.sent();
                    sonner_1.toast.error(error_3.message || "Failed to initiate payment");
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    }); };
    var handleRazorpayPayment = function () { return __awaiter(_this, void 0, void 0, function () {
        var waitForRazorpay, isLoaded, order_1, options, razorpay, error_4;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(user === null || user === void 0 ? void 0 : user._id)) {
                        sonner_1.toast.error("User not found");
                        return [2 /*return*/];
                    }
                    waitForRazorpay = function () { return __awaiter(_this, void 0, void 0, function () {
                        var i;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (typeof window === 'undefined')
                                        return [2 /*return*/, false];
                                    // Check if already loaded
                                    if (window.Razorpay)
                                        return [2 /*return*/, true];
                                    i = 0;
                                    _a.label = 1;
                                case 1:
                                    if (!(i < 50)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                                case 2:
                                    _a.sent();
                                    if (window.Razorpay)
                                        return [2 /*return*/, true];
                                    _a.label = 3;
                                case 3:
                                    i++;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/, false];
                            }
                        });
                    }); };
                    return [4 /*yield*/, waitForRazorpay()];
                case 1:
                    isLoaded = _a.sent();
                    if (!isLoaded) {
                        sonner_1.toast.error("Payment gateway not loaded. Please check your connection and refresh the page.");
                        return [2 /*return*/];
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    sonner_1.toast.loading("Initializing Razorpay payment...");
                    return [4 /*yield*/, createRazorpayOrder({
                            amount: finalAmount,
                            currency: "INR",
                            receipt: "receipt_".concat(Date.now()),
                            notes: {
                                userId: user._id,
                                planName: planName || "",
                                duration: duration,
                            },
                        })];
                case 3:
                    order_1 = _a.sent();
                    options = {
                        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                        order_id: order_1.id,
                        amount: finalAmount * 100,
                        currency: "INR",
                        name: "MLT Prep",
                        description: "".concat(planName, " Plan"),
                        prefill: {
                            name: (userProfile === null || userProfile === void 0 ? void 0 : userProfile.name) || "",
                            email: (userProfile === null || userProfile === void 0 ? void 0 : userProfile.email) || "",
                        },
                        handler: function (response) { return __awaiter(_this, void 0, void 0, function () {
                            var error_5, error_6;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 6, , 7]);
                                        return [4 /*yield*/, verifyRazorpayPayment({
                                                orderId: order_1.id,
                                                paymentId: response.razorpay_payment_id,
                                                signature: response.razorpay_signature,
                                                userId: user._id,
                                                planName: planName || "",
                                                amount: finalAmount,
                                                duration: duration,
                                            })];
                                    case 1:
                                        _a.sent();
                                        if (!(appliedCoupon && appliedCoupon.couponId)) return [3 /*break*/, 5];
                                        _a.label = 2;
                                    case 2:
                                        _a.trys.push([2, 4, , 5]);
                                        return [4 /*yield*/, trackCouponUsage({
                                                couponId: appliedCoupon.couponId,
                                                userId: user._id,
                                                orderId: order_1.id,
                                                discountAmount: discount,
                                            })];
                                    case 3:
                                        _a.sent();
                                        return [3 /*break*/, 5];
                                    case 4:
                                        error_5 = _a.sent();
                                        console.error("Failed to track coupon usage:", error_5);
                                        return [3 /*break*/, 5];
                                    case 5:
                                        navigate("/payment-status?status=success");
                                        return [3 /*break*/, 7];
                                    case 6:
                                        error_6 = _a.sent();
                                        sonner_1.toast.error("Payment verification failed");
                                        navigate("/payment-status?status=failed");
                                        return [3 /*break*/, 7];
                                    case 7: return [2 /*return*/];
                                }
                            });
                        }); },
                        modal: {
                            ondismiss: function () {
                                sonner_1.toast.error("Payment cancelled");
                            },
                        },
                    };
                    razorpay = new window.Razorpay(options);
                    razorpay.open();
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _a.sent();
                    sonner_1.toast.error(error_4.message || "Failed to initiate payment");
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handlePayment = function () {
        if (selectedGateway === "razorpay") {
            handleRazorpayPayment();
        }
        else {
            handleCashfreePayment();
        }
    };
    return (<div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
      {/* Hamburger Menu Button - Mobile Only */}
      <button onClick={function () { return setIsMenuOpen(!isMenuOpen); }} className="fixed top-6 right-6 z-50 md:hidden bg-white/20 backdrop-blur-sm p-2 rounded-lg hover:bg-white/30 transition-all">
        {isMenuOpen ? (<lucide_react_2.X className="h-6 w-6 text-white"/>) : (<lucide_react_2.Menu className="h-6 w-6 text-white"/>)}
      </button>

      {/* Mobile Menu */}
      <framer_motion_1.AnimatePresence>
        {isMenuOpen && (<framer_motion_1.motion.div initial={{ opacity: 0, x: 300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 300 }} transition={{ duration: 0.3 }} className="fixed top-0 right-0 h-screen w-64 bg-gradient-to-br from-blue-600 to-purple-700 z-40 md:hidden shadow-2xl p-6 space-y-4">
            <div className="mt-12 space-y-3">
              <button onClick={function () {
                navigate("/dashboard");
                setIsMenuOpen(false);
            }} className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all">
                📊 Dashboard
              </button>
              <button onClick={function () {
                navigate("/tests/mock");
                setIsMenuOpen(false);
            }} className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all">
                🧩 Mock Tests
              </button>
              <button onClick={function () {
                navigate("/tests/pyq");
                setIsMenuOpen(false);
            }} className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all">
                📚 PYQ Sets
              </button>
              <button onClick={function () {
                navigate("/tests/ai");
                setIsMenuOpen(false);
            }} className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all">
                🤖 AI Questions
              </button>
              <button onClick={function () {
                navigate("/profile");
                setIsMenuOpen(false);
            }} className="w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all">
                👤 Profile
              </button>
            </div>
          </framer_motion_1.motion.div>)}
      </framer_motion_1.AnimatePresence>

      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-3xl"/>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl"/>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <framer_motion_1.motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white">Payment Summary</h1>
          <p className="text-white/70 mt-1">Review your subscription details</p>
        </framer_motion_1.motion.div>

        <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <card_1.CardHeader>
              <card_1.CardTitle className="text-white text-2xl">Payment Details</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-6">
              {/* Payment Gateway Selection */}
              <div className="space-y-3 bg-white/5 p-6 rounded-lg">
                <h3 className="text-white font-medium flex items-center gap-2">
                  Select Payment Gateway
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={function () { return setSelectedGateway("razorpay"); }} className={"p-4 rounded-lg border-2 transition-all ".concat(selectedGateway === "razorpay"
            ? "border-blue-500 bg-blue-500/20"
            : "border-white/20 bg-white/5 hover:bg-white/10")}>
                    <div className="text-white font-semibold">Razorpay</div>
                    <div className="text-white/70 text-xs mt-1">Cards, UPI, Wallets</div>
                  </button>
                  <button onClick={function () { return setSelectedGateway("cashfree"); }} className={"p-4 rounded-lg border-2 transition-all ".concat(selectedGateway === "cashfree"
            ? "border-green-500 bg-green-500/20"
            : "border-white/20 bg-white/5 hover:bg-white/10")}>
                    <div className="text-white font-semibold">Cashfree</div>
                    <div className="text-white/70 text-xs mt-1">All Payment Methods</div>
                  </button>
                </div>
              </div>

              <div className="space-y-4 bg-white/5 p-6 rounded-lg">
                <div className="space-y-4 bg-white/5 p-6 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Selected Plan</span>
                    <badge_1.Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {planName}
                    </badge_1.Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Duration</span>
                    <span className="text-white font-medium">{duration} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Base Amount</span>
                    <span className="text-white font-medium">₹{basePrice}</span>
                  </div>
                  {appliedCoupon && (<div className="flex justify-between items-center text-green-400">
                      <span>Discount Applied</span>
                      <span>- ₹{discount.toFixed(2)}</span>
                    </div>)}
                  <div className="border-t border-white/20 pt-4 flex justify-between items-center">
                    <span className="text-white font-semibold text-lg">Total Amount</span>
                    <span className="text-white font-bold text-2xl">₹{finalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3 bg-white/5 p-6 rounded-lg">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <lucide_react_1.Tag className="h-4 w-4"/>
                    Have a Coupon Code?
                  </h3>
                  <div className="flex gap-2">
                    <input_1.Input value={couponCode} onChange={function (e) { return setCouponCode(e.target.value.toUpperCase()); }} placeholder="Enter coupon code" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" disabled={!!appliedCoupon}/>
                    <button_1.Button onClick={handleApplyCoupon} disabled={!couponCode || !!appliedCoupon} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      Apply
                    </button_1.Button>
                  </div>
                </div>

                <div className="space-y-4 bg-white/5 p-6 rounded-lg">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <lucide_react_1.User className="h-4 w-4"/>
                    Your Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-white/70">
                      <lucide_react_1.User className="h-4 w-4"/>
                      <span>{userProfile.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <lucide_react_1.Mail className="h-4 w-4"/>
                      <span>{userProfile.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <lucide_react_1.MapPin className="h-4 w-4"/>
                      <span>{userProfile.state}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <lucide_react_1.BookOpen className="h-4 w-4"/>
                      <span>{userProfile.examPreparation}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button_1.Button onClick={handlePayment} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    Pay with {selectedGateway === "razorpay" ? "Razorpay" : "Cashfree"}
                  </button_1.Button>
                  <button_1.Button onClick={function () { return navigate("/subscription"); }} variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                    Back to Plans
                  </button_1.Button>
                </div>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </framer_motion_1.motion.div>
      </div>
    </div>);
}
