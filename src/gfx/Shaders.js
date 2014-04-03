/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    File Name: ShaderComponent.js
*    Description: The Lynx WebGL Shader Manager
*    Global Variables: Lynx.Shader
*/

Lynx.Shaders = (function(){
	var that = {};
	var shaders = {};

	that.Type = {
		Vertex: 0,
		Fragment: 1
	};

	that.Add = function(pShader)
	{
		if(shaders.hasOwnProperty(pShader.Name))
			return false;

		shaders[pShader.Name] = pShader;
		Lynx.Emit("Shaders.Add", pShader);
	}

	that.Remove = function(pName)
	{
		if(shaders.hasOwnProperty(pName))
			shaders[pName] = null;
	}

	that.Get = function(pName)
	{
		if(shaders.hasOwnProperty(pName))
			return shaders[pName];

		return false;
	}

	return that;
})();