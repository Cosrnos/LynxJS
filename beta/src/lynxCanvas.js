var Lynx = Lynx || {};

Lynx.Canvas= function(pId){
	var that = {};

	var id = pId,
		x = 0,
		y = 0,
		width = 100,
		height = 100,
		canvasElement = null,
		ctx = null;

	if(pId != null){
		canvasElement = document.getElementById(pId);
		if(canvasElement == null){
			canvasElement = document.createElement("canvas");
			canvasElement.setAttribute("id",pId);
		}
	}
	if(canvasElement != null){
		ctx = canvasElement.getContext("2d");
		width = canvasElement.width;
		height = canvasElement.height;
	}else{
		Lynx.Logger.Log("Could not create canvas element "+canvasElement,Lynx.LogLevel.FATAL_ERROR);
		return;
	}

	that.GetId = function () {
		return id;
	};

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

	that.GetCanvasElement = function(){
		return canvasElement;
	};

	that.GetContext = function(){
		return ctx;
	};

	that.SetId = function(pId){
		id = pId;
		canvasElement.setAttribute("id",pId);
	};

	that.SetX = function(pX){
		x = pX;
	};

	that.SetY = function(pY){
		y = pY;
	};

	that.SetWidth = function(pWidth){
		width = pWidth;
		canvasElement.setAttribute("width",pWidth);
	};

	that.SetHeight = function(pHeight){
		height = pHeight;
		canvasElement.setAttribute("height",pHeight);
	};

	return that;
};