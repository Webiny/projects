/**
 * Flip things around
 * Author: Webiny Ltd.
 */

$.fn.extend({
    flip: function (options) {

        // Options
        var _duration = typeof options['duration'] == 'undefined' ? 500 : options['duration'];

        // Events
        var _beforeFlip = typeof options['beforeFlip'] == 'undefined' ? function () {} : options['beforeFlip'];
        var _onFlip = typeof options['onFlip'] == 'undefined' ? function () {} : options['onFlip'];
        var _afterFlip = typeof options['afterFlip'] == 'undefined' ? function () {} : options['afterFlip'];

        _beforeFlip();

        $(this).animate({deg: 90}, {
            duration: _duration,
            step: function (now) {
                $(this).css({
                    transform: 'rotateY(' + now + 'deg)'
                });
            },
            complete: function () {
                _onFlip();
                $(this).find('.flip-front').toggle();
                $(this).css({
                    transform: 'rotateY(-90deg)'
                });
                $(this).find('.flip-behind').toggle();
            }
        }).animate({deg: 0}, {
                duration: _duration,
                step: function (now) {
                    $(this).css({
                        transform: 'rotateY(' + now + 'deg)'
                    });
                },
                complete: function () {
                    _afterFlip();
                }
            });
    }
});