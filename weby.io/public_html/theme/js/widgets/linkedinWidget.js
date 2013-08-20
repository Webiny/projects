function LinkedInWidget() {
	this._name = '';
	this._isResizable = false;
	this._widgetClass = 'linkedin-widget';
	this._parseErrorMessage = 'We couldn\'t insert this LinkedIn profile. Please try a different one.';
	this._inputElement = 'input';
	this._loadingMessage = 'Loading LinkedIn profile...';
	this._customOnLoadHandler = true;

	this.getHTML = function () {
		this._html = '<input type="text" placeholder="Enter a public profile URL of a LinkedIn member" value="gorancandrlic"/>' +
			'<span class="message"></span>';
		return BaseWidget.prototype.getHTML.call(this);
	};

	// Only called if target URL is a valid, existing URL
	this.getIframe = function () {
		this._embedUrl = WEB + 'embed/linkedin/?name=' + this._name + '&id=' + this._id;
		return '<iframe id="linkedin-iframe-' + this._id + '" src="' + this._embedUrl + '" width="0" height="0" frameborder="0"></iframe>';
	}

	// This is called to construct an embed URL which will then be validated
	this.getTargetUrl = function (inputValue) {
		var parser = new LinkedInParser();
		this._name = parser.parse(inputValue);
		if(!this._name){
			this._name = inputValue;
		}
		return 'http://www.linkedin.com/in/' + this._name;
	}

	this.onIframeLoaded = function (width, height) {
		$('#linkedin-iframe-' + this._id).attr({width: width, height: height});
		this.showResizeHandle().body('.loading, .message, input').remove();
		this.html().css({
			width: width+'px',
			height: height+'px'
		});
		this.contentLoaded();
	}

	/**
	 * EDIT methods
	 */
	this.getSaveData = function(){
		return {
			name: this._name
		}
	}

	this.getEditHTML = function () {
		this._html = $(this.getIframe()).attr({width: this._width, height: this._height});
		this._html = this._html.attr("src", this._html.attr("src").replace(/&id=\d+$/, ''));
		return BaseWidget.prototype.getHTML.call(this);
	};
}


LinkedInWidget.prototype = new BaseIframeWidget();
LinkedInWidget.prototype.constructor = LinkedInWidget;
