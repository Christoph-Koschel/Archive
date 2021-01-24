"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ui = void 0;
var electron_1 = require("electron");
var extendedFs_1 = require("../extendedFs/extendedFs");
var path_1 = require("path");
var storage_1 = require("./storage");
var zip_1 = require("../zip/zip");
var __root = path_1.join(__dirname, "..", "..", "..");
var Ui;
(function (Ui) {
    var Stat = storage_1.Storage.Stat;
    var Zip = zip_1.ZipLib.Zip;
    var UiEngine = /** @class */ (function () {
        function UiEngine(option) {
            var _this = this;
            this.window = new electron_1.BrowserWindow(option.electron);
            if (option.uiEngine) {
                if (option.uiEngine.dev) {
                    this.window.webContents.openDevTools();
                }
                if (!option.uiEngine.menu) {
                    this.window.setMenu(null);
                }
            }
            this.window.on("close", function () {
                var btnId = electron_1.dialog.showMessageBoxSync(_this.window, {
                    type: "question",
                    buttons: ["Yes", "No"],
                    message: "Do you want to yust minify the program or to quit it complete?",
                    title: "Close mode"
                });
                if (btnId === 0 || btnId === 1) {
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
                }
                electron_1.app.quit();
            });
        }
        return UiEngine;
    }());
    Ui.UiEngine = UiEngine;
})(Ui = exports.Ui || (exports.Ui = {}));
//# sourceMappingURL=ui.js.map