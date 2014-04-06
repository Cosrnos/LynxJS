(function(){
	new Lynx.ShaderComponent("fs-default", "fragment", function(){
		this.Prefix = (function(){
			return ([
				"precision mediump float;",
				"int currentColorValue = 0;",
				"vec4 rgbaValue = vec4(0, 0, 0, 1);"
			]).join("\n");
		})();
		this.Uniform("int", "color");

		this.Main = function(){
			var mainFunc = ([
				"if(currentColorValue != u_color) {",
				"  float rValue = float(u_color / 256 / 256);",
				"  float gValue = float(u_color / 256 - int(rValue * 256.0));",
				"  float bValue = float(u_color - int(rValue * 256.0 * 256.0) - int(gValue * 256.0));",
				"  rgbaValue = vec4(rValue / 255.0, gValue / 255.0, bValue / 255.0, 1.0);",
				"  currentColorValue = u_color;",
				"}",
				"gl_FragColor = rgbaValue;",
			]).join("\n");
			return mainFunc;
		};
	});
})();