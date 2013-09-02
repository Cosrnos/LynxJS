var Lynx = Lynx || {};

Lynx.Quadtree= function(pLevel,pBounds){
	var that = {},
		level = pLevel,
		bounds = pBounds,
		nodes = [],
		objects = [];
	
	that.MAX_OBJECTS = 8;
	that.MAX_LEVELS = 32;
	
	that.Clear = function(){
		objects = [];
		for(var i in nodes){
			if(nodes[i] != null){
				nodes[i] = null;
			}
		}
	};

	that.Split = function(){
		var subWidth = (bounds.GetWidth()/2),
			subHeight = (bounds.GetHeight()/2),
			x = bounds.GetX(),
			y = bounds.GetY();

		nodes[0] = new Lynx.Quadtree(level+1,new Lynx.Rectangle(x+subWidth,y,subWidth,subHeight));
		nodes[1] = new Lynx.Quadtree(level+1,new Lynx.Rectangle(x,y,subWidth,subHeight));
		nodes[2] = new Lynx.Quadtree(level+1,new Lynx.Rectangle(x,y+subHeight,subWidth,subHeight));
		nodes[3] = new Lynx.Quadtree(level+1,new Lynx.Rectangle(x+subWidth,y+subHeight,subWidth,subHeight));
	};

	that.GetIndex = function(pRect){
		var index = -1,
			vMidpoint = bounds.GetX() + (bounds.GetWidth() / 2),
			hMidpoint = bounds.GetY() + (bounds.GetHeight() /2);
		var topQuadrant =  (pRect.GetY() < hMidpoint && pRect.GetY() + pRect.GetHeight() < hMidpoint),
			bottomQuadrant = (pRect.GetY() > hMidpoint);
		
		if (pRect.GetX() < vMidpoint && pRect.GetX() + pRect.GetWidth() < vMidpoint) {
			if (topQuadrant) {
				index = 1;
			}
			if (bottomQuadrant) {
				index = 2;
			}
		}
		if (pRect.GetX() > vMidpoint) {
			if (topQuadrant) {
				index = 0;
			}
			if (bottomQuadrant) {
				index = 3;
			}
		}

		return index;
	};

	that.Insert = function(pObject){
		if(nodes[0] != null){
			var index = that.GetIndex(pObject);

			if(index != -1){
				nodes[index].Insert(pObject);
				return;
			}
		}

		objects.push(pObject);
		if(objects.length > that.MAX_OBJECTS && level < that.MAX_LEVELS){
			if(nodes[0] == null){
				that.Split();
			}

			var i = 0;
			while(i < objects.length){
				var index = that.GetIndex(objects[i]);
				if(index != -1){
					nodes[index].Insert(objects[i]);
					objects.splice(i,1);
				}else{
					i++;
				}
			}
		}
	};

	that.GetChildObjects = function(){
		var returnObjects = objects;
		if(nodes[0] != null){
			objects.concat(nodes[0].GetChildObjects());
		}
		return returnObjects
	};

	that.Retrieve = function(pObjects,pRect){
		var index = that.GetIndex(pRect);
		var testObjects = [];
		if(index != -1 && nodes[0] != null){
			testObjects = nodes[index].Retrieve(pObjects,pRect);
		}else{
			testObjects = that.GetChildObjects();
		}
		pObjects = pObjects.concat(testObjects);
		return pObjects;
	};

	return that;
};
