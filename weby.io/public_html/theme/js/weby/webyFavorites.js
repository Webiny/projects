function FavoritesLoading() {
    var _el = $('#favorites-dialog .dialog-loading');
    var _initialMessage = 'Loading Favorites...';

    this.show = function () {
        _el.css("display", "block");
        return this;
    }

    this.hide = function () {
        _el.hide();
        return this;
    }

    this.setMessage = function (message) {
        _el.find('.text').html(message);
        return this;
    }

    this.setMessage(_initialMessage);
}

function WebyFavorites(modal) {

    var $this = this;
    var _currentWebyId = '';
    var _dialog = $("#favorites-dialog");
    var _deleteDialog = $('.delete-confirmation');
    var _loading = new FavoritesLoading();
    var _template = kendo.template($('#favorites-list-item-tpl').html());

    var _modal = typeof modal == "undefined" ? false : true;

    /**
     * Load data into DataSource
     * @type {kendo.data.DataSource}
     */
    var favoritesDataSource = new kendo.data.DataSource({
        type: "odata",
        serverPaging: true,
        pageSize: 3,
        transport: {
            read: {
                url: WEB + 'tools/favorites',
                contentType: "application/json; charset=utf-8",
                type: "GET",
                dataType: "jsonp"
            },
            destroy: {
                url: function () {
                    return WEB + 'tools/favorite/' + _currentWebyId + '/'
                },
                dataType: "json",
                type: "POST"
            }
        },
        schema: {
            model: kendo.data.Model.define({
                id: "id"
            }),
            data: function (response) {
                return response.favorites;
            },
            total: function (response) {
                return response.count;
            }
        },
        sync: function () {
            TimePassed.parse();
        },
        requestStart: function (e) {
            _loading.show();
        },
        requestEnd: function (e) {
            if (!e.response.user) {
                window.location = WEB;
            }
            _loading.hide().setMessage("Loading favorites...")
            if (e.type == "read" && e.response.count == 0) {
                _dialog.find(".empty-list").show();
                _dialog.find("h1").hide();
                _dialog.find(".favorites-pager").hide();
            } else {
                _dialog.find(".empty-list").hide();
                _dialog.find("h1").show();
                _dialog.find(".favorites-pager").show();
            }
            if (e.type == "destroy") {
                if (this.data().length == 0) {
                    var curPage = this.page();
                    if (curPage > 1) {
                        this.page(--curPage);
                    } else {
                        _dialog.find(".empty-list").show();
                        _dialog.find("h1").hide();
                        _dialog.find(".favorites-pager").hide();
                    }
                } else {
                    this.read();
                }
            }
        }
    });

    /**
     * Returns data source
     * @returns {kendo.data.DataSource}
     */
    this.refreshDataSource = function () {
        favoritesDataSource.read();
        favoritesDataSource.sync();
    }

    _dialog.find('.favorites-pager').kendoPager({
        dataSource: favoritesDataSource,
        buttonCount: 10,
        info: false
    });

    _dialog.find('.favorites-list').kendoListView({
        dataSource: favoritesDataSource,
        template: _template,
        dataBound: function (e) {
            TimePassed.parse();
        }
    });

    _deleteDialog.find('[data-role="fav-btn-cancel"]').click(function () {
        _deleteDialog.hide();
    });

    _deleteDialog.find('[data-role="fav-btn-delete"]').click(function () {
        _deleteDialog.hide();
        favoritesDataSource.remove(favoritesDataSource.get(_currentWebyId));
        _loading.setMessage("Removing Weby...");
        favoritesDataSource.sync();
    });

    $('.favorites-list').on('click', '.button.delete', function () {
        var item = $(this).closest('.favorites-list-item');
        _currentWebyId = item.attr("data-id");
        _deleteDialog.show();
    });

    // Bind My favorites
    $('[data-role="favorites-dialog-open"]').click(function (e) {
        e.preventDefault();
        $this.open(_modal);
    });

    this.open = function (modal) {
        $.fancybox($('#favorites-dialog'), {
            modal: modal,
            type: 'inline',
            width: 772,
            height: 456,
            autoSize: false
        });
        TimePassed.parse();
    }
}