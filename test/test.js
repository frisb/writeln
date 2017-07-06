'use strict';
const Writeln = require('../index');

Writeln.enable('*');

const logger = new Writeln('Unit-Tests');

describe('Writeln', function () {
	it('should log as info', function (done) {
		logger.info('This is an info message');
		done();
	});

	it('should log as debug', function (done) {
		logger.debug('This is a debug message');
		done();
	});

	it('should log as warn', function (done) {
		logger.warn('This is a warning message');
		done();
	});

	it('should log as error', function (done) {
		logger.error('This is an error message');
		done();
	});
});