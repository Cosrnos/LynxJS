/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    File Name: Canvas.js
*    Description: A standard canvas
*    Global Variables: Lynx.Canvas()
*/

Lynx.Canvas = function(pWidth, pHeight){
	var that = new Lynx.Object();
	
	//Private Variables

	var canvas = document.createElement("canvas");
	canvas.width = pWidth;
	canvas.height = pHeight;

	Object.defineProperty(that, "Width", { get: function(){ return canvas.width; } });
	Object.defineProperty(that, "Height", { get: function(){ return canvas.height; } });

	var elements = [];

	/**
	* Description: Gets the HTML Canvas Element
	*
	* @this {Lynx.Canvas}
	* @return {HTMLCanvasElement} The direct canvas element
	*/	
	Object.defineProperty(that, "Element", { get: function(){ return canvas; } });

	/**
	* Description: Gets the HTMLCanvasElement Context
	*
	* @this {Lynx.Canvas}
	* @param {String} <pContext> The Context to retreive
	*/	
	that.Ctx = function(pContext){ pContext = pContext || "2d"; return canvas.getContext(pContext); }

	//Event Definitions
	that.On("requestAnimationFrame", onRequestAnimationFrame);

	/**
	* Description: Draws all canvas elements
	*
	* @this {Lynx.Canvas}
	*/
	that.Update = (function()
	{ 
		this.Ctx("2d").clearRect(0, 0, this.Width, this.Height);
		for(var i = 0; i < elements.length; i++)
			elements[i].Draw(canvas);

		return true;
	}).bind(that);

	/**
	* Description: Adds the canvas element to the canvas
	*
	* @this {Lynx.Canvas}
	* @param {Lynx.CanvasElement} <pCanvasElement> The element to add
	* @return {int} the index of the added element (For removal later)
	*/	
	that.AddElement = function(pCanvasElement)
	{
		elements.push(pCanvasElement);
		Lynx.Emit("Canvas.AddElement", this);
		return elements.length-1;
	};

	/**
	* Description: Takes a mouse position relative to the window and determines where it is on the canvas
	*
	* @this {Lynx.Canvas}
	* @param {int} <pX> X position of the mouse
	* @param {int} <pY> Y Position of the mouse
	* @return {Object{X,Y}} Given coordinates relative to the canvas.
	*/	
	that.ParseMousePosition = function(pX, pY)
	{
		var cPos = canvas.getBoundingClientRect();
		return {X: Math.floor(pX - cPos.left), Y: Math.floor(pY - cPos.top)};
	}

	/**
	* Description: Vertically and horizontally centers the provided image on the canvas
	*
	* @this {Lynx.Canvas}
	* @param {Image} <pImage> Image to be centered
	*/	
	that.CenterImage = (function(pImage)
	{
		this.Ctx("2d").drawImage(pImage, Math.floor((this.Width-pImage.width)/2), Math.floor((this.Height-pImage.height)/2));
	}).bind(that);

	/**
	* Description: Fired when the window is ready to render another frame
	*
	* @this {Lynx.Canvas}
	* @param {Lynx.Animator} <pSender> The Lynx Animation Thread
	*/	
	function onRequestAnimationFrame(pSender)
	{
		return that.Update();
	}

	return that;
};

Lynx.C = Lynx.Canvas;
