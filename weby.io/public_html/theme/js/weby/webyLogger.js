/* Logging errors and other stuff if needed */

WebyLogger =
{
	errorQueue: '',
	errorCount: 0,
	_logInterval: 1000,
	_errorHandler: WEB + 'tools/log',
	_production: true,

	init: function () {
		this._initErrorObserver();

		if (this._production) {
			setInterval(function () {
				WebyLogger.logErrors();
			}, this._logInterval);
		}
	},

	logErrors: function () {
		if (this.errorCount > 0) {
			var errors = this.errorQueue;
			var navigatorName = this._getBrowserName();

			$.ajax({
				type: 'POST',
				url: this._errorHandler,
				data: {errors: errors, browser: navigatorName},
				success: function (data) {
				}
			});
			this.errorQueue = '';
			this.errorCount = 0;
		}
	},

	_initErrorObserver: function () {
		if(this._production){
			window.onerror = function (msg, url, line) {
				// save error to queue
				var error = [];
				error.push({'message': msg, 'url': url, 'line': line});
				WebyLogger.errorQueue += JSON.stringify(error);
				WebyLogger.errorCount++;
				return true;
			};
		}
	},

	_getBrowserName: function () {
		return navigator.userAgent;
	}
}