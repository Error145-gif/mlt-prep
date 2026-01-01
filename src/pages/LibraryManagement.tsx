import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import AdminSidebar from "@/components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Edit, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function LibraryManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    pdf_url: "",
  });

  const allPDFs = useQuery(api.library.getAllLibraryPDFsAdmin);
  const addPDF = useMutation(api.library.addLibraryPDF);
  const updatePDF = useMutation(api.library.updateLibraryPDF);
  const deletePDF = useMutation(api.library.deleteLibraryPDF);

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

  const filteredPDFs = allPDFs?.filter(
    (pdf: any) =>
      pdf.status === "active" &&
      pdf.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subject || !formData.pdf_url) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      if (editingId) {
        await updatePDF({
          pdfId: editingId as any,
          ...formData,
        });
        toast.success("PDF updated successfully");
        setEditingId(null);
      } else {
        await addPDF(formData);
        toast.success("PDF added successfully");
      }
      
      setFormData({ title: "", subject: "", pdf_url: "" });
      setIsAdding(false);
    } catch (error) {
      toast.error("Failed to save PDF");
    }
  };

  const handleEdit = (pdf: any) => {
    setFormData({
      title: pdf.title,
      subject: pdf.subject,
      pdf_url: pdf.pdf_url,
    });
    setEditingId(pdf._id);
    setIsAdding(true);
  };

  const handleDelete = async (pdfId: string) => {
    if (!confirm("Are you sure you want to delete this PDF?")) return;
    
    try {
      await deletePDF({ pdfId: pdfId as any });
      toast.success("PDF deleted successfully");
    } catch (error) {
      toast.error("Failed to delete PDF");
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ title: "", subject: "", pdf_url: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <AdminSidebar />
      
      <div className="md:ml-64 p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            📚 Library Management
          </h1>
          <p className="text-white/70">Manage PDFs for Yearly Plan users</p>
        </motion.div>

        {/* Add/Edit Form */}
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <Card className="glass-card border-white/20 bg-white/10">
              <CardHeader>
                <CardTitle className="text-white">
                  {editingId ? "Edit PDF" : "Add New PDF"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-white">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="e.g., Blood Cell Morphology Notes"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-white">
                      Subject
                    </Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) =>
                        setFormData({ ...formData, subject: value })
                      }
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="pdf_url" className="text-white">
                      PDF URL (Cloudflare R2)
                    </Label>
                    <Input
                      id="pdf_url"
                      value={formData.pdf_url}
                      onChange={(e) =>
                        setFormData({ ...formData, pdf_url: e.target.value })
                      }
                      placeholder="https://your-r2-bucket.com/file.pdf"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      {editingId ? "Update PDF" : "Add PDF"}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancel}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Add Button */}
        {!isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New PDF
            </Button>
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
              placeholder="Search PDFs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>
        </motion.div>

        {/* PDFs List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <Card className="glass-card border-white/20 bg-white/10">
            <CardHeader>
              <CardTitle className="text-white">
                All PDFs ({filteredPDFs?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!filteredPDFs || filteredPDFs.length === 0 ? (
                <p className="text-white/70 text-center py-8">
                  No PDFs found. Add your first PDF!
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredPDFs.map((pdf: any) => (
                    <div
                      key={pdf._id}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">
                          {pdf.title}
                        </h3>
                        <p className="text-white/70 text-sm">{pdf.subject}</p>
                        <p className="text-white/50 text-xs truncate mt-1">
                          {pdf.pdf_url}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          onClick={() => handleEdit(pdf)}
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(pdf._id)}
                          size="sm"
                          variant="destructive"
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
        </motion.div>
      </div>
    </div>
  );
}
