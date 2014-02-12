/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    Component Name: KeyboardEvents
*    Author: Cosrnos
*    Description: Keyboard Event Tracker
*/

// Please note that this tracks events across the page,
// not just across the canvas since Lynx supports multiple
// canvas positions.

(function(){
	var name = "KeyboardEvents";
	var auth = "Cosrnos";
	var desc = "Simple keyboard event tracker.";

	var build = function(){
		var keyboard = [];

		this.KeyState = {
			UP: 0,
			DOWN: 1,
			HELD: 2
		};

		this.Key = function(pKeyString)
		{
			return parseKeyString(pKeyString);
		}

		var keyMap = {
			BACKSPACE: 0,
			TAB: 9,
			RETURN: 13,
			SHIFT: 16,
			CTRL: 17,
			ALT: 18,
			CAPSLOCK: 20,
			ESCAPE: 29,
			SPACE: 32,
			LEFT: 37,
			UP: 38,
			RIGHT: 39,
			DOWN: 40
			//More Keys soon?
		}

		function parseKey(pKeyCode)
		{
			var ret = String.fromCharCode(pKeyCode);

			for(var key in keyMap) //Special Character
			{
				if(keyMap.hasOwnProperty(key))
				{
					if(keyMap[key] == pKeyCode)
						ret = key;
				}
			}

			return ret;
		}

		function parseKeyString(pKeyString)
		{
			pKeyString = pKeyString.toUpperCase();

			if(pKeyString.length == 1)
				return (pKeyString.charCodeAt(0) - 32).toUpperCase();

			if(keyMap.hasOwnProperty(pKeyString))
				return keyMap[pKeyString].toUpperCase();

			return -1;
		}

		//Event Listeners
		window.addEventListener("keydown", (function(event){
			event = event || window.event;
			var keyCode = event.keyCode;
			var keyName = parseKey(keyCode);

			if(keyboard[keyCode] == 'undefined')
				keyboard[keyCode] = this.KeyState.UP;
			if(keyboard[keyCode] == this.KeyState.DOWN)
				keyboard[keyCode] = this.KeyState.HELD;
			if(keyboard[keyCode] == this.KeyState.UP)
				keyboard[keyCode] = this.KeyState.DOWN;


			if(keyboard[keyCode] == this.KeyState.DOWN)
				Lynx.Emit("Keyboard.Press."+keyName, this);
			if(keyboard[keyCode] == this.KeyState.HELD)
				Lynx.Emit("Keyboard.Hold."+keyName);

			//event.preventDefault();
		}).bind(this), false);

		window.addEventListener("keyup", (function(event){
			event = event || window.event;
			var keyCode = event.keyCode;
			var keyName = parseKey(keyCode);
			keyboard[keyCode] = this.KeyState.UP;
			Lynx.Emit("Keyboard.Release."+keyName);

			//event.preventDefault();
		}).bind(this), false);
	};

	Lynx.Component(name, auth, desc, build);
})();
