import { Logger } from '../';

const logger = new Logger('Unit-Tests');

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