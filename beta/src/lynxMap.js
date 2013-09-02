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

	that.AddObject = function(pObject){
		objects.push(pObject);
	};

	return that;
};