(function lynxInit_color() {
	var definedColors = {};

	function rgbToHex(r, g, b) {
		return "#" + r.toString(16) + g.toString(16) + b.toString(16);
	}

	function hexToColor(hex) {
		if (hex[0] === '#') {
			hex.shift();
		}

		var r = parseInt(hex[0] + hex[1], 16);
		var g = parseInt(hex[2] + hex[3], 16);
		var b = parseInt(hex[4] + hex[5], 16);

		if (r > 255 || g > 255 || b > 255) {
			return false;
		}

		return new colorModel(r, g, b, 255);
	}

	function colorModel(r, g, b, a) {
		var r = r;
		var g = g;
		var b = b;
		var a = a;

		Object.defineProperty(this, 'r', {
			get: function() {
				return r;
			},
			set: function(value) {
				if (typeof value === 'number' && !isNaN(value) && value >= 0 && value < 255) {
					r = value;
				}
			}
		});

		Object.defineProperty(this, 'g', {
			get: function() {
				return g;
			},
			set: function(value) {
				if (typeof value === 'number' && !isNaN(value) && value >= 0 && value < 255) {
					g = value;
				}
			}
		});

		Object.defineProperty(this, 'b', {
			get: function() {
				return b;
			},
			set: function(value) {
				if (typeof value === 'number' && !isNaN(value) && value >= 0 && value < 255) {
					b = value;
				}
			}
		});

		Object.defineProperty(this, 'alpha', {
			get: function() {
				return a;
			},
			set: function(value) {
				if (typeof value === 'number' && !isNaN(value) && value >= 0 && value < 255) {
					a = value;
				}
			}
		});


		Object.defineProperty(this, 'hex', {
			get: function() {
				return rgbToHex(this.r, this.g, this.b);
			},
			set: function(value) {
				var tempColor = null;
				// Parse
				if (typeof value === 'number' && !isNaN(value) && value >= 0) {
					value = value.toString(16);
				}

				if (typeof value !== 'string') {
					Lynx.Logger.warn('Cannot set hex value to ' + value + ' of color as it is not a valid input. Please provide an integer or string.');
					return;
				}

				tempColor = hexToColor(value);
				if (tempColor) {
					this.r = tempColor.r;
					this.g = tempColor.g;
					this.b = tempColor.b;
					this.a = tempColor.a;
				} else {
					// TODO: Change to error when defined
					Lynx.Logger.warn('Failed to parse hex to color.');
				}
			}
		});
	};

	Lynx.Graphics.isColor = function(value) {
		return (value instanceof colorModel);
	};

	Lynx.Graphics.Color = {
		create: function(options) {
			return _.extend(new colorModel(0, 0, 0, 1), options);
		},

		createFromHex: function(hexValue) {
			var cm = new colorModel(0, 0, 0, 1);
			cm.hex = hexValue;
			return cm;
		},

		define: function(name, value) {
			if (value instanceof colorModel) {
				definedColors[name] = value;
			} else if (typeof value === 'number' || typeof value === 'string') {
				var cm = new colorModel(0, 0, 0, 1);
				cm.hex = value;
			} else {
				Lynx.Logger.warn("Could not define color '", name, "' as an invalid value was passed.");
				return false;
			}

			Lynx.Logger.info('Created color ', name, '!');
			return true;
		},

		get: function(name) {
			return definedColors[name];
		}
	};
})();