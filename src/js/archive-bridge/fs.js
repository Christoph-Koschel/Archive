const {ipcRenderer} = require("electron");

export function scanDir(callback) {
    ipcRenderer.invoke("scanDir").then(callback);
}

export function changePath(target) {
    ipcRenderer.send("changePath", target);
}
