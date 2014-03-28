/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    File Name: Object.js
*    Description: A standard base object in Lynx
*    Global Variables: Lynx.Object() Lynx.O()
*/

Lynx.Object = function(){
	var that = {};

	var _eventlistener = new Lynx.EventListener();

	/**
	* Description: Notifies the EventListener of the event
	*
	* @this {Lynx.Object}
	* @param {String} <pEvent> name of event to notify of
	* @param {Object} <pSender> object that is sending the event.
	* @return {bool} Whether to allow the next event to be notified [Acts as handled = !return]
	*/
	that.Notify = (function(pEvent, pSender)
	{
		return _eventlistener.Notify(pEvent, pSender);
	}).bind(that);

	/**
	* Description: Subscribes the EventListener to the given event using the provided callback
	*
	* @this {Lynx.Object}
	* @param {String} <pEvent> name of event to notify on
	* @param {Callback} <pCallback> callback to execute on the given event	
	*/
	that.On = (function(pEvent, pCallback)
	{
		_eventlistener.On(pEvent, pCallback.bind(this));
	}).bind(that);

	Lynx.Emit("Object.Create", that);
	return that;
};

Lynx.O = function(){ return new Lynx.Object(); };