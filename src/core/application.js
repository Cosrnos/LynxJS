/* Lynx Application File
 * Main entry point
 *
 * Created by Cosrnos
 */

(function() {
	var logger = {};

	window.Lynx = {
		debug: false,
		log: function() {
			Lynx.Logger.log.call(this, Array.prototype.slice.call(arguments));
		}
	};

	function startLynx() {
		logger = Lynx.Logger;

		logger.info('Starting Lynx Library....');
		Lynx.Heart.start();

		var tsk = new Lynx.Task();

		tsk.before = function() {
			logger.debug('Intializing Event Emitter...');
			Lynx.EventEmitter.apply(this);

			logger.debug('Testing Event Emitter...')

			if (!testEvents()) {
				return logger.warn('Lynx Event Emitter is not working properly. Aborting.');
			}

			logger.debug('Tests passed!');

			return true;
		}.bind(this);

		Lynx.Heart.queueTask(tsk);
	}

	function testEvents() {
		var sampleListener = new Lynx.EventListener();

		var sample = 0;

		sampleListener.on('__sample', function(data) {
			sample = data.testValue;
		});

		Lynx.addListener(sampleListener);

		Lynx.emit('__sample', {
			testValue: 1
		});
		// TODO: Promises would be lovely to test here...

		if (sample === 1) {
			return true;
		}

		return false;
	}

	window.addEventListener('load', function() {
		startLynx.apply(Lynx);
	});
})();