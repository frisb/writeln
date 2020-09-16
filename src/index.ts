import debug, { IDebugger } from 'debug';

interface ILog extends IDebugger {
	extend(namespace: string): IDebugger;
}

debug.enable('*:info,*:warn,*:error,*:debug');

const isNode = new Function('try {return this===global;}catch(e){return false;}');

export class Logger {
	public static isDebug = isNode() && process.env.NODE_ENV !== 'production';

	private readonly _infoLogger: IDebugger;
	private readonly _debugLogger: IDebugger;
	private readonly _warnLogger: IDebugger;
	private readonly _errorLogger: IDebugger;

	constructor(name: string) {
		name = name.replace(/\s+/g, '-').toLowerCase();
		const log = debug(name) as ILog;

		this._infoLogger = log.extend('info');
		this._warnLogger = log.extend('warn');
		this._errorLogger = log.extend('error');
		this._debugLogger = log.extend('debug');
	}

	public info(formatter: any, ...args: Array<any>) {
		this._infoLogger(formatter, ...args);
	}

	public warn(formatter: any, ...args: Array<any>) {
		this._warnLogger(formatter, ...args);
	}

	public error(formatter: any, ...args: Array<any>) {
		this._errorLogger(formatter, ...args);
	}

	public debug(formatter: any, ...args: Array<any>) {
		if (Logger.isDebug) this._debugLogger(formatter, ...args);
	}
}
