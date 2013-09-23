function FlickerWidget() {

	this._flickerCode = '';
	this._widgetClass = 'flicker-widget';

	this.getHTML = function () {
		this._html = decodeURIComponent(this._flickerCode);
		return BaseWidget.prototype.getHTML.call(this);
	};
}

FlickerWidget.prototype = new BaseWidget();
FlickerWidget.prototype.constructor = FlickerWidget;