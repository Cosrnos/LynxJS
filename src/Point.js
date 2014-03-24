/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    File Name: Point.js
*    Description: A point in the Lynx Map. Not neccesarily related to a canvas object.
*    Global Variables: Lynx.Point, Lynx.P
*/

Lynx.Point = function(pX, pY){
	return {
		X: pX,
		Y: pY,

		/**
		* Description: Moves the point to another point.
		*
		* @this {Lynx.Point}
		* @param {int} <pX> new X Position
		* @param {int} <pY> new Y Position
		*/
		Translate: function(pX, pY){
			this.X = pX;
			this.Y = pY;
		}
	}
}

Lynx.P = function(pX, pY){ return Lynx.Point(pX, pY); }
