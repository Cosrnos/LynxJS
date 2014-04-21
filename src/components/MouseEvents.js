/*
 *    Lynx Project
 *    Started August 2013
 *    ------------------------------------------------------
 *    This file is covered under the LynxJS Game Library
 *    License. Please read license.txt for more information
 *    on usage of this library.
 *    ------------------------------------------------------
 *    Component Name: MouseEvents
 *    Author: Cosrnos
 *    Description: Mouse Event Tracker
 */


// Please note that this tracks events across the page,
// not just across the canvas since Lynx supports multiple
// canvas positions. Please use Canvas{}.ParsePosition to get
// the position on the canvas itself

(function () {
	var name = "MouseEvents";
	var auth = "Cosrnos";
	var desc = "Simple mouse event tracker.";

	var build = function () {
		this.MouseStates = {
			UP: 0,
			DOWN: 1
		};

		this.X = 0;
		this.Y = 0;

		this.State = this.MouseStates.UP;

		//Simple Mouse Hold Event
		this.On("Update", function () {
			if (this.State == this.MouseStates.DOWN) {
				Lynx.Emit("MouseEvents.Hold", this);
			}
		});

		//Event Listeners
		window.addEventListener("mousemove", (function handleMove(event) {
			this.X = event.pageX;
			this.Y = event.pageY;

			Lynx.Emit("MouseEvents.Move", this); //Note to self: Check value of this in this context?
		}).bind(this), false);

		window.addEventListener("mousedown", (function handleDown() {
			this.State = this.MouseStates.Down;

			Lynx.Emit("MouseEvents.Down", this);
		}).bind(this), false);

		window.addEventListener("mouseup", (function handleUp() {
			this.State = this.MouseStates.Down;

			Lynx.Emit("MouseEvents.Up", this);
		}).bind(this), false);

		window.addEventListener("click", (function handleClick() {
			Lynx.Emit("MouseEvents.Click", this);
		}).bind(this), false);
	};

	Lynx.Component(name, auth, desc, build);
})();
