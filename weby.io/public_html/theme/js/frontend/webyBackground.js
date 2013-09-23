WebyBackground.ANIMATE = true;

function WebyBackground(settings) {

	App.addEventListener(this);

	var _canvasHeight = parseInt(settings.canvasHeight);
	var _canvasWidth = parseInt(settings.canvasWidth);

	var _backgrounds = {
		color: new WebyColorBackground($('#weby-background-color')),
		pattern: new WebyPatternBackground(App.getContent(), 'purty_wood.png'),
		image: new WebyImageBackground($('#weby-background-image')),
		video: new WebyVideoBackground($('#weby-background-video'))
	};

	for (var i in _backgrounds) {
		_backgrounds[i].populate(settings[i]);
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
			if (i == 'video') {
				continue;
			} else {
				_backgrounds[i].render();
			}
		}
	}

	/**
	 * Apply given canvas size
	 * @param width
	 * @param height
	 * @param type change|spin
	 */
	this.applyCanvasSize = function (width, height, type) {
		this.setContentSize(width, height, type).setBackgroundSize(width, height);
	};

	/**
	 * Set App content size (calculates scrollbars)
	 * @param width
	 * @param height
	 * @param type change|spin
	 */
	this.setContentSize = function (width, height, type) {
		function _resize(el, dimension, size, duration) {
			if (typeof duration == "undefined") {
				duration = 500;
			}
			if (type == 'spin') {
				duration = 0;
			}
			var data = {};
			data[dimension] = size;
			if (WebyBackground.ANIMATE) {
				App.fireEvent("weby.background.before.resize");
				el.animate(data, {duration: duration, queue: false, complete: function () {
					App.fireEvent("weby.background.resized");
				}});
			} else {
				el.css(data);
				App.fireEvent("weby.background.resized");
			}

		}

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
			_resize(App.getContentWrapper(), "height", App.getViewportHeight() - App.getTopOffset() - App.getBottomOffset() + 'px');
		}

		return this;
	}

	this.recalculateContentSize = function () {
		this.setContentSize(_canvasWidth, _canvasHeight, 'change');
	}

	this.webyLoaded = function () {
		_backgrounds.image.webyLoaded();
		_backgrounds.video.render();
	}

	this.webyBackgroundResized = function () {
		for (var i in _backgrounds) {
			if ("webyBackgroundResized" in _backgrounds[i]) {
				_backgrounds[i].webyBackgroundResized();
			}
		}
	}
}