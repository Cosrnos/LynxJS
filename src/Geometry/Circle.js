/*
 *    Lynx Project
 *    Started August 2013
 *    ------------------------------------------------------
 *    This file is covered under the LynxJS Game Library
 *    License. Please read license.txt for more information
 *    on usage of this library.
 *    ------------------------------------------------------
 *    File Name: Circle.js
 *    Description: A Circle shape.
 *    Global Variables: Lynx.Circle
 */

Lynx.Circle = function (pX, pY, pRadius) {
	var that = {};

	that.Center = new Lynx.P(pX, pY);
	that.Radius = pRadius;

	/**
	 * Description: Provides the circle's circumference.
	 *
	 * @this {Lynx.Circle}
	 * @return {decimal} the circumference of the circle
	 */
	Object.defineProperty(that, "Circumference", {
		get: function () {
			return 2 * Math.PI * this.Radius;
		}
	});

	/**
	 * Description: Provides the circle's area.
	 *
	 * @this {Lynx.Circle}
	 * @return {decimal} the area of the circle
	 */
	Object.defineProperty(that, "Area", {
		get: function () {
			return Math.PI * this.Radius ^ 2;
		}
	});

	/**
	 * Description: Tests whether the given point is within the circle's bounds
	 *
	 * @this {Lynx.Circle}
	 * @param {Lynx.Point} <pPoint> The point to test
	 * @return {boolean} Whether or not the point is inside the circle.
	 */
	that.Contains = (function (pPoint) {
		return (Math.sqrt((this.Center.X - pPoint.X) ^ 2 + (this.Center.Y - pPoint.Y) ^ 2) <= this.Radius);
	}).bind(that);

	return that;
};
