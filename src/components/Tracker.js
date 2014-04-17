/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    Component Name: Tracker
*    Author: Cosrnos
*    Description: Tracking component for various lynx statistics
*/


(function(){
	var name = "Tracker";
	var auth = "Cosrnos";
	var desc = "Tracking component for various lynx statistics";

	var build = function(){
		var fpsCanv = document.createElement("canvas");
		var ftCanv = document.createElement("canvas");
		var utCanv = document.createElement("canvas");
		fpsCanv.style.border = "1px solid #ffffff";
		fpsCanv.style.borderTop = "0px solid";
		fpsCanv.style.display = "block";
		fpsCanv.style.margin = "00 auto";
		ftCanv.style.border = "1px solid #ffffff";
		ftCanv.style.borderTop = "0px solid";
		ftCanv.style.display = "block";
		ftCanv.style.margin = "00 auto";
		ftCanv.style.marginTop = "50px";
		utCanv.style.border = "1px solid #ffffff";
		utCanv.style.borderTop = "0px solid";
		utCanv.style.margin = "00 auto";
		utCanv.style.marginTop = "50px";
		utCanv.style.display = "block";

		var fpsOut = document.createElement("span");
		var ftOut = document.createElement("span");
		var utOut = document.createElement("span");

		var buffer = document.createElement("canvas");
		var frameStart = 0;

		var container = document.createElement("div");
		{
			container.id = "Lynx-Tracker-Container";
			container.style.position = "absolute";
			container.style.top = "0";
			container.style.left = "0";
			container.style.height = "100%";
			container.style.width = "250px";
			container.style.background = "rgba(0,0,0,0.5)";
			container.style.textAlign = "center";
			var header = document.createElement("h1");
			header.innerHTML = "Lynx Tracker";
			header.style.fontSize = "18px";
			var fpslabel = document.createElement("span");
			fpslabel.innerHTML = "Frames Per Second: ";
			var ftlabel = document.createElement("span");
			ftlabel.innerHTML = "Render Time: ";
			var utlabel = document.createElement("span");
			utlabel.innerHTML = "Main Thread Timer: ";
			container.appendChild(header);
			container.appendChild(fpsCanv);
			container.appendChild(fpslabel);
			container.appendChild(fpsOut);
			container.appendChild(ftCanv);
			container.appendChild(ftlabel);
			container.appendChild(ftOut);
			container.appendChild(utCanv);
			container.appendChild(utlabel);
			container.appendChild(utOut);
			document.body.appendChild(container);
		}
		var count = 0;
		var lastUpdate = Date.now();
		var fps = 0;

		this.Settings = {
			Enabled: true
		};

		fpsCanv.width = 200;
		fpsCanv.height = 120;
		fpsCanv.id = "Lynx-Tracker-FPS-Canvas";

		ftCanv.width = 200;
		ftCanv.height = 120;
		ftCanv.id = "Lynx-Tracker-FT-Canvas";

		utCanv.width = 200;
		utCanv.height = 120;
		utCanv.id = "Lynx-Tracker-UT-Canvas";

		buffer.width = 200;
		buffer.height = 120;

		var updateStart = 0;
		var updateFinish = 0;

		this.On("beforeUpdate", function(){ updateStart = Date.now(); });
		this.On("afterUpdate", function(){ updateFinish = Date.now(); });

		this.On("beforeRequestAnimationFrame", function(){ frameStart = Date.now(); });
		this.On("afterRequestAnimationFrame", drawUpdates);

		function drawUpdates()
		{
			if(!this.Settings.Enabled)
				return true;

			var now = Date.now();
			var thisFps = 1000 / (now - lastUpdate);
			
			if(now != lastUpdate)
			{
				fps += ((thisFps + fps)/2 - fps) / 60;
				lastUpdate = now;	
				count++;
			}

			if(count % 15 == 0)
			{
				var ctx = buffer.getContext("2d");
				ctx.fillStyle = "rgba(0,255,155,1)";
				ctx.clearRect(0,0,buffer.width, buffer.height);
				ctx.drawImage(fpsCanv, -2, 0, buffer.width, buffer.height);
				var offset = 120 - Math.floor(fps);
				ctx.fillRect(buffer.width-2, offset, 2, Math.floor(fps));

				fpsCanv.getContext("2d").clearRect(0, 0, fpsCanv.width, fpsCanv.height);
				fpsCanv.getContext("2d").drawImage(buffer, 0, 0, fpsCanv.width, fpsCanv.height);

				var ft = (Date.now() - frameStart);

				ctx.clearRect(0,0, buffer.width, buffer.height);
				ctx.drawImage(ftCanv, -2, 0, buffer.width, buffer.height);
				ctx.fillStyle = "rgba(15, 75, 255, 1)";
				ctx.fillRect(buffer.width-2, 120 - ft * 3, 2, ft * 3);

				ftCanv.getContext("2d").clearRect(0,0,ftCanv.width, ftCanv.height);
				ftCanv.getContext("2d").drawImage(buffer, 0, 0, ftCanv.width, ftCanv.height);

				var ut = updateFinish - updateStart;

				ctx.clearRect(0,0, buffer.width, buffer.height);
				ctx.drawImage(utCanv, -2, 0, buffer.width, buffer.height);
				ctx.fillStyle = "rgba(255, 155, 15, 1)";
				ctx.fillRect(buffer.width-2, 120 - ut * 2, 2, ut * 2);

				utCanv.getContext("2d").clearRect(0,0,utCanv.width, utCanv.height);
				utCanv.getContext("2d").drawImage(buffer, 0, 0, utCanv.width, utCanv.height);

				fpsOut.innerHTML = fps.toFixed(1);		
				ftOut.innerHTML = ft + "ms";
				utOut.innerHTML = ut + "ms";
			}

			return true;
		}
	};

	Lynx.Component(name, auth, desc, build);
})();