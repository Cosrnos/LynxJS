(function lynxInit_loop() {
	var _running = false;
	var logger = Lynx.Logger;

	var canvases = [];


	function onRequestAnimationFrame() {
		Lynx.emit('graphics.beforeFrame', {
			nodes: canvases
		});

		_.each(canvases, function(canvas) {
			canvas.renderer.render();
		});

		Lynx.emit('graphics.afterFrame', {
			nodes: canvases
		});
		if (_running) {
			window.requestAnimationFrame(onRequestAnimationFrame);
		}
	}

	Lynx.Graphics.Loop = Lynx.Object.create({
		start: function() {
			if (_running) {
				logger.warn('Cannot start the draw loop as it is already running.');
				return false;
			}

			_running = true;

			window.requestAnimationFrame(onRequestAnimationFrame);
		},

		pause: function() {
			if (_running) {
				_running = false;
				logger.info('Graphics loop paused.');
			}
		},

		resume: function() {
			if (!_running) {
				_running = true;
				logger.info('Graphics loop resumed.');
				window.requestAnimationFrame(onRequestAnimationFrame);
			}
		},

		addCanvas: function(canvas) {
			canvases.push(canvas);
			return true;
		},

		removeCanvas: function(canvas) {
			var index = canvases.indexOf(canvas);
			if (index !== -1) {
				canvases.splice(index, 1);
				return true;
			}

			return false;
		}
	});

	Object.defineProperty(Lynx.Graphics.Loop, 'isRunning', {
		get: function() {
			return _running;
		}
	});
})();