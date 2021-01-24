"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var __root = path_1.join(__dirname, "..", "..", "..");
var Storage;
(function (Storage) {
    var Stat = /** @class */ (function () {
        function Stat() {
        }
        Stat.prototype.getStat = function () {
            var json = fs_1.readFileSync(__root + "/res/stat/stat.json", "utf8");
            try {
                json = JSON.parse(json);
                if (typeof json === "object") {
                    // @ts-ignore
                    return json;
                }
                else {
                    return false;
                }
            }
            catch (err) {
                return false;
            }
        };
        Stat.prototype.setStat = function (obj) {
            fs_1.writeFileSync(__root + "/res/stat/stat.json", JSON.stringify(obj, null, 4));
        };
        return Stat;
    }());
    Storage.Stat = Stat;
})(Storage = exports.Storage || (exports.Storage = {}));
//# sourceMappingURL=storage.js.map