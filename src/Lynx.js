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
	//Public Methods

	/// Load
	/// Description:
	///  Loads the library and associated files
	/// @pASyncCallback: A callback that is called once the load is completed
	/// #returns - None
	that.Load = function(pLibPath, pOnLibraryLoad)
	{
		console.log("Attempting load");
		this.Filepath = pLibPath;
		onLibraryLoad = pOnLibraryLoad;

		loadCore();
	};

	//Internal Methods
	function loadCore()
	{
		//Load all files
		load(this.FilePath + "EventEmitter.js");
		load(this.FilePath + "EventListener.js");
		load(this.FilePath + "Object.js");
	}

	function loadCallback()
	{
		loadStatus++;
		checkLoadStatus();
	}

	function checkLoadStatus()
	{
		if(loadStatus >= loadTotal)
		{
			onLibraryLoad();
		}
	}

	function load(pFilepath)
	{
		var c = document.createElement("script");
		c.type = "text/javascript";
		c.href = pFilepath;
		c.addEventListener("load", loadCallback);

		document.body.appendChild(c);
		loadTotal++;
	}


	return that;
}

var Lynx = new LynxLibrary();