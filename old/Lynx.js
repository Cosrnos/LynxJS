/*
 *    Lynx Project
 *    Started August 2013
 *    ------------------------------------------------------
 *    Below you will find the stupid bug counter. Please
 *    increment this if you spend a lot of time trying to
 *    fix a bug only to find it was something incredibly
 *    obvious.
 *
 *    Total Hours Wasted Fixing Stupid Bugs: 3
 *    ------------------------------------------------------
 *    This file is covered under the LynxJS Game Library
 *    License. Please read license.txt for more information
 *    on usage of this library.
 *    ------------------------------------------------------
 *    File Name: Lynx.js
 *    Description: The Main Libarary Loader
 *    Global Variables: Lynx
 */

var Lynx = (function() {
	//Private variables
	var that = {};

	var loadStatus = 0;
	var loadTotal = 0;

	var onLibraryLoad = function() {};

	var scene = null;

	//Properties
	that.Debug = false;
	that.DisableCache = false;
	that.Filepath = "src/";
	that.LogTarget = "";
	that.Main = {};
	that.Paused = false;
	that.DefaultContext = "2d";
	that.DisableWebGL = false;

	Object.defineProperty(that, "scene", {
		get: function() {
			return scene;
		},
		set: function(pScene) {
			scene.Unload();
			Lynx.Emit("Scene.Change"); //Loading screen can be set on this event
			pScene.Load(function() {
				scene = pScene;
			});
		}
	});

	/**
	 * Description: Loads the Lynx JS Library
	 *
	 * @this {LynxLibrary}
	 * @param {callback} <pOnLibraryLoad> Callback to be executed on load completion
	 */
	that.Load = (function(pOnLibraryLoad) {
		this.Filepath = "src/";
		onLibraryLoad = pOnLibraryLoad;
		loadCore();
	}).bind(that);

	/**
	 * Description: Starts the internal animation and update threads
	 *
	 * @this {LynxLibrary}
	 */
	that.Start = (function() {
		this.Main.Start();
		this.Animator.Start();
		Lynx.Emit("Core.Ready");
	}).bind(that);

	/**
	 * Description: Loads the core objects
	 *
	 * @internal
	 * @this {LynxLibrary}
	 */

	var loadCore = (function() {
		//Core
		load("core/EventEmitter.js");
		load("core/EventListener.js");
		load("core/Object.js");
		load("core/Logger.js");
		load("core/Component.js");
		load("core/ComponentManager.js");
		load("core/AssetManager.js");
		load("core/Thread.js");
		load("core/Quadtree.js");
		load("core/Entity.js");
		load("core/Layer.js");
		load("core/SceneBuilder.js");

		//Load Geometry classes.
		load("geometry/Point.js");
		load("geometry/Line.js");
		load("geometry/Rectangle.js");
		load("geometry/Circle.js");

		//Load Visual classes.
		load("gfx/Animator.js");
		load("gfx/Shaders.js");
		load("gfx/ShaderComponent.js");
		load("gfx/Renderer.js");
		load("gfx/Canvas.js");
		load("gfx/CanvasElement.js");
		load("gfx/Text.js");
		load("gfx/Viewport.js");

	}).bind(that);

	/**
	 * Description: Called when a file is finished loading
	 *
	 * @this {LynxLibrary}
	 * @param {window.event} <ev> The event paramater passed by default
	 */
	var loadCallback = (function() {
		loadStatus++;
		checkLoadStatus();
	}).bind(that);

	/**
	 * Description: Checks whether the core is finished loading or not
	 *   and initializes required components if it is.
	 *
	 * @this {LynxLibrary}
	 */
	var checkLoadStatus = (function() {
		if (loadStatus >= loadTotal) {
			initializeEngine();
			onLibraryLoad();
		}
	}).bind(that);

	/**
	 * Description: Initializes threads
	 *
	 * @this {LynxLibrary}
	 */
	var initializeEngine = (function() {
		//Utils
		console.log = function(pMessage) {
			Lynx.Log(pMessage);
		};

		console.error = console.debug = console.info = console.log;

		window.onerror = function(message, file, line, position, error) {
			Lynx.Log("An error was encountered in " + file + " at line " + line + ":" + position + ". \"" + error + "\"", "Error");
			Lynx.Emit("Core.Error", this);
		};

		//Graphics
		detectGL();

		//Threads
		this.Main = new Lynx.Thread("Main");
		this.Main.On("_threadUpdateMain", function(pSender) {
			if (!Lynx.DocumentHidden) {
				Lynx.Emit("beforeUpdate", pSender);
				Lynx.Emit("Update", pSender);
				Lynx.Emit("afterUpdate", pSender);
				Lynx.Paused = false;
			} else {
				Lynx.Emit("Paused", pSender);
				Lynx.Paused = true;
			}
		});

		//Set up base scene
		this.Scene = new Lynx.SceneBuilder("lynx-default");
	}).bind(that);

	/**
	 * Description: Detects whether WebGL or 2D Canvas rendering should be used.
	 *
	 * @this {LynxLibrary}
	 */
	var detectGL = (function() {
		if (!(window.WebGLRenderingContext) || Lynx.DisableWebGL) { //Context doesn't exist, fallback to 2D.
			if (Lynx.Debug) {
				Lynx.Log("Info", "WebGL Rendering is either unsupported or disabled.");
			}
			return;
		}

		var contextNames = ["webgl", "experimental-webgl"];
		var ctx = null;
		for (var i = 0; i < contextNames.length; i++) {
			try {
				var c = document.createElement("canvas");
				ctx = c.getContext(contextNames[i]);
			} catch (ex) {}
			if (ctx) {
				this.DefaultContext = contextNames[i];
				break;
			}
		}
	}).bind(that);

	/**
	 * Description: Adds a file to the load queue
	 *
	 * @this {LynxLibrary}
	 * @param {String} <pFilepath> location of the file to load
	 * @param {bool} <pUseDefault> whether to append the base filepath to the beginning of the provided file
	 */
	var load = (function(pFilepath, pUseDefault) {
		pUseDefault = pUseDefault || true;
		var c = document.createElement("script");
		c.type = "text/javascript";
		c.async = false;
		c.addEventListener("load", loadCallback.bind(this), false);
		if (Lynx.DisableCache) {
			pFilepath = pFilepath + "?a=" + Date.now();
		}
		c.src = this.Filepath + pFilepath;
		document.body.appendChild(c);
		loadTotal++;
	}).bind(that);

	/**
	 * Description: returns whether the page is visible and updatable
	 *
	 * @this {LynxLibrary}
	 */
	Object.defineProperty(that, "DocumentHidden", {
		get: function() {
			return document.hidden || document.msHidden || document.webkitHidden || document.mozHidden;
		}
	});

	return that;
})();