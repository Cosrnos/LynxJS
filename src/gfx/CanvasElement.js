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

Lynx.CanvasElement = function (pX, pY, pWidth, pHeight, pElementType) {
	var that = new Lynx.Object();

	var objectColor = {
		Hex: -1,
		R: -1,
		G: -1,
		B: -1
	};

	var objectTexture = null;
	var currentFrame = -1;
	var frameInterval = 4;

	that.X = pX;
	that.Y = pY;
	that.Width = pWidth;
	that.Height = pHeight;
	that.Type = pElementType;
	that.Layer = 0;

	/**
	 * Description: Translates the element to the given coordinates
	 *
	 * @this {Lynx.CanvasElement}
	 */
	that.Translate = (function (pX, pY) {
		if (isNaN(pX) || isNaN(pY)) {
			return false;
		}
		this.X = pX;
		this.Y = pY;
	}).bind(that);

	/**
	 * Description: Moves the element by the given coordinates
	 *
	 * @this {Lynx.CanvasElement}
	 */
	that.Move = (function (pX, pY) {
		if (isNaN(pX) || isNaN(pY)) {
			return false;
		}
		this.X += pX;
		this.Y += pY;
	}).bind(that);

	/**
	 * Description: A property for the objects color.
	 *
	 * @this {Lynx.CanvasElement}
	 */
	Object.defineProperty(that, "Color", {
		get: function () {
			return objectColor;
		},
		set: function (pValue) {
			if (typeof pValue === 'number' && pValue % 1 === 0 && pValue > -1) {
				objectColor = {
					Hex: pValue,
					R: ((pValue >> 16) & 0xFF) / 255,
					G: ((pValue >> 8) & 0xFF) / 255,
					B: ((pValue & 0xFF)) / 255
				};
			} else {
				Lynx.Warning("Could not set color of object to " + pValue + " as it is not a whole, positive integer.");
			}
		}
	});

	/**
	 * Description: A property for the objects texture. Returns false if not set.
	 *
	 * @this {Lynx.CanvasElement}
	 */
	Object.defineProperty(that, "Texture", {
		get: function () {
			if (!objectTexture) {
				return false;
			}

			if (objectTexture instanceof Array) {
				return objectTexture[Math.floor(currentFrame / frameInterval) % objectTexture.length];
			}

			return objectTexture;
		},
		set: function (pImage) {
			if (pImage instanceof Image || pImage instanceof WebGLTexture) {
				objectTexture = pImage;
				currentFrame = -1;
			} else if (pImage instanceof Array) {
				objectTexture = pImage;
				currentFrame = 0;
			} else {
				Lynx.Log(typeof pImage);
			}
		}
	});

	/**
	 * Description: The interval at which to change the texture if the provided texture is an array.
	 *
	 * @this {Lynx.CanvasElement}
	 */
	Object.defineProperty(that, "FrameInterval", {
		get: function () {
			return frameInterval;
		},
		set: function (pValue) {
			if (isNaN(pValue)) {
				return;
			}

			frameInterval = pValue;
		}
	});

	/**
	 * Description: Draws the object to the canvas with a provided 2d Context.
	 *
	 * @remarks See Lynx.CanvasElement.GetVertices for the WebGL Default
	 * @this {Lynx.CanvasElement}
	 * @param {HTMLCanvasElement} <pBuffer> Canvas buffer to draw upon
	 */
	that.Draw = (function (context, pC) {
		if (objectTexture instanceof Image || objectTexture instanceof Array) {
			context.drawImage(this.Texture, this.X - pC.X, this.Y - pC.Y, this.Width, this.Height);
		} else {
			context.fillRect(this.X - pC.X, this.Y - pC.Y, this.Width, this.Height);
		}
		return true;
	}).bind(that);

	/**
	 * Description: Pushes the objects vertices to the given array to be drawn by the WebGL Context.
	 *
	 * @remarks Only works with a rect
	 * @this {Lynx.CanvasElement}
	 * @param {HTMLCanvasElement} <pBuffer> Canvas buffer to draw upon
	 */
	that.GetVertices = (function (pBuildArray, pC) {
		var x1 = this.X - pC.X;
		var y1 = this.Y - pC.Y;
		var x2 = this.X + this.Width - pC.X;
		var y2 = this.Y + this.Height - pC.Y;

		pBuildArray.push(
			x1, y1,
			x1, y2,
			x2, y2,
			x2, y2,
			x2, y1,
			x1, y1
		);
	}).bind(that);

	//Event Callbacks
	that.On("requestAnimationFrame", function (pBuffer) {
		if (objectTexture instanceof Array) {
			currentFrame++;
		}
		return true;
	});

	Lynx.Emit("CanvasElement.Create", that);

	return that;
};

Lynx.CE = function (pX, pY, pWidth, pHeight, pElementType) {
	return new Lynx.CanvasElement(pX, pY, pWidth, pHeight, pElementType);
};
