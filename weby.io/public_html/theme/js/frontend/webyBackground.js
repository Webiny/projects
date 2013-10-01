WebyBackground.ANIMATE = true;

function WebyBackground(settings) {

	App.addEventListener(this);

	var _canvasHeight = parseInt(settings.canvasHeight);
	var _canvasWidth = parseInt(settings.canvasWidth);

	var _backgrounds = {
		color: new WebyColorBackground($('#weby-background-color')),
		pattern: new WebyPatternBackground($('#weby-background-pattern'), 'purty_wood.png'),
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
	this.setContentSize = function (width, height) {
		App.getContent().css({
			width: width + 'px',
			height: height + 'px'
		});

		App.fireEvent("weby.background.resized");
		return this;
	}

	this.recalculateContentSize = function () {
		this.setContentSize(_canvasWidth, _canvasHeight);
	}

	this.webyLoaded = function () {
		_backgrounds.image.webyLoaded();
		_backgrounds.video.render();
	}

	this.webyBackgroundResized = function () {
		$('#workspace').height(App.getViewportHeight() - App.getTopOffset() - App.getBottomOffset()).width(App.getViewportWidth());
		if(App.getViewportWidth() < 1200){
			App.getContent().css("margin", "0");
		} else {
			App.getContent().css("margin", "0 auto");
		}

		// Remove margin if no header is shown (means we're taking screenshot)
		if(typeof screenshot != "undefined" && screenshot){
			App.getContent().css("margin", "0");
		}

		this.triggerBackgroundResized();
	};

	this.triggerBackgroundResized = function(){
		for (var i in _backgrounds) {
			if("webyBackgroundResized" in _backgrounds[i]){
				_backgrounds[i].webyBackgroundResized();
			}
		}
	}
}