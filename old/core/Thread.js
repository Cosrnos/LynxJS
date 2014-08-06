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

Lynx.Thread = function (pName) {
	var that = new Lynx.Object();

	var name = pName;
	var lastUpdate = Date.now();
	var intervId = null;

	that.Delta = 0;
	that.Name = name;
	that.Running = false;

	Lynx.Emitter.Define("_threadUpdate" + this.Name);

	/**
	 * Description: Sets an update callback for the thread
	 *
	 * @this {Lynx.Thread}
	 * @param {Callback} <pCallback> callback to execute on an update
	 */
	that.OnUpdate = (function (pCallback) {
		this.On("_threadUpdate" + this.Name, pCallback);
	}).bind(that);

	/**
	 * Description: Starts the thread update
	 *
	 * @this {Lynx.Thread}
	 * @param {int} <pInterval> amount of time in milliseconds to wait between each update
	 */
	that.Start = (function (pInterval) {
		pInterval = pInterval || (1000 / 60);

		if (!intervId) {
			that.Delta = 0;
			that.lastUpdate = Date.now();
			that.Running = true;
			intervId = window.setInterval(that._threadUpdate, pInterval);
			Lynx.Log("Starting " + that.Name + " Thread...");
		}
	}).bind(that);

	/**
	 * Description: Stops the thread update
	 *
	 * @this {Lynx.Thread}
	 */
	that.Stop = (function () {
		if (intervId !== null) {
			window.clearInterval(intervId);
			that.Running = false;
		}
	}).bind(that);

	/**
	 * Description: Updates the thread and emits the event
	 *
	 * @this {Lynx.Thread}
	 */
	if (Lynx.Debug) {
		that._threadUpdate = (function () {
			if (that.Running === false) {
				that.Stop();
			}

			console.time("Lynx-thread-update-#" + this.Name);

			that.Delta = Date.now() - lastUpdate;
			Lynx.Emit("_threadUpdate" + that.Name, that);
			lastUpdate = Date.now();

			console.timeEnd("Lynx-thread-update-#" + this.Name);
		}).bind(that);
	} else {
		that._threadUpdate = (function () {
			if (that.Running === false) {
				that.Stop();
			}

			that.Delta = Date.now() - lastUpdate;
			Lynx.Emit("_threadUpdate" + that.Name, that);
			lastUpdate = Date.now();
		}).bind(that);
	}

	Lynx.Emit("Thread.Create", that);

	return that;
};

Lynx.T = function () {
	return new Lynx.Thread();
};
