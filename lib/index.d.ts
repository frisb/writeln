export declare class Logger {
    static isDebug: boolean;
    private readonly _infoLogger;
    private readonly _debugLogger;
    private readonly _warnLogger;
    private readonly _errorLogger;
    constructor(name: string);
    info(formatter: any, ...args: Array<any>): void;
    warn(formatter: any, ...args: Array<any>): void;
    error(formatter: any, ...args: Array<any>): void;
    debug(formatter: any, ...args: Array<any>): void;
}
