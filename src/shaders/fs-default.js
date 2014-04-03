(function(){
	new Lynx.ShaderComponent("fs-default", "fragment", function(){
		this.Prefix = "precision mediump float;";
		this.Uniform("vec4", "color");

		this.Main = function(){
			return "gl_FragColor = u_color;";
		};
	});
})();