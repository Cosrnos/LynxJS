/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    File Name: Canvas.js
*    Description: A standard canvas
*    Global Variables: Lynx.Canvas()
*/

Lynx.Canvas = function(){
	var that = new Lynx.Object();
	
	//Private Variables
	var canvas = document.createElement("canvas");

	//Event Definitions
	that.On("requestAnimationFrame", onRequestAnimationFrame);

	//Public Methods
	that.Draw = function(){ }; //Defined by User

	//Event Callbacks
	function onRequestAnimationFrame(pSender)
	{
		this.Draw();
		return true;
	}

	return that;
};

Lynx.O = function(){ return new Lynx.Object(); };