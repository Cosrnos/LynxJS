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