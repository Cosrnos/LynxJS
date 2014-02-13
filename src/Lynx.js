/*
*    Lynx Project
*    Started August 2013
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
	that.Load = function(pOnLibraryLoad)
	{
		this.Filepath = "src/";
		onLibraryLoad = pOnLibraryLoad;
		this._loadCore();
	};

	/**
	* Description: Starts the internal animation and update threads
	*
	* @this {LynxLibrary}
	*/
	that.Start = function()
	{
		that.Main.Start();
		that.Animator.Start();
		Lynx.Emit("Core.Ready");
	};

	/**
	* Description: Loads the core objects
	*
	* @internal
	* @this {LynxLibrary}
	*/

	function loadCore = function()
	{
		//Load all files
		load(Lynx.Filepath + "Logger.js");
		load(this.Filepath + "EventEmitter.js");
		load(this.Filepath + "EventListener.js");
		load(this.Filepath + "Object.js");
		load(this.Filepath + "Component.js");
		load(this.Filepath + "ComponentManager.js");
		load(this.Filepath + "AssetManager.js");
		load(this.Filepath + "Canvas.js");
		load(this.Filepath + "CanvasElement.js");
		load(this.Filepath + "Thread.js");
		load(this.Filepath + "Animator.js");
	}

	/**
	* Description: Called when a file is finished loading
	*
	* @this {LynxLibrary}
	* @param {window.event} <ev> The event paramater passed by default
	*/
	function loadCallback = function(ev)
	{
		loadStatus++;
		checkLoadStatus();
	}

	/**
	* Description: Checks whether the core is finished loading or not
	*   and initializes required components if it is.
	*
	* @this {LynxLibrary}
	*/
	function checkLoadStatus = function()
	{
		if(loadStatus >= loadTotal)
		{
			initializeEngine();
			onLibraryLoad();
		}
	}

	/**
	* Description: Initializes threads
	*
	* @this {LynxLibrary}
	*/
	function initializeEngine()
	{
		Lynx.Main = new Lynx.Thread("Main");
		Lynx.Main.On("_threadUpdateMain",function(pSender){
			if(!documentHidden()){
				Lynx.Emit("Update",pSender);
				that.Paused = false;
			}
			else
			{
				Lynx.Emit("Paused", pSender);
				that.Paused = true;
			}
		});
	}

	/**
	* Description: Adds a file to the load queue
	*
	* @this {LynxLibrary}
	* @param {String} <pFilepath> location of the file to load
	*/
	function load(pFilepath)
	{
		var c = document.createElement("script");
		c.type = "text/javascript";
		c.async = false;
		c.addEventListener("load", loadCallback.bind(this), false);
		c.src = pFilepath;
		document.body.appendChild(c);
		loadTotal++;
	}

	/**
	* Description: returns whether the page is visible and updatable
	*
	* @this {LynxLibrary}
	*/
	function documentHidden(){
		return document.hidden || document.msHidden || document.webkitHidden || document.mozHidden;
	}

	return that;
}

var Lynx = new LynxLibrary();
