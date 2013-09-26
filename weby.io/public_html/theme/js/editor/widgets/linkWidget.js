function LinkWidget() {

	// Url contains the original URL of the content
	this._linkUrl = '';
	// file, web, image
	this._linkType = '';
	// File data
	this._fileName = '';
	this._contentType = '';
	this._contentSize = '';
	this._fileHost = '';
	// Web data
	this._title = '';
	this._description = '';
	this._imageUrl = '';

	this._widgetClass = 'link-widget';
	this._parseErrorMessage = "Looks like this link doesn't exist or is not supported! Try a different URL.";
	this._loadingMessage = "Loading your website...";

	this.getHTML = function () {
		this._html = this.generateInputField('');
		return BaseWidget.prototype.getHTML.call(this);
	};

	this.onActivate = function () {
		if (!this._isResizable) {
			this.hideResizeHandle();
		}
	}

	this.onWidgetInserted = function () {

		BaseWidget.prototype.onWidgetInserted.call(this);

		// hide resize handle because we don't want to be able to resize eg. newly created widget
		this.hideResizeHandle();

		// Binds link parsing on blur of input filed
		this._inputFieldBind();

		// Bind event on Dropbox button
		this._bindDropBoxChooser();

		// Bind event on Google Drive button
		this._bindGoogleDriveChooser();


		// Focus on newly created widget (default input field)
		this._html.find("input.link-widget-field").focus();

		App.deactivateTool();

	};


	// This binds (URL based) data retrival to default input field of file widget
	this._inputFieldBind = function () {
		var $this = this;
		// Getting links
		this.input().bind("blur keydown", function (e) {
			$this._inputReceived($this, e);
		});
	};

	this._inputReceived = function ($this, e) {
		// If key was pressed
		if (e.type == "keydown" && e.keyCode == 13) {
			return $this.input().blur();
		} else if (e.type == "keydown") {
			return;
		}

		var url = $.trim($this.input().val());
		if (url == '') {
			return;
		}

		$this.input().unbind("blur keydown");
		$this.message().html('');

		$this.showLoading('Let\'s see what we have here...', 'Validating your URL may take a few moments, please be patient.');
		$this._html.find('.link-input').hide();

		$this.checkUrl(url, function (r) {
			if (!r.urlExists) {
				return $this.showError();
			}

			// Save data in properties of widget
			$this._linkUrl = url;
			$this._fileHost = r.data['fileHost'];
			$this._fileName = r.data['fileName'];
			$this._contentType = r.data['contentType'];
			$this._contentSize = r.data['contentLength'];

			$this._loadingContent = true;

			// If requested file is a html page
			if ($this._contentType == 'text/html') {
				$this._linkType = 'web';

				$this.showLoading();
				$.get(WEB + 'tools/parse-link/?url=' + encodeURIComponent(url), function (data) {
					if (!data.error) {
						$this._isResizable = false;
						$this._title = data.data.title;
						$this._description = data.data.description;
						$this._imageUrl = data.data.imageUrl;
						$this.body().html($this.generateLinkEmbed());
						$this.contentLoaded();
						$this._loadingContent = false;
						$this.html('.resize-handle').remove();
					} else {
						$this.showError();
					}
				});
			} else {
				$this._linkType = 'file';
				if (typeof LinkTool.ALLOWED_TYPES[r.data['contentType']] == 'undefined') {
					App.getWeby().logUnknownFileType($this._linkUrl, r.data['contentType']);
					$this._contentType = 'N/A';
					$this.body().html($this.generateFileInfo());
					$this.contentLoaded();
					$this._loadingContent = false;
				}

				var tpl = LinkTool.ALLOWED_TYPES[$this._contentType].tpl;

				if (tpl != 'Image') {
					// Render file widget
					var content = $this['generate' + tpl]();
					$this.body().html(content);
					$this.contentLoaded().html('.resize-handle').remove();
					$this._isResizable = false;
					$this._loadingContent = false;
				} else {
					$this._linkType = 'image';
					var img = $($this.generateImage());
					img.bind("load", function () {
						$this.hideLoading();
						// Get image dimensions to set proper aspect ratio
						//$this._aspectRatio = parseInt($(this).width()) / parseInt($(this).height());
						$this._html.resizable("option", "alsoResize", '#' + $(this).attr("id"));
						$this.contentLoaded();
						$this.showResizeHandle();
						$this._loadingContent = false;
					});
					$this.body().append(img);
				}
			}
		});
	}

	this.showError = function () {
		var $this = this;
		$this.hideLoading();
		$this.message().html(this._parseErrorMessage);
		$this.html('.link-input').show();
		$this.input().val('');
		$this.input().bind('blur keydown', function (e) {
			$this._inputReceived($this, e);
		});
		if ($this._isActive) {
			$this.input().focus();
		}
	}

	/**
	 * This binds Google Drive Chooser app initialization on click of its button
	 */
	this._bindGoogleDriveChooser = function () {
		var $this = this;
		$this.body().on('click', 'span.gdrive-button', function () {
			var picker = new google.picker.PickerBuilder().
				addView(google.picker.ViewId.DOCS).
				setCallback(function (data) {
					if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
						var doc = data[google.picker.Response.DOCUMENTS][0];
						// Prepare data for template
						$this._linkUrl = doc.url;
						$this._fileHost = 'drive.google.com';
						$this._fileName = doc.name;
						$this._contentType = 'gdrive';
						$this._contentSize = 0;

						var content = $this.generateFileInfo();
						$this.body().html(content);
						$this.contentLoaded().html('.resize-handle').remove();
						$this._isResizable = false;
						$this._linkType = 'file';
						$this._loadingContent = false;
					}
				}
			).build();
			picker.setVisible(true);
			$('.picker.modal-dialog-bg').css('z-index', 1000001);
			$('.picker.modal-dialog.picker-dialog').css('z-index', 1000001);
		});
	};

	/**
	 * This binds dropBox Chooser app initialization on click of its button
	 */

	this._bindDropBoxChooser = function () {
		var $this = this;
		$this.body().on('click', 'span.dropbox-button', function () {
			Dropbox.choose({
				success: function (files) {
					// Prepare data for template
					$this._linkUrl = files[0].link;
					$this._fileHost = 'dropbox.com';
					$this._fileName = files[0].name;
					$this._contentType = 'dropbox';
					$this._contentSize = App.formatFileSize(files[0].bytes);

					var content = $this.generateFileInfo();
					$this.body().html(content);
					$this.contentLoaded().html('.resize-handle').remove();
					$this._isResizable = false;
					$this._linkType = 'file';
					$this._loadingContent = false;
				},
				// Gives us direct links to uploaded files
				linkType: "direct"
			});
		});

	};

	/**
	 * Generates basic input field for links which users will paste
	 */
	this.generateInputField = function (value) {
		var tpl = $('script#link-widget-field-tpl').html();
		tpl = tpl.replace('{id}', this._id);
		tpl = tpl.replace('{value}', value);
		return tpl;
	};

	/**
	 * Methods for generating content for various link types (eg. jpg, gif, ppt, xls ...)
	 * For every filetype, you can specify it's template (in LinkTool.ALLOWED_TYPES object)
	 */

	/**
	 * Renders standard file information box
	 */
	this.generateFileInfo = function () {
		var tpl = $('script#link-widget-file-tpl').html();
		tpl = tpl.replace('{url}', this._linkUrl);
		tpl = tpl.replace('{extension}', LinkTool.ALLOWED_TYPES[this._contentType]['extension']);
		tpl = tpl.replace('{baseName}', this._fileName);
		tpl = tpl.replace('{type}', LinkTool.ALLOWED_TYPES[this._contentType]['fileType']);
		tpl = tpl.replace('{size}', App.formatFileSize(this._contentSize));
		tpl = tpl.replace('{host}', this._fileHost);
		return $(tpl);
	};

	/** This will render web link template */
	this.generateLinkEmbed = function () {
		this._verifyUrl();
		var tpl = $('script#link-widget-link-tpl').html();
		tpl = tpl.replace(/{url}/g, this._linkUrl);
		tpl = tpl.replace('{id}', this._id);
		tpl = tpl.replace('{title}', this.truncate(this._title, 35, '...'));
		tpl = tpl.replace('{description}', this.truncate(this._description, 140, '...'));
		tpl = $(tpl.replace('{imageUrl}', this._imageUrl == "false" || this._imageUrl == false ? THEME + 'images/link-icon.png' : this._imageUrl));
		return tpl;
	};

	/**
	 * Renders image
	 */
	this.generateImage = function () {
		this._isInteractive = false;
		var tpl = $('script#link-widget-image-tpl').html();
		tpl = tpl.replace('{image_id}', 'image-link-' + this._id);
		tpl = tpl.replace('{url}', this._linkUrl);
		return $(tpl);
	};

	this._verifyUrl = function () {
		var check = ['http://', 'https://', 'ftp://']

		for (var i in check) {
			if (this._linkUrl.indexOf(check[i]) == 0) {
				return;
			}
		}
		this._linkUrl = 'http://' + this._linkUrl;
	};

	/**
	 * EDIT methods
	 */
	this.getSaveData = function () {
		return {
			linkUrl: this._linkUrl,
			linkType: this._linkType,
			fileName: this._fileName,
			contentType: this._contentType,
			contentSize: this._contentSize,
			fileHost: this._fileHost,
			title: this._title,
			description: this._description,
			imageUrl: this._imageUrl
		}
	}

	this.getEditHTML = function () {
		if (this._linkType == 'image') {
			this._html = this.generateImage().width(this._width).height(this._height);
			this._alsoResize = '#' + this._html.attr('id');
		} else if (this._linkType == 'file') {
			this._isResizable = false;
			this._html = this.generateFileInfo();
		} else {
			this._isResizable = false;
			this._html = this.generateLinkEmbed();
		}
		return BaseWidget.prototype.getHTML.call(this);
	};
}

LinkWidget.prototype = new BaseWidget();
LinkWidget.prototype.constructor = LinkWidget;