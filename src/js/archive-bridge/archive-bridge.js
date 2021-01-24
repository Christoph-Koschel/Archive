import {scanDir} from "./fs.js";

function loadFileEntries() {
    let scan = scanDir();
    let path = scan["path"];
    let entries = scan["entries"];
    for (const x in entries) {
        let entry = entries[x];
        console.log(entry);
    }

    loadPath(path);
}

function loadPath(path) {
    document.getElementById("currentPath").innerHTML = "Archive:" + path;
}

window.addEventListener("load", () => {
    loadFileEntries();

});
