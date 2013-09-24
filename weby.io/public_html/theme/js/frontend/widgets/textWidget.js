function TextWidget() {

	this._content = '';
	this._widgetClass = 'text-widget';

	this.getHTML = function () {
		this._html = decodeURIComponent(this._content);
		return BaseWidget.prototype.getHTML.call(this);
	};

	this.onWidgetInserted = function(){
		this.body().css({height: this._height+'px', width: this._width+'px'});
	}
}

TextWidget.prototype = new BaseWidget();
TextWidget.prototype.constructor = TextWidget;