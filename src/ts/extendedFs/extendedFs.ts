import {readdirSync, rmdirSync, statSync, unlinkSync} from "fs";

export namespace ExtendedFs {
    export function deleteRecursive(path: string): void {
        function deleteLoop(path: string): void {
            let dirs = readdirSync(path);
            dirs.forEach((dir) => {
                if (statSync(path + "\\" + dir).isDirectory()) {
                    deleteLoop(path + "\\" + dir);
                    rmdirSync(path + "\\" + dir);
                } else {
                    unlinkSync(path + "\\" + dir);
                }
            });
        }
        deleteLoop(path);
        unlinkSync(path);
    }
}
