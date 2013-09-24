function FlickerWidget() {

	this._flickerCode = '';
	this._widgetClass = 'flicker-widget';

	this.getHTML = function () {
		this._html = $(decodeURIComponent(this._flickerCode)).attr('target', '_blank');
		this._html.find('img').attr('width', this._width).attr('height', this._height);
		return BaseWidget.prototype.getHTML.call(this);
	};
}

FlickerWidget.prototype = new BaseWidget();
FlickerWidget.prototype.constructor = FlickerWidget;