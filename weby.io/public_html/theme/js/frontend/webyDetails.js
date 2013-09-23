function WebyDetails() {

    var _webyDetails = $('#weby-details');
    var _showFullDetails = $('[data-role="show-full-details"]');
    var _followButton = $('[data-role="follow-user"]');
    var _flipDetailsButton = $('[data-role="flip-weby-details"]');
    var _favoritedBy = $('.favorited-by');


    var _addToFavoritesButton = $('[data-role="add-to-favorites"]');
    var _favoritesAddMsg = '<div style="padding: 5px">Add to favorites</div>';
    var _favoritesRemoveMsg = '<div style="padding: 5px">Remove to favorites</div>';

    var _tooltips = _webyDetails.kendoTooltip({
        filter: ".has-tooltip",
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

    _followButton.on('click', function () {
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

    _addToFavoritesButton.click(function () {
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

                _tooltips.refresh();

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
                        _favoritedBy.find('ul').append(tpl);
                    }
                    _favoritedBy.show();

                }

            }
        })
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

}

$(function () {
    new WebyDetails;
});