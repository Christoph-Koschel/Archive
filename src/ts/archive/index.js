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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var zip_1 = require("../zip/zip");
var ui_1 = require("./ui");
var storage_1 = require("./storage");
var electron_1 = require("electron");
var path_1 = require("path");
var fs_1 = require("fs");
var extendedFs_1 = require("../extendedFs/extendedFs");
var mime = require("mime");
var __root = path_1.join(__dirname, "..", "..", "..");
var Program;
(function (Program) {
    var Zip = zip_1.ZipLib.Zip;
    var UiEngine = ui_1.Ui.UiEngine;
    var Stat = storage_1.Storage.Stat;
    var deleteRecursive = extendedFs_1.ExtendedFs.deleteRecursive;
    var Archive = /** @class */ (function () {
        function Archive() {
        }
        Archive.main = function () {
            var _this = this;
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
                _this.ui = new UiEngine({
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
                _this.ui.window.loadFile(__root + "\\index.html");
            });
        };
        Archive.getWindow = function () {
            return this.ui.window;
        };
        return Archive;
    }());
    Program.Archive = Archive;
    var ArchiveBridge = /** @class */ (function () {
        function ArchiveBridge() {
            var _this = this;
            this.path = "\\";
            electron_1.ipcMain.handle("scanDir", function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, {
                            entries: this.scanDir(),
                            path: this.path
                        }];
                });
            }); });
            electron_1.ipcMain.handle("createFolder", function (event, args) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!this.createFolder(args)) {
                        electron_1.dialog.showMessageBoxSync(Archive.getWindow(), {
                            message: "A folder with this name already exists!",
                            buttons: ["Ok"],
                            type: "error",
                            title: "Error"
                        });
                        return [2 /*return*/, false];
                    }
                    else {
                        return [2 /*return*/, true];
                    }
                    return [2 /*return*/];
                });
            }); });
            electron_1.ipcMain.on("changePath", function (event, args) {
                _this.changePath(args);
            });
            electron_1.ipcMain.handle("deleteFolder", function (event, args) { return __awaiter(_this, void 0, void 0, function () {
                var pushId;
                return __generator(this, function (_a) {
                    pushId = electron_1.dialog.showMessageBoxSync(Archive.getWindow(), {
                        message: "Do you want really delete this folder?",
                        buttons: ["Yes", "No"],
                        type: "question",
                        title: "Permission"
                    });
                    if (pushId === 0) {
                        this.deleteFolder(args);
                    }
                    return [2 /*return*/];
                });
            }); });
        }
        ArchiveBridge.prototype.scanDir = function () {
            var path = this.path;
            path = __root + "\\res\\cash\\archive" + path;
            var entries = fs_1.readdirSync(path);
            var scan = [];
            // @ts-ignore
            for (var i = 0; i < entries.length; i++) {
                var entry = entries[i];
                var stat = fs_1.statSync(path + "\\" + entry);
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
        ArchiveBridge.prototype.changePath = function (target) {
            try {
                var path = path_1.join(__root, "\\res\\cash\\archive", this.path, target);
                if (fs_1.existsSync(path) && fs_1.statSync(path).isDirectory()) {
                    this.path = path_1.join(this.path, target);
                }
            }
            catch (err) {
                console.log(err);
            }
        };
        ArchiveBridge.prototype.createFolder = function (target) {
            var path = path_1.join(__root, "\\res\\cash\\archive", this.path, target);
            if (fs_1.existsSync(path) && fs_1.statSync(path).isDirectory()) {
                return false;
            }
            else {
                fs_1.mkdirSync(path);
                return true;
            }
        };
        ArchiveBridge.prototype.deleteFolder = function (target) {
            var path = path_1.join(__root + "\\res\\cash\\archive", this.path, target);
            if (fs_1.existsSync(path) && fs_1.statSync(path).isDirectory()) {
                deleteRecursive(path);
            }
        };
        return ArchiveBridge;
    }());
})(Program || (Program = {}));
Program.Archive.main();
//# sourceMappingURL=index.js.map