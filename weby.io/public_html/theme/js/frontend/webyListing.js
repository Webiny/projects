/** This is listing bootstrap process */

var initialResult = null;
var searchUrl = null;
var searchValue = null;
var searchPage = null;

$(function () {
    // Load config data
    initialResult = $('[data-role="initial-result"]').text();
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
    var _initialResult = JSON.parse(initialResult);
    var _listingTpl = $('script#listing-tpl').html();
    var _currentTplId = false;
    var _listingBoxTpl = $('script#listing-box-tpl').html();
    var _tplHolder = $('.tpl-holder');
    var _search = searchValue;
    var _loading = false;
    var _page = searchPage;
    var _pagination = $('.pagination');

    var boxMap = {
        1: [1, 3, 4, 5, 2, 6, 7, 8, 9],
        2: [1, 4, 3, 5, 6, 2, 8, 9 , 7],
        3: [3, 1, 6, 2, 7, 8, 4, 5, 9],
        4: [1, 6, 5, 2, 3, 8, 9, 4, 7],
        5: [1, 6, 3, 2, 5, 4, 8, 7, 9]
    };

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

    /**
     * Sends ajax - requests more Webies
     * @private
     */
    var _requestMoreWebies = function () {
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
                    if (r.data) {
                        handleSearchResponse(r.data);
                    }
                }
            });
        }
    };

    /**
     * Inserts given response data into screen (takes care of layout positions, animations, generating tpl numbers etc.)
     * @param data
     */
    var handleSearchResponse = function (data) {
        var webies = data.webies;
        _currentTplId = _randomTplNumber(1, 5, _currentTplId);

        var page = _listingTpl.replace('{templateNumber}', _currentTplId);
        page = page.replace('{pageNumber}', _page);
        _tplHolder.append(page);

        _appendSearchResult(webies);

        if (data.length < 9) {
            _loading = true; // Set this to true so we permanently disable sending of ajax requests
            _pagination.html('End of results')
        } else {
            _pagination.html(data.pagination);
            _loading = false;
            _page++;
        }
    }

    /**
     * Appends search results to the page
     * @private
     */
    var _appendSearchResult = function (data) {
        for (var i in data) {
            _insert(i, _currentTplId, data);
        }
        TimePassed.parse();
        _animateResult();

        var scrollValue = _pageContent[0].scrollHeight - 1200;
        _pageContent.animate({ scrollTop: scrollValue }, "slow");
    }

    /**
     * Fades in and rotates given result of Webies
     * @private
     */
    var _animateResult = function () {
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
    }

    /**
     * Inserts content onto users screen (but not visible, it's later then animated)
     * @param i
     * @param tplId
     * @param webies
     * @private
     */
    function _insert(i, tplId, webies) {
        var tmp = _listingBoxTpl;
        var boxNumber = boxMap[tplId][i];

        tmp = tmp.replace(/{boxNumber}/g, boxNumber);
        tmp = tmp.replace('{pageNumber}', _page);
        tmp = tmp.replace('{authorAvatarUrl}', webies[i].avatarUrl);
        tmp = tmp.replace('{authorName}', webies[i].username);
        tmp = tmp.replace('{webyTitle}', webies[i].title);

        tmp = !webies[i].images[_imageDimensionsMap[boxNumber]] ?
            tmp.replace('{screenshot}', webies[i].images[_imageDimensionsMap[boxNumber]]) 
        if (webies[i].images[_imageDimensionsMap[boxNumber]]) {
            tmp = tmp.replace('{screenshot}', webies[i].images[_imageDimensionsMap[boxNumber]]);
        } else {

        }


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
     * Shows initial content that was sent from action in handler
     * @private
     */
    var _showInitialResult = function () {
        handleSearchResponse(_initialResult);
    }

    /**
     * Constructor methods
     */
    _pageContent.scroll(function () {
        if (_pageContent.scrollTop() + _pageContent.height() + 100 > _pageContent[0].scrollHeight) {
            _requestMoreWebies(_search, 1);

        }
    });

    /**
     * Instantly load content (sent from action in handler)
     */
    _showInitialResult();
}

$(function () {
    Listing = new ListingClass;
});
