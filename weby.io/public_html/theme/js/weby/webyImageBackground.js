/**
 * Aligned, Repeat and Fixed renders into given element
 * Scale renders an <img> tag
 */

function WebyImageBackground(el) {

	var _el = el;
	var _image = null;
	var _mode = 'aligned';
	var _align = 'top left';
	var _imageMode = null;
	var _width = null;
	var _height = null;


	this.setImage = function (image) {
		if (image == null) {
			_el.attr("style", "").find('img').remove();
			_imageMode.hide();
		} else {
			_imageMode.show();
		}
		_image = image;
		return this;
	}

	this.getImage = function () {
		return _image;
	}

	this.setMode = function (mode) {
		_mode = mode;
		_imageMode.setMode(mode);
		return this;
	}

	this.getMode = function () {
		return _mode;
	}

	this.setSize = function(width, height){
		_width = width;
		_height = height;
		return this;
	}

	this.setAlign = function (align) {
		_align = align;
		_imageMode.setAlignment(align);
		return this;
	}

	this.getAlign = function () {
		return _align;
	}

	this.populate = function (data) {
		_image = data.image == "" ? null : data.image;
		_align = data.align;
		_mode = data.mode;
		_width = data.width;
		_height = data.height;
		return this;
	}

	this.render = function () {
		if (_image == null) {
			_el.css("background", "none").find("img").remove();
			return;
		}

		if (_mode == 'aligned') {
			_renderAligned();
		} else if (_mode == 'repeat') {
			_renderRepeat();
		} else if (_mode == 'fixed') {
			_renderFixed();
		} else if (_mode == 'scale') {
			_renderScale();
		}
	}

	this.save = function () {
		return {
			image: _image,
			mode: _mode,
			align: _align,
			width: _width,
			height: _height
		}
	}

	var _renderAligned = function () {
		_el.find('img').remove();
		_el.css({
			backgroundImage: 'url(' + _image + ')',
			backgroundPosition: _align == null ? 'left top' : _align,
			backgroundRepeat: 'no-repeat',
			backgroundSize: 'initial',
			backgroundAttachment: 'inherit',
			width: App.getContent().width() + 'px',
			height: App.getContent().height() + 'px',
			top: 0,
			left: 0,
			position: 'absolute'
		});
	}

	var _renderRepeat = function () {
		_el.find('img').remove();
		_el.css({
			backgroundImage: 'url(' + _image + ')',
			backgroundRepeat: 'repeat',
			backgroundSize: 'initial',
			backgroundAttachment: 'inherit',
			width: App.getContent().width() + 'px',
			height: App.getContent().height() + 'px',
			top: 0,
			left: 0,
			position: 'absolute'
		});
	}

	var _renderFixed = function () {
		var wp = App.getWorkspace().offset();
		_el.find('img').remove();
		_el.css({
			top: wp.top + 'px',
			left: wp.left + 'px',
			position: 'fixed',
			width: _getVisibleWidth() + 'px',
			height: _getVisibleHeight() + 'px',
			overflow:'hidden'
		});
		var img = $('<img />');
		img.attr('src', _image);
		img.css({
			width: _width + 'px',
			height: _height + 'px'
		});

		_el.append(img);
	}
	var _renderScale = function () {
		_el.find('img').remove();
		var img = $('<img src="' + _image + '"/>');
		_el.css({
			background: 'none',
			top: 0,
			left: 0,
			position: 'absolute'
		});
		img.css({
			width: App.getContent().width() + 'px',
			height: App.getContent().height() + 'px'
		});
		_el.append(img);
	}

	/**
	 * EVENTS
	 */

	this.webyLoaded = function () {
		if("WebyImageMode" in window){
			_imageMode = new WebyImageMode();
			if (_image == null) {
				_imageMode.hide();
			}
		}
	}

	this.webyBackgroundBeforeResize = function(){
		_el.hide();
	}

	this.webyBackgroundResized = function () {
		_el.show();
		if (_mode == 'fixed') {
			_renderFixed();
		} else {
			var css = {
				width: App.getContent().width() + 'px',
				height: App.getContent().height() + 'px'
			};
			_el.css(css).find('img').css(css);
		}
	}

	var _getVisibleWidth = function(){
		var width = App.getViewportWidth();
		if(App.getContent().width() < width){
			width = App.getContent().width();
		}
		return width;
	}

	var _getVisibleHeight = function(){
		var height = App.getViewportHeight() - App.getTopOffset() - App.getBottomOffset();
		if(App.getContent().height() < height){
			height = App.getContent().height();
		}
		return height;
	}
}
