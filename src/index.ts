import {dim} from 'chalk';
import {inspect} from 'util';
import * as debug from 'debug';

const color = {
	black :   0,
	red :     1,
	green :   2,
	yellow :  3,
	blue :    4,
	magenta : 5,
	cyan :    6,
	white :   7
};

debug.colors.forEach(function (num: number, index: number) {
	// remove red
	if (num === color.red)
		debug.colors.splice(index, 1);
});

debug.enable('error warn info debug');

function pad(num: number | string, len?: number, char?: string): string {
	if (typeof(num) !== 'string') num = `${num}`;
	if (!len) len = 2;
	if (num.length >= len)
		return num;

	let padding = '';

	len = len - num.length;
	for (let i = 0; i < len; i++) {
		padding += char || '0';
	}

	return `${padding}${num}`;
}

function dateStr(date: Date, delimiter: string = '.'): string {
	return date.getFullYear() + delimiter + pad(date.getMonth() + 1) + delimiter + pad(date.getDate());
}

function timeStr(date: Date, delimiter: string = ':'): string {
	let millisec: number | string = date.getMilliseconds();

	if (millisec < 100)
		millisec = '0' + pad(millisec);

	return pad(date.getHours()) + delimiter + pad(date.getMinutes()) + delimiter + pad(date.getSeconds()) + delimiter + millisec;
}

//function colorize(color, text) {
//	return `\u001b[3${color};1m${text}\u001b[0m`;
//}

// function getColor(level: string): number {
// 	switch (level) {
// 		// case 'info':
// 		// 	return color.cyan;
// 		// case 'debug':
// 		// 	return color.green;
// 		// case 'warn':
// 		// 	return color.yellow;
// 		case 'error':
// 			return color.red;
// 		default:
// 			break;
// 	}
// }

// let maxCategoryLength = 0;

interface ILogWriter {
	[level: string]: (categoryAndText: string, timestamp: string, mtext: string) => void;

}

let log: ILogWriter = {
	debug: debug('debug'),
	info: debug('info'),
	warn: debug('warn'),
	error: debug('error')
};

export class Writeln {
	public static Writeln = Writeln;

	constructor(private category: string) {
		// this.history = [];
		this.category = this.formatCategory();
	}

	public info(text: string, metadata?: any) {
		this.write('info', text, metadata);
	}

	public warn(text: string, metadata?: any) {
		this.write('warn', text, metadata);
	}

	public debug(text: string, metadata?: any) {
		this.write('debug', text, metadata);
	}

	public error(text: string, metadata?: any) {
		this.write('error', text, metadata);
	}

	protected write(level: string, text: string, metadata: any) {
		let now = new Date();
		let date = dateStr(now, '-');
		let time = timeStr(now);
		let timestamp = `${date} ${time}`;
		let mtext = '';

		// let color = getColor(level);

		// if (color)
		// 	log.color = color;

		if (metadata) {
			if (typeof(metadata) !== 'string') {
				mtext = '\n' + dim(inspect(metadata, { showHidden: true, depth: null, colors: true })) + '\n';

			}
			else {
				mtext = `${metadata}`;
			}

			mtext = mtext.replace(/\n/g, '\n  ');
		}

		log[level](`${dim(this.category)} ${text}`, dim(timestamp), mtext);

		// this.history.push(text);
	}

	// repeatHistory() {
	// 	let str = '';
	//
	// 	for (let i = 0, len = this.history.length; i < len; i++) {
	// 		str += this.history[i];
	// 	}
	//
	// 	return str;
	// }

	private formatCategory(): string {
		let str = this.category.replace(/ /g, '-').toLowerCase();
		// let len = 2 + str.length;
		//
		// if (len >= maxCategoryLength) {
		// 	maxCategoryLength = len;
		// }
		// else {
		// 	str += pad('', maxCategoryLength - len, ' ');
		// }

		return str;
	}
}