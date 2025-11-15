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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ContentManagement;
var use_auth_1 = require("@/hooks/use-auth");
var react_1 = require("convex/react");
var api_1 = require("@/convex/_generated/api");
var react_router_1 = require("react-router");
var react_2 = require("react");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var dialog_1 = require("@/components/ui/dialog");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var select_1 = require("@/components/ui/select");
var textarea_1 = require("@/components/ui/textarea");
var sonner_1 = require("sonner");
function ContentManagement() {
    var _this = this;
    var _a = (0, use_auth_1.useAuth)(), isLoading = _a.isLoading, isAuthenticated = _a.isAuthenticated, user = _a.user;
    var content = (0, react_1.useQuery)(api_1.api.content.getAllContent, {});
    var topics = (0, react_1.useQuery)(api_1.api.topics.getAllTopics);
    var createContent = (0, react_1.useMutation)(api_1.api.content.createContent);
    var deleteContent = (0, react_1.useMutation)(api_1.api.content.deleteContent);
    var generateUploadUrl = (0, react_1.useMutation)(api_1.api.content.generateUploadUrl);
    var navigate = (0, react_router_1.useNavigate)();
    var _b = (0, react_2.useState)(false), isDialogOpen = _b[0], setIsDialogOpen = _b[1];
    var _c = (0, react_2.useState)(false), isUploading = _c[0], setIsUploading = _c[1];
    var _d = (0, react_2.useState)(false), isMenuOpen = _d[0], setIsMenuOpen = _d[1];
    var _e = (0, react_2.useState)({
        title: "",
        description: "",
        type: "pdf",
        topicId: "",
        fileUrl: "",
    }), formData = _e[0], setFormData = _e[1];
    var _f = (0, react_2.useState)(null), selectedFile = _f[0], setSelectedFile = _f[1];
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <lucide_react_1.Loader2 className="h-8 w-8 animate-spin"/>
      </div>);
    }
    if (!isAuthenticated || (user === null || user === void 0 ? void 0 : user.role) !== "admin") {
        return <react_router_1.Navigate to="/auth"/>;
    }
    var handleFileChange = function (e) {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var fileId, uploadUrl, result, storageId, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setIsUploading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, 8, 9]);
                    fileId = void 0;
                    if (!selectedFile) return [3 /*break*/, 5];
                    return [4 /*yield*/, generateUploadUrl()];
                case 2:
                    uploadUrl = _a.sent();
                    return [4 /*yield*/, fetch(uploadUrl, {
                            method: "POST",
                            headers: { "Content-Type": selectedFile.type },
                            body: selectedFile,
                        })];
                case 3:
                    result = _a.sent();
                    return [4 /*yield*/, result.json()];
                case 4:
                    storageId = (_a.sent()).storageId;
                    fileId = storageId;
                    _a.label = 5;
                case 5: return [4 /*yield*/, createContent({
                        title: formData.title,
                        description: formData.description,
                        type: formData.type,
                        topicId: formData.topicId ? formData.topicId : undefined,
                        fileId: fileId,
                        fileUrl: formData.fileUrl || undefined,
                    })];
                case 6:
                    _a.sent();
                    sonner_1.toast.success("Content uploaded successfully!");
                    setIsDialogOpen(false);
                    setFormData({ title: "", description: "", type: "pdf", topicId: "", fileUrl: "" });
                    setSelectedFile(null);
                    return [3 /*break*/, 9];
                case 7:
                    error_1 = _a.sent();
                    sonner_1.toast.error("Failed to upload content");
                    console.error(error_1);
                    return [3 /*break*/, 9];
                case 8:
                    setIsUploading(false);
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    var handleDelete = function (id) { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, deleteContent({ id: id })];
                case 1:
                    _a.sent();
                    sonner_1.toast.success("Content deleted successfully!");
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    sonner_1.toast.error("Failed to delete content");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var getIcon = function (type) {
        switch (type) {
            case "pdf":
                return lucide_react_1.FileText;
            case "video":
                return lucide_react_1.Video;
            case "pyq":
                return lucide_react_1.FileQuestion;
            default:
                return lucide_react_1.FileText;
        }
    };
    return (<div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background matching Landing page */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500"/>
      
      {/* Animated orbs */}
      <framer_motion_1.motion.div className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl" animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
        }} transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
        }}/>
      <framer_motion_1.motion.div className="fixed top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl" animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
        }} transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 1,
        }}/>
      <framer_motion_1.motion.div className="fixed bottom-0 left-1/4 w-[600px] h-[600px] bg-pink-400/40 rounded-full blur-3xl" animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
        }} transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
            delay: 0.5,
        }}/>
      <framer_motion_1.motion.div className="fixed top-1/2 right-1/4 w-[400px] h-[400px] bg-cyan-400/40 rounded-full blur-3xl" animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
        }} transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear",
            delay: 0.7,
        }}/>

      {/* Lab background image */}
      <div className="fixed inset-0 opacity-10" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
        }}/>

      {/* Content */}
      <div className="relative z-10 p-6">
        <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={function () { return setIsMenuOpen(!isMenuOpen); }} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all">
                {isMenuOpen ? <lucide_react_1.X className="h-6 w-6"/> : <lucide_react_1.Menu className="h-6 w-6"/>}
              </button>
              <h1 className="text-3xl font-bold tracking-tight text-white">Content Management</h1>
            </div>
            <dialog_1.Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <dialog_1.DialogTrigger asChild>
                <button_1.Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
                  Upload Content
                </button_1.Button>
              </dialog_1.DialogTrigger>
              <dialog_1.DialogContent className="glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white max-h-[90vh] overflow-y-auto">
                <dialog_1.DialogHeader>
                  <dialog_1.DialogTitle className="text-white">Upload New Content</dialog_1.DialogTitle>
                </dialog_1.DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label_1.Label htmlFor="title" className="text-white/80">Title</label_1.Label>
                    <input_1.Input id="title" value={formData.title} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { title: e.target.value })); }} required className="bg-white/5 border-white/20 text-white"/>
                  </div>
                  <div>
                    <label_1.Label htmlFor="description" className="text-white/80">Description</label_1.Label>
                    <textarea_1.Textarea id="description" value={formData.description} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { description: e.target.value })); }} className="bg-white/5 border-white/20 text-white"/>
                  </div>
                  <div>
                    <label_1.Label htmlFor="type" className="text-white/80">Content Type</label_1.Label>
                    <select_1.Select value={formData.type} onValueChange={function (value) { return setFormData(__assign(__assign({}, formData), { type: value })); }}>
                      <select_1.SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <select_1.SelectValue />
                      </select_1.SelectTrigger>
                      <select_1.SelectContent>
                        <select_1.SelectItem value="pdf">PDF</select_1.SelectItem>
                        <select_1.SelectItem value="video">Video</select_1.SelectItem>
                        <select_1.SelectItem value="pyq">Past Year Questions</select_1.SelectItem>
                      </select_1.SelectContent>
                    </select_1.Select>
                  </div>
                  <div>
                    <label_1.Label htmlFor="topic" className="text-white/80">Topic</label_1.Label>
                    <select_1.Select value={formData.topicId} onValueChange={function (value) { return setFormData(__assign(__assign({}, formData), { topicId: value })); }}>
                      <select_1.SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <select_1.SelectValue placeholder="Select topic"/>
                      </select_1.SelectTrigger>
                      <select_1.SelectContent>
                        {topics === null || topics === void 0 ? void 0 : topics.map(function (topic) { return (<select_1.SelectItem key={topic._id} value={topic._id}>
                            {topic.name}
                          </select_1.SelectItem>); })}
                      </select_1.SelectContent>
                    </select_1.Select>
                  </div>
                  <div>
                    <label_1.Label htmlFor="file" className="text-white/80">Upload File</label_1.Label>
                    <input_1.Input id="file" type="file" onChange={handleFileChange} className="bg-white/5 border-white/20 text-white"/>
                  </div>
                  <div>
                    <label_1.Label htmlFor="fileUrl" className="text-white/80">Or Enter URL</label_1.Label>
                    <input_1.Input id="fileUrl" value={formData.fileUrl} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { fileUrl: e.target.value })); }} placeholder="https://..." className="bg-white/5 border-white/20 text-white"/>
                  </div>
                  <button_1.Button type="submit" disabled={isUploading} className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
                    {isUploading ? (<>
                        <lucide_react_1.Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                        Uploading...
                      </>) : (<>
                        <lucide_react_1.Upload className="h-4 w-4 mr-2"/>
                        Upload
                      </>)}
                  </button_1.Button>
                </form>
              </dialog_1.DialogContent>
            </dialog_1.Dialog>
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

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {!content || content.length === 0 ? (<card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10 col-span-full">
                <card_1.CardContent className="py-12 text-center">
                  <p className="text-white/60">No content uploaded yet</p>
                </card_1.CardContent>
              </card_1.Card>) : (content.map(function (item, index) {
            var Icon = getIcon(item.type);
            return (<framer_motion_1.motion.div key={item._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                    <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10 hover:bg-white/15 transition-all">
                      <card_1.CardHeader className="flex flex-row items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-400 to-purple-600">
                            <Icon className="h-5 w-5 text-white"/>
                          </div>
                          <div>
                            <card_1.CardTitle className="text-white text-base">{item.title}</card_1.CardTitle>
                            <p className="text-sm text-white/60 mt-1">{item.topicName}</p>
                          </div>
                        </div>
                      </card_1.CardHeader>
                      <card_1.CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-white/60">
                            <p>{item.type.toUpperCase()}</p>
                            <p>{item.views} views</p>
                          </div>
                          <button_1.Button variant="ghost" size="icon" onClick={function () { return handleDelete(item._id); }} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                            <lucide_react_1.Trash2 className="h-4 w-4"/>
                          </button_1.Button>
                        </div>
                      </card_1.CardContent>
                    </card_1.Card>
                  </framer_motion_1.motion.div>);
        }))}
          </div>
        </framer_motion_1.motion.div>
      </div>
    </div>);
}
