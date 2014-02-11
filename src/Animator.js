/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    File Name: Animator.js
*    Description: The main animation "Thread." All canvas elements should subscribe to this class
*    Global Variables: Lynx.Animator
*/

Lynx.Animator = (function(pName){
	var that = new Lynx.Thread(pName);
	var lastUpdate = Date.now();

	Lynx.Emitter.Define("requestAnimationFrame");
	Lynx.Emitter.Define("_requestAnimationFrame"+this.Name);


	that.Start = function(pInterval)
	{
		if(!that.Running)
		{
			Lynx.Log("Starting Animation Thread...");
			that.Running = true;
			requestFrame(that._threadUpdate);
		}
		else
			Lynx.Log(that.Running);
	}

	that.Stop = function()
	{
		that.Running = false;
		Lynx.Log("Stopping Animation Thread...");
	}

	that._threadUpdate = function()
	{
		if(!that.Running)
		{
			Lynx.Log("Stopped Animation Thread.");
			return;
		}

		requestFrame(that._threadUpdate);

		that.Delta = Date.now() - lastUpdate;
		Lynx.Emit("_requestAnimationFrame"+this.Name, this);
		Lynx.Emit("requestAnimationFrame", this);
		lastUpdate = Date.now();
	};

	var requestFrame = (function(){
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function( callback ){
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	return that;
})("Internal");