import { Toaster } from "@/components/ui/sonner";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import AuthPage from "@/pages/Auth.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import "./index.css";

import Landing from "./pages/Landing.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import ContentManagement from "./pages/ContentManagement.tsx";
import QuestionManagement from "./pages/QuestionManagement.tsx";
import UserAnalytics from "./pages/UserAnalytics.tsx";
import SubscriptionManagement from "./pages/SubscriptionManagement.tsx";
import NotificationCenter from "./pages/NotificationCenter.tsx";
import AdminSidebar from "./components/AdminSidebar.tsx";
import StudentNav from "./components/StudentNav.tsx";
import StudentDashboard from "./pages/StudentDashboard.tsx";
import MockTests from "./pages/MockTests.tsx";
import PYQSets from "./pages/PYQSets.tsx";
import Practice from "./pages/Practice.tsx";
import SubscriptionPlans from "./pages/SubscriptionPlans.tsx";
import AIQuestions from "./pages/AIQuestions.tsx";
import Feedback from "./pages/Feedback.tsx";
import AdminFeedback from "./pages/AdminFeedback.tsx";
import CouponManagement from "./pages/CouponManagement.tsx";
import TestStart from "./pages/TestStart.tsx";
import TestResults from "./pages/TestResults.tsx";
import Profile from "./pages/Profile.tsx";
import ContactUs from "./pages/ContactUs.tsx";
import ShippingPolicy from "./pages/ShippingPolicy.tsx";
import TermsAndConditions from "./pages/TermsAndConditions.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import RefundPolicy from "./pages/RefundPolicy.tsx";
import PaymentStatus from "./pages/PaymentStatus";
import PaymentSummary from "./pages/PaymentSummary";
import StudyMaterialsManagement from "./pages/StudyMaterialsManagement.tsx";
import FreeLibrary from "./pages/FreeLibrary.tsx";
import { useAuth } from "@/hooks/use-auth";
import SectionsManagement from "./pages/SectionsManagement.tsx";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
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
        <BrowserRouter>
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
            {/* Student Routes */}
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
              path="/test-start/:testId"
              element={
                <ProtectedRoute>
                  <TestStart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test-results/:testId"
              element={
                <ProtectedRoute>
                  <TestResults />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/content"
              element={
                <AdminRoute>
                  <ContentManagement />
                </AdminRoute>
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
              path="/admin/analytics"
              element={
                <AdminRoute>
                  <UserAnalytics />
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
              path="/admin/feedback"
              element={
                <AdminRoute>
                  <AdminFeedback />
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
              path="/admin/study-materials"
              element={
                <AdminRoute>
                  <StudyMaterialsManagement />
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

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <VlyToolbar />
        </BrowserRouter>
      </ConvexAuthProvider>
    </InstrumentationProvider>
  </StrictMode>
);
