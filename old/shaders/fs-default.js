(function () {
	new Lynx.ShaderComponent("fs-default", "fragment", function () {
		this.Prefix = (function () {
			return ([
				"precision mediump float;",
			]).join("\n");
		})();
		this.Uniform("vec4", "color");
		this.Uniform("sampler2D", "image");
		this.Varying("vec2", "texCoord");

		this.Main = function () {
			var mainFunc = ([
				"gl_FragColor = texture2D(u_image, v_texCoord.st) * u_color;",
				"if(gl_FragColor.a == 0.0)",
				" discard;"
			]).join("\n");
			return mainFunc;
		};
	});
})();
