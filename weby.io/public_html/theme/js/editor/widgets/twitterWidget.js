function TwitterWidget() {
	this._tweetId = '';
	this._tweetUser = '';
	this._isResizable = false;
	this._widgetClass = 'twitter-widget';
	this._inputElement = 'textarea';
	this._parseErrorMessage = "Looks like this Tweet doesn't exist! Try a different one.";
	this._loadingMessage = "Loading your Tweet...";
	this._parser = null;
	this._heightOffset = 0;

	this.getHTML = function () {
		this._html = '<textarea class="tweet-embed" placeholder="Paste your Tweet embed code here">https://twitter.com/Fascinatingpics/status/286206794005610496</textarea>' +
			'<span class="message"></span>';
		return BaseWidget.prototype.getHTML.call(this);
	};

	this.onWidgetInserted = function () {
		var $this = this;

		$this.hideResizeHandle();
		BaseWidget.prototype.onWidgetInserted.call($this);
		App.deactivateTool();
		this.input().bind("blur keydown",function (e) {
			$this._inputReceived($this, e);
		}).focus();
	}

	this.showError = function () {
		var $this = this;
		$this.hideLoading();
		$this.message().html(this._parseErrorMessage);
		$this.input().val('').show();
		$this.input().bind('blur keydown', function (e) {
			$this._inputReceived($this, e);
		});
		if (this._isActive) {
			this.input().focus();
		}
		return;
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

		if ($this._parser == null) {
			$this._parser = new TwitterParser();
		}

		// Regex check
		if (!($this._tweetId = $this._parser.parse($this.input().val()))) {
			return $this.showError();
		}
		$this._tweetUser = $this._parser.getTweetUser();

		// Validate content
		$this.showLoading('Let\'s see what we have here...', 'Validating your URL may take a few moments, please be patient.');
		$this.input().hide();
		var tweetUrl = 'https://twitter.com/' + $this._tweetUser + '/statuses/' + $this._tweetId;
		$this.checkUrl(tweetUrl, function (data) {
			if (data.urlExists) {
				// Build embed code
				var tweetEmbed = $this._getEmbedCode();

				$this.showLoading();
				$this.input().replaceWith(tweetEmbed);
				$this.message().remove();

				/**
				 * From here on goes fine tuning of the appearance
				 */
				var counter = 100;
				var jFrame = false;
				// Wait for iFrame to appear
				var interval = setInterval(function () {
					// Fail safe switch to stop interval if it does more than 200 checks
					if (counter == 0) {
						clearInterval(interval);
						$this.hideLoading();
						return;
					}
					counter--;

					if ((jFrame = $this.body().find('iframe')).length !== 0) {
						clearInterval(interval);

						counter = 500;
						var widthInterval = setInterval(function () {
							// Fail safe switch to stop interval if something goes wrong with Tweet load
							if (counter == 0) {
								clearInterval(interval);
								$this.hideLoading();
								return;
							}
							counter--;
							if (jFrame.attr("width") > 0 && jFrame.attr("height") > 0) {
								clearInterval(widthInterval);
								$this.hideLoading();
								$this.html().css({
									width: jFrame.attr("width")+'px',
									height: jFrame.attr("height")+'px'
								});
								$this.contentLoaded();
							}
						}, 10);
					}
				}, 50);
			} else {
				// Show error
				$this.showError();
			}
		});
	}

	this._getEmbedCode = function () {
		return $('<blockquote width="430" class="twitter-tweet"><a href="https://twitter.com/' + this._tweetUser + '/statuses/' + this._tweetId+'"></a></blockquote>' +
			'<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>');
	};

	/**
	 * EDIT methods
	 */
	this.getSaveData = function () {
		return {
			tweetId: this._tweetId,
			tweetUser: this._tweetUser
		}
	};

	this.getEditHTML = function () {
		this._html = this._getEmbedCode().width(this._width).height(this._height);
		return BaseWidget.prototype.getHTML.call(this);
	};

	this.onEditWidgetInserted = function(){
		var $this = this;
		var counter = 100;
		var jFrame = false;
		// Wait for iFrame to appear
		var interval = setInterval(function () {
			// Fail safe switch to stop interval if it does more than 200 checks
			if (counter == 0) {
				clearInterval(interval);
				return;
			}
			counter--;

			if ((jFrame = $this.body().find('iframe')).length !== 0) {
				clearInterval(interval);
				counter = 500;
				var widthInterval = setInterval(function () {
					// Fail safe switch to stop interval if something goes wrong with Tweet load
					if (counter == 0) {
						clearInterval(interval);
						return;
					}
					counter--;
					if (typeof jFrame.attr("width") != "undefined") {
						clearInterval(widthInterval);
						jFrame.attr("width", $this._width);
					}
				}, 10);
			}
		}, 50);
	}

}

// oembed: https://api.twitter.com/1/statuses/oembed.json?id=367360709379624961&align=center

TwitterWidget.prototype = new BaseWidget();
TwitterWidget.prototype.constructor = TwitterWidget;