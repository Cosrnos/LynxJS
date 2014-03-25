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

function LynxLibrary ()
{
	//Private variables
	var that = {};

	var loadStatus = 0;
	var loadTotal = 0;

	var onLibraryLoad = function(){ };

	//Properties
	that.Filepath = "src/";
	that.LogTarget = "";
	that.Main = {};
	that.Paused = false;

	/**
	* Description: Loads the Lynx JS Library
	*
	* @this {LynxLibrary}
	* @param {callback} <pOnLibraryLoad> Callback to be executed on load completion
	*/
	that.Load = (function(pOnLibraryLoad)
	{
		this.Filepath = "src/";
		onLibraryLoad = pOnLibraryLoad;
		loadCore();
	}).bind(that);

	/**
	* Description: Starts the internal animation and update threads
	*
	* @this {LynxLibrary}
	*/
	that.Start = (function()
	{
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

	var loadCore = (function()
	{
		//Load base files
		load("Logger.js");
		load("EventEmitter.js");
		load("EventListener.js");
		load("Object.js");
		load("Component.js");
		load("ComponentManager.js");
		load("AssetManager.js");
		load("Canvas.js");
		load("CanvasElement.js");
		load("Thread.js");
		load("Animator.js");

		//Load Geometry classes.
		load("Geometry/Point.js");
		load("Geometry/Line.js");
		load("Geometry/Rectangle.js");
		load("Geometry/Circle.js");
	}).bind(that);

	/**
	* Description: Called when a file is finished loading
	*
	* @this {LynxLibrary}
	* @param {window.event} <ev> The event paramater passed by default
	*/
	var loadCallback = (function(ev)
	{
		loadStatus++;
		checkLoadStatus();
	}).bind(that);

	/**
	* Description: Checks whether the core is finished loading or not
	*   and initializes required components if it is.
	*
	* @this {LynxLibrary}
	*/
	var checkLoadStatus = (function()
	{
		if(loadStatus >= loadTotal)
		{
			initializeEngine();
			onLibraryLoad();
		}
	}).bind(that);

	/**
	* Description: Initializes threads
	*
	* @this {LynxLibrary}
	*/
	var initializeEngine = (function()
	{
		//Utils
		console.log = function(pMessage)
		{
			Lynx.Log(pMessage);
		}

		console.error = console.debug = console.info = console.log;

		window.onerror = function (message, file, line, position, error) {
		    Lynx.Log("An error was encountered in "+file+" at line "+line+":"+position+". \""+error+"\"", "Error");
		    Lynx.Emit("Core.Error", this);
		};

		//Threads
		this.Main = new Lynx.Thread("Main");
		this.Main.On("_threadUpdateMain",function(pSender){
			if(!Lynx.DocumentHidden()){
				Lynx.Emit("Update",pSender);
				Lynx.Paused = false;
			}
			else
			{
				Lynx.Emit("Paused", pSender);
				Lynx.Paused = true;
			}
		});
	}).bind(that);

	/**
	* Description: Adds a file to the load queue
	*
	* @this {LynxLibrary}
	* @param {String} <pFilepath> location of the file to load
	* @param {bool} <pUseDefault> whether to append the base filepath to the beginning of the provided file
	*/
	var load = (function(pFilepath, pUseDefault)
	{
		pUseDefault = pUseDefault || true;
		var c = document.createElement("script");
		c.type = "text/javascript";
		c.async = false;
		c.addEventListener("load", loadCallback.bind(this), false);
		c.src = this.Filepath + pFilepath;
		document.body.appendChild(c);
		loadTotal++;
	}).bind(that);

	/**
	* Description: returns whether the page is visible and updatable
	*
	* @this {LynxLibrary}
	*/
	that.DocumentHidden = function(){
		return document.hidden || document.msHidden || document.webkitHidden || document.mozHidden;
	}

	return that;
}

var Lynx = new LynxLibrary();
