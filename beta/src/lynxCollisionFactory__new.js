var Lynx = Lynx || {};

Lynx.CollisionFactory_New = (function(){
	var that = {};
	var collisionEvents = [];

	that.Subscribe = function(pType1,pType2,callback){
		pType1 = pType1.toUpperCase();
		pType2 = pType2.toUpperCase();
		if(typeof collisionEvents[pType1+"_"+pType2] == 'undefined'){
			collisionEvents[pType1+"_"+pType2] = [];
		}

		collisionEvents[pType1+"_"+pType2].push(callback);
		return true;
	};

	that.Notify = function(pObject1,pObject2){
		if(typeof collisionEvents[pObject1.GetType()+"_"+pObject2.GetType()] == 'undefined'){
			return true;
		}
		for(var i in collisionEvents[pObject1.GetType()+"_"+pObject2.GetType()]){
			collisionEvents[pObject1.GetType()+"_"+pObject2.GetType()][i](pObject1,pObject2);
		}
	};

	return that;
})();