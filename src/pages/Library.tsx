import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import StudentNav from "@/components/StudentNav";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, BookOpen, Search, X, PlayCircle, Crown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Id } from "@/convex/_generated/dataModel";

export default function Library() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null);
  const [unlockDialogOpen, setUnlockDialogOpen] = useState(false);
  const [selectedPdfId, setSelectedPdfId] = useState<Id<"library"> | null>(null);
  const [isAdLoading, setIsAdLoading] = useState(false);
  const [hasEnteredWithAds, setHasEnteredWithAds] = useState(false);
  
  const libraryAccess = useQuery(api.library.checkLibraryAccess);
  const pdfsBySubject = useQuery(api.library.getPDFsBySubject);
  const searchResults = useQuery(
    api.library.getAllLibraryPDFs,
    searchQuery ? { searchQuery } : "skip"
  );
  
  const unlockPdf = useMutation(api.library.unlockLibraryPDFWithAd);

  const hasAccess = libraryAccess?.hasAccess ?? false;
  const isYearlyUser = libraryAccess?.isYearlyUser ?? false;
  const dailyAdUnlocksUsed = libraryAccess?.dailyAdUnlocksUsed ?? 0;
  const unlockedPdfIds = libraryAccess?.unlockedPdfIds ?? [];

  // Allow ad unlocks for all non-yearly users (Free, Starter, Premium)
  const canUnlockWithAd = !isYearlyUser && dailyAdUnlocksUsed < 2;
  
  // Show entry gate for non-yearly users who haven't clicked "Continue with Ads"
  const showEntryGate = libraryAccess !== undefined && !isYearlyUser && !hasEnteredWithAds;

  const subjects = [
    "Hematology",
    "Biochemistry",
    "Microbiology",
    "Clinical Pathology",
    "Blood Bank",
    "Histopathology",
    "Immunology",
    "Lab Instruments",
  ];

  const handlePdfClick = (pdf: any) => {
    if (hasAccess || unlockedPdfIds.includes(pdf._id)) {
      setSelectedPDF(pdf.pdf_url);
    } else {
      setSelectedPdfId(pdf._id);
      setUnlockDialogOpen(true);
    }
  };

  const handleAdUnlock = async () => {
    if (!selectedPdfId) return;
    
    setIsAdLoading(true);
    // Simulate Ad Watch
    setTimeout(async () => {
      try {
        await unlockPdf({ pdfId: selectedPdfId });
        toast.success("PDF Unlocked!");
        setUnlockDialogOpen(false);
        // Find the PDF URL
        let pdfUrl = "";
        if (searchQuery && searchResults) {
          const pdf = searchResults.find((p: any) => p._id === selectedPdfId);
          if (pdf) pdfUrl = pdf.pdf_url;
        } else if (pdfsBySubject) {
          Object.values(pdfsBySubject).forEach((list: any) => {
            const pdf = list.find((p: any) => p._id === selectedPdfId);
            if (pdf) pdfUrl = pdf.pdf_url;
          });
        }
        if (pdfUrl) setSelectedPDF(pdfUrl);
      } catch (error) {
        toast.error("Failed to unlock PDF. Try again.");
      } finally {
        setIsAdLoading(false);
      }
    }, 3000); // 3 second simulated ad
  };

  const displayContent = searchQuery ? searchResults : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 pb-24 relative">
      <StudentNav />
      
      {/* Entry Gate Overlay */}
      <Dialog open={showEntryGate} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md [&>button]:hidden" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">📚 Library Access</DialogTitle>
            <DialogDescription className="text-center pt-4 text-base">
              Full library access is exclusive to Yearly Plan users.
              <br /><br />
              You can continue with ads to browse and unlock up to <strong>2 PDFs daily</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-4">
            <Button 
              onClick={() => setHasEnteredWithAds(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-6 text-lg"
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              Continue with Ads
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/subscription-plans")}
              className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-50"
            >
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Yearly Plan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className={`container mx-auto px-4 py-8 max-w-7xl transition-all duration-300 relative ${showEntryGate ? "blur-xl pointer-events-none h-screen overflow-hidden" : ""}`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            📚 Library
          </h1>
          <p className="text-white/90 text-sm md:text-base">
            {isYearlyUser
              ? "Access all study materials"
              : "Exclusive for Yearly Plan users"}
          </p>
        </motion.div>

        {/* Access Warning for Non-Yearly Users */}
        {!isYearlyUser && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 sticky top-4 z-30"
          >
            <Card className="glass-card border-yellow-400/50 bg-yellow-500/20 backdrop-blur-md">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <Lock className="h-12 w-12 text-yellow-300 flex-shrink-0" />
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                      Library Access is Exclusive to Yearly Plan
                    </h3>
                    <p className="text-white/90 text-sm md:text-base">
                      Upgrade to Yearly Plan for unlimited access, or watch ads to unlock specific notes (2/day).
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate("/subscription-plans")}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold px-6 py-3 flex-shrink-0"
                  >
                    Upgrade to Yearly Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
            <Input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 py-6 text-base md:text-lg glass-card border-white/30 bg-white/20 text-white placeholder:text-white/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-5 w-5 text-white/60 hover:text-white" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="relative transition-all duration-500">
          
          {/* Search Results */}
          {searchQuery && displayContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
                Search Results ({displayContent.length})
              </h2>
              {displayContent.length === 0 ? (
                <Card className="glass-card border-white/30 bg-white/20">
                  <CardContent className="p-8 text-center">
                    <p className="text-white text-lg">No results found</p>
                  </CardContent>
                </Card>
              ) : (
                displayContent.map((pdf: any) => (
                  <Card
                    key={pdf._id}
                    className="glass-card border-white/30 bg-white/20 hover:bg-white/30 transition-all cursor-pointer"
                    onClick={() => handlePdfClick(pdf)}
                  >
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <BookOpen className="h-5 w-5 text-white flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">
                            {pdf.title}
                          </p>
                          <p className="text-white/70 text-sm">{pdf.subject}</p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {isYearlyUser || unlockedPdfIds.includes(pdf._id) ? (
                          <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white">
                            Open
                          </Button>
                        ) : (
                          <Lock className="h-5 w-5 text-white/60" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </motion.div>
          )}

          {/* Subject Sections */}
          {!searchQuery && pdfsBySubject && (
            <div className="space-y-6">
              {subjects.map((subject) => {
                const pdfs = pdfsBySubject[subject] || [];

                return (
                  <motion.div
                    key={subject}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="glass-card border-white/30 bg-white/20">
                      <CardHeader>
                        <CardTitle className="text-white text-xl md:text-2xl">
                          {subject}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {pdfs.length === 0 ? (
                          <p className="text-white/60 text-center py-4 text-sm">
                            No PDFs available in this section yet
                          </p>
                        ) : (
                          pdfs.map((pdf: any) => (
                            <div
                              key={pdf._id}
                              onClick={() => handlePdfClick(pdf)}
                              className="flex items-center justify-between gap-4 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <BookOpen className="h-5 w-5 text-white flex-shrink-0" />
                                <p className="text-white font-medium truncate">
                                  {pdf.title}
                                </p>
                              </div>
                              <div className="flex-shrink-0">
                                {isYearlyUser || unlockedPdfIds.includes(pdf._id) ? (
                                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                                    Open
                                  </Button>
                                ) : (
                                  <Lock className="h-4 w-4 text-white/60" />
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Unlock Dialog */}
      <Dialog open={unlockDialogOpen} onOpenChange={setUnlockDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Unlock Study Material</DialogTitle>
            <DialogDescription>
              This content is exclusive to Yearly Plan users. You can unlock it by watching an ad.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="text-sm font-medium">Daily Ad Unlocks Used</span>
              <span className="text-sm font-bold">{dailyAdUnlocksUsed} / 2</span>
            </div>
            
            {canUnlockWithAd ? (
              <Button 
                onClick={handleAdUnlock} 
                disabled={isAdLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                {isAdLoading ? (
                  "Watching Ad..."
                ) : (
                  <>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Watch Ad to Unlock
                  </>
                )}
              </Button>
            ) : (
              <div className="text-center text-red-500 text-sm font-medium">
                Daily unlock limit reached. Come back tomorrow or upgrade!
              </div>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => {
                setUnlockDialogOpen(false);
                navigate("/subscription-plans");
              }}
              className="w-full border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50"
            >
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Yearly Plan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* PDF Viewer Modal */}
      <AnimatePresence>
        {selectedPDF && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedPDF(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full h-full max-w-6xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 bg-gray-100 border-b">
                <h3 className="font-bold text-lg">PDF Viewer</h3>
                <Button
                  onClick={() => setSelectedPDF(null)}
                  variant="ghost"
                  size="icon"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <iframe
                src={selectedPDF}
                className="w-full h-[calc(100%-60px)]"
                title="PDF Viewer"
                allow="autoplay"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MobileBottomNav />
    </div>
  );
}