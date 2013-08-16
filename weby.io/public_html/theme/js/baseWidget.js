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
	 * NOTE!!!!
	 * In UI components events are fired to enforce the use of App event manager and not direct object modification
	 * Refer to _base options to see which events can be caught by implementing corresponding methods
	 */

	/**
	 * Common draggable options
	 * To catch events in your widget - implement "widgetDrag", "widgetDragStart" and "widgetDragStop" methods
	 */
	this._baseDraggableOptions = {
		//handle: '.drag-handle'
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
			var $this = $(this).data('widget');
			App.fireEvent("widget.rotate.stop", {element: $(this), event: event, ui: ui});
			setTimeout(function () {
				$this._html.draggable("destroy");
				$this._html.draggable($this._baseDraggableOptions);
			}, 50);
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
	 * This method should be called at the end of your widget constructor
	 * It will merge UI options for later attachment to the widget
	 */
	init: function () {
		this._baseDraggableOptions["containment"] = [parseInt(App.getContent().css("left")), parseInt(App.getContent().css("top"))];
		$.extend(this._baseDraggableOptions, this._draggableOptions);
		$.extend(this._baseRotatableOptions, this._rotatableOptions);
		$.extend(this._baseResizableOptions, this._resizableOptions);
	},

	/**
	 * Delete current widget
	 */
	delete: function () {
		// Remove widget HTML
		this._html.remove();
		// Remove widget from the App
		App.getWeby().removeWidget(this._id);
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
	setPosition: function (x, y) {

		if (this._html != undefined) {
			if (x < 0) {
				x = 0;
			}
			if (y < 0) {
				y = 0;
			}
		}

		this._left = x;
		this._top = y;
		if (typeof this._html != "undefined") {
			this._html.css('top', this._top + 'px').css('left', this._left + 'px');
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

		_widget.append('<div class="control remove-handle"><i class="icon-remove"></i></div>');
		_widget.find('.remove-handle').click(function () {
			$this.delete();
		});

		if (this._isDraggable) {
			_widget.append('<div class="control drag-handle"><i class="icon-move"></i></div>');
		}
		if (this._isResizable) {
			_widget.append('<div class="control resize-handle ui-resizable-handle"><i class="icon-crop"></i></div>');
		}
		if (this._isRotatable) {
			_widget.append('<div class="control rotate-handle"><i class="icon-undo"></i></div>');
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
		if(this._rotation != 0){
			var rotateCSS = 'rotate(' + this._rotation + 'deg)';

			_widget.css({
				'transform': rotateCSS,
				'-webkit-transform': rotateCSS
			});
		}

		this._html = _widget;
		this._html.find('.control').css("visibility", "hidden");
		return this._html;
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
		this._bindControls();
	},
	/*
	 MOVE TO WIDGET TOOLBAR

	 this._html.find('.index-handle.up').click(function(){
	 $this.increaseZIndex();
	 });

	 this._html.find('.index-handle.down').click(function(){
	 $this.decreaseZIndex();
	 });

	 this._html.find('.lock-handle').click(function(){
	 if($this._locked){
	 $this.unlockWidget();
	 } else {
	 $this.lockWidget();
	 }
	 });*/

	/**
	 * Show resize handle if this widget is resizable
	 */
	showResizeHandle: function () {
		if (this._isResizable && this._isContentLoaded && this._isActive) {
			this._html.find('.resize-handle').css("visibility", "visible");
		}
	},

	/**
	 * Hide resize handle
	 */
	hideResizeHandle: function () {
		this._html.find('.resize-handle').css("visibility", "hidden");
	},

	/**
	 * Get next usable z-index
	 * @returns {number}
	 */
	getNextZIndex: function () {
		var maxZ = 0;
		$('.widget').each(function () {
			var z = parseInt($(this).css('z-index'), 10);
			if (maxZ < z) {
				maxZ = z;
			}
		});
		return ++maxZ;
	},

	/**
	 * Activate widget
	 * Show widget handles and interaction layer
	 * @param e Mouse event
	 */
	activate: function (e) {
		if (this._isActive) {
			var textEditable = false;
			if ($(e.target).hasClass('text-editable') || $(e.target).closest('.text-editable').length !== 0) {
				textEditable = true;
			}
			// Don't remove input focus if input element was clicked
			if (e && e.target.nodeName.toLowerCase() != 'input' && e.target.nodeName.toLowerCase() != 'textarea' && !textEditable) {
				this._html.find(':focus').blur();
			}
			return;
		}
		this._isActive = true;
		this._html.draggable("enable");
		this._html.find('.control').css("visibility", "visible");
		if (!this._isContentLoaded) {
			this.hideResizeHandle();
		}
		this._html.addClass('active');
		if (!this._isContentLoaded) {
			this.makeEditable();
		}

		if (!this._isContentLoaded) {
			this.input().focus();
		}

		if ('onActivate' in this) {
			this.onActivate();
		}
	},

	/**
	 * Make widget editable (calls widget `onMakeEditable` method if implemented)
	 * This is triggered on widget doubleclick
	 * Widget handles are hidden and you can interact with widget content
	 */
	makeEditable: function () {
		this._isEditable = true;
		this._html.find('.widget-disabled-overlay').remove();
		this._html.addClass('editable');
		if (this._isContentLoaded) {
			this._html.find('.control').css("visibility", "hidden");
		}

		if ('onMakeEditable' in this) {
			this.onMakeEditable();
		}
	},

	/**
	 * Deactivate widget
	 * Hide all handles, restore interaction layer, disable dragging
	 */
	deactivate: function () {
		this._isActive = this._isEditable = false;
		this._html.find('.control').css("visibility", "hidden");
		this._html.removeClass('active');
		this._html.removeClass('editable');
		if (this._html.find('.widget-disabled-overlay').length === 0) {
			// Append interaction layer and set it's line-height to height of the widget
			this._addInteractionOverlay();
			this._resize();
		}

		if ('onDeactivate' in this) {
			this.onDeactivate();
		}
	},

	contentLoaded: function () {
		this._width = this._html.width();
		this._height = this._html.height();
		this._isContentLoaded = true;
	},

	isContentLoaded: function () {
		return this._isContentLoaded;
	},

	/**
	 * Set data and try loading
	 * @param data
	 */
	setData: function (data) {
		this._html.find(this._inputElement).val(data).blur();
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
			aspectRatio: this._isResizable ? this._html.resizable("option", "aspectRatio") : false,
			isLocked: this._isLocked,
			embedUrl: this._embedUrl
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
		this._addInteractionOverlay();
		this._resize();
		this._isContentLoaded = true;
		this._bindControls();
		if ('onEditWidgetInserted' in this) {
			this.onEditWidgetInserted();
		}
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
	 */
	showLoading: function (mainText, secondaryText) {
		if (typeof mainText == "undefined" || mainText == '') {
			mainText = this._loadingMessage;
		}

		if (typeof secondaryText == "undefined" || secondaryText == '') {
			secondaryText = 'This may take a few moments, please be patient.';
		}

		var widgetHeight = this._html.find('.widget-body').height();
		var widgetWidth = this._html.find('.widget-body').width();

		var style = {
			width: widgetWidth + 'px',
			height: widgetHeight - (widgetHeight / 2) - 4 + 'px',
			'padding-top': (widgetHeight / 2) - 20 + 'px'
		};

		var loading = $('<div class="loading"><div class="loading-message">' + mainText + '<br /><span>' + secondaryText + '</span></div></div>').css(style);
		if (this._html.find('.loading').length > 0) {
			this._html.find('.loading').replaceWith(loading);
		} else {
			this._html.find('.widget-body').prepend(loading);
		}
	},

	hideLoading: function () {
		this._html.find('.widget-body .loading').remove();
	},

	setContainment: function (containment) {
		this._html.draggable("option", "containment", containment);
	},

	body: function () {
		return this._html.find('.widget-body');
	},

	input: function () {
		return this._html.find(this._inputElement);
	},

	message: function () {
		return this._html.find('.message');
	},

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

	// EVENTS

	/**
	 * Event: widget.resize.stop
	 * @param data
	 */
	widgetResizeStop: function (data) {
		this._width = data.element.width();
		this._height = data.element.height();
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
		this._html.find('span.text').css('line-height', this._html.outerHeight() + 'px');
	},

	/**
	 * Bind draggable, rotatable and resizable
	 * @private
	 */
	_bindControls: function () {
		if (this._isDraggable) {
			this._html.data('widget', this).draggable(this._baseDraggableOptions);
		}
		if (this._isResizable) {
			this._html.data('widget', this).resizable(this._baseResizableOptions);
			if (this._alsoResize) {
				this._html.resizable("option", "alsoResize", this._alsoResize);
			}

			if (this._aspectRatio) {
				this._html.resizable("option", "aspectRatio", this._aspectRatio);
			}
		}

		if (this._isRotatable) {
			var $this = this;
			this._html.find('.rotate-handle').mousedown(function (e) {
				$this._rotateStart = e.pageX;
				$this._html.draggable("destroy");
				$this._html.data('widget', $this).draggable($this._baseRotatableOptions);
			}).mouseup(function () {
					setTimeout(function () {
						$this._html.draggable("destroy");
						$this._html.data('widget', $this).draggable($this._baseDraggableOptions);
					}, 50);
				}).dblclick(function () {
					$this._rotation = 0;
					$this._html.css('-webkit-transform', 'none').css('transform', 'none');
					;
				});
		}
	},

	_addInteractionOverlay: function () {
		this._html.prepend('<div class="widget-disabled-overlay"><span class="text">Doubleclick to interact</span></div>');
	},

	/**
	 * NOT USED FOR NOW!!!!!!!!!!!!!!!!!!!!!
	 */
	lockWidget: function () {
		this._html.find('.control').not('.lock-handle').hide();
		this._locked = true;
		this._html.find('.lock-handle i').removeClass('icon-unlock-alt').addClass('icon-lock');
	},

	unlockWidget: function () {
		this._html.find('.control').not('.lock-handle').show();
		this._locked = false;
		this._html.find('.lock-handle i').removeClass('icon-lock').addClass('icon-unlock-alt');
	},

	setZIndex: function (index) {
		this._zindex = index;
		this._html.css('z-index', index);
	},

	increaseZIndex: function () {
		this.setZIndex(this._zindex + 1);
	},

	decreaseZIndex: function () {
		if (this._zindex > 1) {
			this.setZIndex(this._zindex - 1);
		}
	}
};

/**
 * URL of the Node.js service for content validation
 */
BaseWidget.CONTENT_VALIDATOR = '';