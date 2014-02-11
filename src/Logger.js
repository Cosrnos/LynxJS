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

	that.LogDiv = Lynx.LogTarget;
	console.olog = console.log || function(pMessage){ };

	that.Log = function(pMessage, pPrefix)
	{
	    console.olog(pMessage);

		if(this.LogDiv == false)
			return;

		pPrefix = pPrefix || "Info";

	  	var sp = document.createElement("span");
	  	sp.innerHTML = "&nbsp;["+pPrefix+"]&nbsp;"+pMessage;
	  	var cons = document.getElementById(that.LogDiv);
	  	cons.appendChild(sp);
	  	cons.scrollTop += 18;
	};

	that.Error = function(pMessage)
	{
		that.Log(pMessage,"Error");
	};

	return that;
})();

Lynx.Log = Lynx.Logger.Log;
Lynx.Error = Lynx.Logger.Error;

console.log = function(pMessage)
{
	Lynx.Log(pMessage);
}

console.error = console.debug = console.info = console.log;

window.onerror = function (message, file, line, position, error) {
    Lynx.Log("An error was encountered at line "+line+":"+position+". \""+message+"\"", "Error");
};