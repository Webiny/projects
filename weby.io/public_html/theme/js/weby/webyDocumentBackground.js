function WebyDocumentBackground(settings) {

	var _backgrounds = {
		color: new WebyColorBackground(App.getDocument()),
		pattern: new WebyPatternBackground(App.getDocument(), null)
	};

	if (typeof settings != "undefined") {
		for (var i in _backgrounds) {
			_backgrounds[i].populate(settings[i]);
		}
	}

	this.save = function () {
		var data = {};
		for (var i in _backgrounds) {
			data[i] = _backgrounds[i].save();
		}
		return data;
	}

	this.setColor = function (color) {
		_backgrounds.color.setColor(color);
		_backgrounds.pattern.setPattern(null);
		return this;
	}

	this.getColor = function () {
		return _backgrounds.color.getColor();
	}

	this.setPattern = function (pattern) {
		_backgrounds.pattern.setPattern(pattern);
		_backgrounds.color.setColor(null);
		return this;
	}

	this.render = function () {
		for (var i in _backgrounds) {
			_backgrounds[i].render();
		}
	}
}