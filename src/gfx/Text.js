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

	var tempCanv = document.createElement("canvas");
	var ctx = tempCanv.getContext("2d");

	ctx.font = "24px Helvetica";

	var textSize = ctx.measureText(value);
	tempCanv.width = textSize.width;
	tempCanv.height = size + Math.floor(size / 2);

	ctx.fillStyle = color;
	ctx.font = "24px Helvetica";
	ctx.fillText(value, 0, size);

	var that = new Lynx.CanvasElement(0, 0, tempCanv.width, tempCanv.height, "Text");
	that.Texture = tempCanv;

	return that;
};