function FacebookWidget() {

    this._facebookUrl = '';
    this._facebookType = '';
    this._isResizable = false;
    this._widgetClass = 'facebook-widget';
    this._parseErrorMessage = 'We couldn\'t insert your Facebook feed. Please try a different one.';
    this._inputElement = 'textarea';

    this.getHTML = function () {
        this._html = '<textarea type="text" placeholder="Paste your Facebook page URL">www.facebook.com/webiny</textarea>' +
            '<span class="message"></span>';
        return BaseIframeWidget.prototype.getHTML.call(this);
    };

    this.getIframe = function () {
        var id = 'facebook-iframe-' + this._id;

		/**
		 * POST EMBED
		 */
		if(this._facebookType == 'post'){
			this._loadingMessage = 'Loading your Facebook post...';
			this._embedUrl = WEB+'embed/fb-post/?fbUrl=' + this._facebookUrl+'&parent='+this._id;
			this._customOnLoadHandler = true;
			return '<iframe id="' + id + '" src="' + this._embedUrl +'" frameborder="0"></iframe>';
		}

		/**
		 * FEED EMBED
		 */
		this._loadingMessage = 'Loading your Facebook feed...';
		this._customOnLoadHandler = false;
		this._embedUrl = '//www.facebook.com/plugins/likebox.php?href=https://www.facebook.com/' + this._facebookUrl;
        return '<iframe id="' + id + '" src="' + this._embedUrl +
            '&amp;width=292&amp;height=427&amp;colorscheme=light&amp;show_faces=false&amp;header=true&amp;' +
            'stream=true&amp;show_border=false&amp;appId=276232862515995" scrolling="no" frameborder="0" ' +
            'style="border:none; overflow:hidden;" width="292" height="427" ' +
			'allowTransparency="true"></iframe>';
    }

    // This is called to construct an embed URL which will then be validated
    this.getTargetUrl = function (inputValue) {
        var parser = new FacebookParser();
		this._facebookUrl = parser.parse(inputValue);
		this._facebookType = parser.getFacebookType();
		this._facebookId = parser.getFacebookId();
        if(this._facebookUrl){
			if(this._facebookType == 'post'){
				return 'https://www.facebook.com/'+this._facebookUrl;
			}
            return 'http://graph.facebook.com/?id=' + this._facebookId + '&t=' + new Date().getTime();
        }
        return false;

    }

	this.onIframeLoaded = function (width, height) {
		$('#facebook-iframe-' + this._id).attr({width: width, height: height});
		this.body('.loading, .message, input').remove();
		this.html().css({
			width: width+'px',
			height: height+'px'
		});
		this._loadingContent = false;
		this.contentLoaded();
	}

	this.getSaveData = function(){
		return {
			facebookUrl: encodeURIComponent(this._facebookUrl),
			facebookType: this._facebookType,
			facebookId: this._facebookId
		}
	}

	this.getEditHTML = function () {
		this._facebookUrl = decodeURIComponent(this._facebookUrl);
		this._html = $(this.getIframe()).show();
		return BaseWidget.prototype.getHTML.call(this);
	};
}

FacebookWidget.prototype = new BaseIframeWidget();
FacebookWidget.prototype.constructor = FacebookWidget;
