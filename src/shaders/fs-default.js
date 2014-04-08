(function(){
	new Lynx.ShaderComponent("fs-default", "fragment", function(){
		this.Prefix = (function(){
			return ([
				"precision mediump float;",
			]).join("\n");
		})();
		this.Uniform("vec4", "color");

		this.Main = function(){
			var mainFunc = ([
				"gl_FragColor = u_color;",
			]).join("\n");
			return mainFunc;
		};
	});
})();