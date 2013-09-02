var Lynx = Lynx || {};

Lynx.AssetManager = (function(){
	var that = {};

	var images = [],
		sounds = [],
		videos = [],
		xml = [],
		json = [],
		lynxOBJ = [],
		preload_progress = 0,
		preload_total = 0,
		ready = false,
		preload_callback = function(){};

	that.Internal = {
		OnAssetLoad: function(){
			preload_progress++;
			if(preload_progress >= preload_total){
				Lynx.Logger.Log("Assets Loaded!",Lynx.LogLevel.DEBUG);
				preload_callback();
				ready = true;
			};
		}
	};

	//Accessors - GETS
	that.GetImage = function(pImage){
		return images[pImage];
	};

	that.GetAudio = function(pSound){
		return sounds[pSound];
	};

	that.GetVideo = function(pVideo){
		return videos[pVideo];
	};

	that.GetXML = function(pXML){
		return xml[pXML];
	};

	that.GetJSON = function(pJSON){
		return json[pJSON];
	};

	that.GetLynxOBJ = function(pLynxOBJ){
		return lynxOBJ[pLynxOBJ];
	};

	that.GetPreloadProgress = function(){
		return preload_progress;
	};

	that.GetPreloadTotal = function(){
		return preload_total
	};

	that.IsReady = function(){
		return ready;
	};

	that.GetProgressBar = function(){
		if(preload_progress > 0){
			return ((preload_progress / preload_total)*100);
		}else{
			return 0;
		}
	};

	that.PutAsset = function(pRef,pType,pUrl){
		var ref = ref;
		var asset = new Lynx.Asset(pRef,pType,pUrl);
		if(pType == Lynx.AssetType.IMAGE){
			images[pRef] = asset;
		}
		if(pType == Lynx.AssetType.AUDIO){
			sounds[pRef] = asset;
		}
		if(pType == Lynx.AssetType.VIDEO){
			videos[pRef] = asset;
		}
		preload_total++;
	};

	that.Preload = function(pCallback){
		Lynx.Logger.Log("Preloading Assets...",Lynx.LogLevel.DEBUG);
		if(preload_total == 0){
			pCallback();
			return;
		}
		preload_callback = pCallback;
		for(var ref in images){
			var co = images[ref];
			co.onload = that.Internal.OnAssetLoad;
			co.Load();
		}
		for(var ref in sounds){
			var co = sounds[ref];
			co.onload = that.Internal.OnAssetLoad;
			co.Load();
		}
		for(var ref in videos){
			var co = sounds[ref];
			co.onload = that.Internal.OnAssetLoad;
			co.Load();
		}
	};

	that.LoadAsset = function(pAsset){
		var ref = pAsset.GetRef();
		var success = true;
		switch(pAsset.GetType()){
			case Lynx.AssetType.IMAGE:
				images[ref] = pAsset;
			break;
			case Lynx.AssetType.AUDIO:
				sounds[ref] = pAsset;
			break;
			case Lynx.AssetType.VIDEO:
				videos[ref] = pAsset;
			break;
			case Lynx.AssetType.XML:
				xml[ref] = pAsset;
			break;
			case Lynx.AssetType.JSON:
				json[ref] = pAsset;
			break;
			case Lynx.AssetType.LynxObj:
				lynxObj[ref] = pAsset;
			break;
			default:
				success = false;
			break;
		}
		return success;
	};

	return that;
})();