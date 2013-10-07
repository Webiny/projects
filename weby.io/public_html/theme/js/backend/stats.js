function StatsClass() {

    var _menuLinks = $('a[data-stat]');
    var _grid = $("#grid");
    var _chartWrapper = $('#chart');
    var _chartTitle = $('.chart-title');
    var _periodSelector = $('[data-role="period-selector"]');
    var _childMenuItemsToggler = $('.child-menu-toggler');

    var _currentStat = null;
    var _gridData = null;
    var _chartData = null;

    var _defaultChartOptions = {
        height: 380,
        width: 880,
        legend: {position: 'bottom'},
        pointSize: 5,
        chartArea: {height: 250, width: 780}
    };

    var _eventIdMap = {
        'registered_users': 1,
        'created_webies': 3,
        'widget_general': 100,
        'widget_text': 101,
        'widget_link': 102,
        'widget_video': 103,
        'widget_map': 104,
        'widget_instagram': 105,
        'widget_pinterest': 106,
        'widget_facebook': 107,
        'widget_slideshare': 109,
        'widget_googledrive': 110,
        'widget_skydrive': 111,
        'widget_soundcloud': 112,
        'widget_linkedin': 113,
        'widget_tweet': 114,
        'widget_vine': 115,
        'widget_flickr': 116,
        'widget_googleplus': 117,
        'widget_weby': 118
    };

    /**
     * Generates grid and fills it with data
     * @private
     */
    var _generateGrid = function () {

        $.ajax({
            url: '/backend/stats/ajax-get-stats/',
            method: 'post',
            data: {
                stat: _currentStat.textual,
                period: _periodSelector.val()
            },
            success: function (r) {
                _gridData = typeof r.data.grid == 'undefined' ? null : r.data.grid;
                _chartData = typeof r.data.chart == 'undefined' ? null : r.data.chart;

                _grid.kendoGrid({
                    dataSource: {
                        data: _gridData.rows,
                        pageSize: 10
                    },
                    columns: _gridData.columns,
                    pageable: {
                        refresh: true,
                        pageSizes: true
                    }
                });

                _generateChart();
            }
        });
    };

    /**
     * Requests data from server if needed, and draws chart
     * @private
     */
    var _generateChart = function () {

        if (_chartData != null) {
            _drawChart();
            return;
        }

        // If data wasn't received in the request before, than get data
        $.ajax({
            url: '/backend/stats/ajax-get-' + _periodSelector.val() + '-stats/?stat=' + _currentStat.id,
            success: function (r) {
                _chartData = r.data.chart;
                _drawChart();
            }
        });
    }

    /**
     * Draws chart based on data got from server
     * @private
     */
    var _drawChart = function () {

        if (typeof _chartData != 'undefined') {
            var chartDataTable = new google.visualization.DataTable();
            _createChart(_chartData.type);

            var columns = _chartData.columns;
            var rows = _chartData.rows;
            for (var i in columns) {
                chartDataTable.addColumn(columns[i].type, columns[i].title);
            }

            for (var i in rows) {
                var tmp = [];
                for (var j in rows[i]) {
                    tmp.push(rows[i][j])
                }
                chartDataTable.addRow(tmp);
            }

            _chartTitle.text(_currentStat.label);
            _chart.draw(chartDataTable, _defaultChartOptions);

            _chartData = null;
        } else {
            _chartWrapper.html('<div class="head-bar">No chart data.</div>');
        }

    }

    /**
     * Creates chart by given type
     * @param type
     * @private
     */
    var _createChart = function (type) {
        switch (type) {
            case 'column':
                _createColumnChart();
                break;
            default:
                _createLineChart();
        }
    }

    /**
     * Creates line chart
     * @private
     */
    var _createLineChart = function () {
        _chart = new google.visualization.LineChart(document.getElementById('google-chart'));
    }

    /**
     * Creates bar chart
     * @private
     */
    var _createColumnChart = function () {
        _chart = new google.visualization.ColumnChart(document.getElementById('google-chart'));
    }

    /**
     * PHP's ucfirst method
     * @param str
     * @returns {*}
     * @private
     */
    function _ucfirst(str) {
        str += '';
        var f = str.charAt(0).toUpperCase();
        return f + str.substr(1);
    }

    /**
     * Menu item click binding
     */
    _menuLinks.on('click', function () {
        _currentStat = {
            id: _eventIdMap[$(this).attr('data-stat')],
            textual: $(this).attr('data-stat'),
            label: $(this).text()
        };

        _generateGrid();
    });

    /**
     * Generating chart for new period
     */
    _periodSelector.on('change', function () {

        for (var i in _eventIdMap) {
            if (_currentStat.textual == i) {
                _generateChart();
                return;
            }
        }

        _generateGrid();
    });

    /**
     * Collapsing / uncollapsing menu items
     */
    _childMenuItemsToggler.on('click', function () {
        $(this).find('span').toggleClass('collapse-btn').toggleClass('uncollapse-btn');
        $(this).next('ul').toggle(200);
    });

    /**
     * Initial states
     */
    $('.child-menu').hide();
    $('[data-stat="registered_users"]').click();
}

$(function () {
    new StatsClass();
});