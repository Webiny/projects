function Weby() {

    var _FF = !(window.mozInnerScreenX == null);

    /**
     * Content background
     */
    var _background = null;

    if (!App.noHeader()) {
        var _webyTitle = new WebyTitle();
    }

    /**
     * Document background
     */
    var _documentBackground = null;

    /**
     * Id of current Weby
     * @type {number}
     * @private
     */
    var _webyId = 0;
    var _publicUrl = '';
    var _slug = '';
    var _title = '';

    var _progress = new WebyProgress();

    this.init = function () {

        if (typeof weby != "undefined") {
            _webyId = weby.id;
            _slug = weby.slug;
            _publicUrl = weby.publicUrl;
            _title = weby.title;

        }

        var items = weby.content.length;

        _background = new WebyBackground(weby.settings);
        _documentBackground = new WebyDocumentBackground(weby.settings.document);
        _progress.startLoading();
        if (_background.getImageBackground().getImage() != null) {
            items++;
            _progress.setMessage('Loading background...');
            var img = $('<img src="' + _background.getImageBackground().getImage() + '" width="1" height="1" style="visibility:hidden"/>')
            img.load(function () {
                $(this).remove();
                _progress.next();
                _background.render();ww
                _load(weby.content);
            });
            $('body').append(img);
        } else {
            _background.render();
            _load(weby.content);
        }
        _progress.setSteps(items);
        _documentBackground.render();
    };

    this.getId = function() {
        return _webyId;
    }

    this.getPublicUrl = function() {
        return _publicUrl
    }

    this.getSlug = function() {
        return _slug;
    }

    this.getTitle = function() {
        return _title;
    }

    /**
     * Returns a scrollbar width depending on browser
     */
    this.getScrollBarOffset = function () {
        return 18;
    }

    this.getBackground = function () {
        return _background;
    }

    this.getDocumentBackground = function () {
        return _documentBackground;
    }

    var _load = function (widgets) {

        if (widgets == '') {
            App.fireEvent("weby.loaded");
            _progress.hideProgress();
            return;
        }

        _progress.setMessage('Loading content...');
        var loaded = 0;
        var _checkLoading = function () {
            loaded++;
            _progress.next();
            if (loaded == widgets.length) {
                _progress.setMessage("Done!");
                $('[type="weby/linkWidgetTemplate"]').remove();
                App.fireEvent("weby.loaded");
                _progress.hideProgress();
            }
        }

        for (var i in widgets) {
            var widgetData = widgets[i];
            var widget = new window[widgetData.common["class"]]();
            var html = widget.createFromData(widgetData, parseInt(i) + 1);

            // Bind load events
            if (html.find('.widget-body iframe').length > 0) {
                html.find('iframe').load(_checkLoading);
            } else if (html.find('.widget-body img').length > 0) {
                html.find('img').load(_checkLoading);
            } else {
                _checkLoading();
            }

            // Append to DOM
            App.getContent().append(html);
            if ('onWidgetInserted' in widget) {
                widget.onWidgetInserted();
            }
        }
    }
};
