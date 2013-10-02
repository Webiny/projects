function WebySave() {
	var _el = $('[data-role="weby-save"]');

	this.setMessage = function (message) {
		_el.find('p').html(message);
		if (_el.find('time.passed').length > 0) {
			jQuery.timeago.settings.refreshMillis = 5000;
			jQuery.timeago.settings.strings.secondaccurate = "just now";
			jQuery.timeago.settings.strings.second = "%d seconds";
			_el.find('time.passed').timeago();
		}
		return this;
	}

	this.show = function () {
		_el.show();
		return this;
	}

	this.hide = function () {
		_el.fadeOut(function () {
			_el.hide();
		});
		return this;
	}

}