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

	//Properties
	that.BatchSize = 1500;

	if(!Lynx.Canvas) //To prevent load time errors
		return that;

	that.Parent = pCanvas;
	var context = pCanvas.Ctx(Lynx.DefaultContext);

	/**
	* Description: Builds the rendering context and associated values
	*
	* @this {Lynx.Renderer}
	*/
	that.RefreshContext = function(){
		context = that.Parent.Ctx(Lynx.DefaultContext);

		that.__refreshGL();
	}

	/**
	* Description: The method called to sort the array objects for rendering optimization.
	* 
	* @this {Lynx.Renderer}
	* @param {Lynx.CanvasElement} <pA> The first object
	* @param {Lynx.CanvasElement} <pB> The second object
	* @return {int} See array.prototype.sort for more info
	*/
	that.SortMethod = function(pA, pB)
	{
		if(pA.Color.Hex == pB.Color.Hex)
			return 0;
		if(pA.Color.Hex > pB.Color.Hex)
			return 1;

		return -1;
	};

	if(Lynx.DefaultContext == "2d")
	{
		var buffer = null,
		ctx = null;

		var lastFillColor = 0;
		/**
		* Description: Clears the 2d Canvas
		*
		* @this {Lynx.Renderer}
		*/
		that.Clear = function(){
			ctx.clearRect(0,0, buffer.width, buffer.height);
			context.clearRect(0,0, this.Parent.Width, this.Parent.Height);
		};

		/**
		* Description: Renders the 2D Scene using the fallback canvas 2d context
		*
		* @this {Lynx.Renderer}
		* @param {Lynx.CanvasElement[]} <pObject> the object(s) to render
		*/
		that.Render = function(pObject)
		{
			if(!(pObject instanceof Array))
				pObject = [pObject];

			for(var i = 0; i < pObject.length; i++)
			{
				if(pObject[i].FBRender)
				{
					pObject[i].FBRender(ctx);
					continue;
				}

				if(lastFillColor != pObject[i].Color)
				{
					if(pObject[i].Color)
						var newColor = "#"+pObject[i].Color.toString(16);
						ctx.fillStyle = newColor;
					
					lastFillColor = pObject[i].Color;
				}

				pObject[i].Draw(ctx);
			}
			context.drawImage(buffer, 0, 0, buffer.width, buffer.height);
		};

		/**
		* Description: Refreshes the internal context variables
		*
		* @this {Lynx.Renderer}
		*/
		that.__refreshGL = function()
		{
			buffer = document.createElement("canvas");
			buffer.width = this.Parent.Width;
			buffer.height = this.Parent.Height;
			ctx = buffer.getContext("2d");
		}
	}
	else
	{
		var gl = context;
		var buffer = null;
		var program = null,
			vertexShader = null,
			fragmentShader = null;
		var lastShaderColor = null;
		
		var ready = false;

		/**
		* Description: Refreshes the WebGL program and shaders.
		*
		* @this {Lynx.Renderer}
		*/
		that.__refreshGL = function()
		{
			gl = context;
			gl.viewport(0, 0, that.Parent.Width, that.Parent.Height);
			
			//Clear current programs and shaders.
			that.LoadShader("vs-default", function(pName){
				that.LoadShader("fs-default", function(pSecName){
					program = that.CompileProgram(that.CompileShader(pName), that.CompileShader(pSecName));

					if(!program)
						return false;

					gl.useProgram(program);

					vertexShader = Lynx.Shaders.Get(pName);
					fragmentShader = Lynx.Shaders.Get(pSecName);

					vertexShader.GetLocations(gl, program);
					fragmentShader.GetLocations(gl, program);

					gl.uniform2f(vertexShader.GetVariable("resolution").Location, this.Parent.Width, this.Parent.Height);

					buffer = gl.createBuffer();
					gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
					gl.enableVertexAttribArray(vertexShader.GetVariable("position").Location);
					gl.vertexAttribPointer(vertexShader.GetVariable("position").Location, 2, gl.FLOAT, false, 0, 0);

					Lynx.Log("Finished loading shaders...");
				});
			});
		}

		/**
		* Description: Clears the WebGL Buffers
		*
		* @this {Lynx.Renderer}
		*/
		that.Clear = function(){
			gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
		};

		/**
		* Description: Loads a dynamic webGL Shader then executes the provided callback
		*
		* @this {Lynx.Renderer}
		* @param {string} <pName> Name of the dynamic shader to load
		* @param {function<pShader>} A function to call when the shader is finished loading.
		*/
		that.LoadShader = function(pName, pLoadCallback)
		{
			if(document.getElementById("lynx-shader-"+pName) != null)
				return;

			var script = document.createElement("script");
			script.id = "lynx-shader-"+pName;
			script.type = "text/javascript";
			script.async = true;

			script.addEventListener("load", function(){
				if(Lynx.Debug)
					Lynx.Log("Loaded shader '"+pName+"'");
				
				pLoadCallback.bind(that)(pName);
			}, false);

			script.src = Lynx.Filepath+"shaders/"+pName+".js";
			document.body.appendChild(script);
		}

		/**
		* Description: Compiles the given shader
		*
		* @this {Lynx.Renderer}
		* @param {string} <pName> The name of the shader to compile
		* @return {WebGLShader} A compiled shader
		*/
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
				return false;
			}

			return shader;
		}

		/**
		* Description: Compiles a program with all compiled shaders.
		*
		* @this {Lynx.Renderer}
		* @return {WebGLProgram} The compiled program
		*/
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

			return tempProgram;
		}

		/**
		* Description: Renders the WebGL Scene
		*
		* @this {Lynx.Renderer}
		* @param {Lynx.CanvasElement} <pObject> The object(s) to render to the canvas.
		*/
		that.Render = (function(pObject)
		{
			if(!vertexShader || !fragmentShader)
				return false;
			
			//sample only
			var buildArray = [];

			if(!(pObject instanceof Array))
				pObject = [pObject];

			pObject.sort(this.SortMethod);

			for(var i = 0; i < pObject.length; i++)
			{
				if(pObject[i].Render)
				{
					pObject[i].Render(gl);
					continue;
				}

				if(pObject[i].Color.Hex != lastShaderColor)
				{
					renderBatch(buildArray);
					buildArray = [];
		
					if(pObject[i].Color.Hex != -1)
					{
						var c = pObject[i].Color;
						gl.uniform4f(fragmentShader.GetVariable("color").Location, c.R, c.G, c.B, 1.0);
					}

					lastShaderColor = pObject[i].Color.Hex;
				}

				pObject[i].GetVertices(buildArray);

				if(this.BatchSize <= buildArray.length / 2)
				{
					renderBatch(buildArray);
					buildArray = [];
				}
			}

			var errors = gl.getError();
			if(errors)
				console.log(errors);
			
			renderBatch(buildArray);
		}).bind(that);

		/**
		* Description: Renders the given array to the canvas
		*
		* @this {Lynx.Renderer}
		* @param {array} <pBuildArray> An array containing the vertices to render
		*/
		function renderBatch(pBuildArray)
		{
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pBuildArray), gl.STATIC_DRAW);
			gl.drawArrays(gl.TRIANGLES, 0, pBuildArray.length/2);			
		}
	}

	return that;
};