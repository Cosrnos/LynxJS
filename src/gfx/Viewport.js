/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    File Name: Viewport.js
*    Description: A viewport, or camera for the game. Returns a modified Canvas buffer to operate on.
*    Global Variables: Lynx.Viewport()
*/

Lynx.Viewport = function(pId){
	var parent = document.getElementById(pId);
	var that = new Lynx.Canvas(parent.clientWidth, parent.clientHeight);
	
	var internalId = 1000 + Math.floor(Math.random()*8999);

	Object.defineProperty(that, "Id", { get: function(){ return "lynx-viewport-"+internalId; } });

	//And just in case...
	while(document.getElementById(that.Id) != null)
		internalId = 1000 + Math.floor(Math.random()*8999);

	that.Element.id = that.Id;

	parent.appendChild(that.Element);

	that.ParseMousePosition = function(pX, pY)
	{
		var cPos = that.Element.getBoundingClientRect();
		return {X: Math.floor(pX - cPos.left), Y: Math.floor(pY - cPos.top)};
	}

	that.Renderer.RefreshContext();

	if(document.getElementById(that.Id) == null)
		throw "Failed to bind Viewport to DOM Object with ID "+pId+". Either the object doesn't exist or something else is afoot.";

	return that;
};
