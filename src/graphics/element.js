(function() {
	function elementModel() {
        Lynx.Object.apply(this);

		var x = 0;
		var y = 0;
		var z = 0;

		var width = 0;
		var height = 0;
		var depth = 0;

        var color = Lynx.Graphics.Color.create();
        var stroke = {
            color: Lynx.Graphics.Color.create(),
            width: "0px"
        };

        this.render = function(target, isBatch){
            if(!isBatch){
                target.fillStyle = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
            }

            target.fillRect(x, y, width, height);
        };

        Object.defineProperty(this, 'x', {
            get: function(){
                return x;
            },
            set: function(value){
                if(typeof value === 'number' && !isNaN(value)){
                    x = value;
                }else{
                    Lynx.Logger.warn('Cannot set property x to value `'+value+'` as it is not a number.');
                }
            }
        });

        Object.defineProperty(this, 'y', {
            get: function(){
                return y;
            },
            set: function(value){
                if(typeof value === 'number' && !isNaN(value)){
                    y = value;
                }else{
                    Lynx.Logger.warn('Cannot set property y to value `'+value+'` as it is not a number.');
                }
            }
        });

        Object.defineProperty(this, 'z', {
            get: function(){
                return z;
            },
            set: function(value){
                if(typeof value === 'number' && !isNaN(value)){
                    z = value;
                }else{
                    Lynx.Logger.warn('Cannot set property z to value `'+value+'` as it is not a number.');
                }
            }
        });

        Object.defineProperty(this, 'width', {
            get: function(){
                return width;
            },
            set: function(value){
                if(typeof value === 'number' && !isNaN(value)){
                    width = value;
                }else{
                    Lynx.Logger.warn('Cannot set property width to value `'+value+'` as it is not a number.');
                }
            }
        });

        Object.defineProperty(this, 'height', {
            get: function(){
                return height;
            },
            set: function(value) {
                if (typeof value === 'number' && !isNaN(value)) {
                    height = value;
                } else {
                    Lynx.Logger.warn('Cannot set property height to value `' + value + '` as it is not a number.');
                }
            }
        });

        Object.defineProperty(this, 'depth', {
            get: function(){
                return depth;
            },
            set: function(value){
                if(typeof value === 'number' && !isNaN(value)){
                    depth = value;
                } else {
                    Lynx.Logger.warn('Cannot set property height to value `'+ value +'` as it is not a number.');
                }
            }
        });

        Object.defineProperty(this, 'color', {
            get: function(){
                return color;
            },
            set: function(value){
                if(Lynx.Graphics.isColor(value)){
                    color = value;
                }else if(typeof value === 'string' || typeof value === 'number'){
                    color.hex = value;
                }else{
                    Lynx.Logger.warn('Cannot set property color of element to '+value+' as it is not a valid color argument.');
                }
            }
        });

        Object.defineProperty(this, 'stroke', {
            get: function(){
                return stroke;
            },
            set: function(){
                //TODO: Color Stroke Support
                Lynx.Logger.warn('Cannot set stroke property as it is not currently supported. For more information please view the LynxJS Tracker.');
            }
        });
    }

	Lynx.Graphics.Element = Lynx.Object.create({
		create: function(options) {
			return _.extend(new elementModel(), options);
		}
	});
})();