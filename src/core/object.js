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