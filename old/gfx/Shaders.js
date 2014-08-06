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

Lynx.Shaders = (function () {
	var that = {};
	var shaders = {};

	that.Type = {
		Vertex: 0,
		Fragment: 1
	};

	/**
	 * Description: Adds a shader to the Library.
	 *
	 * @this {Lynx.Shaders}
	 * @param {Lynx.ShaderComponent} <pShader> the shader to add
	 */
	that.Add = function (pShader) {
		if (shaders.hasOwnProperty(pShader.Name)) {
			return false;
		}

		shaders[pShader.Name] = pShader;
		Lynx.Emit("Shaders.Add", pShader);
	};

	/**
	 * Description: Removes a shader from the library
	 *
	 * @this {Lynx.Shaders}
	 * @param {string} <pName> the name of the shader to remove
	 */
	that.Remove = function (pName) {
		if (shaders.hasOwnProperty(pName))
			shaders[pName] = null;
	};


	/**
	 * Description: Gets the requested shader
	 *
	 * @this {Lynx.Shaders}
	 * @param {string} <pName> the name of the shader to return
	 * @return {Lynx.ShaderComponent|bool} the shader component or false if it doesn't exist.
	 */
	that.Get = function (pName) {
		if (shaders.hasOwnProperty(pName)) {
			return shaders[pName];
		}

		return false;
	};

	return that;
})();
