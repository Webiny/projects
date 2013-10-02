/** This is an Editor bootstrap process */

function formatNumber(number) {
    if (number >= 1000000) {
        return '' + Math.round((number * 10) / 1000000) / 10 + 'M';
    }
    if (number >= 1000) {
        return '' + Math.round((number * 10) / 1000) / 10 + 'K';
    }

    return number;
}

var weby = null;
var data = null;

$(function () {
    // Load config data
    weby = JSON.parse($('[data-role="weby"]').html());
    data = JSON.parse($('[data-role="json-data"]').html());

    // Add and fill weby details field
    var webyDetails = new kendo.template($('#weby-details-tpl').html());
    $('#weby-details-tpl').remove();

    var webiesSearch = $('#search-webies-tpl').html();
    $('#search-webies-tpl').remove();

    // Used for Webies searcher
    searchUrl = $('[data-role="weby-searcher"]').text();

    var userMenu = new kendo.template($('#webies-user-menu-tpl').html());
    $('#webies-user-menu').remove();

    var aurhorizeButton = $('#weby-authorize-tpl').html();
    $('#weby-authorize-tpl').remove();

    $('body').append(webyDetails(data));

    new WebyDetails();

    // Now fill social counters data
    $('[data-role="facebook-share"] .social-counter').text(formatNumber(data.shareCount.facebook));
    $('[data-role="twitter-share"] .social-counter').text(formatNumber(data.shareCount.twitter));
    $('[data-role="gplus-share"] .social-counter').text(formatNumber(data.shareCount.google));

    // Now render properly header interface, we check which interface was cached
    // First, if 'user-not-logged' version was cached
    if ($('[data-role="authorize"]').length) {
        // Now, if we have valid user, we insert missing elements else we leave everything intact
        if (data.currentUser) {
            $('.register-btn').remove();
            $('.header-right ul:first').prepend(webiesSearch);
            new WebySearchClass();
            $('#webies-header-search-results').remove();
            $('.header-right ul:first').append(userMenu(data.currentUser));
        } else {
            new Authorization(true);
        }
    } else {
        // If there is no authorize button, then that means we have 'user-logged' cached version
        if (data.currentUser) {
            $('li.dropdown .user-photo').css({
                                            backgroundImage: 'url(' + data.currentUser.avatar + ')',
                                            backgroundPosition: 'top left'});
            $('li.dropdown .username').text(data.currentUser.name);
        } else {
            $('.search-btn').remove();
            $('.my-webies').remove();
            $('li.dropdown').remove();
            $('.header-right ul:first').append(aurhorizeButton);
            new Authorization(true);
        }
    }

    $('.bootstrap').remove();


    $(function () {
        App = new AppClass();
        App.init();
    });
});
