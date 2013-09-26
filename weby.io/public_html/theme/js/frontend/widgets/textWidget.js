function TextWidget() {

	this._content = '';
	this._textAlign = '';
	this._widgetClass = 'text-widget';

	this.getHTML = function () {
		this._html = this._content;
		return BaseWidget.prototype.getHTML.call(this);
	};

	this.onWidgetInserted = function(){
		this.body().css({textAlign: this._textAlign, height: this._height+'px', width: this._width+'px'});
	}
}

TextWidget.prototype = new BaseWidget();
TextWidget.prototype.constructor = TextWidget;