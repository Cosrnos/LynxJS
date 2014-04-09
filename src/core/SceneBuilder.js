/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    File Name: SceneBuilder.js
*    Description: A scene to be used by the engine.
*    Global Variables: Lynx.SceneBuilder
*/

Lynx.SceneBuilder = function(pName)
{
	var that = new Lynx.Object();

	that.Name = pName;
	that.Camera = { X: 0, Y: 0 };

	var layers = [ new Lynx.Layer(this, 0) ];

	Object.defineProperty(that, "Layers", {
		get: function()
		{
			return layers;
		}
	});

	/**
	* Description: Returns all entities within the scene.
	*
	* @this {Lynx.SceneBuilder}
	* @return {Lynx.Entity[]} The entities in the scene
	*/	
	Object.defineProperty(that, "Entities", {
		get: function()
		{
			var toReturn = [];

			for(var i = 0; i < layers.length; i++)
				toReturn.concat(layers[i].Entities);

			return toReturn;
		}
	});

	/**
	* Description: Returns all canvas elements within the scene
	*
	* @this {Lynx.SceneBuilder}
	* @return {Lynx.CanvasElement[]} An array of canvas elements to draw
	*/	
	that.GetDrawableObjects = function(pViewArea)
	{
		var toReturn = [];

			for(var i = 0; i < layers.length; i++)
				toReturn = toReturn.concat(layers[i].GetDrawableObjects(pViewArea));

		return toReturn;
	};

	/**
	* Description: Adds a new layer to the scene
	*
	* @this {Lynx.SceneBuilder}
	* @return {Lynx.Layer} The added layer
	*/
	that.AddLayer = function()
	{
		layers.push(new Lynx.Layer(this, layers.length));

		return layers[layers.length-1];
	};

	/**
	* Description: Removes the layer with the given index from the scene
	*
	* @this {Lynx.SceneBuilder}
	* @param {int} <pIndex> The layer index to remove
	*/		
	that.RemoveLayer = function(pIndex)
	{
		if(pIndex < layers.length)
			layers.splice(pIndex, 1);
	};	

	/**
	* Description: Adds an entity to the topmost layer of the scene
	*
	* @this {Lynx.SceneBuilder}
	* @param {Lynx.Entity} <pEntity> The entity to add
	*/	
	that.AddEntity = function(pEntity)
	{
		layers[layers.length-1].AddEntity(pEntity);
	};

	/**
	* Description: Called by the engine when the scene is initially being Opened
	*
	* @this {Lynx.SceneBuilder}
	* @param {Function} <pCallback> A callback that finishes changing the scene. Use this when ready to start the scene.
	*/	
	that.Load = function(pCallback)
	{
		pCallback();
	};

	/**
	* Description: Called by the engine when a scene is being ended
	*
	* @this {Lynx.SceneBuilder}
	*/	
	that.Unload = function()
	{

	};

	return that;
}
