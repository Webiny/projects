function TextWidget() {

	this._content = '';
	this._widgetClass = 'text-widget';

	this.getHTML = function () {
		this._html = $('<div/>').html(this._content).text();
		return BaseWidget.prototype.getHTML.call(this);
	};

	this.onWidgetInserted = function(){
		this.body().css({height: this._height+'px', width: this._width+'px'});
	}
}

TextWidget.prototype = new BaseWidget();
TextWidget.prototype.constructor = TextWidget;