import {changePath, scanDir} from "./fs.js";

function loadFileEntries() {
    let scan = scanDir();
    let path = scan["path"];
    let entries = scan["entries"];
    let entriesTable = document.getElementById("entriesView");
    entriesTable.innerHTML = "";

    if (path !== "\\") {
        let tr = document.createElement("tr");

        let td1 = document.createElement("td");
        let a = document.createElement("a");
        a.innerHTML = "..";
        a.addEventListener("click", function () {
            changePath(this.innerHTML);
            loadFileEntries();
        });

        let td2 = document.createElement("td");
        td2.innerHTML = "Navigation";
        let td3 = document.createElement("td");
        td3.innerHTML = "0bytes";
        let td4 = document.createElement("td");

        td1.appendChild(a);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        entriesTable.appendChild(tr);
    }

    for (const x in entries) {
        let entry = entries[x];
        if (entry.type === "dir") {
            let tr = document.createElement("tr");

            let td1 = document.createElement("td");
            let a = document.createElement("a");
            a.innerHTML = entry.name;
            a.addEventListener("click", function () {
                changePath(this.innerHTML);
                loadFileEntries();
            });

            let td2 = document.createElement("td");
            td2.innerHTML = "Folder";
            let td3 = document.createElement("td");
            td3.innerHTML = "0bytes";
            let td4 = document.createElement("td");
            let btn1 = document.createElement("button");
            btn1.classList.add("btn", "btn-primary", "btn-sm");
            btn1.type = "button";
            btn1.innerHTML = "Delete &nbsp;<i class=\"far fa-trash-alt\"></i>&nbsp;";

            td1.appendChild(a);
            td4.appendChild(btn1);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            entriesTable.appendChild(tr);
        } else if (entry.type === "file") {
            let tr = document.createElement("tr");

            let td1 = document.createElement("td");
            td1.innerHTML = entry.name;

            let td2 = document.createElement("td");
            td2.innerHTML = entry.mime;
            let td3 = document.createElement("td");
            td3.innerHTML = entry.size + "bytes";
            let td4 = document.createElement("td");
            let btn1 = document.createElement("button");
            btn1.classList.add("btn", "btn-primary", "btn-sm");
            btn1.type = "button";
            btn1.innerHTML = "Delete &nbsp;<i class=\"far fa-trash-alt\"></i>&nbsp;";
            let btn2 = document.createElement("button");
            btn2.classList.add("btn", "btn-primary", "btn-sm");
            btn2.type = "button";
            btn2.style.marginLeft = "1rem";
            btn2.innerHTML = "Export &nbsp;<i class=\"fas fa-download\"></i>&nbsp;"

            td4.appendChild(btn1);
            td4.appendChild(btn2);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            entriesTable.appendChild(tr);

        }
    }

    loadPath(path);
}

function loadPath(path) {
    document.getElementById("currentPath").innerHTML = "Archive:" + path;
}

window.addEventListener("load", () => {
    loadFileEntries();

});
