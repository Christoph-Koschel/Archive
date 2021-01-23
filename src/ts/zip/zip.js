"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZipLib = void 0;
var child_process_1 = require("child_process");
var ZipLib;
(function (ZipLib) {
    var Zip = /** @class */ (function () {
        function Zip(path) {
            this.file = path;
        }
        Zip.open = function (path) {
            return new Zip(path);
        };
        Zip.prototype.Extract = function (destination) {
            var log = child_process_1.execSync("\"" + __dirname + ("\\Zip.exe\" --unzip " + this.file + " " + destination));
            console.log(log);
        };
        Zip.prototype.Pack = function (target) {
            var log = child_process_1.execSync("\"" + __dirname + ("\\Zip.exe\" --zip " + target + " " + this.file));
            console.log(log);
        };
        return Zip;
    }());
    ZipLib.Zip = Zip;
})(ZipLib = exports.ZipLib || (exports.ZipLib = {}));
//# sourceMappingURL=zip.js.map