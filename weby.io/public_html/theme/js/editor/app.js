var AppClass = function () {
    var _content = $('#content');
    var _contentWrapper = $('#wrapper');
    var _header = $('#header');
    var _appToolbar;
    var _dashboard = null;
    var _favorites = null;
    var _weby = false;
    var _webyDrag;
    var _viewportHeight;
    var _viewportWidth;
    var _activeWidget = null
    var _topOffset = 98;
    var _bottomOffset = 27;
    var _eventListeners = [];
    var _webyLogger = null;

    /**
     * Catch Ctrl+V key press
     */
    $(document).keydown(function (e) {

        if (!((e.metaKey || e.ctrlKey) && e.keyCode == 86)) {
            return;
        }

        if ($('body :focus').length > 0) {
            return;
        }
        var bucket = $('<textarea id="clipboard" style="position:absolute; top:-999999px; left: -999999px"></textarea>');
        $('body').append(bucket);
        bucket.focus();
        setTimeout(function () {
            var data = bucket.val();
            bucket.remove();
            App.contentPasted(data);
        }, 100);
    });

    /**
     * Catch Ctrl+S key press
     */
    $(document).keydown(function (e) {

        if (!((e.metaKey || e.ctrlKey) && e.keyCode == 83)) {
            return;
        }
        e.preventDefault();
        App.getWeby().save();
    });

    /**
     * Catch arrow keys
     */
    $(document).keydown(function (e) {
        if (_activeWidget == null || App.isInputFocused(e)) {
            return;
        }

		var key = e.keyCode;
        var distance = 1;
        if (e.shiftKey) {
            distance = 10;
        }

        switch (key) {
            case 37:
                _activeWidget.moveLeft(distance);
                break;
            case 38:
                _activeWidget.moveUp(distance);
                break;
            case 39:
                _activeWidget.moveRight(distance);
                break;
            case 40:
                _activeWidget.moveDown(distance);
                break;
        }

        if ($.inArray(key, [37, 38, 39, 40]) > -1) {
            e.preventDefault();
			return false;
        }
    });

    /**
     * Catch delete key press
     */
    $(document).keydown(function (e) {
        if (e.keyCode == 46) {
            if (_activeWidget != null && !App.isInputFocused(e)) {
                _activeWidget.remove();
            }
        }
    });

    this.isInputFocused = function (e) {
        var textEditable = false;
        if ($(e.target).hasClass('text-editable') || $(e.target).closest('.text-editable').length !== 0) {
            textEditable = true;
        }
        if ($(e.target).hasClass('tags-editable')) {
            textEditable = true;
        }

        var element = e.target.nodeName.toLowerCase();
        if (element != 'input' && element != 'textarea' && !textEditable) {
            return false;
        }
        return true;
    }
    /**
     * Application bootstrap
     */
    this.init = function () {
        _webyLogger = WebyLogger.init();

        this.addEventListener(this);
        _appToolbar = new AppToolbar();
        _appToolbar.init();

        _dashboard = new WebyDashboard();
        _favorites = new WebyFavorites();

        // Bind events
        $(document).keydown(function (e) {
            // Backspace
            if (!App.isInputFocused(e)) {
                if (e.keyCode === 8) {
                    return false;
                }
            }

            // Duplicate - Ctrl+D
            if (e.keyCode == 68 && e.ctrlKey && _activeWidget && _activeWidget.isContentLoaded()) {
                e.stopPropagation();
                e.preventDefault();
                App.getWeby().duplicateWidget(_activeWidget);
            }
        });

        $('body').mousemove(function (e) {
            App.fireEvent("document.mouse.move", e);
        });

        _content.bind({
            click: function (e) {
                App.fireEvent("content.click", e);
            },
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


        // Widget is clicked
        _content.on('click', '.widget', function (e) {
            // If mouse was really moved (mousemove event is fired even on 'click' so it's not a reliable metric) don't click the widget
            if (App.mouseStart != e.clientX + ':' + e.clientY) {
                return;
            }
            App.fireEvent("widget.click", e);
        });

        _content.on('mousedown', '.widget', function (e) {
            // Need to store some representation of current mouse position for later comparison
            App.mouseStart = e.clientX + ':' + e.clientY;
            App.fireEvent("widget.mousedown", e);
            if (_activeWidget != null) {
                e.stopPropagation();
            }
        });

        // Widget is double clicked
        _content.on('dblclick', '.widget', function (e) {
            if (!$(e.target).hasClass('control')) {
                App.fireEvent("widget.dblclick", e);
            }
        });

        // Recalculate editor dimensions when window is resized
        $(window).resize(function () {
            // prevent recalculation if the resize is triggered by jQuery UI resizable
            if ($('.ui-resizable-resizing').length > 0) {
                return;
            }
            _viewportWidth = $(window).width();
            _viewportHeight = $(window).height();
            App.getWeby().getBackground().recalculateContentSize();
            App.fireEvent("viewport.resize");
        });

        // Setup initial content sizes
        _viewportWidth = $(window).width();
        _viewportHeight = $(window).height();
        _contentWrapper.width(_viewportWidth);
        _contentWrapper.height(_viewportHeight - _topOffset - _bottomOffset);

        // Setup dragging and Weby
        _webyDrag = new WebyDrag(_content);
        _weby = new Weby();
        this.addEventListener(_weby);
        _weby.init();
    }

    this.addEventListener = function (obj) {
        _eventListeners.push(obj);
        return this;
    }

    this.showLoading = function () {
        var margin = $(window).height() / 2 - 50;
        $('body').append('<div id="app-loading"><span style="top: ' + margin + 'px">Loading your Weby...</span></div>');
    }

    this.hideLoading = function () {
        $('#app-loading').fadeOut('slow', function () {
            $(this).remove();
        });
    }

    /**
     * Get current Weby
     * @returns Weby
     */
    this.getWeby = function () {
        return _weby;
    }

    this.getDashboard = function() {
        return _dashboard;
    }

    /**
     * Unset current active widget
     */
    this.unsetActiveWidget = function () {
        _activeWidget = null;
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
        return parseInt(_contentWrapper.css("margin-left"));
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
     * Get jQuery content element
     */
    this.getContent = function () {
        return _content;
    }

    /**
     * Get jQuery content wrapper element
     */
    this.getContentWrapper = function () {
        return _contentWrapper;
    }

    /**
     * Get header jQuery object
     */
    this.getHeader = function () {
        return _header;
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

        // Propagate event to active widget
        if (_activeWidget != null && event in _activeWidget) {
            _activeWidget[event](data);
        }

        // Propagate event to active tool
        var activeTool = _appToolbar.getActiveTool();
        if (activeTool != null && event in activeTool) {
            _appToolbar.getActiveTool()[event](data);
        }
    }

    this.deactivateTool = function () {
        _appToolbar.deactivateTool();
    }

    this.getActiveTool = function () {
        return _appToolbar.getActiveTool();
    }

	this.getActiveWidget = function(){
		return _activeWidget;
	}

    this.setActiveWidget = function (widget) {
        if (_activeWidget != null) {
            _activeWidget.deactivate();
        }
        _activeWidget = widget;
    }

    this.addContentOverlay = function () {
        App.getContent().prepend($('<div id="content-overlay"></div>'));
    }

    this.removeContentOverlay = function () {
        $('#content-overlay').remove();
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

    // EVENTS //
    this.widgetDragStart = function (data) {
        this.getContent().addClass('grabbing');
        this.addContentOverlay();
    }

    this.widgetDragStop = function (data) {
        this.getContent().removeClass('grabbing');
        this.removeContentOverlay();
    }

    this.widgetRotateStart = function (data) {
        this.addContentOverlay();
    }

    this.widgetRotateStop = function (data) {
        this.removeContentOverlay();
    }

    this.widgetResizeStart = function () {
        this.addContentOverlay();
    }

    this.widgetResize = function (data) {
        // Nothing
    }

    this.widgetResizeStop = function (data) {
        this.removeContentOverlay();
    }

    this.contentClick = function (data) {
        if (data.target && $(data.target).closest('.widget').length !== 0) {
            return;
        }
        $(':focus').blur();
        // In case iframe was focused - return focus to main window
        window.focus();
        // Deactivate active widget
        if (_activeWidget != null) {
            if(_activeWidget.deactivate()){
				_activeWidget = null;
			}
        }
    }

    this.widgetClick = function (e) {
        // In case iframe was focused - return focus to main window
        window.focus();
        e.stopPropagation();
        // Activate clicked widget
        var id = $(e.target).closest('.widget').attr('data-id');
        if (_activeWidget != null && _activeWidget.getId() != id) {
            $(':focus').blur();
            _activeWidget.deactivate();
        }
        _activeWidget = _weby.getWidgets()[id];
        _activeWidget.activate(e);
    }

    this.widgetDblclick = function (e) {
        e.stopPropagation();
        if (_activeWidget != null) {
            _activeWidget.makeEditable();
        }
    }

    this.contentPasted = function (data) {
        var tools = _appToolbar.getAllTools();
        for (var i in tools) {
            var tool = tools[i];
            // Text and file tools are processed in the end
            if (tool.getTag() == 'text' || tool.getTag() == 'link') {
                continue;
            }
            if (tool.canHandle(data)) {
                tool.createWidgetFromParser();
                return;
            }
        }

        //Check file
        if (tools['link'].canHandle(data)) {
            return tools['link'].createWidgetFromParser();
        }

        // Insert plain text
        var textWidget = tools['text'].createWidgetAt(100, 100);
        textWidget.setData(data);
    }
}