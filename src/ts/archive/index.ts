import {ZipLib} from "../zip/zip";
import {readFileSync, writeFileSync} from "fs";
import {join} from "path";
import {Interfaces} from "./interface";

const __root: string = join(__dirname, "..", "..", "..");

namespace Program {
    import IStat = Interfaces.IStat;
    import Zip = ZipLib.Zip;

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
                    zipArchive.Extract(__root + "\\res\\cash\\archive")
                }
            }

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


}

Program.Archive.main();

