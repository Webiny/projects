var FacebookParser = function () {

	this._facebookType = '';
	this._facebookUrl = false;
	this._facebookId = false;

	this._parse = function (data) {

		if (data.indexOf('data-href') >= 0) {
			var regex = /data-href="(.*?)"/;
			data = data.match(regex) ? RegExp.$1 : false;
		}

		// Check if it's a photo url
		var regex = /facebook\.com\/(photo\.php\S+)/;
		if ((this._facebookUrl = data.match(regex) ? RegExp.$1 : false)) {
			this._facebookType = 'post';
			return this._facebookUrl;
		}

		// Check if it's a post
		var regex = /facebook\.com\/(\S+\/posts\/\d+)/;
		if ((this._facebookUrl = data.match(regex) ? RegExp.$1 : false)) {
			this._facebookType = 'post';
			return this._facebookUrl;
		}

		// Unoptimized page URL
		var regex = /facebook\.com\/(pages\/[a-zA-Z0-9-_]*\/(\d+))/;
		if ((this._facebookUrl = data.match(regex) ? RegExp.$1 : false)) {
			this._facebookType = 'page';
			this._facebookId = RegExp.$2
			return this._facebookUrl;
		}

		// Check if address to the page (optimized)
		var regex = /facebook\.com\/([a-zA-Z0-9-_]*)/;
		if ((this._facebookUrl = data.match(regex) ? RegExp.$1 : false)) {
			this._facebookType = 'page';
			this._facebookId = this._facebookUrl;
			return this._facebookUrl;
		}
		return this._facebookUrl;
	}

	this.getFacebookType = function(){
		return this._facebookType;
	}

	this.getFacebookId = function(){
		return this._facebookId;
	}
}

FacebookParser.prototype = new BaseParser();
FacebookParser.prototype.constructor = FacebookParser;
