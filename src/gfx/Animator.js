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
*    Global Variables: Lynx.Animator{}
*/

Lynx.Animator = (function(pName){
	var that = new Lynx.Thread(pName);
	var lastUpdate = Date.now();

	Lynx.Emitter.Define("requestAnimationFrame");
	Lynx.Emitter.Define("_requestAnimationFrame"+this.Name);

	/**
	* Description: Starts the animation thread
	*
	* @this {Lynx.Animator}
	*/
	that.Start = (function()
	{
		if(!this.Running)
		{
			Lynx.Log("Starting Animation Thread...");
			this.Running = true;
			requestFrame(_threadUpdate);
		}
	}).bind(that);

	/**
	* Description: "Stops" the animation thread.
	*
	* @this {Lynx.Animator}
	*/
	that.Stop = (function()
	{
		this.Running = false;
		Lynx.Log("Stopping Animation Thread...");
	}).bind(that);

	/**
	* Description: The animation thread update primary callback
	*
	* @this {Lynx.Animator}
	*/
	if(Lynx.Debug)
	{
		var _threadUpdate = (function()
		{
			if(!this.Running)
			{
				Lynx.Log("Stopped Animation Thread.");
				return;
			}

			requestFrame(_threadUpdate);
			console.time("Lynx-animator-update-#"+this.Name);

			this.Delta = Date.now() - lastUpdate;
			Lynx.Emit("beforeRequestAnimationFrame", this);
			Lynx.Emit("__requestAnimationFrame"+this.Name, this);
			Lynx.Emit("requestAnimationFrame", this);
			Lynx.Emit("afterRequestAnimationFrame", this);
			lastUpdate = Date.now();

			console.timeEnd("Lynx-animator-update-#"+this.Name);
		}).bind(that);
	}
	else
	{
		var _threadUpdate = (function()
		{
			if(!this.Running)
			{
				Lynx.Log("Stopped Animation Thread.");
				return;
			}

			requestFrame(_threadUpdate);
			this.Delta = Date.now() - lastUpdate;
			Lynx.Emit("beforeRequestAnimationFrame", this);
			Lynx.Emit("__requestAnimationFrame"+this.Name, this);
			Lynx.Emit("requestAnimationFrame", this);
			Lynx.Emit("afterRequestAnimationFrame", this);
			lastUpdate = Date.now();
		}).bind(that);		
	}

	/**
	* Description: Initializes the proper window.requestAnimationFrame method
	*
	* @this {Lynx.Animator}
	* @return {Callback} Proper request animation frame or a settimeout callback
	*/
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