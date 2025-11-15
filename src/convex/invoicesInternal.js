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
exports.updateInvoiceEmailStatus = exports.createInvoice = void 0;
var server_1 = require("./_generated/server");
var values_1 = require("convex/values");
// Internal mutation to create invoice record
exports.createInvoice = (0, server_1.internalMutation)({
    args: {
        userId: values_1.v.id("users"),
        subscriptionId: values_1.v.id("subscriptions"),
        paymentId: values_1.v.string(),
        planName: values_1.v.string(),
        amount: values_1.v.number(),
        duration: values_1.v.number(),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var timestamp, dateStr, randomSuffix, invoiceNumber, invoiceId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    timestamp = Date.now();
                    dateStr = new Date(timestamp).toISOString().slice(0, 10).replace(/-/g, "");
                    randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
                    invoiceNumber = "INV-".concat(dateStr, "-").concat(randomSuffix);
                    return [4 /*yield*/, ctx.db.insert("invoices", {
                            invoiceNumber: invoiceNumber,
                            userId: args.userId,
                            subscriptionId: args.subscriptionId,
                            paymentId: args.paymentId,
                            planName: args.planName,
                            amount: args.amount,
                            duration: args.duration,
                            issuedDate: timestamp,
                            emailSent: false,
                        })];
                case 1:
                    invoiceId = _a.sent();
                    return [2 /*return*/, { invoiceId: invoiceId, invoiceNumber: invoiceNumber, issuedDate: timestamp }];
            }
        });
    }); },
});
// Internal mutation to update invoice email status
exports.updateInvoiceEmailStatus = (0, server_1.internalMutation)({
    args: {
        invoiceNumber: values_1.v.string(),
        emailSent: values_1.v.boolean(),
        emailSentAt: values_1.v.optional(values_1.v.number()),
        error: values_1.v.optional(values_1.v.string()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var invoice, updates;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db
                        .query("invoices")
                        .withIndex("by_invoice_number", function (q) { return q.eq("invoiceNumber", args.invoiceNumber); })
                        .unique()];
                case 1:
                    invoice = _a.sent();
                    if (!invoice) {
                        throw new Error("Invoice not found");
                    }
                    updates = {
                        emailSent: args.emailSent,
                    };
                    if (args.emailSentAt) {
                        updates.emailSentAt = args.emailSentAt;
                    }
                    if (args.error) {
                        updates.emailError = args.error;
                    }
                    return [4 /*yield*/, ctx.db.patch(invoice._id, updates)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, { success: true }];
            }
        });
    }); },
});
