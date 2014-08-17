(function lynxInit_canvas() {
	var canvasIndex = -1;
	var logger = Lynx.Logger;

    function baseCanvasModel(){
        var height = 0;
        var width = 0;
        var background = Lynx.Graphics.Color.create();

        Lynx.Object.apply(this);


        this.id = canvasIndex++;
        this.context = '2d';

        // Properties
        Object.defineProperty(this, 'height', {
            get: function() {
                return height;
            },
            set: function(value) {
                if (typeof value === 'number' && !isNaN(value)) {
                    height = value;
                    this.element.height = height;
                    if (this.buffer) {
                        this.buffer.height = height;
                    }
                } else {
                    logger.warn('Cannot set height value of canvas #' + this.id + ' to ' + value + ' as it is not an integer.');
                }
            }
        });

        Object.defineProperty(this, 'width', {
            get: function() {
                return width;
            },
            set: function(value) {
                if (typeof value === 'number' && !isNaN(value)) {
                    width = value;
                    this.element.width = width;
                    if (this.buffer) {
                        this.buffer.width = width;
                    }
                } else {
                    logger.warn('Cannot set width value of canvas #' + this.id + ' to ' + value + 'as it is not an integer.');
                }
            }
        });

        Object.defineProperty(this, 'background', {
            get: function() {
                if (typeof background === 'number' && !isNaN(value)) {
                    // TODO parse number to object
                } else if (Lynx.Graphics.isColor(background)) {
                    return background;
                } else {
                    debugger;
                    // TODO: Support image parsing
                }

                // TODO: Fix this
                return background;
            },
            set: function(value) {
                if (Lynx.Graphics.isColor(value)) {
                    background = value;
                } else if ((typeof value === 'number' && !isNaN(value) && value > 0) || (typeof value === 'string')) {
                    background = Lynx.Graphics.Color.createFromHex(value);
                } else {
                    logger.warn('Could not set background of canvas #' + this.id + ' to invalid color value "' + value + '"');
                }
            }
        });
    }

	function canvasModel(domElement, useBuffer) {
        if (useBuffer !== false) {
            useBuffer = true;
        }

        baseCanvasModel.apply(this);

        this.buffer = null;

        if (domElement && domElement.tagName === 'CANVAS') {
            this.element = domElement;
            this.height = this.element.height;
            this.width = this.element.width;

            domElement.LynxCanvas = this;
        } else {
            this.element = document.createElement('canvas');
        }

        if (useBuffer) {
            this.buffer = Lynx.Graphics.Canvas.createBuffer(null, {
                width: this.width,
                height: this.height,
                background: this.background,
                context: this.context
            });
        }

        this.renderer = Lynx.Graphics.Renderer.create(this, {});
        Lynx.Graphics.Loop.addCanvas(this);
    }

	canvasModel.prototype.destroy = function() {
		Lynx.Graphics.Loop.removeCanvas(this);
	};

	canvasModel.prototype.insertInto = function(parentNode) {
		if (parentNode) {
			parentNode.appendChild(this.element);
		}
	};

    canvasModel.prototype.createElement = function(options){
        var node = Lynx.Graphics.Element.create(options);

        this.renderer.addNode(node);

        return node;
    };

	function buffer(context) {
        baseCanvasModel.apply(this);

		context = context || '2d';

		this.context = context;

		this.element = document.createElement('canvas');
	}

	Lynx.Graphics.Canvas = {
		create: function(domElement, options) {
			domElement = domElement || null;
			options = options || {};

			return _.extend(new canvasModel(domElement), options);
		},

		createBuffer: function(domElement, options) {
			domElement = domElement || null;
			options = options || {};

			return _.extend(new buffer(domElement), options);
		}
	};
})();