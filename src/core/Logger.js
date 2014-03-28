/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    File Name: Logger.js
*    Description: The lynx logging utility
*    Global Variables: Lynx.Logger()
*/

Lynx.Logger = (function LynxLogger()
{
	//Private variables
	var that = {};

	that.LogDiv = Lynx.LogTarget || false;
	console.olog = console.log || function(pMessage){ };

	/**
	* Description: Logs the given message to the console window(s)
	*
	* @this {Lynx.Logger}
	* @param {String} <pMessage> Message to log
	* @param {String} <pSender> prefix to append to the log. Defaults to Info
	*/	
	that.Log = (function(pMessage, pPrefix)
	{
	    console.olog(pMessage);

		if(this.LogDiv == false)
			return;

		pPrefix = pPrefix || "Info";

	  	var sp = document.createElement("span");
	  	sp.innerHTML = "&nbsp;["+pPrefix+"]&nbsp;"+pMessage;
	  	var cons = document.getElementById(that.LogDiv);
	  	if(typeof cons != 'undefined')
	  	{
			cons.appendChild(sp);
		  	cons.scrollTop += 18;
		}
		
	  	Lynx.Emit("Logger.Log", this);
	}).bind(that);

	/**
	* Description: Logs a warning to the console
	*
	* @this {Lynx.Logger}
	* @param {String} <pMessage> message to log
	*/	
	that.Warning = function(pMessage)
	{
		that.Log(pMessage, "Warning");
	}

	/**
	* Description: Logs an error to the console
	*
	* @this {Lynx.Logger}
	* @param {String} <pMessage> message to log
	*/	
	that.Error = function(pMessage)
	{
		that.Log(pMessage,"Error");
	};

	return that;
})();

Lynx.Log = Lynx.Logger.Log;
Lynx.Error = Lynx.Logger.Error;
Lynx.Warning = Lynx.Logger.Warning;