var Lynx = Lynx || {};

var LC = LC || {};

Lynx.Component = function(){
	var that = {};

	var conflicting = [];

	that.Name = "My Lynx Component";
	that.Author = "Anonymous";
	that.Version = "0.0";

	that.Confliction = function(pString){
		conflicting.push(pString);
	};

	that.ConflictsWith = function(pString){
		var found = false;
		for(var i in conflicting){
			if(conflicting[i] == pString){
				found = true;
			}
		}
		return found;
	};

	that.Register = function(){
		Lynx.ComponentManager.Register(this);
	};

	that.Log = function(pMessage){
		Lynx.Logger.Log(pMessage,Lynx.LogLevel.INTERNAL);
	};

	that.Update = function(currentScene){};
	that.Draw = function(currentScene){};
	that.onLoad = function(){};
	that.onUnload = function(){};
	return that;
};