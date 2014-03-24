/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    File Name: Line.js
*    Description: Two points on the Lynx Map. Actually a Line Segment
*    Global Variables: Lynx.Line, Lynx.L
*/

Lynx.Line = function(pA, pB){
	var that = {};

	that.A = pA;
	that.B = pB;

	/**
	* Description: Finds the Length of the line Segment
	*
	* @this {Lynx.Line}
	* @return {int} the Length of the segment.
	*/
	Object.defineProperty(that, "Length", {
		get: function(){
			return Math.sqrt((that.A.X - that.B.X)^2 + (that.A.Y - that.B.Y)^2);
		}
	});

	/**
	* Description: Finds the Slope of the line
	*
	* @this {Lynx.Line}
	* @return {int} The Slope of the line
	*/
	Object.defineProperty(that, "Slope", {
		get: function(){
			if(this.A.X == this.B.X)
				return Infinity;
			if(this.A.Y == this.B.Y)
				return 0;
			if(this.A.X > this.B.X)
				return ((this.B.Y - this.A.Y)/(this.B.X - this.A.X));

			return ((this.A.Y - that.B.Y)/(that.A.X - this.B.X));
		}
	});

	/**
	* Description: Finds the Y Intercept of the line
	*
	* @this {Lynx.Line}
	* @return {int} Y Intercept value
	*/		
	Object.defineProperty(that, "Intercept", {
		get: function(){
			return (this.A.Y - (this.Slope * this.A.X));
		}
	})

	/**
	* Description: Tests whether a given point lies on the line segment
	*
	* @this {Lynx.Line}
	* @param {Lynx.Point} <pPoint> The point to test
	* @return {boolean} Whether or not the point is on the line segment.
	*/		
	that.IsOnLine = (function(pPoint)
	{
		if(this.A.X < this.B.X)
		{
			if(!(this.A.X <= pPoint.X && this.B.X >= pPoint.X))
				return false;
		}
		else
		{
			if(!(this.A.X >= pPoint.X && this.B.X <= pPoint.X))
				return false;
		}

		if(this.A.Y < this.B.Y)
		{
			if(!(this.A.Y <= pPoint.Y && this.B.Y >= pPoint.Y))
				return false;
		}
		else
		{
			if(!(this.A.Y >= pPoint.Y && this.B.Y <= pPoint.Y))
				return false;
		}

		//Definitely in bounds, now let's make sure it's on the line itself.
		return (pPoint.Y == (this.Slope * pPoint.X + this.Intercept));
	}).bind(that);
}

Lynx.L = function(pX, pY){ return Lynx.Line(pX, pY); }
