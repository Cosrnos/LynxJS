var Lynx = Lynx || {};

Lynx.Asset = function(pRef,pType,pUrl){
	var that = {};

	var ref = pRef,
		type = pType,
		url = pUrl,
		object = null,
		playing = false;

	that.GetType = function(){
		return type;
	};

	that.GetRef = function(){
		return ref;
	};

	that.GetUrl = function(){
		return url;
	};

	that.GetObject = function(){
		return object;
	};

	that.Load = function() {
		var tempObject = -1;
		Lynx.Logger.Log("Attempting to load asset "+ref,Lynx.LogLevel.INFO);
		var nCallback = function(){
			that.onload();
		};

		if(type == Lynx.AssetType.IMAGE){
			tempObject = new Image();
			tempObject.addEventListener('load',nCallback,false);
			tempObject.src = url;
		}else if(type == Lynx.AssetType.AUDIO){
			tempObject = new Audio();
			tempObject.addEventListener('canplaythrough',nCallback,false);
			tempObject.src = url;
			tempObject.load();
		}else if(type == Lynx.AssetType.VIDEO){
			tempObject = new Video();
			tempObject.addEventListener('canplaythrough',nCallback,false);
			tempObject.src = url;
		}
		if(tempObject != -1){
			object = tempObject;
			return true;
		}else{
			return false;
		}
	};

	that.Play = function(loop){
		var looping = false;
		if(typeof loop != 'undefined'){
			looping = loop;
		}
		if(type == Lynx.AssetType.AUDIO || type == Lynx.AssetType.VIDEO){
			object.play();
			if(looping){
				object.addEventListener("ended",function(){
					object.currentTime = 0;
					object.play();
				},false);
			}
		}
		playing = true;
	};

	that.Pause = function(){
		if(type == Lynx.AssetType.AUDIO){
			object.pause();
		}
		if(type == Lynx.AssetType.VIDEO){
			object.pause();			
		}		
		playing = false;
	}

	that.onload = function(){ };

	return that;
};
var Lynx = Lynx || {};

Lynx.AssetManager = (function(){
	var that = {};

	var images = [],
		sounds = [],
		videos = [],
		xml = [],
		json = [],
		lynxOBJ = [],
		preload_progress = 0,
		preload_total = 0,
		ready = false,
		preload_callback = function(){};

	that.Internal = {
		OnAssetLoad: function(){
			preload_progress++;
			if(preload_progress >= preload_total){
				Lynx.Logger.Log("Assets Loaded!",Lynx.LogLevel.DEBUG);
				preload_callback();
				ready = true;
			};
		}
	};

	//Accessors - GETS
	that.GetImage = function(pImage){
		return images[pImage];
	};

	that.GetAudio = function(pSound){
		return sounds[pSound];
	};

	that.GetVideo = function(pVideo){
		return videos[pVideo];
	};

	that.GetXML = function(pXML){
		return xml[pXML];
	};

	that.GetJSON = function(pJSON){
		return json[pJSON];
	};

	that.GetLynxOBJ = function(pLynxOBJ){
		return lynxOBJ[pLynxOBJ];
	};

	that.GetPreloadProgress = function(){
		return preload_progress;
	};

	that.GetPreloadTotal = function(){
		return preload_total
	};

	that.IsReady = function(){
		return ready;
	};

	that.GetProgressBar = function(){
		if(preload_progress > 0){
			return ((preload_progress / preload_total)*100);
		}else{
			return 0;
		}
	};

	that.PutAsset = function(pRef,pType,pUrl){
		var ref = ref;
		var asset = new Lynx.Asset(pRef,pType,pUrl);
		if(pType == Lynx.AssetType.IMAGE){
			images[pRef] = asset;
		}
		if(pType == Lynx.AssetType.AUDIO){
			sounds[pRef] = asset;
		}
		if(pType == Lynx.AssetType.VIDEO){
			videos[pRef] = asset;
		}
		preload_total++;
	};

	that.Preload = function(pCallback){
		Lynx.Logger.Log("Preloading Assets...",Lynx.LogLevel.DEBUG);
		if(preload_total == 0){
			pCallback();
			return;
		}
		preload_callback = pCallback;
		for(var ref in images){
			var co = images[ref];
			co.onload = that.Internal.OnAssetLoad;
			co.Load();
		}
		for(var ref in sounds){
			var co = sounds[ref];
			co.onload = that.Internal.OnAssetLoad;
			co.Load();
		}
		for(var ref in videos){
			var co = sounds[ref];
			co.onload = that.Internal.OnAssetLoad;
			co.Load();
		}
	};

	that.LoadAsset = function(pAsset){
		var ref = pAsset.GetRef();
		var success = true;
		switch(pAsset.GetType()){
			case Lynx.AssetType.IMAGE:
				images[ref] = pAsset;
			break;
			case Lynx.AssetType.AUDIO:
				sounds[ref] = pAsset;
			break;
			case Lynx.AssetType.VIDEO:
				videos[ref] = pAsset;
			break;
			case Lynx.AssetType.XML:
				xml[ref] = pAsset;
			break;
			case Lynx.AssetType.JSON:
				json[ref] = pAsset;
			break;
			case Lynx.AssetType.LynxObj:
				lynxObj[ref] = pAsset;
			break;
			default:
				success = false;
			break;
		}
		return success;
	};

	return that;
})();
var Lynx = Lynx || {};

Lynx.AssetType= {
	//Primary
	IMAGE: 0,
	AUDIO: 1,
	VIDEO: 2,
	//Maps
	XML: 10,
	JSON: 11,
	//Other
	LynxOBJ: 20
};
var Lynx = Lynx || {};

Lynx.Canvas= function(pId){
	var that = {};

	var id = pId,
		x = 0,
		y = 0,
		width = 100,
		height = 100,
		canvasElement = null,
		ctx = null;

	if(pId != null){
		canvasElement = document.getElementById(pId);
		if(canvasElement == null){
			canvasElement = document.createElement("canvas");
			canvasElement.setAttribute("id",pId);
		}
	}
	if(canvasElement != null){
		ctx = canvasElement.getContext("2d");
		width = canvasElement.width;
		height = canvasElement.height;
	}else{
		Lynx.Logger.Log("Could not create canvas element "+canvasElement,Lynx.LogLevel.FATAL_ERROR);
		return;
	}

	that.GetId = function () {
		return id;
	};

	that.GetX = function(){
		return x;
	};

	that.GetY = function(){
		return y;
	};

	that.GetWidth = function(){
		return width;
	};

	that.GetHeight = function(){
		return height;
	};

	that.GetCanvasElement = function(){
		return canvasElement;
	};

	that.GetContext = function(){
		return ctx;
	};

	that.SetId = function(pId){
		id = pId;
		canvasElement.setAttribute("id",pId);
	};

	that.SetX = function(pX){
		x = pX;
	};

	that.SetY = function(pY){
		y = pY;
	};

	that.SetWidth = function(pWidth){
		width = pWidth;
		canvasElement.setAttribute("width",pWidth);
	};

	that.SetHeight = function(pHeight){
		height = pHeight;
		canvasElement.setAttribute("height",pHeight);
	};

	return that;
};
var Lynx = Lynx || {};

Lynx.Class= function(pInput){
	var that = {};
	//Private Variables

	//Public Variables

	//Construct
	
	//Accessors - GETS
	
	//Accessors - SETS

	//Methods

	//Return
	return that;
};
var Lynx = Lynx || {};

Lynx.CollisionFactory_New = (function(){
	var that = {};
	var collisionEvents = [];

	that.Subscribe = function(pType1,pType2,callback){
		if(typeof collisionEvents[pType1+"_"+pType2] == 'undefined'){
			collisionEvents[pType1+"_"+pType2] = [];
		}

		collisionEvents[pType1+"_"+pType2].push(callback);
		return true;
	};

	that.Notify = function(pType1,pType2){
		if(typeof collisionEvents[pType1+"_"+pType2] == 'undefined'){
			return true;
		}
		for(var i in collisionEvents[pType1+"_"+pType2]){
			collisionEvents[pType1+"_"+pType2][i]();
		}
	};

	return that;
})();
var Lynx = Lynx || {};

Lynx.CollisionFactory= (function(){
	var that = {};

	var quad = -1,
		collisionsThisUpdate = 0,
		collisionsLastUpdate = 0;

	that.GetTotalCollisions = function(){
		return Math.floor((collisionsThisUpdate+collisionsLastUpdate)/2);
	};
		
	that.Init = function(){
		quad = new Lynx.Quadtree(0,new Lynx.Rectangle(0,0,Lynx.Game.GetScreenWidth(),Lynx.Game.GetScreenHeight()));
	};

	that.Update = function(pArray){
		collisionsLastUpdate = collisionsThisUpdate;
		collisionsThisUpdate = 0;
		quad.Clear();
		var returnObjects = [];

		for(var index in pArray){
			if(pArray[index].Collidable()){
				quad.Insert(pArray[index]);
			}
		}
		for(var i in pArray){
			returnObjects = [];
			returnObjects = quad.Retrieve(returnObjects,pArray[i]);

			for(var x in returnObjects){
				if(returnObjects[x] != pArray[i] && pArray[i].ResolveCollisions()){
					if(that.Collides(pArray[i],returnObjects[x])){
						//Resolve
							var e = {
								resolved: false,
								collidingObject: null,
								interactingObject: null
								},
								n = 0;
							while(!e.resolved && n < 5){
								if(!e.resolved){
									e.collidingObject = returnObjects[x];
									e.interactingObject = pArray[i];
									pArray[i].oncollision(e);
								}

								if(!e.resolved){
									e.collidingObject = pArray[i];
									e.interactingObject = returnObjects[x];
									returnObjects[x].oncollision(e);
								}

								if(!e.resolved){
									e.resolved = pArray[i].Collides(returnObjects[x]);
								}

								n++;
							}

							if(!e.resolved){
								Lynx.Logger.Log("Could not resolve collision between colliding objects "+pArray[i].GetName()+" and "+returnObjects[x].GetName()+". Exiting...",Lynx.LogLevel.DEBUG);
							}else{
								collisionsThisUpdate++;
							}
					}
				}
			}
		}
	};

	that.WillCollide = function(pObj,x,y,pArray){
		var obj = {};
			obj = pObj;
		var lx = obj.GetX();
		var ly = obj.GetY();
		pObj.SetX(x);
		pObj.SetY(y);
		quad.Clear();
		for(var index in pArray){
			if(pArray[index].Collidable()){
				quad.Insert(pArray[index]);
			}
		}
		var result = false;
		var testObjects = quad.Retrieve(pArray,pObj);
		for(var i in testObjects){
			if(testObjects[i] != pObj){
				if(that.Collides(pObj,testObjects[i])){
					result = true;
				}
			}
		}
		pObj.SetX(lx);
		pObj.SetY(ly);
		return result;
	};

	that.Collides = function(a,b){
		var c = (a.GetX() < b.GetX() + b.GetWidth() &&
				a.GetX() + a.GetWidth() > b.GetX() &&
				a.GetY() < b.GetY() + b.GetHeight() &&
				a.GetY() + a.GetHeight() > b.GetY());
		return c;
	};

	return that;
})();
var Lynx = Lynx || {};

Lynx.Component = function(){
	var that = {};

	var conflicting = [];

	that.Name = "My Lynx Component";
	that.Author = "Anonymous";
	that.Version = "0.0";

	that.Confliction = function(pString){
		conflicting.push(pString);
	};

	that.ConflictsWith = function(pString){
		var found = false;
		for(var i in conflicting){
			if(conflicting[i] == pString){
				found = true;
			}
		}
		return found;
	};

	that.Update = function(){};
	that.Draw = function(){};
	that.onLoad = function(){};
	that.onUnload = function(){};

	return that;
};
var Lynx = Lynx || {};

Lynx.ComponentManager = (function(){
	var that = {};
	var components = [];

	that.Load = function(pString){
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = Lynx.Settings.LibraryDirectory+"/components/"+pString+".js";
	};

	that.Register = function(pComponentObject){
		components.push(pComponentObject);
	};

	that.Update = function(){
		for(var i in components){
			components[i].Update();
		}
	};

	that.Draw = function(){
		for(var i in components){
			components[i].Draw();
		}
	};

	return that;
})();
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
var Lynx = Lynx || {};

Lynx.Game = new (function(){
	var that = this;


	var name = "",
		screenWidth = 0,
		screenHeight = 0,
		canvas = null,
		context = null,
		bufferCanvas = null,
		bufferContext = null,
		framerate = 0,
		lastFrameUpdate = (new Date)*1 - 1,
		fpsFilter = 30,
		fullscreen = true,
		ready = false,
		renderTime = 0,
		currentScene = null;

	that.$ = {};

	that.onready = function(){};

	that.GetName = function(){
		return name;
	};

	that.GetScreenWidth = function(){
		return screenWidth;
	};

	that.GetScreenHeight = function(){
		return screenHeight;
	};

	that.GetViewport = function(){
		return canvas;
	};

	that.GetCurrentScene = function(){
		return currentScene;
	};

	that.GetFramerate = function(){
		return framerate;
	};

	that.IsReady = function(){
		return ready;
	};
	
	that.GetRenderTime = function(){
		return renderTime;
	};

	that.SetName = function(pName){
		name = pName;
	};

	that.ChangeScene = function(pScene){
		if(currentScene != null){
			currentScene.End();
			var bgm = currentScene.GetBGM();
			if(bgm != false)
				bgm.Pause();
		}

		var oldName = currentScene.GetName();
		currentScene = pScene;
		Lynx.Logger.Log("Changing scene from '"+oldName+"' to '"+currentScene.GetName()+"'",Lynx.LogLevel.INFO);
		currentScene.Open();
		var bgm = currentScene.GetBGM();
		if(bgm != false)
			bgm.Play();
	};

	that.SetScreenHeight = function(pHeight){
		screenHeight = pHeight;
	};

	that.SetScreenWidth = function(pWidth){
		screenWidth = pWidth;		
	};

	that.ToggleFullscreen = function(){
		fullscreen = !fullscreen;
	};

	that.Draw = function(){
		var renderStart = Date.now();

		Lynx.ComponentManager.Draw();

		if(currentScene != null){
			var c = currentScene.GetCanvas();
			c.SetWidth(Lynx.Game.GetScreenWidth());
			c.SetHeight(Lynx.Game.GetScreenHeight());
			bufferCanvas.SetWidth(screenWidth);
			bufferCanvas.SetHeight(screenHeight)
			currentScene.Draw();
			var tempCanv = currentScene.GetCanvasElement();
			bufferContext.clearRect(0,0,bufferCanvas.GetWidth(),bufferCanvas.GetHeight());
			bufferContext.drawImage(tempCanv,0,0);
		}

		var tempCanv = bufferCanvas.GetCanvasElement();
		context.clearRect(0,0,canvas.GetWidth(),canvas.GetHeight());
		context.drawImage(tempCanv,0,0);

	 	var thisFrameFPS = 1000 / ((now=new Date) - lastFrameUpdate);
	 	framerate += (thisFrameFPS - framerate) / fpsFilter;
	 	lastFrameUpdate = now;

	 	var renderEnd = Date.now();
	 	renderTime = renderEnd - renderStart;

	 	window.requestAnimFrame(that.Draw);
	};

	that.Update = function(){
		Lynx.Time.Tick();
		Lynx.IO.Update();
		Lynx.ComponentManager.Update();
		
		if(Lynx.Settings.UseOldCollisions){
			Lynx.CollisionFactory.Update(currentScene.GetAllObjects());
		}
		if(currentScene != null){
			currentScene.Update();
		}
		if(Lynx.Settings.EnableDeveloperTools){
			Lynx.Developer.Update();
		}
	};


	that.Run = function(pName,pCanvasId,pOpeningScene){
		Lynx.Logger.Log("Lynx Game Started! Initializing...",Lynx.LogLevel.INFO);

		Lynx.currentScene = new Lynx.Scene("LYNX-INIT");
		name = pName;
		canvas = new Lynx.Canvas(pCanvasId);
		screenWidth = canvas.GetWidth();
		screenHeight = canvas.GetHeight();
		context = canvas.GetContext();

		Lynx.Logger.Log("Set Game name property to "+pName);
		Lynx.Logger.Log("Initializing Primary Canvas...",Lynx.LogLevel.INFO);
		
		window.requestAnimFrame = (function(){
			return  window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					function(pCallback){
						window.setTimeout(pCallback, 1000 / 60);
					};
		})();

		if(Lynx.Settings.EnableDeveloperTools){
			Lynx.Logger.Log("Developer tools enabled. Attempting to strap tools...",Lynx.LogLevel.INFO);		
			Lynx.Developer.Init();
		}

		if(pOpeningScene != null){
			currentScene = pOpeningScene;
		}

		if(currentScene.GetName() == "LYNX-INIT"){
			Lynx.Logger.Log("Opening Scene has not been defined!! Please define your scenes before running Lynx!",Lynx.LogLevel.WARNING);
			currentScene = new Lynx.Scene("LYNX_EMPTY_SCENE");
		}

		Lynx.Logger.Log("Initializing Buffer Canvas...",Lynx.LogLevel.INFO);		
		bufferCanvas = new Lynx.Canvas("LYNX_BUFFER");
		bufferCanvas.SetWidth(screenWidth);
		bufferCanvas.SetHeight(screenHeight);
		bufferContext = bufferCanvas.GetContext();

		Lynx.Logger.Log("Initializing IO...",Lynx.LogLevel.Info);
		Lynx.IO.Init();

		if(Lynx.Settings.UseOldCollisions){
			Lynx.Logger.Log("Initializing Collisions...",Lynx.LogLevel.Info);
			Lynx.CollisionFactory.Init();
		}

		Lynx.Logger.Log("Finished Intializing. Beginning Game Loop.",Lynx.LogLevel.INFO);
		window.setInterval(function(){that.Update()},1000/60,false);

		Lynx.Logger.Log("Game loop initialized. Beginning Animation Loop.");
		currentScene.Open();
		window.requestAnimFrame(that.Draw);

		ready = true;
		that.onready();
	};

	return that;
})();
var Lynx = Lynx || {};

Lynx.GameObject = function(pName,pX,pY,pWidth,pHeight){
	var that = {};

	var name = pName,
		x = pX,
		y = pY,
		collidingObject = new Lynx.Rectangle(pX,pY,pWidth,pHeight),
		collidable = true,
		resolveCollisions = false,
		canvas = new Lynx.Canvas("go_"+name),
		visible = true,
		lastXPos = pX,
		lastYPos = pY,
		frames = []; //Each frame is an asset. May want to rework to spritesheet later
		//but since you don't have much time let's forget it.

	that.Update = function(){};
	that.Draw = function(pScene){};
	that.oncollision = function(pEvent){};

	that.GetInstance = function(){
		return this;
	};
	
	that.GetName = function(){
		return name;
	};

	that.GetX = function(){
		return x;
	};

	that.GetY = function(){
		return y;
	};

	that.GetWidth = function(){
		return collidingObject.GetWidth();
	};

	that.GetHeight = function(){
		return collidingObject.GetHeight();
	};

	that.GetCollidingObject = function(){
		return collidingObject;
	};

	that.Collidable = function(){
		return collidable;
	};

	that.ResolveCollisions = function(){
		return resolveCollisions;
	};

	that.IsVisible = function(){
		return visible;
	};

	that.GetLastPosition = function(){
		return {
			x: lastXPos,
			y: lastYPos
		};
	};

	that.GetLastUpdate = function(){
		var lastUpdate = "";

		if(x != lastXPos)
			lastUpdate += "x";
		if(y != lastYPos)
			lastUpdate += "y";

		return lastUpdate;
	};

	that.GetFrames = function(){
		return frames;
	};

	that.SetName = function(pName){
		name = pName;
		canvas.SetId("go_"+pName);
	};

	that.SetX = function(pX){
		lastXPos = x;
		x = pX;
		collidingObject.SetX(pX);
	};

	that.SetY = function(pY){
		lastYPos = y;
		y = pY;
		collidingObject.SetY(pY);
	};


	that.SetCollidable = function(pBool){
		collidable = pBool;
	};

	that.SetCollisions = function(pColl){
		resolveCollisions = pColl;
	};

	that.SetVisible = function(){
		visible = true;
	};

	that.Hide = function(){
		visible = false;
	};

	that.SetFrames = function(pArray){
		frames = pArray;
	};

	that.Collides = function(pObject){
		var coll = Lynx.CollisionFactory.Collides(that,pObject);
		return coll;
	};

	that.WillCollide = function(pX,pY,pArray){
		return Lynx.CollisionFactory.WillCollide(that,x+pX,y+pY,pArray);
	};

	return that;
};
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
		}
		if(pType == that.EventType.DOWN){
			if(typeof downFunctions[pKeycode] == 'undefined'){
				downFunctions[pKeycode] = [];
			}

			downFunctions[pKeycode].push(pCallback);
		}
		if(pType == that.EventType.HOLD){
			if(typeof holdFunctions[pKeycode] == 'undefined'){
				holdFunctions[pKeycode] = [];
			}

			holdFunctions[pKeycode].push(pCallback);
		}
	};

	that.PushMouseEvent = function(pMouseObject){
		mouseObjects.push(pMouseObject);
	};

	that.MouseObject = function(pRect){
		var rect = pRect;
		return {
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
					co.onHover();
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

		Lynx.Game.GetViewport().GetCanvasElement().addEventListener("mousemove",onMouseMove,false);
		Lynx.Game.GetViewport().GetCanvasElement().addEventListener("mousedown",onMouseDown,false);
		Lynx.Game.GetViewport().GetCanvasElement().addEventListener("mouseup",onMouseUp,false);
		Lynx.Game.GetViewport().GetCanvasElement().addEventListener("keydown",onKeyDown,false);
		Lynx.Game.GetViewport().GetCanvasElement().addEventListener("keyup",onKeyUp,false);
	};

	that.ParseKeyCode = function(pKey){
/*
*
*	This class has been scheduled for REMOVAL from the core.
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
var Lynx = Lynx || {};

Lynx.Logger = new (function(){
	var that = {};

	var logDiv = null;

	that.Log = function(pMessage,pLevel){
		var ct = (Lynx.Time.GetTimeTotal() / 1000).toFixed(1);
		
		if(typeof pLevel == 'undefined')
			pLevel = Lynx.LogLevel.INTERNAL;
		if(Lynx.Settings.DebugEnabled && pLevel <= Lynx.Settings.LoggerLevel){
			if(logDiv != null){
				logDiv.innerHTML += "<br/>"+"["+ct+"] "+Lynx.LogLevel.Parse(pLevel)+": "+pMessage;
				logDiv.scrollTop = logDiv.scrollHeight;
			}
			console.log("["+ct+"] LYNX - "+Lynx.LogLevel.Parse(pLevel)+": "+pMessage);
		}
	};

	that.DesignateLogger = function(pLogDiv){
		logDiv = pLogDiv;
	};

	return that;
})();
var Lynx = Lynx || {};

Lynx.LogLevel= {
	DEV: 6,
	INTERNAL: 5,
	INFO: 4,
	DEBUG: 3,
	WARNING: 2,
	ERROR: 1,
	FATAL_ERROR: 0,
	Parse: function(pLogLevelID){
		var type = "INTERNAL";
		switch(pLogLevelID){
			case 0:
				type = "FATAL_ERROR";
			break;
			case 1:
				type = "ERROR";
			break;
			case 2:
				type = "WARNING";
			break;
			case 3:
				type = "DEBUG";
			break;
			case 4:
				type = "INFO";
			break;
			case 5:
				type = "INTERNAL";
			break;
			case 6:
				type = "DEV";
			break;
		}

		return type;
	}
};
var Lynx = Lynx || {};

Lynx.Map= function(pWidth,pHeight){
	var that = {};

	var width = pWidth,
		height = pHeight,
		x = 0,
		y = 0,
		objects = [];

	that.GetWidth = function(){
		return width;
	};

	that.GetHeight = function(){
		return height;
	};

	that.GetX = function(){
		return x;
	};

	that.GetY = function(){
		return y;
	};

	that.GetObjects = function(){
		return objects;
	};

	that.SetWidth = function(pWidth){
		width = pWidth;
	};

	that.SetHeight = function(pHeight){
		height = pHeight;
	};

	that.SetX = function(pX){
		x = pX;
	};

	that.SetY = function(pY){
		y = pY;
	};

	that.AddObject = function(pObject){
		objects.push(pObject);
	};

	return that;
};
var Lynx = Lynx || {};

Lynx.Quadtree= function(pLevel,pBounds){
	var that = {},
		level = pLevel,
		bounds = pBounds,
		nodes = [],
		objects = [];
	
	that.MAX_OBJECTS = 8;
	that.MAX_LEVELS = 32;
	
	that.Clear = function(){
		objects = [];
		for(var i in nodes){
			if(nodes[i] != null){
				nodes[i] = null;
			}
		}
	};

	that.Split = function(){
		var subWidth = (bounds.GetWidth()/2),
			subHeight = (bounds.GetHeight()/2),
			x = bounds.GetX(),
			y = bounds.GetY();

		nodes[0] = new Lynx.Quadtree(level+1,new Lynx.Rectangle(x+subWidth,y,subWidth,subHeight));
		nodes[1] = new Lynx.Quadtree(level+1,new Lynx.Rectangle(x,y,subWidth,subHeight));
		nodes[2] = new Lynx.Quadtree(level+1,new Lynx.Rectangle(x,y+subHeight,subWidth,subHeight));
		nodes[3] = new Lynx.Quadtree(level+1,new Lynx.Rectangle(x+subWidth,y+subHeight,subWidth,subHeight));
	};

	that.GetIndex = function(pRect){
		var index = -1,
			vMidpoint = bounds.GetX() + (bounds.GetWidth() / 2),
			hMidpoint = bounds.GetY() + (bounds.GetHeight() /2);
		var topQuadrant =  (pRect.GetY() < hMidpoint && pRect.GetY() + pRect.GetHeight() < hMidpoint),
			bottomQuadrant = (pRect.GetY() > hMidpoint);
		
		if (pRect.GetX() < vMidpoint && pRect.GetX() + pRect.GetWidth() < vMidpoint) {
			if (topQuadrant) {
				index = 1;
			}
			if (bottomQuadrant) {
				index = 2;
			}
		}
		if (pRect.GetX() > vMidpoint) {
			if (topQuadrant) {
				index = 0;
			}
			if (bottomQuadrant) {
				index = 3;
			}
		}

		return index;
	};

	that.Insert = function(pObject){
		if(nodes[0] != null){
			var index = that.GetIndex(pObject);

			if(index != -1){
				nodes[index].Insert(pObject);
				return;
			}
		}

		objects.push(pObject);
		if(objects.length > that.MAX_OBJECTS && level < that.MAX_LEVELS){
			if(nodes[0] == null){
				that.Split();
			}

			var i = 0;
			while(i < objects.length){
				var index = that.GetIndex(objects[i]);
				if(index != -1){
					nodes[index].Insert(objects[i]);
					objects.splice(i,1);
				}else{
					i++;
				}
			}
		}
	};

	that.GetChildObjects = function(){
		var returnObjects = objects;
		if(nodes[0] != null){
			objects.concat(nodes[0].GetChildObjects());
		}
		return returnObjects
	};

	that.Retrieve = function(pObjects,pRect){
		var index = that.GetIndex(pRect);
		var testObjects = [];
		if(index != -1 && nodes[0] != null){
			testObjects = nodes[index].Retrieve(pObjects,pRect);
		}else{
			testObjects = that.GetChildObjects();
		}
		pObjects = pObjects.concat(testObjects);
		return pObjects;
	};

	return that;
};

var Lynx = Lynx || {};

Lynx.Rectangle= function(pX,pY,pWidth,pHeight){
	var that = {};

	var x = pX,
		y = pY,
		width = pWidth,
		height = pHeight;	

	that.GetX = function(){
		return x;
	};

	that.GetY = function(){
		return y;
	};

	that.GetWidth = function(){
		return width;
	};

	that.GetHeight = function(){
		return height;
	};

	that.GetArea = function(){
		return width*height;
	};

	that.GetPerimeter = function(){
		return (2*width)+(2*height);
	};
	
	//Accessors - SETS
	that.SetX = function(pX){
		x = pX;
	};

	that.SetY = function(pY){
		y = pY;
	};

	that.SetWidth = function(pWidth){
		width = pWidth;
	};

	that.SetHeight = function(pHeight){
		height = pHeight;
	};

	return that;
};
var Lynx = Lynx || {};

Lynx.Scene = function(name){
	var that = {};

	var name = name,
		bgm = false,
		objects = [],
		canvas = new Lynx.Canvas("LSCENE-"+name),
		map = new Lynx.Map(100,100);

	that.Open = function(){};
	that.Update = function(){};
	that.End = function(){};

	that.GetName = function(){
		return name;
	};

	that.GetBGM = function(){
		return bgm;
	};

	that.GetObjects = function(){
		return objects;
	};

	that.GetAllObjects = function(){
		return objects;
	};

	that.GetCanvas = function(){
		return canvas;
	};

	that.GetCanvasElement = function(){
		return canvas.GetCanvasElement();
	};

	that.GetMap = function(){
		return map;
	};

	that.SetName = function(pName){
		name = pName;
	};

	that.ChangeBGM = function(pBgm,play){
		if(bgm != false){
			bgm.Pause();
		}
		bgm = pBgm;
		if(typeof play != 'undefined' && play){
			bgm.Play(true);
		}
		Lynx.Logger.Log("Changed bgm of scene '"+name+"' to '"+bgm.GetRef()+"'",Lynx.LogLevel.INFO);
	};

	that.AddObject = function(pGameObject){
		objects.push(pGameObject);
	};
	that.GetIndex = function(pObject){
		var index = -1;
		for(var i in objects){
			if(objects[i].GetName() = pObject.GetName())
				index = i;
		}
		return index;
	};

	Lynx.Scene.RemoveObject = function(pIndex){
		objects.splice(pIndex,1);
	};

	that.Draw = function(){
		var ctx = canvas.GetContext();
		ctx.clearRect(0,0,canvas.GetWidth(),canvas.GetHeight());
		for(var i in objects){
			var realX = objects[i].GetX() - map.GetX();
			var realY = objects[i].GetY() - map.GetY();
			if(realX+objects[i].GetWidth() >= 0 && realY+objects[i].GetHeight() >= 0)
				objects[i].Draw(that);
		}
	};

	return that;
};
var Lynx = Lynx || {};

Lynx.Settings = {
	DebugEnabled: true,
	LoggerLevel: Lynx.LogLevel.INTERNAL,
	EnableDeveloperTools: true,
	ShowAdvancedMetrics: false,
//False when new collisions are done.
	UseOldCollisions: true,
//RequireMouse: Disable if you don't use mouse input to cut down update time.
	RequireMouse: true,
	LibraryDirectory: "src"
};
var Lynx = Lynx || {};

Lynx.Time= new (function(params){
	var that = {};

	var lastUpdate = Date.now(),
		now = Date.now();
		var gameDelta = 0;
		var totalTime = 0;

	that.GetDelta = function(){
		return gameDelta;
	};

	that.GetTimeTotal = function(){
		return totalTime;
	};

	that.Tick = function(){
		lastUpdate = now;
		now = Date.now();
		gameDelta = now - lastUpdate;
		totalTime = totalTime + gameDelta;
	};
	
	return that;
})();
