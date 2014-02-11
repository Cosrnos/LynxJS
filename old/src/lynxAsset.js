var Lynx = Lynx || {};

Lynx.Asset = function(pRef,pType,pUrl){
	var that = {};

	var ref = pRef,
		type = pType,
		url = pUrl,
		object = null,
		playing = false;

	that.GetType = function(){
		return type;
	};

	that.GetRef = function(){
		return ref;
	};

	that.GetUrl = function(){
		return url;
	};

	that.GetObject = function(){
		return object;
	};

	that.Load = function() {
		var tempObject = -1;
		Lynx.Logger.Log("Attempting to load asset "+ref,Lynx.LogLevel.INFO);
		var nCallback = function(){
			that.onload();
		};

		if(type == Lynx.AssetType.IMAGE){
			tempObject = new Image();
			tempObject.addEventListener('load',nCallback,false);
			tempObject.src = url;
		}else if(type == Lynx.AssetType.AUDIO){
			tempObject = new Audio();
			tempObject.addEventListener('canplaythrough',nCallback,false);
			tempObject.src = url;
			tempObject.load();
		}else if(type == Lynx.AssetType.VIDEO){
			tempObject = new Video();
			tempObject.addEventListener('canplaythrough',nCallback,false);
			tempObject.src = url;
		}
		if(tempObject != -1){
			object = tempObject;
			return true;
		}else{
			return false;
		}
	};

	that.Play = function(loop){
		var looping = false;
		if(typeof loop != 'undefined'){
			looping = loop;
		}
		if(type == Lynx.AssetType.AUDIO || type == Lynx.AssetType.VIDEO){
			object.play();
			if(looping){
				object.addEventListener("ended",function(){
					object.currentTime = 0;
					object.play();
				},false);
			}
		}
		playing = true;
	};

	that.Pause = function(){
		if(type == Lynx.AssetType.AUDIO){
			object.pause();
		}
		if(type == Lynx.AssetType.VIDEO){
			object.pause();			
		}		
		playing = false;
	}

	that.onload = function(){ };

	return that;
};