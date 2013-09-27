/** This is listing bootstrap process */

var url = null;
var searchValue = null;
var searchPage = null;

$(function () {
    // Load config data
    searchUrl = $('[data-role="search-url"]').text();
    searchValue = $('[data-role="search-value"]').text();
    searchPage = $('[data-role="search-page"]').text();
});

/**
 * Listing Class - handles all actions while listing Webies
 * @constructor
 */
function ListingClass() {

    var _pageContent = $('#page-content');
    var _listingTpl = $('script#listing-tpl').html();
    var _currentTplId = false;
    var _listingBoxTpl = $('script#listing-box-tpl').html();
    var _tplHolder = $('.tpl-holder');
    var _search = searchValue;
    var _loading = false;
    var _page = searchPage;
    var _pagination = $('.pagination');

    var _imageDimensionsMap = {
        1: 'square',
        2: 'square',
        3: 'vertical',
        4: 'square',
        5: 'square',
        6: 'horizontal',
        7: 'horizontal',
        8: 'square',
        9: 'square'
    };

    var _loadMoreWebies = function () {
        if (!_loading) {
            _loading = true;
            var fullSearchUrl = _search != '' ? searchUrl + _search + '/' + _page : searchUrl + _page;
            $.ajax({
                url: fullSearchUrl,
                method: 'post',
                data: {json: true},
                beforeSend: function () {
                    _pagination.text('Loading...')
                },
                success: function (r) {
                    handleSearchResponse(r.data);
                }
            });
        }
    };

    var handleSearchResponse = function (data) {
        if (data) {
            var webies = data.webies;
            var newTplId = _currentTplId = _randomTplNumber(1, 5, _currentTplId);

            var page = _listingTpl.replace('{templateNumber}', newTplId);
            page = page.replace('{pageNumber}', _page);
            _tplHolder.append(page);
            for (var i in webies) {
                _insert(i, webies);
            }

            // Animation goes here
            $('#page' + _page).find('.box').each(function (index) {
                $(this).delay((index + 1) * 100).animate({
                    deg: 10,
                    opacity: 1
                }, {
                    duration: 400,
                    step: function (now, tween) {
                        if (tween.prop == "deg") {
                            $(this).css({
                                transform: 'rotate(' + (-10 + now ) + 'deg)'
                            });
                        } else {
                            $(this).css({
                                opacity: now
                            });
                        }
                    }
                });
            });

            TimePassed.parse();

            if (data.length < 9) {
                _loading = true; // Set this to true so we permanently disable sending of ajax requests
                _pagination.html('End of results')
            } else {
                _pagination.html(data.pagination);
                _loading = false;
                _page++;
            }
        }

    }

    function _insert(i, webies) {
        var tmp = _listingBoxTpl;
        var boxNumber = parseInt(i) + 1;
        tmp = tmp.replace(/{boxNumber}/g, boxNumber);
        tmp = tmp.replace('{pageNumber}', _page);
        tmp = tmp.replace('{authorAvatarUrl}', webies[i].avatarUrl);
        tmp = tmp.replace('{authorName}', webies[i].username);
        tmp = tmp.replace('{webyTitle}', webies[i].title);
        tmp = tmp.replace('{screenshot}', webies[i].images[_imageDimensionsMap[boxNumber]]);
        tmp = tmp.replace(/{userUrl}/g, WEB + 'user/' + webies[i].username);
        tmp = tmp.replace(/{publicUrl}/g, webies[i].publicUrl);
        tmp = tmp.replace('{favoritedCount}', webies[i].favoritedCount);
        tmp = tmp.replace('{hitsCount}', webies[i].hitsCount);
        tmp = $(tmp.replace(/{createdOn}/g, webies[i].createdOn));

        // Append and animate
        tmp.css({
            '-webkit-transform': 'rotate(-20deg)',
            opacity: 0
        });
        $('#page' + _page).append(tmp);
    }

    /**
     * Generates new number
     * @param from
     * @param to
     * @param except (if this number was generated, we try to generate another one)
     * @returns {*}
     * @private
     */
    var _randomTplNumber = function (from, to, except) {
        do {
            var newNumber = Math.floor(Math.random() * (to - from + 1) + from);
        } while (newNumber == except);
        return newNumber;
    }

    /**
     * Constructor methods
     */
    _pageContent.scroll(function () {
        if (_pageContent.scrollTop()+ _pageContent.height() + 100 > _pageContent[0].scrollHeight) {
            _loadMoreWebies(_search, 1);

        }
    });

    /**
     * Instantly load first page for given search
     */
    _loadMoreWebies(_search, _page);
}

$(function () {
    Listing = new ListingClass;
});
