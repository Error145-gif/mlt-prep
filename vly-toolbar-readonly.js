"use strict";
// DO NOT MODIFY THIS FILE. THIS FILE IS READ-ONLY. CONTAINS ALL KEY APP FUNCTIONALITY.
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
exports.VlyToolbar = void 0;
exports.getReactComponentHierarchy = getReactComponentHierarchy;
exports.formatReactComponentHierarchy = formatReactComponentHierarchy;
exports.getSelectedElementAnnotation = getSelectedElementAnnotation;
exports.getSelectedElementsPrompt = getSelectedElementsPrompt;
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var snapdom_1 = require("@zumer/snapdom");
var FunctionComponent = 0;
var ClassComponent = 1;
var HostComponent = 5;
function getReactComponentHierarchy(element) {
    var _a, _b;
    if (!element) {
        return null;
    }
    var components = [];
    var maxComponents = 3;
    // Find the internal React Fiber node key.
    var fiberKey = Object.keys(element).find(function (key) {
        return key.startsWith("__reactFiber$") ||
            key.startsWith("__reactInternalInstance$");
    });
    if (!fiberKey) {
        return null;
    }
    var currentFiber = element[fiberKey];
    if (!currentFiber) {
        return null;
    }
    var _loop_1 = function () {
        var componentData = null;
        if (currentFiber.tag === ClassComponent ||
            currentFiber.tag === FunctionComponent) {
            var componentDefinition = currentFiber.type;
            if (componentDefinition) {
                var def = componentDefinition;
                var name_1 = def.displayName ||
                    def.name ||
                    ((_a = currentFiber._debugOwner) === null || _a === void 0 ? void 0 : _a.name) ||
                    "AnonymousComponent";
                componentData = { name: name_1, type: "regular" };
            }
        }
        else if (currentFiber.tag === HostComponent &&
            currentFiber._debugOwner &&
            ((_b = currentFiber._debugOwner.env) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes("server"))) {
            componentData = { name: currentFiber._debugOwner.name, type: "rsc" };
        }
        if (componentData) {
            var alreadyExists = components.some(function (c) { return c.name === componentData.name && c.type === componentData.type; });
            if (!alreadyExists) {
                components.push(componentData);
            }
        }
        currentFiber = currentFiber.return;
    };
    // Traverse up the Fiber tree.
    while (currentFiber && components.length < maxComponents) {
        _loop_1();
    }
    return components.length > 0 ? components : null;
}
function formatReactComponentHierarchy(hierarchy) {
    if (!hierarchy || hierarchy.length === 0) {
        return "No React components found for this element.";
    }
    var parts = hierarchy.map(function (info) { return "{name: ".concat(info.name, ", type: ").concat(info.type, "}"); });
    var description = "React component tree (from closest to farthest, ".concat(hierarchy.length, " closest element").concat(hierarchy.length > 1 ? "s" : "", "): ");
    description += parts.join(" child of ");
    return description;
}
function getSelectedElementAnnotation(element) {
    var hierarchy = getReactComponentHierarchy(element);
    if (hierarchy === null || hierarchy === void 0 ? void 0 : hierarchy[0]) {
        return {
            annotation: "".concat(hierarchy[0].name).concat(hierarchy[0].type === "rsc" ? " (RSC)" : ""),
        };
    }
    return { annotation: null };
}
function getSelectedElementsPrompt(elements) {
    var selectedComponentHierarchies = elements.map(function (e) {
        return getReactComponentHierarchy(e);
    });
    if (selectedComponentHierarchies.some(function (h) { return h && h.length > 0; })) {
        var content = "This is additional information on the elements that the user selected. Use this information to find the correct element in the codebase.\n\n  ".concat(selectedComponentHierarchies.map(function (h, index) {
            return "\n<element index=\"".concat(index + 1, "\">\n  ").concat(!h || h.length === 0 ? "No React component as parent detected" : "React component tree (from closest to farthest, 3 closest elements): ".concat(h.map(function (c) { return "{name: ".concat(c.name, ", type: ").concat(c.type, "}"); }).join(" child of ")), "\n</element>\n    ");
        }), "\n  ");
        return content;
    }
    return null;
}
var HIGHLIGHT_CLASS = "vly-toolbar-highlight";
// Add highlight style to the document
var injectHighlightStyle = function () {
    if (document.getElementById("vly-toolbar-style"))
        return;
    var style = document.createElement("style");
    style.id = "vly-toolbar-style";
    style.innerHTML = "\n    .".concat(HIGHLIGHT_CLASS, " {\n      outline: 2px solid #0070f3;\n      cursor: pointer;\n      background: rgba(0,112,243,0.08);\n    }\n  ");
    document.head.appendChild(style);
};
function getDomSelector(el) {
    if (el.id)
        return "#".concat(el.id);
    if (el.className && typeof el.className === "string") {
        return (el.tagName.toLowerCase() + "." + el.className.trim().replace(/\s+/g, "."));
    }
    return el.tagName.toLowerCase();
}
var Overlay = function (_a) {
    var ignoreList = _a.ignoreList, onSelect = _a.onSelect, onHover = _a.onHover, onUnhover = _a.onUnhover, selectMode = _a.selectMode;
    var lastHovered = (0, react_1.useRef)(null);
    var handleMouseMove = (0, react_1.useCallback)(function (e) {
        if (!selectMode)
            return;
        var overlay = e.currentTarget;
        overlay.style.pointerEvents = "none";
        var el = document.elementFromPoint(e.clientX, e.clientY);
        overlay.style.pointerEvents = "auto";
        if (!el || ignoreList.includes(el))
            return;
        if (lastHovered.current !== el) {
            if (lastHovered.current)
                lastHovered.current.classList.remove(HIGHLIGHT_CLASS);
            lastHovered.current = el;
            el.classList.add(HIGHLIGHT_CLASS);
            onHover(el);
        }
    }, [ignoreList, onHover, selectMode]);
    var handleMouseLeave = (0, react_1.useCallback)(function () {
        if (!selectMode)
            return;
        if (lastHovered.current) {
            lastHovered.current.classList.remove(HIGHLIGHT_CLASS);
            lastHovered.current = null;
        }
        onUnhover();
    }, [onUnhover]);
    var handleClick = (0, react_1.useCallback)(function (e) {
        e.preventDefault();
        e.stopPropagation();
        var overlay = e.currentTarget;
        overlay.style.pointerEvents = "none";
        var el = document.elementFromPoint(e.clientX, e.clientY);
        overlay.style.pointerEvents = "auto";
        if (!el || ignoreList.includes(el))
            return;
        if (lastHovered.current)
            lastHovered.current.classList.remove(HIGHLIGHT_CLASS);
        onSelect(el);
    }, [ignoreList, onSelect]);
    return (<div style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            cursor: "copy",
            pointerEvents: "auto",
        }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onClick={handleClick} tabIndex={0} role="button"/>);
};
var VlyToolbar = function () {
    var _a = (0, react_1.useState)(false), selectMode = _a[0], setSelectMode = _a[1];
    var toolbarRef = (0, react_1.useRef)(null);
    var _b = react_1.default.useState(true), showDevOverlay = _b[0], setShowDevOverlay = _b[1];
    var isDevDeployment = typeof window !== "undefined" &&
        window.location.hostname.endsWith(".vly.sh") &&
        window.self === window.top;
    react_1.default.useEffect(function () {
        injectHighlightStyle();
    }, []);
    // Listen for postMessage from parent to enable/disable select mode
    react_1.default.useEffect(function () {
        function handleMessage(event) {
            if (event.data && event.data.type === "vly-toolbar-enable-select") {
                setSelectMode(true);
            }
            if (event.data && event.data.type === "vly-toolbar-disable-select") {
                setSelectMode(false);
            }
        }
        window.addEventListener("message", handleMessage);
        return function () { return window.removeEventListener("message", handleMessage); };
    }, []);
    // Callbacks for overlay
    var handleSelect = (0, react_1.useCallback)(function (el) { return __awaiter(void 0, void 0, void 0, function () {
        var selector, hierarchy, formatted, imageDataUrl, canvas, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSelectMode(false);
                    selector = getDomSelector(el);
                    hierarchy = getReactComponentHierarchy(el);
                    formatted = formatReactComponentHierarchy(hierarchy);
                    imageDataUrl = undefined;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, snapdom_1.snapdom.toCanvas(el, { fast: true, compress: true })];
                case 2:
                    canvas = _a.sent();
                    imageDataUrl = canvas.toDataURL("image/png");
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.error("Failed to snapshot element", e_1);
                    return [3 /*break*/, 4];
                case 4:
                    window.parent.postMessage({
                        type: "vly-toolbar-select",
                        selector: selector,
                        reactHierarchy: hierarchy,
                        reactHierarchyFormatted: formatted,
                        image: imageDataUrl,
                    }, "*");
                    return [2 /*return*/];
            }
        });
    }); }, []);
    var handleHover = (0, react_1.useCallback)(function () {
        // Optionally do something on hover
    }, []);
    var handleUnhover = (0, react_1.useCallback)(function () {
        // Optionally do something on unhover
    }, []);
    // Build ignore list (toolbar itself)
    var ignoreList = react_1.default.useMemo(function () {
        var arr = [];
        if (toolbarRef.current)
            arr.push(toolbarRef.current);
        return arr;
    }, []);
    // Get project name for redirect URL
    var getProjectName = function () {
        if (typeof window !== "undefined") {
            var hostname = window.location.hostname;
            // Extract project name from hostname (e.g., "projectname.vly.sh")
            var match = hostname.match(/^([^.]+)\.vly\.sh$/);
            return match ? match[1] : "unknown";
        }
        return "unknown";
    };
    // Handle escape key to close modal
    react_1.default.useEffect(function () {
        var handleKeyDown = function (e) {
            if (e.key === 'Escape' && showDevOverlay) {
                setShowDevOverlay(false);
            }
        };
        if (showDevOverlay) {
            document.addEventListener('keydown', handleKeyDown);
            return function () { return document.removeEventListener('keydown', handleKeyDown); };
        }
    }, [showDevOverlay]);
    var handleOverlayClick = function (e) {
        // Only dismiss if clicking the overlay itself, not the modal content
        if (e.target === e.currentTarget) {
            setShowDevOverlay(false);
        }
    };
    var handleContinue = function () {
        setShowDevOverlay(false);
    };
    var handleGoToProject = function () {
        var projectName = getProjectName();
        window.location.href = "https://vly.ai/project/".concat(projectName, "?publish=true");
    };
    return (<>
      {isDevDeployment && showDevOverlay && (<div onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby="dev-env-label" style={{
                position: "fixed",
                inset: 0,
                zIndex: 99999,
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
            }}>
          <framer_motion_1.AnimatePresence>
            <framer_motion_1.motion.div onClick={function (e) { return e.stopPropagation(); }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, ease: "easeInOut" }} style={{
                position: "relative",
                cursor: "default",
            }}>
              <div className="flex items-center gap-3 rounded-lg border border-white/30 bg-white/95 px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2 rounded px-2 py-1 transition-colors hover:bg-white/95">
                  <div className="flex items-center gap-2">
                    <lucide_react_1.AlertTriangle className="h-4 w-4 text-orange-500"/>
                    <span id="dev-env-label" className="text-sm font-medium text-gray-700" title="Development deployment - should not be shared publicly. Use 'Go to project' to create a production version.">
                      This is a testing environment. Share only your published project.
                    </span>
                  </div>
                </div>
                <div className="h-6 w-px bg-gray-300"></div>
                <button onClick={handleContinue} className="flex items-center gap-2 rounded px-2 py-1 transition-colors hover:bg-white/95">
                  <lucide_react_1.MousePointer className="h-4 w-4 text-gray-600"/>
                  <span className="text-sm font-medium text-gray-700">
                    Click to test
                  </span>
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <button onClick={function (e) {
                e.stopPropagation();
                handleGoToProject();
            }} className="flex items-center gap-2 rounded px-2 py-1 transition-colors hover:bg-white/95">
                  <lucide_react_1.ExternalLink className="h-4 w-4 text-gray-600"/>
                  <span className="text-sm font-medium text-gray-700">
                    Publish Project
                  </span>
                </button>
              </div>
            </framer_motion_1.motion.div>
          </framer_motion_1.AnimatePresence>
        </div>)}
      {selectMode && (<Overlay ignoreList={ignoreList} onSelect={handleSelect} onHover={handleHover} onUnhover={handleUnhover} selectMode={selectMode}/>)}
      {/* Hide toolbar if there are no buttons or controls to show */}
      {/* If toolbar has no children, render nothing */}
      {/* <div ref={toolbarRef} ... /> is now hidden if empty */}
      {/* If you add controls in the future, restore this div */}
    </>);
};
exports.VlyToolbar = VlyToolbar;
exports.default = exports.VlyToolbar;
