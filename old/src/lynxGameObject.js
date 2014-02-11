var Lynx = Lynx || {};

Lynx.GameObject = function(pName,pX,pY,pWidth,pHeight){
	var that = {};

	var name = pName,
		x = pX,
		y = pY,
		collidingObject = new Lynx.Rectangle(pX,pY,pWidth,pHeight),
		collidable = true,
		resolveCollisions = false,
		canvas = new Lynx.Canvas("go_"+name),
		visible = true,
		lastXPos = pX,
		lastYPos = pY,
		frames = [],
		type = "unset"; //Each frame is an asset. May want to rework to spritesheet later
		//but since you don't have much time let's forget it.

	that.Update = function(){};
	that.Draw = function(pScene,pMap){
		var ctx = pScene.GetCanvas().GetContext();
		ctx.fillRect(x-pMap.GetX(),y-pMap.GetY(),this.GetWidth(),this.GetHeight());		
	};

	that.GetInstance = function(){
		return this;
	};
	
	that.GetName = function(){
		return name;
	};

	that.GetX = function(){
		return x;
	};

	that.GetY = function(){
		return y;
	};

	that.GetWidth = function(){
		return collidingObject.GetWidth();
	};

	that.GetHeight = function(){
		return collidingObject.GetHeight();
	};

	that.GetCollidingObject = function(){
		return collidingObject;
	};

	that.Collidable = function(){
		return collidable;
	};

	that.ResolveCollisions = function(){
		return resolveCollisions;
	};

	that.IsVisible = function(){
		return visible;
	};

	that.GetLastPosition = function(){
		return {
			x: lastXPos,
			y: lastYPos
		};
	};

	that.GetLastUpdate = function(){
		var lastUpdate = "";

		if(x != lastXPos)
			lastUpdate += "x";
		if(y != lastYPos)
			lastUpdate += "y";

		return lastUpdate;
	};

	that.GetFrames = function(){
		return frames;
	};

	that.GetType = function(){
		return type;
	};

	that.SetName = function(pName){
		name = pName;
		canvas.SetId("go_"+pName);
	};

	that.SetX = function(pX){
		lastXPos = x;
		x = pX;
		collidingObject.SetX(pX);
	};

	that.SetY = function(pY){
		lastYPos = y;
		y = pY;
		collidingObject.SetY(pY);
	};

	this.SetWidth = function(pWidth){
		collidingObject.SetWidth(pWidth);
	};

	this.SetHeight = function(pHeight){
		collidingObject.SetHeight(pHeight);
	};


	that.SetCollidable = function(pBool){
/*
*
*	This method has been scheduled for REMOVAL from the core.
*	The removal has been scheduled for Alpha Milestone 0.1
*
*	For more information please visit lynx.cosrnos.com/schedule.html
*
*/		collidable = pBool;
	};

	that.SetCollisions = function(pColl){
/*
*
*	This method has been scheduled for REMOVAL from the core.
*	The removal has been scheduled for Alpha Milestone 0.1
*
*	For more information please visit lynx.cosrnos.com/schedule.html
*
*/		resolveCollisions = pColl;
	};

	that.Show = function(){
		visible = true;
	};

	that.Hide = function(){
		visible = false;
	};

	that.SetFrames = function(pArray){
		frames = pArray;
	};

	that.SetType = function(pString){
		type = pString;
	};

	that.Collides = function(pObject){
/*
*
*	This method has been scheduled for REMOVAL from the core.
*	The removal has been scheduled for Alpha Milestone 0.1
*
*	For more information please visit lynx.cosrnos.com/schedule.html
*
*/
		var coll = Lynx.CollisionFactory.Collides(that,pObject);
		return coll;
	};

	that.WillCollide = function(pX,pY,pArray){
/*
*
*	This method has been scheduled for REMOVAL from the core.
*	The removal has been scheduled for Alpha Milestone 0.1
*
*	For more information please visit lynx.cosrnos.com/schedule.html
*
*/
		return Lynx.CollisionFactory.WillCollide(that,x+pX,y+pY,pArray);
	};

	return that;
};