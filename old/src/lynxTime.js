var Lynx = Lynx || {};

Lynx.Time= new (function(params){
	var that = {};
	
	var lastUpdate = Date.now(),
		now = Date.now(),
		gameDelta = 0,
		totalTime = 0,
		events = [];

	that.GetDelta = function(){
		return gameDelta;
	};

	that.GetTimeTotal = function(){
		return totalTime;
	};

	that.Schedule = function(pDelay,pCallback,pRepeat){
		var pRepeat = pRepeat || false;

		events.push({
			delay: pDelay,
			callback: pCallback,
			repeat: pRepeat,
			lastFired: Date.now()
		});
	};

	that.Tick = function(){
		lastUpdate = now;
		now = Date.now();
		gameDelta = now - lastUpdate;
		totalTime = totalTime + gameDelta;
		for(var i in events){
			var e = events[i];
			if(e.delay <= now - e.lastFired){
				e.callback();
				if(!e.repeat){
					events.splice(i,1);
					continue;
				}
				e.lastFired = now;
			}
		}
	};
	
	return that;
})();