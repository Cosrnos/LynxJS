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