var InstagramParser = function () {

	this._instagramId;

	this._parse = function (data) {

		if (data.indexOf('iframe') >= 0) {
			var regex = /src="(.*?)"/;
			data = data.match(regex) ? RegExp.$1 : data;
		}

		// Validate data
        var regex = /instagram.com\/p\/(.*?)\//;
		return this._instagramId = data.match(regex) ? RegExp.$1 : false;
	}
}

InstagramParser.prototype = new BaseParser();
InstagramParser.prototype.constructor = InstagramParser;