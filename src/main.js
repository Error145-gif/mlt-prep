"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sonner_1 = require("@/components/ui/sonner");
var vly_toolbar_readonly_tsx_1 = require("../vly-toolbar-readonly.tsx");
var instrumentation_tsx_1 = require("@/instrumentation.tsx");
var Auth_tsx_1 = require("@/pages/Auth.tsx");
var react_1 = require("@convex-dev/auth/react");
var react_2 = require("convex/react");
var react_3 = require("react");
var client_1 = require("react-dom/client");
var react_router_1 = require("react-router");
require("./index.css");
var Landing_tsx_1 = require("./pages/Landing.tsx");
var NotFound_tsx_1 = require("./pages/NotFound.tsx");
var AdminDashboard_tsx_1 = require("./pages/AdminDashboard.tsx");
var ContentManagement_tsx_1 = require("./pages/ContentManagement.tsx");
var QuestionManagement_tsx_1 = require("./pages/QuestionManagement.tsx");
var UserAnalytics_tsx_1 = require("./pages/UserAnalytics.tsx");
var SubscriptionManagement_tsx_1 = require("./pages/SubscriptionManagement.tsx");
var NotificationCenter_tsx_1 = require("./pages/NotificationCenter.tsx");
var StudentDashboard_tsx_1 = require("./pages/StudentDashboard.tsx");
var MockTests_tsx_1 = require("./pages/MockTests.tsx");
var PYQSets_tsx_1 = require("./pages/PYQSets.tsx");
var Practice_tsx_1 = require("./pages/Practice.tsx");
var SubscriptionPlans_tsx_1 = require("./pages/SubscriptionPlans.tsx");
var AIQuestions_tsx_1 = require("./pages/AIQuestions.tsx");
var Feedback_tsx_1 = require("./pages/Feedback.tsx");
var AdminFeedback_tsx_1 = require("./pages/AdminFeedback.tsx");
var CouponManagement_tsx_1 = require("./pages/CouponManagement.tsx");
var TestStart_tsx_1 = require("./pages/TestStart.tsx");
var TestResults_tsx_1 = require("./pages/TestResults.tsx");
var Profile_tsx_1 = require("./pages/Profile.tsx");
var ContactUs_tsx_1 = require("./pages/ContactUs.tsx");
var ShippingPolicy_tsx_1 = require("./pages/ShippingPolicy.tsx");
var TermsAndConditions_tsx_1 = require("./pages/TermsAndConditions.tsx");
var PrivacyPolicy_tsx_1 = require("./pages/PrivacyPolicy.tsx");
var RefundPolicy_tsx_1 = require("./pages/RefundPolicy.tsx");
var PaymentStatus_1 = require("./pages/PaymentStatus");
var PaymentSummary_1 = require("./pages/PaymentSummary");
var StudyMaterialsManagement_tsx_1 = require("./pages/StudyMaterialsManagement.tsx");
var FreeLibrary_tsx_1 = require("./pages/FreeLibrary.tsx");
var use_auth_1 = require("@/hooks/use-auth");
var SectionsManagement_tsx_1 = require("./pages/SectionsManagement.tsx");
var ImageQuestionManagement_tsx_1 = require("./pages/ImageQuestionManagement.tsx");
var convex = new react_2.ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
function ProtectedRoute(_a) {
    var children = _a.children;
    var _b = (0, use_auth_1.useAuth)(), isAuthenticated = _b.isAuthenticated, isLoading = _b.isLoading;
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>);
    }
    if (!isAuthenticated) {
        return <react_router_1.Navigate to="/auth" replace/>;
    }
    return <>{children}</>;
}
function AdminRoute(_a) {
    var children = _a.children;
    var _b = (0, use_auth_1.useAuth)(), isAuthenticated = _b.isAuthenticated, isLoading = _b.isLoading, user = _b.user;
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>);
    }
    if (!isAuthenticated || (user === null || user === void 0 ? void 0 : user.role) !== "admin") {
        return <react_router_1.Navigate to="/"/>;
    }
    return <>{children}</>;
}
(0, client_1.createRoot)(document.getElementById("root")).render(<react_3.StrictMode>
    <instrumentation_tsx_1.InstrumentationProvider>
      <react_1.ConvexAuthProvider client={convex}>
        <react_router_1.BrowserRouter>
          <react_router_1.Routes>
            <react_router_1.Route path="/" element={<Landing_tsx_1.default />}/>
            <react_router_1.Route path="/auth" element={<Auth_tsx_1.default />}/>
            <react_router_1.Route path="/student" element={<ProtectedRoute>
                  <StudentDashboard_tsx_1.default />
                </ProtectedRoute>}/>
            <react_router_1.Route path="/dashboard" element={<ProtectedRoute>
                  <react_router_1.Navigate to="/student" replace/>
                </ProtectedRoute>}/>
            <react_router_1.Route path="/admin" element={<AdminRoute>
                  <AdminDashboard_tsx_1.default />
                </AdminRoute>}/>
            {/* Student Routes */}
            <react_router_1.Route path="/tests/mock" element={<ProtectedRoute>
                  <MockTests_tsx_1.default />
                </ProtectedRoute>}/>
            <react_router_1.Route path="/tests/pyq" element={<ProtectedRoute>
                  <PYQSets_tsx_1.default />
                </ProtectedRoute>}/>
            <react_router_1.Route path="/tests/ai" element={<ProtectedRoute>
                  <AIQuestions_tsx_1.default />
                </ProtectedRoute>}/>
            <react_router_1.Route path="/practice" element={<ProtectedRoute>
                  <Practice_tsx_1.default />
                </ProtectedRoute>}/>
            <react_router_1.Route path="/subscription" element={<ProtectedRoute>
                  <SubscriptionPlans_tsx_1.default />
                </ProtectedRoute>}/>
            <react_router_1.Route path="/profile" element={<ProtectedRoute>
                  <Profile_tsx_1.default />
                </ProtectedRoute>}/>
            <react_router_1.Route path="/feedback" element={<ProtectedRoute>
                  <Feedback_tsx_1.default />
                </ProtectedRoute>}/>
            <react_router_1.Route path="/free-library" element={<ProtectedRoute>
                  <FreeLibrary_tsx_1.default />
                </ProtectedRoute>}/>
            <react_router_1.Route path="/contact-us" element={<ContactUs_tsx_1.default />}/>
            <react_router_1.Route path="/shipping-policy" element={<ShippingPolicy_tsx_1.default />}/>
            <react_router_1.Route path="/terms" element={<TermsAndConditions_tsx_1.default />}/>
            <react_router_1.Route path="/privacy" element={<PrivacyPolicy_tsx_1.default />}/>
            <react_router_1.Route path="/refund-policy" element={<RefundPolicy_tsx_1.default />}/>
            <react_router_1.Route path="/payment-status" element={<ProtectedRoute>
                  <PaymentStatus_1.default />
                </ProtectedRoute>}/>
            <react_router_1.Route path="/payment-summary" element={<ProtectedRoute>
                  <PaymentSummary_1.default />
                </ProtectedRoute>}/>
            <react_router_1.Route path="/notifications" element={<ProtectedRoute>
                  <NotificationCenter_tsx_1.default />
                </ProtectedRoute>}/>
            <react_router_1.Route path="/test-start" element={<ProtectedRoute>
                  <TestStart_tsx_1.default />
                </ProtectedRoute>}/>
            <react_router_1.Route path="/test-results" element={<ProtectedRoute>
                  <TestResults_tsx_1.default />
                </ProtectedRoute>}/>

            {/* Admin Routes */}
            <react_router_1.Route path="/admin/content" element={<AdminRoute>
                  <ContentManagement_tsx_1.default />
                </AdminRoute>}/>
            <react_router_1.Route path="/admin/questions" element={<AdminRoute>
                  <QuestionManagement_tsx_1.default />
                </AdminRoute>}/>
            <react_router_1.Route path="/admin/analytics" element={<AdminRoute>
                  <UserAnalytics_tsx_1.default />
                </AdminRoute>}/>
            <react_router_1.Route path="/admin/subscriptions" element={<AdminRoute>
                  <SubscriptionManagement_tsx_1.default />
                </AdminRoute>}/>
            <react_router_1.Route path="/admin/feedback" element={<AdminRoute>
                  <AdminFeedback_tsx_1.default />
                </AdminRoute>}/>
            <react_router_1.Route path="/admin/notifications" element={<AdminRoute>
                  <NotificationCenter_tsx_1.default />
                </AdminRoute>}/>
            <react_router_1.Route path="/admin/coupons" element={<AdminRoute>
                  <CouponManagement_tsx_1.default />
                </AdminRoute>}/>
            <react_router_1.Route path="/admin/study-materials" element={<AdminRoute>
                  <StudyMaterialsManagement_tsx_1.default />
                </AdminRoute>}/>
            <react_router_1.Route path="/admin/sections" element={<AdminRoute>
                  <SectionsManagement_tsx_1.default />
                </AdminRoute>}/>
            <react_router_1.Route path="/admin/image-questions" element={<AdminRoute>
                  <ImageQuestionManagement_tsx_1.default />
                </AdminRoute>}/>

            <react_router_1.Route path="*" element={<NotFound_tsx_1.default />}/>
          </react_router_1.Routes>
          <sonner_1.Toaster />
          <vly_toolbar_readonly_tsx_1.VlyToolbar />
        </react_router_1.BrowserRouter>
      </react_1.ConvexAuthProvider>
    </instrumentation_tsx_1.InstrumentationProvider>
  </react_3.StrictMode>);
