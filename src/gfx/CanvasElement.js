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

	/**
	* Description: Updates the canvas object
	*
	* @this {Lynx.CanvasElement}
	* @param {HTMLCanvasElement} <pBuffer> Canvas buffer to draw upon
	*/
	that.Draw = (function(pRenderer)
	{
		pRenderer.Render(this);
		return true;
	}).bind(that);

	//Event Callbacks
	that.On("draw", function(pBuffer){ return true; });

	Lynx.Emit("CanvasElement.Create", that);

	return that;
};

Lynx.CE = function(pX, pY, pWidth, pHeight, pElementType){ return new Lynx.CanvasElement(pX, pY, pWidth, pHeight, pElementType); };
