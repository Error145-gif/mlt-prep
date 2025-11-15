"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardHeader;
var avatar_1 = require("@/components/ui/avatar");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var react_router_1 = require("react-router");
function DashboardHeader(_a) {
    var _b, _c;
    var userProfile = _a.userProfile, subscriptionAccess = _a.subscriptionAccess;
    var navigate = (0, react_router_1.useNavigate)();
    return (<div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {(userProfile === null || userProfile === void 0 ? void 0 : userProfile.avatarUrl) && (<avatar_1.Avatar className="h-16 w-16 border-2 border-white/20">
            <avatar_1.AvatarImage src={userProfile.avatarUrl}/>
            <avatar_1.AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl">
              {((_c = (_b = userProfile.name) === null || _b === void 0 ? void 0 : _b.charAt(0)) === null || _c === void 0 ? void 0 : _c.toUpperCase()) || "U"}
            </avatar_1.AvatarFallback>
          </avatar_1.Avatar>)}
        <div>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">Welcome back, {(userProfile === null || userProfile === void 0 ? void 0 : userProfile.name) || "Student"}!</h1>
          <p className="text-white/90 mt-1 drop-shadow-md">Continue your MLT learning journey</p>
        </div>
      </div>
      {subscriptionAccess && !subscriptionAccess.hasAccess && (<button_1.Button onClick={function () { return navigate("/subscription"); }} className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
          <lucide_react_1.CreditCard className="h-4 w-4 mr-2"/>
          View Plans
        </button_1.Button>)}
    </div>);
}
