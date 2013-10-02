function Authorization(open) {

    var open = typeof open == 'undefined' ? false : true;

    var _webyDetails = $('[data-role="authorize"]');
    var _authorizationDialog = $('#authorization-dialog');

    _webyDetails.click(function() {
        $.fancybox(_authorizationDialog, {
            type: 'inline',
            autoSize: false,
            width: 350,
            height: 300
        });
        $.cookies.set('weby_login_ref',window.location.href);
    });

    if (open) {
        _webyDetails.click();
    }
}

$(function () {
    new Authorization();
});
