var BaseTool = function () {
	/**
	 * AppToolbar object
	 */
	this._parent = null;

	/**
	 * Tool tag (map, video, etc.)
	 */
	this._toolTag = '';

	/**
	 * Mouse icon image
	 */
	this._mouseIcon = '';

	/**
	 * Mouse helper text
	 */
	this._mouseText = '';

	/**
	 * Tooltip text
	 */
	this._tooltipText = '';

	/**
	 * Mouse jQuery object that is attached to DOM
	 */
	this._mouseIconObject = null;

	/**
	 * Widget class to instantiate when dealing with widgets
	 */
	this._widgetClass = '';

	/**
	 * Parser class
	 */
	this._parserClass = '';

	/**
	 * Parser object
	 */
	this._parserObject = null;
}

BaseTool.WIDGET_COUNT = 0;

BaseTool.prototype = {

	/**
	 * If you need to have something done when a tool is constructed - put it here
	 * (It's nicer than making a mess in the "constructor")
	 */
	init: function () {
		// Called only first time a tool is constructed (when adding to toolbar)
	},

	/**
	 * Get tool tag (text, video, map, etc.)
	 * @returns {string}
	 */
	getTag: function () {
		return this._toolTag;
	},

	/**
	 * Can this tool handle the given data?
	 * @param data String to parse
	 */
	canHandle: function (data) {
		if (this._parserClass == '') {
			return false;
		}

		this._parserObject = new window[this._parserClass]();
		if (this._parserObject.parse(data)) {
			return true;
		}
		return false;
	},

	/**
	 * Activate tool
	 *
	 * @param action click|drag (depending on the action different text is being displayed on the helper icon)
	 */
	activate: function (action) {
		// Called each time a tool is activated in the toolbar
		if (typeof action == "undefined") {
			action = "click";
		}
		this.createMouseIcon(action);
		this._parent.getElement().find('[data-tool="' + this._toolTag + '"]');
		App.addContentOverlay();
	},

	/**
	 * Deactivate tool
	 * (removes mouse helper and deactivates the tool in the toolbar)
	 */
	deactivate: function () {
		// Called each time a tool is deactivated in the toolbar
		this._mouseIconObject.remove();
		this._parent.getElement().find('[data-tool="' + this._toolTag + '"]');
		App.removeContentOverlay();
	},

	/**
	 * Get icon that represents this tool in the toolbar
	 *
	 * @returns {*|jQuery|HTMLElement}
	 */
	getToolbarIcon: function () {
		return $('<li><a data-tool="' + this._toolTag + '" class="tool-icon ' + this._toolTag + '" title="' + this._tooltipText + '">' + this._tooltipText + '</a>' +
			'<a class="toolbar-icon-hover" href="javascript:void(0)">'+this._tooltipText+'</a></li>');
	},

	/**
	 * Create mouse helper that is position near the mouse cursor
	 * Text depends on the action that triggered tool activation (click or drag)
	 * @param action click|drag
	 */
	createMouseIcon: function (action) {
		var text = this._mouseText.replace('{action}', action == "click" ? "Click" : "Drop");
		this._mouseIconObject = $('<a style="visibility:hidden" class="mouse-icon ' + this._toolTag + '">' +
			'<span class="action">' + text + '</span><span class="cancel">(Press ESC to cancel)</span>' +
			'</a>');

		this._mouseIconObject.css('position', 'absolute');

		$('body').append(this._mouseIconObject);
	},

	/**
	 * Create widget of current tool at given coordinates
	 * @param x
	 * @param y
	 */
	createWidgetAt: function (x, y) {
		var widget = new window[this._widgetClass]();
		return this._insertWidgetAt(widget, x, y);
	},

	/**
	 * Create widget from parsed data (this._parserObject)
	 */
	createWidgetFromParser: function () {
		function randomBetween(from, to) {
			return Math.floor(Math.random() * (to - from + 1) + from);
		}

		var x = randomBetween(100, 700);
		var y = randomBetween(100, 300);
		var widget = this.createWidgetAt(x + App.getContent()[0].scrollLeft, y + App.getContent()[0].scrollTop);
		widget.setData(this._parserObject.getData());
	},

	/**
	 * (Private)
	 * Insert given widget object at given coordinates of the workspace
	 *
	 * @param BaseWidget widget
	 * @param int x
	 * @param int y
	 */
	_insertWidgetAt: function (widget, x, y) {
		var html = widget.setId(++BaseTool.WIDGET_COUNT).setPosition(x, y).getHTML();
		App.getContent().append(html);
		App.getWeby().addWidget(widget);
		widget.onWidgetInserted();
		widget.setZIndex(widget.getMaxZIndex());
		App.setActiveWidget(widget);
		widget.activate();
		return widget;
	},

	/**
	 * EVENTS
	 */

	/**
	 * Event: document.mouse.move
	 * @param e Mouse event
	 */
	documentMouseMove: function (e) {
		this._mouseIconObject.offset({ top: e.pageY, left: e.pageX + 35}).css('visibility', 'visible');
	},

	/**
	 * Event: content.click
	 * @param e Mouse event
	 */
	contentClick: function (e) {
		if(e.offsetX > App.getContent().width() || e.offsetY > App.getContent().height()){
			return;
		}
		this.createWidgetAt(e.offsetX, e.offsetY);
	}
};