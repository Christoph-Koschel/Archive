import {execSync} from "child_process";

export namespace ZipLib {
    export class Zip {
        private readonly file: string;

        public static open(path: string): Zip {
            return new Zip(path);
        }

        private constructor(path: string) {
            this.file = path;
        }

        public Extract(destination: string): void {
            let log = execSync(`\"` + __dirname + `\\Zip.exe\" --unzip ${this.file} ${destination}`);
            console.log(log);
        }

        public Pack(target: string): void {
            let log = execSync(`\"` + __dirname + `\\Zip.exe\" --zip ${target} ${this.file}`);
            console.log(log);
        }
    }
}
