"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var util_1 = require("util");
var debug = require("debug");
var lastCategory;
function pad(num, len, char) {
    if (typeof (num) !== 'string')
        num = "" + num;
    if (!len)
        len = 2;
    if (num.length >= len)
        return num;
    var padding = '';
    len = len - num.length;
    for (var i = 0; i < len; i++) {
        padding += char || '0';
    }
    return "" + padding + num;
}
function dateStr(date, delimiter) {
    if (delimiter === void 0) { delimiter = '.'; }
    return date.getFullYear() + delimiter + pad(date.getMonth() + 1) + delimiter + pad(date.getDate());
}
function timeStr(date, delimiter) {
    if (delimiter === void 0) { delimiter = ':'; }
    var millisec = date.getMilliseconds();
    if (millisec < 100)
        millisec = '0' + pad(millisec);
    return pad(date.getHours()) + delimiter + pad(date.getMinutes()) + delimiter + pad(date.getSeconds()) + delimiter + millisec;
}
var Writeln = (function () {
    function Writeln(category) {
        this.category = category;
        this.category = category.replace(/ /g, '-').toLowerCase();
        this.log = debug(this.category);
    }
    Writeln.prototype.info = function (text, metadata) {
        this.write('info', text, metadata);
    };
    Writeln.prototype.warn = function (text, metadata) {
        this.write('warn', text, metadata);
    };
    Writeln.prototype.debug = function (text, metadata) {
        this.write('debug', text, metadata);
    };
    Writeln.prototype.error = function (text, metadata) {
        this.write('error', text, metadata);
    };
    Writeln.prototype.write = function (level, text, metadata) {
        var now = new Date();
        var date = dateStr(now, '-');
        var time = timeStr(now);
        var timestamp = date + " " + time;
        var mtext = '';
        if (metadata) {
            if (typeof (metadata) !== 'string') {
                mtext = util_1.inspect(metadata, { showHidden: true, depth: null, colors: true });
            }
            else {
                mtext = metadata;
            }
            mtext = "\n" + mtext + "\n";
            mtext = "\n" + chalk_1.dim(mtext.replace(/\n/g, '\n  ')) + "\n";
        }
        if (this.log.enabled && lastCategory && lastCategory !== this.category)
            console.log();
        this.log("" + text, chalk_1.dim(timestamp), mtext);
        lastCategory = this.category;
    };
    return Writeln;
}());
Writeln.Writeln = Writeln;
exports.Writeln = Writeln;
