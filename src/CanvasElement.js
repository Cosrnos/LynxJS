/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    File Name: CanvasElement.js
*    Description: A drawable element on the canvas. Visual representation only.
*    Global Variables: Lynx.CanvasElement(), Lynx.CE()
*/

Lynx.CanvasElement = function(pX, pY, pWidth, pHeight, pElementType){
	var that = new Lynx.Object();

	that.X = pX;
	that.Y = pY;
	that.Width = pWidth;
	that.Height = pHeight;
	that.Type = pElementType;

	//Public Methods
	that.Draw = function(pBuffer)
	{
		if(this.Notify("draw",pBuffer))
		{
			pBuffer.getContext("2d").fillStyle = "#ffffff";
			pBuffer.getContext("2d").fillRect(this.X, this.Y, this.Width, this.Height); 
		}
	}

	that.On("draw", function(pBuffer){ return true; });

	//Event Callbacks
	function onRequestAnimationFrame(pSender)
	{
		return this.Update();
	}

	Lynx.Emit("CanvasElement.Create", that);
	return that;
};

Lynx.CE = function(pX, pY, pWidth, pHeight, pElementType){ return new Lynx.CanvasElement(pX, pY, pWidth, pHeight, pElementType); };