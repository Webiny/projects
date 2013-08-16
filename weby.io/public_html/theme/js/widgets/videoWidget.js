function VideoWidget() {

	this._videoType = '';
	this._videoId = false;
	this._previewUrl = '';
	this._widgetClass = 'video-widget';
	this._resizableOptions['minHeight'] = 250;
	this._resizableOptions['minWidth'] = 333;
	this._loadingMessage = 'Loading your video...';
	this._parseErrorMessage = "Looks like this video doesn't exist! Try a different URL.";
	this._vimeoApiUrl = 'http://vimeo.com/api/v2/video/';
	this._inputElement = 'textarea';

	this.getHTML = function () {
		this._html = '<textarea placeholder="Paste a Youtube or Vimeo link here">https://vimeo.com/69722654</textarea>' +
			'<span class="message"></span>';
		return BaseWidget.prototype.getHTML.call(this);
	};

	this.onActivate = function () {
		if (!this._isContentLoaded) {
			this.input().focus();
		}
	}

	this.onWidgetInserted = function () {
		var $this = this;
		BaseWidget.prototype.onWidgetInserted.call(this);
		$this.input().bind("blur keydown",function (e) {
			$this._inputReceived($this, e);
		}).focus();
		App.deactivateTool();

	}

	this._inputReceived = function ($this, e) {
		// If key was pressed and it is not ENTER
		if (e.type == "keydown" && e.keyCode != 13) {
			return;
		}
		var link = $.trim($this.input().val());
		if (link == '') {
			return;
		}

		$this.input().unbind("blur keydown");
		$this.message().html('');

		$this._parserObject = new VideoParser();
		if (($this._videoId = $this._parserObject.parse(link))) {
			$this._videoType = $this._parserObject.getVideoType();
			if ($this._videoType == 'youtube') {
				$this.createYoutubePreview();
			} else {
				$this.createVimeoPreview();
			}
		} else {
			// Invalid input
			$this.input().bind('blur keydown', function (e) {
				$this._inputReceived($this, e);
			});
			$this.message().html($this._parseErrorMessage).show();
			$this.input().val('').focus();
		}
	}

	this.createYoutubePreview = function () {
		var $this = this;
		var width = 560;
		var height = 315;
		this.attachLoading();
		this._html.resizable("option", "aspectRatio", width / height);
		this._previewUrl = 'https://i1.ytimg.com/vi/' + this._videoId + '/0.jpg';

		this.checkUrl(this._previewUrl, function (data) {
			if (data.urlExists) {
				var img = $('<img style="width:' + width + 'px; height:' + height + 'px" id="video-preview-' + $this._id + '" src="' + $this._previewUrl + '">');
				img.bind("load", function () {
					$this.removeLoading();
					$this.createPlayOverlay();
				});
				$this.input().replaceWith(img);
				$this.message().remove();
			} else {
				// Invalid input
				$this.input().bind('blur keydown', function (e) {
					$this._inputReceived($this, e);
				});
				$this.message().html($this._parseErrorMessage).show();
				$this.input().val('').focus();
				$this.removeLoading();
			}
		});
	}

	this.createVimeoPreview = function () {
		var $this = this;
		this.attachLoading();
		this.checkUrl(this._vimeoApiUrl + $this._videoId + '.json', function (data) {
			if (data.urlExists) {
				$.ajax({
					type: 'GET',
					url: $this._vimeoApiUrl + $this._videoId + '.json',
					jsonp: 'callback',
					dataType: 'jsonp',
					success: function (data) {
						data = data[0];
						$this._previewUrl = data.thumbnail_large;
						var img = $('<img id="video-preview-' + $this._id + '" src="' + $this._previewUrl + '">');
						img.bind("load", function () {
							$this.removeLoading();
							$this.createPlayOverlay();
						});
						$this.input().replaceWith(img);
						$this.message().remove();
						$this._html.resizable("option", "aspectRatio", data.width / data.height);
					}
				});
			} else {
				// Invalid input
				$this.input().bind('blur keydown', function (e) {
					$this._inputReceived($this, e);
				});
				$this.message().html($this._parseErrorMessage).show();
				$this.input().val('').focus();
				$this.removeLoading();
			}
		});
	}

	this.attachLoading = function () {
		this.showLoading('Let\'s see what we have here...', 'Validating your URL may take a few moments, please be patient.');
		this._html.find('.widget-body > *:not(".loading")').hide();
	}

	this.removeLoading = function () {
		this._html.find('.widget-body .loading').remove();
		this._html.find('.widget-body *').show();
	}

	this.createPlayOverlay = function () {
		var $this = this;
		var height = this._html.height();
		var width = this._html.width();
		var playOverlay = $('<div class="play-overlay"></div>');
		playOverlay.height(height).width(width);
		playOverlay.click(function () {
			$this._html.find('.play-overlay').remove();
			$this._insertIframe($this.getIframe());
		});
		this.body().prepend(playOverlay);
		this._html.resizable("option", "alsoResize", '#video-preview-' + this._id + ', .widget[data-id=' + this._id + '] .play-overlay');
		this.contentLoaded();
	}

	this.getIframe = function () {
		var width = this._html.width();
		var height = this._html.height();
		var id = 'video-iframe-' + this._id;
		this._alsoResize = '#' + id;
		if (this._videoType == 'youtube') {
			this._embedUrl = 'http://www.youtube.com/embed/' + this._videoId + '?wmode=transparent&autoplay=1';
			return $('<iframe id="' + id + '" src="' + this._embedUrl + '" width="' + width + '" height="' + height + '" frameborder="0" wmode="Opaque" allowfullscreen></iframe>');
		}
		this._embedUrl = 'http://player.vimeo.com/video/' + this._videoId + '?wmode=transparent&autoplay=1';
		return $('<iframe id="' + id + '" src="' + this._embedUrl + '" width="' + width + '" height="' + height + '" frameborder="0" wmode="Opaque" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');

	}

	this._insertIframe = function (iframe) {
		var $this = this;

		var iframeWidth = $(iframe).attr("width");
		var iframeHeight = $(iframe).attr("height");

		iframe = $(iframe)[0];
		iframe.setAttribute("width", 0);
		iframe.setAttribute("height", 0);

		$this._html.find('.widget-body').append(iframe);

		// Append LOADING screen (move to BaseWidget)
		this.showLoading(this._loadingMessage);
		this.body().find('#video-preview-' + $this._id + ', .play-overlay').remove();

		var jIframe = $('#' + $(iframe).attr('id'));

		jIframe.bind('load', function () {
			$this.hideLoading();
			jIframe.attr("height", iframeHeight);
			jIframe.attr("width", iframeWidth);
			$this._html.resizable("option", "aspectRatio", iframeWidth / iframeHeight);
		});

		$this.showResizeHandle();
		$this.contentLoaded();

		if ($this._alsoResize) {
			$this._html.resizable("option", "alsoResize", $this._alsoResize);
		}
		App.fireEvent("widget.resize.stop", {element: $this._html});
	}

	/**
	 * EDIT methods
	 */
	this.getSaveData = function () {
		return {
			videoId: this._videoId,
			videoType: this._videoType,
			previewUrl: this._previewUrl
		}
	};

	this.getEditHTML = function () {
		var id = 'video-preview-' + this._id;
		this._html = $('<img style="width:' + this._width + 'px; height:' + this._height + 'px" id="' + id + '" src="' + this._previewUrl + '">');
		return BaseWidget.prototype.getHTML.call(this);
	};

	this.onEditWidgetInserted = function () {
		this.createPlayOverlay();
	}

	BaseWidget.prototype.init.call(this);
}


VideoWidget.prototype = new BaseWidget();
VideoWidget.prototype.constructor = VideoWidget;