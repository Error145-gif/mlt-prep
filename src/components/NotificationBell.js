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
exports.default = NotificationBell;
var react_1 = require("convex/react");
var api_1 = require("@/convex/_generated/api");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
var badge_1 = require("@/components/ui/badge");
var scroll_area_1 = require("@/components/ui/scroll-area");
var react_2 = require("react");
var sonner_1 = require("sonner");
function NotificationBell() {
    var _this = this;
    var notifications = (0, react_1.useQuery)(api_1.api.notifications.getUserNotifications);
    var unreadCount = (0, react_1.useQuery)(api_1.api.notifications.getUnreadCount);
    var markAsRead = (0, react_1.useMutation)(api_1.api.notifications.markAsRead);
    var markAllAsRead = (0, react_1.useMutation)(api_1.api.notifications.markAllAsRead);
    var previousCountRef = (0, react_2.useRef)(0);
    var hasRequestedPermission = (0, react_2.useRef)(false);
    // Request notification permission on mount
    (0, react_2.useEffect)(function () {
        if (!hasRequestedPermission.current && "Notification" in window) {
            if (Notification.permission === "default") {
                Notification.requestPermission();
            }
            hasRequestedPermission.current = true;
        }
    }, []);
    // Show browser notification and toast when new notification arrives
    (0, react_2.useEffect)(function () {
        console.log("Notification check - Unread count:", unreadCount, "Previous:", previousCountRef.current);
        console.log("Notifications:", (notifications === null || notifications === void 0 ? void 0 : notifications.length) || 0);
        if (unreadCount !== undefined && unreadCount > previousCountRef.current) {
            // Get the latest notification
            var latestNotification = notifications === null || notifications === void 0 ? void 0 : notifications[0];
            console.log("New notification detected:", latestNotification);
            if (latestNotification && !latestNotification.isRead) {
                // Show toast notification
                sonner_1.toast.info(latestNotification.title, {
                    description: latestNotification.message,
                    duration: 5000,
                });
                // Show browser notification if permission granted
                if ("Notification" in window && Notification.permission === "granted") {
                    new Notification(latestNotification.title, {
                        body: latestNotification.message,
                        icon: "/logo.png",
                        badge: "/logo.png",
                        tag: latestNotification._id,
                    });
                }
            }
        }
        if (unreadCount !== undefined) {
            previousCountRef.current = unreadCount;
        }
    }, [unreadCount, notifications]);
    var handleNotificationClick = function (notificationId) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, markAsRead({ notificationId: notificationId })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleMarkAllRead = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, markAllAsRead()];
                case 1:
                    _a.sent();
                    sonner_1.toast.success("All notifications marked as read");
                    return [2 /*return*/];
            }
        });
    }); };
    return (<dropdown_menu_1.DropdownMenu>
      <dropdown_menu_1.DropdownMenuTrigger asChild>
        <button_1.Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
          <lucide_react_1.Bell className="h-5 w-5"/>
          {unreadCount !== undefined && unreadCount > 0 && (<badge_1.Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </badge_1.Badge>)}
        </button_1.Button>
      </dropdown_menu_1.DropdownMenuTrigger>
      <dropdown_menu_1.DropdownMenuContent align="end" className="w-80 glass-card border-white/20 backdrop-blur-xl bg-white/10">
        <div className="flex items-center justify-between p-2">
          <h3 className="font-semibold text-white">Notifications</h3>
          {unreadCount !== undefined && unreadCount > 0 && (<button_1.Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="text-xs text-white/80 hover:text-white hover:bg-white/10">
              Mark all read
            </button_1.Button>)}
        </div>
        <dropdown_menu_1.DropdownMenuSeparator className="bg-white/20"/>
        <scroll_area_1.ScrollArea className="h-[400px]">
          {!notifications || notifications.length === 0 ? (<div className="p-4 text-center text-white/60 text-sm">
              No notifications yet
            </div>) : (notifications.map(function (notif) { return (<dropdown_menu_1.DropdownMenuItem key={notif._id} className={"p-3 cursor-pointer ".concat(!notif.isRead ? "bg-blue-500/10" : "")} onClick={function () { return handleNotificationClick(notif._id); }}>
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-white text-sm">
                      {notif.title}
                    </p>
                    {!notif.isRead && (<div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1"/>)}
                  </div>
                  <p className="text-white/80 text-xs">{notif.message}</p>
                  {notif.sentAt && (<p className="text-white/60 text-xs">
                      {new Date(notif.sentAt).toLocaleDateString()} at{" "}
                      {new Date(notif.sentAt).toLocaleTimeString()}
                    </p>)}
                </div>
              </dropdown_menu_1.DropdownMenuItem>); }))}
        </scroll_area_1.ScrollArea>
      </dropdown_menu_1.DropdownMenuContent>
    </dropdown_menu_1.DropdownMenu>);
}
