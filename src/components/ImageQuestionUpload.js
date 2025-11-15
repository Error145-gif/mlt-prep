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
exports.default = ImageQuestionUpload;
var react_1 = require("react");
var react_2 = require("convex/react");
var api_1 = require("@/convex/_generated/api");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var select_1 = require("@/components/ui/select");
var card_1 = require("@/components/ui/card");
var sonner_1 = require("sonner");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
function ImageQuestionUpload() {
    var _this = this;
    var _a = (0, react_1.useState)(null), imageFile = _a[0], setImageFile = _a[1];
    var _b = (0, react_1.useState)(null), imagePreview = _b[0], setImagePreview = _b[1];
    var _c = (0, react_1.useState)(""), questionText = _c[0], setQuestionText = _c[1];
    var _d = (0, react_1.useState)(["", "", "", ""]), options = _d[0], setOptions = _d[1];
    var _e = (0, react_1.useState)(""), correctAnswer = _e[0], setCorrectAnswer = _e[1];
    var _f = (0, react_1.useState)(""), explanation = _f[0], setExplanation = _f[1];
    var _g = (0, react_1.useState)("medium"), difficulty = _g[0], setDifficulty = _g[1];
    var _h = (0, react_1.useState)("manual"), source = _h[0], setSource = _h[1];
    var _j = (0, react_1.useState)(""), topic = _j[0], setTopic = _j[1];
    var _k = (0, react_1.useState)(""), subject = _k[0], setSubject = _k[1];
    var _l = (0, react_1.useState)(false), isUploading = _l[0], setIsUploading = _l[1];
    var generateUploadUrl = (0, react_2.useMutation)(api_1.api.questions.generateUploadUrl);
    var createImageQuestion = (0, react_2.useMutation)(api_1.api.questions.createImageQuestion);
    var handleImageSelect = function (e) {
        var _a;
        var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                sonner_1.toast.error("Image size should be less than 5MB");
                return;
            }
            setImageFile(file);
            var reader_1 = new FileReader();
            reader_1.onloadend = function () {
                setImagePreview(reader_1.result);
            };
            reader_1.readAsDataURL(file);
        }
    };
    var handleOptionChange = function (index, value) {
        var newOptions = __spreadArray([], options, true);
        newOptions[index] = value;
        setOptions(newOptions);
    };
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var uploadUrl, uploadResult, storageId, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!imageFile) {
                        sonner_1.toast.error("Please select an image");
                        return [2 /*return*/];
                    }
                    if (!questionText.trim()) {
                        sonner_1.toast.error("Please enter question text");
                        return [2 /*return*/];
                    }
                    if (options.some(function (opt) { return !opt.trim(); })) {
                        sonner_1.toast.error("Please fill all options");
                        return [2 /*return*/];
                    }
                    if (!correctAnswer.trim()) {
                        sonner_1.toast.error("Please enter the correct answer");
                        return [2 /*return*/];
                    }
                    if (!topic.trim()) {
                        sonner_1.toast.error("Please enter a topic");
                        return [2 /*return*/];
                    }
                    setIsUploading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    return [4 /*yield*/, generateUploadUrl()];
                case 2:
                    uploadUrl = _a.sent();
                    return [4 /*yield*/, fetch(uploadUrl, {
                            method: "POST",
                            headers: { "Content-Type": imageFile.type },
                            body: imageFile,
                        })];
                case 3:
                    uploadResult = _a.sent();
                    if (!uploadResult.ok) {
                        throw new Error("Failed to upload image");
                    }
                    return [4 /*yield*/, uploadResult.json()];
                case 4:
                    storageId = (_a.sent()).storageId;
                    // Step 3: Create question with image
                    return [4 /*yield*/, createImageQuestion({
                            type: "mcq",
                            question: questionText,
                            options: options,
                            correctAnswer: correctAnswer,
                            explanation: explanation || undefined,
                            difficulty: difficulty,
                            source: source,
                            subject: subject || undefined,
                            topic: topic,
                            imageStorageId: storageId,
                        })];
                case 5:
                    // Step 3: Create question with image
                    _a.sent();
                    sonner_1.toast.success("Image-based question created successfully!");
                    // Reset form
                    setImageFile(null);
                    setImagePreview(null);
                    setQuestionText("");
                    setOptions(["", "", "", ""]);
                    setCorrectAnswer("");
                    setExplanation("");
                    setDifficulty("medium");
                    setSource("manual");
                    setTopic("");
                    setSubject("");
                    return [3 /*break*/, 8];
                case 6:
                    error_1 = _a.sent();
                    console.error("Error creating image question:", error_1);
                    sonner_1.toast.error("Failed to create image question");
                    return [3 /*break*/, 8];
                case 7:
                    setIsUploading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    return (<card_1.Card className="glass-card border-white/30 backdrop-blur-xl bg-white/20">
      <card_1.CardHeader>
        <card_1.CardTitle className="text-white flex items-center gap-2">
          <lucide_react_1.Image className="h-5 w-5"/>
          Upload Image-Based Question
        </card_1.CardTitle>
      </card_1.CardHeader>
      <card_1.CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <label_1.Label className="text-white">Question Image</label_1.Label>
            <div className="flex items-center gap-4">
              <input_1.Input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" id="image-upload" disabled={isUploading}/>
              <label htmlFor="image-upload">
                <button_1.Button type="button" variant="outline" className="cursor-pointer bg-white/10 border-white/30 text-white hover:bg-white/20" disabled={isUploading} asChild>
                  <span>
                    <lucide_react_1.Upload className="h-4 w-4 mr-2"/>
                    Select Image
                  </span>
                </button_1.Button>
              </label>
              {imageFile && (<span className="text-white text-sm">{imageFile.name}</span>)}
            </div>

            <framer_motion_1.AnimatePresence>
              {imagePreview && (<framer_motion_1.motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative mt-4">
                  <img src={imagePreview} alt="Preview" className="max-w-full h-auto rounded-lg border-2 border-white/30"/>
                  <button_1.Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={function () {
                setImageFile(null);
                setImagePreview(null);
            }}>
                    <lucide_react_1.X className="h-4 w-4"/>
                  </button_1.Button>
                </framer_motion_1.motion.div>)}
            </framer_motion_1.AnimatePresence>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <label_1.Label className="text-white">Question Text</label_1.Label>
            <textarea_1.Textarea value={questionText} onChange={function (e) { return setQuestionText(e.target.value); }} placeholder="Enter question text (optional if image is self-explanatory)" className="bg-white/10 border-white/30 text-white placeholder:text-white/50" disabled={isUploading}/>
          </div>

          {/* Options */}
          <div className="space-y-2">
            <label_1.Label className="text-white">Options</label_1.Label>
            {options.map(function (option, index) { return (<input_1.Input key={index} value={option} onChange={function (e) { return handleOptionChange(index, e.target.value); }} placeholder={"Option ".concat(index + 1)} className="bg-white/10 border-white/30 text-white placeholder:text-white/50" disabled={isUploading}/>); })}
          </div>

          {/* Correct Answer */}
          <div className="space-y-2">
            <label_1.Label className="text-white">Correct Answer</label_1.Label>
            <input_1.Input value={correctAnswer} onChange={function (e) { return setCorrectAnswer(e.target.value); }} placeholder="Enter the correct answer exactly as it appears in options" className="bg-white/10 border-white/30 text-white placeholder:text-white/50" disabled={isUploading}/>
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <label_1.Label className="text-white">Explanation (Optional)</label_1.Label>
            <textarea_1.Textarea value={explanation} onChange={function (e) { return setExplanation(e.target.value); }} placeholder="Explain why this is the correct answer" className="bg-white/10 border-white/30 text-white placeholder:text-white/50" disabled={isUploading}/>
          </div>

          {/* Topic & Subject */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label_1.Label className="text-white">Topic</label_1.Label>
              <input_1.Input value={topic} onChange={function (e) { return setTopic(e.target.value); }} placeholder="e.g., Hematology" className="bg-white/10 border-white/30 text-white placeholder:text-white/50" disabled={isUploading}/>
            </div>
            <div className="space-y-2">
              <label_1.Label className="text-white">Subject (Optional)</label_1.Label>
              <input_1.Input value={subject} onChange={function (e) { return setSubject(e.target.value); }} placeholder="e.g., Clinical Pathology" className="bg-white/10 border-white/30 text-white placeholder:text-white/50" disabled={isUploading}/>
            </div>
          </div>

          {/* Difficulty & Source */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label_1.Label className="text-white">Difficulty</label_1.Label>
              <select_1.Select value={difficulty} onValueChange={setDifficulty} disabled={isUploading}>
                <select_1.SelectTrigger className="bg-white/10 border-white/30 text-white">
                  <select_1.SelectValue />
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  <select_1.SelectItem value="easy">Easy</select_1.SelectItem>
                  <select_1.SelectItem value="medium">Medium</select_1.SelectItem>
                  <select_1.SelectItem value="hard">Hard</select_1.SelectItem>
                </select_1.SelectContent>
              </select_1.Select>
            </div>
            <div className="space-y-2">
              <label_1.Label className="text-white">Add to Test Type</label_1.Label>
              <select_1.Select value={source} onValueChange={setSource} disabled={isUploading}>
                <select_1.SelectTrigger className="bg-white/10 border-white/30 text-white">
                  <select_1.SelectValue />
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  <select_1.SelectItem value="manual">Mock Test</select_1.SelectItem>
                  <select_1.SelectItem value="ai">AI Test</select_1.SelectItem>
                </select_1.SelectContent>
              </select_1.Select>
            </div>
          </div>

          {/* Submit Button */}
          <button_1.Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white" disabled={isUploading}>
            {isUploading ? (<>
                <lucide_react_1.Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                Uploading...
              </>) : (<>
                <lucide_react_1.Upload className="h-4 w-4 mr-2"/>
                Create Image Question
              </>)}
          </button_1.Button>
        </form>
      </card_1.CardContent>
    </card_1.Card>);
}
