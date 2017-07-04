import {dim} from 'chalk';
import {inspect} from 'util';
import * as debug from 'debug';

// const color = {
// 	black :   0,
// 	red :     1,
// 	green :   2,
// 	yellow :  3,
// 	blue :    4,
// 	magenta : 5,
// 	cyan :    6,
// 	white :   7
// };

// debug.colors.forEach(function (num: number, index: number) {
// 	// remove red
// 	if (num === color.red)
// 		debug.colors.splice(index, 1);
// });

let lastCategory: string;

// debug.enable('*');

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

export class Writeln {
	public static Writeln = Writeln;

	private log: debug.IDebugger;

	constructor(private category: string) {
		this.category = category.replace(/ /g, '-').toLowerCase();

		this.log = debug(this.category);
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

		if (metadata) {
			if (typeof(metadata) !== 'string') {
				mtext = inspect(metadata, { showHidden: true, depth: null, colors: true });
			}
			else {
				mtext = metadata;
			}

			mtext = `\n${mtext}\n`;

			mtext = `\n${dim(mtext.replace(/\n/g, '\n  '))}\n`;
		}

		if (this.log.enabled && lastCategory && lastCategory !== this.category)
        console.log();

		this.log(`${text}`, dim(timestamp), mtext);

		lastCategory = this.category;
	}
}
