/*
 *    Lynx Project
 *    Started August 2013
 *    ------------------------------------------------------
 *    This file is covered under the LynxJS Game Library
 *    License. Please read license.txt for more information
 *    on usage of this library.
 *    ------------------------------------------------------
 *    Component Name: Velocity
 *    Author: Cosrnos
 *    Description: Handles object velocity and movement on updates.
 */


(function buildComponent_Velocity() {
	var name = "Velocity";
	var auth = "Cosrnos";
	var desc = "Handles object velocity and movement on updates.";

	var build = function () {
		Lynx.Entity.prototype.VX = 0;
		Lynx.Entity.prototype.VY = 0;
		var factor = 1;

		Object.defineProperty(this, "Factor", {
			get: function () {
				return factor;
			},
			set: function (pValue) {
				if (isNaN(pValue)) {
					return;
				}
				factor = pValue;
			}
		});

		Lynx.Scene.On("Update", function () {
			var ents = Lynx.Scene.Entities;
			for (var i = 0; i < ents.length; i++) {
				var entity = ents[i];
				entity.X = Math.floor((entity.X + entity.VX * Lynx.Main.Delta) * factor);
				entity.Y = Math.floor((entity.Y + entity.VY * Lynx.Main.Delta) * factor);
				if (isNaN(entity.X)) {
					entity.X = 0;
				}
				if (isNaN(entity.Y)) {
					entity.Y = 0;
				}
			}

			return true;
		});
	};

	new Lynx.Component(name, auth, desc, build);
})();
