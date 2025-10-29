import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Trash2, Eye, Loader2, Menu, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { Id } from "@/convex/_generated/dataModel";

export default function StudyMaterialsManagement() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const materials = useQuery(api.studyMaterials.getAllStudyMaterialsAdmin);
  const uploadMaterial = useMutation(api.studyMaterials.uploadStudyMaterial);
  const deleteMaterial = useMutation(api.studyMaterials.deleteStudyMaterial);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("study_material");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please select a PDF file");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!selectedFile) {
      toast.error("Please select a PDF file");
      return;
    }

    setIsUploading(true);
    try {
      // Step 1: Generate upload URL using Convex's storage endpoint
      const convexUrl = import.meta.env.VITE_CONVEX_URL;
      const uploadUrlResponse = await fetch(`${convexUrl}/api/storage/generateUploadUrl`, {
        method: "POST",
      });

      if (!uploadUrlResponse.ok) {
        const errorText = await uploadUrlResponse.text();
        console.error("Upload URL generation failed:", uploadUrlResponse.status, errorText);
        throw new Error(`Failed to generate upload URL: ${uploadUrlResponse.status}`);
      }

      const uploadUrlData = await uploadUrlResponse.json();
      console.log("Upload URL data:", uploadUrlData);

      if (!uploadUrlData.uploadUrl) {
        throw new Error("No upload URL returned from server");
      }

      // Step 2: Upload the file to the generated URL
      const uploadResponse = await fetch(uploadUrlData.uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": selectedFile.type,
        },
        body: selectedFile,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("File upload failed:", uploadResponse.status, errorText);
        throw new Error(`Upload failed with status: ${uploadResponse.status}`);
      }

      const uploadResult = await uploadResponse.json();
      console.log("Upload result:", uploadResult);

      if (!uploadResult.storageId) {
        throw new Error("No storage ID returned from upload");
      }

      // Step 3: Save to database with the storage ID
      await uploadMaterial({
        title: title.trim(),
        description: description.trim() || undefined,
        fileId: uploadResult.storageId,
        category,
      });

      toast.success("Study material uploaded successfully!");
      
      // Reset form
      setTitle("");
      setDescription("");
      setCategory("study_material");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload study material");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (materialId: Id<"studyMaterials">) => {
    if (!confirm("Are you sure you want to delete this study material?")) {
      return;
    }

    try {
      await deleteMaterial({ materialId });
      toast.success("Study material deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete study material");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500" />
      
      {/* Animated orbs */}
      <motion.div
        className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl"
        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="fixed top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl"
        animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 1 }}
      />

      {/* Lab background image */}
      <div 
        className="fixed inset-0 opacity-10"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                Free Study Material & Handwritten Notes
              </h1>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden glass-card border-white/20 backdrop-blur-xl bg-white/10 rounded-lg overflow-hidden"
              >
                <div className="flex flex-col p-4 space-y-2">
                  <button onClick={() => { navigate("/admin"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Dashboard</button>
                  <button onClick={() => { navigate("/admin/questions"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Questions</button>
                  <button onClick={() => { navigate("/admin/content"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Content</button>
                  <button onClick={() => { navigate("/admin/study-materials"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Study Materials</button>
                  <button onClick={() => { navigate("/admin/analytics"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Analytics</button>
                  <button onClick={() => { navigate("/admin/subscriptions"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Subscriptions</button>
                  <button onClick={() => { navigate("/admin/coupons"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Coupons</button>
                  <button onClick={() => { navigate("/admin/notifications"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Notifications</button>
                  <button onClick={() => { navigate("/admin/feedback"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Feedback</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Form */}
          <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload New Material
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-white/90 text-sm font-medium mb-2 block">
                  Title *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter material title"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <div>
                <label className="text-white/90 text-sm font-medium mb-2 block">
                  Description (Optional)
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter material description"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-white/90 text-sm font-medium mb-2 block">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white"
                >
                  <option value="study_material">Study Material</option>
                  <option value="handwritten_notes">Handwritten Notes</option>
                  <option value="reference_book">Reference Book</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-white/90 text-sm font-medium mb-2 block">
                  PDF File *
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-white/20 file:text-white hover:file:bg-white/30"
                />
                {selectedFile && (
                  <p className="text-white/70 text-sm mt-2">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>

              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Material
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Materials List */}
          <Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Uploaded Materials ({materials?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!materials || materials.length === 0 ? (
                <p className="text-white/80 text-center py-8">
                  No study materials uploaded yet
                </p>
              ) : (
                <div className="space-y-3">
                  {materials.map((material) => (
                    <div
                      key={material._id}
                      className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-medium">{material.title}</h3>
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                            {material.category?.replace("_", " ") || "study material"}
                          </Badge>
                          <Badge variant={material.status === "active" ? "default" : "secondary"}>
                            {material.status}
                          </Badge>
                        </div>
                        {material.description && (
                          <p className="text-white/70 text-sm">{material.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-white/60">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {material.views} views
                          </span>
                          <span>Uploaded by: {material.uploaderName}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {material.fileUrl && (
                          <Button
                            onClick={() => window.open(material.fileUrl!, "_blank")}
                            variant="outline"
                            size="sm"
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDelete(material._id)}
                          variant="outline"
                          size="sm"
                          className="border-red-500/30 text-red-300 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}