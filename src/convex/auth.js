"use strict";
// THIS FILE IS READ ONLY. Do not touch this file unless you are correctly adding a new auth provider in accordance to the vly auth documentation
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = exports.store = exports.signOut = exports.signIn = exports.auth = void 0;
var server_1 = require("@convex-dev/auth/server");
var Anonymous_1 = require("@convex-dev/auth/providers/Anonymous");
var emailOtp_1 = require("./auth/emailOtp");
exports.auth = (_a = (0, server_1.convexAuth)({
    providers: [emailOtp_1.emailOtp, Anonymous_1.Anonymous],
}), _a.auth), exports.signIn = _a.signIn, exports.signOut = _a.signOut, exports.store = _a.store, exports.isAuthenticated = _a.isAuthenticated;
