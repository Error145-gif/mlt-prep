"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Practice;
var react_1 = require("convex/react");
var api_1 = require("@/convex/_generated/api");
var use_auth_1 = require("@/hooks/use-auth");
var react_router_1 = require("react-router");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var select_1 = require("@/components/ui/select");
var label_1 = require("@/components/ui/label");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var react_2 = require("react");
var StudentNav_1 = require("@/components/StudentNav");
function Practice() {
    var _a = (0, use_auth_1.useAuth)(), isAuthenticated = _a.isAuthenticated, isLoading = _a.isLoading;
    var navigate = (0, react_router_1.useNavigate)();
    var topics = (0, react_1.useQuery)(api_1.api.topics.getAllTopics);
    var subscriptionAccess = (0, react_1.useQuery)(api_1.api.student.checkSubscriptionAccess);
    var _b = (0, react_2.useState)("all"), selectedTopic = _b[0], setSelectedTopic = _b[1];
    var _c = (0, react_2.useState)("all"), selectedDifficulty = _c[0], setSelectedDifficulty = _c[1];
    var _d = (0, react_2.useState)(10), questionLimit = _d[0], setQuestionLimit = _d[1];
    (0, react_2.useEffect)(function () {
        if (!isLoading && !isAuthenticated) {
            navigate("/auth");
        }
    }, [isAuthenticated, isLoading, navigate]);
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>);
    }
    var handleStartPractice = function () {
        if (!(subscriptionAccess === null || subscriptionAccess === void 0 ? void 0 : subscriptionAccess.hasAccess)) {
            navigate("/dashboard");
            return;
        }
        var params = new URLSearchParams();
        params.set("type", "practice");
        if (selectedTopic !== "all")
            params.set("topicId", selectedTopic);
        if (selectedDifficulty !== "all")
            params.set("difficulty", selectedDifficulty);
        params.set("limit", questionLimit.toString());
        navigate("/test/start?".concat(params.toString()));
    };
    return (<div className="min-h-screen p-6 lg:p-8 relative">
      <StudentNav_1.default />
      {/* Lab Background Image */}
      <div className="fixed inset-0 z-0 opacity-10" style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}/>
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Practice Mode</h1>
          <p className="text-white/70 mt-1">Customize your practice session</p>
        </div>

        <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <card_1.Card className="glass-card border-white/20 backdrop-blur-xl bg-white/10">
            <card_1.CardHeader>
              <div className="flex items-center gap-3">
                <lucide_react_1.Library className="h-8 w-8 text-orange-400"/>
                <card_1.CardTitle className="text-white">Configure Practice Session</card_1.CardTitle>
              </div>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-6">
              <div className="space-y-2">
                <label_1.Label className="text-white">Select Topic</label_1.Label>
                <select_1.Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <select_1.SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <select_1.SelectValue placeholder="All Topics"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    <select_1.SelectItem value="all">All Topics</select_1.SelectItem>
                    {topics === null || topics === void 0 ? void 0 : topics.map(function (topic) { return (<select_1.SelectItem key={topic._id} value={topic._id}>
                        {topic.name}
                      </select_1.SelectItem>); })}
                  </select_1.SelectContent>
                </select_1.Select>
              </div>

              <div className="space-y-2">
                <label_1.Label className="text-white">Difficulty Level</label_1.Label>
                <select_1.Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <select_1.SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <select_1.SelectValue placeholder="All Levels"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    <select_1.SelectItem value="all">All Levels</select_1.SelectItem>
                    <select_1.SelectItem value="easy">Easy</select_1.SelectItem>
                    <select_1.SelectItem value="medium">Medium</select_1.SelectItem>
                    <select_1.SelectItem value="hard">Hard</select_1.SelectItem>
                  </select_1.SelectContent>
                </select_1.Select>
              </div>

              <div className="space-y-2">
                <label_1.Label className="text-white">Number of Questions (10-100)</label_1.Label>
                <select_1.Select value={questionLimit.toString()} onValueChange={function (v) { return setQuestionLimit(parseInt(v)); }}>
                  <select_1.SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <select_1.SelectValue />
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    <select_1.SelectItem value="10">10 Questions</select_1.SelectItem>
                    <select_1.SelectItem value="20">20 Questions</select_1.SelectItem>
                    <select_1.SelectItem value="30">30 Questions</select_1.SelectItem>
                    <select_1.SelectItem value="50">50 Questions</select_1.SelectItem>
                    <select_1.SelectItem value="75">75 Questions</select_1.SelectItem>
                    <select_1.SelectItem value="100">100 Questions</select_1.SelectItem>
                  </select_1.SelectContent>
                </select_1.Select>
              </div>

              <button_1.Button onClick={handleStartPractice} className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700" disabled={!(subscriptionAccess === null || subscriptionAccess === void 0 ? void 0 : subscriptionAccess.hasAccess)}>
                <lucide_react_1.Target className="h-4 w-4 mr-2"/>
                Start Practice
              </button_1.Button>
            </card_1.CardContent>
          </card_1.Card>
        </framer_motion_1.motion.div>
      </div>
    </div>);
}
