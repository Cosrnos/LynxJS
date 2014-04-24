/*
 *    Lynx Project
 *    Started August 2013
 *    ------------------------------------------------------
 *    This file is covered under the LynxJS Game Library
 *    License. Please read license.txt for more information
 *    on usage of this library.
 *    ------------------------------------------------------
 *    Component Name: SampleComponent
 *    Author: Cosrnos
 *    Description: This is a sample component for LynxJS!
 */

(function buildComponent_SampleComponent() {
	var name = "SampleComponent";
	var auth = "Cosrnos";
	var desc = "This is a sample component for LynxJS!";

	var build = function () {
		this.HelloWorld = function () {
			Lynx.Log("Hello World!");
		};
	};

	new Lynx.Component(name, auth, desc, build);
})();
