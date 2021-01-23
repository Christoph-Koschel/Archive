import {BrowserWindowConstructorOptions} from "electron";

export namespace Interfaces {
    interface IArchive {
        status: "decoded" | "encoded";
    }

    export interface IStat {
        archive: IArchive;
    }

    export interface IUiEngineConstructor {
        electron: BrowserWindowConstructorOptions;
        uiEngine?: IUiEngine;
    }

    interface IUiEngine {
        dev?: boolean;
        menu?: boolean;
    }
}
