(function lynxInit_renderer() {

	function renderModel(parent) {
		var nodes = [];
        var renderer = this;

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
			var ctx = this.parent.buffer.element.getContext(this.context);
			var bg = this.parent.background;

			ctx.clearRect(0, 0, this.parent.width, this.parent.height);
			ctx.fillStyle = 'rgb(' + bg.r + ',' + bg.g + ',' + bg.b + ')';
			ctx.fillRect(0, 0, this.parent.width, this.parent.height);

            //TODO: Sort nodes by asset type & render batches
            _.each(nodes, function(node){
                node.render(ctx, false);
            });

            this.parent.element.getContext(this.context).drawImage(this.parent.buffer.element, 0, 0);
            ctx.clearRect(0, 0, this.parent.width, this.parent.height);
		};

		this.renderBatch = function(batch) {
			if (!Lynx.Graphics.isBatch(batch) && !(batch instanceof Array)) {
				Lynx.Logger.warn('Cannot call renderBatch on ' + batch + ' as it is not a Lynx.Graphics.Batch object nor is it an array.');
				return false;
			}

			if (batch instanceof Array) {
				batch = Lynx.Batch.create(batch);
			}

			batch.before(this);
			_.each(batch.nodes, function(node) {
				batch.beforeEach(renderer, node);
				node.render(renderer, true);
				batch.afterEach(renderer, node);
			});
			batch.after(this);
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
		}
	});
})();