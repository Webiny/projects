function Authorization(open) {

    var open = typeof open == 'undefined' ? false : true;

    var _authorize = $('[data-role="authorize"]');
    var _authorizationDialog = $('#authorization-dialog');

    _authorize.click(function() {
        $.fancybox(_authorizationDialog, {
            type: 'inline',
            autoSize: false,
            width: 350,
            height: 300
        });
        $.cookies.set('weby_login_ref',window.location.href);
    });

    if (open) {
        _authorize.click();
    }
}

$(function () {
    new Authorization();
});
