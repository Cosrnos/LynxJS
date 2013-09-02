var Lynx = Lynx || {};

Lynx.Scene = function(name){
	var that = {};

	var name = name,
		bgm = false,
		objects = [],
		canvas = new Lynx.Canvas("LSCENE-"+name),
		map = new Lynx.Map(100,100);

	that.Open = function(){};
	that.Update = function(){};
	that.End = function(){};

	that.GetName = function(){
		return name;
	};

	that.GetBGM = function(){
		return bgm;
	};

	that.GetObjects = function(){
		return objects;
	};

	that.GetAllObjects = function(){
		return objects;
	};

	that.GetCanvas = function(){
		return canvas;
	};

	that.GetCanvasElement = function(){
		return canvas.GetCanvasElement();
	};

	that.GetMap = function(){
		return map;
	};

	that.SetName = function(pName){
		name = pName;
	};

	that.ChangeBGM = function(pBgm,play){
		if(bgm != false){
			bgm.Pause();
		}
		bgm = pBgm;
		if(typeof play != 'undefined' && play){
			bgm.Play(true);
		}
		Lynx.Logger.Log("Changed bgm of scene '"+name+"' to '"+bgm.GetRef()+"'",Lynx.LogLevel.INFO);
	};

	that.AddObject = function(pGameObject){
		objects.push(pGameObject);
	};
	that.GetIndex = function(pObject){
		var index = -1;
		for(var i in objects){
			if(objects[i].GetName() = pObject.GetName())
				index = i;
		}
		return index;
	};

	Lynx.Scene.RemoveObject = function(pIndex){
		objects.splice(pIndex,1);
	};

	that.Draw = function(){
		var ctx = canvas.GetContext();
		ctx.clearRect(0,0,canvas.GetWidth(),canvas.GetHeight());
		for(var i in objects){
			var realX = objects[i].GetX() - map.GetX();
			var realY = objects[i].GetY() - map.GetY();
			if(realX+objects[i].GetWidth() >= 0 && realY+objects[i].GetHeight() >= 0 && objects[i].IsVisible())
				objects[i].Draw(that);		
		}
	};

	return that;
};