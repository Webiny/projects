function LiveClass() {

    var _counter = $('[data-role="counter"]');

    var _getUsersCount = function() {
        $.ajax({
           url: WEB + 'backend/stats/live/users',
            success: function(r) {
                _counter.text(r.data.count);
            }
        });
    }

    _getUsersCount();

    setInterval(function() {
    _getUsersCount();
    }, 3000);

}

$(function () {
    new LiveClass();
});