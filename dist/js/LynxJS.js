/* Lynx Application File
 * Main entry point
 *
 * Created by Cosrnos
 */

(function() {
	var logger = {};

	window.Lynx = {
		debug: false,
		log: function() {
			Lynx.Logger.log.call(this, Array.prototype.slice.call(arguments));
		}
	};

	function startLynx() {
		logger = Lynx.Logger;

		logger.info('Starting Lynx Library....');
		Lynx.Heart.start();

		var tsk = new Lynx.Task();

		tsk.before = function() {
			logger.debug('Intializing Event Emitter...');
			Lynx.EventEmitter.apply(this);

			logger.debug('Testing Event Emitter...')

			if (!testEvents()) {
				return logger.warn('Lynx Event Emitter is not working properly. Aborting.');
			}

			logger.debug('Tests passed!');

			return true;
		}.bind(this);

		Lynx.Heart.queueTask(tsk);
	}

	function testEvents() {
		var sampleListener = new Lynx.EventListener();

		var sample = 0;

		sampleListener.on('__sample', function(data) {
			sample = data.testValue;
		});

		Lynx.addListener(sampleListener);

		Lynx.emit('__sample', {
			testValue: 1
		});
		// TODO: Promises would be lovely to test here...

		if (sample === 1) {
			return true;
		}

		return false;
	}

	window.addEventListener('load', function() {
		startLynx.apply(Lynx);
	});
})();
(function() {
	Lynx.EventEmitter = function() {
		var _listeners = [];

		this.addListener = function(listener) {
			_listeners.push(listener);
		},

		this.removeListener = function(listener) {
			var index = _listeners.indexOf(listener);
			if (index && index !== -1) {
				_listeners.splice(index, 1);
				return true;
			}

			return false;
		},

		this.emit = function(event, data) {
			var event = event || '';
			var data = data || {};

			_.each(_listeners, function callListeners(listener) {
				listener.notify(event, data);
			});
		}
	}
})();
(function() {
	var _logger = Lynx.Logger;

	Lynx.EventListener = function() {
		var _events = {};

		this.addListener = function(name, callback) {
			if (!_events[name]) {
				_events[name] = [];
			}

			_events[name].push(callback);
		},

		this.on = function(name, callback) {
			this.addListener(name, callback);
		},

		this.removeListener = function(name, callback) {
			if (!_events[name]) {
				return false;
			}

			var index = _events[name].indexOf(callback);

			if (!index || index === -1) {
				return false;
			}

			_events[name].splice(index, 1);

			if (_events[name].length === 0) {
				delete _events[name];
			}

			return true;
		},

		this.notify = function(event, data) {
			var event = event || '';
			var data = data || {};

			_.each(_events[event], function executeCallbacks(evt) {
				evt(data);
			});
		}
	}
})();
(function() {
	var _tasks = [];
	var _interval = null;
	var _logger = null;
	var _queue = [];

	function _init() {
		if (_logger) {
			return;
		}

		_logger = Lynx.Logger;
	}

	function _work() {
		var toRemove = [];
		// Pull from the queue
		_tasks = _tasks.concat(_queue);
		_queue = [];

		_.each(_tasks, function(task, index) {
			task.resolved = task.before() || false;
			if (task.event) {
				Lynx.emit(task, task.data);
				task.resolved = true;
			}
			task.resolved = task.after() || task.resolved;

			if (task.resolved) {
				toRemove.push(index);
			}
		});

		_.each(toRemove, function(id) {
			_tasks.splice(id, 1);
		});
	}

	function _onInterval() {
		_work();
		return true;
	}

	Lynx.Heart = {
		start: function() {
			_init();

			if (_interval) {
				_logger.warn('Cannot start Lynx.Heart as it is already running.');
				return;
			}

			_logger.debug('Starting Lynx.Heart...')

			_interval = window.setInterval(function() {
				_onInterval();
			}, 1);

			return true;
		},

		stop: function() {
			if (!_interval) {
				return;
			}

			_logger.debug('Stopping Lynx.Heart...');

			window.clearInterval(_interval);

			return true;
		},

		/*
		 * Emits an object as soon as it can without holding up the renderer
		 */
		emit: function(event, data) {
			var tsk = new Lynx.Task();
			tsk.event = event;
			tsk.data = data;
			Lynx.Heart.queueTask(tsk);
		},

		queueTask: function(task) {
			return (_queue.push(task) - 1);
		},

		removeTaskFromQueue: function(id) {
			if (id >= _queue.length) {
				return false;
			}

			return (_queue.splice(id, 1) - 1);
		}
	};
})();
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
(function() {
	Lynx.Task = function() {
		this.before = function() {};
		this.after = function() {};
		this.resolved = false;
		this.event = null;
		this.data = {};
		this.params = [];
	}
})();