import {ZipLib} from "../zip/zip";
import {Ui} from "./ui";
import {Interfaces} from "./interfaces";
import {Storage} from "./storage";
import {app, BrowserWindow, dialog, ipcMain} from "electron";
import {join} from "path";
import {existsSync, mkdirSync, readdirSync, Stats, statSync, unlinkSync} from "fs";

let mime = require("mime");
const __root: string = join(__dirname, "..", "..", "..");

namespace Program {
    import IStat = Interfaces.IStat;
    import Zip = ZipLib.Zip;
    import UiEngine = Ui.UiEngine;
    import Stat = Storage.Stat;

    export class Archive {
        public static ui: UiEngine;


        public static main(): void {
            let stat: Stat = new Stat();
            let zipArchive: Zip = Zip.open(__root + "\\res\\data\\archive\\archive.zip");
            let archiveStat: IStat | boolean = stat.getStat();
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
                    unlinkSync(__root + "\\res\\data\\archive\\archive.zip");
                    archiveStat.archive.status = "decoded";
                    stat.setStat(archiveStat);
                }
            }

            app.on("ready", () => {
                this.ui = new UiEngine({
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
                let archiveBridge = new ArchiveBridge();
                this.ui.window.loadFile(__root + "\\index.html");
            });

        }

        public static getWindow(): BrowserWindow {
            return this.ui.window;
        }

    }

    class ArchiveBridge {
        private path: string;

        constructor() {
            this.path = "\\";

            ipcMain.handle("scanDir", async () => {
                return {
                    entries: this.scanDir(),
                    path: this.path
                }
            });

            ipcMain.handle("createFolder", async (event, args) => {
                if (!this.createFolder(args)) {
                    dialog.showMessageBoxSync(Archive.getWindow(), {
                        message: "A folder with this name already exists!",
                        buttons: ["Ok"],
                        type: "error",
                        title: "Error"
                    });
                    return false;
                } else {
                    return true;
                }
            });

            ipcMain.on("changePath", (event, args) => {
                this.changePath(args);
            });
        }

        private scanDir(): object[] {
            let path: string = this.path;
            path = __root + "\\res\\cash\\archive" + path;
            let entries: object = readdirSync(path);
            let scan: object[] = [];
            // @ts-ignore
            for (let i = 0; i < entries.length; i++) {
                let entry = entries[i];
                let stat: Stats = statSync(path + "\\" + entry);
                if (stat.isDirectory()) {
                    scan.push({
                        type: "dir",
                        name: entry
                    });
                } else {
                    scan.push({
                        type: "file",
                        name: entry,
                        mime: mime.getType(entry),
                        size: stat.size
                    });
                }
            }

            return scan;
        }

        private changePath(target): void {
            try {
                let path = join(__root, "\\res\\cash\\archive", this.path, target);
                if (existsSync(path) && statSync(path).isDirectory()) {
                    this.path = join(this.path, target);
                }
            } catch (err) {
                console.log(err);
            }
        }

        private createFolder(target): boolean {
            let path = join(__root, "\\res\\cash\\archive", this.path, target);
            if (existsSync(path) && statSync(path).isDirectory()) {
                return false;
            } else {
                mkdirSync(path);
                return true;
            }
        }
    }
}

Program.Archive.main();


