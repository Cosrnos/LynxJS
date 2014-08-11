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