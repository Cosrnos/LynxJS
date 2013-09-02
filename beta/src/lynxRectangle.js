var Lynx = Lynx || {};

Lynx.Rectangle= function(pX,pY,pWidth,pHeight){
	var that = {};

	var x = pX,
		y = pY,
		width = pWidth,
		height = pHeight;	

	that.GetX = function(){
		return x;
	};

	that.GetY = function(){
		return y;
	};

	that.GetWidth = function(){
		return width;
	};

	that.GetHeight = function(){
		return height;
	};

	that.GetArea = function(){
		return width*height;
	};

	that.GetPerimeter = function(){
		return (2*width)+(2*height);
	};
	
	//Accessors - SETS
	that.SetX = function(pX){
		x = pX;
	};

	that.SetY = function(pY){
		y = pY;
	};

	that.SetWidth = function(pWidth){
		width = pWidth;
	};

	that.SetHeight = function(pHeight){
		height = pHeight;
	};

	return that;
};