export namespace Interfaces {
    interface IArchive {
        status: "decoded" | "encoded";
    }

    export interface IStat {
        archive: IArchive;
    }
}
