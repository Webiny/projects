/**
 * BASE WIDGET FOR FRONTEND RENDERING
 */

var BaseWidget = function () {

	/**
	 * Widget rendered HTML
	 */
	this._html = '';

	/**
	 * Widget ID
	 */
	this._id = 0;

	/**
	 * Top (y) position
	 */
	this._top = 0;

	/**
	 * Left (x) position
	 */
	this._left = 0;

	/**
	 * Width of the widget
	 */
	this._width = 0;

	/**
	 * Height of the widget
	 */
	this._height = 0;

	/**
	 * Rotation degrees
	 */
	this._rotation = 0;

	/**
	 * Embed URL is the full url of the resource
	 * Ex: http://www.youtube.com/embed/FNQowwwwYa0?wmode=transparent&autoplay=1
	 */
	this._embedUrl = '';

	/**
	 * Opacity of widget
	 */
	this._opacity = 1;

	/**
	 * Frame radius
	 */
	this._radius = 4;

	/**
	 * Frame padding
	 */
	this._padding = 10;

	/**
	 * Frame color
	 */
	this._color = 'ffffff';

	/**
	 * Widget shadow X distance
	 */
	this._shadowX = 0;

	/**
	 * Widget shadow Y distance
	 */
	this._shadowY = 3;

	/**
	 * Widget shadow spread
	 */
	this._shadowSpread = 12;

	/**
	 * Widget shadow color
	 */
	this._shadowColor = 'rgb(136, 136, 136)';

	/**
	 * Z-index of the widget
	 */
	this._zindex = 1;

	this._widgetClass = '';
}

BaseWidget.prototype = {

	/**
	 * Get widget HTML
	 * @returns jQuery DOM object
	 */
	getHTML: function () {
		var _widget = $('<div id="widget-' + this._id + '" class="widget"><div class="widget-body ' + this._widgetClass + '">' +
			'</div></div>');

		_widget.find('.widget-body').append(this._html);
		var rotateCSS = 'rotate(' + this._rotation + 'deg)';

		_widget.css({
			top: this._top + 'px',
			left: this._left + 'px',
			'z-index': this._zindex,
			opacity: this._opacity,
			padding: this._padding,
			width: this._width + 'px',
			height: this._height + 'px',
			'transform': rotateCSS,
			'-webkit-transform': rotateCSS,
			'-webkit-border-radius': this._radius + 'px',
			'-moz-border-radius': this._radius + 'px',
			'border-radius': this._radius + 'px',
			'background-color': this._color,
			'box-shadow': this._shadowX + 'px ' + this._shadowY + 'px ' + this._shadowSpread + 'px ' + this._shadowColor
		});
		_widget.find('iframe, img').css({
			'-webkit-border-radius': this._radius + 'px',
			'-moz-border-radius': this._radius + 'px',
			'border-radius': this._radius + 'px'
		});
		return this._html = _widget;
	},

	createFromData: function (data, id) {
		this._id = id;
		this._populate(data.common);
		this._populate(data.specific);

		// Normalize some values
		this._rotation = parseInt(this._rotation);
		this._width = parseInt(this._width);
		this._height = parseInt(this._height);
		this._top = parseInt(this._top);
		this._left = parseInt(this._left);

		return this.getHTML();
	},

	_populate: function (data) {
		// Populate widget specific data
		for (var i in data) {
			if ('_' + i in this) {
				this['_' + i] = data[i];
			}
		}
	},

	getId: function(){
		return this._id;
	},

	/**
	 * SELECTOR methods
	 */

	html: function (selector) {
		if (typeof selector == "undefined") {
			return this._html;
		}
		return this._html.find(selector);
	},

	body: function (selector) {
		if (!this._jWidgetBody) {
			this._jWidgetBody = this._html.find('.widget-body');
		}

		if (typeof selector != "undefined") {
			return this._jWidgetBody.find(selector);
		}
		return this._jWidgetBody;
	},

	truncate: function (text, length, end) {
		if (text.length > length) {
			return $.trim(text).substring(0, length).split(" ").slice(0, -1).join(" ") + end;
		}
		return text;
	},

	showFailedToLoad: function () {
		this.html().append('<div class="widget-unavailable-overlay"><p><span class="smiley-face"></span>We couldn\'t load this content!<br/>Try reloading the page.</p></div>');
		this.body('*:not(".widget-unavailable-overlay")').remove();

		// Resize unavailable overlay
		this.html('.widget-unavailable-overlay').css({
			width: '100%',
			height: '100%',
			margin: -this._padding + 'px 0 0 -' + this._padding + 'px'
		});

		this.html('.widget-unavailable-overlay p').css({
			marginTop: ((this._html.outerHeight() / 2) - 70) + 'px'
		});
	},
};
