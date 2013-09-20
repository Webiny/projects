function WebyDetails() {

    var _followButton = $('[data-role="follow-user"]');

    _followButton.click(function () {
        $.ajax({
            url: WEB + 'tools/follow/' + _followButton.attr('data-id'),
            success: function () {
                _followButton.toggleClass('follow-btn').toggleClass('unfollow-btn');
                if (_followButton.hasClass('follow-btn')) {
                    _followButton.text('Follow');
                } else {
                    _followButton.text('Unfollow');
                }
            }
        })
    });
}

$(function () {
    new WebyDetails;
});
/*
 $('.favorited-by').animate({deg: 90}, {
 duration: 1000,
 step: function (now) {
 $(this).css({
 transform: 'rotateY(' + now + 'deg)'
 });
 },
 complete: function () {
 $(this).html("Ovo bi trebalo dobro raditi").css({
 transform: 'rotateY(-90deg)'
 });
 }
 })
 .animate({deg: 0}, {
 duration: 1000,
 step: function (now) {
 $(this).css({
 transform: 'rotateY(' + now + 'deg)'
 });
 },
 complete: function () {
 console.log("DONE2");
 }
 })
'-moz-transform':'rotate('+now+'deg)',
    '-webkit-transform':'rotate('+now+'deg)',
    '-o-transform':'rotate('+now+'deg)',
    '-ms-transform':'rotate('+now+'deg)',
    'transform':'rotate('+now+'deg)'
 */
