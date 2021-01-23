"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var zip_1 = require("../zip/zip");
var ui_1 = require("./ui");
var electron_1 = require("electron");
var path_1 = require("path");
var extendedFs_1 = require("../extendedFs/extendedFs");
var fs_1 = require("fs");
var mime = require("mime");
var __root = path_1.join(__dirname, "..", "..", "..");
var Program;
(function (Program) {
    var Zip = zip_1.ZipLib.Zip;
    var UiEngine = ui_1.Ui.UiEngine;
    var Archive = /** @class */ (function () {
        function Archive() {
        }
        Archive.main = function () {
            var stat = new Stat();
            var zipArchive = Zip.open(__root + "\\res\\data\\archive\\archive.zip");
            var archiveStat = stat.getStat();
            if (archiveStat === false) {
                stat.setStat({
                    archive: {
                        status: "decoded"
                    }
                });
                archiveStat = stat.getStat();
            }
            if (typeof archiveStat === "object") {
                if (archiveStat.archive.status === "encoded") {
                    zipArchive.Extract(__root + "\\res\\cash\\archive");
                    fs_1.unlinkSync(__root + "\\res\\data\\archive\\archive.zip");
                    archiveStat.archive.status = "decoded";
                    stat.setStat(archiveStat);
                }
            }
            electron_1.app.on("ready", function () {
                var ui = new UiEngine({
                    electron: {
                        icon: __root + "\\res\\icon\\icon.ico",
                        webPreferences: {
                            nodeIntegration: true
                        }
                    },
                    uiEngine: {
                        dev: true,
                        menu: false
                    }
                });
                var archiveBridge = new ArchiveBridge();
                ui.window.loadFile(__root + "\\index.html");
            });
        };
        return Archive;
    }());
    Program.Archive = Archive;
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
    var ArchiveBridge = /** @class */ (function () {
        function ArchiveBridge() {
            var _this = this;
            this.path = "\\";
            electron_1.ipcMain.on("scanDir", function (event) {
                event.returnValue = {
                    returnValue: {
                        entries: _this.scanDir(),
                        path: _this.path
                    }
                };
            });
        }
        ArchiveBridge.prototype.scanDir = function () {
            var path = this.path;
            path = __root + "\\res\\cash\\archive" + path;
            var entries = fs_1.readdirSync(path);
            var scan = [];
            for (var x in entries) {
                var entry = entries[x];
                var stat = fs_1.statSync(path + entry);
                if (stat.isDirectory()) {
                    scan.push({
                        type: "dir",
                        name: entry
                    });
                }
                else {
                    scan.push({
                        type: "file",
                        name: entry,
                        mime: mime.getType(entry),
                        size: stat.size
                    });
                }
            }
            return scan;
        };
        return ArchiveBridge;
    }());
    electron_1.app.on("ready", function () {
        electron_1.app.on("before-quit", function () {
            var stat = new Stat();
            var statFile = stat.getStat();
            if (typeof statFile === "object") {
                if (statFile.archive.status === "decoded") {
                    var zipArchive = Zip.open(__root + "\\res\\data\\archive\\archive.zip");
                    try {
                        zipArchive.Pack(__root + "\\res\\cash\\archive");
                    }
                    catch (err) {
                        console.log(err);
                    }
                    statFile.archive.status = "encoded";
                    stat.setStat(statFile);
                    extendedFs_1.ExtendedFs.deleteRecursive(__root + "\\res\\cash\\archive");
                }
            }
        });
    });
})(Program || (Program = {}));
Program.Archive.main();
//# sourceMappingURL=index.js.map