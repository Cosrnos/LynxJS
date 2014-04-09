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
	that.AddEntity = function(pEntity)
	{
		pEntity.Parent = this;
		pEntity.CanvasElement.Layer = this.Index;
		entities.push(pEntity);
	};

	/**
	* Description: Removes an entity from the layer
	*
	* @this {Lynx.Layer}
	* @param {Lynx.Entity} <pEntity> The entity to remove
	*/	
	that.RemoveEntity = function(pEntity)
	{
		if(entities.indexOf(pEntity) > -1)
			entities.splice(entities.indexOf(pEntity), 1);
	};


	/**
	* Description: Adds an element to the layer
	*
	* @this {Lynx.Layer}
	* @param {Lynx.Element} <pElement> The Element to add
	*/	
	that.AddElement = function(pElement)
	{
		elements.push(pElement);
	};

	/**
	* Description: Removes an element from the layer
	*
	* @this {Lynx.Layer}
	* @param {Lynx.Element} <pElement> The Element to remove
	*/	
	that.RemoveElement = function(pElement)
	{
		if(elements.indexOf(pElement) > -1)
			elements.splice(elements.indexOf(pElement));
	};

	/**
	* Description: Gets all canvas elements from the layer
	*
	* @this {Lynx.Layer}
	* @return {Lynx.CanvasElement[]} An array of all the canvas elements on the layer
	*/
	that.GetDrawableObjects = function(pViewArea)
	{
		var toReturn = ([]).concat(elements);

		if(!pViewArea)
		{
			for(var i in entities)
				toReturn.push(entities[i].CanvasElement);
		}
		else
		{
			for(var i in entities)
			{
				var ex1 = entities[i].X;
				var ex2 = ex1 + entities[i].Width;
				var ey1 = entities[i].Y;
				var ey2 = ey1 + entities[i].Height;

				if(ex1 > pViewArea.X + pViewArea.Width || ex2 < pViewArea.X || ey1 > pViewArea.Y + pViewArea.Height || ey2 < pViewArea.Y)
					continue;

				toReturn.push(entities[i].CanvasElement);
			}
		}

		return toReturn;
	};

	return that;
}
