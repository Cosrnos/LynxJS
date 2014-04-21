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
 *    Global Variables: Lynx.ComponentManager{}, Lynx.CM{}
 */

Lynx.ComponentManager = (function () {
	var that = new Lynx.Object();

	var components = {};
	var loadTotal = 0;
	var loaded = 0;

	/** Description: Loads the given components to the manager
	 *
	 * @this {Lynx.ComponentManager}
	 * @param {String[]} <arguments[]> Component names to load: (filename).js
	 */
	that.Load = (function () {
		loadTotal += arguments.length;

		for (var i = 0; i < loadTotal; i++) {
			load(Lynx.Filepath + "components/" + arguments[i] + ".js");
		}
	}).bind(that);

	/** Description: Fetches the given component or false.
	 *
	 * @this {Lynx.ComponentManager}
	 * @param {String} <pComponentName> Name of component to load
	 * @return {Lynx.Component||bool} Component object or false if not in manager.
	 */
	that.Get = (function (pComponentName) {
		if (typeof components[pComponentName] == 'undefined') {
			return false;
		}

		return components[pComponentName];
	}).bind(that);

	/** Description: Registers the component object with the name to the manager
	 *
	 * @this {Lynx.ComponentManager}
	 * @param {String} <pComponentName> name to reference the component by.
	 * @param {Lynx.Component} <pComponentObject> component to register
	 * @return {bool} Whether registration was successful or not.
	 */
	that.Register = function (pComponentName, pComponentObject) {
		if (typeof components[pComponentName] != 'undefined') {
			Lynx.Emit("ComponentManager.Error.Duplicate", pComponentObject);
			return false;
		}

		components[pComponentName] = pComponentObject;
		Lynx.Emit("ComponentManager.Register", pComponentObject);
		return true;
	};

	/** Description: Loads the given component
	 *
	 * @this {LynxLibrary}
	 * @param {String} <pFilepath> location of the component to load
	 */
	function load(pFilepath) {
		var c = document.createElement("script");
		c.type = "text/javascript";
		c.async = true;
		c.addEventListener("load", onload.bind(that), false);
		if (Lynx.DisableCache) {
			pFilepath = pFilepath + "?a=" + Date.now();
		}

		c.src = pFilepath;
		document.body.appendChild(c);
	}

	/** Description: The callback for a component file to finish loading.
	 *
	 * @this {LynxLibrary}
	 * @param {window.event} <event> window event object.
	 */
	function onload() {
		loaded++;
		if (loaded >= loadTotal) {
			Lynx.Emit("ComponentManager.Ready", that);
		}
	}

	return that;
})();

Lynx.CM = Lynx.ComponentManager;
