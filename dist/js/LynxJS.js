/* Lynx Application File
 * Main entry point
 *
 * Created by Cosrnos
 */

(function lynxInit_application() {
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

		var tsk = Lynx.Task.create();

		tsk.before = function() {
			logger.debug('Testing Event Emitter...')

			if (!testEvents()) {
				return logger.warn('Lynx Event Emitter is not working properly. Aborting.');
			}

			logger.debug('Starting render loop...');

			logger.debug('Tests passed!');

			Lynx.Graphics.Loop.start();

			Lynx.emit('ready');

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
(function lynxInit_eventEmitter() {
	Lynx.EventEmitter = function() {
		var _listeners = [];

		this.addListener = function(listener) {
			_listeners.push(listener);
		},

		this.on = function(name, callback) {
			// TODO: Make this smarter about whether or not the page is loaded & lynx has been started
			var listener = new Lynx.EventListener();
			listener.on(name, callback);
			return listener;
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
			event = event || '';
			data = data || {};

			_.each(_listeners, function callListeners(listener) {
				listener.notify(event, data);
			});
		}
	};

	Lynx.EventEmitter.apply(Lynx);
})();
(function lynxInit_eventListener() {
	Lynx.EventListener = function() {
		var _events = {};

		this.addListener = function(name, callback) {
			if (!_events[name]) {
				_events[name] = [];
			}

			_events[name].push(callback);
		};

		this.getEvents = function() {
			return _events;
		};

		this.on = function(name, callback) {
			this.addListener(name, callback);
		};

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
		};

		this.notify = function(event, data) {
			event = event || '';
			data = data || {};

			_.each(_events[event], function executeCallbacks(evt) {
				evt(data);
			});
		};

		Lynx.addListener(this);
	};
})();
(function lynxInit_heart() {
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

(function lynxInit_logger() {
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
(function lynxInit_object() {
	function objectModel() {
		Lynx.EventListener.apply(this);

		this.extend = function(options) {
			return _.extend({}, this, options);
		};

		this.reopen = function(options) {
			return _.extend(objectModel, options);
		};
	}

	Lynx.Object = {
		create: function(mixin) {
			var mx = mixin || {};

			if (typeof mx !== 'object') {
				return false;
			}

			return _.extend(new objectModel(), mixin);
		},
		apply: function(target) {
			_.extend(target, new objectModel());
		}
	};
})();
(function lynxInit_task() {
	function taskModel() {
		this.before = function() {};
		this.after = function() {};
		this.resolved = false;
		this.event = null;
		this.data = {};
		this.params = [];
	};

	Lynx.Task = {
		create: function(options) {
			return _.extend(new taskModel(), options);
		}
	}
})();
Lynx.Graphics = {};
(function lynxInit_canvas() {
	var canvasIndex = -1;
	var logger = Lynx.Logger;

	function canvasModel(domElement, useBuffer) {
		var height = 0;
		var width = 0;
		var background = Lynx.Graphics.Color.create();

		Lynx.Object.apply(this);

		if (useBuffer !== false) {
			useBuffer = true;
		}

		this.id = canvasIndex++;
		this.context = '2d';

		this.buffer = null;

		// Properties
		Object.defineProperty(this, 'height', {
			get: function() {
				return height;
			},
			set: function(value) {
				if (typeof value === 'number' && !isNaN(value)) {
					height = value;
					this.element.height = height;
					if (this.buffer) {
						this.buffer.height = height;
					}
				} else {
					logger.warn('Cannot set height value of canvas #' + this.id + ' to ' + value + ' as it is not an integer.');
				}
			}
		});

		Object.defineProperty(this, 'width', {
			get: function() {
				return width;
			},
			set: function(value) {
				if (typeof value === 'number' && !isNaN(value)) {
					width = value;
					this.element.width = width;
					if (this.buffer) {
						this.buffer.width = width;
					}
				} else {
					logger.warn('Cannot set width value of canvas #' + this.id + ' to ' + value + 'as it is not an integer.');
				}
			}
		});

		Object.defineProperty(this, 'background', {
			get: function() {
				if (typeof background === 'number' && !isNaN(value)) {
					// TODO parse number to object
				} else if (Lynx.Graphics.isColor(background)) {
					return background;
				} else {
					debugger;
					// TODO: Support image parsing
				}

				// TODO: Fix this
				return background;
			},
			set: function(value) {
				if (Lynx.Graphics.isColor(value)) {
					background = value;
				} else if ((typeof value === 'number' && !isNaN(value) && value > 0) || (typeof value === 'string')) {
					background = Lynx.Graphics.Color.createFromHex(value);
				} else {
					logger.warn('Could not set background of canvas #' + this.id + ' to invalid color value "' + value + '"');
				}
			}
		});

		if (domElement && domElement.tagName === 'CANVAS') {
			this.element = domElement;
			this.height = this.element.height;
			this.width = this.element.width;

			domElement.LynxCanvas = this;
		} else {
			this.element = document.createElement('canvas');
		}

		if (useBuffer) {
			this.buffer = Lynx.Graphics.Canvas.createBuffer(null, {
				width: this.width,
				height: this.height,
				background: this.background,
				context: this.context
			});
		}

		this.renderer = Lynx.Graphics.Renderer.create(this, {});
		Lynx.Graphics.Loop.addCanvas(this);
	}

	canvasModel.prototype.destroy = function() {
		Lynx.Graphics.Loop.removeCanvas(this);
	};

	canvasModel.prototype.insertInto = function(parentNode) {
		if (parentNode) {
			parentNode.appendChild(this.element);
		}
	};

	function buffer(context) {
		context = context || '2d';
		this.context = '2d';

		this.element = document.createElement('canvas');
	}

	Lynx.Graphics.Canvas = {
		create: function(domElement, options) {
			domElement = domElement || null;
			options = options || {};

			return _.extend(new canvasModel(domElement), options);
		},

		createBuffer: function(domElement, options) {
			domElement = domElement || null;
			options = options || {};

			return _.extend(new buffer(domElement), options);
		}
	};
})();
(function lynxInit_color() {
	var definedColors = {};

	function rgbToHex(r, g, b) {
		return "#" + r.toString(16) + g.toString(16) + b.toString(16);
	}

	function hexToColor(hex) {
		if (hex[0] === '#') {
			hex.shift();
		}

		var r = parseInt(hex[0] + hex[1], 16);
		var g = parseInt(hex[2] + hex[3], 16);
		var b = parseInt(hex[4] + hex[5], 16);

		if (r > 255 || g > 255 || b > 255) {
			return false;
		}

		return new colorModel(r, g, b, 255);
	}

	function colorModel(pR, pG, pB, pA) {
		var r = pR;
		var g = pG;
		var b = pB;
		var a = pA;

		Object.defineProperty(this, 'r', {
			get: function() {
				return r;
			},
			set: function(value) {
				if (typeof value === 'number' && !isNaN(value) && value >= 0 && value <= 255) {
					r = value;
				}
			}
		});

		Object.defineProperty(this, 'g', {
			get: function() {
				return g;
			},
			set: function(value) {
				if (typeof value === 'number' && !isNaN(value) && value >= 0 && value <= 255) {
					g = value;
				}
			}
		});

		Object.defineProperty(this, 'b', {
			get: function() {
				return b;
			},
			set: function(value) {
				if (typeof value === 'number' && !isNaN(value) && value >= 0 && value <= 255) {
					b = value;
				}
			}
		});

		Object.defineProperty(this, 'alpha', {
			get: function() {
				return a;
			},
			set: function(value) {
				if (typeof value === 'number' && !isNaN(value) && value >= 0 && value <= 255) {
					a = value;
				}
			}
		});


		Object.defineProperty(this, 'hex', {
			get: function() {
				return rgbToHex(this.r, this.g, this.b);
			},
			set: function(value) {
				var tempColor = null;
				// Parse
				if (typeof value === 'number' && !isNaN(value) && value >= 0) {
					value = value.toString(16);
				}

				if (typeof value !== 'string') {
					Lynx.Logger.warn('Cannot set hex value to ' + value + ' of color as it is not a valid input. Please provide an integer or string.');
					return;
				}

				tempColor = hexToColor(value);
				if (tempColor) {
					this.r = tempColor.r;
					this.g = tempColor.g;
					this.b = tempColor.b;
					this.a = tempColor.a;
				} else {
					// TODO: Change to error when defined
					Lynx.Logger.warn('Failed to parse hex to color.');
				}
			}
		});
	};

	Lynx.Graphics.isColor = function(value) {
		return (value instanceof colorModel);
	};

	Lynx.Graphics.Color = {
		create: function(options) {
			return _.extend(new colorModel(0, 0, 0, 1), options);
		},

		createFromHex: function(hexValue) {
			var cm = new colorModel(0, 0, 0, 1);
			cm.hex = hexValue;
			return cm;
		},

		define: function(name, value) {
			if (value instanceof colorModel) {
				definedColors[name] = value;
			} else if (typeof value === 'number' || typeof value === 'string') {
				var cm = new colorModel(0, 0, 0, 1);
				cm.hex = value;
			} else {
				Lynx.Logger.warn("Could not define color '", name, "' as an invalid value was passed.");
				return false;
			}

			Lynx.Logger.info('Created color ', name, '!');
			return true;
		},

		get: function(name) {
			return definedColors[name];
		}
	};
})();
(function lynxInit_loop() {
	var _running = false;
	var logger = Lynx.Logger;

	var canvases = [];


	function onRequestAnimationFrame() {
		Lynx.emit('graphics.beforeFrame', {
			nodes: canvases
		});

		_.each(canvases, function(canvas) {
			canvas.renderer.render();
		});

		Lynx.emit('graphics.afterFrame', {
			nodes: canvases
		});
		if (_running) {
			window.requestAnimationFrame(onRequestAnimationFrame);
		}
	}

	Lynx.Graphics.Loop = Lynx.Object.create({
		start: function() {
			if (_running) {
				logger.warn('Cannot start the draw loop as it is already running.');
				return false;
			}

			_running = true;

			window.requestAnimationFrame(onRequestAnimationFrame);
		},

		pause: function() {
			if (_running) {
				_running = false;
				logger.info('Graphics loop paused.');
			}
		},

		resume: function() {
			if (!_running) {
				_running = true;
				logger.info('Graphics loop resumed.');
				window.requestAnimationFrame(onRequestAnimationFrame);
			}
		},

		addCanvas: function(canvas) {
			canvases.push(canvas);
			return true;
		},

		removeCanvas: function(canvas) {
			var index = canvases.indexOf(canvas);
			if (index !== -1) {
				canvases.splice(index, 1);
				return true;
			}

			return false;
		}
	});

	Object.defineProperty(Lynx.Graphics.Loop, 'isRunning', {
		get: function() {
			return _running;
		}
	});
})();
(function lynxInit_renderer() {

	function renderModel(parent) {
		var nodes = [];

		this.parent = parent;

		Object.defineProperty(this, 'context', {
			get: function() {
				return this.parent.context;
			},
			set: function(value) {
				this.parent.context = value;
			}
		});

		this.addNode = function() {
			var args = Array.prototype.slice.call(arguments);

			_.each(args, function(node) {
				nodes.push(node);
			});

			return true;
		};

		this.removeNode = function() {
			var args = Array.prototype.slice.call(arguments);

			var removed = 0;

			_.each(args, function(node) {
				var index = nodes.indexOf(node);
				if (index !== -1) {
					nodes.splice(index, 1);
					removed++;
				}
			});

			return (args.length <= removed);
		};

		this.render = function() {
			var ctx = this.parent.element.getContext(this.context);
			var bg = this.parent.background;

			ctx.clearRect(0, 0, this.parent.width, this.parent.height);
			ctx.fillStyle = 'rgb(' + bg.r + ',' + bg.g + ',' + bg.b + ')';
			ctx.fillRect(0, 0, this.parent.width, this.parent.height);
		};

		Object.defineProperty(this, 'nodes', {
			get: function() {
				return nodes;
			},
			set: function(value) {
				Lynx.Logger.warn('Cannot override value of nodes. Please use addNode and removeNode to manipulate the list.');
			}
		});
	}

	Lynx.Graphics.Renderer = Lynx.Object.create({
		create: function(parent, options) {
			options = options || {};

			return _.extend(new renderModel(parent), options);
		},
	});
})();