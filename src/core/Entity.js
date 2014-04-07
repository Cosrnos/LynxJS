/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    File Name: Entity.js
*    Description: A game object that is in some way interactable.
*    Global Variables: Lynx.Entity, Lynx.E
*/

Lynx.Entity = function(pImage)
{
	var that = new Lynx.Object();

	//Construct
	var x = 0,
		y = 0,
		width = 1,
		height = 1;

	if(!pImage)
	{
		Lynx.Warning("A ghost entity has been created, please make sure to initialize all entities to avoid conflicts.");
	}
	else if(pImage instanceof Image)
	{

	}
	else if(arguments.length >= 2)
	{
		if(typeof arguments[0] === 'number')
		{
			x = arguments[0];
			y = arguments[1];

			if(arguments.length == 4)
			{
				width = arguments[2];
				height = arguments[3];
			}
		}
	}

	//Properties
	var canvasElement = new Lynx.CE(x, y, width, height, "entity");
	var bounds = new Lynx.Rect(x, y, width, height);

	Object.defineProperty(that, "CanvasElement", {
		get: function()
		{
			return canvasElement;
		}
	});

	Object.defineProperty(that, "Bounds", {
		get: function()
		{
			return bounds;
		}
	});

	Object.defineProperty(that, "X", {
		get: function()
		{
			return x;
		},
		set: function(pX)
		{
			x = pX;
			bounds.X = pX;
			canvasElement.X = pX;
		}
	});

	Object.defineProperty(that, "Y", {
		get: function()
		{
			return y;
		},
		set: function(pY)
		{
			y = pY;
			bounds.Y = pY;
			canvasElement.Y = pY;
		}
	});

	Object.defineProperty(that, "Width", {
		get: function()
		{
			return width;
		},
		set: function(pWidth)
		{
			width = pWidth;
			bounds.Width = pWidth;
			canvasElement.Width = pWidth;
		}
	});

	Object.defineProperty(that, "Height", {
		get: function()
		{
			return height;
		},
		set: function(pHeight)
		{
			height = pHeight;
			bounds.Height = pHeight;
			canvasElement.Height = pHeight;
		}
	});

	that.Emit("Entity.Create");

	return that;
}
