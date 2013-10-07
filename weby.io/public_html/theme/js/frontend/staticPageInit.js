var heightOffset = 125;

$(function () {
    $(window).resize(function () {
        $('#page-content').css({
            height: $(window).height() - heightOffset
        });
    }).resize();

    userLogged = $('[data-role="user-logged-in"]').text();
    if($.cookies.get('weby_login_ref') != null) {
        $.cookies.set('weby_login_ref', null);
    }

    if (userLogged != 'false') {
        new WebyDashboard();
        new WebyFavorites();
        new WebyFollowers();
    } else {

        new Authorization();
    }
});
