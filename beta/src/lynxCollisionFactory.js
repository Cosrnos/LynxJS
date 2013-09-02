var Lynx = Lynx || {};

Lynx.CollisionFactory= (function(){
	var that = {};

	var quad = -1,
		collisionsThisUpdate = 0,
		collisionsLastUpdate = 0;

	that.GetTotalCollisions = function(){
		return Math.floor((collisionsThisUpdate+collisionsLastUpdate)/2);
	};
		
	that.Init = function(){
		quad = new Lynx.Quadtree(0,new Lynx.Rectangle(0,0,Lynx.Game.GetScreenWidth(),Lynx.Game.GetScreenHeight()));
	};

	that.Update = function(pArray){
		collisionsLastUpdate = collisionsThisUpdate;
		collisionsThisUpdate = 0;
		quad.Clear();
		var returnObjects = [];

		for(var index in pArray){
			if(pArray[index].Collidable()){
				quad.Insert(pArray[index]);
			}
		}
		for(var i in pArray){
			returnObjects = [];
			returnObjects = quad.Retrieve(returnObjects,pArray[i]);

			for(var x in returnObjects){
				if(returnObjects[x] != pArray[i] && pArray[i].ResolveCollisions()){
					if(that.Collides(pArray[i],returnObjects[x])){
						//Resolve
							var e = {
								resolved: false,
								collidingObject: null,
								interactingObject: null
								},
								n = 0;
							while(!e.resolved && n < 5){
								if(!e.resolved){
									e.collidingObject = returnObjects[x];
									e.interactingObject = pArray[i];
									pArray[i].oncollision(e);
								}

								if(!e.resolved){
									e.collidingObject = pArray[i];
									e.interactingObject = returnObjects[x];
									returnObjects[x].oncollision(e);
								}

								if(!e.resolved){
									e.resolved = pArray[i].Collides(returnObjects[x]);
								}

								n++;
							}

							if(!e.resolved){
								Lynx.Logger.Log("Could not resolve collision between colliding objects "+pArray[i].GetName()+" and "+returnObjects[x].GetName()+". Exiting...",Lynx.LogLevel.DEBUG);
							}else{
								collisionsThisUpdate++;
							}
					}
				}
			}
		}
	};

	that.WillCollide = function(pObj,x,y,pArray){
		var obj = {};
			obj = pObj;
		var lx = obj.GetX();
		var ly = obj.GetY();
		pObj.SetX(x);
		pObj.SetY(y);
		quad.Clear();
		for(var index in pArray){
			if(pArray[index].Collidable()){
				quad.Insert(pArray[index]);
			}
		}
		var result = false;
		var testObjects = quad.Retrieve(pArray,pObj);
		for(var i in testObjects){
			if(testObjects[i] != pObj){
				if(that.Collides(pObj,testObjects[i])){
					result = true;
				}
			}
		}
		pObj.SetX(lx);
		pObj.SetY(ly);
		return result;
	};

	that.Collides = function(a,b){
		var c = (a.GetX() < b.GetX() + b.GetWidth() &&
				a.GetX() + a.GetWidth() > b.GetX() &&
				a.GetY() < b.GetY() + b.GetHeight() &&
				a.GetY() + a.GetHeight() > b.GetY());
		return c;
	};

	return that;
})();