"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var Program;
(function (Program) {
    var Archive = /** @class */ (function () {
        function Archive() {
        }
        Archive.main = function () {
            var stat = new Stat();
            // let archiveStatus: string = stat.getStat();
            var obj = {
                archive: {
                    status: "decoded"
                }
            };
            console.log(typeof obj);
            // if (archiveStatus === "encoded") {
            //
            // }
        };
        return Archive;
    }());
    Program.Archive = Archive;
    var Stat = /** @class */ (function () {
        function Stat() {
        }
        Stat.prototype.getStat = function () {
            var json = fs_1.readFileSync(path_1.join(__dirname, "..", "..", "..", "res/stat/stat.json"), "utf8");
            try {
                json = JSON.parse(json);
                if (false) {
                    //return json;
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
        };
        return Stat;
    }());
})(Program || (Program = {}));
Program.Archive.main();
//# sourceMappingURL=index.js.map