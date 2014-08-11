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