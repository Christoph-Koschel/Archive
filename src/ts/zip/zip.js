"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZipLib = void 0;
var child_process_1 = require("child_process");
var ZipLib;
(function (ZipLib) {
    var Zip = /** @class */ (function () {
        function Zip() {
        }
        Zip.open = function () {
            return new Zip();
        };
        Zip.prototype.Extract = function (target, destination) {
            child_process_1.execSync("\"" + __dirname + ("\\Zip.exe\" --unzip " + target + " " + destination));
        };
        Zip.prototype.Pack = function (target, destination, name) {
            child_process_1.execSync("\"" + __dirname + ("\\Zip.exe\" --zip " + target + " " + destination + " " + name));
        };
        return Zip;
    }());
    ZipLib.Zip = Zip;
})(ZipLib = exports.ZipLib || (exports.ZipLib = {}));
//# sourceMappingURL=zip.js.map