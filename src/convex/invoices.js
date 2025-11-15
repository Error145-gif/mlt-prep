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
exports.sendInvoiceEmail = void 0;
var values_1 = require("convex/values");
var server_1 = require("./_generated/server");
var api_1 = require("./_generated/api");
var resend_1 = require("resend");
// Action to send invoice email
exports.sendInvoiceEmail = (0, server_1.action)({
    args: {
        userId: values_1.v.id("users"),
        invoiceNumber: values_1.v.string(),
        userName: values_1.v.string(),
        userEmail: values_1.v.string(),
        planName: values_1.v.string(),
        amount: values_1.v.number(),
        duration: values_1.v.number(),
        transactionId: values_1.v.string(),
        issuedDate: values_1.v.number(),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var resend, date, htmlContent, _a, data, error, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    resend = new resend_1.Resend(process.env.RESEND_API_KEY);
                    date = new Date(args.issuedDate).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    });
                    htmlContent = "\n<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Invoice - MLT Prep</title>\n</head>\n<body style=\"margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;\">\n  <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color: #f4f4f4; padding: 20px;\">\n    <tr>\n      <td align=\"center\">\n        <table width=\"600\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);\">\n          <!-- Header -->\n          <tr>\n            <td style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;\">\n              <h1 style=\"color: #ffffff; margin: 0; font-size: 28px;\">MLT Prep</h1>\n              <p style=\"color: #ffffff; margin: 10px 0 0 0; font-size: 16px;\">Payment Invoice</p>\n            </td>\n          </tr>\n          \n          <!-- Invoice Details -->\n          <tr>\n            <td style=\"padding: 30px;\">\n              <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\n                <tr>\n                  <td>\n                    <p style=\"margin: 0 0 5px 0; color: #666; font-size: 14px;\">Invoice Number</p>\n                    <p style=\"margin: 0 0 20px 0; color: #333; font-size: 18px; font-weight: bold;\">".concat(args.invoiceNumber, "</p>\n                  </td>\n                  <td align=\"right\">\n                    <p style=\"margin: 0 0 5px 0; color: #666; font-size: 14px;\">Date</p>\n                    <p style=\"margin: 0 0 20px 0; color: #333; font-size: 16px;\">").concat(date, "</p>\n                  </td>\n                </tr>\n              </table>\n              \n              <div style=\"border-top: 2px solid #f0f0f0; margin: 20px 0;\"></div>\n              \n              <!-- Customer Details -->\n              <h3 style=\"color: #333; margin: 0 0 15px 0; font-size: 18px;\">Bill To:</h3>\n              <p style=\"margin: 0 0 5px 0; color: #333; font-size: 16px; font-weight: bold;\">").concat(args.userName, "</p>\n              <p style=\"margin: 0 0 20px 0; color: #666; font-size: 14px;\">").concat(args.userEmail, "</p>\n              \n              <div style=\"border-top: 2px solid #f0f0f0; margin: 20px 0;\"></div>\n              \n              <!-- Subscription Details -->\n              <h3 style=\"color: #333; margin: 0 0 15px 0; font-size: 18px;\">Subscription Details:</h3>\n              <table width=\"100%\" cellpadding=\"10\" cellspacing=\"0\" style=\"background-color: #f9f9f9; border-radius: 6px;\">\n                <tr>\n                  <td style=\"color: #666; font-size: 14px; border-bottom: 1px solid #e0e0e0;\">Plan Name</td>\n                  <td align=\"right\" style=\"color: #333; font-size: 14px; font-weight: bold; border-bottom: 1px solid #e0e0e0;\">").concat(args.planName, "</td>\n                </tr>\n                <tr>\n                  <td style=\"color: #666; font-size: 14px; border-bottom: 1px solid #e0e0e0;\">Duration</td>\n                  <td align=\"right\" style=\"color: #333; font-size: 14px; border-bottom: 1px solid #e0e0e0;\">").concat(args.duration, " days</td>\n                </tr>\n                <tr>\n                  <td style=\"color: #666; font-size: 14px; border-bottom: 1px solid #e0e0e0;\">Transaction ID</td>\n                  <td align=\"right\" style=\"color: #333; font-size: 14px; border-bottom: 1px solid #e0e0e0;\">").concat(args.transactionId, "</td>\n                </tr>\n                <tr>\n                  <td style=\"color: #666; font-size: 16px; font-weight: bold; padding-top: 15px;\">Total Amount Paid</td>\n                  <td align=\"right\" style=\"color: #667eea; font-size: 20px; font-weight: bold; padding-top: 15px;\">\u20B9").concat(args.amount.toFixed(2), "</td>\n                </tr>\n              </table>\n              \n              <div style=\"border-top: 2px solid #f0f0f0; margin: 30px 0 20px 0;\"></div>\n              \n              <!-- Thank You Message -->\n              <div style=\"background-color: #f0f4ff; padding: 20px; border-radius: 6px; border-left: 4px solid #667eea;\">\n                <h3 style=\"color: #667eea; margin: 0 0 10px 0; font-size: 18px;\">Thank You for Your Subscription! \uD83C\uDF89</h3>\n                <p style=\"color: #555; margin: 0; font-size: 14px; line-height: 1.6;\">\n                  We're excited to have you on board! Your subscription is now active, and you have full access to all our premium features and content.\n                </p>\n              </div>\n              \n              <!-- Support Information -->\n              <div style=\"margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;\">\n                <p style=\"color: #666; font-size: 13px; margin: 0 0 5px 0;\">Need help? Contact our support team:</p>\n                <p style=\"color: #667eea; font-size: 14px; margin: 0;\">support@mltprep.com</p>\n              </div>\n            </td>\n          </tr>\n          \n          <!-- Footer -->\n          <tr>\n            <td style=\"background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;\">\n              <p style=\"color: #999; font-size: 12px; margin: 0;\">\n                This is an automated invoice from MLT Prep.<br>\n                Please keep this for your records.\n              </p>\n            </td>\n          </tr>\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>\n    ");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, , 8]);
                    return [4 /*yield*/, resend.emails.send({
                            from: "MLT Prep <onboarding@resend.dev>",
                            to: [args.userEmail],
                            subject: "Invoice ".concat(args.invoiceNumber, " - MLT Prep Subscription"),
                            html: htmlContent,
                        })];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (!error) return [3 /*break*/, 4];
                    console.error("Failed to send invoice email:", error);
                    // Update invoice record with failure status
                    return [4 /*yield*/, ctx.runMutation(api_1.internal.invoicesInternal.updateInvoiceEmailStatus, {
                            invoiceNumber: args.invoiceNumber,
                            emailSent: false,
                            error: error.message || "Unknown error",
                        })];
                case 3:
                    // Update invoice record with failure status
                    _b.sent();
                    return [2 /*return*/, { success: false, error: error.message }];
                case 4: 
                // Update invoice record with success status
                return [4 /*yield*/, ctx.runMutation(api_1.internal.invoicesInternal.updateInvoiceEmailStatus, {
                        invoiceNumber: args.invoiceNumber,
                        emailSent: true,
                        emailSentAt: Date.now(),
                    })];
                case 5:
                    // Update invoice record with success status
                    _b.sent();
                    return [2 /*return*/, { success: true, messageId: data === null || data === void 0 ? void 0 : data.id }];
                case 6:
                    error_1 = _b.sent();
                    console.error("Exception sending invoice email:", error_1);
                    return [4 /*yield*/, ctx.runMutation(api_1.internal.invoicesInternal.updateInvoiceEmailStatus, {
                            invoiceNumber: args.invoiceNumber,
                            emailSent: false,
                            error: error_1.message || "Exception occurred",
                        })];
                case 7:
                    _b.sent();
                    return [2 /*return*/, { success: false, error: error_1.message }];
                case 8: return [2 /*return*/];
            }
        });
    }); },
});
