function WebyColorBackground(el) {

	var _el = el;
	var _color = null;
	var _top = 0;
	var _left = 0;

	this.setColor = function (color) {
		_color = color;
		return this;
	}

	this.getColor = function () {
		return _color;
	}

	this.populate = function (data) {
		_color = data.color == "" ? null : data.color;
		return this;
	}

	this.render = function () {
		if (_color != null) {
			_prepareContainer();
			_el.css({
				backgroundColor: _color,
				top: _top,
				left: _left,
				width: App.getContent().width()+'px',
				height: App.getContent().height()+'px'
			});
		}
	}

	this.save = function(){
		return {
			color: _color
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

	this.webyBackgroundBeforeResize = function(){
		_el.hide();
	}

	this.webyBackgroundResized = function () {
		_el.show();
		this.render();
		return;

		_el.css({
			width: App.getContent().width()+'px',
			height: App.getContent().height()+'px',
			left: App.getContent().css('marginLeft')
		});
	}
}