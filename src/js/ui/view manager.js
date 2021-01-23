window.addEventListener("load", () => {
    window.addEventListener("keyup",(e) => {
        if (e.keyCode === 27) {
            document.getElementById("navLink1").style.display = "none";
            document.getElementById("navLink2").style.display = "";
            clearView({
                mainView: true
            });
        }
    });

    document.getElementById("navLink1").addEventListener("click", () => {
        document.getElementById("navLink1").style.display = "none";
        document.getElementById("navLink2").style.display = "";
        clearView({
            mainView: true
        });
    });

    document.getElementById("navLink2").addEventListener("click", () => {
        document.getElementById("navLink1").style.display = "";
        document.getElementById("navLink2").style.display = "none";
        clearView({
            settingsView: true
        });
    });

    document.getElementById("toolLink1").addEventListener("click", () => {
        document.getElementById("navLink1").style.display = "";
        document.getElementById("navLink2").style.display = "none";
        clearView({
           fileView: true
        });
    });

    document.getElementById("toolLink2").addEventListener("click", () => {
        document.getElementById("navLink1").style.display = "";
        document.getElementById("navLink2").style.display = "none";
        clearView({
            folderView: true
        });
    });

    document.getElementById("navLink1").style.display = "none";
    clearView({
        mainView: true
    });
});

function clearView({
                       mainView = false,
                       fileView = false,
                       folderView = false,
                       settingsView = false
                   }) {
    let main = document.getElementById("mainView");
    let file = document.getElementById("addFileView");
    let folder = document.getElementById("addFolderView");
    let settings = document.getElementById("settingsView");

    main.style.display = "none";
    file.style.display = "none";
    folder.style.display = "none";
    settings.style.display = "none";

    if (mainView) {
        main.style.display = "";
    }
    if (fileView) {
        file.style.display = "";
    }
    if (folderView) {
        folder.style.display = "";
    }
    if (settingsView) {
        settings.style.display = "";
    }
}
