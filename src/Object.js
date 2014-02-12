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
			notifyNext = events[pEvent][i](pSender, that);
		return notifyNext;
	};

	that.On = function(pEvent, pCallback)
	{
		if(typeof events[pEvent] == 'undefined')
			events[pEvent] = [];

		events[pEvent].push(pCallback.bind(that));
		Lynx.Emitter.Subscribe(pEvent, that);
	};
	//Internal Methods
	Lynx.Emit("Object.Create", that);
	return that;
};

Lynx.O = function(){ return new Lynx.Object(); };