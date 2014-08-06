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

Lynx.Component = function (pName, pAuthor, pDescription, pBuildCallback) {
	/** Description: Called before automatic registration. Set in pBuildCallback
	 */
	var beforeRegister = pBuildCallback || function () {
			return true;
		};

	/** Description: Name of the component
	 */
	this.Name = pName;

	/** Description: Author of the component
	 */
	this.Author = pAuthor;

	/** Description: Description of the component.
	 */
	this.Description = pDescription;

	//base methods to go here~

	//Below is to ensure automatic registration if no return is set~
	var autoRegister = beforeRegister.apply(this) || true;

	if (autoRegister)
		Lynx.CM.Register(this.Name, this);
};

Lynx.Component.prototype = new Lynx.Object();
