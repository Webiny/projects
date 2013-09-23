function WebyProgress() {

	App.addEventListener(this);

	var _el = null;
	var _progress = null;
	var _steps = 0;
	var _curStep = 0;
	var _stepWidth = 0;

	_el = $('.loading-overlay');
	_progress =  _el.find('.percentage');
	_el.find('.progressbar').show();

	this.startLoading = function () {

	}

	this.setMessage = function (message) {
		_el.find('.progress-message').html(message);
	}

	this.setSteps = function (steps) {
		_steps = steps;
		_stepWidth = Math.round(_el.find('.progressbar').width() * 1000 / _steps) / 1000;
	}

	this.next = function () {
		_curStep++;
		_progress.css({width: _curStep * _stepWidth + 'px'});
	}

	this.hideProgress = function () {
		setTimeout(function(){
			_el.fadeOut('slow', function () {
				$(this).remove();
			});
		}, 500);
	}

	this.viewportResize = function(){
		var viewportWidth = $(window).width();
		var viewportHeight = $(window).height();
		$('.loading-overlay').css({
			height: viewportHeight - 125,
			width: viewportWidth
		});
		$('.loading-title').css({
			top: ($('.loading-overlay').height() / 2 - $('.loading-title').outerHeight(true) / 2) - 10 + 'px',
			left: ($('.loading-overlay').width() / 2 - $('.loading-title').outerWidth(true) / 2) + 'px'
		});
		_stepWidth = Math.round(_el.find('.progressbar').width() * 1000 / _steps) / 1000;
	}

	this.viewportResize();
}