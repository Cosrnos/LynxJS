var Lynx = Lynx || {};

Lynx.IO = (function(params){
	var that = {};

	var keystates = [],
		downFunctions = [],
		holdFunctions = [],
		upFunctions = [],
		mouseObjects = [],
		/*clickObjects:
		*	Objects in which the mouse x/y collides
		*	Changed on mouse update
		*/
		clickObjects = [],
		mouseX = 0,
		mouseY = 0,
		clickEvents = [],
		//Mouse states:
		//	0 - None
		//	1 - DOWN
		//	2 - HOLD
		//	3 - UP
		mouseState = 0;

	that.EventType = {
		UP: 0,
		DOWN: 1,
		HOLD: 2
	};

	that.KeyCode = {
		BACKSPACE: 8,
		ENTER: 13,
		SHIFT: 16,
		SPACE: 32,
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40
	};

	this.GetState = function(pKeycode){
		return keystates[pKeycode];
	};

	that.RegisterEvent = function(pKeycode,pType,pCallback){
		if(pType == that.EventType.UP){
			if(typeof upFunctions[pKeycode] == 'undefined'){
				upFunctions[pKeycode] = [];
			}
		
			upFunctions[pKeycode].push(pCallback);
			return;
		}
		if(pType == that.EventType.DOWN){
			if(typeof downFunctions[pKeycode] == 'undefined'){
				downFunctions[pKeycode] = [];
			}

			downFunctions[pKeycode].push(pCallback);
			return;
		}
		if(pType == that.EventType.HOLD){
			if(typeof holdFunctions[pKeycode] == 'undefined'){
				holdFunctions[pKeycode] = [];
			}

			holdFunctions[pKeycode].push(pCallback);
			return;
		}
		Lynx.Logger.Log("Failed to add event type "+pType,Lynx.LogLevel.ERROR);
	};

	that.PushMouseEvent = function(pMouseObject){
		mouseObjects.push(pMouseObject);
	};

	that.MouseObject = function(pRect){
		var rect = pRect;
		return {
			Hovering: false,
			onHover: function(){},
			onLeave: function(){},
			onDown: function(){},
			onClick: function(){},
			onUp: function(){},
			GetRect: function(){ return rect; },
			SetBounds: function(pX,pY,pWidth,pHeight){
				rect.SetX(pX);
				rect.SetY(pY);
				rect.SetWidth(pWidth);
				rect.SetHeight(pHeight);
			},
			IsInBounds: function(pX,pY){
				return (pX > rect.GetX() &&
						pX < rect.GetX() + rect.GetWidth() &&
						pY > rect.GetY() &&
						pY < rect.GetY() + rect.GetWidth());
			}
		};
	};

	that.Update = function(){
		for(var key in keystates){
			var state = keystates[key];
			if(state == "DOWN"){
				if(typeof downFunctions[key] != 'undefined'){
					for(var i in downFunctions[key]){
						downFunctions[key][i]();
					}
				}
				keystates[key] = "HOLD";
			}
			if(state == "HOLD"){
				if(typeof holdFunctions[key] != 'undefined'){
					for(var i in holdFunctions[key]){
						holdFunctions[key][i]();
					}
				}
			}
		}
		if(Lynx.Settings.RequireMouse){
			clickObjects = [];
			for(var i in mouseObjects){
				var co = mouseObjects[i];
				if(co.IsInBounds(mouseX,mouseY)){
					clickObjects.push(co);
					co.Hovering = true;
					co.onHover();
				}else{
					if(co.Hovering){
						co.Hovering = false;
						co.onLeave();
					}
				}
			}
			if(mouseState == 1){
				clickEvents = clickObjects;
				for(var i in clickEvents){
					clickEvents[i].onClick();
					clickEvents[i].onDown();
				}
				mouseState = 2;
			}
			if(mouseState == 2){
				for(var i in clickEvents){
					clickEvents[i].onDown();
				}
			}
			if(mouseState == 3){
				for(var i in clickEvents){
					clickEvents[i].onUp();
				}
				clickEvents = [];
				mouseState = 0;
			}
		}
	};

	that.Init = function(){
		var onKeyDown = function(pEvent){
			var keyCode = pEvent.keyCode;
			if(typeof keystates[keyCode] == 'undefined'){
				keystates[keyCode] = "DOWN";
			}else{
				if(keystates[keyCode] == "DOWN"){
					keystates[keyCode] = "HOLD";
				}
				if(keystates[keyCode] == "UP"){
					keystates[keyCode] = "DOWN";
				}
			}
		};
		
		var onKeyUp = function(pEvent){
			var keyCode = pEvent.keyCode;
			keystates[keyCode] = "UP";
			if(typeof upFunctions[keyCode] != 'undefined'){
				for(var i in upFunctions[keyCode]){
					upFunctions[keyCode][i]();
				}
			}
			if(that.ParseKeyCode(keyCode) == -1){
				Lynx.Logger.Log("Keycode "+keyCode+" not in parse list.",Lynx.LogLevel.DEV);
			}
		};

		var onMouseMove = function(pEvent){
			mouseX = pEvent.clientX;
			mouseY = pEvent.clientY;
			//Check functions in update method.
		};

		var onMouseDown = function(pEvent){
			pEvent.preventDefault();
			if(mouseState == 1){
				mouseState = 2;
				return;
			}
			mouseState = 1;
		};

		var onMouseUp = function(pEvent){
			pEvent.preventDefault();
			mouseState = 3;
		};
		window.addEventListener("mousemove",onMouseMove,false);
		window.addEventListener("mousedown",onMouseDown,false);
		window.addEventListener("mouseup",onMouseUp,false);
		window.addEventListener("keydown",onKeyDown,false);
		window.addEventListener("keyup",onKeyUp,false);
	};

	that.ParseKeyCode = function(pKey){
/*
*
*	This method has been scheduled for REMOVAL from the core.
*	The removal has been scheduled for Alpha Milestone 0.1
*
*	For more information please visit lynx.cosrnos.com/schedule.html
*
*/
		var ret = -1;
		switch(pKey){
			case 8:
				ret = "BACKSPACE";
			break;
			case 13:
				ret = "ENTER";
			break;
			case 16:
				ret = "SHIFT";
			break;
			case 32:
				ret = "SPACE";
			break;
			case 37:
				ret = "LEFT";
			break;
			case 38:
				ret = "UP";
			break;
			case 39:
				ret = "RIGHT";
			break;
			case 40:
				ret = "DOWN";
			break;
		}
	
		return ret;
	};

	return that;
})();