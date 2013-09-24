function Registration() {

    var _webyDetails = $('[data-role=create-weby]');
    var _authorizationDialog = $('#authorization-dialog');

    _webyDetails.click(function() {
        $.fancybox(_authorizationDialog, {
            type: 'inline',
            autoSize: false,
            width: 350,
            height: 300
        });
    });
}

$(function () {
    new Registration;
});
