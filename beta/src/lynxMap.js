var Lynx = Lynx || {};

Lynx.Map= function(pWidth,pHeight){
	var that = {};

	var width = pWidth,
		height = pHeight,
		x = 0,
		y = 0,
		objects = [];

	that.GetWidth = function(){
		return width;
	};

	that.GetHeight = function(){
		return height;
	};

	that.GetX = function(){
		return x;
	};

	that.GetY = function(){
		return y;
	};

	that.GetObjects = function(){
		return objects;
	};

	that.SetWidth = function(pWidth){
		width = pWidth;
	};

	that.SetHeight = function(pHeight){
		height = pHeight;
	};

	that.SetX = function(pX){
		x = pX;
	};

	that.SetY = function(pY){
		y = pY;
	};

	that.Pan = function(pX,pY){
		this.SetX(x+pX);
		this.SetY(y+pY);
	};

	that.Draw = function(pScene){
		var ctx = pScene.GetCanvas().GetContext()
			objects = this.GetObjects();		
		for(var i in objects){
			if(this.OnScreen(objects[i]) && objects[i].IsVisible())
				objects[i].Draw(pScene,this);		
		}
	};

	that.OnScreen = function(pObject){
		return (x <= pObject.GetX() + pObject.GetWidth() &&
			x + Lynx.Game.GetScreenWidth() >= pObject.GetX() &&
			y <= pObject.GetY() + pObject.GetHeight() &&
			y + Lynx.Game.GetScreenHeight() >= pObject.GetY());
	};

	that.AddObject = function(pObject){
		objects.push(pObject);
	};

	return that;
};