var Lynx = Lynx || {};

Lynx.Logger = new (function(){
	var that = {};

	var logDiv = null;

	that.Log = function(pMessage,pLevel){
		var ct = (Lynx.Time.GetTimeTotal() / 1000).toFixed(1);
		
		if(typeof pLevel == 'undefined')
			pLevel = Lynx.LogLevel.INTERNAL;
		if(Lynx.Settings.DebugEnabled && pLevel <= Lynx.Settings.LoggerLevel){
			if(logDiv != null){
				logDiv.innerHTML += "<br/>"+"["+ct+"] "+Lynx.LogLevel.Parse(pLevel)+": "+pMessage;
				logDiv.scrollTop = logDiv.scrollHeight;
			}
			console.log("["+ct+"] LYNX - "+Lynx.LogLevel.Parse(pLevel)+": "+pMessage);
		}
	};

	that.DesignateLogger = function(pLogDiv){
		logDiv = pLogDiv;
	};

	return that;
})();