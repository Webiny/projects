var BaseIframeWidget = function () {

	/**
	 * Error message to show when an invalid resource is given
	 */
	this._parseErrorMessage = '';

	/**
	 * If this is set to `true` or a method name, iframe "load" event will not be bound
	 * If method name is given - it will be called right after iframe is inserted into the DOM (iframe object will be passed).
	 * If simply `true` - nothing will be done (LinkedInWidget is using this as it's calling a callback from within iframe)
	 * NOTE: you will have to manually set this._isContentLoaded
	 */
	this._customOnLoadHandler = false;

	/**
	 * Resizable options that will be merged with _baseResizableOptions
	 */
	this._resizableOptions = {
		start: function (event, ui) {
			var $this = $(this).data('widget');
			$this.body().prepend('<div class="overlay"></div>');
			App.fireEvent("widget.resize.start", {element: $(this), event: event, ui: ui});
		},
		stop: function (event, ui) {
			var $this = $(this).data('widget');
			App.fireEvent("widget.resize.stop", {element: $(this), event: event, ui: ui});
			$this.body('.overlay').remove();
			//$this.html().css('height', 'auto');
		},
		resize: function (event, ui) {
			var $this = $(this).data('widget');
			$this.body('.overlay').css({height: $(this).height()+'px', width: $(this).width()+'px'});
			App.fireEvent("widget.resize", {element: $(this), event: event, ui: ui});
		}
	};

	/**
	 * When widget is inserted...
	 */
	this.onWidgetInserted = function () {
		var $this = this;
		BaseWidget.prototype.onWidgetInserted.call(this);
		this.hideResizeHandle();
		App.deactivateTool();
		this.input().focus().bind("blur keydown", function (e) {
			$this._inputReceived($this, e);
		});
	}

	this.getEditHTML = function () {
		var iframe = this.getIframe();
		this._html = $(iframe).attr({width: this._width, height: this._height});
		return BaseWidget.prototype.getHTML.call(this);
	};

	this._inputReceived = function ($this, e) {
		// If key was pressed
		if (e.type == "keydown" && e.keyCode != 13) {
			return;
		}

		e.preventDefault();
		e.stopPropagation();

		if ($.trim($this.input().val()) != '') {
			$this.input().unbind('blur keydown');
			var targetUrl = $this.getTargetUrl($this.input().val());
			// If no targetUrl was returned - show parse error message
			if (!targetUrl) {
				$this._parseError = true;
				$this.message().html($this._parseErrorMessage);
				$this.input().val('').bind('blur keydown', function (e) {
					$this._inputReceived($this, e);
				});
				$this.input().focus();
				return false;
			}
			// If targetUrl was received - check if it really exists
			$this.hideTools();
			$this.showLoading('Let\'s see what we have here...', 'Validating your URLs may take a few moments, please be patient.');
			$this.body().children(':not(".loading")').hide();

			$this.checkUrl(targetUrl, function (data) {
				if (data.urlExists) {
					$this._embedUrl = targetUrl;
					var iframe = $this.getIframe();
					$this._loadingContent = true;
					$this._insertIframe(iframe);
				} else {
					$this.hideLoading();
					$this.body().children().show();
					$this.message().html($this._parseErrorMessage);
					$this.input().val('').bind('blur keydown', function (e) {
						$this._inputReceived($this, e);
					});
					if(!$this._isActive){
						App.setActiveWidget($this);
						$this.activate();
					} else {
						$this.input().focus();
					}
					return false;
				}
			});
		}
		return false;
	}

	/**
	 * (PRIVATE)
	 *
	 * Insert iframe
	 * @param input jQuery input element
	 * @param iframe Html
	 */
	this._insertIframe = function (iframe) {
		var $this = this;

		iframe = $(iframe);

		var iframeWidth = iframe.attr("width");
		var iframeHeight = iframe.attr("height");

		iframe.prop({width: 0, height: 0});


		$this.input().replaceWith(iframe);
		if ('onIframeInserted' in $this) {
			$this.onIframeInserted();
		}

		// Append LOADING screen (move to BaseWidget)
		$this.showLoading();
		var jIframe = $('#' + iframe.attr("id"));

		// Bind `load` if no custom handler is specified
		if (!$this._customOnLoadHandler) {
			jIframe.bind('load', function () {
				jIframe.attr({width: iframeWidth, height: iframeHeight});
				$this.hideLoading().showResizeHandle().message().remove();
				if ('onContentLoaded' in $this) {
					$this.onContentLoaded();
				} else {
					$this.contentLoaded();
				}
				$(this).unbind("load");
			});
		}

		// If custom iframe load handler is specified - call it and pass it a jQuery iframe object
		if (typeof $this._customOnLoadHandler == 'string') {
			$this[$this._customOnLoadHandler](jIframe);
		}

		if ($this._alsoResize && $this._isResizable) {
			$this.html().resizable("option", "alsoResize", $this._alsoResize);
		}
		if ($this._aspectRatio && $this._isResizable) {
			$this.html().resizable("option", "aspectRatio", $this._aspectRatio);
		}
		App.fireEvent("widget.resize.stop", {element: $this.html()});
	}
}

BaseIframeWidget.prototype = new BaseWidget();
BaseIframeWidget.prototype.constructor = BaseIframeWidget;