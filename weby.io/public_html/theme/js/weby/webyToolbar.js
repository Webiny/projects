function WebyToolbar() {

	App.addEventListener(this);

	var _activeWidget;
	var _widgetSettings = $('#widget-settings-dropdown');
	var _canvasSettings = $('#canvas-settings-dropdown');
	var _documentBackgroundSettings = $('#document-settings-dropdown');
	var _webyColorPicker;
	var _documentColorPicker;
	var _colorPicker;
	var _opacitySlider;
	var _widthSlider;
	var _radiusSlider;
	var _shadowDistanceSlider;
	var _shadowSpreadSlider;
	var _shadowColorPicker;
	var _canvasWidth;
	var _canvasHeight;
	var _fileWidget = $('#file-widget');
	var _removeImageBtn = $('#background-image-remove');
	var $this = this;

	$('.send-backward').click(function () {
		_documentBackgroundSettings.hide();
		_canvasSettings.hide();
		_activeWidget.sendBackward();
	});

	$('.bring-forward').click(function () {
		_documentBackgroundSettings.hide();
		_canvasSettings.hide();
		_activeWidget.bringForward();
	});

	$('.send-to-back').click(function () {
		_documentBackgroundSettings.hide();
		_canvasSettings.hide();
		_activeWidget.sendToBack();
	});

	$('.bring-to-front').click(function () {
		_documentBackgroundSettings.hide();
		_canvasSettings.hide();
		_activeWidget.bringToFront();
	});

	$('.background').click(function () {
		$this.deactivateWidget();
		_documentBackgroundSettings.hide();
		if (_canvasSettings.css('display') == 'none') {
			_canvasSettings.show();
			_webyColorPicker.value(_webyColorPicker.value());
		} else {
			_canvasSettings.hide();
		}
	});

	$('#canvas-settings').tabs({
		activate: function (event, ui) {
			if (ui.newTab[0].hasAttribute('data-tab') && ui.newTab.attr('data-tab') == 'video') {
				App.getWeby().getBackground().getVideoBackground().hideErrorMessage();
			}
		}
	});

	var currentColor = App.getWeby().getBackground().getColorBackground().getColor();

	_webyColorPicker = $("#color-picker").kendoFlatColorPicker({
		preview: true,
		opacity: true,
		value: currentColor == null ? 'rgba(255, 255, 255, 0.50)' : currentColor,
		change: function (e) {
			App.getWeby().getBackground().getColorBackground().setColor(e.value).render();
		}
	}).data("kendoFlatColorPicker");

	var patternsDataSource = new kendo.data.DataSource({
		data: WebyPatterns.PATTERNS,
		pageSize: 5
	});

	$(".patterns-pager").kendoPager({
		dataSource: patternsDataSource,
		buttonCount: 1
	});

	$("#patterns-list").kendoListView({
		dataSource: patternsDataSource,
		template: kendo.template('<div class="pattern" data-pattern="${name}" style="background: url(\'' + THEME + 'images/patterns/${name}\') ${repeat}"></div>'),
		selectable: "single",
		change: function () {
			App.getWeby().getBackground().getPatternBackground().setPattern(this.select().attr("data-pattern")).render();
		}
	});

	/**
	 * WIDGET SETTINGS
	 */

	$('#weby-toolbar-wrapper .tool-icon.frame').click(function () {
		_canvasSettings.hide();
		_documentBackgroundSettings.hide();
		if (_activeWidget == null) {
			return;
		}
		if (_widgetSettings.css('display') == 'none') {
			App.fireEvent("widget.settings.activate");
			_widgetSettings.show();
			_activeWidget.hideTools();
			_colorPicker.value(_colorPicker.value());
		} else {
			App.fireEvent("widget.settings.deactivate");
			_widgetSettings.hide();
			_activeWidget.showTools();
		}
	});

	_colorPicker = $("#widget-color").kendoColorPicker({
		opacity: true,
		preview: true,
		buttons: false,
		change: function (e) {
			_activeWidget.setColor(e.value);
		},
		select: function (e) {
			_activeWidget.setColor(e.value);
		}
	}).data("kendoColorPicker");

	_opacitySlider = $("#widget-opacity").kendoSlider({
		min: 0,
		max: 100,
		showButtons: false,
		tickPlacement: 'none',
		tooltip: {
			enabled: false
		},
		change: function (e) {
			_activeWidget.setOpacity(e.value / 100);
		},
		slide: function (e) {
			_activeWidget.setOpacity(e.value / 100);
		}
	}).data("kendoSlider");

	_radiusSlider = $("#widget-radius").kendoSlider({
		min: 0,
		max: 20,
		showButtons: false,
		tickPlacement: 'none',
		tooltip: {
			enabled: false
		},
		change: function (e) {
			_activeWidget.setRadius(e.value);
		},
		slide: function (e) {
			_activeWidget.setRadius(e.value);
		}
	}).data("kendoSlider");

	_widthSlider = $("#widget-width").kendoSlider({
		min: 0,
		max: 50,
		showButtons: false,
		tickPlacement: 'none',
		tooltip: {
			enabled: false
		},
		change: function (e) {
			_activeWidget.setPadding(e.value);
		},
		slide: function (e) {
			_activeWidget.setPadding(e.value);
		}
	}).data("kendoSlider");

	_shadowDistanceSlider = $("#widget-shadow-distance").kendoSlider({
		min: 0,
		max: 50,
		showButtons: false,
		tickPlacement: 'none',
		tooltip: {
			enabled: false
		},
		change: function (e) {
			_activeWidget.setShadowDistance(e.value);
		},
		slide: function (e) {
			_activeWidget.setShadowDistance(e.value);
		}
	}).data("kendoSlider");

	_shadowSpreadSlider = $("#widget-shadow-spread").kendoSlider({
		min: 0,
		max: 50,
		showButtons: false,
		tickPlacement: 'none',
		tooltip: {
			enabled: false
		},
		change: function (e) {
			_activeWidget.setShadowSpread(e.value);
		},
		slide: function (e) {
			_activeWidget.setShadowSpread(e.value);
		}
	}).data("kendoSlider");

	_shadowColorPicker = $("#shadow-color").kendoColorPicker({
		opacity: true,
		preview: true,
		buttons: false,
		change: function (e) {
			_activeWidget.setShadowColor(e.value);
		},
		select: function (e) {
			_activeWidget.setShadowColor(e.value);
		}
	}).data("kendoColorPicker");

	_removeImageBtn.click(function () {
		App.getWeby().getBackground().getImageBackground().setImage(null).render();
		_fileWidget.show();
		_removeImageBtn.hide();
	});

	$("#file").kendoUpload({
		multiple: false,
		async: {
			saveUrl: WEB + "editor/upload-image/?weby=" + App.getWeby().getId(),
			autoUpload: true
		},
		showFileList: false,
		localization: {
			select: 'Select image...'
		},
		success: function (e) {
			if (e.operation != "upload") {
				return;
			}

			if (e.response.error) {
				if (e.operation == "upload") {
					$('span.error-message').html(e.response.msg).show();
				}
			} else {
				App.getWeby().getBackground().getImageBackground().setMode('aligned').setImage(e.response.url).setAlign('left top').render();
				_fileWidget.hide();
				_removeImageBtn.show();
			}
			_fileWidget.find('.k-upload-status').remove();
		},
		select: function (e) {
			$('span.error-message').html('').hide();
			if (e.files[0].size > 2097152) {
				$('span.error-message').html('Please select a file smaller than 2MB.').show();
				e.preventDefault();
			}
		}
	});

	$('#file-widget .k-upload-empty').removeClass('k-upload-empty').addClass('k-upload');

	$('span.error-message').hide();

	if (App.getWeby().getBackground().getImageBackground().getImage() != null) {
		_fileWidget.hide();
		_removeImageBtn.show();
	}

	/**
	 * CANVAS SIZE
	 */

	var _previousWidth = 0;
	var _previousHeight = 0;
	var _lastWidth = 0;
	var _lastHeight = 0;

	var _canvasSizeChange = function () {
		if(isNaN(_canvasWidth.value())){
			_canvasWidth.value(_lastWidth);
		}

		if(isNaN(_canvasHeight.value())){
			_canvasHeight.value(_lastHeight);
		}

		if (_canvasWidth.value() == _lastWidth && _canvasHeight.value() == _lastHeight) {
			return;
		}
		if (_canvasWidth.value() == null) {
			_canvasWidth.value(App.getViewportWidth());
		}
		if (_canvasHeight.value() == null) {
			_canvasHeight.value(App.getViewportHeight() - App.getTopOffset() - App.getBottomOffset());
		}
		App.getWeby().getBackground().applyCanvasSize(_canvasWidth.value(), _canvasHeight.value());

		_previousWidth = _lastWidth;
		_lastWidth = _canvasWidth.value();
		_previousHeight = _lastHeight;
		_lastHeight = _canvasHeight.value();
	}

	_canvasWidth = $("#canvas-width").kendoNumericTextBox({
		min: 600,
		step: 1,
		decimals: 0,
		format: "n0",
		change:_canvasSizeChange,
		spin: _canvasSizeChange
	}).data("kendoNumericTextBox");

	_canvasHeight = $("#canvas-height").kendoNumericTextBox({
		min: 600,
		step: 1,
		decimals: 0,
		format: "n0",
		change: _canvasSizeChange,
		spin: _canvasSizeChange
	}).data("kendoNumericTextBox");

	// Select input value on focus
	$("#canvas-width").focus(function () {
		var $this = this;
		setTimeout(function () {
			$this.select();
		})
	});

	// Select input value on focus
	$("#canvas-height").focus(function () {
		var $this = this;
		setTimeout(function () {
			$this.select();
		})
	});

	this.setCanvasSize = function (width, height) {
		if (_previousWidth == 0) {
			_previousWidth = _lastWidth = width;
			_previousHeight = _lastHeight = height;
		}
		_canvasWidth.value(width);
		_canvasHeight.value(height);
	}

	this.restorePreviousCanvasSize = function () {
		this.setCanvasSize(_previousWidth, _previousHeight);
		_lastHeight = _previousHeight;
		_lastWidth = _previousWidth;
	}

	/**
	 * DOCUMENT SETTINGS
	 */

	$("#document-settings").tabs();

	var currentColor = App.getWeby().getDocumentBackground().getColor();

	_documentColorPicker = $("#doc-color-picker").kendoFlatColorPicker({
		preview: true,
		opacity: true,
		value: currentColor == null ? 'rgba(255, 255, 255, 0.50)' : currentColor,
		change: function (e) {
			App.getWeby().getDocumentBackground().setColor(e.value).render();
		}
	}).data("kendoFlatColorPicker");

	$("#doc-patterns-list").kendoListView({
		dataSource: patternsDataSource,
		template: kendo.template('<div class="pattern" data-pattern="${name}" style="background: url(\'' + THEME + 'images/patterns/${name}\') repeat"></div>'),
		selectable: "single",
		change: function () {
			App.getWeby().getDocumentBackground().setPattern(this.select().attr("data-pattern")).render();
		}
	});

	$('#weby-toolbar-wrapper .document').click(function () {
		$this.deactivateWidget();
		_canvasSettings.hide();

		if (_documentBackgroundSettings.css('display') == 'none') {
			_documentBackgroundSettings.show();
			_documentColorPicker.value(_documentColorPicker.value());
		} else {
			_documentBackgroundSettings.hide();
		}
	});

	this.deactivateWidget = function () {
		_widgetSettings.hide();
		var aw = App.getActiveWidget();
		if (aw != null) {
			aw.deactivate();
			App.setActiveWidget(null);
		}
	}

	/**
	 * EVENTS
	 */

	this.contentClick = function (e) {
		_colorPicker.close();
		_shadowColorPicker.close();
		_widgetSettings.hide();
		_canvasSettings.hide();
		_documentBackgroundSettings.hide();
	};

	this.widgetClick = function (e) {
		_colorPicker.close();
		_shadowColorPicker.close();
		_widgetSettings.hide();
		_canvasSettings.hide();
		_documentBackgroundSettings.hide();
		if (_activeWidget != null && !App.isInputFocused(e) && !_activeWidget._isEditable) {
			_activeWidget.showTools().html('.widget-disabled-overlay').show();
		}
	}

	this.widgetActivated = function (widget) {
		if (!widget._isContentLoaded) {
			return;
		}
		_activeWidget = widget;
		$('#weby-toolbar-wrapper a.tool-icon').removeClass('disabled');
		// Get widget settings
		var settings = _activeWidget.getFrameSettings();
		_colorPicker.value(settings.color);
		_radiusSlider.value(settings.radius);
		_opacitySlider.value(parseFloat(settings.opacity) * 100);
		_widthSlider.value(settings.padding);
		_shadowDistanceSlider.value(parseInt(settings.shadowY));
		_shadowSpreadSlider.value(parseInt(settings.shadowSpread));
		_shadowColorPicker.value(settings.shadowColor);
	}

	this.widgetDeactivated = function () {
		_activeWidget = null;
		_colorPicker.close();
		_shadowColorPicker.close();
		_widgetSettings.hide();
		$('#weby-toolbar-wrapper a.tool-icon:not(".background, .document")').addClass('disabled');
	}
}