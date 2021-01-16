import {execSync} from "child_process";

export namespace ZipLib {
    export class Zip {



        public static open(): Zip {
            return new Zip();
        }

        private constructor() {

        }

        public Extract(target: string, destination: string): void {
            execSync(`\"` + __dirname + `\\Zip.exe\" --unzip ${target} ${destination}`);
        }

        public Pack(target: string, destination: string, name: string): void {
            execSync(`\"` + __dirname + `\\Zip.exe\" --zip ${target} ${destination} ${name}`);
        }
    }
}
