/* Lynx Logger
 * A Simple library for logging
 *
 * Created by Cosrnos
 */

(function() {
	var _defaultLog = console.log.bind(console);
	var logTypeArray = [];

	var LogType = function() {
		var name = 'internal';
		var prefixText = '';
		this.background = -1;
		this.color = -1;
		this.level = 0;
		this.prefix = {
			color: -1,
			background: -1
		};

		Object.defineProperty(this, 'name', {
			get: function() {
				return name;
			},

			set: function(value) {
				name = value;
				prefixText = (prefixText === '' ? value : prefixText);
			}
		});

		Object.defineProperty(this.prefix, 'text', {
			get: function() {
				return (prefixText === '' ? name : prefixText);
			},

			set: function(value) {
				prefixText = value;
			}
		});

		this.handler = function() {};
	};

	Lynx.Logger = {
		threshold: 0,
		_log: function() {
			var args = Array.prototype.slice.call(arguments);

			if (args && args[0]) {
				if (args[0] instanceof LogType) {
					return this._processLogType.apply(this, args);
				}

				_defaultLog.apply(this, args);
			} else {
				this.warn('Cannot call log with empty parameters');
			}

			return Lynx.Logger;
		},

		_processLogType: function() {
			var args = Array.prototype.slice.call(arguments);

			if (args && args[0]) {
				if (args[0].name) {
					var type = args.shift();

					var buffer = args;

					// _.each(args, function bootstrapArguments(argument) {
					// 	if (typeof argument === 'string') {
					// 		var cssString = "";
					// 		cssString += (type.background !== -1 ? 'background: ' + type.background + '; ' : '');
					// 		cssString += (type.color !== -1 ? 'color: ' + type.color + '; ' : '');
					// 		if (cssString !== '') {
					// 			buffer.push('%c' + argument, cssString);
					// 		} else {
					// 			buffer.push(argument);
					// 		}
					// 	} else {
					// 		buffer.push(argument);
					// 	}
					// });

					var prefixCss = '';
					prefixCss += (type.prefix.background !== -1 ? 'background: ' + type.prefix.background + '; ' : '');
					prefixCss += (type.prefix.color !== -1 ? 'color: ' + type.prefix.color + '; ' : '');

					if (prefixCss !== '') {
						buffer.unshift('%c[' + type.prefix.text + ']', prefixCss);
					} else {
						buffer.unshift('[' + type.prefix.text + ']');
					}

					_defaultLog.apply(this, buffer);
				} else {
					this.warn('Cannot call _processLogType with non Lynx.LogType first parameter.');
				}
			} else {
				this.warn('Cannot call _processLogType with empty parameters');
			}

			return Lynx.Logger;
		},

		createLogType: function(options) {
			var lt = new LogType();

			// There has to be a better way of doing this...
			lt = _.extend(lt, options);
			lt = _.defaults(lt, options);

			if (!logTypeArray[lt.name]) {
				logTypeArray[lt.name] = lt;
			} else {
				this.warn('A log type that has already been defined cannot be overwritten. Tried overwriting ' + lt.name);
			}

			if (lt.hasOwnProperty('_cmd')) {
				if (typeof lt._cmd === 'string') {
					lt._cmd = [lt._cmd];
				}

				// Add the command(s) to the Logger object
				_.each(lt._cmd, function bindCommands(command) {
					Lynx.Logger[command] = function customLogCommand() {
						var args = Array.prototype.slice.call(arguments);
						args.unshift(Object.create(lt));
						this._log.apply(this, args);
					};
				});

				delete lt._cmd;
			}

			logTypeArray.push(lt);

			return Lynx.Logger;
		}
	};

	Object.defineProperty(Lynx.Logger, 'LogType', {
		get: function() {
			return logTypeArray;
		},

		set: function() {
			Lynx.Logger.warn("You cannot overwrite the value of the LogType global.");
		}
	});

	// Initialize the logger with basic types
	Lynx.Logger.createLogType({
		name: 'debug',
		level: 2,
		_cmd: ['debug'],
		prefix: {
			text: 'DEBUG',
			color: '#00ffff',
			background: '#000000'
		}
	});

	Lynx.Logger.createLogType({
		name: 'info',
		level: 2,
		_cmd: ['info', 'log'],
		prefix: {
			text: 'INFO'
		}
	});

	Lynx.Logger.createLogType({
		name: 'warning',
		level: 3,
		_cmd: ['warn'],
		prefix: {
			text: 'WARNING',
			color: "#FF8800"
		}
	});
})();