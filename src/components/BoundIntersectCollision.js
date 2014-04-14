/*
*    Lynx Project
*    Started August 2013
*    ------------------------------------------------------
*    This file is covered under the LynxJS Game Library
*    License. Please read license.txt for more information
*    on usage of this library.
*    ------------------------------------------------------
*    Component Name: BoundIntersectCollision
*    Author: Cosrnos
*    Description: Collision detection using the bounds intersect method and a quadtree.
*/


(function(){
	var name = "BoundIntersectCollision";
	var auth = "Cosrnos";
	var desc = "Collision detection using the bounds intersect method and a quadtree.";

	var build = function(){
		var _tree = new Lynx.Quadtree(0, 2, 4, new Lynx.Rect(0, 0, Lynx.Scene.Width, Lynx.Scene.Height));

		this.On("Update", function(pEvent, pSender)
		{
			_tree.Clear();

			for(var i = 0; i < Lynx.Scene.Entities.length; i++)
				_tree.Insert(Lynx.Scene.Entities[i]);

			for(var x = 0; x < Lynx.Scene.Entities.length; x++)
			{
				var tObj = Lynx.Scene.Entities[x];
				var testArr = _tree.GetInRegion(tObj.Bounds);
				for(var y = 0; y < testArr.length; y++)
				{
					var sObj = testArr[y];
					if(!(sObj.X + sObj.Width < tObj.X || sObj.Y + sObj.Height < tObj.Y || sObj.Y > tObj.Y + tObj.Height || sObj.X > tObj.X + tObj.Width))
					{
						Lynx.Emit("Collision.Found", { T: tObj, S: sObj });						
					}
				}
			}

			return true;
		});
	};

	Lynx.Component(name, auth, desc, build);
})();