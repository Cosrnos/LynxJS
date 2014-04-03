(function(){
	new Lynx.ShaderComponent("vs-default", "vertex", function(){
		this.Attribute("vec2","position");
		this.Uniform("vec2", "resolution");

		this.Main = function(){
			return "gl_Position = vec4((a_position / u_resolution * 2.0 - 1.0) * vec2(1.0, -1.0), 0.0, 1.0);";
		};
	});
})();