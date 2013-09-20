var BaseWidget = function () {
	/**
	 * Some services do not allow requests to the embed URL-s so you can turn off validation by setting this to `false`
	 */
	this._checkUrl = true;

	/**
	 * Widget rendered HTML
	 */
	this._html;

	/**
	 * Widget ID
	 */
	this._id;

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
	 * This selector is also resized when widget is being resized
	 * Ex: '#video-iframe-1' will make this iframe autamatically resized with widget
	 */
	this._alsoResize = false;

	/**
	 * Aspect ratio of widget if necessary
	 */
	this._aspectRatio = false;

	/**
	 * Custom widget class added to the widget if specified
	 */
	this._widgetClass = '';

	/**
	 * Should widget be allowed to drag
	 */
	this._isDraggable = true;

	/**
	 * Should widget be allowed to resize
	 */
	this._isResizable = true;

	/**
	 * Should widget be allowed to rotate
	 */
	this._isRotatable = true;

	/**
	 * Is widget active (selected) ?
	 */
	this._isActive = false;

	/**
	 * Can widget content be interacted with? This will affect the interaction overlay
	 */
	this._isInteractive = true;

	/**
	 * Opacity of widget
	 */
	this._opacity = 1;

	/**
	 * Frame radius
	 */
	this._radius = 0;

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
	 * Is widget currently in interaction mode?
	 */
	this._isEditable = false;

	/**
	 * Is widget currently locked?
	 */
	this._isLocked = false;

	/**
	 * Is widget content loaded?
	 * If TRUE - means that the actual widget content was successfully loaded into the widget body (map, video, etc.)
	 */
	this._isContentLoaded = false;

	/**
	 * Flag telling if the content of a widget is currently being loaded
	 */
	this._loadingContent = false;

	/**
	 * Input element of the widget
	 * Base class binds events to this selector inside widget html
	 */
	this._inputElement = 'input';

	/**
	 * Z-index of the widget
	 */
	this._zindex = 1;

	/**
	 * If TRUE - means that it's not a click but a `mouse up` after drag
	 */
	this._mouseUpAfterDrag = false;

	/**
	 * Rotate factor is used to tweak rotation sensitivity
	 */
	this._rotateFactor = 0.3;

	/**
	 * These are cached widget elements that are being accessed often, so we cache them to avoid executing a selector over and over again
	 */
	this._jWidgetInput = false;

	this._jWidgetBody = false;

	this._jWidgetControls = false;

	this._parseError = false;

	/**
	 * NOTE!!!!
	 * In UI components events are fired to enforce the use of App event manager and not direct object modification
	 * Refer to _base options to see which events can be caught by implementing corresponding methods
	 */

	/**
	 * Common draggable options
	 * To catch events in your widget - implement "widgetDrag", "widgetDragStart" and "widgetDragStop" methods
	 */
	this._baseDraggableOptions = {
		cancel: '.resize-handle, .widget-body',
		scroll: true,
		scrollSensitivity: 100,
		start: function (event, ui) {
			App.fireEvent("widget.drag.start", {element: $(this), event: event, ui: ui});
		},
		stop: function (event, ui) {
			event = MouseEvent.normalize(event);
			var $this = $(this).data('widget');
			$this._mouseUpAfterDrag = true;
			App.fireEvent("widget.drag.stop", {element: $(this), event: event, ui: ui});
		},
		drag: function (event, ui) {
			var $this = $(this).data('widget');
			event = MouseEvent.normalize(event);
			$this._left = event.offsetX;
			$this._top = event.offsetY;
			App.fireEvent("widget.drag", {element: $(this), event: event, ui: ui});
		}
	};

	/**
	 * Common rotatable options
	 * To catch events in your widget - implement "widgetRotate", "widgetRotateStart" and "widgetRotateStop" methods
	 */
	this._baseRotatableOptions = {
		handle: '.rotate-handle',
		opacity: 0.01,
		helper: 'clone',
		drag: function (event, ui) {
			var $this = $(this).data('widget');
			var position = $this._rotateStart;
			var currRotate = $this._rotation;

			var diff = Math.abs(event.pageX - position) * $this._rotateFactor;

			if (event.pageX > position) {
				degree = currRotate - diff;
			} else if (event.pageX < position) {
				degree = currRotate + diff;
			} else {
				return;
			}

			$this._rotateStart = event.pageX;
			var rotateCSS = 'rotate(' + degree + 'deg)';
			$this._rotation = degree;

			$(this).css({
				'transform': rotateCSS,
				'-webkit-transform': rotateCSS
			});
			App.fireEvent("widget.rotate", {element: $(this), event: event, ui: ui});
		},
		start: function (event, ui) {
			App.fireEvent("widget.rotate.start", {element: $(this), event: event, ui: ui});
		},
		stop: function (event, ui) {
			var options = $(this).data('draggable-options');
			var $this = $(this).data('widget');
			setTimeout(function () {
				$this._html.draggable(options);
			}, 50);
			App.fireEvent("widget.rotate.stop", {element: $(this), event: event, ui: ui});
		}
	};

	/**
	 * Common resizable options
	 * To catch events in your widget - implement "widgetResize", "widgetResizeStart" and "widgetResizeStop" methods
	 */
	this._baseResizableOptions = {
		handles: {
			se: '.resize-handle'
		},
		resize: function (event, ui) {
			App.fireEvent("widget.resize", {element: $(this), event: event, ui: ui});
		},
		start: function (event, ui) {
			App.fireEvent("widget.resize.start", {element: $(this), event: event, ui: ui});
		},
		stop: function (event, ui) {
			App.fireEvent("widget.resize.stop", {element: $(this), event: event, ui: ui});
		}

	};

	/**
	 * Widget draggable options that will be merged with _baseDraggableOptions and then passed to draggable object
	 */
	this._draggableOptions = {};

	/**
	 * Widget rotatable options that will be merged with _baseRotatableOptions and then passed to rotatable object
	 */
	this._rotatableOptions = {};

	/**
	 * Widget resizable options that will be merged with _baseResizableOptions and then passed to resizable object
	 */
	this._resizableOptions = {};
}

BaseWidget.prototype = {

	/**
	 * Delete current widget
	 */
	remove: function () {
		// Remove widget HTML
		this._html.remove();
		// Remove widget from the App
		App.getWeby().removeWidget(this._id);
		App.fireEvent("widget.deactivated");
		App.fireEvent("widget.deleted", this);
	},

	/**
	 * Get widget id
	 * @returns int Id
	 */
	getId: function () {
		return this._id;
	},

	/**
	 * Set widget id
	 * @param id
	 * @returns this
	 */
	setId: function (id) {
		this._id = id;
		return this;
	},

	/**
	 * Set widget position
	 * @param int x
	 * @param int y
	 * @returns this
	 */
	setPosition: function (x, y, animate) {

		if (x === false) {
			x = this._left;
		}

		if (y === false) {
			y = this._top;
		}

		if (typeof animate == "undefined") {
			animate = false;
		}

		if (this._html != undefined) {
			if (x < 0) {
				x = 0;
			}
			if (y < 0) {
				y = 0;
			}
		}

		this._left = parseInt(x);
		this._top = parseInt(y);
		if (typeof this._html != "undefined") {
			var css = {top: this._top + 'px', left: this._left + 'px'};
			if (animate) {
				this._html.animate(css, 500)
			} else {
				this._html.css(css);
			}
		}
		return this;
	},

	/**
	 * Get widget HTML
	 * @returns jQuery DOM object
	 */
	getHTML: function () {
		var $this = this;
		var _widget = $('<div data-id="' + this._id + '" class="widget"><div class="widget-body ' + this._widgetClass + '">' +
			'</div></div>');

		_widget.append('<span class="control remove-handle"></span>');
		_widget.find('.remove-handle').click(function () {
			$this.remove();
		});

		if (this._isDraggable) {
			_widget.append('<span class="control drag-handle"></span>');
		}
		if (this._isResizable) {
			_widget.append('<span class="control resize-handle ui-resizable-handle"></span>');
		}
		if (this._isRotatable) {
			_widget.append('<span class="control rotate-handle" title="Drag left and right to rotate.\nDoubleclick to reset rotation."></span>');
		}

		_widget.find('.widget-body').append(this._html);


		_widget.css({
			top: this._top + 'px',
			left: this._left + 'px',
			'z-index': this._zindex
		});

		if (this._width > 0 && this._height > 0) {
			_widget.css({
				width: this._width + 'px',
				height: this._height + 'px'
			})
		}
		if (this._rotation != 0) {
			var rotateCSS = 'rotate(' + this._rotation + 'deg)';

			_widget.css({
				'transform': rotateCSS,
				'-webkit-transform': rotateCSS
			});
		}

		this._html = _widget;
		this.controls().css("visibility", "hidden");
		return this._html;
	},

	getFrameSettings: function () {
		return {
			opacity: this._opacity,
			padding: this._padding,
			radius: this._radius,
			color: this._color,
			shadowY: this._shadowY,
			shadowSpread: this._shadowSpread,
			shadowColor: this._shadowColor
		}
	},

	/**
	 * Check if given URL really exists and is accessible
	 * @param url
	 * @param callback Callback to execute after the check
	 *
	 * Data passed to callback: {urlExists: true/false, data: {// headerData}}
	 */
	checkUrl: function (url, callback) {
		if (!this._checkUrl) {
			var data = {urlExists: true};
			callback(data);
		} else {
			// Make sure it's a valid URL
			var regex = /^[http:\/\/|ftp:\/\/|https:\/\/]*?[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?$/;
			if(!url.match(regex)){
				callback({urlExists: false});
			}
			$.get(BaseWidget.CONTENT_VALIDATOR + '/?url=' + encodeURIComponent($.trim(url)) + '&t=' + new Date().getTime(), function (data) {
				callback(data);
			});
		}
	},

	/**
	 * On widget inserted
	 * Called after the widget was inserted into the DOM
	 */
	onWidgetInserted: function () {
		App.fireEvent("widget.created", this);
		this._bindControls();
	},

	/**
	 * Show resize handle if this widget is resizable
	 * @returns this
	 */
	showResizeHandle: function () {
		if (this._isResizable && this._isContentLoaded && this._isActive) {
			this.html('span.resize-handle').css("visibility", "visible");
		}
		return this;
	},

	/**
	 * Hide resize handle
	 */
	hideResizeHandle: function () {
		this.html('span.resize-handle').css("visibility", "hidden");
	},

	/**
	 * Get next highest z-index
	 * @returns {number}
	 */
	getMaxZIndex: function () {
		var maxZ = 10000;
		var widgets = document.getElementsByClassName('widget');
		for (var i = 0; i < widgets.length; i++) {
			var widget = widgets[i];
			var z = parseInt($(widget).css('z-index'), 10);
			if (maxZ < z) {
				maxZ = z;
			}
		}
		return ++maxZ;
	},

	/**
	 * Get widget z-index
	 * @returns {number}
	 */
	getZIndex: function () {
		return this._zindex;
	},

	/**
	 * Get next lowest z-index
	 * @returns {number}
	 */
	getMinZIndex: function () {
		var minZ = 1000000;
		var widgets = document.getElementsByClassName('widget');
		for (var i = 0; i < widgets.length; i++) {
			var widget = widgets[i];
			var z = parseInt($(widget).css('z-index'), 10);
			if (minZ > z) {
				minZ = z;
			}
		}
		return --minZ;
	},

	/**
	 * Activate widget
	 * Show widget handles and interaction layer
	 * @param e Mouse event
	 * @returns this
	 */
	activate: function (e) {
		if (this._isActive && e) {
			var textEditable = false;
			if ($(e.target).hasClass('text-editable') || $(e.target).closest('.text-editable').length !== 0) {
				textEditable = true;
			}
			// Don't remove input focus if input element was clicked
			if (e && e.target.nodeName.toLowerCase() != 'input' && e.target.nodeName.toLowerCase() != 'textarea' && !textEditable) {
				this.html(':focus').blur();
			}
			return;
		}


		if(this._loadingContent){
			return;
		}

		this._isActive = true;
		this.html().draggable("enable");
		this.html().addClass('active');
		if (!this._isContentLoaded) {
			this.hideResizeHandle();
			this.makeEditable();
			this.input().focus();
		} else {
			this.controls().css("visibility", "visible");
		}

		App.fireEvent("widget.activated", this);

		if ('onActivate' in this) {
			this.onActivate();
		}

		return this;
	},

	/**
	 * Make widget editable (calls widget `onMakeEditable` method if implemented)
	 * This is triggered on widget doubleclick
	 * Widget handles are hidden and you can interact with widget content
	 * @returns this
	 */
	makeEditable: function () {
		if (!this._isInteractive) {
			return this;
		}
		this._isEditable = true;
		this.html('.widget-disabled-overlay').remove();
		this.html().addClass('editable');
		if (this._isContentLoaded) {
			this.controls().css("visibility", "hidden");
		}

		if ('onMakeEditable' in this) {
			this.onMakeEditable();
		}
		return this;
	},

	/**
	 * Deactivate widget
	 * Hide all handles, restore interaction layer, disable dragging
	 * @returns this
	 */
	deactivate: function () {
		if (!this._isContentLoaded && !this._loadingContent) {
			if (this._parseError) {
				this._parseError = false;
				return false;
			} else {
				return this.remove();
			}
		}

		this.showTools(); // in case we were in widget settings
		this._isActive = this._isEditable = false;
		this.controls().css("visibility", "hidden");
		this.html().removeClass('active editable');
		this.html().draggable("disable");
		if (this.html('.widget-disabled-overlay').length === 0) {
			// Append interaction layer and set it's line-height to height of the widget
			this.addInteractionOverlay();
		}

		App.fireEvent("widget.deactivated");

		if ('onDeactivate' in this) {
			this.onDeactivate();
		}
		return this;
	},

	/**
	 * Mark content as loaded
	 * @returns this
	 */
	contentLoaded: function () {

		this._width = this.html('.widget-body')[0].scrollWidth;
		this._height = this.html('.widget-body')[0].scrollHeight;

		this.html().css({
			width: this._width + 'px',
			height: this._height + 'px'
		});

		this._isContentLoaded = true;

		if (this._isActive) {
			this.addInteractionOverlay();
			this.showTools();
			App.getWeby().getToolbar().widgetActivated(this);
		}

		this._resize();
		return this;
	},

	isContentLoaded: function () {
		return this._isContentLoaded;
	},

	/**
	 * Set data and try loading
	 * @param data
	 * @returns this
	 */
	setData: function (data) {
		this.input().val(data).blur();
		return this;
	},

	save: function () {
		var type = this.constructor.name.replace('Widget', '').toLowerCase();
		var commonData = {
			class: this.constructor.name,
			type: type,
			top: this._top,
			left: this._left,
			width: this._html.width(),
			height: this._html.height(),
			zindex: this._zindex,
			rotation: this._rotation,
			isInteractive: !!this._isInteractive,
			aspectRatio: this._isResizable ? this._html.resizable("option", "aspectRatio") : false,
			isLocked: this._isLocked,
			embedUrl: this._embedUrl,
			opacity: this._opacity,
			padding: this._padding,
			radius: this._radius,
			color: this._color,
			shadowY: this._shadowY,
			shadowSpread: this._shadowSpread,
			shadowColor: this._shadowColor
		};
		var widgetData = this.getSaveData();

		return {
			common: commonData,
			specific: widgetData
		}
	},

	createFromData: function (data) {
		this._populate(data.common);
		this._populate(data.specific);

		// Normalize some values
		this._rotation = parseInt(this._rotation);
		this._width = parseInt(this._width);
		this._height = parseInt(this._height);
		this._top = parseInt(this._top);
		this._left = parseInt(this._left);

		App.getContent().append(this.getEditHTML());
		this.addInteractionOverlay();
		this._resize();
		this._isContentLoaded = true;
		this._bindControls();
		this.html().draggable("disable");
		if ('onEditWidgetInserted' in this) {
			this.onEditWidgetInserted();
		}
		this.setOpacity(this._opacity);
		this.setPadding(this._padding);
		this.setColor(this._color);
		this.setRadius(this._radius);
		this.setShadowDistance(this._shadowY);
		this.setShadowSpread(this._shadowSpread);
		this.setShadowColor(this._shadowColor);
		return this;
	},

	_populate: function (data) {
		// Populate widget specific data
		for (var i in data) {
			if ('_' + i in this) {
				this['_' + i] = data[i];
			}
		}
	},

	/**
	 * Show loading in the widget
	 * @param mainText
	 * @param secondaryText
	 * @returns this
	 */
	showLoading: function (mainText, secondaryText, fillContent) {

		if (!fillContent) {
			fillContent = false;
		}

		this._loadingContent = true;
		if (typeof mainText == "undefined" || mainText == '') {
			mainText = this._loadingMessage;
		}

		if (typeof secondaryText == "undefined" || secondaryText == '') {
			secondaryText = 'This may take a few moments, please be patient.';
		}

		if (fillContent) {
			var paddingTop = (this.body()[0].scrollHeight - 10) / 2 - 18;
			var style = {
				width: (this.body().width() - 20) + 'px',
				height: (this.body().height() - paddingTop) +'px',
				paddingTop: paddingTop + 'px'
			};
		} else {
			var style = {
				width: '360px',
				height: '70px',
				paddingTop: '20px'
			};
		}


		var loading = $('<div class="loading"><p><span class="main-text">' + mainText + '</span><span class="secondary-text">' + secondaryText + '</span></p></div>');
		loading.css(style);

		if (this.body('.loading').length > 0) {
			this.body('.loading').replaceWith(loading);
		} else {
			this.body().prepend(loading);
		}
		return this;
	},

	showTools: function () {

		this.controls().css("visibility", "visible").show();
		this.html('.widget-disabled-overlay').css("opacity", 1);
		return this;
	},

	hideTools: function () {
		this.controls().hide();
		this.html('.widget-disabled-overlay').css("opacity", 0);
		return this;
	},

	/**
	 * Hide loading
	 * @returns this
	 */
	hideLoading: function () {
		this._loadingContent = false;
		this.body('.loading').remove();
		return this;
	},

	/**
	 * Set draggable containment
	 * @param containment
	 * @returns this
	 */
	setContainment: function (containment) {
		this._html.draggable("option", "containment", containment);
		if (this._isResizable) {
			this._html.resizable("option", "containment", containment);
		}
		return this;
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

	input: function () {
		if (!this._jWidgetInput) {
			this._jWidgetInput = this._html.find(this._inputElement);
		}
		return this._jWidgetInput;
	},

	message: function () {
		return this._html.find('span.message');
	},

	controls: function () {
		if (!this._jWidgetControls) {
			this._jWidgetControls = this.html('span.control');
		}
		return this._jWidgetControls;
	},


	/**
	 * UTILITY methods
	 */

	truncate: function (text, length, end) {
		if (text.length > length) {
			return $.trim(text).substring(0, length).split(" ").slice(0, -1).join(" ") + end;
		}
		return text;
	},

	moveUp: function (distance) {
		this.setPosition(this._left, parseInt(this._top) - parseInt(distance));
	},

	moveRight: function (distance) {
		this.setPosition(parseInt(this._left) + parseInt(distance), this._top);
	},

	moveLeft: function (distance) {
		this.setPosition(parseInt(this._left) - parseInt(distance), this._top);
	},

	moveDown: function (distance) {
		this.setPosition(this._left, parseInt(this._top) + parseInt(distance));
	},

	setOpacity: function (opacity) {
		this._opacity = opacity;
		this.html().css({
			opacity: opacity
		});
		return this;
	},

	setRadius: function (radius) {
		this._radius = radius;
		this.html().css({
			'-webkit-border-radius': radius + 'px',
			'-moz-border-radius': radius + 'px',
			'border-radius': radius + 'px'
		});
		this.html('.widget-disabled-overlay').css({
			'border-radius': this._radius + 'px'
		});
		return this;
	},

	setPadding: function (padding) {
		this._padding = padding;
		this.html().css("padding", padding + 'px');

		this._resize();
		return this;
	},


	setColor: function (color) {
		this._color = color;
		this.html().css('background-color', color);
		return this;
	},

	setShadowColor: function (color) {
		this._shadowColor = color;
		this.html().css('box-shadow', this._shadowX + 'px ' + this._shadowY + 'px ' + this._shadowSpread + 'px ' + this._shadowColor);
		return this;
	},

	setShadowDistance: function (distance) {
		this._shadowY = parseInt(distance);
		this.html().css('box-shadow', this._shadowX + 'px ' + this._shadowY + 'px ' + this._shadowSpread + 'px ' + this._shadowColor);
		return this;
	},

	setShadowSpread: function (spread) {
		this._shadowSpread = parseInt(spread);
		this.html().css('box-shadow', this._shadowX + 'px ' + this._shadowY + 'px ' + this._shadowSpread + 'px ' + this._shadowColor);
		return this;
	},

	/**
	 * EVENT METHODS
	 */

	/**
	 * Event: widget.resize.stop
	 * @param data
	 */
	widgetResizeStop: function (data) {
		this._width = parseInt(data.element.width());
		this._height = parseInt(data.element.height());
		this._html.css("height", this._height + 'px');
		this._html.css("width", this._width + 'px');
	},

	widgetResize: function (data) {
		this._resize();
	},

	/**
	 * Event: widget.drag.stop
	 * @param data
	 */
	widgetDragStop: function (data) {
		this._top = data.element.css('top').replace('px', '');
		this._left = data.element.css('left').replace('px', '');
	},

	/**
	 * (PRIVATE)
	 *
	 * Resize whatever you need inside the widget
	 * (Currently we only resize the interaction layer)
	 */
	_resize: function () {
		this.html('.widget-disabled-overlay').css({
			margin: -this._padding + 'px 0 0 -' + this._padding + 'px'
		});

		var margin = (this._html.outerWidth() - 193) / 2 + 'px';
		this.html('.widget-disabled-overlay span').css({
			marginLeft: margin,
			marginRight: margin,
			marginTop: (this._html.outerHeight() / 2 - 20) + 'px'
		});
	},

	/**
	 * Bind draggable, rotatable and resizable
	 * @private
	 */
	_bindControls: function () {
		var draggableOptions = {};
		var rotatableOptions = {};
		var resizableOptions = {};

		if (!BaseWidget.CONTAINMENT) {
			BaseWidget.CONTAINMENT = [App.getLeftOffset(), App.getTopOffset()];
		}

		this._draggableOptions["containment"] = BaseWidget.CONTAINMENT;
		this._rotatableOptions["containment"] = BaseWidget.CONTAINMENT;
		this._resizableOptions["containment"] = BaseWidget.CONTAINMENT;

		$.extend(draggableOptions, this._baseDraggableOptions, this._draggableOptions);
		$.extend(rotatableOptions, this._baseRotatableOptions, this._rotatableOptions);
		$.extend(resizableOptions, this._baseResizableOptions, this._resizableOptions);

		if (this._isDraggable) {
			this._html.data('widget', this).draggable(draggableOptions);
		}
		if (this._isResizable) {
			this._html.data('widget', this).resizable(resizableOptions);
			if (this._alsoResize !== false && this._alsoResize != "false") {
				this._html.resizable("option", "alsoResize", this._alsoResize);
			}

			if (this._aspectRatio !== false && this._aspectRatio != "false") {
				this._html.resizable("option", "aspectRatio", this._aspectRatio);
			}
		}

		if (this._isRotatable) {
			var $this = this;
			this.html().find('span.rotate-handle').unbind("mousedown mouseup dblclick").bind({
				mousedown: function (e) {
					$this._rotateStart = e.pageX;
					var options = $this._html.draggable("option");
					$this._html.data('widget', $this).data('draggable-options', options).draggable(rotatableOptions);
				},
				mouseup: function () {
					var options = $this._html.draggable().data('draggable-options');
					$this._html.draggable(options);
				},
				dblclick: function () {
					$this._rotation = 0;
					$this._html.css('-webkit-transform', 'none').css('transform', 'none');
				}
			});
		}
	},

	/**
	 * Add interaction overlay
	 * @private
	 */
	addInteractionOverlay: function () {
		if (this.html('.widget-disabled-overlay').length > 0) {
			return;
		}
		var visible = this._isInteractive ? 'visibility:visible' : 'visibility:hidden';
		this._html.prepend('<div class="widget-disabled-overlay"><span class="text" style="'+visible+'">Doubleclick to interact</span></div>');
		this._resize();
	},

	/**
	 * Get array of widgets overlapping current widget
	 * @returns {Array}
	 * @private
	 */
	_getOverlappingWidgets: function () {
		var widgets = document.getElementsByClassName('widget');
		var overlaps = [];
		var rect1 = this.html()[0].getBoundingClientRect();
		for (var i = 0; i < widgets.length; i++) {
			var relativeWidget = widgets[i];
			var widgetId = relativeWidget.getAttribute("data-id");
			if (widgetId == this.getId()) {
				continue;
			}
			var rect2 = relativeWidget.getBoundingClientRect();
			var overlap = !(rect1.right < rect2.left ||
				rect1.left > rect2.right ||
				rect1.bottom < rect2.top ||
				rect1.top > rect2.bottom);
			if (overlap) {
				overlaps.push(App.getWeby().getWidget(widgetId));
			}
		}
		return overlaps;
	},

	setZIndex: function (index) {
		this._zindex = index;
		this._html.css('z-index', index);
		return this;
	},

	sendToBack: function () {
		this.setZIndex(this.getMinZIndex());
		return this;
	},

	bringToFront: function () {
		this.setZIndex(this.getMaxZIndex());
		return this;
	},

	bringForward: function () {
		var overlaps = this._getOverlappingWidgets();
		var indexes = [];
		for (var i in overlaps) {
			var ow = overlaps[i];
			if (ow.getZIndex() > this.getZIndex()) {
				indexes.push(ow.getZIndex());
			}
		}

		if (indexes.length == 0) {
			return;
		}

		var newIndex = Math.min.apply(Math, indexes) + 1;

		if (newIndex > 900000) {
			return;
		}

		this.setZIndex(newIndex);
		return this;
	},

	sendBackward: function () {
		var overlaps = this._getOverlappingWidgets();
		var indexes = [];
		for (var i in overlaps) {
			var ow = overlaps[i];
			if (ow.getZIndex() < this.getZIndex()) {
				indexes.push(ow.getZIndex());
			}
		}

		if (indexes.length == 0) {
			return;
		}

		var newIndex = Math.max.apply(Math, indexes) - 1;
		this.setZIndex(newIndex);
		return this;
	}
};

/**
 * URL of the Node.js service for content validation
 */
BaseWidget.CONTENT_VALIDATOR = '';
BaseWidget.CONTAINMENT = false;