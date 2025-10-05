import { Toaster } from "@/components/ui/sonner";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import AuthPage from "@/pages/Auth.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
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
import "./types/global.d.ts";
import StudentNav from "./components/StudentNav.tsx";
import StudentDashboard from "./pages/StudentDashboard.tsx";
import MockTests from "./pages/MockTests.tsx";
import PYQSets from "./pages/PYQSets.tsx";
import Practice from "./pages/Practice.tsx";
import SubscriptionPlans from "./pages/SubscriptionPlans.tsx";
import AIQuestions from "./pages/AIQuestions.tsx";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <StudentNav />
      <main className="flex-1 lg:ml-64">{children}</main>
    </div>
  );
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64">{children}</main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VlyToolbar />
    <InstrumentationProvider>
      <ConvexAuthProvider client={convex}>
        <BrowserRouter>
          <RouteSyncer />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<StudentLayout><StudentDashboard /></StudentLayout>} />
            <Route path="/subscription" element={<StudentLayout><SubscriptionPlans /></StudentLayout>} />
            <Route path="/tests/mock" element={<StudentLayout><MockTests /></StudentLayout>} />
            <Route path="/tests/pyq" element={<StudentLayout><PYQSets /></StudentLayout>} />
            <Route path="/tests/ai" element={<StudentLayout><AIQuestions /></StudentLayout>} />
            <Route path="/practice" element={<StudentLayout><Practice /></StudentLayout>} />
            <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
            <Route path="/admin/content" element={<AdminLayout><ContentManagement /></AdminLayout>} />
            <Route path="/admin/questions" element={<AdminLayout><QuestionManagement /></AdminLayout>} />
            <Route path="/admin/analytics" element={<AdminLayout><UserAnalytics /></AdminLayout>} />
            <Route path="/admin/subscriptions" element={<AdminLayout><SubscriptionManagement /></AdminLayout>} />
            <Route path="/admin/notifications" element={<AdminLayout><NotificationCenter /></AdminLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </ConvexAuthProvider>
    </InstrumentationProvider>
  </StrictMode>,
);