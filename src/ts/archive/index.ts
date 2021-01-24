import {ZipLib} from "../zip/zip";
import {Ui} from "./ui";
import {app, ipcMain} from "electron";
import {join} from "path";
import {Interfaces} from "./interfaces";
import {readdirSync, Stats, statSync, unlinkSync} from "fs";
import {Storage} from "./storage";

let mime = require("mime");
const __root: string = join(__dirname, "..", "..", "..");

namespace Program {
    import IStat = Interfaces.IStat;
    import Zip = ZipLib.Zip;
    import UiEngine = Ui.UiEngine;
    import Stat = Storage.Stat;

    export class Archive {
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
                let ui: UiEngine = new UiEngine({
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
                ui.window.loadFile(__root + "\\index.html");
            });
        }
    }

    class ArchiveBridge {
        private path: string;

        constructor() {
            this.path = "\\";

            ipcMain.on("scanDir", (event) => {
                event.returnValue = {
                    returnValue: {
                        entries: this.scanDir(),
                        path: this.path
                    }
                };
            });
        }

        private scanDir(): object[] {
            let path: string = this.path;
            path = __root + "\\res\\cash\\archive" + path;
            let entries: object = readdirSync(path);
            let scan: object[] = [];

            for(const x in entries) {
                let entry = entries[x];
                let stat: Stats = statSync(path + entry);
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
    }
}

Program.Archive.main();


