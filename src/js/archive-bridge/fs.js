const {ipcRenderer} = require("electron");

export function scanDir(callback) {
    ipcRenderer.invoke("scanDir").then(callback);
}

export function changePath(target) {
    ipcRenderer.send("changePath", target);
}

export function createFolder(name, callback) {
    ipcRenderer.invoke("createFolder", name).then(callback);
}

export function deleteFolder(name, callback) {
    ipcRenderer.invoke("deleteFolder", name).then(callback);
}
