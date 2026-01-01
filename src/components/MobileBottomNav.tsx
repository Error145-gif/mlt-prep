import { Home, FileText, Brain, BookOpen, MoreHorizontal } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 via-purple-700 to-pink-600 border-t border-white/20 pb-safe md:hidden">
      <div className="flex items-center justify-around px-2 py-3">
        {/* Home */}
        <button
          onClick={() => navigate("/dashboard")}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
            isActive("/dashboard")
              ? "bg-white/20 text-white"
              : "text-white/70 hover:text-white hover:bg-white/10"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs font-medium">Home</span>
        </button>

        {/* Tests */}
        <button
          onClick={() => navigate("/tests/mock")}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
            isActive("/tests/mock")
              ? "bg-white/20 text-white"
              : "text-white/70 hover:text-white hover:bg-white/10"
          }`}
        >
          <FileText className="h-5 w-5" />
          <span className="text-xs font-medium">Tests</span>
        </button>

        {/* AI */}
        <button
          onClick={() => navigate("/tests/ai")}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
            isActive("/tests/ai")
              ? "bg-white/20 text-white"
              : "text-white/70 hover:text-white hover:bg-white/10"
          }`}
        >
          <Brain className="h-5 w-5" />
          <span className="text-xs font-medium">AI</span>
        </button>

        {/* PYQ */}
        <button
          onClick={() => navigate("/tests/pyq")}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
            isActive("/tests/pyq")
              ? "bg-white/20 text-white"
              : "text-white/70 hover:text-white hover:bg-white/10"
          }`}
        >
          <BookOpen className="h-5 w-5" />
          <span className="text-xs font-medium">PYQ</span>
        </button>

        {/* Library */}
        <button
          onClick={() => navigate("/library")}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
            isActive("/library")
              ? "bg-white/20 text-white"
              : "text-white/70 hover:text-white hover:bg-white/10"
          }`}
        >
          <BookOpen className="h-5 w-5" />
          <span className="text-xs font-medium">Library</span>
        </button>

        {/* More Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all">
              <MoreHorizontal className="h-5 w-5" />
              <span className="text-xs font-medium">More</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600 border-white/20">
            <SheetHeader>
              <SheetTitle className="text-white text-center">More Options</SheetTitle>
            </SheetHeader>
            <div className="space-y-3 mt-6">
              <Button
                onClick={() => navigate("/subscription-plans")}
                className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-6 text-lg"
              >
                🔥 Upgrade Plan
              </Button>
              <Button
                onClick={() => navigate("/feedback")}
                variant="outline"
                className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                💬 Feedback
              </Button>
              <Button
                onClick={() => navigate("/contact-us")}
                variant="outline"
                className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                📧 Contact Us
              </Button>
              <Button
                onClick={() => navigate("/profile")}
                variant="outline"
                className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                👤 Profile
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}