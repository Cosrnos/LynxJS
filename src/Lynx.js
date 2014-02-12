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
	//Public Methods

	/// Load
	/// Description:
	///  Loads the library and associated files
	/// @pASyncCallback: A callback that is called once the load is completed
	/// #returns - None
	that.Load = function(pOnLibraryLoad)
	{
		this.Filepath = "src/";
		onLibraryLoad = pOnLibraryLoad;
		this._loadCore();
	};

	that.Start = function()
	{
		that.Main.Start();
		that.Animator.Start();
		Lynx.Emit("Core.Ready");
	};

	//Internal Methods
	that._loadCore = function()
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

	that._loadCallback = function(event)
	{
		loadStatus++;
		that._checkLoadStatus();
	}

	that._checkLoadStatus = function()
	{
		if(loadStatus >= loadTotal)
		{
			Lynx.Main = new Lynx.Thread("Main");
			Lynx.Main.On("_threadUpdateMain",function(pSender){
				Lynx.Emit("Update",pSender);
			});
			onLibraryLoad();
		}
	}

	function load(pFilepath)
	{
		var c = document.createElement("script");
		c.type = "text/javascript";
		c.async = false;
		c.addEventListener("load", that._loadCallback, false);
		c.src = pFilepath;
		document.body.appendChild(c);
		loadTotal++;
	}


	return that;
}

var Lynx = new LynxLibrary();
