function WebyBackground(settings) {

	App.addEventListener(this);
	
	var _canvasWidth = App.getAvailableContentWidth();
	var _canvasHeight = App.getAvailableContentHeight();

	var _backgrounds = {
		color: new WebyColorBackground($('#weby-background-color')),
		pattern: new WebyPatternBackground(App.getContent(), 'purty_wood.png'),
		image: new WebyImageBackground($('#weby-background-image')),
		video: new WebyVideoBackground($('#weby-background-video'))
	};

	if (typeof settings != "undefined") {
		for (var i in _backgrounds) {
			_backgrounds[i].populate(settings[i]);
		}
		_canvasHeight = parseInt(settings.canvasHeight);
		_canvasWidth = parseInt(settings.canvasWidth);
	}

	this.save = function () {
		var data = {};
		for (var i in _backgrounds) {
			data[i] = _backgrounds[i].save();
		}
		data.canvasWidth = _canvasWidth;
		data.canvasHeight = _canvasHeight;
		return data;
	}

	this.setBackgroundSize = function (width, height) {
		_canvasWidth = width;
		_canvasHeight = height;

		$('#weby-background').css({
			width: width + 'px',
			height: height + 'px'
		});
	}

	this.getColorBackground = function () {
		return _backgrounds.color;
	}

	this.getPatternBackground = function () {
		return _backgrounds.pattern;
	}

	this.getImageBackground = function () {
		return _backgrounds.image;
	}

	this.getVideoBackground = function () {
		return _backgrounds.video;
	}

	this.render = function () {
		this.applyCanvasSize(_canvasWidth, _canvasHeight, 'spin');
		for (var i in _backgrounds) {
			_backgrounds[i].render();
		}
	}

	/**
	 * Get widgets that are located outside the given width and height of the canvas
	 * @param width
	 * @param height
	 */
	var _getWidgetsBeyondCanvas = function (width, height) {
		var widgets = App.getWeby().getWidgets();
		var outerWidgets = [];
		var el = App.getContentWrapper()[0];
		for (var i in widgets) {
			var widget = widgets[i];
			var rect = widget.html()[0].getBoundingClientRect();
			var maxLeft = false;
			var maxTop = false;

			var marginLeft = parseInt(widget.html().css('margin-left'));
			var marginTop = parseInt(widget.html().css('margin-top'));

			var wrapperMarginLeft = parseInt(App.getContentWrapper().css('margin-left'));

			if (isNaN(marginTop)) {
				marginTop = 0;
			}

			if (isNaN(marginLeft)) {
				marginLeft = 0;
			}

			if (rect.width + rect.left + el.scrollLeft + marginLeft - wrapperMarginLeft > width) {
				maxLeft = width - rect.width - marginLeft * 2;
			}

			if (rect.height + rect.top - App.getTopOffset() - App.getBottomOffset() + el.scrollTop + marginTop > height) {
				maxTop = height - rect.height - marginTop * 2;
			}

			if (maxLeft || maxTop) {
				outerWidgets.push({
					widget: widget,
					maxLeft: maxLeft,
					maxTop: maxTop
				});
			}
		}

		if (outerWidgets.length == 0) {
			return false;
		}
		return outerWidgets;

	}

	/**
	 * Apply given canvas size
	 * @param width
	 * @param height
	 * @param type change|spin
	 */
	this.applyCanvasSize = function (width, height, type) {
		var $this = this;

		function _applyCanvasSize(width, height) {
			$this.setContentSize(width, height, type).setBackgroundSize(width, height);
		}

		var outerWidgets = _getWidgetsBeyondCanvas(width, height);
		if (outerWidgets) {
			$('#button-move-widgets').unbind('click').click(function () {
				for (var i in outerWidgets) {
					var data = outerWidgets[i];
					data.widget.setPosition(data.maxLeft, data.maxTop);
				}
				$.fancybox.close();
				_applyCanvasSize(width, height);
			});
			$('#button-dont-move-widgets').unbind('click').click(function () {
				$.fancybox.close();
				App.getWeby().getToolbar().restorePreviousCanvasSize();
				return;
			});
			$(':focus').blur();
			$.fancybox($('#outer-widgets'), {modal: true});
		} else {
			_applyCanvasSize(width, height);
		}
	};

	/**
	 * Set App content size (calculates scrollbars)
	 * @param width
	 * @param height
	 * @param type change|spin
	 */
	this.setContentSize = function (width, height, type) {
		function _resize(el, dimension, size) {
			var data = {};
			data[dimension] = size;
			if (el == App.getContentWrapper()) {
				App.fireEvent("weby.background.before.resize");
				el.css(data);
				App.getWeby().getBackground().setContainment(width, height);
				App.fireEvent("weby.background.resized");
			} else {
				el.css(data);
			}
		}

		App.getWeby().getToolbar().setCanvasSize(width, height);
		if (width <= App.getViewportWidth() - App.getWeby().getScrollBarOffset()) {
			_resize(App.getContent(), "width", width + 'px');
			_resize(App.getContentWrapper(), "width", width + App.getWeby().getScrollBarOffset() + 'px');
		} else {
			_resize(App.getContent(), "width", width + 'px');
			_resize(App.getContentWrapper(), "width", App.getViewportWidth() + 'px');
		}

		if (height <= App.getViewportHeight() - App.getTopOffset() - App.getBottomOffset() - App.getWeby().getScrollBarOffset()) {
			_resize(App.getContent(), "height", height + 'px');
			_resize(App.getContentWrapper(), "height", height + App.getWeby().getScrollBarOffset() + 'px');
		} else {
			_resize(App.getContent(), "height", height + 'px');
			_resize(App.getContentWrapper(), "height",App.getViewportHeight() - App.getTopOffset() - App.getBottomOffset() + 'px');
		}

		return this;
	}

	this.recalculateContentSize = function () {
		this.setContentSize(_canvasWidth, _canvasHeight, 'change');
	}

	/**
	 * Set widget containment
	 * @param width
	 * @param height
	 */
	this.setContainment = function (width, height) {
		if (!width && !height) {
			var containment = [0, App.getTopOffset()];
		} else {
			var containment = [0, App.getTopOffset(), width, height];
		}

		BaseWidget.CONTAINMENT = containment;
		// Trigger viewportResize to recalculate all background related elements
		App.getWeby().setContainment(containment).getBackground().webyBackgroundResized();
		return this;
	}

	/**
	 * EVENTS
	 */

	this.webyLoaded = function(){
		_backgrounds.image.webyLoaded();
	}

	this.webyBackgroundBeforeResize = function () {
		for (var i in _backgrounds) {
			if("webyBackgroundBeforeResize" in _backgrounds[i]){
				_backgrounds[i].webyBackgroundBeforeResize();
			}
		}
	};

	this.webyBackgroundResized = function () {
		if(App.getViewportWidth() < 1200){
			App.getContentWrapper().css("margin", "0");
		} else {
			App.getContentWrapper().css("margin", "0 auto");
		}
		for (var i in _backgrounds) {
			if("webyBackgroundResized" in _backgrounds[i]){
				_backgrounds[i].webyBackgroundResized();
			}
		}
	};
}