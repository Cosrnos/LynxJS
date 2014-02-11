/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    File Name: EventEmitter.js
*    Description: The central event processor in Lynx.
*    Global Variables: Lynx.EventListener()
*/

Lynx.EventListener = function(){
	var that = {};
	//Private Variables
	var events = [];
	//Properties

	//Public Methods
	that.Notify = function(pEvent, pSender)
	{
		if(typeof events[pEvent] == 'undefined')
			return true;

		var notifyNext = true;
		for(var i = 0; i < events[pEvent].length && notifyNext; i++)
			notifyNext = events[pEvent][i](pSender);
		return notifyNext;
	};

	that.On = function(pEvent, pCallback)
	{
		if(typeof events[pEvent] == 'undefined')
			events[pEvent] = [];

		events[pEvent].push(pCallback);
		Lynx.Emitter.Subscribe(pEvent, that);
	};

	return that;
};