const {ipcRenderer} = require("electron");

export function scanDir() {
    return ipcRenderer.sendSync("scanDir")["returnValue"];
}

export function changePath(target) {
    ipcRenderer.sendSync("changePath", target);
}
