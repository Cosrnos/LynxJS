/*
 *    Lynx Project
 *    Started August 2013
 *    ------------------------------------------------------
 *    This file is covered under the LynxJS Game Library
 *    License. Please read license.txt for more information
 *    on usage of this library.
 *    ------------------------------------------------------
 *    File Name: Text.js
 *    Description: A drawable element on the canvas. Visual representation only.
 *    Global Variables: Lynx.CanvasElement(), Lynx.CE()
 */

Lynx.Text = function (pTextObj) {
	var value = "";
	var font = "Helvetica";
	var size = 24;
	var color = "#000000";

	if (pTextObj.hasOwnProperty("Value")) {
		value = pTextObj.Value;
	}

	if (pTextObj.hasOwnProperty("FontFamily")) {
		value = pTextObj.FontFamily;
	}

	if (pTextObj.hasOwnProperty("FontSize")) {
		size = pTextObj.FontSize;
	}

	if (pTextObj.hasOwnProperty("Color")) {
		color = pTextObj.Color;
	}

	var tempCanv = document.createElement("canvas");
	var ctx = tempCanv.getContext("2d");


	var that = new Lynx.CanvasElement(0, 0, tempCanv.width, tempCanv.height, "Text");
	that.Redraw = function () {
		ctx.font = size + "px " + font;

		var textSize = ctx.measureText(value);
		tempCanv.width = textSize.width;
		tempCanv.height = size + Math.floor(size / 2);
		if (tempCanv.height % 2 !== 0) {
			tempCanv.height += 1;
		}

		if (tempCanv.width % 2 !== 0) {
			tempCanv.width += 1;
		}

		that.Width = tempCanv.width;
		that.Height = tempCanv.height;

		ctx.font = size + "px " + font;
		ctx.fillStyle = color;
		ctx.fillText(value, 0, size);
	};

	Object.defineProperty(that, "Value", {
		get: function () {
			return value;
		},
		set: function (pString) {
			value = pString;
			that.Redraw();
		}
	});

	Object.defineProperty(that, "FontFamily", {
		get: function () {
			return font;
		},
		set: function (pValue) {
			font = pValue;
			that.Redraw();
		}
	});

	Object.defineProperty(that, "FontSize", {
		get: function () {
			return size;
		},
		set: function (pValue) {
			size = pValue;
			that.Redraw();
		}
	});

	Object.defineProperty(that, "FontColor", {
		get: function () {
			return color;
		},
		set: function (pValue) {
			color = pValue;
			that.Redraw();
		}
	});

	that.Redraw();

	that.Texture = tempCanv;

	return that;
};
