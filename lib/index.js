(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['module', 'chalk', 'debug', 'util'], factory);
	} else if (typeof exports !== "undefined") {
		factory(module, require('chalk'), require('debug'), require('util'));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod, global.chalk, global.debug, global.util);
		global.index = mod.exports;
	}
})(this, function (module, chalk, debug, util) {
	'use strict';

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	var color = {
		black: 0,
		red: 1,
		green: 2,
		yellow: 3,
		blue: 4,
		magenta: 5,
		cyan: 6,
		white: 7
	};

	debug.colors.forEach(function (num, index) {
		// remove red
		if (num === color.red) debug.colors.splice(index, 1);
	});

	debug.enable('error warn info debug');

	function pad(num, len, char) {
		if (typeof num !== 'string') num = `${ num }`;
		if (!len) len = 2;
		if (num.length >= len) return num;

		var padding = '';

		len = len - num.length;
		for (var i = 0; i < len; i++) {
			padding += char || '0';
		}

		return `${ padding }${ num }`;
	}

	function dateStr(date, delimiter) {
		if (!delimiter) delimiter = '.';

		return date.getFullYear() + delimiter + pad(date.getMonth() + 1) + delimiter + pad(date.getDate());
	}

	function timeStr(date, delimiter) {
		if (!delimiter) delimiter = ':';

		var millisec = date.getMilliseconds();

		if (millisec < 100) millisec = '0' + pad(millisec);

		return pad(date.getHours()) + delimiter + pad(date.getMinutes()) + delimiter + pad(date.getSeconds()) + delimiter + millisec;
	}

	//function colorize(color, text) {
	//	return `\u001b[3${color};1m${text}\u001b[0m`;
	//}

	function getColor(level) {
		switch (level) {
			// case 'info':
			// 	return color.cyan;
			// case 'debug':
			// 	return color.green;
			// case 'warn':
			// 	return color.yellow;
			case 'error':
				return color.red;
			default:
				break;
		}
	}

	// let maxCategoryLength = 0;

	var log = {
		debug: debug('debug'),
		info: debug('info'),
		warn: debug('warn'),
		error: debug('error')
	};

	var Writeln = function () {
		function Writeln(category) {
			_classCallCheck(this, Writeln);

			this.category = category;
			this.history = [];
			this.category = this.formatCategory();
		}

		_createClass(Writeln, [{
			key: 'info',
			value: function info(text, metadata) {
				this.write('info', text, metadata);
			}
		}, {
			key: 'warn',
			value: function warn(text, metadata) {
				this.write('warn', text, metadata);
			}
		}, {
			key: 'debug',
			value: function debug(text, metadata) {
				this.write('debug', text, metadata);
			}
		}, {
			key: 'error',
			value: function error(text, metadata) {
				this.write('error', text, metadata);
			}
		}, {
			key: 'write',
			value: function write(level, text, metadata) {
				var now = new Date();
				var date = dateStr(now, '-');
				var time = timeStr(now);
				var timestamp = `${ date } ${ time }`;
				var mtext = '';

				var color = getColor(level);

				if (color) log.color = color;

				if (metadata) {
					if (typeof metadata !== 'string') {
						mtext = '\n' + chalk.dim(util.inspect(metadata, { showHidden: true, depth: null, colors: true })) + '\n';
					} else {
						mtext = `${ metadata }`;
					}

					mtext = mtext.replace(/\n/g, '\n  ');
				}

				log[level](`${ chalk.dim(this.category) } ${ text }`, chalk.dim(timestamp), mtext);

				this.history.push(text);
			}
		}, {
			key: 'repeatHistory',
			value: function repeatHistory() {
				var str = '';

				for (var i = 0, len = this.history.length; i < len; i++) {
					str += this.history[i];
				}

				return str;
			}
		}, {
			key: 'formatCategory',
			value: function formatCategory() {
				var str = this.category.replace(/ /g, '-').toLowerCase();
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
		}]);

		return Writeln;
	}();

	module.exports = Writeln;
});
//# sourceMappingURL=index.js.map
