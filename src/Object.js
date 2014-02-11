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
	var eventListener = new Lynx.EventListener();
	//Fallthroughs
	that.Notify = function(pEvent, pSender) { return eventListener.Notify(pEvent, pSender); };
	that.On = function(pEvent, pCallback) { return eventListener.On(pEvent, pCallback); };	

	//Public Methods

	//Internal Methods

	return that;
};

Lynx.O = function(){ return new Lynx.Object(); };