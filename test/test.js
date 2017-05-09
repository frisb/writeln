'use strict';
var Writeln = require('../index');

var writeln = new Writeln('Unit-Tests');

describe('Writeln', function () {
	it('should log as info', function (done) {
		writeln.info('This is an info message');
		done();
	});

	it('should log as debug', function (done) {
		writeln.debug('This is a debug message');
		done();
	});

	it('should log as warn', function (done) {
		writeln.warn('This is a warning message');
		done();
	});

	it('should log as error', function (done) {
		writeln.error('This is an error message');
		done();
	});
});