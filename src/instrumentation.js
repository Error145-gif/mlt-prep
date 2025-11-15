"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.InstrumentationProvider = InstrumentationProvider;
var button_1 = require("@/components/ui/button");
var collapsible_1 = require("@/components/ui/collapsible");
var dialog_1 = require("@/components/ui/dialog");
var react_dialog_1 = require("@radix-ui/react-dialog");
var lucide_react_1 = require("lucide-react");
var react_1 = require("react");
function reportErrorToVly(errorData) {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!import.meta.env.VITE_VLY_APP_ID) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch(import.meta.env.VITE_VLY_MONITORING_URL, {
                            method: "POST",
                            body: JSON.stringify(__assign(__assign({}, errorData), { url: window.location.href, projectSemanticIdentifier: import.meta.env.VITE_VLY_APP_ID })),
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Failed to report error to Vly:", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function ErrorDialog(_a) {
    var error = _a.error, setError = _a.setError;
    return (<react_dialog_1.Dialog defaultOpen={true} onOpenChange={function () {
            setError(null);
        }}>
      <dialog_1.DialogContent className="bg-red-700 text-white max-w-4xl">
        <dialog_1.DialogHeader>
          <dialog_1.DialogTitle>Runtime Error</dialog_1.DialogTitle>
        </dialog_1.DialogHeader>
        A runtime error occurred. Open the vly editor to automatically debug the
        error.
        <div className="mt-4">
          <collapsible_1.Collapsible>
            <collapsible_1.CollapsibleTrigger>
              <div className="flex items-center font-bold cursor-pointer">
                See error details <lucide_react_1.ChevronDown />
              </div>
            </collapsible_1.CollapsibleTrigger>
            <collapsible_1.CollapsibleContent className="max-w-[460px]">
              <div className="mt-2 p-3 bg-neutral-800 rounded text-white text-sm overflow-x-auto max-h-60 max-w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <pre className="whitespace-pre">{error.stack}</pre>
              </div>
            </collapsible_1.CollapsibleContent>
          </collapsible_1.Collapsible>
        </div>
        <dialog_1.DialogFooter>
          <a href={"https://vly.ai/project/".concat(import.meta.env.VITE_VLY_APP_ID)} target="_blank">
            <button_1.Button>
              <lucide_react_1.ExternalLink /> Open editor
            </button_1.Button>
          </a>
        </dialog_1.DialogFooter>
      </dialog_1.DialogContent>
    </react_dialog_1.Dialog>);
}
var ErrorBoundary = /** @class */ (function (_super) {
    __extends(ErrorBoundary, _super);
    function ErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { hasError: false, error: null };
        return _this;
    }
    ErrorBoundary.getDerivedStateFromError = function () {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    };
    ErrorBoundary.prototype.componentDidCatch = function (error, info) {
        var _a, _b;
        // logErrorToMyService(
        //   error,
        //   // Example "componentStack":
        //   //   in ComponentThatThrows (created by App)
        //   //   in ErrorBoundary (created by App)
        //   //   in div (created by App)
        //   //   in App
        //   info.componentStack,
        //   // Warning: `captureOwnerStack` is not available in production.
        //   React.captureOwnerStack(),
        // );
        reportErrorToVly({
            error: error.message,
            stackTrace: error.stack,
        });
        this.setState({
            hasError: true,
            error: {
                error: error.message,
                stack: (_b = (_a = info.componentStack) !== null && _a !== void 0 ? _a : error.stack) !== null && _b !== void 0 ? _b : "",
            },
        });
    };
    ErrorBoundary.prototype.render = function () {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (<ErrorDialog error={{
                    error: "An error occurred",
                    stack: "",
                }} setError={function () { }}/>);
        }
        return this.props.children;
    };
    return ErrorBoundary;
}(react_1.default.Component));
function InstrumentationProvider(_a) {
    var _this = this;
    var children = _a.children;
    var _b = (0, react_1.useState)(null), error = _b[0], setError = _b[1];
    (0, react_1.useEffect)(function () {
        var handleError = function (event) { return __awaiter(_this, void 0, void 0, function () {
            var error_2;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        console.log(event);
                        event.preventDefault();
                        setError({
                            error: event.message,
                            stack: ((_a = event.error) === null || _a === void 0 ? void 0 : _a.stack) || "",
                            filename: event.filename || "",
                            lineno: event.lineno,
                            colno: event.colno,
                        });
                        if (!import.meta.env.VITE_VLY_APP_ID) return [3 /*break*/, 2];
                        return [4 /*yield*/, reportErrorToVly({
                                error: event.message,
                                stackTrace: (_b = event.error) === null || _b === void 0 ? void 0 : _b.stack,
                                filename: event.filename,
                                lineno: event.lineno,
                                colno: event.colno,
                            })];
                    case 1:
                        _c.sent();
                        _c.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        error_2 = _c.sent();
                        console.error("Error in handleError:", error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        var handleRejection = function (event) { return __awaiter(_this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        console.error(event);
                        if (!import.meta.env.VITE_VLY_APP_ID) return [3 /*break*/, 2];
                        return [4 /*yield*/, reportErrorToVly({
                                error: event.reason.message,
                                stackTrace: event.reason.stack,
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        setError({
                            error: event.reason.message,
                            stack: event.reason.stack,
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        console.error("Error in handleRejection:", error_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        window.addEventListener("error", handleError);
        window.addEventListener("unhandledrejection", handleRejection);
        return function () {
            window.removeEventListener("error", handleError);
            window.removeEventListener("unhandledrejection", handleRejection);
        };
    }, []);
    return (<>
      <ErrorBoundary>{children}</ErrorBoundary>
      {error && <ErrorDialog error={error} setError={setError}/>}
    </>);
}
