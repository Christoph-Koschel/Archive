import {join} from "path";
import {ZipLib} from "../zip/zip";

import Zip = ZipLib.Zip;


namespace Program {

    let zip = Zip.open();

    zip.Pack(join(__dirname, "..", "..", "..", "test", "zip"),join(__dirname, "..", "..", "..", "test"), "test");
}


