// Generated by typings
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/c17b1b78b886e84afe27e1b65fe5bf901da5bbe7/debug/index.d.ts
declare module 'debug' {
// Type definitions for debug
// Project: https://github.com/visionmedia/debug
// Definitions by: Seon-Wook Park <https://github.com/swook>, Gal Talmor <https://github.com/galtalmor>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

var debug: debug.IDebug;

export = debug;

namespace debug {
    export interface IDebug {
        (namespace: string): debug.IDebugger;
        coerce: (val: any) => any;
        disable: () => void;
        enable: (namespaces: string) => void;
        enabled: (namespaces: string) => boolean;

        names: string[];
        skips: string[];

        formatters: IFormatters;
        colors: Array<number>;
    }

    export interface IFormatters {
        [formatter: string]: Function;
    }

    export interface IDebugger {
        (formatter: any, ...args: any[]): void;

        enabled: boolean;
        log: Function;
        namespace: string;
    }
}
}
