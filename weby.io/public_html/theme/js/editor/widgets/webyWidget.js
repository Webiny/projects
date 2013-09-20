function WebyWidget() {
	this._webyId = '';
	this._webyUrl = '';
	this._widgetClass = 'weby-widget';
	this._resizableOptions['minWidth'] = 200;
	this._resizableOptions['minHeight'] = 200;
	this._parseErrorMessage = 'We couldn\'t insert your Weby. Please try a different one.';
	this._loadingMessage = 'Loading your Weby...';
	this._inputElement = 'textarea';

	this.getHTML = function () {
		this._html = '<textarea placeholder="Paste a Weby URL or an embed code">' + test + '</textarea>' +
			'<span class="message"></span>';
		return BaseIframeWidget.prototype.getHTML.call(this);
	};

	this.getIframe = function () {
		var id = 'weby-iframe-' + this._id;
		this._alsoResize = "#" + id;
		return '<iframe id="' + id + '" src="' + this._embedUrl + '?embed=true" width="520" height="420" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>';
	};

	// This is called to construct an embed URL which will then be validated
	this.getTargetUrl = function (inputValue) {
		// Validate link
		var parser = new WebyParser();
		if (!(this._webyId = parser.parse(inputValue))) {
			return false;
		}
		this._webyUrl = parser.getWebyUrl();
		return this._webyUrl + '?embed=true';
	};

	/**
	 * EDIT methods
	 */
	this.getSaveData = function () {
		return {
			webyUrl: this._webyUrl,
			webyId: this._webyId
		}
	};

	test = ''; //http://pavel910.homeftp.net/pavel910/my-super-new-and-cool-weby/523748782e9c6/';
}

WebyWidget.prototype = new BaseIframeWidget();
WebyWidget.prototype.constructor = WebyWidget;