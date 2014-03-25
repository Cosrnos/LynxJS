/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    File Name: Rectangle.js
*    Description: A Rectangle shape.
*    Notes: The given point (pX, pY) is always the TOP LEFT point, just like any other object in HTML5
*    Global Variables: Lynx.Rectangle, Lynx.Rect
*/

Lynx.Rectangle = function(pX, pY, pWidth, pHeight){
	var that = {};

	that.Points = {
		TopLeft: new Lynx.P(pX, pY),
		TopRight: new Lynx.P(pX+pWidth, pY),
		BottomRight: new Lynx.P(pX+pHeight, pY),
		BottomLeft: new Lynx.P(pX+pHeight, pY)
	}; //Should rename these since they could be transformed elsewhere.

	that.Lines = {
		North: new Lynx.L(that.Points.TopLeft, that.Points.TopRight),
		East: new Lynx.L(that.Points.TopRight, that.Points.BottomRight),
		South: new Lynx.L(that.Points.BottomLeft, that.Points.BottomRight),
		West: new Lynx.L(that.Points.TopLeft, that.Points.BottomLeft)
	};

	/**
	* Description: Finds the Width of the rectangle
	*
	* @this {Lynx.Rectangle}
	* @return {decimal} The width
	*/
	Object.defineProperty(that, "Width", {
		get: function(){
			return this.Lines.North.Length;
		}
	});

	/**
	* Description: Finds the height of the rectangle
	*
	* @this {Lynx.Rectangle}
	* @return {decimal} The height
	*/
	Object.defineProperty(that, "Height", {
		get: function(){
			return this.Lines.East.Length;
		}
	});
	
	/**
	* Description: Finds the area of the rectangle
	*
	* @this {Lynx.Rectangle}
	* @return {decimal} The area
	*/
	Object.defineProperty(that, "Area", {
		get: function(){
			return this.Width * this.Height;
		}
	});

	/**
	* Description: Finds the perimeter of the rectangle
	*
	* @this {Lynx.Rectangle}
	* @return {decimal} The perimeter
	*/
	Object.defineProperty(that, "Perimeter", {
		get: function(){
			return this.Width * 2 + this.Height * 2;
		}
	});

	/**
	* Description: Tests whether a given point lies on the line segment
	*
	* @this {Lynx.Rectangle}
	* @param {Lynx.Point} <pPoint> The point to test
	* @return {boolean} Whether or not the point is inside the rectangle.
	*/
	that.Contains = (function(pPoint)
	{
		return (pPoint.X >= this.Points.BottomLeft.X && pPoint.Y >= this.Points.BottomLeft.Y
			&& pPoint.X <= this.Points.TopRight.X && pPoint.Y <= this.Point.TopRight.Y);
	}).bind(that);

	return that;
}

Lynx.Rect = function(pX, pY, pWidth, pHeight){ return Lynx.Rectangle(pX, pY, pWidth, pHeight); }
