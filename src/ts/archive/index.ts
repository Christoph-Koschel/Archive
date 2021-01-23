import {ZipLib} from "../zip/zip";
import {Ui} from "./ui";
import {app} from "electron";
import {join} from "path";
import {Interfaces} from "./interfaces";
import {ExtendedFs} from "../extendedFs/extendedFs";
import {readFileSync, unlinkSync, writeFileSync} from "fs";

const __root: string = join(__dirname, "..", "..", "..");

namespace Program {
    import IStat = Interfaces.IStat;
    import Zip = ZipLib.Zip;
    import UiEngine = Ui.UiEngine;

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
            app.on("ready",() => {
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
                ui.window.loadFile(__root + "\\index.html");
            });
        }
    }

    class Stat {
        public getStat(): IStat | boolean {
            let json: string | object = readFileSync(__root + "/res/stat/stat.json", "utf8");
            try {
                json = JSON.parse(json);
                if (typeof json === "object") {
                    // @ts-ignore
                    return json;
                } else {
                    return false;
                }
            } catch (err) {
                return false;
            }
        }

        public setStat(obj: IStat): void {
            writeFileSync(__root + "/res/stat/stat.json", JSON.stringify(obj, null, 4))
        }
    }

    app.on("ready",() => {
        app.on("before-quit", () => {
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
        });
    });
}

Program.Archive.main();


