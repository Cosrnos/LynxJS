/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    File Name: QuadCanvas
*    Description: A Quadtree/Canvas hybrid. Literally a quadtree with a Canvas object.
*    Global Variables: Lynx.QuadCanvas()
*/

Lynx.QuadCanvas = function(pIndex, pLimit, pBounds){
	var that = new Lynx.Quadtree(pIndex, pLimit, pBounds);
	
	that.Canvas = new Lynx.Canvas(pBounds.Width, pBounds.Height);

	that.Split = ((function(pOld, pIndex, pLimit, pBounds){
		pOld(pIndex, pLimit, pBounds);
		this.Canvas = new Lynx.Canvas(pBounds.Width, pBounds.Height);
	}).bind(that))(that.Split);

	return that;
};
