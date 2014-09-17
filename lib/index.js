(function() {
  var Writeln, custom, dateStr, hr, logger, maxCategoryLength, options, pad, surreal, timeStr, transportOptions, winston;

  surreal = require('surreal');

  winston = require('winston');

  pad = function(num, len) {
    var i, padding, _i, _ref;
    num = '' + num;
    if (!len) {
      len = 2;
    }
    if (num.length >= len) {
      return num;
    }
    padding = '';
    for (i = _i = 0, _ref = len - num.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      padding += '0';
    }
    return padding + num;
  };

  dateStr = function(date, delimiter) {
    if (!delimiter) {
      delimiter = '.';
    }
    return date.getFullYear() + delimiter + pad(date.getMonth() + 1) + delimiter + pad(date.getDate());
  };

  timeStr = function(date, delimiter) {
    var millisec;
    if (!delimiter) {
      delimiter = ':';
    }
    millisec = date.getMilliseconds();
    if (millisec < 100) {
      millisec = '0' + pad(millisec);
    }
    return pad(date.getHours()) + delimiter + pad(date.getMinutes()) + delimiter + pad(date.getSeconds()) + delimiter + millisec;
  };

  maxCategoryLength = 0;

  custom = {
    levels: {
      ':) ': 0,
      ' v ': 1,
      ' * ': 2,
      ' # ': 3,
      ' ! ': 4,
      ' ? ': 5,
      ' x ': 6
    },
    colors: {
      ':) ': 'blue',
      ' v ': 'cyan',
      ' * ': 'green',
      ' # ': 'grey',
      ' ! ': 'magenta',
      ' ? ': 'yellow',
      ' x ': 'red'
    }
  };

  transportOptions = {
    level: ' * ',
    colorize: true,
    handleExceptions: true,
    timestamp: false
  };

  options = {
    levels: custom.levels,
    colors: custom.colors,
    transports: [new winston.transports.Console(transportOptions)]
  };

  logger = new winston.Logger(options);

  logger.exitOnError = false;

  hr = function(len, end) {
    var i, str, _i, _ref;
    str = '\n' + (end ? '' : '     ');
    if (len > 75) {
      len = 75;
    }
    for (i = _i = 0, _ref = len + (end ? 5 : 0); 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      str += '-';
    }
    return "" + str + "\n";
  };

  module.exports = Writeln = (function() {
    function Writeln(category) {
      this.category = category;
      this.history = [];
    }

    Writeln.prototype.silly = function(text, metadata) {
      return this.write(':) ', text, metadata);
    };

    Writeln.prototype.verbose = function(text, metadata) {
      return this.write(' v ', text, metadata);
    };

    Writeln.prototype.info = function(text, metadata) {
      return this.write(' * ', text, metadata);
    };

    Writeln.prototype.data = function(text, metadata) {
      return this.write(' ~ ', text, metadata);
    };

    Writeln.prototype.warn = function(text, metadata) {
      return this.write(' ! ', text, metadata);
    };

    Writeln.prototype.debug = function(text, metadata) {
      return this.write(' ? ', text, metadata);
    };

    Writeln.prototype.error = function(text, metadata) {
      return this.write(' x ', text, metadata);
    };

    Writeln.prototype.write = function(level, text, metadata) {
      var date, mtext, now, time;
      now = new Date();
      date = dateStr(now, '-');
      time = timeStr(now);
      text = "" + date + " | " + time + " | " + (this.formatCategory()) + " | " + text;
      if (metadata) {
        if (typeof metadata !== 'string') {
          mtext = JSON.stringify(metadata);
        } else {
          mtext = metadata;
          mtext = '     ' + mtext.replace(/\n/g, '\n     ');
        }
        text = text + hr(text.length) + mtext + hr(text.length, true);
      }
      logger[level](text);
      return this.history.push(text);
    };

    Writeln.prototype.repeatHistory = function() {
      var i, str, _i, _ref;
      str = '';
      for (i = _i = 0, _ref = this.history.length; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        str += this.history[i];
      }
      return str;
    };

    Writeln.prototype.formatCategory = function() {
      var i, str, _i, _ref;
      str = this.category.toUpperCase();
      if (str.length >= maxCategoryLength) {
        maxCategoryLength = str.length;
      } else {
        for (i = _i = 0, _ref = maxCategoryLength - str.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          str += ' ';
        }
      }
      return str;
    };

    return Writeln;

  })();

}).call(this);
