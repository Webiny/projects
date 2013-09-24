var VideoParser = function () {

	this._id;
	this._type;

	this._parse = function (data) {
		if (data.indexOf('iframe') >= 0) {
			var regex = /src="(.*?)"/;
			data = data.match(regex) ? RegExp.$1 : data;
		}

		if (this._parseYoutubeLink(data)) {
			this._type = 'youtube';
			return this._id;
		} else if (this._parseVimeoLink(data)) {
			this._type = 'vimeo';
			return this._id;
		}
		return false;
	}

	/**
	 * Get video type of the parsed resource
	 * @returns {string}
	 */
	this.getVideoType = function () {
		return this._type;
	}

	this._parseYoutubeLink = function (link) {
		var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
		return this._id = (link.match(p)) ? RegExp.$1 : false;
	}

	this._parseVimeoLink = function (link) {
		if (link.indexOf('#') > 0) {
			var tmp = link.split('#');
			link = tmp[0];
		}

		var p = /https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
		this._id = (link.match(p)) ? RegExp.$3 : false;
		if(!this._id){
			// Try another regex
			p = /vimeo\.com\/(?:video\/)?(\d+)/;
			this._id = link.match(p) ? RegExp.$1 : false;
		}
		return this._id;
	}
}

VideoParser.prototype = new BaseParser();
VideoParser.prototype.constructor = VideoParser;