/*
*
*	This class has been scheduled for MIGRATION
*	from the core to a supported component.
*	The migration has been scheduled for Alpha Milestone 0.1
*
*	For more information please visit lynx.cosrnos.com/schedule.html
*
*/
var Lynx = Lynx || {};

Lynx.Developer = new (function(){
	var that = {};
	
	var infoDiv = null,
		advDiv = null,
		fpsCanv = null,
		fpsOut = null,
		objCanv = null,
		objOut = null,
		maxObj = 10,
		renCanv = null,
		renOut = null,
		colCanv = null,
		colOut = null,
		advBuffer = 1;
		custom = "",
	
	that.SetCustom = function(pCustom){
		custom = pCustom;
	};

	that.Init = function(){
		var logDiv = document.createElement("div");
		logDiv.setAttribute("id","LYNX-DEVELOPER-CONSOLE");
		document.body.appendChild(logDiv);
		Lynx.Logger.DesignateLogger(document.getElementById("LYNX-DEVELOPER-CONSOLE"));
		Lynx.Logger.Log("Developer console opened.",Lynx.LogLevel.INFO);
		var tempInfo = document.createElement("div");
		tempInfo.setAttribute("id","LYNX-DEVELOPER-INFO");
		document.body.appendChild(tempInfo);
		infoDiv = document.getElementById("LYNX-DEVELOPER-INFO");
		if(Lynx.Settings.ShowAdvancedMetrics){
			infoDiv.style.width = "600px";
			infoDiv.style.textAlign = "center";
			function createDiv(){
				var tdiv = document.createElement("div");
				tdiv.setAttribute("align","center");
				tdiv.style.width = "150px";
				tdiv.style.float = "left";
			return tdiv;
			};

			function createCanvas(){
				var tempc = document.createElement("canvas");
				tempc.setAttribute("width",125);
				tempc.setAttribute("height",70);
				tempc.style.border = "1px solid #cccccc";
				tempc.style.background = "rgba(0,0,0,0.2)";
				return tempc;
			};
			var tdiv = createDiv();

			var pcanv = createCanvas();
			pcanv.setAttribute("id","LYNX-DEVELOPER-FPSCANV");
			tdiv.appendChild(pcanv);

			var fpsout = document.createElement("div");
			fpsout.setAttribute("id","LYNX-DEVELOPER-FPSOUT");
			tdiv.appendChild(fpsout);

			var pdiv = createDiv();

			var ocanv = createCanvas();
			ocanv.setAttribute("id","LYNX-DEVELOPER-OBJCANV");
			pdiv.appendChild(ocanv);

			var objout = document.createElement("div");
			objout.setAttribute("id","LYNX-DEVELOPER-OBJOUT");
			pdiv.appendChild(objout);

			var rdiv = createDiv();

			var rcanv = createCanvas();
			rcanv.setAttribute("id","LYNX-DEVELOPER-RENCANV");
			rdiv.appendChild(rcanv);

			var renout = document.createElement("div");
			renout.setAttribute("id","LYNX-DEVELOPER-RENOUT");
			rdiv.appendChild(renout);

			var cdiv = createDiv();

			var ccanv = createCanvas();
			ccanv.setAttribute("id","LYNX-DEVELOPER-COLCANV");
			cdiv.appendChild(ccanv);

			var colout = document.createElement("div");
			colout.setAttribute("id","LYNX-DEVELOPER-COLOUT");
			cdiv.appendChild(colout);


			var headline = document.createElement("div");
			headline.style.width = "100%";
			headline.style.textAlign = "center";
			headline.style.fontSize = "18px";
			headline.innerHTML = "LynxJS Advanced Toolkit v0.3";

			infoDiv.appendChild(headline);
			infoDiv.appendChild(tdiv);
			infoDiv.appendChild(pdiv);
			infoDiv.appendChild(rdiv);
			infoDiv.appendChild(cdiv);
			fpsCanv = document.getElementById("LYNX-DEVELOPER-FPSCANV");
			fpsOut = document.getElementById("LYNX-DEVELOPER-FPSOUT");
			objCanv = document.getElementById("LYNX-DEVELOPER-OBJCANV");
			objOut = document.getElementById("LYNX-DEVELOPER-OBJOUT");
			renCanv = document.getElementById("LYNX-DEVELOPER-RENCANV");
			renOut = document.getElementById("LYNX-DEVELOPER-RENOUT");
			colCanv = document.getElementById("LYNX-DEVELOPER-COLCANV");
			colOut = document.getElementById("LYNX-DEVELOPER-COLOUT");
		}
		Lynx.Logger.Log("Info bar opened.");
		Lynx.Logger.Log("Developer tools initialized.");
	};

	that.Update = function(){
		if(Lynx.Settings.ShowAdvancedMetrics){
			if(advBuffer == 0){
			//FPS
				var buffer = new Lynx.Canvas("canvbuff");
				buffer.SetWidth("125");
				buffer.SetHeight("70");
				var ctx = buffer.GetContext();
				ctx.clearRect(0,0,125,70);
				ctx.drawImage(fpsCanv,-1,0);
				var fpsheight = Math.floor(Lynx.Game.GetFramerate().toFixed(0));
				var ypos = 70 - fpsheight;
				ctx.fillStyle = "rgba(255,0,179,0.5)";
				ctx.fillRect(123,ypos,2,fpsheight);
				ctx.fillStyle = "rgba(255,0,179,1)";
				ctx.fillRect(123,ypos-1,2,2);
				fpsCanv.getContext("2d").clearRect(0,0,125,70);
				fpsCanv.getContext("2d").drawImage(buffer.GetCanvasElement(),0,0);
			//ObjCount
				var buffer = new Lynx.Canvas("canvbuff");
				buffer.SetWidth("125");
				buffer.SetHeight("70");
				var ctx = buffer.GetContext();
				var objCount = Lynx.Game.GetCurrentScene().GetAllObjects().length;
				var offset = 0;
				if(objCount > maxObj){
					offset = (objCount - maxObj);
					maxObj = objCount;
				}
				ctx.clearRect(0,0,125,70);
				var yHeight = (Math.floor(offset/maxObj*100));
				if(yHeight > 30){
					yHeight = 30;
				}
				if(offset > 0 && yHeight < 1){
					yHeight = 1;
				}
				ctx.drawImage(objCanv,-1,yHeight,125,70-yHeight);

				var objheight = Math.floor((objCount/maxObj)*60);
				var ypos = 70 - objheight;
				ctx.fillStyle = "rgba(0,255,179,0.5)";
				ctx.fillRect(123,ypos,2,objheight);
				ctx.fillStyle = "rgba(0,255,179,1)";
				ctx.fillRect(123,ypos-1,2,1);
				objCanv.getContext("2d").clearRect(0,0,125,70);
				objCanv.getContext("2d").drawImage(buffer.GetCanvasElement(),0,0);
			//RenderTime
				var buffer = new Lynx.Canvas("canvbuff");
				buffer.SetWidth("125");
				buffer.SetHeight("70");
				var ctx = buffer.GetContext();
				ctx.clearRect(0,0,125,70);
				ctx.drawImage(renCanv,-1,0);
				var renheight = Math.ceil(Lynx.Game.GetRenderTime().toFixed(0) * 6);
				if(renheight > 60){
					renheight = 60;
				}
				var ypos = 70 - renheight;
				ctx.fillStyle = "rgba(255,179,0,0.5)";
				ctx.fillRect(123,ypos,2,renheight);
				ctx.fillStyle = "rgba(255,179,0,1)";
				ctx.fillRect(123,ypos-1,2,2);
				renCanv.getContext("2d").clearRect(0,0,125,70);
				renCanv.getContext("2d").drawImage(buffer.GetCanvasElement(),0,0);				
				renOut.innerHTML = "Render Time: "+Lynx.Game.GetRenderTime()+"ms";
			//Collisions
				var buffer = new Lynx.Canvas("canvbuff");
				buffer.SetWidth("125");
				buffer.SetHeight("70");
				var ctx = buffer.GetContext();
				ctx.clearRect(0,0,125,70);
				ctx.drawImage(colCanv,-1,0);
				var colheight = Math.ceil(Lynx.CollisionFactory.GetTotalCollisions() * 6);
				if(colheight > 60){
					colheight = 60;
				}
				var ypos = 70 - colheight;
				ctx.fillStyle = "rgba(0,179,255,0.5)";
				ctx.fillRect(123,ypos,2,colheight);
				ctx.fillStyle = "rgba(0,179,255,1)";
				ctx.fillRect(123,ypos-1,2,2);
				colCanv.getContext("2d").clearRect(0,0,125,70);
				colCanv.getContext("2d").drawImage(buffer.GetCanvasElement(),0,0);				
				colOut.innerHTML = "Collisions per Update: "+Lynx.CollisionFactory.GetTotalCollisions();
			}
			fpsOut.innerHTML = "FPS: "+Lynx.Game.GetFramerate().toFixed(1);
			objOut.innerHTML = "Objects: "+Lynx.Game.GetCurrentScene().GetAllObjects().length;
			if(advBuffer == 4){
				advBuffer = 0;
			}else{
				advBuffer++;
			}
		}else{
			infoDiv.innerHTML = "<span>LYNX DEVELOPER TOOLS &nbsp;</span>";
			var cto = Lynx.Time.GetTimeTotal();
				cto = cto / 1000;
				cto = cto.toFixed(1);
			infoDiv.innerHTML += "<span>CTO: "+cto+" seconds</span>";
			infoDiv.innerHTML += "<span>FPS: "+Lynx.Game.GetFramerate().toFixed(1)+"</span>";
			infoDiv.innerHTML += custom;
		}
	};

	return that;
})();