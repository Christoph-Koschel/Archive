"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ui = void 0;
var electron_1 = require("electron");
var Ui;
(function (Ui) {
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
                    message: "Do you want to yust minify the program or to quit it complete?"
                });
                if (btnId === 0 || btnId === 1) {
                    electron_1.app.quit();
                }
            });
        }
        return UiEngine;
    }());
    Ui.UiEngine = UiEngine;
})(Ui = exports.Ui || (exports.Ui = {}));
//# sourceMappingURL=ui.js.map