var LinkParser = function () {

	this._link;

	this._parse = function (data) {
		// Validate data
		//var regex = /^[http:\/\/|ftp:\/\/|https:\/\/]*?[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?$/;
        var regex = /^[http:\/\/|ftp:\/\/|https:\/\/]*?[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+!#-]*[\w@?^=%&amp;\/~+#-])?$/;
		return this._link = data.match(regex);
	}
}

LinkParser.prototype = new BaseParser();
LinkParser.prototype.constructor = LinkParser;