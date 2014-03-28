/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    File Name: Quadtree.js
*    Description: A basic Quadtree
*    Global Variables: Lynx.Quadtree
*/

Lynx.Quadtree = function(pIndex, pLimit, pBounds){
	var that = {};

	var objects = [];
	var nodes = [];
	var index = pIndex || 0;
	var limit = pLimit || 1;

	that.Bounds = pBounds;

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
	}

	that.Clear = function()
	{
		objects = [];
		if(typeof nodes[0] != 'undefined')
			for(var i = 0; i < 4; i++)
				nodes[i].Clear();
	}

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

	that.Contains = function(pRect)
	{
		return (this.Bounds.X <= pRect.X && this.Bounds.Y <= pRect.Y && this.Bounds.Width >= pRect.Width && this.Bounds.Height >= pRect.Height);
	}

	that.GetAllObjects = function()
	{
		var toReturn = objects;
		if(typeof nodes[0] != 'undefined')
			for(var i = 0; i < 4; i++)
				toReturn.concat(nodes[i].GetChildObjects());

		return toReturn;
	}

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
}