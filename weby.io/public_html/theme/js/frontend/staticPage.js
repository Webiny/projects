var heightOffset = 125;

$(function () {
    $(window).resize(function () {
        $('#page-content').css({
            height: $(window).height() - heightOffset
        });
    }).resize();
});