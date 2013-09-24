var LinkedInParser = function () {

	this._parse = function (data) {
		var regex = /(linkedin\.com\/[in|pub]+\/\S+)/;
		return data.match(regex) ? 'http://'+RegExp.$1 : false;
	}
}

LinkedInParser.prototype = new BaseParser();
LinkedInParser.prototype.constructor = LinkedInParser;