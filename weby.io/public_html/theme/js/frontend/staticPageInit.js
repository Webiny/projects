var heightOffset = 125;

$(function () {
    $(window).resize(function () {
        $('#page-content').css({
            height: $(window).height() - heightOffset
        });
    }).resize();

    userLogged = $('[data-role="user-logged-in"]').text();
    if (userLogged != 'false') {
        new WebyDashboard();
        new WebyFavorites();
        new WebyFollowers();
    } else {
        new Authorization();
    }
});
