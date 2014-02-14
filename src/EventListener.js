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

	var events = [];

	/**
	* Description: Notifies the given listener of the event
	*
	* @this {Lynx.EventListener}
	* @param {String} <pEvent> name of event to notify of
	* @param {Object} <pSender> object that is sending the event.
	* @return {bool} Whether to allow the next event to be notified [Acts as handled = !return]
	*/
	that.Notify = (function(pEvent, pSender)
	{
		if(typeof events[pEvent] == 'undefined')
			return true;

		var notifyNext = true;
		for(var i = 0; i < events[pEvent].length && notifyNext; i++)
			notifyNext = events[pEvent][i](pSender);

		return notifyNext;
	}).bind(that);

	/**
	* Description: Subscribes listener to the given event using the provided callback
	*
	* @this {Lynx.EventListener}
	* @param {String} <pEvent> name of event to notify on
	* @param {Callback} <pCallback> callback to execute on the given event
	*/	
	that.On = (function(pEvent, pCallback)
	{
		if(typeof events[pEvent] == 'undefined')
			events[pEvent] = [];

		events[pEvent].push(pCallback.bind(that));
		Lynx.Emitter.Subscribe(pEvent, that);
	}).bind(that);

	return that;
};