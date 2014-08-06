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