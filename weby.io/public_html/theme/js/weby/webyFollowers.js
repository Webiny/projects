function FollowersLoading() {
    var _el = $('#followers-dialog .dialog-loading');
    var _initialMessage = 'Loading followers...';

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

function WebyFollowers(modal) {

    var $this = this;
    var _currentWebyId = '';
    var _dialog = $("#followers-dialog");
    var _deleteDialog = $('.delete-confirmation');
    var _loading = new FollowersLoading();
    var _template = kendo.template($('#followers-list-item-tpl').html());

    var _modal = typeof modal == "undefined" ? false : true;

    /**
     * Load data into DataSource
     * @type {kendo.data.DataSource}
     */
    var followersDataSource = new kendo.data.DataSource({
        type: "odata",
        serverPaging: true,
        pageSize: 9,
        transport: {
            read: {
                url: WEB + 'tools/followers',
                contentType: "application/json; charset=utf-8",
                type: "GET",
                dataType: "jsonp"
            },
            destroy: {
                url: function () {
                    return WEB + 'tools/follow/' + _currentWebyId + '/'
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
                return response.followers;
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
            _loading.hide().setMessage("Loading followers...")
            if (e.type == "read" && e.response.count == 0) {
                _dialog.find(".empty-list").show();
                _dialog.find("h1").hide();
                _dialog.find(".followers-pager").hide();
            } else {
                _dialog.find(".empty-list").hide();
                _dialog.find("h1").show();
                _dialog.find(".followers-pager").show();
            }
            if (e.type == "destroy") {
                if (this.data().length == 0) {
                    var curPage = this.page();
                    if (curPage > 1) {
                        this.page(--curPage);
                    } else {
                        _dialog.find(".empty-list").show();
                        _dialog.find("h1").hide();
                        _dialog.find(".followers-pager").hide();
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
        followersDataSource.read();
        followersDataSource.sync();
    }

    _dialog.find('.followers-pager').kendoPager({
        dataSource: followersDataSource,
        buttonCount: 10,
        info: false
    });

    _dialog.find('.followers-list').kendoListView({
        dataSource: followersDataSource,
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
        followersDataSource.remove(followersDataSource.get(_currentWebyId));
        _loading.setMessage("Removing Weby...");
        followersDataSource.sync();
    });

    $('.followers-list').on('click', '.button.delete', function () {
        var item = $(this).closest('.followers-list-item');
        _currentWebyId = item.attr("data-id");
        _deleteDialog.show();
    });

    // Bind My followers
    $('[data-role="followers-dialog-open"]').click(function (e) {
        e.preventDefault();
        $this.open();
    });

    this.open = function (_modal) {
        if (typeof modal == "undefined") {
            modal = false;
        }

        $.fancybox($('#followers-dialog'), {
            modal: modal,
            type: 'inline',
            width: 772,
            height: 456,
            autoSize: false
        });
        TimePassed.parse();
    }
}