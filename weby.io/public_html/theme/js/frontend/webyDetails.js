function WebyDetails() {

    var _webyDetails = $('#weby-details');
    var _showFullDetails = $('[data-role="show-full-details"]');
    var _followButton = $('[data-role="follow-user"]');
    var _flipDetailsButton = $('[data-role="flip-weby-details"]');
    var _favoritedBy = $('.favorited-by');
    var _webyUser = $('[data-role="weby-user"]');
    var _processingFavorites = false;
    var _processingFollowing = false;

    var _addToFavoritesButton = $('[data-role="add-to-favorites"]');
    var _favoritesAddMsg = 'Add to favorites';
    var _favoritesRemoveMsg = 'Remove from favorites';

    var _bottomTooltips = _webyDetails.kendoTooltip({
        filter: ".has-tooltip-bottom",
        position: 'bottom',
        content: function (e) {
            var target = e.target; // the element for which the tooltip is shown
            return target.attr('data-tooltip'); // set the element text as content of the tooltip
        },
        animation: {
            open: {
                effects: "fade:in",
                duration: 100
            }
        }
    }).data("kendoTooltip");

    var _topTooltips = _webyDetails.kendoTooltip({
        filter: ".has-tooltip-top",
        position: 'top',
        content: function (e) {
            var target = e.target; // the element for which the tooltip is shown
            return target.attr('data-tooltip'); // set the element text as content of the tooltip
        },
        animation: {
            open: {
                effects: "fade:in",
                duration: 100
            }
        }
    }).data("kendoTooltip");

    _followButton.on('click', function () {
        if (_processingFollowing) {
            return false;
        }
        _processingFollowing = true;
        $.ajax({
            url: WEB + 'tools/follow/' + _followButton.attr('data-id'),
            beforeSend: function () {
                _webyDetails.find('.loading-following').show();
            },
            success: function (r) {
                _followButton.toggleClass('follow-btn').toggleClass('unfollow-btn');
                if (_followButton.hasClass('follow-btn')) {
                    _followButton.text('Follow');
                } else {
                    _followButton.text('Unfollow');
                }
                var followersCount = typeof r.data.followersCount == 'undefined' ? 0 : r.data.followersCount;
                _webyDetails.find('.followers-count').text(followersCount);
                _webyDetails.find('.loading-following').hide();
                _processingFollowing = false;
            }
        })
    });

    _flipDetailsButton.on('click', function () {
        _webyDetails.flip({
            duration: 100,
            contentBehind: $('.tags'),
            onFlip: function () {
                _flipDetailsButton.toggleClass('back');
            }
        });
    });

    _addToFavoritesButton.on('click', function () {
        if (_processingFavorites) {
            return false;
        }

        if (!App.userLoggedIn()) {
            return new Authorization(true);
        }
        
        _processingFavorites = true;
        $.ajax({
            url: WEB + 'tools/favorite/' + App.getWeby().getId(),
            beforeSend: function () {
                _addToFavoritesButton.addClass('favorites-working');
                _webyDetails.find('.loading-favorites').show();
            },
            success: function (r) {
                _addToFavoritesButton.removeClass('favorites-working');
                _webyDetails.find('.loading-favorites').hide();
                _addToFavoritesButton.toggleClass('added');

                // Change tooltip
                var tooltipMsg = _addToFavoritesButton.attr('data-tooltip') == _favoritesAddMsg ? _favoritesRemoveMsg : _favoritesAddMsg;
                _addToFavoritesButton.attr('data-tooltip', tooltipMsg);

                _bottomTooltips.refresh();

                // Update count of favorites
                var favoritesCount = typeof r.data.favoritesCount == 'undefined' ? 0 : r.data.favoritesCount;
                _webyDetails.find('.favorites-count').text(favoritesCount);

                // Append new list of users
                if (favoritesCount == 0) {
                    _favoritedBy.hide().find('ul').empty();
                } else {
                    _favoritedBy.find('ul').empty();
                    for (var i in r.data.favoritedBy) {
                        var tpl = $('script#user-favorited').html();
                        tpl = tpl.replace('{avatarUrl}', r.data.favoritedBy[i].avatarUrl);
                        tpl = tpl.replace('{username}', r.data.favoritedBy[i].username);
                        tpl = tpl.replace('{userUrl}', WEB + r.data.favoritedBy[i].username);
                        _favoritedBy.find('ul').append(tpl);
                    }
                    _favoritedBy.show();
                }

                App.getFavorites().refreshDataSource();
                _processingFavorites = false;

            }
        })
    });

    _webyUser.hover(function() {
        _topTooltips.show(_webyUser);
    });
    _webyUser.mouseout(function() {
        _topTooltips.hide(_webyUser);
    });

    _showFullDetails.click(function () {
        if (_showFullDetails.hasClass('shown')) {
            $('.full-weby-data').slideUp(300);
            _showFullDetails.removeClass('shown')
        } else {
            $('.full-weby-data').slideDown(300);
            _showFullDetails.addClass('shown')
        }
    });

	$('#weby-details').draggable({
		containment: [0, 98],
        start: $(this).addClass('dragging'),
        stop: $(this).removeClass('dragging')
	});
}
