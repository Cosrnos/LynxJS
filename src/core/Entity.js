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

Lynx.Entity = function () {
	var that = new Lynx.Object();

	that.Parent = null;
	that.Species = "Generic";

	//Construct
	var x = 0,
		y = 0,
		width = 1,
		height = 1;

	if (arguments.length < 1) {
		return Lynx.Warning("A ghost entity has been created, please make sure to initialize all entities to avoid conflicts.");
	}

	var pArg = arguments;

	if (Object.prototype.toString.call(arguments[0]) == "[object Arguments]") {
		pArg = arguments[0];
	}

	if (pArg[0] instanceof Image) {
		width = pArg[0].width;
		height = pArg[0].height;
	} else {
		if (typeof pArg[0] === 'number') {
			x = pArg[0];
			y = pArg[1];

			if (pArg.length == 4) {
				width = pArg[2];
				height = pArg[3];
			}
		}
	}

	//Properties
	var canvasElement = new Lynx.CE(x, y, width, height, "entity");
	var bounds = new Lynx.Rect(x, y, width, height);

	if (pArg[0] instanceof Image) {
		canvasElement.Texture = pArg[0];
	}

	Object.defineProperty(that, "CanvasElement", {
		get: function () {
			return canvasElement;
		}
	});

	Object.defineProperty(that, "Bounds", {
		get: function () {
			return bounds;
		}
	});

	/**
	 * Description: Returns/Updates all associated X Positions within the Entity
	 *
	 * @this {Lynx.Entity}
	 */
	Object.defineProperty(that, "X", {
		get: function () {
			return x;
		},
		set: function (pX) {
			if (isNaN(pX)) {
				return;
			}

			x = pX;
			bounds.X = pX;
			canvasElement.X = pX;
		}
	});

	/**
	 * Description: Returns/Updates all associated Y Positions within the Entity
	 *
	 * @this {Lynx.Entity}
	 */
	Object.defineProperty(that, "Y", {
		get: function () {
			return y;
		},
		set: function (pY) {
			y = pY;
			bounds.Y = pY;
			canvasElement.Y = pY;
		}
	});

	/**
	 * Description: Returns/Updates all associated Widths within the Entity
	 *
	 * @this {Lynx.Entity}
	 */
	Object.defineProperty(that, "Width", {
		get: function () {
			return width;
		},
		set: function (pWidth) {
			width = pWidth;
			bounds.Width = pWidth;
			canvasElement.Width = pWidth;
		}
	});

	/**
	 * Description: Returns/Updates all associated Heights within the Entity
	 *
	 * @this {Lynx.Entity}
	 */
	Object.defineProperty(that, "Height", {
		get: function () {
			return height;
		},
		set: function (pHeight) {
			height = pHeight;
			bounds.Height = pHeight;
			canvasElement.Height = pHeight;
		}
	});

	/**
	 * Description: Easy accessor for CanvasElement.Color
	 *
	 * @this {Lynx.Entity}
	 */
	Object.defineProperty(that, "Color", {
		get: function () {
			return canvasElement.Color;
		},
		set: function (pValue) {
			canvasElement.Color = pValue;
		}
	});

	Lynx.Emit("Entity.Create");

	return that;
};

Lynx.E = function () {
	return Lynx.Entity(arguments);
};
