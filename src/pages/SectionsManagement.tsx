import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Edit, Trash2, BookOpen, AlertCircle, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Id } from "@/convex/_generated/dataModel";

export default function SectionsManagement() {
  const navigate = useNavigate();
  const sections = useQuery(api.sections.getAllSections);
  const createSection = useMutation(api.sections.createSection);
  const updateSection = useMutation(api.sections.updateSection);
  const deleteSection = useMutation(api.sections.deleteSection);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [newSection, setNewSection] = useState({
    name: "",
    description: "",
  });

  const [editSection, setEditSection] = useState({
    name: "",
    description: "",
  });

  // Generate color based on section name
  const getSectionColor = (name: string) => {
    const colors = [
      "bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-green-500",
      "bg-yellow-500", "bg-red-500", "bg-indigo-500", "bg-teal-500"
    ];
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const handleCreateSection = async () => {
    if (!newSection.name.trim()) {
      toast.error("Section name is required");
      return;
    }

    if (sections && sections.length >= 50) {
      toast.error("Maximum 50 sections allowed");
      return;
    }

    try {
      const nextOrder = sections ? Math.max(...sections.map(s => s.order), 0) + 1 : 1;
      await createSection({
        name: newSection.name.trim(),
        description: newSection.description.trim() || undefined,
        order: nextOrder,
      });
      toast.success("Section created successfully");
      setIsCreateDialogOpen(false);
      setNewSection({ name: "", description: "" });
    } catch (error) {
      toast.error("Failed to create section");
      console.error(error);
    }
  };

  const handleEditSection = async () => {
    if (!selectedSection || !editSection.name.trim()) {
      toast.error("Section name is required");
      return;
    }

    try {
      await updateSection({
        sectionId: selectedSection._id,
        name: editSection.name.trim(),
        description: editSection.description.trim() || undefined,
      });
      toast.success("Section updated successfully");
      setIsEditDialogOpen(false);
      setSelectedSection(null);
    } catch (error) {
      toast.error("Failed to update section");
      console.error(error);
    }
  };

  const handleDeleteSection = async () => {
    if (!selectedSection) return;

    try {
      await deleteSection({ sectionId: selectedSection._id });
      toast.success("Section deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedSection(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete section");
      console.error(error);
    }
  };

  const handleToggleActive = async (sectionId: Id<"sections">, currentStatus: boolean) => {
    try {
      await updateSection({
        sectionId,
        isActive: !currentStatus,
      });
      toast.success(`Section ${!currentStatus ? "activated" : "deactivated"}`);
    } catch (error) {
      toast.error("Failed to update section status");
      console.error(error);
    }
  };

  const openEditDialog = (section: any) => {
    setSelectedSection(section);
    setEditSection({
      name: section.name,
      description: section.description || "",
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (section: any) => {
    setSelectedSection(section);
    setIsDeleteDialogOpen(true);
  };

  if (!sections) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading sections...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Sections Management</h1>
              <p className="text-white/80">Organize questions into sections (Maximum: 50)</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {sections.length} / 50 Sections
            </Badge>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              disabled={sections.length >= 50}
              className="bg-white text-purple-600 hover:bg-white/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Section
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card border-white/20 backdrop-blur-xl bg-white/10 rounded-lg overflow-hidden"
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

        {/* Warning when approaching limit */}
        {sections.length >= 45 && (
          <Card className="glass-card border-yellow-500/50 bg-yellow-500/10">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <p className="text-white">
                You're approaching the maximum limit of 50 sections ({sections.length}/50)
              </p>
            </CardContent>
          </Card>
        )}

        {/* Sections Grid */}
        {sections.length === 0 ? (
          <Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <BookOpen className="h-16 w-16 text-white/50 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No sections yet</h3>
              <p className="text-white/70 mb-4">Create your first section to organize questions</p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-white text-purple-600 hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" />
                Create First Section
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section) => (
              <Card key={section._id} className="glass-card border-white/20 backdrop-blur-xl bg-white/10 hover:bg-white/15 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getSectionColor(section.name)}`} />
                        <CardTitle className="text-white text-lg">{section.name}</CardTitle>
                      </div>
                      {section.description && (
                        <CardDescription className="text-white/70 text-sm">
                          {section.description}
                        </CardDescription>
                      )}
                    </div>
                    <Switch
                      checked={section.isActive}
                      onCheckedChange={() => handleToggleActive(section._id, section.isActive)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Questions:</span>
                    <Badge variant="secondary">{section.questionCount}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Status:</span>
                    <Badge variant={section.isActive ? "default" : "secondary"}>
                      {section.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(section)}
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(section)}
                      disabled={section.questionCount > 0}
                      className="flex-1 border-white/20 text-white hover:bg-red-500/20 disabled:opacity-50"
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Section Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Create New Section</DialogTitle>
            <DialogDescription className="text-white/70">
              Add a new section to organize your questions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-white">Section Name *</Label>
              <Input
                id="name"
                value={newSection.name}
                onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                placeholder="e.g., Hematology - Blood Cells"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-white">Description (Optional)</Label>
              <Textarea
                id="description"
                value={newSection.description}
                onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
                placeholder="Brief description of this section..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="border-white/20 text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button onClick={handleCreateSection} className="bg-white text-purple-600 hover:bg-white/90">
              Create Section
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Section Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogDescription className="text-white/70">
              Update section details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name" className="text-white">Section Name *</Label>
              <Input
                id="edit-name"
                value={editSection.name}
                onChange={(e) => setEditSection({ ...editSection, name: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="edit-description" className="text-white">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                value={editSection.description}
                onChange={(e) => setEditSection({ ...editSection, description: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-white/20 text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button onClick={handleEditSection} className="bg-white text-purple-600 hover:bg-white/90">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Section Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Delete Section</DialogTitle>
            <DialogDescription className="text-white/70">
              Are you sure you want to delete "{selectedSection?.name}"?
              {selectedSection?.questionCount > 0 && (
                <span className="block mt-2 text-red-400">
                  This section has {selectedSection.questionCount} questions. Please reassign or delete them first.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="border-white/20 text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button
              onClick={handleDeleteSection}
              disabled={selectedSection?.questionCount > 0}
              className="bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
            >
              Delete Section
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
