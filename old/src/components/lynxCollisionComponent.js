/*
*
*	This component has been created by the LynxJS Team
*	and is managed by the Team. For more information, please
*	visit lynx.cosrnos.com/supported-components/
*
*/
var LC = LC || {};

LC.CollisionComponent = (function(){
	var that = new Lynx.Component();

	that.Name = "lynxCollisionComponent";
	that.Author = "LynxTeam";
	that.Version = "0.1";

	//Component Methods
	that.Update = function(scene){
		var objs = scene.GetObjects();
		for(var i in objs){
			var co = objs[i];
			for(var x in objs){
				var to = objs[x];
				if(to.GetName() != co.GetName()){
					if(this.Collides(co,to))
						Lynx.CollisionFactory_New.Notify(co,to);
				}
			}
		}
	};

	that.Collides = function(a,b){
		var c = (a.GetX() < b.GetX() + b.GetWidth() &&
				a.GetX() + a.GetWidth() > b.GetX() &&
				a.GetY() < b.GetY() + b.GetHeight() &&
				a.GetY() + a.GetHeight() > b.GetY());
		return c;
	};

	that.onLoad = function(){
		this.Log("Component loaded successfully!");
	};

	that.Register();

	return that;
})();