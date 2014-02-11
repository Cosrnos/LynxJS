var Lynx = Lynx || {};

Lynx.ComponentManager = (function(){
	var that = {};
	var components = [];
	var totalComp = 0;
	var ready = true;

	that.Load = function(pString){
		if(this.Contains(pString)){
			return;
		}

		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.type = 'text/javascript';
		var now = new Date();
		script.src = Lynx.Settings.LibraryDirectory+"/components/"+pString+".js?nocache="+now.getTime();
		head.appendChild(script);
		ready = false;
		totalComp++;
	};

	that.Contains = function(pString){
		for(var i in components){
			if(components[i].Name == pString)
				return true;
		}
		return false;
	}

	that.AllReady = function(){
		return ready;
	};

	that.Register = function(pComponentObject){
		for(var i in components){
			if(pComponentObject.ConflictsWith(components.Name))
				return;
		}
		components.push(pComponentObject);
		pComponentObject.onLoad();
	};

	that.GetComponent = function(pName){
		for(var i in components){
			if(components[i].Name == pName){
				return components[i];
			}
		}
	};

	that.onReady = function(){};

	that.Update = function(currentScene){
		if(!ready && components.length >= totalComp){
			ready = true;
			this.onReady();
		}
		for(var i in components){
			components[i].Update(currentScene);
		}
	};

	that.Draw = function(){
		for(var i in components){
			components[i].Draw();
		}
	};

	return that;
})();