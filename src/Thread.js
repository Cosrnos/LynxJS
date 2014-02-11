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
	that.Running = false;

	Lynx.Emitter.Define("_threadUpdate"+this.Name);

	that.OnUpdate = function(pCallback){ this.On("_threadUpdate"+this.Name, pCallback); };

	that.Start = function(pInterval)
	{
		if(intervId == null)
		{
			that.Delta = 0;
			that.lastUpdate = Date.now();
			that.Running = true;
			intervId = window.setInterval(that._threadUpdate, pInterval);
			Lynx.Log("Starting "+that.Name+" Thread...");
		}
	}

	that.Stop = function()
	{
		if(intervId != null)
		{
			window.clearInterval(intervId);
			that.Running = false;
		}
	}

	that._threadUpdate = function()
	{
		if(that.Running == false)
			that.Stop();

		that.Delta = Date.now() - lastUpdate;
		Lynx.Emit("_threadUpdate"+that.Name, that);
		lastUpdate = Date.now();
	};

	return that;
};

Lynx.T = function(){ return new Lynx.Thread(); };