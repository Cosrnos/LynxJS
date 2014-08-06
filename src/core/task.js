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