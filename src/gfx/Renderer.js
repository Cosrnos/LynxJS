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
		buffer = null;
		var positionLocation = 0;
		var resolutionLocation = null;
		var colorLocation = null;

		var vertexShader = [
			"attribute vec2 a_position;",
			"uniform vec2 u_resolution;",
			"void main(){",
			"    gl_Position = vec4((a_position / u_resolution * 2.0 - 1.0) * vec2(1.0, -1.0), 0.0, 1.0);",
			"}"
		].join("\n");
		var fragmentShader = [
			"precision mediump float;",
//			"uniform vec4 u_color;",
			"void main(){",
			" gl_FragColor = vec4(1, 1, 1, 1);",
			"}"
		].join("\n");

		that.Clear = function(){
			gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
		};

		that.CompileProgram = function(pGl, pVertexSrc, pFragmentSrc)
		{
			var program = pGl.createProgram();

			var vertexShader = pGl.createShader(pGl.VERTEX_SHADER);
			pGl.shaderSource(vertexShader, pVertexSrc);
			pGl.compileShader(vertexShader);

			var compiled = pGl.getShaderParameter(vertexShader, pGl.COMPILE_STATUS);
			if(!compiled)
			{
				    lastError = pGl.getShaderInfoLog(vertexShader);
				    Lynx.Log("*** Error compiling shader '" + vertexShader + "':" + lastError);
    				pGl.deleteShader(vertexShader);
    				return;
			}

			var fragmentShader = pGl.createShader(pGl.FRAGMENT_SHADER);
			pGl.shaderSource(fragmentShader, pFragmentSrc);
			pGl.compileShader(fragmentShader);

			var compiled = pGl.getShaderParameter(fragmentShader, pGl.COMPILE_STATUS);
			if(!compiled)
			{
				    lastError = pGl.getShaderInfoLog(fragmentShader);
				    Lynx.Log("*** Error compiling shader '" + fragmentShader + "':" + lastError);
    				pGl.deleteShader(fragmentShader);
    				return;
			}

			pGl.attachShader(program, vertexShader);
			pGl.attachShader(program, fragmentShader);
			pGl.linkProgram(program);

			if(!pGl.getProgramParameter(program, pGl.LINK_STATUS))
			{
				return false;
			}

			pGl.useProgram(program);

			return program;
		}

		that.Render = (function(pObject)
		{
			if(pObject.Render)
				return pObject.Render(gl);
 			
			if(!that.__program)
			{
				console.log("Render error");
				return;
			}

		
		//	gl.uniform4f(colorLocation, 1.0, 1.0, 1.0, 1.0);

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

			//Lynx.Log("Drew rectangle at "+pX+","+pY);
		}

		that.__program = that.CompileProgram(gl, vertexShader, fragmentShader);

		that.__refreshGL = function()
		{
			gl = context;
			gl.viewport(0, 0, that.Parent.Width, that.Parent.Height);
			that.__program = that.CompileProgram(gl, vertexShader, fragmentShader);
			gl.useProgram(that.__program);

			positionLocation = gl.getAttribLocation(that.__program, "a_position");
		//	colorLocation = gl.getUniformLocation(that.__program, "u_color");
			resolutionLocation = gl.getUniformLocation(that.__program, "u_resolution");

			gl.uniform2f(resolutionLocation, this.Parent.Width, this.Parent.Height);
		
			buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.enableVertexAttribArray(positionLocation);
			gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

			gl.useProgram(that.__program);
		}

		that.__refreshGL();
	}

	return that;
};