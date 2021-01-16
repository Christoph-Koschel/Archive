"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var zip_1 = require("../zip/zip");
var Zip = zip_1.ZipLib.Zip;
var Program;
(function (Program) {
    var zip = Zip.open();
    zip.Pack(path_1.join(__dirname, "..", "..", "..", "test", "zip"), path_1.join(__dirname, "..", "..", "..", "test"), "test");
})(Program || (Program = {}));
//# sourceMappingURL=index.js.map