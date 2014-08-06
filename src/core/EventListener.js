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