import { Toaster } from "@/components/ui/sonner";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import "./index.css";

import { useAuth } from "@/hooks/use-auth";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy load all pages for code splitting
const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("@/pages/Auth.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.tsx"));
const ContentManagement = lazy(() => import("./pages/ContentManagement.tsx"));
const QuestionManagement = lazy(() => import("./pages/QuestionManagement.tsx"));
const UserAnalytics = lazy(() => import("./pages/UserAnalytics.tsx"));
const SubscriptionManagement = lazy(() => import("./pages/SubscriptionManagement.tsx"));
const NotificationCenter = lazy(() => import("./pages/NotificationCenter.tsx"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard.tsx"));
const MockTests = lazy(() => import("./pages/MockTests.tsx"));
const PYQSets = lazy(() => import("./pages/PYQSets.tsx"));
const Practice = lazy(() => import("./pages/Practice.tsx"));
const SubscriptionPlans = lazy(() => import("./pages/SubscriptionPlans.tsx"));
const AIQuestions = lazy(() => import("./pages/AIQuestions.tsx"));
const Feedback = lazy(() => import("./pages/Feedback.tsx"));
const AdminFeedback = lazy(() => import("./pages/AdminFeedback.tsx"));
const CouponManagement = lazy(() => import("./pages/CouponManagement.tsx"));
const TestStart = lazy(() => import("./pages/TestStart.tsx"));
const TestResults = lazy(() => import("./pages/TestResults.tsx"));
const Profile = lazy(() => import("./pages/Profile.tsx"));
const ContactUs = lazy(() => import("./pages/ContactUs.tsx"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy.tsx"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions.tsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.tsx"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy.tsx"));
const PaymentStatus = lazy(() => import("./pages/PaymentStatus.tsx"));
const PaymentSummary = lazy(() => import("./pages/PaymentSummary.tsx"));
const StudyMaterialsManagement = lazy(() => import("./pages/StudyMaterialsManagement.tsx"));
const FreeLibrary = lazy(() => import("./pages/FreeLibrary.tsx"));
const Library = lazy(() => import("./pages/Library.tsx"));
const LibraryManagement = lazy(() => import("./pages/LibraryManagement.tsx"));
const SectionsManagement = lazy(() => import("./pages/SectionsManagement.tsx"));
const MLTExam = lazy(() => import("./pages/MLTExam.tsx"));
const LabTechnicianExam = lazy(() => import("./pages/LabTechnicianExam.tsx"));
const DMLTExam = lazy(() => import("./pages/DMLTExam.tsx"));
const WeeklyTest = lazy(() => import("./pages/WeeklyTest.tsx"));
const WeeklyLeaderboard = lazy(() => import("./pages/WeeklyLeaderboard.tsx"));
const ImageQuestionManagement = lazy(() => import("./pages/ImageQuestionManagement.tsx"));
const ReportedErrors = lazy(() => import("./pages/ReportedErrors.tsx"));
const WeeklyTestManagement = lazy(() => import("./pages/WeeklyTestManagement.tsx"));
const OverallAnalytics = lazy(() => import("./pages/OverallAnalytics.tsx"));
const ReferralAnalytics = lazy(() => import("./pages/ReferralAnalytics.tsx"));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
      <div className="text-white text-xl">Loading...</div>
    </div>
  </div>
);

// Get Convex URL from environment variable with fallback
const convexUrl = (import.meta as any).env?.VITE_CONVEX_URL ?? "https://successful-bandicoot-650.convex.cloud";
const convex = new ConvexReactClient(convexUrl);

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <InstrumentationProvider>
      <ConvexAuthProvider client={convex}>
        <ErrorBoundary>
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route
                  path="/student"
                  element={
                    <ProtectedRoute>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Navigate to="/student" replace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <AdminRoute>
                      <UserAnalytics />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/user-analytics"
                  element={
                    <ProtectedRoute>
                      <UserAnalytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/overall-analytics"
                  element={
                    <ProtectedRoute>
                      <OverallAnalytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/questions"
                  element={
                    <AdminRoute>
                      <QuestionManagement />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/weekly-tests"
                  element={
                    <AdminRoute>
                      <WeeklyTestManagement />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/content"
                  element={
                    <AdminRoute>
                      <ContentManagement />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/study-materials"
                  element={
                    <AdminRoute>
                      <StudyMaterialsManagement />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <AdminRoute>
                      <OverallAnalytics />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/subscriptions"
                  element={
                    <AdminRoute>
                      <SubscriptionManagement />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/coupons"
                  element={
                    <AdminRoute>
                      <CouponManagement />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/referrals"
                  element={
                    <AdminRoute>
                      <ReferralAnalytics />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/notifications"
                  element={
                    <AdminRoute>
                      <NotificationCenter />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/feedback"
                  element={
                    <AdminRoute>
                      <AdminFeedback />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/image-questions"
                  element={
                    <AdminRoute>
                      <ImageQuestionManagement />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/reported-errors"
                  element={
                    <AdminRoute>
                      <ReportedErrors />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/sections"
                  element={
                    <AdminRoute>
                      <SectionsManagement />
                    </AdminRoute>
                  }
                />

                {/* Student Routes */}
                <Route
                  path="/tests"
                  element={
                    <ProtectedRoute>
                      <Navigate to="/student" replace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tests/mock"
                  element={
                    <ProtectedRoute>
                      <MockTests />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tests/pyq"
                  element={
                    <ProtectedRoute>
                      <PYQSets />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tests/ai"
                  element={
                    <ProtectedRoute>
                      <AIQuestions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/practice"
                  element={
                    <ProtectedRoute>
                      <Practice />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/subscription"
                  element={
                    <ProtectedRoute>
                      <SubscriptionPlans />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/subscription-plans"
                  element={
                    <ProtectedRoute>
                      <SubscriptionPlans />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/feedback"
                  element={
                    <ProtectedRoute>
                      <Feedback />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/free-library"
                  element={
                    <ProtectedRoute>
                      <FreeLibrary />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/library"
                  element={
                    <ProtectedRoute>
                      <Library />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/library"
                  element={
                    <AdminRoute>
                      <LibraryManagement />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/contact-us"
                  element={<ContactUs />}
                />
                <Route
                  path="/shipping-policy"
                  element={<ShippingPolicy />}
                />
                <Route
                  path="/terms"
                  element={<TermsAndConditions />}
                />
                <Route
                  path="/privacy"
                  element={<PrivacyPolicy />}
                />
                <Route
                  path="/refund-policy"
                  element={<RefundPolicy />}
                />
                <Route
                  path="/payment-status"
                  element={
                    <ProtectedRoute>
                      <PaymentStatus />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payment-summary"
                  element={
                    <ProtectedRoute>
                      <PaymentSummary />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <NotificationCenter />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/test-start"
                  element={
                    <ProtectedRoute>
                      <TestStart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/test-results"
                  element={
                    <ProtectedRoute>
                      <TestResults />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/weekly-test"
                  element={
                    <ProtectedRoute>
                      <WeeklyTest />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/weekly-leaderboard"
                  element={
                    <ProtectedRoute>
                      <WeeklyLeaderboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/mlt-exam" element={<MLTExam />} />
                <Route path="/lab-technician-exam" element={<LabTechnicianExam />} />
                <Route path="/dmlt-exam" element={<DMLTExam />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Toaster />
            <VlyToolbar />
          </BrowserRouter>
        </ErrorBoundary>
      </ConvexAuthProvider>
    </InstrumentationProvider>
  </StrictMode>
);