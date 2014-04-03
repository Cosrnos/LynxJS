/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    File Name: Renderer.js
*    Description: The Renderer is attached to a canvas element, and provides respective methods for webgl and 2d context
*    Global Variables: Lynx.Animator{}
*/

Lynx.Renderer = function(pCanvas){
	var that = {};

	if(!Lynx.Canvas) //To prevent load time errors
		return that;

	that.Parent = pCanvas;
	var context = pCanvas.Ctx(Lynx.DefaultContext);

	that.RefreshContext = function(){
		context = that.Parent.Ctx(Lynx.DefaultContext);
		if(Lynx.DefaultContext != "2d")
			that.__refreshGL();
	}

	that.AddShader = function(pShader)
	{
		if(shaders.hasOwnProperty(pShader.Name))
			return false;

		shaders[pShader.Name] = pShader;
	}

	if(Lynx.DefaultContext == "2d")
	{
		//Bind the 2d Canvas Methods
		that.Clear = function(){
			context.clearRect(0,0, pCanvas.Width, pCanvas.Height);
		};

		that.SetColor = function(pColor)
		{
			context.fillStyle = pColor;
		};

		that.Shape = function(pShape)
		{
			if(typeof pShape.Width != 'undefined')
			{
				context.fillRect(pShape.X, pShape.Y, pShape.Width, pShape.Height);
			}
		}
	}
	else
	{
		//Bind the WebGL Methods and initialize
		var gl = context; //Just to make things easier
		var buffer = null;
		var positionLocation = 0;
		var resolutionLocation = null;
		var colorLocation = null;
		var programs = [];
		var program = null; //the one in use at the moment.
		var shaders = [];
		var ready = false;

		that.__refreshGL = function()
		{
			gl = context;
			gl.viewport(0, 0, that.Parent.Width, that.Parent.Height);
			
			//Clear current programs and shaders.
			shaders = [];
			programs = [];

			that.LoadShader("vs-default", function(pName){
				that.LoadShader("fs-default", function(pSecName){
					var vertexShader = that.CompileShader(pName);					
					var fragmentShader = that.CompileShader(pSecName);
					program = that.CompileProgram(vertexShader, fragmentShader);

					if(!program)
						return false;
					gl.useProgram(program);

					//TODO: Variable Positions Dynamically applied.
					positionLocation = gl.getAttribLocation(program, "a_position");
					colorLocation = gl.getUniformLocation(program, "u_color");
					resolutionLocation = gl.getUniformLocation(program, "u_resolution");

					gl.uniform2f(resolutionLocation, this.Parent.Width, this.Parent.Height);

					buffer = gl.createBuffer();
					gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
					gl.enableVertexAttribArray(positionLocation);
					gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

					Lynx.Log("Finished loading shaders...");
				});
			});
		}

		that.Clear = function(){
			gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
		};

		that.LoadShader = function(pName, pLoadCallback)
		{
			if(document.getElementById("lynx-shader-"+pName) != null)
				return;

			var script = document.createElement("script");
			script.id = "lynx-shader-"+pName;
			script.type = "text/javascript";
			script.async = false;

			script.addEventListener("load", function(){
				Lynx.Log("Loaded shader '"+pName+"'");
				pLoadCallback.bind(that)(pName);
			}, false);

			script.src = Lynx.Filepath+"shaders/"+pName+".js";
			document.body.appendChild(script);
		}

		that.CompileShader = function(pName)
		{
			var shaderC = Lynx.Shaders.Get(pName);
			if(!shaderC)
				return false;

			var shader = gl.createShader(((shaderC.Type == Lynx.Shaders.Type.Vertex) ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER));
			gl.shaderSource(shader, shaderC.Compile());
			gl.compileShader(shader);

			var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
			if(!compiled)
			{
				var lastError = gl.getShaderInfoLog(shader);
				Lynx.Error("Error compiling shader '" + pName + "': " + lastError);
				gl.deleteShader(shader);
				return;
			}

			shaders.push(shader);
			return shader;
		}

		that.CompileProgram = function()
		{
			if(arguments.length < 2)
			{
				Lynx.Warning("Could not compile WebGL Program. At least one Vertex Shader and one Fragment Shader must be provided.");
				return;
			}

			var tempProgram = gl.createProgram();

			for(var ii = 0; ii < arguments.length; ii++)
				gl.attachShader(tempProgram, arguments[ii]);

			gl.linkProgram(tempProgram);
			if(!gl.getProgramParameter(tempProgram, gl.LINK_STATUS))
				return false;

			programs.push(tempProgram);
			return tempProgram;
		}

		that.Render = (function(pObject)
		{
			if(pObject.Render)
				return pObject.Render(gl);
		
			gl.uniform4f(colorLocation, 1.0, 1.0, 1.0, 1.0);

			//sample only
			var buildArray = [];

			if(!(pObject instanceof Array))
				pObject = [pObject];

			for(var i = 0; i < pObject.length; i++)
				buildArray = this.putRect(buildArray, pObject[i].X, pObject[i].Y, pObject[i].Width, pObject[i].Height);

			var errors = gl.getError();
			if(errors)
				console.log(errors);
			
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buildArray), gl.STATIC_DRAW);

			gl.drawArrays(gl.TRIANGLES, 0, buildArray.length/2);
		}).bind(that);

		that.putRect = function(pBuildArray, pX, pY, pWidth, pHeight)
		{
			var x2 = pX + pWidth;
			var y2 = pY + pHeight;

			return pBuildArray.concat([
				pX, pY,
				pX, y2,
				x2, y2,
				x2, y2,
				x2, pY,
				pX, pY
				]);
		}

		that.__refreshGL();
	}

	return that;
};