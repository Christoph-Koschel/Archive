const {ipcRenderer} = require("electron");

export function scanDir() {
    return ipcRenderer.sendSync("scanDir");
}

export function changePath() {

}
