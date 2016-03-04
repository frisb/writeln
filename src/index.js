let chalk = require('chalk');
let debug = require('debug');
let util = require('util');

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

debug.colors.forEach(function (num, index) {
	// remove red
	if (num === color.red)
		debug.colors.splice(index, 1);
});

debug.enable('*:info,*:debug,*:error,*:warn');

function pad(num, len, char) {
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

function dateStr(date, delimiter) {
	if (!delimiter)
		delimiter = '.';

	return date.getFullYear() + delimiter + pad(date.getMonth() + 1) + delimiter + pad(date.getDate());
}

function timeStr(date, delimiter) {
	if (!delimiter)
		delimiter = ':';

	let millisec = date.getMilliseconds();

	if (millisec < 100)
		millisec = '0' + pad(millisec);

	return pad(date.getHours()) + delimiter + pad(date.getMinutes()) + delimiter + pad(date.getSeconds()) + delimiter + millisec;
}

function colorize(color, text) {
	return `\u001b[3${color};1m${text}\u001b[0m`;
}


let maxCategoryLength = 0;

class Writeln {
	constructor(category) {
		this.category = category;
		this.history = [];
	}

	info(text, metadata) {
		this.write('info', text, metadata);
	}

	warn(text, metadata) {
		this.write('warn', text, metadata);
	}

	debug(text, metadata) {
		this.write('debug', text, metadata);
	}

	error(text, metadata) {
		this.write('error', text, metadata);
	}

	write(level, text, metadata) {
		let now = new Date();
		let date = dateStr(now, '-');
		let time = timeStr(now);
		let timestamp = `${date} ${time}`;
		let mtext = '';

		let log = debug(`${this.formatCategory(level)}`);

		if (level === 'error')
			log.color = 1;

		if (metadata) {
			if (typeof(metadata) !== 'string') {
				mtext = '\n' + util.inspect(metadata, { showHidden: true, depth: null, colors: true });
				mtext = mtext.replace(/\n/g, '\n  ');
			}
			else {
				mtext = metadata;
				mtext = '     ' + mtext.replace(/\n/g, '\n     ');
			}
		}

		log(text, chalk.dim(timestamp), chalk.dim(mtext));

		this.history.push(text);
	}

	repeatHistory() {
		let str = '';

		for (let i = 0, len = this.history.length; i < len; i++) {
			str += this.history[i];
		}

		return str;
	}

	formatCategory(level) {
		let str = this.category.replace(/ /g, '-').toLowerCase() + ':' + level;
		let len = 2 + str.length;

		if (len >= maxCategoryLength) {
			maxCategoryLength = len;
		}
		else {
			str += pad('', maxCategoryLength - len, ' ');
		}

		return str;
	}
}

module.exports = Writeln;