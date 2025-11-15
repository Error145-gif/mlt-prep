"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StudyMaterialsManagement;
var use_auth_1 = require("@/hooks/use-auth");
var react_1 = require("convex/react");
var api_1 = require("@/convex/_generated/api");
var react_router_1 = require("react-router");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var textarea_1 = require("@/components/ui/textarea");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var framer_motion_2 = require("framer-motion");
var sonner_1 = require("sonner");
var react_2 = require("react");
function StudyMaterialsManagement() {
    var _this = this;
    var _a = (0, use_auth_1.useAuth)(), isLoading = _a.isLoading, isAuthenticated = _a.isAuthenticated, user = _a.user;
    var navigate = (0, react_router_1.useNavigate)();
    var materials = (0, react_1.useQuery)(api_1.api.studyMaterials.getAllStudyMaterialsAdmin);
    var uploadMaterial = (0, react_1.useMutation)(api_1.api.studyMaterials.uploadStudyMaterial);
    var deleteMaterial = (0, react_1.useMutation)(api_1.api.studyMaterials.deleteStudyMaterial);
    var _b = (0, react_2.useState)(""), title = _b[0], setTitle = _b[1];
    var _c = (0, react_2.useState)(""), description = _c[0], setDescription = _c[1];
    var _d = (0, react_2.useState)("study_material"), category = _d[0], setCategory = _d[1];
    var _e = (0, react_2.useState)(false), isUploading = _e[0], setIsUploading = _e[1];
    var fileInputRef = (0, react_2.useRef)(null);
    var _f = (0, react_2.useState)(null), selectedFile = _f[0], setSelectedFile = _f[1];
    var _g = (0, react_2.useState)(false), isMenuOpen = _g[0], setIsMenuOpen = _g[1];
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>);
    }
    if (!isAuthenticated) {
        return <react_router_1.Navigate to="/auth"/>;
    }
    if ((user === null || user === void 0 ? void 0 : user.role) !== "admin") {
        return <react_router_1.Navigate to="/dashboard"/>;
    }
    var handleFileSelect = function (e) {
        var _a;
        var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            if (file.type !== "application/pdf") {
                sonner_1.toast.error("Please select a PDF file");
                return;
            }
            setSelectedFile(file);
        }
    };
    var handleUpload = function () { return __awaiter(_this, void 0, void 0, function () {
        var convexUrl, uploadUrlResponse, errorText, uploadUrlData, uploadResponse, errorText, uploadResult, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!title.trim()) {
                        sonner_1.toast.error("Please enter a title");
                        return [2 /*return*/];
                    }
                    if (!selectedFile) {
                        sonner_1.toast.error("Please select a PDF file");
                        return [2 /*return*/];
                    }
                    setIsUploading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 11, 12, 13]);
                    convexUrl = import.meta.env.VITE_CONVEX_URL;
                    return [4 /*yield*/, fetch("".concat(convexUrl, "/api/storage/generateUploadUrl"), {
                            method: "POST",
                        })];
                case 2:
                    uploadUrlResponse = _a.sent();
                    if (!!uploadUrlResponse.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, uploadUrlResponse.text()];
                case 3:
                    errorText = _a.sent();
                    console.error("Upload URL generation failed:", uploadUrlResponse.status, errorText);
                    throw new Error("Failed to generate upload URL: ".concat(uploadUrlResponse.status));
                case 4: return [4 /*yield*/, uploadUrlResponse.json()];
                case 5:
                    uploadUrlData = _a.sent();
                    console.log("Upload URL data:", uploadUrlData);
                    if (!uploadUrlData.uploadUrl) {
                        throw new Error("No upload URL returned from server");
                    }
                    return [4 /*yield*/, fetch(uploadUrlData.uploadUrl, {
                            method: "POST",
                            headers: {
                                "Content-Type": selectedFile.type,
                            },
                            body: selectedFile,
                        })];
                case 6:
                    uploadResponse = _a.sent();
                    if (!!uploadResponse.ok) return [3 /*break*/, 8];
                    return [4 /*yield*/, uploadResponse.text()];
                case 7:
                    errorText = _a.sent();
                    console.error("File upload failed:", uploadResponse.status, errorText);
                    throw new Error("Upload failed with status: ".concat(uploadResponse.status));
                case 8: return [4 /*yield*/, uploadResponse.json()];
                case 9:
                    uploadResult = _a.sent();
                    console.log("Upload result:", uploadResult);
                    if (!uploadResult.storageId) {
                        throw new Error("No storage ID returned from upload");
                    }
                    // Step 3: Save to database with the storage ID
                    return [4 /*yield*/, uploadMaterial({
                            title: title.trim(),
                            description: description.trim() || undefined,
                            fileId: uploadResult.storageId,
                            category: category,
                        })];
                case 10:
                    // Step 3: Save to database with the storage ID
                    _a.sent();
                    sonner_1.toast.success("Study material uploaded successfully!");
                    // Reset form
                    setTitle("");
                    setDescription("");
                    setCategory("study_material");
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }
                    return [3 /*break*/, 13];
                case 11:
                    error_1 = _a.sent();
                    console.error("Upload error:", error_1);
                    sonner_1.toast.error(error_1.message || "Failed to upload study material");
                    return [3 /*break*/, 13];
                case 12:
                    setIsUploading(false);
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    }); };
    var handleDelete = function (materialId) { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm("Are you sure you want to delete this study material?")) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, deleteMaterial({ materialId: materialId })];
                case 2:
                    _a.sent();
                    sonner_1.toast.success("Study material deleted successfully!");
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    sonner_1.toast.error(error_2.message || "Failed to delete study material");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500"/>
      
      {/* Animated orbs */}
      <framer_motion_2.motion.div className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl" animate={{ x: [0, 100, 0], y: [0, 50, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}/>
      <framer_motion_2.motion.div className="fixed top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl" animate={{ x: [0, -100, 0], y: [0, 100, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 1 }}/>

      {/* Lab background image */}
      <div className="fixed inset-0 opacity-10" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
        }}/>

      {/* Content */}
      <div className="relative z-10 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={function () { return setIsMenuOpen(!isMenuOpen); }} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all">
                {isMenuOpen ? <lucide_react_1.X className="h-6 w-6"/> : <lucide_react_1.Menu className="h-6 w-6"/>}
              </button>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                Free Study Material & Handwritten Notes
              </h1>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <framer_motion_1.AnimatePresence>
            {isMenuOpen && (<framer_motion_2.motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="glass-card border-white/20 backdrop-blur-xl bg-white/10 rounded-lg overflow-hidden">
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
              </framer_motion_2.motion.div>)}
          </framer_motion_1.AnimatePresence>

          {/* Upload Form */}
          <card_1.Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
            <card_1.CardHeader>
              <card_1.CardTitle className="text-white flex items-center gap-2">
                <lucide_react_1.Upload className="h-5 w-5"/>
                Upload New Material
              </card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <div>
                <label className="text-white/90 text-sm font-medium mb-2 block">
                  Title *
                </label>
                <input_1.Input value={title} onChange={function (e) { return setTitle(e.target.value); }} placeholder="Enter material title" className="bg-white/10 border-white/20 text-white placeholder:text-white/50"/>
              </div>

              <div>
                <label className="text-white/90 text-sm font-medium mb-2 block">
                  Description (Optional)
                </label>
                <textarea_1.Textarea value={description} onChange={function (e) { return setDescription(e.target.value); }} placeholder="Enter material description" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" rows={3}/>
              </div>

              <div>
                <label className="text-white/90 text-sm font-medium mb-2 block">
                  Category
                </label>
                <select value={category} onChange={function (e) { return setCategory(e.target.value); }} className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white">
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
                <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileSelect} className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-white/20 file:text-white hover:file:bg-white/30"/>
                {selectedFile && (<p className="text-white/70 text-sm mt-2">
                    Selected: {selectedFile.name}
                  </p>)}
              </div>

              <button_1.Button onClick={handleUpload} disabled={isUploading} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                {isUploading ? (<>
                    <lucide_react_1.Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                    Uploading...
                  </>) : (<>
                    <lucide_react_1.Upload className="h-4 w-4 mr-2"/>
                    Upload Material
                  </>)}
              </button_1.Button>
            </card_1.CardContent>
          </card_1.Card>

          {/* Materials List */}
          <card_1.Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
            <card_1.CardHeader>
              <card_1.CardTitle className="text-white flex items-center gap-2">
                <lucide_react_1.FileText className="h-5 w-5"/>
                Uploaded Materials ({(materials === null || materials === void 0 ? void 0 : materials.length) || 0})
              </card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
              {!materials || materials.length === 0 ? (<p className="text-white/80 text-center py-8">
                  No study materials uploaded yet
                </p>) : (<div className="space-y-3">
                  {materials.map(function (material) {
                var _a;
                return (<div key={material._id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-medium">{material.title}</h3>
                          <badge_1.Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                            {((_a = material.category) === null || _a === void 0 ? void 0 : _a.replace("_", " ")) || "study material"}
                          </badge_1.Badge>
                          <badge_1.Badge variant={material.status === "active" ? "default" : "secondary"}>
                            {material.status}
                          </badge_1.Badge>
                        </div>
                        {material.description && (<p className="text-white/70 text-sm">{material.description}</p>)}
                        <div className="flex items-center gap-4 mt-2 text-xs text-white/60">
                          <span className="flex items-center gap-1">
                            <lucide_react_1.Eye className="h-3 w-3"/>
                            {material.views} views
                          </span>
                          <span>Uploaded by: {material.uploaderName}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {material.fileUrl && (<button_1.Button onClick={function () { return window.open(material.fileUrl, "_blank"); }} variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                            <lucide_react_1.Eye className="h-4 w-4"/>
                          </button_1.Button>)}
                        <button_1.Button onClick={function () { return handleDelete(material._id); }} variant="outline" size="sm" className="border-red-500/30 text-red-300 hover:bg-red-500/20">
                          <lucide_react_1.Trash2 className="h-4 w-4"/>
                        </button_1.Button>
                      </div>
                    </div>);
            })}
                </div>)}
            </card_1.CardContent>
          </card_1.Card>
        </div>
      </div>
    </div>);
}
