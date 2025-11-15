"use strict";
"use node";
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
exports.verifyPayment = exports.createOrder = void 0;
var values_1 = require("convex/values");
var server_1 = require("./_generated/server");
var api_1 = require("./_generated/api");
var razorpay_1 = require("razorpay");
exports.createOrder = (0, server_1.action)({
    args: {
        amount: values_1.v.number(),
        currency: values_1.v.string(),
        receipt: values_1.v.string(),
        notes: values_1.v.optional(values_1.v.object({
            userId: values_1.v.string(),
            planName: values_1.v.string(),
            duration: values_1.v.number(),
        })),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var keyId, keySecret, razorpay, order, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    keyId = process.env.RAZORPAY_KEY_ID;
                    keySecret = process.env.RAZORPAY_KEY_SECRET;
                    if (!keyId || !keySecret) {
                        console.error("Razorpay credentials missing");
                        throw new Error("Payment gateway configuration error");
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    razorpay = new razorpay_1.default({
                        key_id: keyId,
                        key_secret: keySecret,
                    });
                    return [4 /*yield*/, razorpay.orders.create({
                            amount: args.amount * 100, // Convert to paise
                            currency: args.currency,
                            receipt: args.receipt,
                            notes: args.notes,
                        })];
                case 2:
                    order = _a.sent();
                    console.log("Order created successfully:", order.id);
                    return [2 /*return*/, order];
                case 3:
                    error_1 = _a.sent();
                    console.error("Razorpay order creation error:", error_1);
                    throw new Error("Failed to create order: ".concat(error_1.message));
                case 4: return [2 /*return*/];
            }
        });
    }); },
});
exports.verifyPayment = (0, server_1.action)({
    args: {
        orderId: values_1.v.string(),
        paymentId: values_1.v.string(),
        signature: values_1.v.string(),
        userId: values_1.v.string(),
        planName: values_1.v.string(),
        amount: values_1.v.number(),
        duration: values_1.v.number(),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var keySecret, crypto_1, hmac, generatedSignature, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    keySecret = process.env.RAZORPAY_KEY_SECRET;
                    if (!keySecret) {
                        console.error("Razorpay secret key missing");
                        throw new Error("Payment verification configuration error");
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("crypto"); })];
                case 2:
                    crypto_1 = _a.sent();
                    hmac = crypto_1.createHmac("sha256", keySecret);
                    hmac.update("".concat(args.orderId, "|").concat(args.paymentId));
                    generatedSignature = hmac.digest("hex");
                    if (generatedSignature !== args.signature) {
                        console.error("Payment signature verification failed");
                        throw new Error("Payment verification failed");
                    }
                    console.log("Payment verified successfully:", args.paymentId);
                    // Create subscription
                    return [4 /*yield*/, ctx.runMutation(api_1.internal.razorpayInternal.createSubscription, {
                            userId: args.userId,
                            planName: args.planName,
                            amount: args.amount,
                            duration: args.duration,
                            paymentId: args.paymentId,
                            orderId: args.orderId,
                        })];
                case 3:
                    // Create subscription
                    _a.sent();
                    return [2 /*return*/, { success: true }];
                case 4:
                    error_2 = _a.sent();
                    console.error("Payment verification error:", error_2);
                    throw new Error("Payment verification failed: ".concat(error_2.message));
                case 5: return [2 /*return*/];
            }
        });
    }); },
});
