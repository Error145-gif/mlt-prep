/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as aiQuestions from "../aiQuestions.js";
import type * as analytics from "../analytics.js";
import type * as auth from "../auth.js";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as authHelpers from "../authHelpers.js";
import type * as cashfree from "../cashfree.js";
import type * as cashfreeInternal from "../cashfreeInternal.js";
import type * as content from "../content.js";
import type * as coupons from "../coupons.js";
import type * as debug from "../debug.js";
import type * as debugPYQ from "../debugPYQ.js";
import type * as emails from "../emails.js";
import type * as feedback from "../feedback.js";
import type * as http from "../http.js";
import type * as invoices from "../invoices.js";
import type * as invoicesInternal from "../invoicesInternal.js";
import type * as notifications from "../notifications.js";
import type * as questions from "../questions.js";
import type * as razorpay from "../razorpay.js";
import type * as razorpayInternal from "../razorpayInternal.js";
import type * as sections from "../sections.js";
import type * as seedTestData from "../seedTestData.js";
import type * as student from "../student.js";
import type * as studyMaterials from "../studyMaterials.js";
import type * as subscriptions from "../subscriptions.js";
import type * as topics from "../topics.js";
import type * as userDataReset from "../userDataReset.js";
import type * as userManagement from "../userManagement.js";
import type * as users from "../users.js";
import type * as weeklyTests from "../weeklyTests.js";
import type * as weeklyTestsCron from "../weeklyTestsCron.js";
import type * as weeklyTestsCronActions from "../weeklyTestsCronActions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  aiQuestions: typeof aiQuestions;
  analytics: typeof analytics;
  auth: typeof auth;
  "auth/emailOtp": typeof auth_emailOtp;
  authHelpers: typeof authHelpers;
  cashfree: typeof cashfree;
  cashfreeInternal: typeof cashfreeInternal;
  content: typeof content;
  coupons: typeof coupons;
  debug: typeof debug;
  debugPYQ: typeof debugPYQ;
  emails: typeof emails;
  feedback: typeof feedback;
  http: typeof http;
  invoices: typeof invoices;
  invoicesInternal: typeof invoicesInternal;
  notifications: typeof notifications;
  questions: typeof questions;
  razorpay: typeof razorpay;
  razorpayInternal: typeof razorpayInternal;
  sections: typeof sections;
  seedTestData: typeof seedTestData;
  student: typeof student;
  studyMaterials: typeof studyMaterials;
  subscriptions: typeof subscriptions;
  topics: typeof topics;
  userDataReset: typeof userDataReset;
  userManagement: typeof userManagement;
  users: typeof users;
  weeklyTests: typeof weeklyTests;
  weeklyTestsCron: typeof weeklyTestsCron;
  weeklyTestsCronActions: typeof weeklyTestsCronActions;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
