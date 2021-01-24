import {ZipLib} from "../zip/zip";
import {Ui} from "./ui";
import {Interfaces} from "./interfaces";
import {Storage} from "./storage";
import {app, BrowserWindow, dialog, ipcMain} from "electron";
import {join} from "path";
import {existsSync, mkdirSync, readdirSync, Stats, statSync, unlinkSync} from "fs";
import {ExtendedFs} from "../extendedFs/extendedFs";

let mime = require("mime");
const __root: string = join(__dirname, "..", "..", "..");

namespace Program {
    import IStat = Interfaces.IStat;
    import Zip = ZipLib.Zip;
    import UiEngine = Ui.UiEngine;
    import Stat = Storage.Stat;
    import deleteRecursive = ExtendedFs.deleteRecursive;

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

            ipcMain.handle("createFolder", async (event, args: any) => {
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

            ipcMain.on("changePath", (event, args: any) => {
                this.changePath(args);
            });

            ipcMain.handle("deleteFolder",async (event, args) => {
                let pushId = dialog.showMessageBoxSync(Archive.getWindow(), {
                    message: "Do you want really delete this folder?",
                    buttons: ["Yes","No"],
                    type: "question",
                    title: "Permission"
                });
                if (pushId === 0) {
                    this.deleteFolder(args);
                }
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

        private changePath(target: any): void {
            try {
                let path = join(__root, "\\res\\cash\\archive", this.path, target);
                if (existsSync(path) && statSync(path).isDirectory()) {
                    this.path = join(this.path, target);
                }
            } catch (err) {
                console.log(err);
            }
        }

        private createFolder(target: any): boolean {
            let path = join(__root, "\\res\\cash\\archive", this.path, target);
            if (existsSync(path) && statSync(path).isDirectory()) {
                return false;
            } else {
                mkdirSync(path);
                return true;
            }
        }

        private deleteFolder(target: any): void {
            let path = join(__root + "\\res\\cash\\archive", this.path, target);
            if (existsSync(path) && statSync(path).isDirectory()) {
                deleteRecursive(path);
            }
        }
    }
}

Program.Archive.main();


