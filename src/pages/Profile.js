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
exports.default = Profile;
var react_1 = require("convex/react");
var api_1 = require("@/convex/_generated/api");
var use_auth_1 = require("@/hooks/use-auth");
var react_router_1 = require("react-router");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var select_1 = require("@/components/ui/select");
var avatar_1 = require("@/components/ui/avatar");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var react_2 = require("react");
var sonner_1 = require("sonner");
var StudentNav_1 = require("@/components/StudentNav");
var AVATAR_OPTIONS = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=LabTech",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Medic",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Technician",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Scientist",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Researcher",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Doctor",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Analyst",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Nurse",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
];
var EXAM_OPTIONS = [
    "AIIMS MLT",
    "ESIC MLT",
    "RRB MLT (Railway)",
    "JIPMER MLT",
    "PGIMER MLT",
    "Delhi University MLT",
    "Mumbai University MLT",
    "Bangalore University MLT",
    "Chennai University MLT",
    "Kolkata University MLT",
    "Pune University MLT",
    "Hyderabad University MLT",
    "AFMC MLT",
    "Armed Forces MLT",
    "State Health Department MLT",
    "NEET-based MLT Programs",
    "DMRC MLT (Delhi Metro)",
    "NTPC MLT",
    "Coal India MLT",
    "BHEL MLT",
    "Private Hospital MLT",
    "Medical College MLT",
    "Nursing College MLT",
    "Diagnostic Center MLT",
    "Blood Bank MLT",
    "Research Institute MLT",
    "Other",
];
var INDIAN_STATES = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
];
function Profile() {
    var _this = this;
    var _a;
    var _b = (0, use_auth_1.useAuth)(), isAuthenticated = _b.isAuthenticated, isLoading = _b.isLoading;
    var navigate = (0, react_router_1.useNavigate)();
    var userProfile = (0, react_1.useQuery)(api_1.api.users.getUserProfile);
    var updateProfile = (0, react_1.useMutation)(api_1.api.users.updateUserProfile);
    var generateUploadUrl = (0, react_1.useMutation)(api_1.api.users.generateUploadUrl);
    var saveProfileImage = (0, react_1.useMutation)(api_1.api.users.saveProfileImage);
    var _c = (0, react_2.useState)(""), name = _c[0], setName = _c[1];
    var _d = (0, react_2.useState)(""), selectedAvatar = _d[0], setSelectedAvatar = _d[1];
    var _e = (0, react_2.useState)(""), examPreparation = _e[0], setExamPreparation = _e[1];
    var _f = (0, react_2.useState)(""), state = _f[0], setState = _f[1];
    var _g = (0, react_2.useState)(false), isSaving = _g[0], setIsSaving = _g[1];
    var _h = (0, react_2.useState)(false), isMenuOpen = _h[0], setIsMenuOpen = _h[1];
    var _j = (0, react_2.useState)(false), isUploading = _j[0], setIsUploading = _j[1];
    (0, react_2.useEffect)(function () {
        if (!isLoading && !isAuthenticated) {
            navigate("/auth");
        }
    }, [isAuthenticated, isLoading, navigate]);
    (0, react_2.useEffect)(function () {
        if (userProfile) {
            setName(userProfile.name || "");
            setSelectedAvatar(userProfile.avatarUrl || AVATAR_OPTIONS[0]);
            setExamPreparation(userProfile.examPreparation || "");
            setState(userProfile.state || "");
        }
    }, [userProfile]);
    var handleImageUpload = function (event) { return __awaiter(_this, void 0, void 0, function () {
        var file, postUrl, result, storageId, imageUrl, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
                    if (!file)
                        return [2 /*return*/];
                    // Validate file type
                    if (!file.type.startsWith("image/")) {
                        sonner_1.toast.error("Please upload an image file");
                        return [2 /*return*/];
                    }
                    // Validate file size (max 5MB)
                    if (file.size > 5 * 1024 * 1024) {
                        sonner_1.toast.error("Image size must be less than 5MB");
                        return [2 /*return*/];
                    }
                    setIsUploading(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 8]);
                    return [4 /*yield*/, generateUploadUrl()];
                case 2:
                    postUrl = _b.sent();
                    return [4 /*yield*/, fetch(postUrl, {
                            method: "POST",
                            headers: { "Content-Type": file.type },
                            body: file,
                        })];
                case 3:
                    result = _b.sent();
                    return [4 /*yield*/, result.json()];
                case 4:
                    storageId = (_b.sent()).storageId;
                    return [4 /*yield*/, saveProfileImage({ storageId: storageId })];
                case 5:
                    imageUrl = _b.sent();
                    setSelectedAvatar(imageUrl);
                    sonner_1.toast.success("Profile image uploaded successfully!");
                    return [3 /*break*/, 8];
                case 6:
                    error_1 = _b.sent();
                    sonner_1.toast.error("Failed to upload image");
                    console.error(error_1);
                    return [3 /*break*/, 8];
                case 7:
                    setIsUploading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var handleSave = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!name || name.length < 2) {
                        sonner_1.toast.error("Name must be at least 2 characters");
                        return [2 /*return*/];
                    }
                    setIsSaving(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, updateProfile({
                            name: name,
                            avatarUrl: selectedAvatar,
                            examPreparation: examPreparation || undefined,
                            state: state || undefined,
                        })];
                case 2:
                    _a.sent();
                    sonner_1.toast.success("Profile updated successfully!");
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    sonner_1.toast.error("Failed to update profile");
                    console.error(error_2);
                    return [3 /*break*/, 5];
                case 4:
                    setIsSaving(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var calculateCompletion = function () {
        var completed = 0;
        if (name)
            completed += 25;
        if (selectedAvatar)
            completed += 25;
        if (examPreparation)
            completed += 25;
        if (state)
            completed += 25;
        return completed;
    };
    if (isLoading || !userProfile) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>);
    }
    var completion = calculateCompletion();
    return (<div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
      <StudentNav_1.default />
      
      {/* Lab Background Image */}
      <div className="fixed inset-0 -z-10 opacity-15" style={{
            backgroundImage: 'url(https://harmless-tapir-303.convex.cloud/api/storage/27dfb36c-ac7c-4a7c-930b-57ef6b7163d1)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
        }}/>
      
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl animate-pulse"/>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}/>
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-pink-400/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}/>
        <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] bg-cyan-400/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }}/>
      </div>

      {/* Hamburger Menu Button */}
      <button_1.Button variant="ghost" size="icon" className="fixed top-4 right-4 z-50 glass-card border-white/20 backdrop-blur-xl bg-white/10 text-white md:hidden" onClick={function () { return setIsMenuOpen(!isMenuOpen); }}>
        {isMenuOpen ? <lucide_react_1.X className="h-5 w-5"/> : <lucide_react_1.Menu className="h-5 w-5"/>}
      </button_1.Button>

      {/* Mobile Menu */}
      <framer_motion_1.AnimatePresence>
        {isMenuOpen && (<framer_motion_1.motion.div initial={{ opacity: 0, x: 300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 300 }} className="fixed top-16 right-0 z-40 md:hidden bg-white/10 backdrop-blur-xl border-l border-white/20 w-64 h-screen p-4 space-y-3">
            <button_1.Button onClick={function () {
                navigate("/student");
                setIsMenuOpen(false);
            }} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              Dashboard
            </button_1.Button>
            <button_1.Button onClick={function () {
                navigate("/tests/mock");
                setIsMenuOpen(false);
            }} variant="outline" className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30">
              Mock Tests
            </button_1.Button>
            <button_1.Button onClick={function () {
                navigate("/tests/pyq");
                setIsMenuOpen(false);
            }} variant="outline" className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30">
              PYQ Sets
            </button_1.Button>
            <button_1.Button onClick={function () {
                navigate("/tests/ai");
                setIsMenuOpen(false);
            }} variant="outline" className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30">
              AI Questions
            </button_1.Button>
            <button_1.Button onClick={function () {
                navigate("/subscription");
                setIsMenuOpen(false);
            }} variant="outline" className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30">
              Subscription
            </button_1.Button>
          </framer_motion_1.motion.div>)}
      </framer_motion_1.AnimatePresence>
      
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <framer_motion_1.motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <p className="text-white/70 mt-1">Manage your personal information</p>
        </framer_motion_1.motion.div>

        {/* Profile Completion */}
        {completion < 100 && (<framer_motion_1.motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card border border-blue-500/50 backdrop-blur-xl bg-blue-500/10 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">Profile Completion</span>
              <span className="text-white font-bold">{completion}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500" style={{ width: "".concat(completion, "%") }}/>
            </div>
          </framer_motion_1.motion.div>)}

        {/* Current Profile Card */}
        <framer_motion_1.motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <card_1.CardHeader>
              <card_1.CardTitle className="text-white">Current Profile</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="flex items-center gap-4">
              <avatar_1.Avatar className="h-20 w-20 border-2 border-white/20">
                <avatar_1.AvatarImage src={selectedAvatar}/>
                <avatar_1.AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                  {((_a = name === null || name === void 0 ? void 0 : name.charAt(0)) === null || _a === void 0 ? void 0 : _a.toUpperCase()) || "U"}
                </avatar_1.AvatarFallback>
              </avatar_1.Avatar>
              <div>
                <h3 className="text-xl font-bold text-white">{name || "No name set"}</h3>
                <p className="text-white/70 flex items-center gap-2 mt-1">
                  <lucide_react_1.Mail className="h-4 w-4"/>
                  {userProfile.email}
                </p>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </framer_motion_1.motion.div>

        {/* Edit Profile Form */}
        <framer_motion_1.motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <card_1.CardHeader>
              <card_1.CardTitle className="text-white">Edit Profile</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label_1.Label htmlFor="name" className="text-white flex items-center gap-2">
                  <lucide_react_1.User className="h-4 w-4"/>
                  Name *
                </label_1.Label>
                <input_1.Input id="name" value={name} onChange={function (e) { return setName(e.target.value); }} placeholder="Enter your name" className="bg-white/10 border-white/20 text-white placeholder:text-white/50"/>
                {name && name.length < 2 && (<p className="text-red-400 text-sm">Name must be at least 2 characters</p>)}
              </div>

              {/* Upload Custom Image */}
              <div className="space-y-2">
                <label_1.Label className="text-white flex items-center gap-2">
                  <lucide_react_1.Camera className="h-4 w-4"/>
                  Upload Custom Profile Image
                </label_1.Label>
                <div className="flex items-center gap-4">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" disabled={isUploading}/>
                  <label_1.Label htmlFor="image-upload" className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all">
                    <lucide_react_1.Upload className="h-4 w-4"/>
                    {isUploading ? "Uploading..." : "Choose Image"}
                  </label_1.Label>
                  <span className="text-white/70 text-sm">Max 5MB (JPG, PNG, GIF)</span>
                </div>
              </div>

              {/* Avatar Selection */}
              <div className="space-y-2">
                <label_1.Label className="text-white">Or Select Avatar</label_1.Label>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                  {AVATAR_OPTIONS.map(function (avatar, index) { return (<framer_motion_1.motion.div key={index} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className={"relative cursor-pointer rounded-full ".concat(selectedAvatar === avatar ? "ring-4 ring-blue-500" : "")} onClick={function () { return setSelectedAvatar(avatar); }}>
                      <avatar_1.Avatar className="h-16 w-16 border-2 border-white/20">
                        <avatar_1.AvatarImage src={avatar}/>
                        <avatar_1.AvatarFallback>A{index + 1}</avatar_1.AvatarFallback>
                      </avatar_1.Avatar>
                      {selectedAvatar === avatar && (<div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                          <lucide_react_1.Check className="h-3 w-3 text-white"/>
                        </div>)}
                    </framer_motion_1.motion.div>); })}
                </div>
              </div>

              {/* Exam Preparation */}
              <div className="space-y-2">
                <label_1.Label htmlFor="exam" className="text-white flex items-center gap-2">
                  <lucide_react_1.BookOpen className="h-4 w-4"/>
                  Exam Preparation
                </label_1.Label>
                <select_1.Select value={examPreparation} onValueChange={setExamPreparation}>
                  <select_1.SelectTrigger className="bg-white/20 border-white/30 text-white placeholder:text-white/60 h-12">
                    <select_1.SelectValue placeholder="Select exam you're preparing for"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent className="bg-gray-900 border-white/30">
                    {EXAM_OPTIONS.map(function (exam) { return (<select_1.SelectItem key={exam} value={exam} className="text-white hover:bg-white/10 focus:bg-white/20">
                        {exam}
                      </select_1.SelectItem>); })}
                  </select_1.SelectContent>
                </select_1.Select>
              </div>

              {/* State Selection */}
              <div className="space-y-2">
                <label_1.Label htmlFor="state" className="text-white flex items-center gap-2">
                  <lucide_react_1.MapPin className="h-4 w-4"/>
                  State
                </label_1.Label>
                <select_1.Select value={state} onValueChange={setState}>
                  <select_1.SelectTrigger className="bg-white/20 border-white/30 text-white placeholder:text-white/60 h-12">
                    <select_1.SelectValue placeholder="Select your state"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent className="bg-gray-900 border-white/30 max-h-[300px]">
                    {INDIAN_STATES.map(function (stateName) { return (<select_1.SelectItem key={stateName} value={stateName} className="text-white hover:bg-white/10 focus:bg-white/20">
                        {stateName}
                      </select_1.SelectItem>); })}
                  </select_1.SelectContent>
                </select_1.Select>
              </div>

              {/* Save Button */}
              <button_1.Button onClick={handleSave} disabled={isSaving || !name || name.length < 2 || isUploading} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                {isSaving ? "Saving..." : "Save Profile"}
              </button_1.Button>
            </card_1.CardContent>
          </card_1.Card>
        </framer_motion_1.motion.div>
      </div>
    </div>);
}
