(function(){
	new Lynx.ShaderComponent("fs-default", "fragment", function(){
		this.Prefix = "precision mediump float;";
		this.Uniform("vec4", "color");

		this.Main = function(){
			return "gl_FragColor = u_color;";
		};

		this.SetColor = function(pGl, p1, p2, p3, p4)
		{
			var colorPosition = pGl.getUniformPosition()
		}
	});
})();