function WebyTitle() {

	App.addEventListener(this);

	/**
	 * Title action button
	 */
	var _editTitle = $('.header-middle-wrap');

	/**
	 * Title h2
	 */
	var _title = $('[data-role="weby-title"] h2');

	/**
	 * Weby URL
	 */
	var _url = $('[data-role="weby-url"]');

    /**
     * Full URL
     */
    var _fullUrl = $('[data-role="weby-full-url"]');

    /**
     * Embed code
     */
    var _embedCode = $('[data-role="weby-embed-code"]');


	/**
	 * Share button
	 */
	var _share = $('[data-role="weby-title-share"]');

	/**
	 * Calculate title position
	 */
	var _titlePosition = _title.position().left;

	/**
	 * Right part of the header
	 */
	var _headerRight = $('.header-right');

    /**
     * Weby title, tags and description dialog
     */
    if ("WebyTitleDialog" in window) {
        var _dialog = new WebyTitleDialog(this);
    }

	_share.find('span').click(function(){
		$(this).parent().toggleClass('active').find('form').toggle();
	});

	_share.find('.close-form').click(function(){
		$(this).closest('[data-role="weby-title-share"]').toggleClass('active').find('form').toggle();
	});

    _share.find('[data-role="weby-full-url"]').click(function(){
        $(this).select();
    });

    _share.find('[data-role="weby-embed-code"]').click(function(){
        $(this).select();
    });

	this.viewportResize = function (data) {
		var width = _headerRight.position().left - _titlePosition;
		var titleWidth = _title[0].scrollWidth;
		var urlWidth = _url[0].scrollWidth;

		if (width > titleWidth + 40) {
			_title.css('width', titleWidth + 'px');
		} else {
			_title.css('width', (width - 40) + 'px');
		}

		if (width > urlWidth + 35) {
			_url.css('width', urlWidth + 'px');
		} else {
			_url.css('width', (width - 35) + 'px');
		}
	}

    this.getDialog = function() {
        return _dialog;
    }

    this.setTitle = function(value) {
        _title.text(value);
		return this;
    }

    this.setUrl = function(value) {
        _url.html('<a target="_blank" href="' + value + '">' + value + '</a>');
		return this;
    }

    this.setFullUrl = function(value) {
        _fullUrl.val(value);
		this.viewportResize();
		return this;
    }

    this.setEmbedCode = function() {
        _embedCode.val('<div class="weby-embed" data-weby="' + App.getWeby().getPublicUrl() + '" ' +
            'data-width="400" data-height="400"></div><script async src="' + WEB + 'embed.js" charset="utf-8"></script>');
    }

	this.viewportResize();

    this.webyLoaded = function() {
        this.setEmbedCode();
    }

	this.webyBackgroundResized = function(){
		this.viewportResize();
	}

	this.viewportResize();
}
