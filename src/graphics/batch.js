(function() {
	function batchModel(array) {
		this.nodes = array;
		this.before = function(renderer) {};
		this.beforeEach = function(renderer, node) {};
		this.afterEach = function(renderer, node) {};
		this.after = function(renderer) {};
	}

	Lynx.Graphics.Batch = Lynx.Object.create({
		create: function(array, options) {
			options = options || {};

			return _.extend(new batchModel(array), options);
		}
	});
})();