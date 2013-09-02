var Lynx = Lynx || {};

Lynx.Time= new (function(params){
	var that = {};

	var lastUpdate = Date.now(),
		now = Date.now();
		var gameDelta = 0;
		var totalTime = 0;

	that.GetDelta = function(){
		return gameDelta;
	};

	that.GetTimeTotal = function(){
		return totalTime;
	};

	that.Tick = function(){
		lastUpdate = now;
		now = Date.now();
		gameDelta = now - lastUpdate;
		totalTime = totalTime + gameDelta;
	};
	
	return that;
})();