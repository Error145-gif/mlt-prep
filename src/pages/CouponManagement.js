"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.default = CouponManagement;
var react_1 = require("convex/react");
var api_1 = require("@/convex/_generated/api");
var use_auth_1 = require("@/hooks/use-auth");
var react_router_1 = require("react-router");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var select_1 = require("@/components/ui/select");
var badge_1 = require("@/components/ui/badge");
var switch_1 = require("@/components/ui/switch");
var dialog_1 = require("@/components/ui/dialog");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var sonner_1 = require("sonner");
var react_2 = require("react");
var AdminSidebar_1 = require("@/components/AdminSidebar");
function CouponManagement() {
    var _this = this;
    var _a = (0, use_auth_1.useAuth)(), isLoading = _a.isLoading, isAuthenticated = _a.isAuthenticated, user = _a.user;
    var coupons = (0, react_1.useQuery)(api_1.api.coupons.getAllCoupons, !isLoading && isAuthenticated && (user === null || user === void 0 ? void 0 : user.role) === "admin" ? {} : "skip");
    var createCoupon = (0, react_1.useMutation)(api_1.api.coupons.createCoupon);
    var updateCoupon = (0, react_1.useMutation)(api_1.api.coupons.updateCoupon);
    var deleteCoupon = (0, react_1.useMutation)(api_1.api.coupons.deleteCoupon);
    var _b = (0, react_2.useState)(false), isCreateDialogOpen = _b[0], setIsCreateDialogOpen = _b[1];
    var _c = (0, react_2.useState)({
        code: "",
        discountType: "percentage",
        discountValue: 0,
        usageLimit: undefined,
        expiryDate: undefined,
        description: "",
    }), newCoupon = _c[0], setNewCoupon = _c[1];
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <lucide_react_1.Loader2 className="h-8 w-8 animate-spin text-white"/>
      </div>);
    }
    if (!isAuthenticated || (user === null || user === void 0 ? void 0 : user.role) !== "admin") {
        return <react_router_1.Navigate to="/auth"/>;
    }
    var handleCreateCoupon = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!newCoupon.code || newCoupon.discountValue <= 0) {
                        sonner_1.toast.error("Please fill in all required fields");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, createCoupon({
                            code: newCoupon.code,
                            discountType: newCoupon.discountType,
                            discountValue: newCoupon.discountValue,
                            usageLimit: newCoupon.usageLimit,
                            expiryDate: newCoupon.expiryDate,
                            description: newCoupon.description || undefined,
                        })];
                case 2:
                    _a.sent();
                    sonner_1.toast.success("Coupon created successfully!");
                    setIsCreateDialogOpen(false);
                    setNewCoupon({
                        code: "",
                        discountType: "percentage",
                        discountValue: 0,
                        usageLimit: undefined,
                        expiryDate: undefined,
                        description: "",
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    sonner_1.toast.error(error_1.message || "Failed to create coupon");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleToggleActive = function (couponId, currentStatus) { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, updateCoupon({
                            couponId: couponId,
                            isActive: !currentStatus,
                        })];
                case 1:
                    _a.sent();
                    sonner_1.toast.success("Coupon ".concat(!currentStatus ? "activated" : "deactivated"));
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    sonner_1.toast.error(error_2.message || "Failed to update coupon");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteCoupon = function (couponId) { return __awaiter(_this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm("Are you sure you want to delete this coupon?"))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, deleteCoupon({ couponId: couponId })];
                case 2:
                    _a.sent();
                    sonner_1.toast.success("Coupon deleted successfully!");
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    sonner_1.toast.error(error_3.message || "Failed to delete coupon");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500"/>
      
      {/* Animated orbs */}
      <framer_motion_1.motion.div className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl" animate={{ x: [0, 100, 0], y: [0, 50, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}/>
      <framer_motion_1.motion.div className="fixed top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl" animate={{ x: [0, -100, 0], y: [0, 100, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 1 }}/>

      {/* Lab background image */}
      <div className="fixed inset-0 opacity-10" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
        }}/>

      {/* Content */}
      <div className="relative z-10">
        <AdminSidebar_1.default />
        <div className="lg:ml-64 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">Coupon Management</h1>
              <p className="text-white/70 mt-1">Create and manage discount coupons</p>
            </div>
            <dialog_1.Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <dialog_1.DialogTrigger asChild>
                <button_1.Button className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700">
                  <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
                  Create Coupon
                </button_1.Button>
              </dialog_1.DialogTrigger>
              <dialog_1.DialogContent className="bg-gray-900 border-white/20 text-white">
                <dialog_1.DialogHeader>
                  <dialog_1.DialogTitle className="text-white">Create New Coupon</dialog_1.DialogTitle>
                </dialog_1.DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label_1.Label htmlFor="code">Coupon Code *</label_1.Label>
                    <input_1.Input id="code" value={newCoupon.code} onChange={function (e) { return setNewCoupon(__assign(__assign({}, newCoupon), { code: e.target.value.toUpperCase() })); }} placeholder="e.g., SAVE20" className="bg-white/10 border-white/20 text-white"/>
                  </div>
                  <div>
                    <label_1.Label htmlFor="discountType">Discount Type *</label_1.Label>
                    <select_1.Select value={newCoupon.discountType} onValueChange={function (value) { return setNewCoupon(__assign(__assign({}, newCoupon), { discountType: value })); }}>
                      <select_1.SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <select_1.SelectValue />
                      </select_1.SelectTrigger>
                      <select_1.SelectContent className="bg-gray-900 border-white/20">
                        <select_1.SelectItem value="percentage" className="text-white">Percentage (%)</select_1.SelectItem>
                        <select_1.SelectItem value="fixed" className="text-white">Fixed Amount (₹)</select_1.SelectItem>
                      </select_1.SelectContent>
                    </select_1.Select>
                  </div>
                  <div>
                    <label_1.Label htmlFor="discountValue">
                      Discount Value * {newCoupon.discountType === "percentage" ? "(%)" : "(₹)"}
                    </label_1.Label>
                    <input_1.Input id="discountValue" type="number" value={newCoupon.discountValue || ""} onChange={function (e) { return setNewCoupon(__assign(__assign({}, newCoupon), { discountValue: parseFloat(e.target.value) || 0 })); }} placeholder={newCoupon.discountType === "percentage" ? "e.g., 20" : "e.g., 50"} className="bg-white/10 border-white/20 text-white"/>
                  </div>
                  <div>
                    <label_1.Label htmlFor="usageLimit">Usage Limit (Optional)</label_1.Label>
                    <input_1.Input id="usageLimit" type="number" value={newCoupon.usageLimit || ""} onChange={function (e) { return setNewCoupon(__assign(__assign({}, newCoupon), { usageLimit: e.target.value ? parseInt(e.target.value) : undefined })); }} placeholder="Leave empty for unlimited" className="bg-white/10 border-white/20 text-white"/>
                  </div>
                  <div>
                    <label_1.Label htmlFor="expiryDate">Expiry Date (Optional)</label_1.Label>
                    <input_1.Input id="expiryDate" type="date" onChange={function (e) { return setNewCoupon(__assign(__assign({}, newCoupon), { expiryDate: e.target.value ? new Date(e.target.value).getTime() : undefined })); }} className="bg-white/10 border-white/20 text-white"/>
                  </div>
                  <div>
                    <label_1.Label htmlFor="description">Description (Optional)</label_1.Label>
                    <input_1.Input id="description" value={newCoupon.description} onChange={function (e) { return setNewCoupon(__assign(__assign({}, newCoupon), { description: e.target.value })); }} placeholder="e.g., New Year Special" className="bg-white/10 border-white/20 text-white"/>
                  </div>
                  <button_1.Button onClick={handleCreateCoupon} className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
                    Create Coupon
                  </button_1.Button>
                </div>
              </dialog_1.DialogContent>
            </dialog_1.Dialog>
          </div>

          {/* Coupons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!coupons || coupons.length === 0 ? (<card_1.Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20 col-span-full">
                <card_1.CardContent className="py-12 text-center">
                  <lucide_react_1.Tag className="h-12 w-12 text-white/50 mx-auto mb-4"/>
                  <p className="text-white/80">No coupons created yet</p>
                </card_1.CardContent>
              </card_1.Card>) : (coupons.map(function (coupon, index) { return (<framer_motion_1.motion.div key={coupon._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <card_1.Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
                    <card_1.CardHeader>
                      <div className="flex items-center justify-between">
                        <card_1.CardTitle className="text-white flex items-center gap-2">
                          <lucide_react_1.Tag className="h-5 w-5"/>
                          {coupon.code}
                        </card_1.CardTitle>
                        <badge_1.Badge className={coupon.isActive ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}>
                          {coupon.isActive ? "Active" : "Inactive"}
                        </badge_1.Badge>
                      </div>
                    </card_1.CardHeader>
                    <card_1.CardContent className="space-y-4">
                      <div className="text-2xl font-bold text-white">
                        {coupon.discountType === "percentage" ? "".concat(coupon.discountValue, "%") : "\u20B9".concat(coupon.discountValue)} OFF
                      </div>
                      {coupon.description && (<p className="text-white/70 text-sm">{coupon.description}</p>)}
                      <div className="space-y-2 text-sm text-white/70">
                        <div className="flex items-center justify-between">
                          <span>Used:</span>
                          <span className="text-white font-medium">
                            {coupon.usageCount || 0} {coupon.usageLimit ? "/ ".concat(coupon.usageLimit) : "times"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Type:</span>
                          <span className="text-white font-medium">
                            {coupon.discountType === "percentage" ? "Percentage" : "Fixed Amount"}
                          </span>
                        </div>
                        {coupon.expiryDate && (<div className="flex items-center justify-between">
                            <span>Expires:</span>
                            <span className="text-white font-medium">
                              {new Date(coupon.expiryDate).toLocaleDateString()}
                            </span>
                          </div>)}
                      </div>
                      <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2 flex-1">
                          <switch_1.Switch checked={coupon.isActive} onCheckedChange={function () { return handleToggleActive(coupon._id, coupon.isActive); }}/>
                          <span className="text-white/70 text-sm">Active</span>
                        </div>
                        <button_1.Button variant="ghost" size="icon" onClick={function () { return handleDeleteCoupon(coupon._id); }} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                          <lucide_react_1.Trash2 className="h-4 w-4"/>
                        </button_1.Button>
                      </div>
                    </card_1.CardContent>
                  </card_1.Card>
                </framer_motion_1.motion.div>); }))}
          </div>
        </div>
      </div>
    </div>);
}
