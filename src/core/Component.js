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
	var that = new Lynx.Object();

	/** Description: Called before automatic registration. Set in pBuildCallback
	 */
	var beforeRegister = pBuildCallback || function () {
			return true;
		};

	/** Description: Name of the component
	 */
	that.Name = pName;

	/** Description: Author of the component
	 */
	that.Author = pAuthor;

	/** Description: Description of the component.
	 */
	that.Description = pDescription;

	//base methods to go here~

	//Below is to ensure automatic registration if no return is set~
	var autoRegister = beforeRegister.apply(that) || true;

	if (autoRegister)
		Lynx.CM.Register(that.Name, that);

	return that;
};
