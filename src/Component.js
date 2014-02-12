/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    File Name: Component.js
*    Description: The base component constructor
*    Global Variables: Lynx.Component()
*/

Lynx.Component = function(pName,  pAuthor, pDescription, pBuildCallback){
	var that = new Lynx.Object();

	var beforeRegister = pBuildCallback || function(){ };

	that.Name = pName;
	that.Author = pAuthor;
	that.Description = pDescription;

	//Base Methods


	beforeRegister.apply(that);
	Lynx.CM.Register(that.Name, that);

	return that;
};

Lynx.CM = Lynx.ComponentManager;