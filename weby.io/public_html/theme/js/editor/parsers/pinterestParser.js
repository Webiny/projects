var PinterestParser = function () {

	this._pinType = false;
	this._pinUrl = false;

	this._parse = function (data) {
		data = $.trim(data)
		// Validate data
		var pinRegex = /(pinterest\.com\/pin\/\d+\/)/;
		var boardRegex = /(pinterest\.com\/[a-z0-9-\.]*\/[a-z0-9-\.]*\/)/;
		var userRegex = /(pinterest\.com\/[a-z0-9-\.]*\/)/;

		if (data.match(pinRegex)) {
			this._pinType = 'pin';
			this._pinUrl = 'http://'+RegExp.$1;
		} else if (data.match(boardRegex)) {
			this._pinType = 'board';
			this._pinUrl = 'http://'+RegExp.$1;
		} else if (data.match(userRegex)) {
			this._pinType = 'user';
			this._pinUrl = 'http://'+RegExp.$1;
		}
		return this._pinUrl;
	}

	this.getPinType = function () {
		return this._pinType;
	}

	this.getPinUrl = function () {
		return this._pinUrl;
	}


	// Pin: http://pinterest.com/pin/181269953723991195/
	// Board: http://pinterest.com/petplan/fetch-a-prize/
	// Profile: http://pinterest.com/petplan/
}

PinterestParser.prototype = new BaseParser();
PinterestParser.prototype.constructor = PinterestParser;