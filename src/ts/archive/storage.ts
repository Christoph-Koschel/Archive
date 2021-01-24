import {readFileSync, writeFileSync} from "fs";
import {Interfaces} from "./interfaces";
import {join} from "path";

const __root: string = join(__dirname, "..", "..", "..");

export namespace Storage {
    import IStat = Interfaces.IStat;

    export class Stat {
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
