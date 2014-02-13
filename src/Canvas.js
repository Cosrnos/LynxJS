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

Lynx.Canvas = function(pId, pParent, pWidth, pHeight){
	var that = new Lynx.Object();
	
	//Private Variables
	var buffer = document.createElement("canvas");
	buffer.width = pWidth;
	buffer.height = pHeight;

	var _c = document.createElement("canvas");
	_c.id = pId;
	_c.width = pWidth;
	_c.height = pHeight;
	document.getElementById(pParent).appendChild(_c);

	var canvas = document.getElementById(pId);

	that.Width = pWidth;
	that.Height = pHeight;
	that.Parent = document.getElementById(pParent);
	that.Id = pId;


	var elements = [];

	/**
	* Description: Gets the HTML Canvas Element
	*
	* @this {Lynx.Canvas}
	* @return {HTMLCanvasElement} The direct canvas element
	*/	
	that.Element = function(){ return canvas; }

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
	that.Update = function()
	{ 
		buffer.getContext("2d").clearRect(0, 0, buffer.width, buffer.height);
		that.Ctx("2d").clearRect(0,0,that.Width, that.Height);
		for(var i = 0; i < elements.length; i++)
			elements[i].Draw(buffer);

		this.Ctx("2d").drawImage(buffer,0,0);
		return true;
	};

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
		return this.Update();
	}

	return that;
};

Lynx.C = Lynx.Canvas;
