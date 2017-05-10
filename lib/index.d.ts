export declare class Writeln {
    private category;
    static Writeln: typeof Writeln;
    private log;
    constructor(category: string);
    info(text: string, metadata?: any): void;
    warn(text: string, metadata?: any): void;
    debug(text: string, metadata?: any): void;
    error(text: string, metadata?: any): void;
    protected write(level: string, text: string, metadata: any): void;
}
