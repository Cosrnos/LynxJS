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

	that.Element = function(){ return canvas; }
	that.Ctx = function(pContext){ pContext = pContext || "2d"; return canvas.getContext(pContext); }

	//Event Definitions
	that.On("requestAnimationFrame", onRequestAnimationFrame);

	//Public Methods
	that.Update = function()
	{ 
		buffer.getContext("2d").clearRect(0, 0, buffer.width, buffer.height);
		that.Ctx("2d").clearRect(0,0,that.Width, that.Height);
		for(var i = 0; i < elements.length; i++)
			elements[i].Draw(buffer);

		this.Ctx("2d").drawImage(buffer,0,0);
		return true;
	};

	that.AddElement = function(pCanvasElement)
	{
		elements.push(pCanvasElement);
		return elements[elements.length-1];
	};

	//Event Callbacks
	function onRequestAnimationFrame(pSender)
	{
		return that.Update();
	}

	return that;
};

Lynx.C = Lynx.Canvas;