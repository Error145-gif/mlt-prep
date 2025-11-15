"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Library;
var StudentNav_1 = require("@/components/StudentNav");
function Library() {
    return (<div className="min-h-screen relative">
      <StudentNav_1.default />
      <div>Library</div>
    </div>);
}
