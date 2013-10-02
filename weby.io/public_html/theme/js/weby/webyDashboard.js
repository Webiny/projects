function DashboardLoading() {
	var _el = $('#dashboard-dialog .dialog-loading');
	var _initialMessage = 'Loading Webies...';

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

function WebyDashboard() {

	var $this = this;

	var _currentWebyId = '';
	var _dialog = $("#dashboard-dialog");
	var _deleteDialog = $('.delete-confirmation');
	var _loading = new DashboardLoading();
	var _template = kendo.template($('#webies-list-item-tpl').html());

	var webiesDataSource = new kendo.data.DataSource({
		type: "odata",
		serverPaging: true,
		pageSize: 3,
		transport: {
			read: {
				url: WEB + 'tools/webies/',
				contentType: "application/json; charset=utf-8",
				type: "GET",
				dataType: "jsonp"
			},
			destroy: {
				url: function () {
					return WEB + 'tools/delete-weby/' + _currentWebyId + '/'
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
				for (var i in response.webies) {
					if (typeof App == 'undefined') {
						response.webies[i].isEditor = false
					} else {
						response.webies[i].isEditor = App.isEditor();
						response.webies[i].currentWeby = App.getWeby().getId();
					}
				}
				return response.webies;
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
				return;
			}

			_loading.hide().setMessage("Loading Webies...");
			if (e.type == "read" && e.response.count == 0) {
				_dialog.find(".empty-list").show();
				_dialog.find("h1").hide();
				_dialog.find(".webies-pager").hide();
			} else {
				_dialog.find(".empty-list").hide();
				_dialog.find("h1").show();
				_dialog.find(".webies-pager").show();
			}
			if (e.type == "destroy") {
				if (typeof App != 'undefined') {
					if (_currentWebyId == App.getWeby().getId()) {
						window.location = USER_DASHBOARD;
						return;
					}
				}
				if (this.data().length == 0) {
					var curPage = this.page();
					if (curPage > 1) {
						this.page(--curPage);
					} else {
						_dialog.find(".empty-list").show();
						_dialog.find("h1").hide();
						_dialog.find(".webies-pager").hide();
						$this.open(true);
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
		webiesDataSource.read();
		webiesDataSource.sync();
	}

	_dialog.find('.webies-pager').kendoPager({
		dataSource: webiesDataSource,
		buttonCount: 10,
		info: false
	});

	_dialog.find('.webies-list').kendoListView({
		dataSource: webiesDataSource,
		template: _template,
		dataBound: function (e) {
			TimePassed.parse();
		}
	});

	_deleteDialog.find('[data-role="btn-cancel"]').click(function () {
		_deleteDialog.hide();
	});

	_deleteDialog.find('[data-role="btn-delete"]').click(function () {
		_deleteDialog.hide();
		webiesDataSource.remove(webiesDataSource.get(_currentWebyId));
		_loading.setMessage("Removing Weby...");
		webiesDataSource.sync();
	});

	$('.webies-list').on('click', '.button.delete', function () {
		var item = $(this).closest('.webies-list-item');
		_currentWebyId = item.attr("data-id");
		if (typeof App != 'undefined') {
			if (_currentWebyId == App.getWeby().getId()) {
				App.getWeby().disableSave();
			}
		}
		_deleteDialog.show();
	});

	// Bind My Webies
	$('[data-role="dashboard-dialog-open"]').click(function (e) {
		e.preventDefault();
		$this.open();
	});

	this.open = function (modal) {
		if (typeof modal == "undefined") {
			modal = false;
		}

		$.fancybox(_dialog, {
			modal: modal,
			type: 'inline',
			height: 456,
			width: 772,
			autoSize: false
		});
		TimePassed.parse();
	}

	this.close = function () {
		$.fancybox.close();
	}
}