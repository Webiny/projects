function GooglePlusWidget() {

    this._userId = '';
    this._postId = '';
    this._widgetClass = 'googleplus-widget';
	this._isResizable = false;
    this._parseErrorMessage = 'We couldn\'t insert your Google+ post. Please try a different one.';
    this._inputElement = 'textarea';
    this._loadingMessage = 'Loading your Google+ post...';
	this._customOnLoadHandler = 'onIframeLoaded';

    this.getHTML = function () {
        this._html = '<textarea type="text" placeholder="Paste a Google+ embed code or post URL">https://plus.google.com/106534048061626372350/posts/PoS6chWGT4T</textarea>' +
            '<span class="message"></span>';
        return BaseIframeWidget.prototype.getHTML.call(this);
    };

    this.getIframe = function () {
        var id = 'googleplus-iframe-' + this._id;
		this._embedUrl = WEB+'embed/google-plus/?userId='+this._userId+'&postId='+this._postId;
        return '<iframe id="'+id+'" src="'+this._embedUrl+'" width="320" height="420" frameborder="0"></iframe>';
    }

    // This is called to construct an embed URL which will then be validated
    this.getTargetUrl = function (inputValue) {
        var parser = new GooglePlusParser();
        if(parser.parse(inputValue)){
			this._userId = parser.getUserId();
			this._postId = parser.getPostId();
            return 'https://plus.google.com/'+this._userId+'/posts/'+this._postId;
        }
        return false;
    }

	/**
	 * Listen for iframe width/height change and update main iframe
	 * @param jFrame Iframe object
	 */
	this.onIframeLoaded = function(jFrame){
		var $this = this;
		jFrame.bind("load", function(){
			var childIframe = jFrame.contents().find('iframe');
			var counter = 200;
			var interval = setInterval(function(){
				// Fail safe switch to stop interval if it does more than 200 checks
				if (counter == 0) {
					clearInterval(interval);
					$this.hideLoading();
					return;
				}
				counter--;

				if (childIframe.attr("style").indexOf("width") > -1 && childIframe.attr("style").indexOf("height") > -1) {
					clearInterval(interval);
					jFrame.attr("width", childIframe.css("width"));
					jFrame.attr("height", childIframe.css("height"));
					$this.hideLoading();
					$this.contentLoaded();
				}
			}, 50);
		});
	}

	/**
	 * EDIT methods
	 */
	this.getSaveData = function(){
		return {
			userId: this._userId,
			postId: this._postId
		}
	};
}

GooglePlusWidget.prototype = new BaseIframeWidget();
GooglePlusWidget.prototype.constructor = GooglePlusWidget;