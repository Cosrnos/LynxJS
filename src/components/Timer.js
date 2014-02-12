/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    Component Name: Timer
*    Author: Cosrnos
*    Description: Simple event timer
*/


(function(){
	var name = "Timer";
	var auth = "Cosrnos";
	var desc = "Simple event timer";

	var build = function(){
		var timeObjects = [];
		var running = true;
		var currentDelta = 0;

		this.On("Update", Tick);

		//Emits the given event after the timeout(ms)
		this.EmitTimer = function(pName, pObject, pTimeout, pRepeat)
		{
			pRepeat = pRepeat || false;

			var to = new timeObject(pName, pTimeout, function(){
				Lynx.Emit(pName, pObject);
			}, true);
			
			to.Repeat = pRepeat;

			timeObjects.push(to);
		}

		this.Timer = function(pCallback, pTimeout, pRepeat)
		{
			pRepeat = pRepeat || false;

			var to = new timeObject("", pTimeout, pCallback, true);
			to.Repeat = pRepeat;

			timeObjects.push(to);
		}

		this.Resume = function()
		{
			running = true;
			Lynx.Emit("Timer.Resume", this);
		}

		this.Pause = function()
		{
			running = false;
			Lynx.Emit("Timer.Pause", this);
		}


		var timeObject = function(pName, pTimeout, pCallback, pPauseable)
		{
			pPauseable = pPauseable || true;
			return {Name: pName, Timeout: pTimeout, Scheduled: (currentDelta + pTimeout), Callback: pCallback, Pausable: pPauseable, Repeat: false};
		}


		function Tick(pSender)
		{
			if(!running)
				return;
			
			currentDelta += pSender.Delta;

			var toRemove = [];

			for(var i = 0; i < timeObjects.length; i++)
			{
				if(currentDelta >= timeObjects[i].Scheduled){
					timeObjects[i].Callback();
					if(timeObjects[i].Repeat === false)
					{
						toRemove.push(i);
						continue;
					}

					timeObjects[i].Scheduled = timeObjects[i].Timeout + currentDelta;
				}
			}

			for(var i = 0; i < toRemove.length; i++)
				timeObjects.splice(i,1);

			Lynx.Emit("Timer.Tick", this);
		}
	};

	Lynx.Component(name, auth, desc, build);
})();