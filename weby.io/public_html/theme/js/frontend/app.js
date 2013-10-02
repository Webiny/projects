var AppClass = function (topOffset) {

	var _content = $('#content');
	var _document = $('#document-container');
	var _workspace = $('#workspace');
	var _header = $('#header');
	var _dashboard = null;
	var _favorites = null;
	var _followers = null;
	var _weby = false;
	var _webyDrag;
	var _viewportHeight;
	var _viewportWidth;
	var _topOffset = 98;
	var _bottomOffset = 27;
	var _eventListeners = [];
	var _noHeader = false;
    var _userLoggedIn = !!parseInt($('[data-role="user-logged-in"]').text());

	if (typeof topOffset != "undefined") {
		_topOffset = topOffset;
	}

	/**
	 * Application bootstrap
	 */
	this.init = function () {
		
		$('body').mousemove(function (e) {
			App.fireEvent("document.mouse.move", e);
		});

		if("WebyDashboard" in window && "WebyFavorites" in window && _userLoggedIn){
			_dashboard = new WebyDashboard();
			_favorites = new WebyFavorites();
			_followers = new WebyFollowers();
		}

		_workspace.bind({
			mouseleave: function () {
				_webyDrag.stopDrag();
			},
			mousemove: function (e) {
				_webyDrag.contentMouseMove(e);
			},
			mouseup: function (e) {
				$('body').removeClass('unselectable');
				_webyDrag.contentMouseUp(e);
			},
			mousedown: function (e) {
				$('body').addClass('unselectable');
				e.originalEvent.preventDefault();
				_webyDrag.contentMouseDown(e);
			},
			// Webkit mousewheel
			mousewheel: function (e) {
				_webyDrag.contentMouseWheel(e);
			},
			// Firefox mousewheel
			DOMMouseScroll: function (e) {
				_webyDrag.contentMouseWheel(e);
			},
			// TOUCH events
			touchstart: function (e) {
				$('body').addClass('unselectable');
				_webyDrag.contentMouseDown(e);
			},
			touchmove: function (e) {
				_webyDrag.contentMouseMove(e);
			},
			touchend: function (e) {
				$('body').removeClass('unselectable');
				_webyDrag.contentMouseUp(e);
			}
		});

		_content.on('mousedown', '.widget', function (e) {
			e.stopPropagation();
		});

		// Recalculate editor dimensions when window is resized
		$(window).resize(function () {
			_viewportWidth = $(window).width();
			_viewportHeight = $(window).height();
			App.getWeby().getBackground().recalculateContentSize();
			App.fireEvent("viewport.resize");
		});

		// Setup initial content sizes
		_viewportWidth = $(window).width();
		_viewportHeight = $(window).height();
		_workspace.width(_viewportWidth);
		_workspace.height(_viewportHeight - _topOffset);

		// Setup dragging and Weby
		_webyDrag = new WebyDrag(_content);
		_weby = new Weby();
		_weby.init();
	}

    this.userLoggedIn = function() {
        return _userLoggedIn;
    }

    this.isEditor = function() {
        return false;
    }

	this.addEventListener = function (obj) {
		_eventListeners.push(obj);
		return this;
	}

	this.noHeader = function(flag){
		if(flag == undefined){
			return _noHeader;
		}
		_noHeader = flag;
		return this;
	}

	/**
	 * Get current Weby
	 * @returns Weby
	 */
	this.getWeby = function () {
		return _weby;
	}

	/**
	 * Returns current viewport height
	 */
	this.getViewportHeight = function () {
		return _viewportHeight;
	}

	/**
	 * Returns current viewport width
	 */
	this.getViewportWidth = function () {
		return _viewportWidth;
	}

	/**
	 * Returns width that is available for content div
	 * (used when canvas size is unknown and we need to find maximum available content size)
	 * @returns {number}
	 */
	this.getAvailableContentWidth = function () {
		return _viewportWidth - _weby.getScrollBarOffset();
	}

	/**
	 * Returns height that is available for content div
	 * (used when canvas size is unknown and we need to find maximum available content size)
	 * @returns {number}
	 */
	this.getAvailableContentHeight = function () {
		return _viewportHeight - _topOffset - _bottomOffset - _weby.getScrollBarOffset();
	}

	/**
	 * Returns content offset from the top of the window (header, height is changing depending on view mode (embed, normal, screenshot...))
	 * @returns {number}
	 */
	this.getTopOffset = function () {
		return _topOffset;
	}

	/**
	 * Returns content offset from the bottom of the window
	 * @returns {number}
	 */
	this.getBottomOffset = function () {
		return _bottomOffset;
	}

	/**
	 * Returns content offset from the left border of the window
	 * @returns {number}
	 */
	this.getLeftOffset = function () {
		return parseInt(_content.css("margin-left"));
	}

	/**
	 * Get jQuery content element
	 */
	this.getContent = function () {
		return _content;
	}

	this.getDocument = function(){
		return _document;
	}

	/**
	 * Get jQuery content wrapper element
	 */
	this.getWorkspace = function () {
		return _workspace;
	}

	/**
	 * Main APP event manager
	 * All events related to widgets, toolbars, clicks, moves, etc. must be routed through here!!
	 * @param event Event name in form "widget.drag.start"
	 * @param data Relevant event data (array, object, mouse event, whatever...)
	 * @param all Should this event be passed to all tools
	 */
	this.fireEvent = function (event, data) {
		// Make sure mouse event has 'offsetX' and 'offsetY' set (for Firefox)
		if (data && 'offsetX' in data) { // This is to verify it's a mouse event
			data = MouseEvent.normalize(data);
		}

		// Construct event method name
		var parts = event.split('.');
		for (var i in parts) {
			var part = parts[i];
			if (i == 0) {
				event = part;
			} else {
				event += part.charAt(0).toUpperCase() + part.slice(1);
			}
		}

		for (var i in _eventListeners) {
			if (event in _eventListeners[i]) {
				_eventListeners[i][event](data);
			}
		}
	}
	/**
	 * Format file size
	 * @param number Number in bytes
	 */
	this.formatFileSize = function (number) {
		if (!number || typeof number == "undefined" || number == 0) {
			return 'N/A';
		}
		number = parseInt(number)

		function formatNumber(num) {
			var size = ['bytes', 'KB', 'MB', 'GB'];
			for (var i in size) {
				if (num < 1024.0) {
					return parseFloat(Math.round(num * 100) / 100).toFixed(2) + ' ' + size[i];
				}
				num /= 1024.0
			}
			return parseFloat(Math.round(num * 100) / 100).toFixed(2) + ' TB';
		}

		return formatNumber(number);
	}
}