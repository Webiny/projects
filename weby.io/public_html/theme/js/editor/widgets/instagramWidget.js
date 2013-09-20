function InstagramWidget() {

    this._instagramId = '';
    this._widgetClass = 'instagram-widget';
    this._resizableOptions['maxWidth'] = 612;
    this._resizableOptions['minWidth'] = 710;
	this._isResizable = false;
    this._parseErrorMessage = 'We couldn\'t insert your image. Please try a different one.';
    this._inputElement = 'textarea';
    this._loadingMessage = 'Loading your Instagram image...';

    this.getHTML = function () {
        this._html = '<textarea placeholder="Paste an Instagram embed code or image URL">http://instagram.com/p/WsFI9PIiA3/</textarea>' +
            '<span class="message"></span>';
        return BaseIframeWidget.prototype.getHTML.call(this);
    };

    this.getIframe = function () {
        var id = 'instagram-iframe-' + this._id;
        return '<iframe id="' + id + '" src="'+this._embedUrl+'" width="612" height="710" frameborder="0" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>';

    }

    // This is called to construct an embed URL which will then be validated
    this.getTargetUrl = function (inputValue) {
        var parser = new InstagramParser();
        if((this._instagramId = parser.parse(inputValue))){
            return 'http://instagram.com/p/' + this._instagramId + '/embed/';
        }
        return false;
    }

	/**
	 * EDIT methods
	 */
	this.getSaveData = function(){
		return {
			instagramId: this._instagramId
		}
	}
}

InstagramWidget.prototype = new BaseIframeWidget();
InstagramWidget.prototype.constructor = InstagramWidget;