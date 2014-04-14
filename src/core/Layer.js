/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    File Name: Layer.js
*    Description: A layer in a Scene.
*    Global Variables: Lynx.Layer
*/

Lynx.Layer = function(pParent, pIndex)
{
	var that = new Lynx.Object();

	that.Parent = pParent;
	that.Index = pIndex;

	var entities = [];
	var elements = [];
	var drawObjects = [];

	Object.defineProperty(that, "Entities", {
		get: function(){ return entities; }
	});

	Object.defineProperty(that, "Elements", {
		get: function(){ return elements; }
	});

	/**
	* Description: Adds an entity to the layer
	*
	* @this {Lynx.Layer}
	* @param {Lynx.Entity} <pEntity> The entity to add
	*/	
	that.AddEntity = (function(pEntity)
	{
		pEntity.Parent = this;
		pEntity.CanvasElement.Layer = this.Index;
		entities.push(pEntity);
		drawObjects.push(pEntity.CanvasElement);
		drawObjects.sort(this.SortMethod);
	}).bind(that);

	/**
	* Description: Removes an entity from the layer
	*
	* @this {Lynx.Layer}
	* @param {Lynx.Entity} <pEntity> The entity to remove
	*/	
	that.RemoveEntity = function(pEntity)
	{
		if(entities.indexOf(pEntity) < 0)
			return;

		entities.splice(entities.indexOf(pEntity), 1);
		drawObjects.splice(drawObjects.indexOf(pEntity.CanvasElement), 1);
	};


	/**
	* Description: Adds an element to the layer
	*
	* @this {Lynx.Layer}
	* @param {Lynx.CanvasElement} <pElement> The Element to add
	*/	
	that.AddElement = function(pElement)
	{
		elements.push(pElement);
		drawObjects.push(pElement);
		drawObjects.sort(this.SortMethod);
	};

	/**
	* Description: Removes an element from the layer
	*
	* @this {Lynx.Layer}
	* @param {Lynx.CanvasElement} <pElement> The Element to remove
	*/	
	that.RemoveElement = function(pElement)
	{
		if(elements.indexOf(pElement) < 0)
			return;

		elements.splice(elements.indexOf(pElement), 1);
		drawObjects.splice(drawObjects.indexOf(pElement), 1);
	};

	/**
	* Description: Sorts and optimizes all drawable objects
	* 
	* @this {Lynx.Layer}
	* @param {Lynx.CanvasElement} <pA> the first element to test
	* @param {Lynx.CanvasElement} <pB> the second element to test
	* @return {int} Which element to use.
	*/
	that.SortMethod = function(pA, pB)
	{
		if(pA.Color.Hex == pB.Color.Hex)
			return 0;
		else if(pA.Color.Hex > pB.Color.Hex)
			return 1;

		return -1;
	};

	/**
	* Description: Gets all canvas elements from the layer
	*
	* @this {Lynx.Layer}
	* @return {Lynx.CanvasElement[]} An array of all the canvas elements on the layer
	*/
	that.GetDrawableObjects = function(pViewArea)
	{
		return drawObjects;
	};

	return that;
}
