/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    File Name: ComponentManager.js
*    Description: The component loader/manager for lynx
*    Note: Is this really necesarry? Consider moving into core.
*    Global Variables: Lynx.ComponentManager{}, Lynx.CM{}
*/

Lynx.ComponentManager = (function(){
	var that = new Lynx.Object();
	
	var components = [];
	var loadTotal = 0;
	var loaded = 0;

	that.Load = function(pComponentName)
	{
		load(Lynx.Filepath + "components/" + pComponentName + ".js");
	}

	that.Get = function(pComponentName)
	{
		if(typeof components[pComponentName] == 'undefined')
			return;

		return components[pComponentName];
	}

	that.Register = function(pComponentName, pComponentObject)
	{
		if(typeof components[pComponentName] != 'undefined')
		{
			Lynx.Emit("ComponentManager.Error.Duplicate", pComponentObject);
			return false;
		}

		components[pComponentName] = pComponentObject;
		Lynx.Emit("ComponentManager.Register", pComponentObject);
	}

	function load(pFilepath)
	{
		var c = document.createElement("script");
		c.type = "text/javascript";
		c.async = false;
		c.addEventListener("load", onload.bind(this), false);
		c.src = pFilepath;
		document.body.appendChild(c);
		loadTotal++;
	}

	function onload(event)
	{
		loaded++;
		if(loaded >= loadTotal)
			Lynx.Emit("ComponentManager.Ready", this);
	}

	return that;
})();

Lynx.CM = Lynx.ComponentManager;