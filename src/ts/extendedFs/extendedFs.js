"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedFs = void 0;
var fs_1 = require("fs");
var ExtendedFs;
(function (ExtendedFs) {
    function deleteRecursive(path) {
        function deleteLoop(path) {
            var dirs = fs_1.readdirSync(path);
            dirs.forEach(function (dir) {
                if (fs_1.statSync(path + "\\" + dir).isDirectory()) {
                    deleteLoop(path + "\\" + dir);
                    fs_1.rmdirSync(path + "\\" + dir);
                }
                else {
                    fs_1.unlinkSync(path + "\\" + dir);
                }
            });
        }
        deleteLoop(path);
        fs_1.unlinkSync(path);
    }
    ExtendedFs.deleteRecursive = deleteRecursive;
})(ExtendedFs = exports.ExtendedFs || (exports.ExtendedFs = {}));
//# sourceMappingURL=extendedFs.js.map