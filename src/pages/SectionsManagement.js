"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SectionsManagement;
var react_1 = require("react");
var react_2 = require("convex/react");
var api_1 = require("@/convex/_generated/api");
var react_router_1 = require("react-router");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var dialog_1 = require("@/components/ui/dialog");
var badge_1 = require("@/components/ui/badge");
var switch_1 = require("@/components/ui/switch");
var sonner_1 = require("sonner");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
function SectionsManagement() {
    var _this = this;
    var navigate = (0, react_router_1.useNavigate)();
    var sections = (0, react_2.useQuery)(api_1.api.sections.getAllSections);
    var createSection = (0, react_2.useMutation)(api_1.api.sections.createSection);
    var updateSection = (0, react_2.useMutation)(api_1.api.sections.updateSection);
    var deleteSection = (0, react_2.useMutation)(api_1.api.sections.deleteSection);
    var _a = (0, react_1.useState)(false), isCreateDialogOpen = _a[0], setIsCreateDialogOpen = _a[1];
    var _b = (0, react_1.useState)(false), isEditDialogOpen = _b[0], setIsEditDialogOpen = _b[1];
    var _c = (0, react_1.useState)(false), isDeleteDialogOpen = _c[0], setIsDeleteDialogOpen = _c[1];
    var _d = (0, react_1.useState)(null), selectedSection = _d[0], setSelectedSection = _d[1];
    var _e = (0, react_1.useState)(false), isMenuOpen = _e[0], setIsMenuOpen = _e[1];
    var _f = (0, react_1.useState)({
        name: "",
        description: "",
    }), newSection = _f[0], setNewSection = _f[1];
    var _g = (0, react_1.useState)({
        name: "",
        description: "",
    }), editSection = _g[0], setEditSection = _g[1];
    // Generate color based on section name
    var getSectionColor = function (name) {
        var colors = [
            "bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-green-500",
            "bg-yellow-500", "bg-red-500", "bg-indigo-500", "bg-teal-500"
        ];
        var hash = name.split("").reduce(function (acc, char) { return acc + char.charCodeAt(0); }, 0);
        return colors[hash % colors.length];
    };
    var handleCreateSection = function () { return __awaiter(_this, void 0, void 0, function () {
        var nextOrder, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!newSection.name.trim()) {
                        sonner_1.toast.error("Section name is required");
                        return [2 /*return*/];
                    }
                    if (sections && sections.length >= 50) {
                        sonner_1.toast.error("Maximum 50 sections allowed");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    nextOrder = sections ? Math.max.apply(Math, __spreadArray(__spreadArray([], sections.map(function (s) { return s.order; }), false), [0], false)) + 1 : 1;
                    return [4 /*yield*/, createSection({
                            name: newSection.name.trim(),
                            description: newSection.description.trim() || undefined,
                            order: nextOrder,
                        })];
                case 2:
                    _a.sent();
                    sonner_1.toast.success("Section created successfully");
                    setIsCreateDialogOpen(false);
                    setNewSection({ name: "", description: "" });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    sonner_1.toast.error("Failed to create section");
                    console.error(error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleEditSection = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedSection || !editSection.name.trim()) {
                        sonner_1.toast.error("Section name is required");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, updateSection({
                            sectionId: selectedSection._id,
                            name: editSection.name.trim(),
                            description: editSection.description.trim() || undefined,
                        })];
                case 2:
                    _a.sent();
                    sonner_1.toast.success("Section updated successfully");
                    setIsEditDialogOpen(false);
                    setSelectedSection(null);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    sonner_1.toast.error("Failed to update section");
                    console.error(error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteSection = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedSection)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, deleteSection({ sectionId: selectedSection._id })];
                case 2:
                    _a.sent();
                    sonner_1.toast.success("Section deleted successfully");
                    setIsDeleteDialogOpen(false);
                    setSelectedSection(null);
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    sonner_1.toast.error(error_3.message || "Failed to delete section");
                    console.error(error_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleToggleActive = function (sectionId, currentStatus) { return __awaiter(_this, void 0, void 0, function () {
        var error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, updateSection({
                            sectionId: sectionId,
                            isActive: !currentStatus,
                        })];
                case 1:
                    _a.sent();
                    sonner_1.toast.success("Section ".concat(!currentStatus ? "activated" : "deactivated"));
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    sonner_1.toast.error("Failed to update section status");
                    console.error(error_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var openEditDialog = function (section) {
        setSelectedSection(section);
        setEditSection({
            name: section.name,
            description: section.description || "",
        });
        setIsEditDialogOpen(true);
    };
    var openDeleteDialog = function (section) {
        setSelectedSection(section);
        setIsDeleteDialogOpen(true);
    };
    if (!sections) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading sections...</div>
      </div>);
    }
    return (<div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500"/>
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"/>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"/>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"/>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={function () { return setIsMenuOpen(!isMenuOpen); }} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">
              {isMenuOpen ? <lucide_react_1.X className="h-6 w-6"/> : <lucide_react_1.Menu className="h-6 w-6"/>}
            </button>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Sections Management</h1>
              <p className="text-white/80">Organize questions into sections (Maximum: 50)</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <badge_1.Badge variant="secondary" className="text-lg px-4 py-2">
              {sections.length} / 50 Sections
            </badge_1.Badge>
            <button_1.Button onClick={function () { return setIsCreateDialogOpen(true); }} disabled={sections.length >= 50} className="bg-white text-purple-600 hover:bg-white/90">
              <lucide_react_1.Plus className="mr-2 h-4 w-4"/>
              Create Section
            </button_1.Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <framer_motion_1.AnimatePresence>
          {isMenuOpen && (<framer_motion_1.motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="glass-card border-white/20 backdrop-blur-xl bg-white/10 rounded-lg overflow-hidden">
              <div className="flex flex-col p-4 space-y-2">
                <button onClick={function () { navigate("/admin"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Dashboard</button>
                <button onClick={function () { navigate("/admin/questions"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Questions</button>
                <button onClick={function () { navigate("/admin/content"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Content</button>
                <button onClick={function () { navigate("/admin/study-materials"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Study Materials</button>
                <button onClick={function () { navigate("/admin/analytics"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Analytics</button>
                <button onClick={function () { navigate("/admin/subscriptions"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Subscriptions</button>
                <button onClick={function () { navigate("/admin/coupons"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Coupons</button>
                <button onClick={function () { navigate("/admin/notifications"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Notifications</button>
                <button onClick={function () { navigate("/admin/feedback"); setIsMenuOpen(false); }} className="text-left px-4 py-2 rounded-lg text-white hover:bg-white/10">Feedback</button>
              </div>
            </framer_motion_1.motion.div>)}
        </framer_motion_1.AnimatePresence>

        {/* Warning when approaching limit */}
        {sections.length >= 45 && (<card_1.Card className="glass-card border-yellow-500/50 bg-yellow-500/10">
            <card_1.CardContent className="flex items-center gap-3 p-4">
              <lucide_react_1.AlertCircle className="h-5 w-5 text-yellow-500"/>
              <p className="text-white">
                You're approaching the maximum limit of 50 sections ({sections.length}/50)
              </p>
            </card_1.CardContent>
          </card_1.Card>)}

        {/* Sections Grid */}
        {sections.length === 0 ? (<card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <card_1.CardContent className="flex flex-col items-center justify-center py-16">
              <lucide_react_1.BookOpen className="h-16 w-16 text-white/50 mb-4"/>
              <h3 className="text-xl font-semibold text-white mb-2">No sections yet</h3>
              <p className="text-white/70 mb-4">Create your first section to organize questions</p>
              <button_1.Button onClick={function () { return setIsCreateDialogOpen(true); }} className="bg-white text-purple-600 hover:bg-white/90">
                <lucide_react_1.Plus className="mr-2 h-4 w-4"/>
                Create First Section
              </button_1.Button>
            </card_1.CardContent>
          </card_1.Card>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map(function (section) { return (<card_1.Card key={section._id} className="glass-card border-white/20 backdrop-blur-xl bg-white/10 hover:bg-white/15 transition-all">
                <card_1.CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={"w-3 h-3 rounded-full ".concat(getSectionColor(section.name))}/>
                        <card_1.CardTitle className="text-white text-lg">{section.name}</card_1.CardTitle>
                      </div>
                      {section.description && (<card_1.CardDescription className="text-white/70 text-sm">
                          {section.description}
                        </card_1.CardDescription>)}
                    </div>
                    <switch_1.Switch checked={section.isActive} onCheckedChange={function () { return handleToggleActive(section._id, section.isActive); }}/>
                  </div>
                </card_1.CardHeader>
                <card_1.CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Questions:</span>
                    <badge_1.Badge variant="secondary">{section.questionCount}</badge_1.Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Status:</span>
                    <badge_1.Badge variant={section.isActive ? "default" : "secondary"}>
                      {section.isActive ? "Active" : "Inactive"}
                    </badge_1.Badge>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button_1.Button variant="outline" size="sm" onClick={function () { return openEditDialog(section); }} className="flex-1 border-white/20 text-white hover:bg-white/10">
                      <lucide_react_1.Edit className="mr-1 h-3 w-3"/>
                      Edit
                    </button_1.Button>
                    <button_1.Button variant="outline" size="sm" onClick={function () { return openDeleteDialog(section); }} disabled={section.questionCount > 0} className="flex-1 border-white/20 text-white hover:bg-red-500/20 disabled:opacity-50">
                      <lucide_react_1.Trash2 className="mr-1 h-3 w-3"/>
                      Delete
                    </button_1.Button>
                  </div>
                </card_1.CardContent>
              </card_1.Card>); })}
          </div>)}
      </div>

      {/* Create Section Dialog */}
      <dialog_1.Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <dialog_1.DialogContent className="glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Create New Section</dialog_1.DialogTitle>
            <dialog_1.DialogDescription className="text-white/70">
              Add a new section to organize your questions
            </dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <div className="space-y-4">
            <div>
              <label_1.Label htmlFor="name" className="text-white">Section Name *</label_1.Label>
              <input_1.Input id="name" value={newSection.name} onChange={function (e) { return setNewSection(__assign(__assign({}, newSection), { name: e.target.value })); }} placeholder="e.g., Hematology - Blood Cells" className="bg-white/10 border-white/20 text-white placeholder:text-white/50"/>
            </div>
            <div>
              <label_1.Label htmlFor="description" className="text-white">Description (Optional)</label_1.Label>
              <textarea_1.Textarea id="description" value={newSection.description} onChange={function (e) { return setNewSection(__assign(__assign({}, newSection), { description: e.target.value })); }} placeholder="Brief description of this section..." className="bg-white/10 border-white/20 text-white placeholder:text-white/50" rows={3}/>
            </div>
          </div>
          <dialog_1.DialogFooter>
            <button_1.Button variant="outline" onClick={function () { return setIsCreateDialogOpen(false); }} className="border-white/20 text-white hover:bg-white/10">
              Cancel
            </button_1.Button>
            <button_1.Button onClick={handleCreateSection} className="bg-white text-purple-600 hover:bg-white/90">
              Create Section
            </button_1.Button>
          </dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>

      {/* Edit Section Dialog */}
      <dialog_1.Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <dialog_1.DialogContent className="glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Edit Section</dialog_1.DialogTitle>
            <dialog_1.DialogDescription className="text-white/70">
              Update section details
            </dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <div className="space-y-4">
            <div>
              <label_1.Label htmlFor="edit-name" className="text-white">Section Name *</label_1.Label>
              <input_1.Input id="edit-name" value={editSection.name} onChange={function (e) { return setEditSection(__assign(__assign({}, editSection), { name: e.target.value })); }} className="bg-white/10 border-white/20 text-white"/>
            </div>
            <div>
              <label_1.Label htmlFor="edit-description" className="text-white">Description (Optional)</label_1.Label>
              <textarea_1.Textarea id="edit-description" value={editSection.description} onChange={function (e) { return setEditSection(__assign(__assign({}, editSection), { description: e.target.value })); }} className="bg-white/10 border-white/20 text-white" rows={3}/>
            </div>
          </div>
          <dialog_1.DialogFooter>
            <button_1.Button variant="outline" onClick={function () { return setIsEditDialogOpen(false); }} className="border-white/20 text-white hover:bg-white/10">
              Cancel
            </button_1.Button>
            <button_1.Button onClick={handleEditSection} className="bg-white text-purple-600 hover:bg-white/90">
              Save Changes
            </button_1.Button>
          </dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>

      {/* Delete Section Dialog */}
      <dialog_1.Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <dialog_1.DialogContent className="glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Delete Section</dialog_1.DialogTitle>
            <dialog_1.DialogDescription className="text-white/70">
              Are you sure you want to delete "{selectedSection === null || selectedSection === void 0 ? void 0 : selectedSection.name}"?
              {(selectedSection === null || selectedSection === void 0 ? void 0 : selectedSection.questionCount) > 0 && (<span className="block mt-2 text-red-400">
                  This section has {selectedSection.questionCount} questions. Please reassign or delete them first.
                </span>)}
            </dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <dialog_1.DialogFooter>
            <button_1.Button variant="outline" onClick={function () { return setIsDeleteDialogOpen(false); }} className="border-white/20 text-white hover:bg-white/10">
              Cancel
            </button_1.Button>
            <button_1.Button onClick={handleDeleteSection} disabled={(selectedSection === null || selectedSection === void 0 ? void 0 : selectedSection.questionCount) > 0} className="bg-red-500 text-white hover:bg-red-600 disabled:opacity-50">
              Delete Section
            </button_1.Button>
          </dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
