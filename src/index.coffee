surreal = require('surreal')
winston = require('winston')

pad = (num, len) ->
	num = '' + num
	len = 2 if !len

	return num if num.length >= len

	padding = ''
	padding += '0' for i in [0...len - num.length]
	padding + num

dateStr = (date, delimiter) ->
	delimiter = '.' if !delimiter
	date.getFullYear() + delimiter + pad(date.getMonth() + 1) + delimiter + pad(date.getDate())

timeStr = (date, delimiter) ->
	delimiter = ':' if !delimiter

	millisec = date.getMilliseconds()
	millisec = '0' + pad(millisec) if millisec < 100

	pad(date.getHours()) + delimiter + pad(date.getMinutes()) + delimiter + pad(date.getSeconds()) + delimiter + millisec

maxCategoryLength = 0

custom =
	levels:
		':) ': 0
		' v ': 1
		' * ': 2
		' # ': 3
		' ! ': 4
		' ? ': 5
		' x ': 6

	colors:
		':) ': 'blue'
		' v ': 'cyan'
		' * ': 'green'
		' # ': 'grey'
		' ! ': 'magenta'
		' ? ': 'yellow'
		' x ': 'red'

transportOptions =
	level: ' * '
	colorize: true
	handleExceptions: true
	timestamp: false

options =
	levels: custom.levels
	colors: custom.colors
	transports: [ new winston.transports.Console(transportOptions) ]

logger = new (winston.Logger)(options)
logger.exitOnError = false

hr = (len, end) ->
	str = '\n' + (if end then '' else '     ')
	len = 75 if len > 75
	str += '-' for i in [0..len + (if end then 5 else 0)]
	"#{str}\n"

module.exports = class Writeln
	constructor: (@category) ->
    @history = []

	silly: (text, metadata) -> @write(':) ', text, metadata)
	verbose: (text, metadata) -> @write(' v ', text, metadata)
	info: (text, metadata) -> @write(' * ', text, metadata)
	data: (text, metadata) -> @write(' ~ ', text, metadata)
	warn: (text, metadata) -> @write(' ! ', text, metadata)
	debug: (text, metadata) -> @write(' ? ', text, metadata)
	error: (text, metadata) -> @write(' x ', text, metadata)

	write: (level, text, metadata) ->
		now = new Date()
		date = dateStr(now, '-')
		time = timeStr(now)

		text = "#{date} | #{time} | #{@formatCategory()} | #{text}"

		if (metadata)
			if (typeof(metadata) isnt 'string')
				mtext = surreal.serialize(metadata)
			else
				mtext = metadata
				mtext = '     ' + mtext.replace(/\n/g, '\n     ')

			text = text + hr(text.length) + mtext + hr(text.length, true)

		logger[level](text)
		@history.push(text)

	repeatHistory: ->
		str = ''
		str += @history[i] for i in [0..@history.length]
		str

	formatCategory: ->
		str = @category.toUpperCase()

		if (str.length >= maxCategoryLength)
			maxCategoryLength = str.length
		else
			str += ' ' for i in [0...maxCategoryLength - str.length]

		str
