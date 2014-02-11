/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    File Name: Thread.js
*    Description: The base of a Lynx "Thread"
*    Global Variables: Lynx.Thread
*/

Lynx.Thread = function(pName){
	var that = new Lynx.Object();
	//Private variables
	var name = pName;
	var lastUpdate = Date.now();
	var intervId = null;

	//Properties
	that.Delta = 0;
	that.Name = name;
	that.Running = true;

	that.OnUpdate = function(pCallback){ this.On("_threadUpdate"+this.Name, pCallback); };

	that.Start = function(pInterval)
	{
		if(intervId == null)
		{
			this.Running = true;
			intervId = window.setInterval(update, pInterval);
		}
	}

	that.Stop = function()
	{
		if(intervId != null)
		{
			window.clearInterval(intervId);
			this.Running = false;
		}
	}

	function threadUpdate = function()
	{
		if(this.Running = false)
			this.Stop();

		this.Delta = Date.now() - lastUpdate;
		Lynx.Emit("_threadUpdate"+this.Name, this);
		lastUpdate = Date.now();
	};

	return that;
};

Lynx.T = function(){ return new Lynx.Object(); };