function WebyPatternBackground(el, defaultPattern) {

	var _el = el;
	var _pattern = defaultPattern;
	var _top = 0;
	var _left = 0;

	this.setPattern = function (pattern) {
		_pattern = pattern;
		return this;
	}

	this.getPattern = function () {
		return _pattern;
	}

	this.populate = function (data) {
		_pattern = data.pattern == "" ? null : data.pattern;
		return this;
	}

	this.render = function () {
		_prepareContainer();
		if (_pattern == null || _pattern == 'no-pattern.png') {
			return _el.css({
				backgroundImage: 'none'
			});
		}

		_el.css({
			'background-image': 'url(' + THEME + 'images/patterns/' + _pattern + ')',
			'background-color': 'transparent',
			'background-repeat': 'repeat',
			'background-size': '',
			'background-attachment': 'local',
			width: App.getContent().width() + 'px',
			height: App.getContent().height() + 'px',
			top: _top,
			left: _left
		});
	}

	this.save = function(){
		return {
			pattern: _pattern
		}
	}

	var _prepareContainer = function(){
		if(_el == App.getDocument()){
			return;
		}
		var el = _el.detach();
		if(App.getWeby().getBackground().getImageBackground().getMode() == 'fixed'){
			App.getDocument().append(el);
			_top = App.getWorkspace().css('top');
			_left = App.getContent().css('marginLeft');
		} else {
			App.getContent().append(el);
			_top = 0;
			_left = 0;
		}
	}

	this.webyBackgroundResized = function () {
		this.render();
	};
}
