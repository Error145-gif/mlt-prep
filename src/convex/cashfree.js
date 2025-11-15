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
exports.createOrder = (0, server_1.action)({
    args: {
        amount: values_1.v.number(),
        currency: values_1.v.string(),
        userId: values_1.v.string(),
        planName: values_1.v.string(),
        duration: values_1.v.number(),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var clientId, clientSecret, environment, orderId, orderRequest, apiUrl, response, errorData, orderData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    clientId = process.env.CASHFREE_CLIENT_ID;
                    clientSecret = process.env.CASHFREE_CLIENT_SECRET;
                    environment = process.env.CASHFREE_ENVIRONMENT || "sandbox";
                    if (!clientId || !clientSecret) {
                        console.error("Cashfree credentials missing");
                        throw new Error("Payment gateway configuration error");
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    orderId = "order_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
                    orderRequest = {
                        order_id: orderId,
                        order_amount: args.amount,
                        order_currency: args.currency,
                        customer_details: {
                            customer_id: args.userId,
                            customer_phone: "9999999999", // Will be updated from user profile
                        },
                        order_meta: {
                            return_url: "".concat(process.env.CONVEX_SITE_URL, "/payment-status?order_id={order_id}"),
                        },
                        order_note: "".concat(args.planName, " - ").concat(args.duration, " days"),
                    };
                    apiUrl = environment === "production"
                        ? "https://api.cashfree.com/pg/orders"
                        : "https://sandbox.cashfree.com/pg/orders";
                    return [4 /*yield*/, fetch(apiUrl, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "x-client-id": clientId,
                                "x-client-secret": clientSecret,
                                "x-api-version": "2023-08-01",
                            },
                            body: JSON.stringify(orderRequest),
                        })];
                case 2:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.text()];
                case 3:
                    errorData = _a.sent();
                    console.error("Cashfree order creation failed:", errorData);
                    throw new Error("Failed to create order: ".concat(response.statusText));
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    orderData = _a.sent();
                    console.log("Cashfree order created successfully:", orderData.order_id);
                    return [2 /*return*/, {
                            orderId: orderData.order_id,
                            paymentSessionId: orderData.payment_session_id,
                            orderStatus: orderData.order_status,
                        }];
                case 6:
                    error_1 = _a.sent();
                    console.error("Cashfree order creation error:", error_1);
                    throw new Error("Failed to create order: ".concat(error_1.message));
                case 7: return [2 /*return*/];
            }
        });
    }); },
});
exports.verifyPayment = (0, server_1.action)({
    args: {
        orderId: values_1.v.string(),
        userId: values_1.v.string(),
        planName: values_1.v.string(),
        amount: values_1.v.number(),
        duration: values_1.v.number(),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var clientId, clientSecret, environment, apiUrl, response, orderData, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    clientId = process.env.CASHFREE_CLIENT_ID;
                    clientSecret = process.env.CASHFREE_CLIENT_SECRET;
                    environment = process.env.CASHFREE_ENVIRONMENT || "sandbox";
                    if (!clientId || !clientSecret) {
                        console.error("Cashfree credentials missing");
                        throw new Error("Payment verification configuration error");
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    apiUrl = environment === "production"
                        ? "https://api.cashfree.com/pg/orders/".concat(args.orderId)
                        : "https://sandbox.cashfree.com/pg/orders/".concat(args.orderId);
                    return [4 /*yield*/, fetch(apiUrl, {
                            method: "GET",
                            headers: {
                                "x-client-id": clientId,
                                "x-client-secret": clientSecret,
                                "x-api-version": "2023-08-01",
                            },
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to verify payment");
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    orderData = _a.sent();
                    if (!(orderData.order_status === "PAID")) return [3 /*break*/, 5];
                    console.log("Payment verified successfully:", args.orderId);
                    // Create subscription
                    return [4 /*yield*/, ctx.runMutation(api_1.internal.cashfreeInternal.createSubscription, {
                            userId: args.userId,
                            planName: args.planName,
                            amount: args.amount,
                            duration: args.duration,
                            paymentId: orderData.cf_order_id || args.orderId,
                            orderId: args.orderId,
                        })];
                case 4:
                    // Create subscription
                    _a.sent();
                    return [2 /*return*/, { success: true, status: "PAID" }];
                case 5: return [2 /*return*/, { success: false, status: orderData.order_status }];
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_2 = _a.sent();
                    console.error("Payment verification error:", error_2);
                    throw new Error("Payment verification failed: ".concat(error_2.message));
                case 8: return [2 /*return*/];
            }
        });
    }); },
});
