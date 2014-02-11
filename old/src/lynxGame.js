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
		currentScene = null,
		viewportId = null;

	that.$ = {};

	that.onReady = function(){};

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

	that.GetViewportId = function(){
		return viewportId;
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

		if(currentScene != null){
			var c = currentScene.GetCanvas();
			c.SetWidth(Lynx.Game.GetScreenWidth());
			c.SetHeight(Lynx.Game.GetScreenHeight());
			bufferCanvas.SetWidth(screenWidth);
			bufferCanvas.SetHeight(screenHeight)
			currentScene.Draw();
			Lynx.ComponentManager.Draw(currentScene);
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
		Lynx.ComponentManager.Update(currentScene);
		
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
		Lynx.Logger.Log("Set Game name property to "+pName);
		name = pName;
		Lynx.Logger.Log("Initializing Primary Canvas...",Lynx.LogLevel.INFO);
		canvas = new Lynx.Canvas(pCanvasId);
		screenWidth = canvas.GetWidth();
		screenHeight = canvas.GetHeight();
		viewportId = pCanvasId;
		context = canvas.GetContext();

		
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
		that.onReady();
	};

	return that;
})();