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
	* Description: Draws all canvas elements in the current scene.
	*
	* @this {Lynx.Canvas}
	*/
	that.Update = (function()
	{ 
		this.Renderer.Clear();
		var objs = Lynx.Scene.GetDrawableObjects();

		this.Renderer.Render(objs);

		return true;
	}).bind(that);

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
	* Description: Changes the internal canvas element to the element provided. Should only be used for webGL context switching
	* 
	* @this {Lynx.Canvas}
	* @param {Document.CanvasElement}
	*/
	that.__setElement = (function(pElement)
	{
		canvas = pElement;
		this.Renderer.RefreshContext();
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
	};


	//Attach the renderer before returning
	that.Renderer = new Lynx.Renderer(that);

	return that;
};

Lynx.C = Lynx.Canvas;
