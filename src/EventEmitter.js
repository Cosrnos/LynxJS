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
*    Global Variables: Lynx.EventEmitter(), Lynx.Emitter{}, Lynx.Emit(pEvent, pSender)
*/

Lynx.EventEmitter = function(){
	var that = {};
	//Private Variables
	var events = [];
	//Properties

	//Public Methods
	
	that.Subscribe = function(pEvent,pEventListener)
	{
		if(typeof events[pEvent] == 'undefined')
			events[pEvent] = [];

		events[pEvent].push(pEventListener);
	};

	that.Notify = function(pEvent, pSender)
	{		
		if(typeof events[pEvent] == 'undefined')
			Logger.Warning("Emitting event `"+pEvent+"` sent by "+pSender+" as it has not been defined.");

		var nextCallback = true;

		for(var i = 0; (i < events[pEvent].length && nextCallback); i++)
			nextCallback = events[pEvent][i].Notify(pEvent, pSender);
	};

	that.Define = function(pEvent)
	{
		if(typeof events[pEvent] != 'undefined')
			return false;

		events[pEvent] = [];
	};

	//Internal Methods


	return that;
};

Lynx.Emitter = new Lynx.EventEmitter();

Lynx.Emit = function(pEvent, pSender){ Lynx.Emitter.Notify(pEvent, pSender); };