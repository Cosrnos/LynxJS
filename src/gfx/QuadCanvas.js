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

Lynx.QuadCanvas = function(pIndex, pLimit, pMax, pBounds){
	var that = {};

	var objects = [];
	var nodes = [];
	var index = pIndex || 0;
	var limit = pLimit || 4;
	var max = pMax || 2;

	that.Bounds = pBounds;
	that.Canvas = new Lynx.Canvas(pBounds.Width, pBounds.Height);

	/**
	* Description: Splits the Quadtree into 4 separate nodes.
	*
	* @this {Lynx.Quadtree}
	*/	
	that.Split = function()
	{
		//We're assuming that the split is forced since the check for limit is already checked in the insert method.
		var newWidth = this.Bounds.X / 2;
		var newHeight = this.Bounds.Y / 2;
		nodes[0] = new Lynx.Quadtree(index+1, limit, new Lynx.Rect(this.Bounds.X, this.Bounds.Y, newWidth, newHeight));
		nodes[1] = new Lynx.Quadtree(index+1, limit, new Lynx.Rect(this.Bounds.X+newWidth, this.Bounds.Y, newWidth, newHeight));
		nodes[2] = new Lynx.Quadtree(index+1, limit, new Lynx.Rect(this.Bounds.X+newWidth, this.Bounds.Y+newHeight, newWidth, newHeight));
		nodes[3] = new Lynx.Quadtree(index+1, limit, new Lynx.Rect(this.Bounds.X, this.Bounds.Y+newHeight, newWidth, newHeight));
		//Rebuild Objects
		var tempObjects = objects; //Only need to clone internal objects since nodes are just now being created.

		this.Clear();

		for(var i in tempObjects)
			this.Insert(tempObjects[i]);
	}

	/**
	* Description: Inserts the object into the quadtree.
	*
	* @this {Lynx.Quadtree}
	* @param {Lynx.Rectangle} <pObject> the object to place into the tree.
	*/	
	that.Insert = function(pObject)
	{
		if(typeof nodes[0] != 'undefined')
		{
			for(var i = 0; i < 4; i++)
			{
				if(nodes[i].Contains(pObject))
				{
					nodes[i].Insert(pObject);
					return;
				}
			}
		}

		objects.push(pObject);
		if(this.objects.length > limit && index < max)
			this.Split();
	}

	/**
	* Description: Clears all objects and nodes.
	*
	* @this {Lynx.Quadtree}
	*/	
	that.Clear = function()
	{
		objects = [];

		if(typeof nodes[0] != 'undefined')
			for(var i = 0; i < 4; i++)
				nodes[i].Clear();

		nodes = [];
	}

	/**
	* Description: Splits the Quadtree into 4 separate nodes.
	*
	* @this {Lynx.Quadtree}
	* @param {Lynx.Rectangle} <pRect> An object to find the index of.
	* @return {int} Index of the node containing the object. If the object cannot be completely contained within the node, -1 is returned.
	*/	
	that.FindIndex = function(pRect)
	{
		if(typeof nodes[0] == 'undefined')
			return -1;

		for(var i = 0; i < 4; i++)
		{
			if(nodes[i].Contains(pRect))
				return i;
		}

		return -1;
	}

	/**
	* Description: Checks whether the object can be contained within the node's bounds.
	*
	* @this {Lynx.Quadtree}
	* @param {Lynx.Rectangle} <pRect> The object to test
	* @return {bool} if the node can contain the object.
	*/	
	that.Contains = function(pRect)
	{
		return (this.Bounds.X <= pRect.X && this.Bounds.Y <= pRect.Y && this.Bounds.Width >= pRect.Width && this.Bounds.Height >= pRect.Height);
	}

	/**
	* Description: Returns all objects and objects of child nodes.
	*
	* @this {Lynx.Quadtree}
	* @return {Lynx.Rectangle[]} an array containing all objects in the quadtree.
	*/
	that.GetAllObjects = function()
	{
		var toReturn = objects;
		if(typeof nodes[0] != 'undefined')
			for(var i = 0; i < 4; i++)
				toReturn.concat(nodes[i].GetChildObjects());

		return toReturn;
	}

	/**
	* Description: Returns all objects contained within the bounds of the given rectangle
	*
	* Remarks: Should probably be reworked to return all objects collidding with the given rectangle.
	*
	* @this {Lynx.Quadtree}
	* @param {Lynx.Rectangle} <pRect> The bounds of the area to find objects within.
	* @return {Lynx.Rectangle[]} an array containing all objects in the given area.
	*/
	that.GetInRegion = function(pRect)
	{
		var toReturn = [];
		var index = this.FindIndex(pRect);
		if(index != -1)
		{
			toReturn.push(nodes[index].GetInRegion(pRect));
		}

		//Test Super objects since they could collide? We need to decide what constitutes as in region, meaning only contained within or even remotely close to.
		for(var i in objects)
		{
			if(pRect.X <= objects[i] && pRect.Y <= objects[i] && pRect.Width >= objects[i] && pRect.Height >= objects[i])
				toReturn.push(objects[i]);
		}

		return toReturn;
	}

	return that;
};
