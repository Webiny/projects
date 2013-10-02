$(function () {
    searchUrl = $('[data-role="weby-searcher"]').text();
});

function WebySearchClass() {
    var _searchInput = $('[data-role="webies-search-field"]');
    var _searchUrl = searchUrl;
    var _searchBtn = $('[data-role="open-search-field"]');
    var _closeSearchBtn = $('[data-role="close-search-field"]');
    var _searchResultTpl = $('script#webies-header-search-result').html();
    var _searchResultsHolder = $('ul.search-results');
    var _searchField = $('#search-field');

    var _defaultImageSrc = 'http://weby.com/theme/images/default/frontend_square.jpg';
    var _screenshotRoot = 'http://weby.com/uploads/webies/';

    var _timer = false;

    var _outputSearchResults = function (data) {
        _searchResultsHolder.empty();
        for (var i in data) {
            var tpl = _searchResultTpl;
            var publicUrl = WEB + data[i].username + '/' + data[i].slug + '/' + data[i].id;
            tpl = tpl.replace(/{webyUrl}/g, publicUrl);
            tpl = tpl.replace('{title}', data[i].title);
            tpl = data[i].screenshot ? tpl.replace('{screenshot}', _screenshotRoot + data[i].screenshot) : tpl.replace('{screenshot}', _defaultImageSrc);
            tpl = tpl.replace('{userList}', WEB + 'user/' + data[i].username);
            tpl = tpl.replace(/{username}/g, data[i].username);
            tpl = tpl.replace('{hitCount}', data[i].hits);
            tpl = tpl.replace('{favoritedCount}', data[i].favorited_count);
            _searchResultsHolder.append(tpl);
        }
        if (data.length > 0) {
            _searchResultsHolder.append('<li class="view-all-results"><a href="' + WEB + 'search/' + _searchInput.val() + '">View all &raquo;</a></li>');
        } else {
            _searchResultsHolder.append('<li class="view-all-results">No Webies found</li>');
        }
    };

    var _searchWebies = function () {
        $.ajax({
            url: _searchUrl + '?search=' + _searchInput.val(),
            success: function (r) {
                if (r) {
                    _outputSearchResults(r);
                }
            }
        })
    }

    var _closeSearchField = function () {
        _searchField.hide();
        _searchInput.val('');
        _searchResultsHolder.empty();
    }


    _searchInput.on('keyup', function (e) {
        var event = e || window.event;
        var charCode = event.which || event.keyCode;
        switch (charCode) {
            case 27: // Esc key
                _closeSearchField();
                break;
        }
    })

    _searchInput.on('input', function (e) {
        if (_searchInput.val().length > 2) {
            clearTimeout(_timer);
            _timer = setTimeout(function () {
                _searchWebies();
            }, 300);
        } else {
            _searchResultsHolder.empty();
        }
    });

    _searchBtn.on('click', function () {
        _searchField.show();
        _searchInput.focus();
    });

    _closeSearchBtn.on('click', function () {
        _closeSearchField();
    });

}

$(function () {
    new WebySearchClass();
});