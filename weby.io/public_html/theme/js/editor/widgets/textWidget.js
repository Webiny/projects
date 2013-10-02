function TextWidget() {

	this._content = '';
	this._textAlign = '';
	this._firstActivate = true;
	this._widgetClass = 'text-widget';
	this._inputElement = '.text-editable';

	this._resizableOptions = {
		minHeight: 38,
		minWidth: 210
	};

	this.getHTML = function () {
		this._html = '<div id="text-editable-' + this._id + '" class="text-editable" style="width:400px"></div>';
		return BaseWidget.prototype.getHTML.call(this);
	};

	this.onActivate = function () {
		if (this._firstActivate) {
			this._firstActivate = false;
			this.controls().css("visibility", "hidden");
		}
	}

	this.onDeactivate = function () {
		//this.body(".text-editable").blur();
		//this.html().draggable("disable");
	}

	this.remove = function () {
		this.body(".text-editable").blur().data("kendoEditor").destroy();
		BaseWidget.prototype.remove.call(this);
	}

	this.onMakeEditable = function () {
		this.body(".text-editable").click().focus();
	}

	this.widgetResize = function (data) {
		this.body('.text-editable').width(this._html.width() - 2).height(this._html.height() - 2);
		this._resize();
	}

	this.onWidgetInserted = function () {
		BaseWidget.prototype.onWidgetInserted.call(this);
		var $this = this;
		$this._createEditor();
		App.deactivateTool();
		$this.html(".text-editable").width($this.html().width() - 2).height($this.html().height() - 2);
		$this.contentLoaded();
		if ($this._firstActivate) {
			$this.makeEditable();
		}
	}

	this.setData = function (data) {
		this.input().css("width", "400px").html(data);
	}

	this._createEditor = function () {
		var $this = this;
		this._html.resizable("option", "alsoResize", '#text-editable-' + this._id);
		this._html.resizable("option", "aspectRatio", false);
		var element = this.body('.text-editable');
		element.kendoEditor({
			tools: [
				"bold",
				"italic",
				"underline",
				"insertImage",
				"justifyLeft",
				"justifyCenter",
				"justifyRight",
				"justifyFull",
				"createLink",
				"unlink",
				{
					name: "fontSize",
					items: [
						{ text: "8px", value: "8px" },
						{ text: "10px", value: "10px" },
						{ text: "12px", value: "12px" },
						{ text: "14px", value: "14px" },
						{ text: "16px", value: "16px" },
						{ text: "18px", value: "18px" },
						{ text: "20px", value: "20px" },
						{ text: "24px", value: "24px" },
						{ text: "26px", value: "26px" },
						{ text: "28px", value: "28px" },
						{ text: "32px", value: "32px" },
						{ text: "36px", value: "36px" },
						{ text: "40px", value: "40px" },
						{ text: "44px", value: "44px" },
						{ text: "48px", value: "48px" },
						{ text: "54px", value: "54px" },
						{ text: "60px", value: "60px" },
						{ text: "72px", value: "72px" }
					]
				},
				"foreColor",
				"fontName"
			],
			paste: function () {

				$this._html.css("width", $this._html.width() + 'px');
				$this._html.css("height", $this._html.height() + 'px');

				setTimeout(function () {
					// Restrict to viewport size
					if ($this._html.width() + $this._x + 500 > App.getViewportWidth()) {
						$this._html.width(App.getViewportWidth() - 300);
					}

					if ($this._html.height() + $this._y > App.getViewportHeight()) {
						$this._html.height(App.getViewportHeight() - 300);
					}
				}, 50);
			}
		});

		element.click(function () {
			if ($this._mouseUpAfterDrag) {
				return $this._mouseUpAfterDrag = false;
			}

			if ($this._html.hasClass('.ui-draggable-dragging')) {
				return;
			}
			$this._html.draggable("option", "disabled", true);
			$(this).attr('contenteditable', true).css('z-index', '999998').focus();
		});

		element.blur(function () {
			$this._html.draggable('option', 'disabled', false);
			$(this).attr('contenteditable', 'false').css('z-index', '1000');
		});
	}

	/**
	 * EDIT methods
	 */
	this.getSaveData = function () {
		return {
			content: encodeURIComponent(this.body('.text-editable').data("kendoEditor").value()),
			textAlign: this.body('.text-editable').css('textAlign')
		}
	};

	this.getEditHTML = function () {
		this._firstActivate = false;
		this._html = '<div style="text-align: '+this._textAlign+'; width:' + (this._width - 2) + 'px; height:' + (this._height - 2) + 'px" id="text-editable-' + this._id + '" class="text-editable"></div>';
		return BaseWidget.prototype.getHTML.call(this);
	};

	this.onEditWidgetInserted = function () {
		this._createEditor();
		this.body('.text-editable').data("kendoEditor").value(this._content);
	}
}


TextWidget.prototype = new BaseWidget();
TextWidget.prototype.constructor = TextWidget;