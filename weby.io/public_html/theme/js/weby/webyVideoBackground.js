function WebyVideoBackground(el) {

	var $this = this;
	var _el = el;
	var _video = null;
	var _volume = 0;
	var _player = null;
	var _videoInput = $('[data-role="input-youtube"]');
	var _applyBtn = $('[data-role="btn-youtube-apply"]');
	var _removeBtn = $('[data-role="btn-youtube-remove"]');
	var _errorMessage = $('#cnv-video .error-message');
	var _infoMessage = $('#cnv-video .info-message');
	var _volumeControl = $('[data-role="video-volume-control"]');
	var _volumeSlider = $('[data-role="k-slider-video-volume"]');

	this.setVideo = function (video) {
		_video = video;
		return this;
	}

	this.getPlayer = function () {
		return _player;
	}

	this.hideErrorMessage = function(){
		_errorMessage.hide();
	}

	this.render = function () {
		if (_video == null) {
			_applyBtn.show();
			_removeBtn.hide();
			_infoMessage.hide();
			_volumeControl.hide();
			return;
		} else {
			_videoInput.hide();
			_applyBtn.hide();
			_removeBtn.show();
			_volumeControl.show();
			_kVolumeSlider.value(_volume);
			if(App.getWeby().getBackground().getPatternBackground().getPattern() != null){
				_infoMessage.show().html("If you don't see the video, check your color, pattern and image settings, they may be covering your video.");
			} else {
				_infoMessage.hide();
			}
		}
		_loadYoutubeBackground();
	}

	this.populate = function (data) {
		if (!data) {
			return;
		}
		_video = data.video == "" ? null : data.video;
		_volume = data.volume == "" ? 0 : data.volume;
	}

	this.save = function () {
		return {
			video: _video,
			volume: _volume
		}
	}

	this.webyBackgroundBeforeResize = function () {
		_el.hide();
	}

	this.webyBackgroundResized = function () {
		_el.show();
		var wp = App.getContentWrapper().offset();
		var css = {
			width: (App.getContentWrapper().width() - App.getWeby().getScrollBarOffset()) + 'px',
			height: (App.getContentWrapper().height() - App.getWeby().getScrollBarOffset()) + 'px',
			top: wp.top + 'px',
			left: wp.left + 'px'
		};
		_el.css(css);
		if (_player) {
			$('#player').css(css);
		}
	}

	_videoInput.keydown(function (e) {
		if (e.keyCode == 13) {
			_tryLoadingVideo($(this).val());
		}
	});

	_applyBtn.click(function () {
		_tryLoadingVideo(_videoInput.val());
	});

	var _kVolumeSlider = _volumeSlider.kendoSlider({
		min: 0,
		max: 100,
		showButtons: false,
		tickPlacement: 'none',
		slide: function (e) {
			_volume = e.value;
			_player.setVolume(_volume);
		}
	}).data("kendoSlider");

	_removeBtn.click(function () {
		_applyBtn.show();
		_videoInput.show();
		_removeBtn.hide();
		_infoMessage.hide();
		_el.html('<div id="player"></div>');
		_video = null;
		_volume = 0;
		_volumeControl.hide();
		_kVolumeSlider.value(_volume);
	});

	var _tryLoadingVideo = function (video) {
		_errorMessage.hide().html('');
		var parser = new VideoParser();
		var videoId = parser.parse(video);
		if (videoId && parser.getVideoType() == 'youtube') {
			// @TODO: Check if video exists
			$this.setVideo(videoId).render();
			_applyBtn.hide();
			_removeBtn.show();
			_videoInput.hide();
		} else {
			_videoInput.val('').focus();
			_errorMessage.show().html('Please enter a valid Youtube link!');
		}
	}

	var _loadYoutubeBackground = function () {
		_player = new YT.Player('player', {
			width: App.getContentWrapper().width() - App.getWeby().getScrollBarOffset(),
			height: App.getContentWrapper().height() - App.getWeby().getScrollBarOffset(),
			videoId: _video,
			playerVars: {
				playlist: _video,
				controls: 0,
				showinfo: 0,
				modestbranding: 1,
				wmode: 'transparent'
			},
			events: {
				onReady: function (e) {
					e.target.setVolume(_volume);
					e.target.setLoop(true);
					e.target.playVideo();
					App.fireEvent("video.background.ready");
				}
			}
		});
	};
}