import {app, BrowserWindow, dialog} from "electron";
import {Interfaces} from "./interfaces";

export namespace Ui {
    import IUiEngineConstructor = Interfaces.IUiEngineConstructor;

    export class UiEngine {
        public readonly window: BrowserWindow;

        public constructor(option: IUiEngineConstructor) {
            this.window = new BrowserWindow(option.electron);

            if (option.uiEngine) {
                if (option.uiEngine.dev) {
                    this.window.webContents.openDevTools();
                }
                if (!option.uiEngine.menu) {
                    this.window.setMenu(null);
                }
            }

            this.window.on("close",() => {
                let btnId: number = dialog.showMessageBoxSync(this.window,{
                    type: "question",
                    buttons: ["Yes", "No"],
                    message: "Do you want to yust minify the program or to quit it complete?"
                });

                if (btnId === 0 || btnId === 1) {
                    app.quit();
                }
            });
        }
    }
}
