import {app, BrowserWindow, dialog} from "electron";
import {ExtendedFs} from "../extendedFs/extendedFs";
import {join} from "path";
import {Interfaces} from "./interfaces";
import {Storage} from "./storage";
import {ZipLib} from "../zip/zip";

const __root: string = join(__dirname, "..", "..", "..");

export namespace Ui {
    import IUiEngineConstructor = Interfaces.IUiEngineConstructor;
    import Stat = Storage.Stat;
    import IStat = Interfaces.IStat;
    import Zip = ZipLib.Zip;

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
                    message: "Do you want to yust minify the program or to quit it complete?",
                    title: "Close mode"
                });

                if (btnId === 0 || btnId === 1) {
                    let stat: Stat = new Stat();
                    let statFile: IStat | boolean = stat.getStat();
                    if (typeof statFile === "object") {
                        if (statFile.archive.status === "decoded") {
                            let zipArchive: Zip = Zip.open(__root + "\\res\\data\\archive\\archive.zip");
                            try {
                                zipArchive.Pack(__root + "\\res\\cash\\archive");
                            } catch (err) {
                                console.log(err);
                            }
                            statFile.archive.status = "encoded";
                            stat.setStat(statFile);
                            ExtendedFs.deleteRecursive(__root + "\\res\\cash\\archive");
                        }
                    }
                }
                app.quit();
            });
        }
    }
}
