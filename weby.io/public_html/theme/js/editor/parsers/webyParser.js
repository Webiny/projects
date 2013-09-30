var WebyParser = function () {

	this._webyUrl;
	this._webyId;

	this._parse = function (data) {

		// Validate data
		var domain = WEB.replace(/\//g, '\\/');
		domain = domain.replace(/\./g, '\\.');
		domain = domain.replace('http://', '');

		var regex = new RegExp(domain + "[.a-z0-9-]*\\/[a-z0-9-]*\\/([a-z0-9]{13})", "i");
		if(regex.test(data)){
			this._webyUrl = data;
			return this._webyId = RegExp.$1;
		}
		return false;
	}

	this.getWebyUrl = function(){
		return this._webyUrl;
	}

	this.getWebyId = function(){
		return this._webyId;
	}
}

WebyParser.prototype = new BaseParser();
WebyParser.prototype.constructor = WebyParser;